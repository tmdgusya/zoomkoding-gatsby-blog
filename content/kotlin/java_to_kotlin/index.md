---
emoji: 
title: 코틀린스럽게 리팩토링(자바에서 코틀린으로 책)
date: '2023-01-10 22:30:00'
author: Roach
tags: kotlin
categories: kotlin 책리뷰
---

# 들어가기에 앞서

**이 본글의 모든 내용은 어디까지나 개인적으로 책을 읽고 느낀점이나 정리한 글이며, 저자의 생각과는 다를 수 있습니다.**

## 책을 읽으며 느낀 저자가 리팩토링 하는 방식

일단 Java 코드를 코틀린으로 옮기는 내용에 대해서는 적지 않겠다.  
그 이유는 코틀린 코드를 작성할때 Java 와 별다르게 사용하지 않거나, 이런 부분들도 존재하기 때문이다.  
그래서 기존에 존재하는 코틀린 코드를 저자가 리팩토링 하는 방식으로 리팩토링 해보려고 한다.  

내가 느낀 저자의 여러개의 리팩토링 방식이 있지만 **확장함수로 추출하여 가독성을 올리는 방식**은 아래와 같았다.

1. **독립될수 있는 함수를 추출**한다.
2. **확장함수로 표현 가능하다면 확장함수**로 표현한다.

개인적으로 맘에 드는 부분도 있고, 맘에 들지 않는 부분들도 있지만 13장의 코드는 개인적으로 초반코드보다 훨씬 명확해진것 같아서 이 방법을 통해 예전 내 알고리즘 코드를 리팩토링 해보는 글을 적어보려고 한다.

## 코드 설명

<img width="608" alt="image" src="https://user-images.githubusercontent.com/57784077/211560723-5a8591e4-0f7f-4088-891d-2be1c63ecdf3.png">

문제는 간단하게 지그재그로 노드를 읽는것이다. 첫번째는 3을 읽고, 두번째는 오른쪽부터-왼쪽, 다음에는 왼쪽-오른쪽 ... 이런 방법으로 노드를 읽어나가는 것이다. 그래서 내가 작성하고 통과했던 코드는 아래와 같다.

```kotlin
fun mySolution(root: TreeNode?): List<List<Int>> {
    // rootNode 가 없다면 빈 배열을 리턴
    val _root = root ?: return emptyList()

    // node 를 순회하기 위한 큐
    val queue = LinkedList<Pair<TreeNode, Int>>()
    val printNodeResultByDepth = HashMap<Int, ArrayDeque<Int>>()

    queue.add(_root to 1)

    // 첫번째 노드 출력결과 저장
    printNodeResultByDepth[0] = ArrayDeque()
    printNodeResultByDepth[0]?.add(_root.`val`)

    while (queue.isNotEmpty()) {

        val (node, depth) = queue.pop()
        if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth[depth] = ArrayDeque()

        node.left?.let {
            queue.add(it to depth + 1)
            addListByZigZag(printNodeResultByDepth, depth, it.`val`)
        }

        node.right?.let {
            queue.add(it to depth + 1)
            addListByZigZag(printNodeResultByDepth, depth, it.`val`)
        }

    }
    return printNodeResultByDepth.values.filter { it.isNotEmpty() }.map { it.toList() }
}

private fun addListByZigZag(map: Map<Int,  ArrayDeque<Int>>, depth: Int, value: Int) {
    // addLast
    if (depth % 2 == 1) {
        map[depth]!!.addFirst(value)
    } else {
        map[depth]!!.add(value)
    }
}
```

일단 코드에서 `printNodeResultByDepth[depth] = ArrayDeque()` 를 하는 과정은 해당 Depth 에 결과물을 출력하기 위한 초기화 과정이다. 따라서 이 함수를 함수로 추출하여 리팩터링하자.

```kotlin
private fun init(printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>, depth: Int) {
    printNodeResultByDepth[depth] = ArrayDeque()
}
```

그럼 아래와 같은 코드가 나오게 된다.  
이제 함수를 분리했으니 확장함수로 분리가능한지 고려해보면 충분히 가능해보인다. 확장함수로 바꿔보자.

```kotlin
private fun HashMap<Int, ArrayDeque<Int>>.init(depth: Int) {
    this[depth] = ArrayDeque()
}
```

잘 변경되었고, 호출하는 쪽에서도 이제 아래와 같이 호출가능하다.

```kotlin
printNodeResultByDepth.init(0)
```

```kotlin
    printNodeResultByDepth.init(0)
    printNodeResultByDepth[0]?.add(_root.`val`)
```

아까의 코드에서 위와 같이 해당 depth 를 init 하며 add 를 하는 코드가 있는데, 이를 위해 Map 을 리턴해주도록 하자.

```kotlin
private fun HashMap<Depth, PrintResults>.init(depth: Depth): HashMap<Depth, PrintResults> = this.also { it[depth] = ArrayDeque() }
```

이렇게 코드를 작성하고 나면, 아까의 코드를 아래와 같이 작성할 수 있다.

```kotlin
private fun rootValuePrint(map: HashMap<Int, ArrayDeque<Int>>, depth: Int, value: Int) = map.init(depth).let { it[depth]!!.add(value) }
```

이것도 확장함수로 분리 가능한지 생각해보면 충분히 가능하다.

```kotlin
private fun HashMap<Int, ArrayDeque<Int>>.rootValuePrint(depth: Int, value: Int) = 
    this.init(depth).let { it[depth]!!.add(value) }
```

이렇게 했을때 아까의 코드가 일단은 아래와 같이 변하게 된다.

```kotlin
fun mySolution(root: TreeNode?): List<List<Int>> {
    val _root = root ?: return emptyList()

    val queue = LinkedList<Pair<TreeNode, Int>>()
    val printNodeResultByDepth = HashMap<Int, ArrayDeque<Int>>()

    queue.add(_root to 1)

    printNodeResultByDepth.initAndPrint(0, _root.`val`)

    traversalNodeForSavingResult(queue, printNodeResultByDepth)

    return printNodeResultByDepth
        .values
        .filter { it.isNotEmpty() }
        .map { it.toList() }
}
```



일단 코드를 먼져 나누는 방법을 조금 진행해보자. `while` 문 안의 코드들은 node 를 순회하며 출력결과를 저장하는 코드이니 일단 `traversalNodeForSavingResult()` 라는 함수로 빼보자. 

```kotlin
fun mySolution(root: TreeNode?): List<List<Int>> {
    val _root = root ?: return emptyList()

    val queue = LinkedList<Pair<TreeNode, Int>>()
    val printNodeResultByDepth = HashMap<Int, ArrayDeque<Int>>()

    queue.add(_root to 1)

    // init
    printNodeResultByDepth[0] = ArrayDeque()
    printNodeResultByDepth[0]?.add(_root.`val`)

    traversalNodeForSavingResult(queue, printNodeResultByDepth)
    
    return printNodeResultByDepth.values.filter { it.isNotEmpty() }.map { it.toList() }
}
```

여기서 우리가 처음에 뽑은 `traversalNodeForSavingResult` 노드또한 첫번째 인자로 큐를 사용하고 있는데 이것 또한 확장함수로 추출해보자.

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.traversalNodeForSavingResult(
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) {
    while (this.isNotEmpty()) {

        val (node, depth) = this.pop()
        if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth.init(depth)

        node.left?.let {
            this.add(it to depth + 1)
            addListByZigZag(printNodeResultByDepth, depth, it.`val`)
        }

        node.right?.let {
            this.add(it to depth + 1)
            addListByZigZag(printNodeResultByDepth, depth, it.`val`)
        }

    }
}
```

이 함수안의 `addListByZigZag` 또한 확장함수로 추출하기 좋아보인다. 한번 추출해보자.

```kotlin
private fun Map<Int,  ArrayDeque<Int>>.addListByZigZag(depth: Int, value: Int) = if (depth % 2 == 1) {
    this[depth]!!.addFirst(value)
} else {
    this[depth]!!.add(value)
}
```

뽑아냈더니 코드가 이렇게 변했다.

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.traversalNodeForSavingResult(
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) {
    while (this.isNotEmpty()) {

        val (node, depth) = this.pop()
        if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth.init(depth)

        node.left?.let {
            this.add(it to depth + 1)
            printNodeResultByDepth.addListByZigZag(depth, it.`val`)
        }

        node.right?.let {
            this.add(it to depth + 1)
            printNodeResultByDepth.addListByZigZag(depth, it.`val`)
        }
    }
}
```

그리고 안에서 `node.left.let { ... }` 과 `node.right.let { ... }` 는 중복되어 보이므로 한번 추출해보자. 

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.savingResultAndTraversalNextNode(
    node: TreeNode,
    depth: Int,
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) {
    node.left?.let {
        this.add(it to depth + 1)
        printNodeResultByDepth.addListByZigZag(depth, it.`val`)
    }
}
```

이렇게 함수가 추출되게 되는데, node 나 left 모두 TreeNode 이므로, left 를 지우고 아래처럼 코드를 적자.

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.savingResultAndTraversalNextNode(
    node: TreeNode?,
    depth: Int,
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) = node?.also {
    this.add(it to depth + 1)
}?.let {
    printNodeResultByDepth.addListByZigZag(depth, it.`val`)
}
```

여기까지 했을때 아까 while 문 안속 코드는 아래와 같이 변경된다.

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.traversalNodeForSavingResult(
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) {
    while (this.isNotEmpty()) {
        val (node, depth) = this.pop()
        if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth.init(depth)
        savingResultAndTraversalNextNode(node.left, depth, printNodeResultByDepth)
        savingResultAndTraversalNextNode(node.right, depth, printNodeResultByDepth)
    }
}
```

깔끔해진것 같지만 뭔가 내 기준에서 아쉽다. node.left?.xxx 식으로 진행되는게 좀더 깔끔해보인다.  
그래서 `savingResultAndTraversalNextNode` 함수의 인자로 Queue 를 받도록 하자.

```kotlin
private fun TreeNode?.savingResultAndTraversalNextNode(
    depth: Int,
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
    queue: LinkedList<Pair<TreeNode, Int>>,
) = this?.also {
    queue.add(it to depth + 1)
}?.let {
    printNodeResultByDepth.addListByZigZag(depth, it.`val`)
}
```

하지만 확장함수의 수신객체타입에 Nullable 을 쓰는게 별로 좋아보이진 않는다. 이를 **Non-Null** 로 바꾸자.  
이참에 이름도 Node 를 print 하고 다음 노드로 간다 라는 의미인 `printAndTraversalNextNode` 로 바꾸어 주었다.

```kotlin
private fun TreeNode.printAndTraversalNextNode(
    depth: Int,
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
    queue: LinkedList<Pair<TreeNode, Int>>,
) = this.also {
    queue.add(it to depth + 1)
}.let {
    printNodeResultByDepth.addListByZigZag(depth, it.`val`)
}
```

이제 이걸 이용하게 되면 아까의 코드가 아래와 같이 변한다.

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.traversalNodeForSavingResult(
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) {
    while (this.isNotEmpty()) {
        val (node, depth) = this.pop()
        if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth.init(depth)
        node.left?.printAndTraversalNextNode(depth, printNodeResultByDepth, this)
        node.right?.printAndTraversalNextNode(depth, printNodeResultByDepth, this)
    }
}
```

코드를 스코프 함수를 이용한다면 아래와 같이 줄여볼 수도 있을 것이다.

```kotlin
private fun LinkedList<Pair<TreeNode, Int>>.traversalNodeForSavingResult(
    printNodeResultByDepth: HashMap<Int, ArrayDeque<Int>>,
) = this.let { queue ->
        while (queue.isNotEmpty()) {
            this.pop().also {(_, depth) ->
                if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth.init(depth)
            }.let { (node, depth) ->
                node.left?.printAndTraversalNextNode(depth, printNodeResultByDepth, this)
                node.right?.printAndTraversalNextNode(depth, printNodeResultByDepth, this)
            }
        }
}
```

여기까지 어느정도 리팩토링이 됬으나, Type 이 너무 보기 힘들다.  
사실상 위 코드에서 `Int` 타입은 Depth 의 역할을 하고 있으므로 typealias 를 써보자.  

```kotlin
private typealias Depth = Int
private typealias PrintResults = ArrayDeque<Depth>
```

이걸 써서 기존의 Int 부분을 Depth 로 바꿔주면 한결 어떤것을 뜻하는지 조금 더 나아지는 것을 확인할 수 있다.  
조금 더 가독성을 올리기 위해 ArrayDeque<Depth> 도 PrintResults 로 바꿔보자.

```kotlin
val printNodeResultByDepth = HashMap<Depth, PrintResults>()
```

이전에는 `HashMap<Int, ArrayDeque<Int>>` 였는데 이제 좀 더 가독성이 좋아졌다고 생각한다.  

## 코틀린 스코프 함수를 이용해 파이프라인처럼 리팩토링

**책에서는 굳이 이렇게 리팩토링을 하지는 않는것 같고, 여기 밑에서 부터는 내 개인 의견으로 순전히 실험적으로 리팩토링을 해보는 것 이다.**

이제 스코프 함수로 파이프라인을 엮은것 처럼 리팩토링 해보자.
`mySolution` 함수도 아래와 같이 리팩터링 가능하다.  

```kotlin
fun mySolution(root: TreeNode?): List<List<Int>> = root?.let { root ->
    val queue = LinkedList<Pair<TreeNode, Depth>>()
    val printNodeResultByDepth = HashMap<Depth, PrintResults>()

    queue.add(root to 1)

    // init
    printNodeResultByDepth.initAndPrint(0, root.`val`)

    queue.traversalNodeForSavingResult(printNodeResultByDepth)

    return printNodeResultByDepth.values.filter { it.isNotEmpty() }.map { it.toList() }
} ?: emptyList()
```

여기서 스코프함수로 살짝만 바꿔본다면 아래와 같이 변경할 수 있다.

```kotlin
fun mySolution(root: TreeNode?): List<List<Int>> = root?.let { root ->
    val queue = LinkedList<Pair<TreeNode, Depth>>()
    val printNodeResultByDepth = HashMap<Depth, PrintResults>()

    (queue to printNodeResultByDepth)
        .also { (queue, _) -> queue.add(root to 1) }
        .also { (_, printNodeResultByDepth) -> printNodeResultByDepth.initAndPrint(0, root.`val`) }
        .also { (queue, printNodeResultByDepth) -> queue.traversalNodeForSavingResult(printNodeResultByDepth) }
        .let { (_, printNodeResultByDepth) ->
            printNodeResultByDepth.values.filter { it.isNotEmpty() }.map { it.toList() }
        }
} ?: emptyList()
```

흠, 깔끔한지는 잘 모르겠다. 일단 `printNodeResultByDepth.values.filter { it.isNotEmpty() }.map { it.toList() }` 부분은 `toResult()` 라는 확장함수로 추출해보자.

```kotlin
private fun HashMap<Depth, PrintResults>.toResult() =
    this.values.filter { it.isNotEmpty() }.map { it.toList() }
```

추출하고 나면 코드가 이렇게 변한다.

```kotlin
fun mySolution(root: TreeNode?): List<List<Int>> = root?.let { root ->
    val queue = LinkedList<Pair<TreeNode, Depth>>()
    val printNodeResultByDepth = HashMap<Depth, PrintResults>()

    (queue to printNodeResultByDepth)
        .also { (queue, _) -> queue.add(root to 1) }
        .also { (_, printNodeResultByDepth) -> printNodeResultByDepth.initAndPrint(0, root.`val`) }
        .also { (queue, printNodeResultByDepth) -> queue.traversalNodeForSavingResult(printNodeResultByDepth) }
        .let { (_, printNodeResultByDepth) -> printNodeResultByDepth.toResult() }
} ?: emptyList()
```

최종 코드는 아래와 같다. 

```kotlin
private typealias Depth = Int
private typealias PrintResults = ArrayDeque<Depth>
private typealias Queue = LinkedList<Pair<TreeNode, Depth>>

fun mySolution(root: TreeNode?): List<List<Int>> = root?.let { root ->
    (Queue() to HashMap<Depth, PrintResults>())
        .also { (queue, _) -> queue.add(root to 1) }
        .also { (_, printNodeResultByDepth) -> printNodeResultByDepth.initAndPrint(0, root.`val`) }
        .also { (queue, printNodeResultByDepth) -> queue.traversalNodeForSavingResult(printNodeResultByDepth) }
        .let { (_, printNodeResultByDepth) -> printNodeResultByDepth.toResult() }
} ?: emptyList()

private fun HashMap<Depth, PrintResults>.toResult() =
    this.values.filter { it.isNotEmpty() }.map { it.toList() }

private fun HashMap<Depth, PrintResults>.init(depth: Depth): HashMap<Depth, PrintResults> = this.also { it[depth] = ArrayDeque() }

private fun HashMap<Depth, PrintResults>.initAndPrint(depth: Depth, value: Int) =
    this.init(depth).let { it[depth]!!.add(value) }

private fun LinkedList<Pair<TreeNode, Depth>>.traversalNodeForSavingResult(
    printNodeResultByDepth: HashMap<Depth, PrintResults>,
) = this.let { queue ->
        while (queue.isNotEmpty()) {
            this.pop().also {(_, depth) ->
                if (!printNodeResultByDepth.containsKey(depth)) printNodeResultByDepth.init(depth)
            }.let { (node, depth) ->
                node.left?.printAndTraversalNextNode(depth, printNodeResultByDepth, this)
                node.right?.printAndTraversalNextNode(depth, printNodeResultByDepth, this)
            }
        }
}

private fun TreeNode.printAndTraversalNextNode(
    depth: Int,
    printNodeResultByDepth: HashMap<Depth, PrintResults>,
    queue: LinkedList<Pair<TreeNode, Depth>>,
) = this.also {
    queue.add(it to depth + 1)
}.let {
    printNodeResultByDepth.addListByZigZag(depth, it.`val`)
}

private fun Map<Depth, PrintResults>.addListByZigZag(depth: Depth, value: Int) = if (depth % 2 == 1) {
    this[depth]!!.addFirst(value)
} else {
    this[depth]!!.add(value)
}
```

## 후기

분명 내 리팩토링을 보면서 맘에 안드는 사람도 반드시 존재할 것이다.  
왜냐면 나도 하면서 조금 긴가민가 하는 부분이 많았기 때문이다. 그런 부분이 있다면 댓글로 피드백을 남겨서 같이 이야기 해보고 더 좋은 방향을 찾아보면 좋을것 같다. MySolution 만 본다면 스코프함수로 바꿨을때 절차를 수행하는게 마치 파이프라인처럼 보여서 괜찮아 보이기도 했지만, 과연 스코프로 교체를 굳이했어야 했나? 라는 생각도 있다. 오히려 가독성이 누군가에겐 안좋아 보이지 않을까 싶기도 하다. 