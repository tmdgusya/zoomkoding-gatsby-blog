---
emoji:
title: 대수적 타입과 코틀린 sealed class
date: '2023-02-16 22:35:00'
author: Roach
tags: math
categories: 대수학 Kotlin
---
## 대수적 타입(Algebraic Data Type)

책을 읽다보면 **대수적 타입**이라는 용어가 자주 나온다. 대수적 타입이란 무엇일까?  
설명을 찾아보면 아래와 같다. 

> **"대수적 연산을 통해 다른 타입을 다양한 방법으로 합성하여 생성된 복합적 데이터 타입"**

언제나 그렇듯 말이 참 어렵다. 쉽게 생각하면 어떤 타입들을 합성해서 다른 타입을 만들면 대수적 구조라고 볼 수 있는 것 이다. 
대수적 타입에는 **"곱 타입(Product Type)"** 과 **"합(Sum) Type"** 이 존재한다.  

## 곱(Product) 타입

곱 타입은 서로 다른 유형의 타입을 하나의 값으로 결합한것이다.   
우리가 흔히 만드는 Class 형태가 바로 곱타입이다.

```kotlin
class Person(val name: String, val age: Int)
```

Person 이라는 대수적 타입은 String 이라는 타입과 Int 라는 타입이 **결합(Combine)** 되어 만들어진다. 
즉, Person 이라는 Type 이 가질 수 있는 **데카르트 곱(Cartesian Product)** 은 **String 의 집합 X Int 의 집합** 이 된다.  
그러므로 우리는 아래와 같이 코드를 적을 수 있게 된다.

```kotlin
val person1 = Person("Alice", 30)
val person2 = Person("Bob", 40)
```

좀 더 데카르트 곱을 명확하게 보기 위해서는 아래와 같이 집합을 만들고 서로 다른 타입을 결합해 Pair 를 만드는 코드의 
결과값을 보면 어떤 느낌인지 조금 이해가 올 것이다.

```kotlin
val strings = setOf("foo", "bar", "baz")
val ints = setOf(1, 2, 3)

val product = strings.flatMap { string ->
    ints.map { int ->
        Pair(string, int)
    }
}
```

위 코드를 실행시켰을때 아래와 같은 결과가 나옴을 확인할 수 있다.

```
{("foo", 1), ("foo", 2), ("foo", 3),
 ("bar", 1), ("bar", 2), ("bar", 3),
 ("baz", 1), ("baz", 2), ("baz", 3)}
```

즉, 모든 타입이 `AND` 타입으로 엮여있음을 확인할 수 있다.

### 곱 타입의 순서

곱타입에는 타입의 순서가 있다. 보통 왼쪽일수록 가장 영향을 많이 끼치는 중요한 값을 넣어야 하며, 오른쪽일 수록 덜 영향을 끼치는 값을 넣도록 배치하면 된다. 
또한, **순서를 지키는 것이 중요한게 결국 곱 타입이란 것을 반영할 수 있기 때문**이다. 예를 들면, 아까 코드로 만들어진 Tuple 이 곱타입임을 알 수 있는 이유는
`(String, Int)` 형태로 순서가 고정된 결과만 보아도 알 수 있듯이 말이다.

앞으로 코드 적을때 이런 부분에 좀 더 신경을 써야겠다는 생각을 많이 했다. 그럼 아는 사람이 봤을때 코드로도 좀 더 많은 정보를 표현할 수 있지 않을까 싶다. 

흠, 이렇게 공부하고 나니 코틀린에서 왜 **Position-based-destructuring** 을 처음에 고안했을까도 이해는 간다.  (추측임)  
아닐수도, 사실 작은 클래스에서는 순서 기반으로 구조분해를 해도 큰 문제를 일으키지 않아서 요런 선택을 했을 수도 있다고 본다.

코틀린 측도 요러한 문제를 정리해 놓은 글이 있는데 링크를 한번 첨부해본다. 
- https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#name-based-construction-of-classes

### 상속을 통한 곱 타입의 발전

그럼 Java, Kotlin 과 같은 언어에서 `Circle Class` 와 `Square Class` 를 합쳐 하나의 타입을 만들고 싶다면 어떻게 해야할까?  
이럴때는 상속을 이용하면 된다.

```kotlin
open class Shape(val name: String, val x: Float, val y: Float) 
class Circle(name: String, x: Float, y: Float, val radius: Float): Shape(name, x, y)
class Square(name: String, x: Float, y: Float, val radius: Float): Shape(name, x, y)
```

Shape 를 Circle 과 Square 가 상속하는 계층 구조를 만들어서 단일 타입으로 표현했다. 만약이 상속구조에 
Line 이라는 클래스를 추가해야 한다고 해보자. 하지만 Line 은 `(x, y)` 값이 필요가 없다. 
따라서 코드를 아래와 같이 수정해야만 한다. 

```kotlin
open class Shape(val name: String) 
class Circle(name: String, val x: Float, val y: Float, val radius: Float): Shape(name)
class Square(name: String, val x: Float, val y: Float, val radius: Float): Shape(name)
class Line(name: String, val x1: Float, val y1: Float, val x2: Float, val y2: Float): Shape(name)
```

여기서 곱타입의 단점이 명확하게 보이는데, 곱타입의 구조(Structure) 가 바뀌면 해당 곱타입을 이루는 서브 타입에도 영향을 미칠 수 있게 된다. 
우리가 상속을 이용하면 강한 결합도가 발생하게 되는 이유가 사실 이 이유이기도 하다.

### 상속받은 타입마다 다른 결과를 실행시키고 싶을때

```kotlin
when (Shape) {
    is Circle -> doCircle()
    is Square -> doSquare()
    is Line -> doLine()
    else -> throw IllegalArgumentException()
}
```

코틀린(뭐 다른 언어에서도)에서 곱타입을 이용해서 각 자식 타입마다 특정 블럭을 실행시키고 싶을때 위와 같이 코드를 작성하곤 한다. 
여기서 중요한건 이제 `else` 가 왜 들어가는지 알 수 있는데 **대부분의 곱타입 식의 클래스의 경우 아래와 같은 룰**을 따른다. 

> "해당 타입을 이루는 다른 타입들이 해당 타입 전체를 나타내지 못한다." 

즉, 위 코드만 보면 자신의 코드 내에서는 Shape 는 Circle, Square, Line 일 수 있지만 누군가 이 모듈을 Import 해서 확장하게 된다면 
또 다른 타입이 결합될 수 있는 것이다. 즉, 그러므로 else 가 반드시 필요하게 된다.

### 곱타입의 단점과 장점

#### 장점(Pros)

- 곱타입은 단순히 서로 다른 두 타입을 결합(Combine) 하기만 하면 되므로, 서로 다른 두타입을 결합하는데서는 대부분 문제가 발생하지 않고,
쉽게 결합하는 것이 가능하다.

#### 단점(Cons)

- 위와 같이 대수적 타입의 구조를 바꾸거나, 복잡한 대수적 타입의 결합이 계층적으로 이어지게 되면 유지보수에 어려움을 겪을 수 있다.

## 합(Sum) 타입

합 타입은 TypeScript 를 사용해봤으면 많이들 들어봤을 이야기 이다.

```typescript
const roach : string | null
```

위와 같이 코드를 적게 되면 `roach` 라는 변수에 올수 있는 값은 **string 또는 null** 이다. 즉, 위에서 설명한 
대수적 타입과는 다르게 `and` 로 결합(combine) 되지 않고 `or` 로 결합된다. 따라서 올수 있는 경우의 수도 다음과 같다.

```
{ string 의 모든 가짓수 } + null(1)

string 의 모든 가짓수가 X 라면 X + 1 이 된다.
```

이러한 논리로 우리가 언어에서 흔히 사용하는 것이 `Enum` 이다.

```kotlin
enum class Shape {
    Circle,
    Square,
    Line
    ;
}
```

즉, Shape 라는 타입은 Circle 또는 Square 또는 Line 중 하나의 타입이 된다. 
그러므로 Shape 라는 타입에는 Circle | Square | Line 만 올수 있음을 알 수 있다. 우리가 위에서도 설명했지만 곱타입에서는 일반적으로 이 녀석을 누가 상속받고 있는지 명확하게 판별이 안되기 때문에 누가 올지 알 수 없다. 

여하튼, 그래서 따라오는 재밌는 점은 Shape 라는 타입은 **Circle, Square, Line** 이라는 타입으로 정의가 된다.

이런 장점은 아까와 같은 `when` 과 같은 분기 구문을 사용할때 큰 도움이 된다.

```kotlin
fun doShape(a: Shape) = when (a) {
    Shape.Circle -> { }
    Shape.Square -> { }
    Shape.Line -> { }
}
```

위에서 설명했듯이 특정 타입들의 합이 전체를 나타낼 수 있으므로 `else` 는 필요없게 된다.

### Kotlin 의 sealed class

코틀린에서는 이를 `Enum` 말고도 `sealed(밀봉된) class` 로도 합 타입이 가능하게 한다.  
즉, 코틀린에서 `sealed class` 를 쓸때는 대부분 합타입을 구성할때라는 것이다.

아까의 Shape 를 **sealed class** 로 표현하게 해보자.

```kotlin
sealed class Shape(val name: String, val x: Float, val y: Float) 
class Circle(name: String, val x: Float, val y: Float, val radius: Float): Shape(name)
class Square(name: String, val x: Float, val y: Float, val radius: Float): Shape(name)
class Line(name: String, val x1: Float, val y1: Float, val x2: Float, val y2: Float): Shape(name)
```

코틀린의 sealed class 는 sum type 을 유지해야 하므로 같은 패키지의 자식 클래스만 상속 가능 등등의 제약이 존재한다.  
여하튼 위와 같이 합 타입으로 바꿔주게 되면 이제 아까의 `else` 를 지울 수 있게 된다.

```kotlin
fun doShape(a: Shape) = when (a) {
    is Circle -> { }
    is Square -> { }
    is Line -> { }
}
```

## 끝마치며

스터디에서 나온 내용이라 파고들면서 조금 공부해봤는데 확실히(?) 짚고 넘어가니 이제 sealed class 는 어쩔때 써요? 
라고 물어보면 어느정도 대답할 수 있을것 같다. 언어가 이렇게 설계되는데는 생각보다 수학적요소가 많이 개입되어 있다는 것들도 요즘들어 많이 알게 되어서 
좋은 것 같다. 이전과는 다르게 수학 공부의 필요성을 절실히 느끼고 있다.


