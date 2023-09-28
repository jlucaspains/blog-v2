---
layout: post
title: "A little side project - Sharp cert manager"
date: 2023-09-27
categories:
  - security
  - containers
description: >- 
  Have you ever wanted something to just warn you when your TLS certs are about to expire? I have and I decided to build it. Check out my new open-source project: Sharp Cert Manager.
cover:
    image: "https://github.com/jlucaspains/sharp-cert-manager/raw/main/docs/demo.jpeg"
    alt: "Sharp Cert Manager"
    caption: "Sharp Cert Manager"
---

Let's face it, managing TLS certs is a pain (no pun intended). If you have only a few, it is manageable. A simple recurring calendar reminder to make sure you reissue or download and install the new cert will work. However, what happens when you have dozens? Also, what if the responsibility is shared accross different teams? As the saying goes "too many cooks spoil the broth". While there are great cloud native solutions, like Azure Key Vault, many enterprise environments are not capable of using them. That is why I started a new open-source side-project and I think it can be useful to more people.

## Sharp Certificate Manager

I'm calling the new project Sharp Cert Manager as I am planning to include TLS managing capabilities on top of just checking certificates. Anyway, Sharp Cert Manager is a tool for tracking and maintenance of TLS certs. Some of the features provided/planned are:

1. **User-Friendly Interface:** With a user-friendly front-end written in Svelte, Sharp Cert Manager is easy to navigate and provides a seamless user experience. You can effortlessly view the status of your certificates and, in the future, take action when necessary.

2. **Certificate Expiration Monitoring:** Sharp Cert Manager periodically checks your TLS certificates, alerting you well in advance of their expiration date. This proactive approach ensures you can renew your certificates before they become a security risk.

3. **Highly Performant Backend:** The backend of Sharp Cert Manager is written in Go, a language known for its speed and efficiency. This ensures quick and reliable certificate checks, even for large-scale deployments.

4. **Certificate Authority Integration**: To automate the issuance and renewal of TLS certificates, Sharp Cert Manager will integrate with supported Certificate Authorities (CAs) like Let's Encrypt. This feature is not available in version 1.0.

5. **Open Source:** Sharp Cert Manager is open source under an MIT license, meaning it's free to use and can be customized to meet your specific needs. You can access and contribute to the project on GitHub at [github.com/jlucaspains/sharp-cert-manager](https://github.com/jlucaspains/sharp-cert-manager).

6. **Docker Support:** Deploying Sharp Cert Manager is a breeze thanks to its availability on DockerHub as `jlucaspains/sharp-cert-manager`. The containerization allows you to run the application in any cloud environment or in an on-prem data center with ease.

The version currently published is in preview stage. The Sharp Cert Manager app is meant as a behind the scenes companion to modern web applications and it is not recommended as a public facing application.

## How to get started

Getting started with Sharp Cert Manager is simple:

1. Pull the Docker container from DockerHub:

```bash
docker pull jlucaspains/sharp-cert-checker
```

2. Run the container:

```bash
docker run -it -p 8000:8000 `
  --env ENV=DEV `
  --env SITE_1=https://blog.lpains.net `
  --env CHECK_CERT_JOB_SCHEDULE=0 0 * * * `
  --env WEBHOOK_URL=[teams or slack URL] `
  --env WEBHOOK_TYPE[teams or slack] `
  jlucaspains/sharp-cert-checker
```

3. Access the application by navigating to [http://localhost:8000](http://localhost:8000) in your web browser.

4. The CRON based scheduler makes it easy to periodically check for certificate expirty. In case of a warning, or error, the teams or slack webhooks are called.

## Demo
The big poster image is a demo of the frontend running in my local environment. The following images are the messages sent to Teams and Slack when warnings or errors are detected.

Teams message
![Teams demo](https://github.com/jlucaspains/sharp-cert-manager/raw/main/docs/TeamsDemo.jpg)

Slack message
![Slack demo](https://github.com/jlucaspains/sharp-cert-manager/raw/main/docs/SlackDemo.jpg)

## Closing
Check the full project with code and documentation on [github](https://github.com/jlucaspains/sharp-cert-manager). I hope you find it useful and please create an issue if you have any feedback.

Cheers,
Lucas