---
layout: post
title: "Tips and tricks for vue with typescript"
date: 2019-6-23
comments: true
sharing: true
categories: [typescript, vue]
description: My top 5 Vue tips and tricks for an easier and faster development experience
---

I've been working on a vue project with typescript for almost a year now. Along the way, we found a few little things that I would like to share. Everything shown here is buried in vue's documentation somewhere, you may need to dig a little, but it is all there.

Note that all examples below use single file components and typescript 3. The project was created using vuecli 3.

## #1 typing $store and $refs in vue component
When using the $store or $refs in a component, there is no typing available due to how vue wire the component together. You can, however, use regular typescript typing in the component class. The only catch is that since vue is assigning values to the properties you create, you need to use the ``!`` operator in the property. This signals the transpiler that this property is going to be set and no warnings need to be issued. Additionally, this approach allows you to easily call methods from imported components which is sweet.

<script src="https://gist.github.com/jlucaspains/2f1da248d8f78cf11f817c2aeed4cf91.js"></script>

## #2 two ways to pass prop value to component
If you get an ``invalid prop: type check failed for prop...`` error for a number prop in a component. Chances are the problem is caused by how you pass the values to your props. When you pass a value to a prop like `myProp="1"` the value will be a string, however, when you pass ``:myProp="1"`` the value is passed as a number or appropriate type.

<script src="https://gist.github.com/jlucaspains/73a5207e26e26e7d52122ddfbdfba881.js"></script>

## #3 no d.ts typing? no problem
While there is overall great support for typescript in most popular javascript tools out there. Some of them do not. When this happens, you can create a simple module file that will prevent the transpiler from throwing errors. You will not get the typings either, but at least your project will transpile normally.

I typically put all my "typings" in a ``typings`` folder inside the ``src`` folder.

<script src="https://gist.github.com/jlucaspains/2db0291be9fbab0b0297e62687c2306e.js"></script>

## #4 styling sub-components
Sometimes you want to override another component's scoped styling. When using SCSS I'm able to use the `/deep/` notation to tell vueloader to apply the styling to child components as well. 

<script src="https://gist.github.com/jlucaspains/5a3d9c4f6e3387402b6b45df2490701b.js"></script>

## #5 loading json with settings before app starts
The projects I work on are typically large applications with multiple environments and several developers working on the same code base. To allow for some flexibility, we remove anything that can possibly change between environments into a configuration file. We need to make a few changes to vue loading to get a config file loaded before the application is instantiated.

The following json contains some configurations we want at hand at application startup. It should be placed within the ``public`` folder so it gets deployed to the root of the web app.
<script src="https://gist.github.com/jlucaspains/922c60645fb852e783cb4a41a6e16254.js"></script>

A config interface can help with typing...
<script src="https://gist.github.com/jlucaspains/40de3b7fb7bd6fe74803e1ff757439a1.js"></script>

Due to the way imports are done in vue (or most js applications) we need to delay the application loading in main.ts till we have our settings loaded. To do that, we wrap the Vue app creation in a ajax call to get the configuration. 

Note that the store is actually exposed as a function so we can also delay the instantiation of it till we have the settings.

<script src="https://gist.github.com/jlucaspains/ef060a082a4ddc6d28ca19aeed394d59.js"></script>

Finally, keep a development config file in the ``public`` folder and replace it before publishing the application to each environment. 

That's it for now. Cheers!