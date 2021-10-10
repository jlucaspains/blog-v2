---
layout: post
title: "Using html5 canvas to build a WYSIWYG label designer"
date: 2017-01-31
comments: true
sharing: true
categories: 
  - web
description: >-
  How hard can it be to write my own thermal label design application? Turns out that it is very hard indeed.
---

Fact check: market thermal label systems are freaking expensive. Maybe I could build my own label WYSIWYG designer? Should be simple, right?

To spice things up, I decided to try building this as a web solution. Thus, I started playing with html5 canvas to draw text, barcodes, rectangles and images. Once the design was created I could save the configuration for the items drawn and create actual printer specific commands.

A quick research showed that someone had already done something similar to what I wanted: [Teynon's Label Designer](https://github.com/teynon/ZPL-Label-Designer). However, the UI could use some improvement and it needed some features like content rotation, more control over layout properties and a document outline. Then I thought "go big or go home!" and decided to also convert the solution to typescript. Let the fun begin!

Check out the code on [github](https://github.com/jlucaspains/Label-Designer)

Or maybe just a [demo](https://jlucaspains.github.io/Label-Designer/index.html)

The cool stuff (context = canvas.getContext("2d")):

  * In order to add interactivity to the canvas, make it redraw itself after each user interaction. Although that can cause the canvas to refresh hundreds of times during a drag operation, it doesn't really cause a noticeable performance impact.
  * Use context.fillText() to draw text
  * Use context.fillRect() to draw a rectangle
  * Use context.drawImage() to draw an image
  * Use [JsBarcode](https://github.com/lindell/JsBarcode) to draw a barcode image into a canvas and transfer it to the main canvas by using context.drawImage(canvasWithBarcode[0], x, y)
  * To draw something rotated, first rotate the context itself context.rotate((angle * Math.pi) / 180) then draw the component desired and finally context.restore()

The not so cool stuff:

  * Scenario: you want to print a 3" x 4" label in a thermal printer that is 200DPI. The desired label should have a single text block of 1" in height or 200 dots. Your canvas measure a proportional size in pixels. Say 300px x 400px. Therefore it is rather easy to guess the text block should measure 100px (300px / 3"). Sounds easy? Unfortunately you won't be able to translate everything, for instance, text blocks will require the actual printer fonts otherwise the final output won't be loyal to the design.
  * The conversion of the canvas components metadata to printer command can be troublesome. There are multiple printer languages and each printer model has slight differences.

To make this work correctly it is essential that you have access to the printer fonts. Also, there might be some customization for each printer model you want to support.

That's all for now. Have fun!