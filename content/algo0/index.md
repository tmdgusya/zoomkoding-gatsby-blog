# LEETCODE 657.  Determine if Two Strings Are Close (Kotlin)

## 문제 이해 (초기)

- Operation 1: 존재하는 두개의 단어를 스왑해라
- Operation 2: 존재하는 단어를 두개를 변환할 수 있다.

위 두개 Operation 을 필요할때가지 사용할 수 있으며, **필요할때까지 연산했을때 같아질 수 있다면 Close 한 것**이다.

만약 두 단어가 Close 하다면 True 를 리턴하고 아니라면 False 를 리턴한다.

## 플랜(Plan) - Text

음, 결국에 문자와 나온 숫자를 매칭해두고

aaabbc -> a - 3, b - 2, c - 1
bbbaac -> a - 2, b - 3, c - 1 

라고 했을때 결국 문자는 중요하지 않고, 어느것이던 매칭된 수만 같다면 결국 Close 한것이 아닌가?

## 풀이 방법 추상화(수도 코드)

fun closeString(word1, word2) {
    // 변환할때 길이를 바꾸는건 없으므로 길이가 다르면 반드시 False 임.
    if (word1.length != word2.length) {
        return false
    }

    val word1Collect = word1.collect()
    val word2Collect = word2.collect()

    return word1Collect.isConvertable(word2Collect)
}

fun Word.collect() {
    val map = map<char, int>()
    for (char in this) {
        map[char] = ++map[char]
    }
}

fun Collect.isConvertable(other: Collect) {
    // 횟수가 높은 순으로 sort
    val sortedThisCollection = this.values.sortBy { DESC }
    val sortedOtherCollection = other.values.sortBy { DESC }

    for (index in 0 to sortedThisCollection.length) {
        if (sortedThisCollection[index] != sortedOtherCollection[index]) return false
    }

    return true
}

## 코드로 구현

```kotlin
typealias Word = String
typealias Collection = Map<Char, Int>

fun closeStrings(word1: String, word2: String): Boolean {
    if (word1.length != word2.length) return false

    val word1Collection = word1.collect()
    val word2Collection = word2.collect()

    return word1Collection.isConvertable(word2Collection)
}

fun Word.collect(): Map<Char, Int> {
    val map = mutableMapOf<Char, Int>()
    for (char in this) {
        map[char] = map.getOrDefault(char, 0) + 1
    }
    return map
}

fun Collection.isConvertable(other: Collection): Boolean {
    val sortedThisCollectionByCount = this.values.sortedDescending()
    val sortedOtherCollectionByCount = other.values.sortedDescending()

    val sortedThisCollectionByChar = this.keys.sortedDescending()
    val sortedOtherCollectionByChar = other.keys.sortedDescending()

    return sortedThisCollectionByCount == sortedOtherCollectionByCount && 
    sortedThisCollectionByChar == sortedOtherCollectionByChar
}
```

## 결과

<img width="797" alt="image" src="https://user-images.githubusercontent.com/57784077/205283272-7e2ac0e1-cdf6-45c4-a57f-e502c5569e41.png">

## 회고

- 문제를 잘못 이해했는가?
  - 처음에 Operation2 에서 두개 단어끼리 Convert 하는건데 그게 그냥 임의의 단어로 Convert 되는걸로 잘 못 이해하고 풀이를 해서 `isConvertable` 의 `sortXXByChar` 를 빼놓고 비교함. 그래서 한번 틀렸음.

- 접근법
  - operation 을 연속적으로 실행해서 풀이하는 방법으로는 절대 풀수가 없다고 생각했고, 결국 저 Operation 들을 실행했을때 어떻게 하면 같아질 수 있을까? 를 고민했음. 그 조건이 아래와 같았음
    - **글자 길이수는 반드시 같아야 함(오퍼레이션으로 처리 불가)**
    - **문자-나온횟수 의 Collection 이 동등**해야함.
        - 나온 단어가 같아야 함.
        - 단어가 적힌 횟수를 내림차순으로 정렬했을때 같아야 함.

- 다른 풀이 방법은 없었는지?
    - Leetcode 솔루션을 보면 모두 추상적으론 내 풀이와 거의 흡사함.
    - Bitwise 풀이 방법이 조금 신선함.
        - 다만 이것도 결국 같은 추상연산인데 구현자체가 다른 정도로 보임.

- 배운점
    - 알고리즘 문제 해결 전략책에서 본 템플릿을 약간 개조해서 적용해봤는데 앞으로 알고리즘 공부할때 이 템플릿 대로만 좀 풀어야겠다는 생각이 듬.

### 문제 링크

- [determine-if-two-strings-are-close](https://leetcode.com/problems/determine-if-two-strings-are-close)