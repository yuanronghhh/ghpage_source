{
  "title": "JavaScript中的this",
  "profile": "JavaScript类的时候经常设计this指向问题，这里总结了2种纠正的方法",
  "create_at": "2017-03-10T12:10:01",
  "update_at": "2017-03-10T12:10:01"
}
# JavaScript中的this的绑定

## 介绍
链接: __[MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)__


### this指向问题
1. 注意JavaScript浏览器端, 默认`this`会指向调用方法的对象，直接调用时，会指向`window`对象, 
`Node.js`的`this`默认是`undefined`, 而并非`window`.

```javascript
var Cls = {
  fnA: function(){
    console.log(this);
  }
}
Cls.fnA();  //cls
```

2. 直接在函数中调用时, 浏览器端会默认指向window, 严格模式下为undefined.
```javascript
var Cls = {
  fnA: function(){
    console.log(this);
  }
}
var f = Cls.fnA;
f(); //window
```

### 纠正指向问题
1. 通过call,apply可以指定this指向.
```javascript
var Cls = {
  fnA: function(){
    console.log(this);
  }
}
var ClsTwo = {
  name: "clstwo"
}
Cls.fnA.call(ClsTwo, "");// ClsTwo
```

2. ECMAScript 5标准中使用Function.bind可以解决执行指向问题.
```javascript
var Cls = {
  fnA: function(){
    console.log(this);
  }
}
var f = Cls.fnA.bind(Cls);
f(); //Cls
```
