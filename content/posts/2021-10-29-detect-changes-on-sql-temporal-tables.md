---
layout: post
title: "Detecting changes on SQL Server Temporal Changes"
date: 2021-10-29
categories:
  - SQLServer
description: >-
  SQL Server temporal tables are a great way to build data audit and to see the state of data at a point in time. However, if you want to calculate what changed over a period of time, it gets a little trickier. Keep reading to see how.
cover:
    image: "/images/posts/analog-clock.jpg"
    alt: "Time"
    caption: "Photo by Djim Loic on [Unsplash](https://unsplash.com/photos/ft0-Xu4nTvA)"
---

[SQL Server system-versioned temporal tables](https://docs.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables?view=sql-server-ver15) provide a powerful way to keep data history for a table.  It provides a way to query data as of a point in time, or the changes between a time period. Check [the docs](https://docs.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables?view=sql-server-ver15) for more detail.

While history tables are great for many scenarios based off history data. When you need to calculate delta changes it gets a little more complicated as I am sure Temporal Tables were not designed for that purpose. In this case, delta means that over a period of time we want to get added records, changed records with calculation of differences, and deleted records.

To demonstrate how that works, here is a simplified example table with system versioning turned on:

```sql
CREATE TABLE dbo.Orders (
  Id bigint NOT NULL Identity(1,1),
  CustomerId bigint NOT NULL, --not really relevant for the example
  TotalValue decimal(18,6) NOT NULL,
  CONSTRAINT PK_Orders PRIMARY KEY CLUSTERED (Id),
)

ALTER TABLE dbo.Orders 
      ADD ValidFrom datetime2 GENERATED ALWAYS AS ROW START HIDDEN NOT NULL CONSTRAINT DF_Orders_ValidFrom DEFAULT (SYSUTCDATETIME())
    , ValidTo datetime2 GENERATED ALWAYS AS ROW END HIDDEN NOT NULL CONSTRAINT DF_Orders_ValidTo DEFAULT ('9999-12-31 23:59:59.9999999')
    , PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo])

ALTER TABLE dbo.Orders SET (SYSTEM_VERSIONING = ON ( HISTORY_TABLE = [dbo].[OrderHistory], HISTORY_RETENTION_PERIOD = 1 Year ))
```

To get the wanted delta changes, we will need two dates as shown below. Note that both dates must be in UTC time zone as the ``ValidFrom`` and ``ValidTo`` columns will be saved in UTC too.

```sql
DECLARE @DeltaStart datetime2 -- for each run, this will be the value of @DeltaEnd of the previous run
DECLARE @DeltaEnd datetime2 = getutcdate() -- easier to put a limit so we know exactly what the next @DeltaStart will be
```

Finding new and updated records is fairly straight-forward:

```sql
-- 1. Query the current record using ValidFrom and ValidTo to detect changes
-- 2. Left join to that same record as it was at the @DeltaStart, if the record was changed, updated won't be null
-- 3. Get columns from the current record and calculate ValueDiff using current.TotalValue - updated.TotalValue
SELECT current.Id, current.CustomerId, current.TotalValue, Status = IIF(IsNull(updated.Id, 0) = 0, 'INSERTED', 'UPDATED')
     , ValueDiff = current.TotalValue - IsNull(updated.TotalValue)
  FROM dbo.Orders current
       LEFT  JOIN dbo.Orders for system_time as of @DeltaStart updated ON updated.Id = current.Id
 where current.ValidFrom > @DeltaStart and current.ValidTo <= @DeltaEnd
```

Deleted records will be removed from the main system-versioned table (Orders). However, they will remain in the history table (OrderHistory). Thus, we can use the history table as the start and if the same record is not found in current table, it was deleted:

```sql
-- 1. Look into history records that were closed between @DeltaStart and @DeltaEnd
-- 2. Left join with current record, if the current is null, the record was deleted
SELECT history.Id, history.CustomerId, history.TotalValue, Status = 'DELETED'
     , ValueDiff = 0 - history.TotalValue
  FROM dbo.OrderHistory history
       LEFT  JOIN dbo.Orders current ON updated.Id = current.Id
 where ValidTo > @DeltaStart and ValidTo <= @DeltaEnd and current.Id is null
```

Let's wrap this in a procedure to make it easier to consume:

```sql
CREATE OR ALTER PROCEDURE spGetOrderDeltaChanges (@DeltaStart datetime2, @DeltaEnd datetime2)
AS BEGIN
  SELECT current1.Id, current1.CustomerId, current1.TotalValue, [Status] = IIF(IsNull(updated1.Id, 0) = 0, 'INSERTED', 'UPDATED')
      , ValueDiff = current1.TotalValue - IsNull(updated1.TotalValue, 0)
    FROM dbo.Orders current1
        LEFT  JOIN dbo.Orders for system_time as of @DeltaStart updated1 ON updated1.Id = current1.Id
  WHERE current1.ValidFrom > @DeltaStart and current1.ValidFrom <= @DeltaEnd
  UNION
  SELECT history.Id, history.CustomerId, history.TotalValue, [Status] = 'DELETED'
      , ValueDiff = 0 - history.TotalValue
    FROM dbo.OrderHistory history
        LEFT  JOIN dbo.Orders current2 ON history.Id = current2.Id
  where history.ValidTo > @DeltaStart and history.ValidTo <= @DeltaEnd and current2.Id is null
END
```

Testing time! First, let's add some records:

```sql
-- for the first run, we have no way to get @DeltaStart so we just use some time before the insert
DECLARE @DeltaStart datetime2 = dateadd(minute, -1, getutcdate())

INSERT INTO dbo.Orders (CustomerId, TotalValue)
values (1, 100)
     , (2, 100)

DECLARE @DeltaEnd datetime2 = getutcdate()

exec spGetOrderDeltaChanges @DeltaStart, @DeltaEnd

-- don't forget to store the value of @DeltaEnd for the next run
```

|Id|CustomerId|TotalValue|ChangeType|ValueDiff|
|-|-|-|-|-|
|1|1|100|INSERTED|100|
|2|2|100|INSERTED|100|

This is self-explanatory, so let's try to update record 1 and see the result:

```sql
DECLARE @DeltaStart datetime2 -- get the value from @DeltaEnd from the previous run

UPDATE dbo.Orders
   SET TotalValue = 200
 WHERE Id = 1
 
DECLARE @DeltaEnd datetime2 = getutcdate()

exec spGetOrderDeltaChanges @DeltaStart, @DeltaEnd
```

|Id|CustomerId|TotalValue|ChangeType|ValueDiff|
|-|-|-|-|-|
|1|1|200|UPDATED|100|

Note that record 2 was not touched so it won't show on the delta results. Also, the ValueDiff column is only 100 as TotalValue was updated from 100 to 200. Now, let's delete record 2 and see what happens:

```sql
DECLARE @DeltaStart datetime2 -- get the value from @DeltaEnd from the previous run

DELETE dbo.Orders
 WHERE Id = 2

DECLARE @DeltaEnd datetime2 = getutcdate()

exec spGetOrderDeltaChanges @DeltaStart, @DeltaEnd
```

|Id|CustomerId|TotalValue|ChangeType|ValueDiff|
|-|-|-|-|-|
|2|2|100|DELETED|-100|

This time, we only show the deleted record. Note that the ValueDiff will be negative as the TotalValue changed from 100 to 0 (or nothing).

The use cases for this is limited, but though it was not explicitly designed for this, system-versioned tables can be used to calculate delta changes of a table's data. The changes will accumulate from ``@DeltaStart`` to ``@DeltaEnd`` so however many transactions occur over this time period in ``dbo.Orders`` will be reported when the procedure is executed.

That's about it for today. 

Cheers!

Lucas