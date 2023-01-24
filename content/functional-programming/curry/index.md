---
emoji: 
title: Curry 와 Partial-Application 
date: '2023-01-24 19:00:00'
author: Roach
tags: function-programming
categories: function-programming, kotlin
---

# Curry 와 Partial-Application 

최근 자바에서 코틀린으로 라는 책을 읽다가 책에서 부분적용(Partial-Application) 으로 리팩토링 하는 방법에 대해서 보았다. 부분적용에 관한 내용을 찾다가 Currying 와 부분적용의 차이에 대해 스터디 사람들과 토의하다가 좀 더 명확하게 정리된것 같아 글로적어보려고 한다.

## Currying

Currying 란 무엇일까? WikePedia 에 있는 설명에 의하면 아래와 같다.

> 커링(Currying) 은 여려개의 인자를 받고 있는 함수의 평가를 각각의 단일인자로 받는 함수들의 시퀀스로 평가될 수 있도록 변환하는 방법이다.

말이 어려운데 위키피디아에 나와있는 예시를 한번 다같이 보도록 하자.

```
let x = f(a, b, c)

// x 는 아래 코드와 동일한 값을 제공한다.

let h = g(a)
let i = h(b)
let x = i(c)

let x = g(a)(b)(c)
```

x 안에서 저런 일들이 일어나고 있다면, 당연하게 `g(a)(b)(c)` 로 해석될 수 있다는 것을 알것이다.

## 구현(Implements)

위의 내용은 추상적이니 코틀린에서 이를 구현해보도록 하자.  
쉬운 예시로 두개의 Int 인자를 받아 무언갈 하는 함수를 만든다고 해보자.

```kotlin
fun applyAWithB(f: (a: Int, b:Int) -> Int): (Int) -> (Int) -> Int {
    fun applyA(a: Int): (Int) -> Int {
        fun applyB(b: Int): Int {
            return f(a, b)
        }

        return ::applyB
    }

    return ::applyA
}
```

위와 같이 만들고 나면 아래와 같이 사용가능하다.

```kotlin
val sum = { a: Int, b: Int -> a + b}
val mult = { a: Int, b: Int -> a / b }
applyAWithB(sum)(1)(2)
applyAWithB(mult)(1)(2)
```

즉, 커링을 만들어내는 함수 `applyAWithB` 를 통해 sum 이라는 함수를 넘기고 1, 2 라는 인자를 하나씩 넘겨 평가할 수 있도록 한다. 즉, **applyB 에서는 closure 된 `a` 를 활용**하게 된다. 

## 부분적용(Partial-Application)

closure 된다는 점을 활용하면 값을 저장하고 있는 상태로 재활용도 가능한다.  
예를 들어 `1+2` 와 `1+3` 을 해야한다고 해보자.

```kotlin
applyAWithB(sum)(1)(2)
applyAWithB(sum)(1)(3)
```

위 처럼 적을 수도 있지만, 아래처럼 1 이라는 값을 클로저에 포함시켜 활용도 가능하다.

```kotlin
val plusOne = applyAWithB(sum)(1)
val result1 = plusOne(2)
val result2 = plusOne(3)
```

즉, **부분적용(Partial-Application)** 이란, 일반적으로 **함수의 첫번째 인자를 고정시키면 남은 나머지 인자에 대한 함수를 얻을 수 있음**을 뜻한다. 위의 코드를 예시로 들면 우리는 **a = 1 로 고정**된 `applyB(1)` 함수를 얻은 것 이다.

## Kotlin Scope 함수(부가내용)

Kotlin Scope 함수 또한 **Closure** 를 이용한다. 즉, let 을 통해 받은 인자는 해당 Scope 내에서 Closure 되어 이용할 수 있도록 해준다. 따라서, 아래와 같은 코드로 이용가능하다.

```kotlin
val a = 1
val sumWithA = a.let(curriedFunc)
val result = sumWithA(2)
println(result)
```

중요한건 `let` 안에서 받은 `a` 는 Closure 된 값이기 때문에 해당 Scope 내에서 변경이 불가능 하다는 점이다. 그래서 a 가 nullable 타입일 경우에 `a?.let(some)` 과 같은 함수를 사용할때도 `some` 안에서는 `a` 를 None-Null 타입으로 이용가능한 것이다.

let 도 결국 Java 와 같은 곳에서는 아래와 유사한 함수이다. (오랜만에 Java 적으려니 문법이 잘 기억안나서 아래와 같이 적었다..)

```java
public static R let(obj: T, block: (T) -> R) {
    // do something
}
```

즉, 위와 같은 함수도 결국 아래와 같이 Currying 이 가능하다.

```kotlin
fun <T : Any, R : Any> curriedLet(obj: T): ((T) -> R) -> R {
    fun executeBlockWithObj(block: (T) -> R): R {
        return block(obj)
    }

    return ::executeBlockWithObj
}

```

Currying 이 가능하니 부분적용 또한 가능할 것이다.

```kotlin
val applyBlockWithOne = curriedLet<Int, (Int) -> Int>(1)
applyBlockWithOne(curriedFunc)
```