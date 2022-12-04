---
emoji: 
title: Iterator 와 Generator
date: '2022-11-29 06:37:00'
author: Roach
tags: coroutine
categories: coroutine
---
# Iterator 와 Generator

## 들어가기에 앞서

강의를 찍으려고 했으나 생각보다 너무 글적는것보다 에너지 소모가 커서 기존에 글 적듯이 코루틴 강의를 풀어보려고 합니다.

## Iterator

Iterator 는 주로 프로그래밍 언어에서 **원소(Element) 를 담고 있는 컨테이너(Container) 를 순회**하는데 많이 이용됩니다. 하지만 단순하게 컬렉션을 순회한다고 이해한다면 Iterator 자체를 응용하기 힘듭니다. 예를 들어, 아래 프로그램은 저런 결과가 도출될 수 있을까요?

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)

    for (ele in list) {
        println(ele)
    }
}

결과
1
2
3
4
5
```

혹시 이 결과가 어떻게 도출되는지 아시나요?  
Kotlin 에서 Collection 이 Iterable 을 구현하고 있기 때문입니다. 

```kotlin
private open inner class IteratorImpl : Iterator<E> {
    /** the index of the item that will be returned on the next call to [next]`()` */
    protected var index = 0

    override fun hasNext(): Boolean = index < size

    override fun next(): E {
        if (!hasNext()) throw NoSuchElementException()
        return get(index++)
    }
}
```

프로그램 언어에서는 `for` 문에 적혀진 `ele` 에 `next()` 에서 반환되는 값을 넣어주게 됩니다. 사실상 컴퓨터가 실행시킬때는 아래와 같이 실행하게 되는거죠. (구현하는 방식이 같다는 건 아니고, 추상적인 연산이 비슷하다 정도로 생각해주시면 좋습니다.)

```kotlin
fun <E> forLoop(list: List<E>, block: (ele: E) -> Unit) {
    val iter = list.iterator()
    while (iter.hasNext()) {
        val ele = iter.next()
        block(ele)
    }
}
```

즉, Iterator 란 `next()` 를 통해 특정 값을 리턴하며 `hasNext()` 를 통해 다음으로 순회 가능한지 살펴보는 하나의 자료구조라고 볼 수 있습니다. 즉, **Collections 또한 순회가능한 자료구조다!** 라는 것을 명시하기 위해 Collections 들이 Iterable 을 구현하고 있는 것이죠. 

예를 들면, 1 부터 5까지 출력하는 위의 예제를 굳이 List 와 같은 자료 구조를 사용하지 않고, Iterator 로도 구현이 가능합니다.

```kotlin
val printNumbers = object : Iterable<Int> {
    override fun iterator(): Iterator<Int> {
        return object : Iterator<Int> {
            private var num = 1

            override fun hasNext(): Boolean {
                return num <= 5
            }

            override fun next(): Int {
                return num++
            }

        }
    }
}
```

Iterator 는 위와 같이 `next()` 로 값을 반환하기 때문에 지연리스트로도 활용 가능하다.  
한번 `map() function` 을 만들어 보도록 하자.

```kotlin
fun <E, R> Iterator<E>.map(transform: (E) -> R): Iterator<R> {
    val inner: Iterator<E> = this
    return object : Iterator<R> {

        override fun hasNext(): Boolean {
            return inner.hasNext()
        }

        override fun next(): R {
            return transform(inner.next())
        }
    }
}

fun main() {
    for (ele in printNumbers.map { it * 2 }) {
        println(ele)
    }
}
```

map 또한 iterator 를 만들어서 반환한다.  
즉, `map.next()` 가 호출될때 전체적으로 계산되는 지연평가 구조이다.

### 요약

즉, Iterator 란 우리가 정의한 순회 서브루틴을 순회가 가능할때까지 반복하는 구조입니다.

## Generator 

위의 Iterator 를 직접 구현하게 되면 조금 귀찮기도 하고, 손수해야할 작업양이 늘어나게 된다. 게다가 Iterator 는 언급했듯이 값을 생성하는 로직과 순회하는 로직이 분리되어 있어 안에서 상태를 관리하게 된다면 더 귀찮아진다. 

Generator 는 위와 같은 불편함을 해소하기 위해 값을 순회하는 로직과 생성하는 로직을 전부 포함시키는 구조로 등장하였다. 즉, 순회가능한 자료구조 이므로 Generator 도 iterator 이다.

### Generator 의 반복 방식

Generator 는 **재진입이 가능한 구조로 loop 가 설계**되어 있다.  
즉, `next()` 와 같은 함수로 값을 생성한 뒤에 중지(suspend) 하고 이후에 다시 재개(resume) 할수 있다는 뜻이다. 위와 같이 일시 중단 메커니즘 을 구현하기 위해서는 **중단 지점(suspension point)** 가 필요하다. 그래서 대부분의 언어 에서는 `yield` 를 중단 지점으로 삼는다. **(언어마다 다르며 코루틴에서는 `suspend` 가 기점이 되기도 한다.)**

그럼 아까의 1 부터 5까지 출력하는 Iterator 를 Generator 로 변경해보자.

```kotlin
suspend fun main() {
    val gen = sequence<Int> {
        var start = 0
        yield(start++)
    }

    for (gen in 1 .. 5) {
        println(gen)
    }
}
```

아까 Iterator 의 next() 에서 하던 로직이 yield 에 배정된 것을 확인할 수 있다. 그리고 또한 IDEA 에서 아래와 같이 중단지점임을 표시해주는 것을 확인할 수 있다.  

보통 Generator 를 반쪽짜리 코루틴이라고 많이 부르는데, 그 이유는 Generator 는 값을 생성하고 나서 중단 되고, 다시 중단된 지점으로 부터 재개가 가능하기 때문이다.

## 끝마치며

이 챕터에서 스스로 생각해보면 좋은 점은 **왜 Iterator / Generator** 를 사용하는 가 이다. 소프트웨어 수준에서 구현된다면 코드상으로 어떻게 실행해야 하는지 생각해보는것도 큰 도움이 된다.


