{
  "title": "UUID4源码实现",
  "profile": "glib中uuid的源码实现",
  "create_at": "2021-07-11T00:00:00",
  "update_at": "2021-07-11T00:00:00"
}
# UUID4源码实现

## 前言
`Glib`中仅实现了`UUID4`，`UUID`本身有5个版本。
分别有不同的用处。

## UUID版本
### 版本1
基于时间, `mac`地址，随机数生成。

### 版本2
`DCE`安全`UUID`, 和`版本1`相同，但会将时间戳前`4`位置换为`posix`的`UID`或`GID`。

### 版本3
基于`MD5`名称, 生成`UUID`。
`cpython`里面，`uuid3(namespace, name)`
第一个参数即`uuid`，第二个字符串不变的话`uuid`生成就会一样。

### 版本5
基于`SHA1`生成`UUID`, 和`UUID3`一致，算法更改成了`SHA1`。

### 版本4
#### 实现原理
下面有完整代码，参照代码解释一下。

1. 第`6`行：
   构造生成`uuid`的长度`16`的字节数组`bytes[16]`，总共`128bit`.
2. 第`10-15`行: 
   因为`g_random_int()`返回的是`32`位`unsigned int`,
   所以将`bytes`数组转成`guint32 *`指针, 方便按`32 bit`一组进行随机数生成.
   这里使用了`ints`指向`bytes`, 而`128 bit`位的随机数需要生成`128/32`=`4`次,
   循环了`4`次随机数生成。
3. 第`22-29`行：
   设置特殊位，版本和`clock_seq_hi_and_reserved`
```
bytes[6] &= 0x0f;
意思是去除高4位数据，保留低位数据。

bytes[6] |= version << 4;
因为高四位已经置0, 版本为4，这里左移`4`即跳过刚才保留数据的位数，然后写版本信息。
就是像`100xxxx`这样。

bytes[8] &= 0x3f;
0x3f = 0111111; 按位与，即保留前6位的值。

bytes[8] |= 0x80;
0x80 = 10000000; 按位或，即将最高位置为1. 保留位
```
4. 第`31`行:
   按`4,2,2,2,6`这样的字节数顺序输出,中间添加横线，
   就得到了类似下面这样:
   `8ee8fad2-128b-43e5-b923-8a52a5c0deae`

可以看到，第二个横线的后面一定为`uuid`的版本号。

#### 完整代码
```c
static void test_uuid_generate_v4 (void)
{
  int i;
  guint8 *bytes;
  guint32 *ints;
  GUuid suuid;
  GUuid *uuid = &suuid;
  guint version = 4;

  bytes = uuid->bytes;
  ints = (guint32 *) bytes;
  for (i = 0; i < 4; i++)
    ints[i] = g_random_int ();

  bytes = uuid->bytes;

  /*
   * Set the four most significant bits (bits 12 through 15) of the
   * time_hi_and_version field to the 4-bit version number from
   * Section 4.1.3.
   */
  bytes[6] &= 0x0f;
  bytes[6] |= version << 4;
  /*
   * Set the two most significant bits (bits 6 and 7) of the
   * clock_seq_hi_and_reserved to zero and one, respectively.
   */
  bytes[8] &= 0x3f;
  bytes[8] |= 0x80;

  char *result = g_strdup_printf ("%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x"
                          "-%02x%02x%02x%02x%02x%02x",
                          bytes[0], bytes[1], bytes[2], bytes[3],
                          bytes[4], bytes[5], bytes[6], bytes[7],
                          bytes[8], bytes[9], bytes[10], bytes[11],
                          bytes[12], bytes[13], bytes[14], bytes[15]);

  printf("%s\n", result);
}
```
