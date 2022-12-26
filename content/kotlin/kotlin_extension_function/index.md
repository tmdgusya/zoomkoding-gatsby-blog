---
emoji: 
title: 코틀린의 확장 기능
date: '2022-12-27 00:56:00'
author: Roach
tags: kotlin
categories: kotlin
---

# 코틀린 확장 기능

코틀린에는 기존 Type 의 연산을 쉽게 확장할수 있도록 **확장(Extensions) 기능**을 제공합니다.  
기존 객체지향 시스템에서는 객체의 연산을 확장해야 할때 주로 고려했던 방법으로는 **상속** 이 있거나 **합성**을 활용한 **데코레이터 패턴(Decorator Pattern)** 이 있습니다.

<img width="987" alt="image" src="https://user-images.githubusercontent.com/57784077/209562510-c850d449-ea1b-440c-aa23-f63b5bb8167d.png">

[출저: 리팩터링 구루 - 데코레이터](https://refactoring.guru/design-patterns/decorator)

코틀린에서는 위와 같이 연산을 확장(변경)해야 하는 상황에 조금 더 쉽게 확장할 수 있도록 자체적으로 확장 기능을 제공하며, 그 기눙중 하나로 **확장 함수(Extension functions)** 기능을 제공합니다.

## 확장 함수(Extension functions)

확장 함수를 사용하는 방법은 확장하고자 하는 타입을 **수신 객체(receiver type)** 을 접두사(prefix) 로 붙이고 새롭게 확장하고자 하는 기능을 붙여주면 됩니다.

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] 
    this[index1] = this[index2]
    this[index2] = tmp
}
```

이렇게 `MutableList<Int>` 타입에 `swap` 이라는 새로운 기능을 확장이 가능합니다.  
이 메소드는 사용할때 객체에서 제공하는 메소드인 것 처럼 사용이 가능합니다.

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2)
```

이 처럼 기존의 타입시스템에 `.` 을 찍고 우리가 IDE 의 지원을 받아 메소드를 찾을 때 확장함수도 함께 검색결과로 나오므로, 조금더 우리가 만든 확장함수를 쉽게 발견할 수 있습니다. 이를 통하여, 기존에 객체에 현제 프로젝트에 맞는 메소드들을 추가해줄 수 있습니다.

### 확장함수를 통한 기능 확장

저희 팀에서 이용하고 있는 객체들은 가끔씩 `jsonNode` 형태로 변환해야 할때가 있습니다.  
그때마다 `objectMapper` 의 의존성을 주입받고, `valueToTree` 등의 형태로 변환하는 것은 정말 귀찮고, 코드를 복잡하게 만듭니다. 따라서, 공통적으로 오브젝트를 받아서 Json 형태로 받는 기능을 만들고 싶습니다.  

Java 였다면 어떻게 됬을까요? 아마도 `JsonNodeUtils` 또는 `JsonNodes` 클래스를 만든 뒤, 내부에 `public static JsonNode from(Object obj)` 과 같은 메소드를 추가했을 것입니다.

```java
class JsonNodeUtils {
    public static JsonNode from(Object obj) {
        // do something
    }
}
```

이렇게 Util 클래스로 기능을 추가하게 되는 경우 아래와 같은 단점이 존재합니다.

-  JsonNodeUtils 라는 클래스의 존재를 알지 못하는 사람이 Object 를 JsonNode 형태로 바꾸게 된다면 **기존과 똑같이 objectMapper 를 주입받고, valueToTree 등을 쓰는 상황이 재발**할 수 있다.

위와 같은 문제로 인해 중복코드가 발생할 수 있는데요. 이는 객체지향의 메세지 시스템을 이용한 확장함수를 이용하면 메소드를 위와 같은 문제의 발생 확률을 낮출 방법으로 구현이 가능합니다. 예를 들면, 아래와 같이 확장함수를 추가하는 것이죠.

```kotlin
fun Any.toJsonNode(): JsonNode {
    return Mapper.obj().valueToTree(this)
}
```

(더 엄격하게 가자면 Any 대신 T: Convertable 등으로 적는게 좋을 것 같기도 하다.) 

이렇게 확장 함수를 추가하게 되면 아래와 같이 우리가 이용하는 클래스 들에서 사용이 가능합니다.

```kotlin
val data = getUserDate()
val json: JsonNode = data.toJsonNode()
```

이렇게 되면 객체를 만들고 JsonNode 객체로 변환해야 될때 **IDE 의 도움을 통해 기존 객체 타입에서 `toJsonNode()` 라는 메소드가 있는 것을 확인**하고, 해당 메소드를 이용해 쉽게 JsonNode 로 변환이 가능하게 됩니다. 따라서 기존처럼 Util 클래스로 분리하는 것에 비교해 조금 더 발견 가능성을 높일 수 있다는 장점이 있습니다. 

### 확장 함수의 단점

확장 함수에는 좋은 장점도 있지만 단점또한 존재하는데요.  
사용하는 입장에서는 객체에 기존처럼 **유용한 Utility 메소드들이 존재하니 마치 해당 Type 에서 기본적으로 제공하는 메소드로 오해할 수 있다는 점**입니다. 이로 인해 현재 프로젝트가 아닌 다른 프로젝트에서 사용하게 될때 확장함수 메소드를 검색하는 문제 등이 발생할 수 있습니다.

또 다른 문제는 **스코프 설정을 제한하지 않을 시 잘못 사용될 경우도 다수 존재**합니다.  
예를 들면, 아래와 같이 어떤 파일내에서 받아온 이메일의 도메인만 파악하기 위해 아래와 같은 확장함수를 만들었다고 해봅시다.

```kotlin
fun String.getDomain(): String {
    return this.split('@')[1]
}
```

이 확장 함수의 문제점은 **이메일 문자열이 아닌 기본 문자열에서도 그대로 동작한다는 것** 입니다.

```kotlin
fun test() {
    "123123123".getDomain() // Error!
}
```

따라서 위와 같은 경우에는 파일 내에서 `getDomain()` 확장 함수를 `private` 접근 제어자로 권한을 축소시키는게 좋습니다. 혹은 기존 처럼 Utils 시스템을 붙이거나 `package email` 의 최상위 함수(Top-Level Function) 으로 두는것이 좋다고 생각됩니다.

```kotlin
package email

fun getDomain(email: String): String {
   return this.split('@')[1] 
}
```

그리고 확장함수는 기본적으로 **객체 자체를 직접 수정하여 변경(확장)하는 것이 아니라 정적으로 바인딩(static binding)** 하는데, 이로 인한 혼선도 빚을 수 있게 됩니다.

```kotlin
open class Shape
class Rectangle: Shape()

fun Shape.getName() = "Shape"
fun Rectangle.getName() = "Rectangle"

fun printClassName(s: Shape) {
    println(s.getName())
}

printClassName(Rectangle())
```

위 결과가 어떻게 출력될거라고 생각되나요? 결과는 `"Shape"` 입니다. 보통은 Rectangle 객체를 넣었으니 `"Rectangle"` 이 나와야 할 것 같지만 아닙니다. 이는, printClassName 의 파라미터인 `s` 가 이미 Shape 이라는 타입으로 선언되어져 있기 때문입니다. 기본적으로 확장함수는 **다형성**을 지니고 있지 않습니다.

## 마치며

확장함수는 내가 코틀린에서 가장 많이 사용하고 좋아하는 기능 중 하나인데요. 하지만 위와 같은 단점들도 존재하니 조금 더 알고 사용했으면 좋은 마음에 정리해보았습니다.