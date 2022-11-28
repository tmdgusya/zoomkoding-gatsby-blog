---
emoji: 
title: 코틀린에서 if 문 다뤄보기
date: '2022-11-29 06:37:00'
author: Roach
tags: kotlin
categories: kotlin
---

# 코틀린의 결

Kotlin 에는 **널 가능성(Nullable) 을 쉽게 다루기 위해 여러가지 문법적 요소 및 Sugar Syntex** 를 제공한다.  
예를 들면 기존에는 `if (object != null) { object.doSomething() }` 등을 실행시켜야 했지만, 코틀린에서는 아래와 같이 작성 하는것도 동일한 동작을 한다.

```kotlin
object?.doSomething()
```

Kotlin 의 결에는 Java 와 같은 언어에서 위와 같은 condition 을 계속해서 if 문에 작성해야 하는 코드를 줄이기 위한 이유도 있다. 
따라서 코틀린을 사용한다면 Kotlin 내부에서 제공하는 문법적 요소나 Sugar Syntex 를 공부해보면 코드 치는 양을 줄이고 가독성을 확보해볼 수 있을 것이다.

## 기존 코드

아래 코드를 한번 보자.  
아래 코드는 name 이 'R(r)' 이라는 단어로 시작하면 print 를 하는 메소드이다.

```kotlin
fun printNameIfStartedWithR(person: Person?) {
    if (person != null && person.name.startsWith('r')) {
        println(person.name)
    }
}
```

보통 다른 언어로 적어도 위와 비슷하게 적힐 것이며 별로 이상해보이지도 않을 뿐더러 가독성도 좋은 편이다. 
이를 한번 Kotlin 의 **Optional Chaining** 을 통해서 리팩터링 해보도록 하자. 

## Optional Chaining

Kotlin 및 Typescript 와 같은 언어에서는 Optional Chaning 스펙을 지원하고 있다. 
현재 참조하려는 객체가 null 일 경우 `?.` 에서 **null 을 리턴**하게 되어 이후 연결 고리(chain) 은 실행시키지 않는 방법이다.  

```kotlin
fun printNameIfStartedWithR(person: Person?) {
    if (person?.name?.startsWith('r') == true) {
        println(person.name)
    }
}
```

뭔가 Chaining 이 많이 들어가고 `condition == true` 를 넣어야 하기 때문에 주관적으로 그렇게 이뻐 보이지는 않지만, 
그래도 코드 상으로는 Context 를 나타내기엔 충분하다.

## Kotlin takeIf

Kotlin 에서 제공하는 `takeIf` 스펙을 써보면 어떨까요? Kotlin 의 takeIf 함수는 아래와 같은 기능을 제공합니다.  

```kotlin
inline fun <T> T.takeIf(predicate: (T) -> Boolean): T?
```

주어진 조건문이 참이면 해당 객체를 Return 하고, 참이 아닐 경우 null 을 리턴해주게 됩니다. 
즉, 아래 **이진(binary) 문법과 같은 역할**을 하게 됩니다. 

```kotlin
return if (person.name != null) {
    person
} else null
```

위 kotlin 식을 takeIf 로 쓰면 아래와 같이 리팩터링이 가능합니다. 

```kotlin
return object?.takeIf { person.name }
```

이제 기본적인 개념은 알았으니 위의 `printNameIfStartedWithR` 을 리팩토링 해봅시다. 

```kotlin
fun printNameIfStartedWithR(person: Person?) {
    person
        ?.takeIf { it.name.startsWith('r') }
        ?.run { println(name) }
}
```

takeIf 를 쓰면 위와 같이 리팩터링이 가능해집니다.  
현재 수신객체(Person)의 name 이 'r' 로 시작하게 되면 `println(name)` 을 실행시켜라 라는 코드입니다.  

takeIf 의 스펙을 알고보면 이해가 읽기에 괜찮은 코드지만, 만약 **takeIf 를 모르게 되면 오히려 제일 위의 코드보다도 가독성이 좋지 않게 됩니다.** 
위와 같은 상황에서는 좋아보이지만, 오히려 가독성을 해치는 경우도 많으니 무분별한 사용을 금지하거나 팀 내에서 해당 스펙을 리뷰를 통해 이해한 뒤 사용하는 것도 나쁘지 않아 보입니다. 