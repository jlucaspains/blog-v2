---
layout: post
title: "Self destructing data with Cosmos DB"
date: 2023-08-25
categories:
  - azure
description: >- 
  Let it blow with CosmosDB TTL feature.
cover:
    image: "/images/posts/self-destruct.jpg"
    alt: "Self destruct"
    caption: "Photo by [Jeff Kingma](https://unsplash.com/@kingmaphotos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/-lLWCvEoFJM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
  "
---

I am working on a share feature for Sharp Cooking that will allow users to share recipes online. This is the first time a feature will require storing data outside of the local app context, and Cosmos DB is a great option for implementing it. First, it provides a free tier that should be sufficient for my users. Second, Sharp Cooking already stores recipes as documents in the browser, so it should be easy to send the same data to Cosmos DB. While there is no personally identifiable information or anything sensitive involved, I prefer not to keep anything posted by a user for longer than a few hours. Typically, I would write a function or something similar to run on a schedule and delete any stale data. In Cosmos DB, there is an easier way.

Cosmos DB with NoSQL provider includes the ability to automatically delete data after a set amount of time has elapsed. This feature is called Time to Live (or TTL) and can be applied at both the container level and the item level. The TTL for an item or container is defined in seconds, so a value of 60 means the record expires in one minute.

To use TTL, you will need to enable it in the container settings:

![CosmoDB TTL](/images/posts/cosmosdb-time-to-live-setting.png)

Note that you can enable and set a default TTL for all container items, or you can enable it and let each item define its own TTL. For Sharp Cooking, I decided to set the TTL per item. To do that, include a `ttl` property at the object root when creating an item in the container:

```json
{
  "id": "1",
  "description": "Description",
  "ttl": 3600
}
```

The above record will expire after one hour and be deleted soon after.

A few other notes:
1. The TTL value is relative to the `_ts` field (i.e. last updated time stamp), so every time you update the record, the TTL resets.
2. TTL is more about expiration than the exact delete time. You should expect your records to survive a bit longer than the TTL value.
3. You can combine default TTL on the container with TTL on each item. The TTL from the item will win against the default TTL in these scenarios.

That's it. Use TTL to clean up stale data and never build another scheduled task for this purpose again. For complete documentation on Cosmos DB TTL, see the [Azure Docs](ttps://learn.microsoft.com/en-us/azure/cosmos-db/nosql/time-to-live).

Cheers,

Lucas