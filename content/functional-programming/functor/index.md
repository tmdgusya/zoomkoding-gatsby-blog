---
emoji:
title: Functor
date: '2023-02-26 15:32:00'
author: Roach
tags: function-programming
categories: function-programming, Kotlin
---

## Functor

**펑터(Functor)** 란 컨테이너 타입의 값을 꺼내서 입력받은 함수를 적용한 후, 
함수의 결괏값을 컨테이너형 타입에 넣어서 반환하는 행위를 선언한 타입클래스를 의미한다.

```kotlin
interface Functor<out A> {
    fun <B> map(f: (A) -> B): Functor<B>
}
```

위와 같이 우리가 인자인 `f` 에 **적용할 함수**를 넘겨주면 컨테이너형 타입의 값에 입력받은 함수의 값을 **적용** 
해서 컨테이너형 타입에 넣어서 반환하게 된다.

### Maybe Functor

Maybe 펑터는 **어떤 값이 있을 수도 있고 없을 수도 있는 컨테이너형 타입**이다. Java 에는 Optional Type 이 존재한다. 

```kotlin
sealed class Maybe<out A>: Functor<A> {
    abstract override fun toString(): String
    abstract override fun <B> map(f: (A) -> B): Maybe<B>
}
```

여기서 왜 sealed class 를 쓰는지 모르겠다면 아래 글을 한번 읽고오길 바란다.
 - https://www.roach-dev.com/math/algebraic_data_type/ 

Maybe 는 Functor 임을 나타내기 위해 Functor Interface 를 extends 한다.  
근데 여기서 map 의 반환타입을 Maybe 로 바꾼 이유는 우리가 Maybe 에 추가할 연산을 체이닝하여 이용할 수 있게 하기 위함이다.   
위에서 설명했듯이 Maybe 는 값이 있거나 없으므로 값이 있음을 나타내는 `Just` 클래스와 없음을 나타내는 `Nothing` 클래스를 만들자.

```kotlin
data class Just<out A>(val value: A): Maybe<A>() {
    override fun <B> map(f: (A) -> B): Maybe<B> = Just(f(value))
}

object Nothing: Maybe<Nothing>() {
    override fun toString(): String = "Nothing"
    override fun <B> map(f: (Nothing) -> B): Maybe<B> = Nothing
}
```

위와 같이 컨테이너 형으로 값이 있음과 없을을 나타내는 건 중요하다. 선행 체인에서 값이 없음으로 
나타낼수 있다는 건 후행 체인에서 이를 핸들링해야 한다는 걸 알려줄 수 있기 때문이다.  
익숙한 Java 의 Optional 체인을 생각해보면 쉽다. 사실 Kotlin 에서는 `Nullable` 이 이미 언어자체의 
스펙에 포함되어 있기때문에 위와 같은 형태를 잘 사용하지는 않는다.

이제 위의 코드를 이용한 코드를 한번 간단하게 적어보자.

```kotlin
fun main() {
    println(Just(10).map { it + 10 }) // "Just(20)"
    println(functor.Nothing.map { a: Int -> a + 10 }) // print Nothing
}
```

### Either

Either 는 Left 또는 Right 타입만 허용하는 **대수적 타입**이다. 우리가 기본적으로 함수를 작성할때 
보통 정상적인 출력값이 존재하고, 비정상적인 리턴값이 존재할때가 있다. 비 정상적인 리턴값에 대해서는 클라이언트에게 
보통 처리를 요구한다. (물론 안하는 경우도 있지만.) Java 의 경우 이런 상황에서 `throws XXException` 을 통해 클라이언트에 
처리를 요구한다.  

Either 는 정상적인 리턴 결과를 `Right` 에 담고, 정상적이지 않는 결과를 `Left` 에 담는다. 

```kotlin
sealed class Either<out L, out R> : Functor<R> {
    abstract override fun <R2> map(f: (R) -> R2): Either<L, R2>
}
```

Either 또한 Functor 를 Extends 하며, 비정상적인 값은 처음부터 `L` 로 고정되야 하므로 위와 같은 형태가 된다.

```kotlin
data class Left<out L>(val value: L): Either<L, kotlin.Nothing>() {
    override fun <R2> map(f: (kotlin.Nothing) -> R2): Either<L, R2> = this
}

data class Right<out R>(val value: R): Either<Nothing, R>() {
    override fun <R2> map(f: (R) -> R2): Either<Nothing, R2> = Right(f(value))
}
```

이제 이걸 활용해서 간단하게 List 에서 원하는 원소의 위치를 찾아주는 `indexOf` 함수를 만들어보자.  
- 값이 있을 경우 인덱스인 Int 를 리턴한다. (정상 케이스)
- 값이 없을 경우 NoSuchElementException 을 리턴한다. (비정상적 케이스)

```kotlin
fun List<Int>.indexOfByF(n: Int): Either<NoSuchElementException, Int> {
    try {
        for (i in this.indices) {
            if (this[i] == n) return Right(i)
        }
    } catch(e: ArrayIndexOutOfBoundsException) {
        Left(NoSuchElementException())
    }
    return Left(NoSuchElementException())
}
```

간단하게 짜보면 위와 같은 코드가 나오게 된다. Left 에는 비정상적인 값인 `NosuchElementException` 을 
담아주었고, 오른쪽에는 정상적인 값인 `Int` 값을 담아주었다.

```kotlin
fun main() {
    val list = listOf<Int>(1,2,3,4,5,6,7)
    println(list.indexOfByF(10).map { it / 2 }) // Left(value=java.util.NoSuchElementException)
    println(list.indexOfByF(2).map { it * 2 }) // Right(value=2)
}
```

위와 같이 값을 `map` 연산을 진행해도 Left 는 이미 고정되어 있으므로 정상적인 값에서만 연산이 진행되는걸 확인할 수 있다. 

## Functor 의 법칙

펑터가 되기위해서는 아래 두가지 법칙을 만족해야 한다. 

1. 항등함수(identity function) 에 펑터를 통해서 매핑하면, **반환되는 펑터는 원래의 펑터**와 같다.
2. 두 함수를 합성한 함수의 매핑은 각 함수를 매핑한 결과를 합성한 것과 같다.

항등함수는 쉽게 $$X->X$$ 인 경우를 떠올리면 된다.   
쉽게해보려면 아래와 같은 함수를 만들면 된다.

```kotlin
fun <T> identity(x: T): T = x
```

한번 테스트 해보자.

```kotlin
val result = list.indexOfByF(2).map { it * 2 }
val resultWithIdentityF = result.map { identity(it) }
println(result == resultWithIdentityF)
```

2번 증명까지는 귀찮아서 적지는 않겠지만... 이 글을 읽고 궁금하다면 직접 해보길 바란다.

## 마치며

요즘 함수형 프로그래밍을 공부중인데 **"코틀린으로 배우는 함수형프로그래밍"** 이라는 책이 처음에 대략적으로 
읽기 좋은것 같다. 근데 한번 읽고 좀 더 심화적인 책을 하나 읽어보거나 스터디를 해야할 것 같긴한다.

## 참조

- [코틀린으로 배우는 함수형 프로그래밍](https://www.coupang.com/vp/products/1104861029?itemId=2065869439&vendorItemId=70065060167&src=1042503&spec=10304982&addtag=400&ctag=1104861029&lptag=10304982I2065869439&itime=20230226153147&pageType=PRODUCT&pageValue=1104861029&wPcid=16672949122082466833829&wRef=&wTime=20230226153147&redirect=landing&gclid=Cj0KCQiAgOefBhDgARIsAMhqXA4XTHL4798PLHL_VgKbpl3zvgrOIR5WUkJYjHfGQcIP7GyGq1gYSkIaAotBEALw_wcB&campaignid=18626086777&adgroupid=&isAddedCart=)
