---
emoji: 
title: Java AWS SDK 성능 하락이 될 수 있는 문제
date: '2023-03-30 21:00:00'
author: Roach
tags: aws, java
categories: aws
---

배포에 나가기 전 베타에 나가 있는 로그를 확인하던 와중에 아래 **WARNING** 로그를 발견했다.
> JAXB is unavailable. Will fallback to SDK implementation which may be less performant.If you are using Java 9+, you will need to include javax.xml.bind:jaxb-api as a dependency.

해석해보자면, JAXB 사용이 불가능해 **좀 더 성능이 낮을 수 있는 SDK 구현체로 Fallback 처리 될 것**이다. 라고 나온다. 만약 Java 9 이상의 버전이라면 jaxb 의존성을 추가하라고 한다. 갑자기 이런 메세지가 나오는 것을 보고, 무슨 문제가 있는 건지 싶었다.

로그를 확인해보니 파일 업로드쪽에서 발생하고 있었다. 즉, AWS-S3 로 파일을 전송할때 발생하고 있었던 문제임을 확인할 수 있었고, 정확한 로그 발생 클래스명을 확인하니 aws-java-sdk 의 Base64 Class 쪽에서 발생하고 있었다.

## 문제 파악

문제를 잘 파악하기 위해서는 우리가 알아야 하는 정보를 나열해야 한다. 일단 위 상황에서 파악해야 할 정보는 대략적으로 아래와 같다.

- **현재 기능상에 문제는 없는지?**
- **상대적으로 성능이 좋지 않을 수 있는 구현체, 성능이 좋은 구현체는 무엇인지?**
- **Jaxb 는 무엇이고 왜 추가하라 하는지?**

```java
public enum Base64 {
    ;
    private static final InternalLogApi LOG = InternalLogFactory.getLog(Base64.class);
    private static final Base64Codec codec = new Base64Codec();
    private static final boolean isJaxbAvailable;

    static {
        boolean available;
        try {
            Class.forName("javax.xml.bind.DatatypeConverter");
            available = true;
        } catch (Exception e) {
            available = false;
        }
        if (available) {
            Map<String, String> inconsistentJaxbImpls = new HashMap<String, String>();
            inconsistentJaxbImpls.put("org.apache.ws.jaxme.impl.JAXBContextImpl", "Apache JaxMe");

            try {
                String className = JAXBContext.newInstance().getClass().getName();
                if (inconsistentJaxbImpls.containsKey(className)) {
                    LOG.warn("A JAXB implementation known to produce base64 encodings that are " +
                             "inconsistent with the reference implementation has been detected. The " +
                             "results of the encodeAsString() method may be incorrect. Implementation: " +
                             inconsistentJaxbImpls.get(className));
                }
            } catch (UnsupportedOperationException ignored) {
                available = false;
            } catch (Exception ignored) {
                // ignore
            } catch (NoClassDefFoundError error){
                // ignore
            }
        } else {
            LOG.warn("JAXB is unavailable. Will fallback to SDK implementation which may be less performant." +
                     "If you are using Java 9+, you will need to include javax.xml.bind:jaxb-api as a dependency.");
        }

        isJaxbAvailable = available;
    }
// .... more
```

위의 코드는 해당 코드의 일부를 가져온 것이다. 여기서 static code block 안을 보면, **available 이 false 일 경우** 우리가 마주쳤던 Warning 로그가 나오는 것을 확인할 수 있다.

available 이 false 가 되는 경우는 Reflection 을 통해 `javax.xml.bind.DatatypeConverter` 정상적으로 불러올 수 없을때 available 이 false 가 되게 된다. 따라서 현재 저 로그가 서버에 나온다는 것은, `else` block 이 실행됬으며 available 은 false 였을 것이고, isJaxAvailable 또한 false 가 됬을 것 이다.

일단 여기서 우리가 저 로그를 맞이한 이유를 알게 되었다. 그리고 아래에 bytes 를 받아서 String 으로 encode 하는 함수를 한번 보자.

```java
public static String encodeAsString(byte... bytes) {
    if (bytes == null) {
        return null;
    }
    if (isJaxbAvailable) {
        try {
            return DatatypeConverter.printBase64Binary(bytes);
        } catch (NullPointerException ex) {
            // https://netbeans.org/bugzilla/show_bug.cgi?id=224923
            // https://issues.apache.org/jira/browse/CAMEL-4893

            // Note the converter should eventually be initialized and printBase64Binary should start working again
            LOG.debug("Recovering from JAXB bug: https://netbeans.org/bugzilla/show_bug.cgi?id=224923", ex);
        }
    }

    return bytes.length == 0 ? "" : CodecUtils.toStringDirect(codec.encode(bytes));
}
```

여길 보면 좀 더 명확하게 보이는데 **isJaxbAvailable** 이 True 일때는 **DataTypeConverter** 를 이용하고, 아닐 경우에는 **CodecUtils** 라는 것을 이용한다.

즉, SDK 가 말해준대로라면 성능이 상대적으로 좋은 구현체와 성능이 상대적으로 좋지 않은 구현체는 아래와 같이 갈린다.

- 성능이 상대적으로 좋은 구현체 : **DataTypeConverter**
- 성능이 상대적으로 좋지 않을 수 있는 구현체 : **CodecUtils**

그럼 결국에는 둘다 추상적으로는 같은 기능을 하나 내부 구현체의 차이로 인해 Performance 이슈가 있는 것이므로, 기능의 동작에는 큰 문제가 없음을 알 수 있다. 그럼 도대체 Jaxb 는 무엇이길래 Jaxb 를 추가하라고 하며, 왜 성능상 좋다는 것일까?

## Jaxb 란

Jaxb 란 Java 에서 **XML 을 Java Object 로 맵핑**할 수 있게 도와주는 하나의 도구(tools) 이라고 보면 좋다.

Link: https://javaee.github.io/jaxb-v2/

Jaxb 를 아는 것은 이 글에서 중요하지 않으므로 이에 관한 긴 설명은 하지 않겠다.

## Aws-sdk 에서는 Jaxb 를 어디서 이용하지?

<img width="862" alt="image" src="https://user-images.githubusercontent.com/57784077/228824256-1a987334-afa8-4b6e-9fb8-41dbb07fa676.png">

AWS-SDK 내부에서 S3 Client 에서 Image 를 S3 로 올리는 과정에서 Base64 Class 의 함수를 이용할때 Jaxb 를 이용함을 알 수 있다.

## 성능테스트

```kotlin
class LearningTest : FunSpec({
    test("which is faster?") {
        val codec = Base64Codec()
        // initialize Base64 Class because we have to execute static block code before testing
        Class.forName("com.amazonaws.util.Base64")

        val hello = measureNanoTime { println("Hello") }

        // 1. Base64.encodeAsString
        val usingBase64 = measureNanoTime {
            Base64.encodeAsString(-86, 24, 85, 104, 67, 51, 80, -80, -68, -48, -35, 28, 1, -92, -43, 110)
        }

        // 2. CodecUtils.toStringDirect
        val usingCodeUtils = measureNanoTime {
            CodecUtils.toStringDirect(
                codec.encode(
                    byteArrayOf(
                        -86,
                        24,
                        85,
                        104,
                        67,
                        51,
                        80,
                        -80,
                        -68,
                        -48,
                        -35,
                        28,
                        1,
                        -92,
                        -43,
                        110
                    )
                )
            )
        }


        println("usingBase64: $usingBase64") // 6455000
        println("usingCodeUtils: $usingCodeUtils") // 386000
        println("hello: $hello") // 30417

        // usingBase64 is faster than usingCodeUtils
        usingCodeUtils.shouldBeGreaterThan(usingBase64)
    }
})
```

실제와 동일하게 테스트 해보기 위해 Base64 클래스도 미리 만들었다. 왜냐면 static Block 을 미리 실행시켜서 static 블록 실행에 걸리는 시간이 포함되지 않게 하기 위해서이다.

근데 이상하다. 왜 실제로 **CodeUtils 를 이용한결과가 훨씬 더 빠른지 잘 이해가 안간다.**
궁금해서 바로 이슈를 달아 보았다.

https://github.com/aws/aws-sdk-java/issues/2955

## 결론

AWS-SDK 는 내부적으로 이미지를 올릴때 Jaxb 를 이용함을 알 수 있다. AWS-SDK 문서에 따르면 Jaxb 가 성능이 더 좋으며, CodecUtils 는 아무래도 좋지 않을 수 있다고 한다. 근데 실제로 테스트 해보니 아니다..

