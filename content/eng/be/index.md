---
emoji: 🧢
title: BE 동사
date: '2022-12-28 18:13:00'
author: Roach
tags: english
categories: english
---
## 들어가기에 앞서

요즘 영어 문법을 조금 더 깊은 수준으로 공부 하려고 하고 있다.   
이유는 다양한데 프로그래밍을 진행하면서 함수를 짜는 순간 이름을 선택해야 하는 상황이 온다. 
예를 들면,  `of`, `from` 등과 같이 근데 이러한 상황에 좀 더 맞는 영어적 표현이나, 코틀린의 스코프 함수 `let`, `apply`, `also` 등등 을 이용할때도 좀 더 영어 문법적으로 상황에 맞는 함수를 선택할 수 있도록 하기 위해 공부를 다시 해보려고 한다.

## BE 동사 란?

BE 동사의 뜻은 한국말로 대치하면 **~ 이다, ~ 있다, ~ 하다, ~가 되다** 정도로 대치 된다.  
대치되는 뜻을 아는것도 중요한데, 단순히 이렇게 대치되는 뜻만 외우면 영작이 아예 안된다고 생각한다.
요즘 느끼는 건 대치되는 뜻 보다 조금 더 **컨텍스트 내에서의 용도** 를 파악하는게 중요하다고 생각한다.

아래 구문을 한번 살펴보자

```
I am a Student
```

위 구문은 한국말로 "나는 학생 입니다" 정도로 번역된다.  

위에서 말했듯이 단순 대치되는 뜻만 외우는건 **내 경우에는** 영작에는 아무런 도움이 되지 않는다고 했다. (주관적인 의견이다.) 
그래서 내가 느낀 BE 동사가 쓰여야 하는 순간은 무언가 **Subject 의 상태(State)** 를 표현내야 할때 종종 쓰인다고 생각 된다. 예를 들면, 나라는 사람이 추운 상태임을 표현하기 위해서는 아래와 같은 문장을 사용할 것이다.

> "I am a cold" -> 나는 추워(추운 상태야)

위와 같이 **현재 Subject 의 상태(State) 를 표현하기 위함**으로 나는 BE 동사가 영어에 존재한다고 생각한다.  

## 왜 BE 동사일까?

사실 am, is, are 등등의 원형은 `be` 이다.  그래서 be 동사라고 불린다.  
be 동사를 쓰는 경우는 아래와 같다. 

> He must be a doctor
> She will be 10 years old next month

첫번째 문장은 현재 Subject 가 Doctor 임을 나타낸다.  
두번째 문장의 경우 `will be` 이므로 미래에 **상태가 ~이 될거야** 라고 나타내며, 그녀는 다음달에 10살이 될거야 라는 뜻을 가진다.

이렇게 조동사 혹은 to부정사 뒤와 같이 원형이 와야 하는 경우 am, is, are, was, were 대신 be 가 쓰이게 된다.

> The Object is "open" state in life-cycle
> 	- 객체는 수명 주기(Lify-Cycle) 안에서 "열림(Open)" 상태이다.

## 의문문

그럼 BE 동사를 활용해 현재 객체의 상태를 의문해보도록 하자.  
영어에서는 보통 의문문으로 문장을 바꿀때, **주어와 동사를 도치시키는** 방법을 이용한다.

예를 들면 "그는 의사입니까?" 라는 문장을 영작하게 되면 아래와 같이 적을 수 있다.

> Is he a doctor?

아주 쉽게 의문문으로 변환이 가능하다.   
이렇게 의문문으로 질문을 던지게 되면 보통 대답은 Yes, He is / No, He isn't 와 같이 Binary 형태로 답변이 나오게 된다. 프로그래밍 적으로 생각해보면 bool 인 true / false 를 떠올려 볼 수 있다.

그래서 보통 프로그래밍에서 isXXX 등과 같이 binary 식 으로 답변해야하는 의문문을 만들게 되면 Return Type 이 Boolean 임을 암시적으로 나타낸다.

