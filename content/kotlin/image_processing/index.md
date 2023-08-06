---
emoji: 
title: Image Processing in Kotlin with Scrimage
date: '2023-08-06 22:00:00'
author: Roach
tags: kotlin
categories: kotlin image-process
---

# Image Processing in Kotlin with Scrimage

## What is Scrimage?

I have been searching for a good image processing library that can support converting images to webp and resizing images for Kotlin, and I had found this one. **Scrimage** is an immutable, functional, and performant JVM library for manipulating images. 
I will tell you how to use this library for Kotlin Notebook.

## Kotlin Notebook?

Kotlin Notebook is a tool that allows you to write and execute Kotlin code likely to Jupyter Notebook.

<img width="1382" alt="image" src="https://github.com/sksamuel/scrimage/assets/57784077/4cd1d33b-d130-41c7-8428-4cde3877cb3c">

First, You have to set up an environment for Kotlin Notebook. So, you should click the button below and add libraries.

<img width="552" alt="image" src="https://github.com/sksamuel/scrimage/assets/57784077/6c4de8d3-a7bb-496c-bf8f-f14c1318c14a">

## Road Image and Resize Image

First, I'm going to read an image using **ImmutableImage Loader**.
ImmutableImage always returns a **cloned instance of this image**. But, Operations can be performed **without a copying step!**. That's why we can use this loader for reading and processing images.

<img width="365" alt="image" src="https://github.com/sksamuel/scrimage/assets/57784077/fd3958bb-ded3-497c-81b4-d335a580150b">

I already have the image in the resources folder. So, I'm going to read the image file below.

```kotlin
import java.io.File
import com.sksamuel.scrimage.ImmutableImage

// read Image File
val imageFile = File("../src/main/resources/test_image.png")
// Image file to input stream
val inputImage = ImmutableImage.loader().fromFile(imageFile)

print(imageFile)
```

Create a New Image file called **"resized_image.png"** in the same folder.

```kotlin
val resizedImage: File = File("src/main/resources/resized_image.png")
```

And, We'll choose the **JpegWriter** for ImageWriter Interface. The ImageWriter Interface is the format writer that you wish to persist to. You can choice the **PngWriter**, **JpegWriter**, **GifWriter**, **WebpWriter**, etc.

So, I'll choose the **JpegWriter** for this example.

```kotlin
import ar.com.hjg.pngj.PngWriter
import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.ScaleMethod
import com.sksamuel.scrimage.nio.JpegWriter

val writer = JpegWriter()
val resultFile = inputImage.resize(0.75).output(writer, resizedImage)
```

Now, you can see the resized image file in the same folder. (It might be seeing slower than you expected.)

<img width="1503" alt="image" src="https://github.com/sksamuel/scrimage/assets/57784077/2df78c96-1684-4922-b0fe-e1b00b9a748e">

This code is on my GitHub [repository](https://github.com/tmdgusya/kotlin-image-processing-test/blob/main/scripts/Image-Resize.ipynb).


## Convert Image to Webp

Scrimage also supports converting images to webp. So, I'm going to convert the image to webp. 

```kotlin
import java.io.File
import com.sksamuel.scrimage.ImmutableImage

// read Image File
val imageFile = File("../src/main/resources/test_image.png")
// Image file to input stream
val inputImage = ImmutableImage.loader().fromFile(imageFile)

print(imageFile)
```

Read the image file in the same way. 

```kotlin
import java.io.File

val webPImage: File = File("../src/main/resources/webp_image.webp")
```

And, Create New Image file called by **"webp_image.webp"** at the same folder.

```kotlin
import com.sksamuel.scrimage.webp.WebpWriter

val writer = WebpWriter.DEFAULT
inputImage.output(writer, webPImage)
```

You can now see the **webp image file** in the same folder. (It might be seeing slower than you expected.)

<img width="1503" alt="image" src="https://github.com/sksamuel/scrimage/assets/57784077/be5d4227-0d0a-4ec8-ae27-e638feabccad">

You can also see this code on my GitHub [repository](https://github.com/tmdgusya/kotlin-image-processing-test/blob/main/scripts/convert_img_to_webp.ipynb)

## Resize and Convert the Image to Webp

Now, I'm going to resize the image and convert the image to webp. 

```kotlin
import java.io.File
import com.sksamuel.scrimage.ImmutableImage

// read Image File
val imageFile = File("../src/main/resources/test_image.png")
// Image file to input stream
val inputImage = ImmutableImage.loader().fromFile(imageFile)

print(imageFile)
```

Read the image file by the same way. 

```kotlin
val processedImage: File = File("../src/main/resources/processed_image.webp")

print(processedImage)
```

And, Create a New Image file called **"processed_image.webp"** in the same folder.

```kotlin
import ar.com.hjg.pngj.PngWriter
import com.sksamuel.scrimage.ImmutableImage
import com.sksamuel.scrimage.ScaleMethod
import com.sksamuel.scrimage.webp.WebpWriter

val writer = WebpWriter.DEFAULT
val resultFile = inputImage.resize(0.75).output(writer, processedImage)
```

Now, you can see the **webp image file** in the same folder.

<img width="1456" alt="image" src="https://github.com/sksamuel/scrimage/assets/57784077/2c57e46f-d7b7-4aba-94c2-f749c4800451">

You can also see this code on my GitHub [repository](https://github.com/tmdgusya/kotlin-image-processing-test/blob/main/scripts/resize_and_convert_webp.ipynb)

## Conclusion

As you can see, Scrimage is a very useful library for image processing. You can use it for resizing, converting, and processing images in a concise way. Piping functions are also very useful and readable. I hope this article will help you to understand the Scrimage Library. Thank you for reading this article.