---
emoji: 
title: Either
date: '2023-10-23 22:30:00'
author: Roach
tags: function-programming
categories: function-programming, kotlin
---

# Either

우리가 프로그래밍을 하다보면 가끔 **함수 시그니쳐(signiture)**에 예외에 관한 정보가 없는데도 불구하고, 어디선가 전파되어온 예외로 인해 내 어플리케이션 로직에서 문제가 발생하곤 한다. 함수형 프로그래밍에서는 이러한 문제점을 해결하기 위해 대수적 구조체인 Either 를 주로 사용하는 Either 에 관해 알아보도록 하자.

함수형 프로그래밍에서는 주로 큰 아이디어를 찾아 일반화를 시키는 것이 많은데, 사실 예외라는 것도 **예외를 하나의 값**으로 바라보았을때 **"오류처리"** 와 **"복구패턴"** 을 일반화하는 고차함수를 작성할 수 있다.

아래 예시를 한번 같이 보도록하자.

```kotlin
fun plus(x: Int, y: Int): Int {
    return x + y
}
```

이 함수가 가지고 있는 문제점은 무엇일까? 바로 정수의 MAX_VALUE 이상을 더하려는 시도를 할때 **overflow** 로 인해 우리가 예상하지 못한 값을 마주하게 된다.

```kotlin
fun main() {
    println(plus(Int.MAX_VALUE, 3)) // -2147483646
}
```

만든 사람에게는 당연한 상식이지만 사실 쓰는 사람 입장에서는 충분히 overflow 에 대한 생각없이 사용될 수도 있다. 심지어 지금은 이상한 값이 나오지만 아래처럼 **RuntimeException 을 던지게 되면 어떻게 될까?** (아래처럼 해도 충분히 이상한 상황은 발생할 수 있다.)

```kotlin
fun plus(x: Int, y: Int): Int {
    if (x >= Int.MAX_VALUE || y >= Int.MAX_VALUE) throw IllegalArgumentException("These arguments exceed the maximum value of an integer.")
    return x + y
}
```

아마 호출한 지점으로 예외가 전파되어 프로그램이 종료되거나 예기치못한 동작을 야기할 것 이다. 함수형 프로그래밍을 사용한다면 **"참조 투명성"** 을 지키지 못하는 결과를 가지게 되는 것 이다. 따라서 밖에서 만약 예외를 파악했을 경우 `try .. catch` 문을 통해 예외를 처리하는 동작을 작성해야 하는데, 그건 또 다른 복잡도를 야기할 수도 있다. Java 를 사용할때 checked Exception 이 많아지게 되면 생각할것도 많아지고 복잡해지듯이 말이다.

따라서 함수형은 예외를 던지는 대신에 예외값을 전달하고, 컴파일러의 지원을 받아 예외 처리 또한 강제성을 지니게 할 수 있다. 

## Either

```kotlin
sealed class Either<out E, out A> {
    data class Left<out E>(val value: E): Either<E, Nothing>()
    data class Right<out A>(val value: A): Either<Nothing, A>()
}

fun <E, A> Either<E, A>.getOrElse(default: A): A = when (this) {
    is Either.Left -> default
    is Either.Right -> value
}
```
Either 는 위와 같이 본질적으로 값이 2개의 (성공 혹은 실패)를 가진다는 개념을 가지고 있으며 보통 오른쪽(Right) 에 정상값을 넣어 연산을 전개하고, 왼쪽은 실패를 나타내는 값으로 정의된다. 아까의 예시를 한번 다시 가져와보자.

```kotlin
fun plus(x: Int, y: Int): Either<String, Int> {
    if (x >= Int.MAX_VALUE || y >= Int.MAX_VALUE) return Either.Left("These arguments exceed the maximum value of an integer.")
    return Either.Right(x + y)
}

```

위와 같이 plus 함수의 예외 부분을 Either 의 Left 값을 가져오거나 예외의 상황에서는 default 값을 가져오도록 만들 수 있다. 

## Map function

만약, 연속적인 Either Chain 이 이어지고 성공적인 값에 연산을 지속적으로 해나가고 싶다면 어떻게 해야할까? 바로 `map` function 을 만들면 된다. 여기서 단순하게 Either 의 경우 성공할 경우만 연산을 해나가면 되므로 아래와 같이 적어볼 수 있다.

```kotlin
fun <E, A, B> Either<E, A>.map(f: (a: A) -> B): Either<E, B> = when (this) {
    is Either.Right -> Either.Right(f(value))
    is Either.Left -> this
}

assert(Either.Right(3).map { it * 2 }.getOrElse(-1) == 6) // true
```

그런데 만약에 map 에 인자로 들어가는 function 이 또다른 `Either<E, B>` 를 생산해내는 함수라면 어떻게 될까? 아마 함수의 인자가 `Either<E, Either<E,B>>` 처럼 복잡해질 것 이다. 이럴때 보통 `flatMap` 을 이용하여 해결하게 된다.

```kotlin
fun <E, A, B> Either<E, A>.flatMap(f: (a: A) -> Either<E, B>): Either<E, B> = when (this) {
    is Either.Right -> f(value)
    is Either.Left -> this
}

fun main() {
    fun plus(a: Int, b: Int): Either<IllegalArgumentException, Int> = when {
        a >= Int.MAX_VALUE -> Either.Left(IllegalArgumentException("a is bigger than the maximum value of an integer"))
        b >= Int.MAX_VALUE -> Either.Left(IllegalArgumentException("b is bigger than the maximum value of an integer"))
        else -> Either.Right(a + b)
    }

    val result = Either.Right(3)
        .flatMap { plus(it, 3) }
        .getOrElse(-1)

    println(result == 6) // true
}
```

누누히 강조하지만 사실 예제 자체가 저렇게 해도 이상한 값을 맞으리라는 보장은 없다. 단순히 Either 설명을 위해 작성한 예시일 뿐이다. Overflow 를 방지할 수 있는 여러가지 예외 케이스들을 전부 추가하여 when 절에 넣으면 방어가 가능할 것이다. 위와 같이 Either 를 리턴하는 함수또한 chain 에 합성하여 이용 가능하므로 확장에도 유리하다.

## 예외 처리

만약 위처럼 연속된 연산에서 예외가 발생하는데 이를 처리하고 싶다면 어떻게 할까? 만약 예외를 처리할 경우 받은 예외가 IllegalArgumentException 이라고 했을때 이를 로깅하는 로직을 작성해야 한다고 해보자.

```kotlin
fun <E, A> Either<E, A>.handle(f: (e: E) -> Unit): Either<E, A> = when (this) {
    is Either.Right -> this
    is Either.Left -> this.also { f(value) }
}
```

위와 같은 방식으로 적어볼 수 있을 것이다. 위 함수를 이용하여 아까의 함수에서 Int.MAX_VALUE 를 인자로 넘기면 어떻게 될까?

```kotlin
fun <E, A> Either<E, A>.handle(f: (e: E) -> Unit): Either<E, A> = when (this) {
    is Either.Right -> this
    is Either.Left -> this.also { f(value) }
}

fun main() {
    fun plus(a: Int, b: Int): Either<IllegalArgumentException, Int> = when {
        a >= Int.MAX_VALUE -> Either.Left(IllegalArgumentException("a is bigger than the maximum value of an integer"))
        b >= Int.MAX_VALUE -> Either.Left(IllegalArgumentException("b is bigger than the maximum value of an integer"))
        else -> Either.Right(a + b)
    }

    val result = Either.Right(3)
        .flatMap { plus(it, Int.MAX_VALUE) }
        .handle { println(it.message) } // b is bigger than the maximum value of an integer
        .getOrElse(-1)

    println(result == -1) // true
}
```

위와 같은 결과를 마주하게 될 것이다. 

## 결론

최근에 함수형 프로그래밍 스터디를 아래 책으로 진행하고 있는데 새로워서 그런지 재밌고 여러가지로 코틀린과 같이 쓰거나 여러 언어들과 같이 쓰면 재밌어 보인다. 특히 함수 시그니쳐로 예외를 컨트롤하게 만든다는 점이 재밌다. 아직 초반이라 예외 처리함수가 그렇게 좋은 예시를 적지 못했지만 책 중 후반부에는 조금 더 좋은 예제를 들고 올 수 있지 않을까 싶다.

[책 구매 링크 - 코틀린 함수형 프로그래밍](https://www.yes24.com/Product/Goods/120236288)

최근 몇 달간 번아웃이 좀 왔어서 공부나 스터디에 잘 참여를 못했는데 이번주 부터 다시 열심히 공부도 스터디도 다시 활동예정..