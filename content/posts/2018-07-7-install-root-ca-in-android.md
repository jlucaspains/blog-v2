---
layout: post
title: "Install Root CA cert in Android emulator"
date: 2018-7-7
comments: true
sharing: true
categories: 
  - xamarin-android
description: >-
  You if you need to access intranet TLS applications from an Android emulator, you will need to install your CA certs. This is how you can do it.
---

When developing a small Xamarin forms app I wanted the android emulator to connect to an intranet identity provider. That didn't work. The id server was using an SSL certificate issued by an untrusted CA. Here's what I did to get it working.

First, you will need the CA certificate so android can trust the SSL cert. If you don't have the cert, you can export it using [Chrome on mac](https://stackoverflow.com/questions/25940396/how-to-export-certificate-from-chrome-on-a-mac) or Chrome on windows:

![Export Certificate](/images/posts/ExportCertificate.gif)
*Exporting certificate using chrome*

Next, push the .cer to the emulator using adb push command. Note that even though I'm pushing the cert to the sdcard it actually shows in a different location. I'm not sure why my emulator is doing that but I've seen others that work just fine. Just make sure to search in all folders when installing the cert in the emulator.

<pre class="brush: ps">
adb push path_to_cert\ca_cert_file.cer /sdcard/ca_cert_file.cer
</pre>

Before installing the certificate, you will need to enable device lockscreen security. Finally, install the certificate using Settings app:

![Import Certificate](/images/posts/ImportCertificateAndroid.gif)
*Importing certificate to Android Emulator*

After import, you can check your certs in User credentials under Encryption & credentials and more importantly, navigate to the SSL site without errors.

Cheers!