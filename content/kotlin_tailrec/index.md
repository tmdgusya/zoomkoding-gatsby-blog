---
emoji: 
title: 코틀린 꼬리 재귀 함수
date: '2022-12-22 18:15:00'
author: Roach
tags: kotlin
categories: kotlin
---

# 코틀린 꼬리 재귀 함수

Kotlin 에서는 언어적으로 **꼬리 재귀**를 이용해 재귀를 최적화 해주는 키워드가 존재한다.  
알아보기에 앞서, 꼬리 재귀는 왜 필요한 것일까? 한번 예시코드를 통해 알아보도록 하자.

아래와 같이 **[삼각수](https://ko.wikipedia.org/wiki/%EC%82%BC%EA%B0%81%EC%88%98)** 를 구하는 코드가 있다.

(삼각수를 모른다면 화면을 제일 아래로 내려 하단의 설명을 간단하게 읽고 오길 바란다.)

<img width="233" alt="image" src="https://user-images.githubusercontent.com/57784077/209090699-5de70992-4ff0-40e4-9b78-828c549462ce.png">

사진출처: [위키백과](https://ko.wikipedia.org/wiki/%EC%82%BC%EA%B0%81%EC%88%98)

삼각수에서 n 번째의 **모든 원의 개수(합)** 를 귀납법으로 적으면 단순하게 **$a_n = n + a_{n-1} (n >= 1), (a_0 = 0)$** 이다. 코드로 구현해보면 아래 처럼 구현도 가능하다.
(물론 다른 방식으로도 가능하지만 일단 이 코드로 보자!)

```kotlin
private fun triangular(n: Int): Int = if (n == 0) 0 else n + triangular(n - 1)
```

위 코드는 어떤 문제를 지니고 있을까?  
아마도, 재귀를 많이 짜본사람은 알겠지만 이 코드는 주어진 값(n) 이 커질 수록 쌓이는 스택(Stack) 수가 늘어나서 **StackOverFlow** 오류가 발생하고 만다.

```kotlin
triangular(100_000_000)
```

위 식을 실행시켜 보면 아래와 같은 결과를 마주한다.

```sh
Exception in thread "main" java.lang.StackOverflowError
	at math.TestKt.triangular(Test.kt:5)
	at math.TestKt.triangular(Test.kt:5)
```

재귀 함수를 작성할때 항상 큰 입력(Input)값에 대한 테스트가 수반되어야 하는 이유 중 하나이기도 하다. 일단, 위와 같은 상황을 어떻게 해소할 수 있을까? 결국 Stack 을 만드는 것이 문제이므로, 반복문을 기반으로 하는 코드로 변경하는 방법도 있다.

```kotlin
private fun triangular2(n: Int): Int = (1 .. n).fold(0) { acc, i -> acc + i }
```

위 표기법 또한 가독성이 그리 나쁘지 않고 괜찮다.  
하지만, 코틀린에는 `tailrec` 이라는 꼬리 재귀를 통한 최적화(Optimization) 이 가능하니 `tailrec` 을 이용하는 코드로 한번 변환해보도록 하자.

## 꼬리 재귀(Tail recurision)

우리가 첫번째로 만든 재귀적인 코드가 어떻게 실행될지 한번 생각해 봅시다.  
재귀 프로시저는 결국 **자신 자체를 다시 호출하는 프로시저 구조**입니다. 따라서, 프로시저가 자신을 호출할때 마다 실행 스택을 추가해야 합니다.  

하지만, 재귀 프로시저는 반복 프로시저로도 컴파일 될 수 있습니다.  
코틀린에서도 이러한 기능을 제공하기 위해 `tailrec` 키워드를 제공하여 기존의 재귀 프로시저를 반복 프로시저로 컴파일 될 수 있도록 도와줍니다.

아까 첫번째로 작성한 코드에 `tailrec` 을 붙여봅시다.

```kotlin
private tailrec fun triangular(n: Int): Int = if (n == 0) 0 else n + triangular(n - 1)
```

붙이자마자 IDE 에서 `tailrec` 에 warning 표시를 해주는데요. 사유를 한번 읽어보면 다음과 같습니다.

> A function is marked as tail-recursive but no tail calls are found

쉽게 설명하자면, 위처럼 `n + triangular(n - 1)` 구조로 가게 되면 `n + 재귀함수결과` 이므로 재귀함수의 결과를 반드시 기다려야 하기 때문에 **스택 프레임**을 유지해야만 하므로 큰 수가 들어오게 되면 StackOverFlow 가 반드시 발생하게 됩니다.

그렇다면, IDE 에서 알려주는대로 **꼬리 호출(Tail Call)** 함수로 변경해 보도록 합시다.  
꼬리 호출로 최적화 하기 위해서는 스택 프레임을 유지할 필요가 없도록 코드를 변경해야 합니다. 즉, `n + triangular` 가 아니라, `triangular(acc, n)` 이런식으로 변경되어야 한다는 것이죠.

그래서 코드를 acc(accumulator) 를 이용한 것으로 바꿔보면 아래와 같이 코드가 변하게 됩니다.

```kotlin
private tailrec fun triangular(n: Int, acc: Int = 0): Int = if (n == 0) acc else triangular(n - 1, acc + n)
```

현재 함수를 보면, 최종 호출이 함수로 변경됨으로써 꼬리 호출(Tail Call) 이 가능하게 변했습니다. 이제 이 함수를 아까와 같은 입력값인 1억을 넣어서 테스트 해보도록 합시다.

```kotlin
987459712
```

이제 StackOverFlow 가 발생하지 않고, 함수가 정상적으로 큰수도 받아 들이는 것을 확인할 수 있습니다.

---
> **삼각수**: 정삼각형 모양으로 배열될 수 있는 집합. (1부터 시작되는 연속된 자연수의 합)
> **꼬리호출(TailCall)**: 함수의 종료를 위해 함수의 마지막에서 함수를 호출하는 것. 정의는 어렵지만 위에서 설명한대로 스택 프레임을 유지하지 않기 위한 방식(단, 언어가 Tail Call Optimization 을 지원하는가를 먼져 알아봐야 함)