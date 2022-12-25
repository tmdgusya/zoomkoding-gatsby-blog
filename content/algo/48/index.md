---
emoji: 🧮
title: LEETCODE 48. Rotate Image(Kotlin)
date: '2022-12-11 19:30:00'
author: Roach
tags: algorithm leetcode
categories: algorithm
---

## 문제 이해

- 2D 행렬을 시계 방향으로 90도 회전시키는 것

## 풀이 방법 추상화(수도 코드)

1. 아래에서 부터 위로 읽으면 그게 바뀌어야 할 위치

```
1 2 3
4 5 6
7 8 9
```

위 큐브의 경우 [7, 4, 1, 8, 5, 2, 9, 6, 3] 처럼 첫번째 줄부터 아래에서 부터 
위로 글을 읽으면 됨.

1. 일단 위 처럼 아래에서 부터 위로 읽어서 하나의 긴 배열을 만듬

2. 각 위치에서 자신이 바뀌어야 할 위치는 1차원 배열 저장소의 인덱스를 큐브의 크기(N) 으로 나눴을때 [몫, 나머지] 인덱스에 넣으면 됨.  
예를 들면 3 크기의 큐브에서 저장소[3] 의 위치는 큐브[3/3, 3%3] 이므로 [1, 0] 이 됨.

## 코드로 구현

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

## 회고

- 접근법

문제를 읽다보니 아래에서 위로 읽는게 규칙이였음. 
근데 아쉬운게 뭔가 수학적으로 딱 봐도 계산이 될것 만 같은 공식처럼 느껴짐.  
애초에 이렇게 스토어를 만들어야 하는지도 의문.. 근데 다른 2D 매트릭스를 만드는게 금지니깐 이렇게 할 수 밖에 없었음.

- 다른 풀이 방법은 없었는지?

역시 세개를 동시에 바꾸는 방법이 존재했음.

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

- 배운점