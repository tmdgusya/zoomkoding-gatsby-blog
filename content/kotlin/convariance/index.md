---
emoji:
title: 코틀린 공변성(Covariance)
date: '2023-02-09 22:30:00'
author: Roach
tags: kotlin
categories: kotlin
---

## 공변성(Covariance) 란 무엇일까?

무언가에 대해서 잘 알기위해서는 항상 그렇듯 어원을 먼져 살펴볼 필요가 있다.  
Covariance 라는 단어는 라틴어로 "covariare" 라는 "함께 달리다" 라는 어원에서 시작됬다.  
확률 통계 이론에서의 **공분산(Covariance) 란 2개 확률변수의 상관정도**를 나타내는데 쓰인다.  

즉, 코틀린에서도 두개의 **"타입간의 상관관계"** 라는 의미에서 **공변성(Covariance)** 으로 이름지었음을 추측해볼 수 있다.  
근데 왜 갑자기 "타입간의 상관관계" 라는 말이 나올까?  
이해하기 위해 일단 **타입간의 상관관계가 없는 경우**를 먼져 살펴보자. 

## 무공변(Invariance)

코틀린의 MutableList 은 기본적으로 **무공변**이다.
무공변이란 타입관의 아무런 상관관계가 없음을 뜻한다. 왜 상관관계가 없는 무공변을 유지하는걸까?  
무공변을 유지하는 이유는 다음과 같다. 만약 아래와 같은 코드가 실행된다면 어떻게 될까?

```kotlin
class Object
class A: Object()
class B: Object()

val listOfA: MutableList<A> = mutableListOf(A(), A())
val listOfObjects: MutableList<Object> = listOfStrings

test("test") {
    listOfObjects.add(B())
}
```

코틀린에서는 이 코드의 실행을 막고 있지만, 만약 이 코드가 실행될 수 있다고 가정해보자.  
실행된다면 `listOfObjects.add(B())` 에서 의도하지 않은 연산이므로 런타임 오류가 발생하게 될 것이다.  

이러한 문제로 인해 `MutableList` 는 객체관의 상관관계가 없는 무공변을 이용한다.

## 공변(Covariance)

공변은 위에서 설명했듯이 두 타입간의 상관관계를 만든다.  
이는 타입 시스템에서 **특정 타입 이 다른 타입의 서브타입이 될 수 있는 특성**을 이용한다.  
공변성은 반대로 **A 가 B 의 서브타입(하위 타입) 일 경우 A 를 B 로 간주할 수 있는 관계를 형성**한다.  
이러한 기법은 왜 쓰는걸까?

만약 콜렉션을 받아서 사용하는 Client 에서는 Object Type 이 오길 바란다고 해보자.  
하지만 우리가 Collection 에 저장하는 타입은 Object Type 의 SubType 인 A Type 이다.

```kotlin
open class Object
class A: Object()
class B: Object()

fun testXX(): List<A> = listOf(A(), A())
val client: List<Object> = testXX()
```

위 처럼 **A 로 구성된 불변 리스트** 를 클라이언트에 넘겨도 아무런 문제가 되지 않는다.  
어차피 A 는 Object 의 특성을 전부 상속받고 있으므로 업캐스팅해서 이용해도 사용하는 측면에서 아무런 문제가 되지 않는다.  
공변성은 이러한 상황일때 많이 이용된다. 

"자바에서 코틀린으로" 라는 책에서 아래와 같은 코드가 나왔었다.  

```kotlin
sealed class Either<out L, out R>

data class Left<out L>(val l: L): Either<L, Nothing>()
data class Right<out R>(val r: R): Either<Nothing, R>()
```

이 코드는 코틀린에서 모든 타입의 하위 타입인 `Nothing` 을 이용한다.  
즉, `out Nothing` 이라는 뜻은 이 자리에 아무런 값도 올수 없다는 뜻을 의미한다.  
따라서 `Left()` 가 의미하는 바는 나는 값을 반드시 `L(왼쪽)` 에만 저장해 라는 것을 타입으로서 나타냈다고 할 수 있다.


## 반공변

반공변은 공변의 반대로 타입의 상하관계가 반대로 작용하는 것을 의미한다.  
즉, Box<Object> 가 Box<A> 의 하위타입이 되는 것이다.  

```kotlin
open class Object

class Box<in V>(private val v: V)
class A: Object()
class B: Object()

var a = Box<A>(A())
a = Box<Object>(Object())
```

즉, 반공변의 타입을 이용하면 위와 같이 사용이 가능하다.  
하지만 반공변성 `in` 의 가장 큰 특징은 해당 `V` 타입으로 값을 받을 순 있지만 내보낼 수는 없다는 것이다.  
즉, 아래와 같은 코드가 컴파일에러를 내뱉는다.  

```kotlin
class Box<in V>(private val v: V) {
    fun get(): V { // compile Error: Type parameter V is declared as 'in' but occurs in 'out' position in type 
        return v
    }
}
```

이 이유는 무엇일까?  
아래 코드를 한번 머리속에서 실행시켜 보자.

```kotlin
open class Comparator<in T>(private val t: T) {
    fun get(): T {
        return t
    }
}

open class Object
class A: Object()

fun test() {
    val obj: Comparator<A> = Comparator<Object>(Object())
}
```

obj 변수에서 `obj.get()` 을 실행시킬 수 있다면 A Type 이 나와야 하지만, 우리는 Object 를 넣었으므로 
실제로는 Object Type 이 나오게 된다. 즉, 사용하는 입장에서 타입을 신뢰할 수 없게 된다. 따라서 반공변의 경우 `in` 으로 제한하여 절대 Return 되지 못하도록 하는 것 이다.
