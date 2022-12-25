---
emoji: 
title: 코틀린의 불변 컬렉션은 불변일까?
date: '2022-12-05 20:34:00'
author: Roach
tags: kotlin
categories: kotlin
---


Kotlin 에서는 List 의 하위타입이 MutableList 이다.  
지금까지 List 는 우리가 사용하는 Collection 을 불변으로 보장해줘 라고 생각했는데, 자바에서 코틀린으로 라는 책을 읽다보니 불변성을 항상 보장할 수 없다는 사실을 깨달았다.

## List 타입을 쓴다고 완전한 불변임을 보장할 수 없다.

Kotlin 의 MutableList 는 List 를 확장하고 있다. 즉, List 의 모든 메소드가 들어있으므로 리스코프 치환원칙에 의해 아래와 같은 코드 작성이 가능하다.

```kotlin
fun test(list: List<Int>) {
    println(list)
}

val list = mutableList(1)

test(list)
```

근데 여기서 하나 신기한점이 있다. test 라는 함수안에서 list 는 **컨테이너의 값을 변경하는 오퍼레이션을 사용할 수 없다.** 즉, test 함수의 코드만 봤을때는 저 값이 불변할 것 같이 느껴진 다는 것이다.

근데 만약 외부에서 값이 변경된다면 어떨까?  
한번 아래 코드를 보도록 하자.

```kotlin
fun main() {
    val list = mutableListOf(1, 2, 3)
    thread {
        Thread.sleep(500)
        list[0] = 5
    }
    printFirstElementTwoTime(list)
}

fun printFirstElementTwoTime(list: List<Int>) {
    println("First element: ${list.first()}")
    Thread.sleep(1000)
    println("First element: ${list.first()}")
}
```

이 코드의 `printFirstElementTwoTime` 의 list 는 정말 불변일까? 테스트 해보면 `println()` 을 통해 출력되는 값이 다름을 알 수 있다. 첫번째는 1이 나오고, 1초후에는 5가 나온다.

당연하게도 이유는 **가변 컬렉션의 참조를 가지고 있기 때문에 외부에서는 변경이 가능하기 때문**이다. 여기서 코틀린이 왜 불변 컬렉션을 진짜 불변성을 보장하는 컬렉션으로 만들지 않았는지 궁금할 것이다.

## 불변성을 보장하는 법

Kotlin Collection 의 API 들을 살펴보면 대부분 내부에서 List 를 생성한뒤 값을 복사하여 우리가 실행하고자 하는 함수를 실행시키는 경우가 많다. 예를 들어, Collections 의 map API 를 한번 보자.

```kotlin
public inline fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R> {
    return mapTo(ArrayList<R>(collectionSizeOrDefault(10)), transform)
}

public inline fun <T, R, C : MutableCollection<in R>> Iterable<T>.mapTo(destination: C, transform: (T) -> R): C {
    for (item in this)
        destination.add(transform(item))
    return destination
}

```

여기서 보면 ArrayList 를 하나 만들어서 리턴하고 있는 것을 알 수 있다.  
즉, Java 와는 다르게 참조하고 있는 **원본 객체를 건드리는 것이 아니라 새로운 객체를 만들어서 이용**한다.

## 공유된 컬렉션을 변경하지 말라

책에 나오는 구절 중 하나인데 **"공유된 컬렉션을 변경하지 말라"** 라는 것이다.  
즉, 컬렉션을 공유하게 될 경우 변경 메소드를 아예 사용하지 않거나, 원본 값을 최대한 변경하지 않는 방향으로 가라는 것이다. 

**가변 Collection 을 공유해서 사용하게 되면 코드의 순서를 못바꾸게 될 수도 있다.**  
즉, 함수자체가 외부의 영향에 의존하게 될 수 있다.  
예를 들면, 아래처럼 1번에서 첫번째 Element 를 출력하고있고, 2번라인에서 원본객체의 순서를 바꾸는 경우. 두 함수의 순서를 바꾸게 되면 출력 값 자제가 바뀌게 된다.

```kotlin
fun main() {
    val list = mutableListOf(1, 2, 3)
    val firstEle = getFirstElement(list)
    val reversedEle = reverseList(list)

    println("First element: $firstEle") // 1
    println("Reversed list: $reversedEle") // [3, 2, 1]
}

fun reverseList(list: List<Int>): List<Int> {
    return list.reversed()
}

fun getFirstElement(list: List<Int>): Int {
    return list.first()
}
```

그렇다면 위의 코드를 어떻게 좋게 변경할 수 있을까? 아까 위에서 나온 **"공유된 컬렉션을 변경하지 마라"** 의 규칙을 적용해보자.

변경이 있는 **reverseList** 에 우리가 직접만든 `deepCopy` 메소드를 이용해보자.

```kotlin
fun main() {
    val list = mutableListOf(1, 2, 3)
    val firstEle = getFirstElement(list)
    val reversedEle = reverseList(list)

    println("Reversed list: $reversedEle")
    println("First element: $firstEle")
}

fun reverseList(list: List<Int>): List<Int> {
    val copiedList = list.deepCopy()
    return copiedList.reversed()
}

fun getFirstElement(list: List<Int>): Int {
    return list.first()
}

fun <E> List<E>.deepCopy(): List<E> {
    val list = ArrayList<E>(this.size)
    for (element in this) {
        list.add(element)
    }
    return list
}
```

reverseList 와 getFirstElement 함수를 바꿔서 실행해봐도 결과는 변하지 않는다.  
즉, 가변 컬렉션을 공유하지 않으므로써 값이 최대한 변하지 않음을 보장했고 그 결과 사이드 이펙트를 최대한 줄일 수 있음을 확인했다.

## 끝마치며

자바에서 코틀린으로 책을 읽으면서 느끼는 점도 많은데 앞으로 가변컬렉션을 최대한 복사해서 이용할 수 있도록 코드를 적고 리뷰해야 겠다는 생각이 들었다. 그리고 이 책을 읽은 뒤 이펙티브 코틀린도 좀 꼼꼼히 읽어봐야 겠다는 생각이 들었다.

## 참조

[자바에서 코틀린으로](http://www.yes24.com/Product/Goods/115221699)