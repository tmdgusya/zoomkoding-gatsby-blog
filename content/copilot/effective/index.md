---
emoji:
title: Effective Copilot in Intellij IDEA
date: '2023-02-12 16:30:00'
author: Roach
tags: copilot
categories: copilot
---

## Copliot 이란?

[Copilot](https://github.com/features/copilot) 이란 OpenAI 를 통해서 작성하고 있는 코드에 대한 Assist 를 받을 수 있는 유료 툴입니다.

## Intellij Copilot 설정하기

### 플러그인 설치
Intellij Plugin 메뉴에 Copilot 을 검색하여 설치해줍니다.

![image](https://user-images.githubusercontent.com/57784077/218294653-3eb602a6-60cd-4276-ac90-dd40236ac7d9.png)

메뉴 검색에 "Copilot" 을 검색한뒤 Account 설정을 해줍니다.

![image](https://user-images.githubusercontent.com/57784077/218294668-58b6dfc5-b492-4e01-9e3a-948322198f5f.png)

### 자동추천 끄기

알고리즘을 풀다보면 알고리즘에 대한 정답을 그래도 **자동으로 추천 코드를 보여주는 경우**가 있어서 저는 주로 끄고 사용하는 편입니다. 해당 옵션을 끄기 위해서는 위 메뉴에서 **"Automatically show completions"** 옵션을 **비활성화(disable)** 처리해주면 됩니다.  
이 옵션을 비활성화 해도 추천받을 수 있는 방법이 있습니다.

#### 현재 부분에서 추천받기

위 옵션을 비활성화 했을때도 추천받기 위해서는 아래 단축키 모음에 나와있는 **"현재 부분에서 추천받기"** 인 **Option (⌥)+\\** 를 해주시면 추천된 코드가 나오게 됩니다.

![copilot-1](https://user-images.githubusercontent.com/57784077/218294792-327bb517-66f6-4047-91ac-3f603452ecf6.gif)

**[수동으로 추천받기 예시]**

#### Intellij 단축키 모음
Action | Shortcut |
----|----|
**추천 코드 사용하기** | Tab |
**추천 코드 사용하지 않기** | Esc |
**다음 추천 보기(Next)** | Option (⌥) or Alt+] |
**이전 추천 보기(Previous)** | Option (⌥) or Alt+[ |
**현재 부분에서 추천받기** | Option (⌥)+\ |
**Open GitHub Copilot** | Option (⌥) or Alt+Return |

#### 사이드바에 뛰우기

여러 제안을 `Option + ]` 또는 `Option + [` 을 넘겨가면서 보기 귀찮을 때가 있는데요. 이 경우 한번에 볼 수 있게 하기 위해 Copilot 을 사이드바에 뛰어주면 더욱 편하게 이용이 가능합니다.

<img width="373" alt="image" src="https://user-images.githubusercontent.com/57784077/218297037-a9ede9b9-0dc4-459a-8811-08f0b44f0711.png">

<img width="43" alt="image" src="https://user-images.githubusercontent.com/57784077/218297099-56530ab8-e4ea-4356-b4b7-78c9a4a521fa.png">

Intellij 의 Project 바 옆의 `...` 을 눌러주시면 **Copilot 아이콘**이 보이는데 해당 아이콘을 클릭해주시면 됩니다.

<img width="605" alt="image" src="https://user-images.githubusercontent.com/57784077/218297134-9f9a09cc-a820-4512-befe-15c6c772afef.png">

해당 아이콘을 클릭하게 되면 위 사진처럼 오른쪽 사이드바에 코파일럿이 생기게 됩니다.


![copilot-6](https://user-images.githubusercontent.com/57784077/218297182-12d4c2ae-df6d-4f08-8de5-5056246d3541.gif)

위와 같이 추천받고자 하는 주석 또는 함수를 드래그 한 뒤에 한번 `refresh` 버튼을 눌러보면 추천을 받을 수 있고, 다양한 케이스 일 경우 **여러 케이스를 한번에 보고 원하는 케이스만 `accept solution` 을 통해 사용**할 수 있습니다.

<img width="1300" alt="image" src="https://user-images.githubusercontent.com/57784077/218297314-3b63cbc8-6bca-4843-b95e-1a20bf49088c.png">

**[다수 케이스 예시 사진]**

### 코파일럿 특성

아래 특성은 제가 써보면서 느꼈던점이므로 확실한 팩트가 아닙니다.  
개인적인 추론이라고 생각해주시면 될것 같습니다.

#### 코드의 통일성을 높일수록 제대로된 조언을 받을 확률이 기하급수적으로 높아진다.

코파일럿을 써보면서 제일 중요하게 생각하는 점은 **코드의 통일성을 높이는 것**입니다.  
대부분 엔터프라이즈 코드는 한명이 치는 것이 아니라 여러명이 치게 되므로, 코드의 통일성을 높이지 않으면 대부분의 경우 제대로된 추천을 해주지 못하는 경험을 했습니다. 따라서 한 파일내에서의 **변수명, 함수명 코파일럿에게 추천받기 또는 유추할 수 있는 영문명으로 최대한 잘 적기 또는 함수에 일단 주석을 달아서 설명을 적기** 같은 과정만 잘해놓고 테스트를 해보면, 좀 더 제대로 된 추천을 해주는 것을 확인할 수 있었습니다. 

이 과정을 하고나서 다시 달았던 주석을 지우고, 주석을 달아놨던 함수 이름을 추천받아 좀 더 정확한 영문 함수명을 적으려고 하다보면 점점 코파일럿이 내생각과 비슷한 코드를 추천해주기 시작하는 것을 느낄 수 있습니다.

아래와 같이 통일이 잘 되있을 경우 Class 명 만으로도 엄청난 추천을 받을 수 있는 것을 확인할 수 있습니다.

<img width="1192" alt="image" src="https://user-images.githubusercontent.com/57784077/218297495-e28ca205-6399-4129-b389-993eff5b24d3.png">

여기서 `url` 힌트도 주지 않았는데 `url` 을 Copilot 이 스스로 유추하는 등, 파일과 코드가 연관성을 지니고 있는 파일들은 대부분 코파일럿 추천만으로도 작성해야 하는 코드의 양을 크게 줄일 수 있게 됩니다.

마찬가지로, 대부분의 테스트 코드의 경우 `given/when/then` 형태의 통일된 형태로 작성하는 케이스가 많아 코파일럿을 통해 추천받았을 경우 대부분을 그대로 써도 될정도의 추천을 받은적이 많습니다.

### 코파일럿을 통해 반복적인 작업을 줄여주는 사용 케이스

아래 예시들 말고도 대부분의 경우 추천을 잘해줘서 효율적으로 잘 사용하고 있으나, 밑 예시들은 기존에 손수 했던 귀찮은 보일러플레이트 수준의 코드들을 코파일럿을 통해 작성하고 있는 Use-case 에 대해 정리해 보았습니다.

#### 1. JSON 변환

API 를 코드로 작성하다보면 **JSON 을 각 언어에 맞는 클래스 혹은 특정 데이터 형태로 맵핑(Mapping)** 해야 할때가 많습니다.

코틀린 언어로 예시를 들면 아래의 JSON 형태를 코틀린에서는 데이터 클래스로 맵핑해야 합니다.

```json
"person": {
        "no": 12314,
        "name": "string",
        "type": "NONE",
        "profile": {
          "path": "string",
          "name": "string"
        }
}
```

위와 같은 JSON 을 코틀린 데이터로 만드는 것은 상당히 귀찮은 일입니다.  
이 경우 Copilot 을 이용해 어시스트를 받으면 빠르게 작성이 가능합니다.

![copilot-2](https://user-images.githubusercontent.com/57784077/218295034-8d4153b5-e92d-4cd3-97e6-37124afb0e57.gif)

**[코파일럿을 통한 JSON 데이터 모델링 예시]**

위와 같이 JSON 을 주석으로 입력하고 코파일럿에게 **"위 JSON 을 코틀린 데이터 클래스로 바꿔줘!"** 라고 명령을 내리게 되면 쉽게 컨버팅이 가능하게 됩니다. 이 변환을 가장 유용하게 이용하며 정말 큰 Json Data 또한 잘 변환해줍니다.

#### 2. 테스트 만들기

종종 데이터 위주의 테스트를 진행할때 **테스트 케이스(Input 값) 만 변경하면서 테스트 할 경우**가 있습니다. 이 경우 여러 케이스의 Function 을 하나하나 적는게 귀찮을 경우가 있는데요.
그럴때는 코파일럿의 지원을 받아 반복되는 작업을 아래와 같이 줄일 수 있습니다.

![copilot-3](https://user-images.githubusercontent.com/57784077/218295389-062b0487-de5d-477a-89bb-c3a5ea0bcd1f.gif)

제 추측상으로는 코파일럿이 제 파일내의 **문맥(Context) 를 파악해서 위와 같이 테스트 코드를 작성**해준다고 생각합니다. 즉, 코파일럿을 잘 사용하기 위해서는 **자신의 프로젝트 내 또는 좁게는 파일안에서 코드에 대한 통일성**이 높아야 제대로된 어시스트를 받을 수 있습니다.

#### 3. Orm Model 만들기

가끔 **DDL 을 기반으로 ORM 에 해당하는 모델을 만들어야 할때**가 있습니다.  
이러한 작업 또한 코파일럿의 어시스트를 받아 쉽게 가능합니다.

![copilot-4](https://user-images.githubusercontent.com/57784077/218296032-0ba603ca-c6fc-421e-a719-cddd76840ef9.gif)

(하지만 ORM Model 은 중요하니 이렇게 간단한 초기 코드는 코파일럿에게 맡기고, 그 이후로 세세하게 보시면서 조정하셔야 합니다.)

ddl 만 넣어주면 대부분 쉽게 잘 만들어주며, 이 경우 또한 자신의 프로젝트내의 코드의 통일성이 높을수록 더 잘만들어주는 경향이 있습니다.

#### 4. Object Mapping

우리가 흔히 계층(layer) 간의 경계에서 데이터를 주고 받기 위해 **계층내에 속하는 모델** 을 만들고는 합니다. 때로는 해당 계층간의 데이터 형태는 차이는 없으나, Layer 간의 의존성을 낮추기 위해서 계층간의 모델을 적는 경우도 있는데요.

각 계층마다 모델을 만들다보면 코드를 일일이 적기도 귀찮아지기 때문에 쉽게 Mapping 하기 위해 Library 를 넣는다거나 혹은 여러 방법을 강구하게 됩니다. 이런 경우 코파일럿을 통한 Assist 를 받으면 아주 쉽게 작성할 수 있게 됩니다.

아래 예시를 통해 한번 사용케이스를 살펴보도록 합시다.

```kotlin
data class Hello(
    val name: String,
    val age: String,
    val zz: String,
)
```

위 Hello 클래스는 `service` 패키지의 Hello 클래스로 서비스 계층에서만 이용되는 서비스 패키지에 종속적인 모델입니다. 따라서 서비스 패키지 내에서의 변화율만 가지고 있는데요. 이 Hello 로 서비스에서 가공한 데이터를 클라이언트에게 응답해주기 위해서는 아래와 같이 `controller` 패키지에 모델을 따로 만들어 주어야 합니다.

```kotlin
data class HelloResponse(
    val name: String,
    val age: String,
    val zz: String,
)
```

이런 경우 사실 데이터도 같기때문에 쉽게 변환할 수 있는 라이브러리를 이용하게 될 수 있는데요. 코파일럿에서는 이러한 변환이 전통적인 메소드인 `from` 을 통해서 쉽게 가능합니다.

![copilot-5](https://user-images.githubusercontent.com/57784077/218296512-82186edb-45a9-451b-a2b9-3dc6aa3bc842.gif)

위와 같은 방법을 통해서 계층간의 모델링을 조금 더 쉬운 방법으로 할 수 있습니다.

### 코파일럿 알쓸신잡

#### 시간복잡도/공간복잡도 계산

기본적으로 자신이 계산할줄 아는 것이 가장 좋으며, 한번 검증해보는 정도로만 사용하시는 경우를 추천합니다.  

<img width="1263" alt="image" src="https://user-images.githubusercontent.com/57784077/218298501-b779060c-3cd1-4561-b74f-935578617417.png">

위와 같이 공간복잡도와 시간 복잡도를 계산해달라고 할시 코파일럿이 잘 계산해주며, 여태까지 틀린 케이스는 본적이 없는것 같습니다.

### 코드 해석

**(코드를 일단 잘 읽지 못하는 상태에서 무작정 사용하시면 오히려 해만 됩니다.)**

잘 모르는 알고리즘이나 코드가 등장할 시 해석하기 힘든 경우가 종종 있습니다. 그때 코파일럿에게 어떤 동작을 하고 있는 함수인지 물어보고 싶을때가 있거나, 내가 만든 함수의 동작을 주석으로 쉽게 적고싶을때 아래와 같이 `explain` 을 이용하면 쉽게 코드의 동작을 파악할 수 있습니다. 

<img width="1078" alt="image" src="https://user-images.githubusercontent.com/57784077/218298726-52fda16f-bb11-415e-87de-b44179fa5a48.png">

근데 사실 `explain` 기능은 코파일럿 보다 Chat-GPT 를 이용하시는 것을 조금 더 추천드립니다. Chat-GPT 가 좀 더 인간친화적으로 상세하게 대답해주는 경우가 훨씬 많고, **문맥(Context)** 를 기억하고 있기 때문에 좀 더 상세하게 파악하는데 도움이 됩니다.

<img width="923" alt="image" src="https://user-images.githubusercontent.com/57784077/218298905-2d104f2a-987f-4cb9-bc68-2f81bd8fe562.png">

**[GPT 답변]**

#### SQL 추천

대부분의 경우 코드에서만 코파일럿을 이용하려고 하기 보다는 SQL 또한 코파일럿을 통해 작성하게 되면 충분히 지원을 많이 받을 수 있게 됩니다. 현재 사용하고 있는 개발 도구에서 쿼리를 작성을 많이 하게 되면 될 수록 코파일럿을 통한 더 정확한 지원을 받을 수 있으므로 코파일럿을 자주 이용해보시길 바랍니다.

## 끝마치며

코파일럿과 Chat-GPT 모두 요즘 코딩하는데 정말 자주 이용하고 있는 툴들 중 하나입니다. 사실 둘 중 하나를 고르라면 Chat-GPT 를 고르겠지만, 코파일럿 또한 반복되는 작업을 줄여주는 케이스가 많아 잘 이용하고 있습니다.

혹시 자신이 이용하고 있는 유용한 케이스가 있다면 댓글로 남겨주시길 바랍니다.