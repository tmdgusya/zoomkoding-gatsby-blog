---
emoji: 
title: 어셈블리와 C로 간단하게 알아보는 아토믹 처리와 뮤텍스 세마포어
date: '2022-12-11 21:30:00'
author: Roach
tags: assembly c cs
categories: computer science
---

## 들어가기에 앞서

이 글에 있는 대부분의 내용은 [해당 책](https://www.coupang.com/vp/products/6565645696?itemId=14717908674&vendorItemId=81958618315&src=1042503&spec=10304982&addtag=400&ctag=6565645696&lptag=10304982I14717908674&itime=20221211224603&pageType=PRODUCT&pageValue=6565645696&wPcid=16672949122082466833829&wRef=&wTime=20221211224603&redirect=landing&gclid=Cj0KCQiAnNacBhDvARIsABnDa6-ysY5VNoNXyfHJ8uZRDahovPi6To8QziIp2KMOP4XdMgTmFebSc3caAk96EALw_wcB&campaignid=18626086777&adgroupid=&isAddedCart=) 의 내용입니다. 궁금하신 분들은 사서 읽어보시는걸 추천드립니다.

프로그래밍을 하다보면 코드간에 순서를 지켜가며 협력을 하여 데이터를 가공할때가 있다. 
예를 들면 `pause()` 함수로 멈추고 난뒤 `resume()` 함수로 재개하듯이 서로간의 시간 순서를 맞춰 협력해야 하는 상황이 생긴다. 
이렇게 타이밍 동기화나, 데이터 업데이트에 관한 시간적 동기화가 필요한 코드를 보통 우리는 **동기 처리(Synchronous processing)** 하여 처리 한다.

우리가 기계어를 직접 이용하지 않는 이상 대부분의 명령은 **아토믹(Atomic)** 하지 않다.  
어셈블리어가 아닌 이상 보통 기계어와 1:1 대립을 하지 못하기 때문이다. 
따라서 멀티 스레드를 이용해서 작업하는 환경에서는 하나의 변수의 값을 단순히 바뀌었다고 보장하는 일이 그리 쉬운일이 아니다. 
오늘은 C 언어와 어셈블리어를 통해 간단하게 멀티 스레드 환경에서 일어나는 일들을 살펴보자.

## Race Condition

예를 들어, 아래와 같은 코드를 두 개의 프로세스를 통해 동시에 실행시키고 있다고 해보자.  
**(a 는 두 프로세스에서 공유 되는 자원이다.)**

```kotlin
fun plusA() {
    a = a + 1
}
```

위와 같은 코드를 동시에 실행시킬때 동시성 문제를 겪게 된다.

<img width="1108" alt="image" src="https://user-images.githubusercontent.com/57784077/206900574-fda3eeb5-03a4-46df-96a7-4212c00acb3a.png">

두번째 상황을 보면, Process A 가 Process B 가 값을 쓰기 전에 값을 읽어들여서 서로 A 의 값을 + 1 하는 상황이지만 결과는 3이 아닌 2가 된다.

### 임계 영역(Critical Section)

**임계 영역**이란 경쟁 조건(Race Condtion) 이 발생할 수 있는 코드를 의미한다. 즉, 위 코드에서는 `a = a + 1` 부분이 임계 영역에 해당된다. 위 처리의 원활한 진행을 위해서는 **동기화 처리**가 필요하다.

### CAS(Compare And Swap)

CAS 는 동기 처리 기능의 하나인 세마포어, 락프리, 웨이트 프리(wait-free) 한 데이터 구조를 구현하기 위해 이용하는 처리이다.

```c
bool compare_and_swap(uint64_t *p, uint64_t val, uint64_t newval) {
    if (*p != val) {
        return false;
    }
    *p = newval;
    return true;
}
```

우리가 짠 이코드는 `*p != val` 과 `*p = newval` 이 **아토믹(Atomic)** 하게 수행되지 않는다. 따라서 앞서 봤던 **경쟁 조건(Race Condition)** 겪게 된다.  
원자적이지 않은 이유는 어셈블리어로 번역된 컴파일 결과를 보면 아래와 같다.  
(x86_64 기준이다.)

```assembly
    cmpq %rsi, (%rdi) ; 
    jne LBB0_1 ; // 비교결과가 같지 않으면 LBB0_1 로 점프한다.
    movq %rdx (%rdi) ;
    movl $1, %eax ;
    retq ; // 1을 리턴한다
LB80_!:
    xorl %eax, %eax ; // 레지스터의 값을 0 으로 설정한다.
    retq
```

각 di, rsi, rdx 는 레지스터이며 p, val, newval 에 해당한다.  
즉 대부분의 컴파일 단계에서 메모리의 값을 이용하는 것이 아니라 **레지스터에 있는 값을 이용하도록 컴파일 최적화** 된다. 따라서 메모리에 있는 값을 곧이 곧대로 이용하지 않으므로 경쟁 조건 문제에 빠지게 된다.

위와 같은 문제로 인해 언어 자체에서 **아토믹(Atomic)** 하게 실행할 수 있는 기능을 제공하기도 한다. C 언어에는 내장 함수인 `__sync_bool_compare_and_swap()` 함수를 제공한다.

어셈블리로 번역하면 아래와 같이 번역된다.

```assembly
movq %rsi, %rax
xorl %ecx, %ecx
lock cmpxchgq %rdx, (%rdi)
sete %cl
movl %ecx, %eax
retq
```

간단히 설명하자면 아래와 같다.

1. rax 의 값을 rsi 에 넣는다.
2. ecx 레지스터를 0으로 초기화 한다.
3. cmpxchgq 명령을 통해 **아토믹(Atomic)하게 비교 및 교환**한다. 조금 더 이야기 하면 명령안에 지정된 메모리에 해당하는 CPU 캐시 라인의 소유권이 배타적인것을 보증한다.

즉, 아토믹한 동작을 보장하기 위해 언어적 측면에서 이러한 메소드들을 제공한다. Java 의 `AtomicXXX` 시리즈 또한 마찬가지이다.

> volatile 을 통한 레지스터 최적화 억제하여 메모리에 직접 읽고 / 쓰는 것을 통한 회피도 가능하다.

## Mutex(배타 실행)

뮤텍스는 임계 영역을 실행시킬수 있는 **프로세스/스레드 수를 1개로 제한**하여 동기적으로 처리할 수 있도록 해주는 장치이다. 다른 프로세스가 이미 임계 영역을 실행 중이라면 실행중임을 나타내고, 다른 프로세스는 임계영역에 진입할 수 없게 된다.

```c
bool lock = false;

void some_func() {
    retry:
        if(!lock) {
            lock = true;
            // do something
        } else {
            goto retry;
        }
        lock = false;
}
```

코드는 위와 같이 구현될 것이다. 아마 Java 혹은 다른 언어에서 Lock 객체에 대한 것들을 사용해봤다면 많이 봤을 수도 있는 코드이다. 다만, 위에 코드에는 한가지 문제가 존재한다. 아까도 말했지만 **레지스터의 값을 이용하도록 최적화** 되므로 경쟁 조건에 항상 노출되게 된다. 그래서 아토믹하게 실행할 수 있도록 도와주는 `test_and_set()` 함수를 이용하여 아래와 같이 함수를 변경해야 한다.

```c
bool lock = false;

void some_func() {
    retry:
        if(!test_and_set(&lock)) { // 검사와 락획득을 동시에 진행(lock = true)
            // do something
        } else {
            goto retry;
        }
        lock = false;
}
```

## 세마포어(Semaphore)

세마포어는 뮤텍스와는 다르게 **N개의 프로세스가 동시에 락을 획득할 수 있는 구조**이다.  
아래의 예시 코드를 한번 보자.

```c
#define NUM 4

void semaphore_acquire(volatile int *cnt) { // 1
    for (;;) {
        while (*cnt >= NUM); // 2
        __sync_fetch_and_add(cnt, 1); // 3
        if (*cnt <= NUM)
            break;
        __sync_fetch_and_sub(cnt, 1); // 4
    }
}
```

1. Semaphore 에서는 N 개의 프로세스가 락획득이 가능하므로 공유 변수인 **cnt** 를 이용한다.
2. Lock 을 획득하고 있는 프로세스가 이미 제한된 개수 이상이라면 스핀하며 락을 획득할 수 있을때까지 대기한다.
3. Lock 을 획득했다면 cnt 를 + 1 해준다.
4. Lock 을 획득했는데 cnt 가 제한 수보다 많다면 동시성 문제가 생긴것이므로 cnt 를 -1 하고 다시 시도한다.

4 번 문제가 일어나는 이유는 **Lock 획득시 값을 검사하고 증가시켰기** 때문이다. 위의 문제를 해결하기 위해서는 아토믹하게 검사와 증가를 해주어야 한다.

## 끝마치며

항상 느끼지만 C 언어의 포인터 개념을 아주 살짝이라도 알고 있는 것은 항상 도움이 된다. C 언어가 잘 기억도 안나지만 대략의 기억만으로도 위의 코드를 추상적으로나마 이해할 수 있기 때문이다. 여하튼 어렵지만 C 와 어셈블리를 엮어서 이해하다보면 잘 이해가지 못했던 내용도 이해할 수 있으니 C 정도는 나중에 한번 공부해보는걸 추천한다.

## 참조

[동시성 프로그래밍](https://www.coupang.com/vp/products/6565645696?itemId=14717908674&vendorItemId=81958618315&src=1042503&spec=10304982&addtag=400&ctag=6565645696&lptag=10304982I14717908674&itime=20221211224603&pageType=PRODUCT&pageValue=6565645696&wPcid=16672949122082466833829&wRef=&wTime=20221211224603&redirect=landing&gclid=Cj0KCQiAnNacBhDvARIsABnDa6-ysY5VNoNXyfHJ8uZRDahovPi6To8QziIp2KMOP4XdMgTmFebSc3caAk96EALw_wcB&campaignid=18626086777&adgroupid=&isAddedCart=)
