{
  "title": "C# 表抽象处理库",
  "profile": "表抽象处理库",
  "create_at": "2021-07-12T00:00:00",
  "update_at": "2021-07-12T00:00:00"
}

# CSharpDataLib

## 介绍
一个简单的`C#`数据操作工具库, 对于简化数据操作非常有用。
很多时候对于数据拷贝，需要写很多代码, 
这里直接将这些操作抽象成了表，例如增加，`s1.InsertItemDict("tableName1", dic);`
`dic`即希望插入的数据词典结构, 对于`SQLServer`，`MySQL`，`SQLite`均可以这样操作。

目前加入的`SQLServer`, `MySQL`, `Redis`, `Excel`, `SQLite`, `MongoDB`, `Csv文件导入`。

> 1. 注意，请不要在生产中直接使用，会有安全问题。
>    这个开发库是用来快速处理数据拷贝的，建议在安全环境中使用。
> 3. 目前除`SQLServer`, 其他支持还均不够完善。

## 使用方法
### 连接数据库
```C#
// Connect
using (SQLServerClientService  = SQLServerClientService.GetInstance(conn2)) 
{
  // Do Something
}

// Nested Connect
using (SQLServerClientService s1 = SQLServerClientService.GetInstance(conn1))
{
    s1.ChangeDataBase("Demo1");
    using (SQLServerClientService s2 = SQLServerClientService.GetInstance(conn1))
    {
      // Connect Success
    }
}

由于数据库不支持嵌套事务，所以这里会首先提交上一个事物，然后新开一个事务。
如果需要嵌套，可以`new SQLServerClientService()`重新构建一个连接再处理。
```

### Insert
```C#
Data d = new Data(){ Age = 1 };
s1.InsertItem<Data>("Data", d);

// or just a Dictionry.

Dictionary<string, object> d = new Dictionary<string, object>();
s1.InsertItemDict("Data", d);
```

### SELECT && Update && Delete
```C#
s1.GetItemDict("Data", filter, new List<string>() { "Age", "Name" });

FilterCondition filter = new FilterCondition("Age", TableCompareType.EQ, 20);
s1.UpdateItemDict("Data", filter, "ID", Guid.NewGuid());

s1.RemoveItem<Data>("Data", filter);
```

### 批处理操作 Batch Insert
这里`BulkInsertItemList`仅支持`SQLServer`, 其他如`MySQL`有`BulkLoadFromFile`可以使用。
或者直接使用`InsertItemList`

```C#
s1.BulkInsertItemList<Data>("Data", List<Data> data);
s1.BulkInsertItemListDict("Data", List<Dictionary<string, object>> data);

s1.InsertItemList("Data", List<Dictionary<string, object>> data);
```

## 数据操作的支持
|    DataBase              | CRUD | Paging   | Batch Insert   | Bulk Insert | 
|:-------------------------|:-----|:---------|:---------------|:------------|
|`SQLite`                  |√     |√         |√               |✗            |
|`MySQL`                   |√     |√         |√               |✗            |
|`SQLServer`               |√     |√         |√               |√            |
|`Redis`                   |√     |√         |√               |✗            |
|`MongoDB`                 |√     |√         |√               |✗            |

## 分页
```C#
FilterCondition filter = new FilterCondition("Age", TableCompareType.GTE, 20);
PageCondition page = new PageCondition(1, 20);

Dictionary<string, object> d = s1.GetItemList<Data>("Data", filter, ref page);
```

## 事务问题
除了`Redis`外， 事务在调用`GetInstance`时已经开启，调用`Commit()`和`RollBack()`即可
`Redis`不支持事务，所以先将数据操作放入队列，当`Commit()`的时候才一起执行。

```C#
Dictionary<string, object> d = new Dictionary<string, object>();
s1.SetItem("S1", d["ID"].ToString(), d);
s1.Commit();
```

## MySQL 导入Cvs文件
```C#
s1.BulkLoadFromFile("Data", "D:/tmp.csv", "`");
```

## SQLServer表创建脚本
在`SQLServer`中, 使用`GetCreateScript(name, true)`即可导出带索引的表创建脚本。
此处代码来自`StackoverFlow`.

## 注意
1. 在实体上使用 `[TableFields(true)]`, 库才能自动匹配数据库字段。
2. 对于`Mongodb`, 需要在实体上添加`public ObjectId _id { get; set; }`然后在类上
添加`[BsonIgnoreExtraElements]`以避免报错。
3. `Mongodb` 需要先配置`复制集`才能使用事务。


## 源码链接
[源码地址](https://github.com/yuanronghhh/CSharpDataLib)
