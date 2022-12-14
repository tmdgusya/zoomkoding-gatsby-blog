---
emoji: ๐งฎ
title: LEETCODE 657.  Determine if Two Strings Are Close (Kotlin) 
date: '2022-12-02 20:46:00'
author: Roach
tags: algorithm leetcode
categories: algorithm
---

# LEETCODE 657.  Determine if Two Strings Are Close (Kotlin)

## ๋ฌธ์  ์ดํด (์ด๊ธฐ)

- Operation 1: ์กด์ฌํ๋ ๋๊ฐ์ ๋จ์ด๋ฅผ ์ค์ํด๋ผ
- Operation 2: ์กด์ฌํ๋ ๋จ์ด๋ฅผ ๋๊ฐ๋ฅผ ๋ณํํ  ์ ์๋ค.

์ ๋๊ฐ Operation ์ ํ์ํ ๋๊ฐ์ง ์ฌ์ฉํ  ์ ์์ผ๋ฉฐ, **ํ์ํ ๋๊น์ง ์ฐ์ฐํ์๋ ๊ฐ์์ง ์ ์๋ค๋ฉด Close ํ ๊ฒ**์ด๋ค.

๋ง์ฝ ๋ ๋จ์ด๊ฐ Close ํ๋ค๋ฉด True ๋ฅผ ๋ฆฌํดํ๊ณ  ์๋๋ผ๋ฉด False ๋ฅผ ๋ฆฌํดํ๋ค.

## ํ๋(Plan) - Text

์, ๊ฒฐ๊ตญ์ ๋ฌธ์์ ๋์จ ์ซ์๋ฅผ ๋งค์นญํด๋๊ณ 

- aaabbc -> a - 3, b - 2, c - 1
- bbbaac -> a - 2, b - 3, c - 1 

๋ผ๊ณ  ํ์๋ ๊ฒฐ๊ตญ ๋ฌธ์๋ ์ค์ํ์ง ์๊ณ , ์ด๋๊ฒ์ด๋ ๋งค์นญ๋ ์๋ง ๊ฐ๋ค๋ฉด ๊ฒฐ๊ตญ Close ํ๊ฒ์ด ์๋๊ฐ?

## ํ์ด ๋ฐฉ๋ฒ ์ถ์ํ(์๋ ์ฝ๋)

```kotlin
fun closeString(word1, word2) {
    // ๋ณํํ ๋ ๊ธธ์ด๋ฅผ ๋ฐ๊พธ๋๊ฑด ์์ผ๋ฏ๋ก ๊ธธ์ด๊ฐ ๋ค๋ฅด๋ฉด ๋ฐ๋์ False ์.
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
    // ํ์๊ฐ ๋์ ์์ผ๋ก sort
    val sortedThisCollection = this.values.sortBy { DESC }
    val sortedOtherCollection = other.values.sortBy { DESC }

    for (index in 0 to sortedThisCollection.length) {
        if (sortedThisCollection[index] != sortedOtherCollection[index]) return false
    }

    return true
}
```

## ์ฝ๋๋ก ๊ตฌํ

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

## ๊ฒฐ๊ณผ

<img width="797" alt="image" src="https://user-images.githubusercontent.com/57784077/205283272-7e2ac0e1-cdf6-45c4-a57f-e502c5569e41.png">

## ํ๊ณ 

- ๋ฌธ์ ๋ฅผ ์๋ชป ์ดํดํ๋๊ฐ?
  - ์ฒ์์ Operation2 ์์ ๋๊ฐ ๋จ์ด๋ผ๋ฆฌ Convert ํ๋๊ฑด๋ฐ ๊ทธ๊ฒ ๊ทธ๋ฅ ์์์ ๋จ์ด๋ก Convert ๋๋๊ฑธ๋ก ์ ๋ชป ์ดํดํ๊ณ  ํ์ด๋ฅผ ํด์ `isConvertable` ์ `sortXXByChar` ๋ฅผ ๋นผ๋๊ณ  ๋น๊ตํจ. ๊ทธ๋์ ํ๋ฒ ํ๋ ธ์.

- ์ ๊ทผ๋ฒ
  - operation ์ ์ฐ์์ ์ผ๋ก ์คํํด์ ํ์ดํ๋ ๋ฐฉ๋ฒ์ผ๋ก๋ ์ ๋ ํ์๊ฐ ์๋ค๊ณ  ์๊ฐํ๊ณ , ๊ฒฐ๊ตญ ์  Operation ๋ค์ ์คํํ์๋ ์ด๋ป๊ฒ ํ๋ฉด ๊ฐ์์ง ์ ์์๊น? ๋ฅผ ๊ณ ๋ฏผํ์. ๊ทธ ์กฐ๊ฑด์ด ์๋์ ๊ฐ์์
    - **๊ธ์ ๊ธธ์ด์๋ ๋ฐ๋์ ๊ฐ์์ผ ํจ(์คํผ๋ ์ด์์ผ๋ก ์ฒ๋ฆฌ ๋ถ๊ฐ)**
    - **๋ฌธ์-๋์จํ์ ์ Collection ์ด ๋๋ฑ**ํด์ผํจ.
        - ๋์จ ๋จ์ด๊ฐ ๊ฐ์์ผ ํจ.
        - ๋จ์ด๊ฐ ์ ํ ํ์๋ฅผ ๋ด๋ฆผ์ฐจ์์ผ๋ก ์ ๋ ฌํ์๋ ๊ฐ์์ผ ํจ.

- ๋ค๋ฅธ ํ์ด ๋ฐฉ๋ฒ์ ์์๋์ง?
    - Leetcode ์๋ฃจ์์ ๋ณด๋ฉด ๋ชจ๋ ์ถ์์ ์ผ๋ก  ๋ด ํ์ด์ ๊ฑฐ์ ํก์ฌํจ.
    - Bitwise ํ์ด ๋ฐฉ๋ฒ์ด ์กฐ๊ธ ์ ์ ํจ.
        - ๋ค๋ง ์ด๊ฒ๋ ๊ฒฐ๊ตญ ๊ฐ์ ์ถ์์ฐ์ฐ์ธ๋ฐ ๊ตฌํ์์ฒด๊ฐ ๋ค๋ฅธ ์ ๋๋ก ๋ณด์.

- ๋ฐฐ์ด์ 
    - ์๊ณ ๋ฆฌ์ฆ ๋ฌธ์  ํด๊ฒฐ ์ ๋ต์ฑ์์ ๋ณธ ํํ๋ฆฟ์ ์ฝ๊ฐ ๊ฐ์กฐํด์ ์ ์ฉํด๋ดค๋๋ฐ ์์ผ๋ก ์๊ณ ๋ฆฌ์ฆ ๊ณต๋ถํ ๋ ์ด ํํ๋ฆฟ ๋๋ก๋ง ์ข ํ์ด์ผ๊ฒ ๋ค๋ ์๊ฐ์ด ๋ฌ.

### ๋ฌธ์  ๋งํฌ

- [determine-if-two-strings-are-close](https://leetcode.com/problems/determine-if-two-strings-are-close)