---
emoji: ๐งฎ
title: LEETCODE 48. Rotate Image(Kotlin)
date: '2022-12-11 19:30:00'
author: Roach
tags: algorithm leetcode
categories: algorithm
---

## ๋ฌธ์  ์ดํด

- 2D ํ๋ ฌ์ ์๊ณ ๋ฐฉํฅ์ผ๋ก 90๋ ํ์ ์ํค๋ ๊ฒ

## ํ์ด ๋ฐฉ๋ฒ ์ถ์ํ(์๋ ์ฝ๋)

1. ์๋์์ ๋ถํฐ ์๋ก ์ฝ์ผ๋ฉด ๊ทธ๊ฒ ๋ฐ๋์ด์ผ ํ  ์์น

```
1 2 3
4 5 6
7 8 9
```

์ ํ๋ธ์ ๊ฒฝ์ฐ [7, 4, 1, 8, 5, 2, 9, 6, 3] ์ฒ๋ผ ์ฒซ๋ฒ์งธ ์ค๋ถํฐ ์๋์์ ๋ถํฐ 
์๋ก ๊ธ์ ์ฝ์ผ๋ฉด ๋จ.

1. ์ผ๋จ ์ ์ฒ๋ผ ์๋์์ ๋ถํฐ ์๋ก ์ฝ์ด์ ํ๋์ ๊ธด ๋ฐฐ์ด์ ๋ง๋ฌ

2. ๊ฐ ์์น์์ ์์ ์ด ๋ฐ๋์ด์ผ ํ  ์์น๋ 1์ฐจ์ ๋ฐฐ์ด ์ ์ฅ์์ ์ธ๋ฑ์ค๋ฅผ ํ๋ธ์ ํฌ๊ธฐ(N) ์ผ๋ก ๋๋ด์๋ [๋ชซ, ๋๋จธ์ง] ์ธ๋ฑ์ค์ ๋ฃ์ผ๋ฉด ๋จ.  
์๋ฅผ ๋ค๋ฉด 3 ํฌ๊ธฐ์ ํ๋ธ์์ ์ ์ฅ์[3] ์ ์์น๋ ํ๋ธ[3/3, 3%3] ์ด๋ฏ๋ก [1, 0] ์ด ๋จ.

## ์ฝ๋๋ก ๊ตฌํ

```Kotlin
class Question48: FunSpec({

    test("case 01") {
        val matrix = arrayOf(intArrayOf(1, 2, 3), intArrayOf(4, 5, 6), intArrayOf(7, 8, 9))
        val output = arrayOf(intArrayOf(7, 4, 1), intArrayOf(8, 5, 2), intArrayOf(9, 6, 3))

        rotate(matrix)

        matrix shouldBe output
    }

    test("case 02") {
        val matrix = arrayOf(intArrayOf(5,1,9,11), intArrayOf(2,4,8,10), intArrayOf(13,3,6,7), intArrayOf(15,14,12,16))
        val output = arrayOf(intArrayOf(15,13,2,5), intArrayOf(14,3,4,1), intArrayOf(12,6,8,9), intArrayOf(16,7,10,11))

        rotate(matrix)

        matrix shouldBe output
    }
})

private fun rotate(matrix: Array<IntArray>): Unit {
    makeStore(matrix)
        .forEachIndexed { index, value ->
            matrix[index / matrix.size][index % matrix.size] = value
        }
}

private fun makeStore(matrix: Array<IntArray>): IntArray {
    val store = mutableListOf<Int>()
    for (i in 0 .. matrix.lastIndex) {
        for (j in matrix.lastIndex downTo 0) {
            store.add(matrix[j][i])
        }
    }
    return store.toIntArray()
}
```

<img width="1915" alt="image" src="https://user-images.githubusercontent.com/57784077/206898540-bb52bfba-ef50-4cd9-8b0a-a7562126448f.png">

## ํ๊ณ 

- ์ ๊ทผ๋ฒ

๋ฌธ์ ๋ฅผ ์ฝ๋ค๋ณด๋ ์๋์์ ์๋ก ์ฝ๋๊ฒ ๊ท์น์ด์์. 
๊ทผ๋ฐ ์์ฌ์ด๊ฒ ๋ญ๊ฐ ์ํ์ ์ผ๋ก ๋ฑ ๋ด๋ ๊ณ์ฐ์ด ๋ ๊ฒ ๋ง ๊ฐ์ ๊ณต์์ฒ๋ผ ๋๊ปด์ง.  
์ ์ด์ ์ด๋ ๊ฒ ์คํ ์ด๋ฅผ ๋ง๋ค์ด์ผ ํ๋์ง๋ ์๋ฌธ.. ๊ทผ๋ฐ ๋ค๋ฅธ 2D ๋งคํธ๋ฆญ์ค๋ฅผ ๋ง๋๋๊ฒ ๊ธ์ง๋๊น ์ด๋ ๊ฒ ํ  ์ ๋ฐ์ ์์์.

- ๋ค๋ฅธ ํ์ด ๋ฐฉ๋ฒ์ ์์๋์ง?

์ญ์ ์ธ๊ฐ๋ฅผ ๋์์ ๋ฐ๊พธ๋ ๋ฐฉ๋ฒ์ด ์กด์ฌํ์.

```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < (n + 1) / 2; i ++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[n - 1 - j][i];
                matrix[n - 1 - j][i] = matrix[n - 1 - i][n - j - 1];
                matrix[n - 1 - i][n - j - 1] = matrix[j][n - 1 -i];
                matrix[j][n - 1 - i] = matrix[i][j];
                matrix[i][j] = temp;
            }
        }
    }
}
```

- ๋ฐฐ์ด์ 