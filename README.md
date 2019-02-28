## vue-router-apply

vue-router 原理相关

-----

## vue-router

`vue-router`导入一个类。
参数是配置项，重要的`mode`参数，二种形式。

1. `#` hash
2. `/` history

```javascript
new VueRouter({
    mode: 'hash', //  #/
    // mode: 'history' // /
})
```

`hash`与`history`区别：

- `history`，一般都需要服务器端配置或支持SSR（将URL修改得就和正常请求后端的URL一样）, 否则服务器会返回404。
- `hash`当`URL`改变时，页面不会重新加载。

使用`vue-router`:
1. 实例化路由
2. 路由在`vue`中注册好之后，需要承载的东西`<router-view></router-view>`，显示内容
3. 需要使用`vue-router`插件`Vue.use(VueRouter)`

> hash

原理：监听`hashchange`事件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
    hash
    <br />

    <a href="#/home">Home</a>
    <a href="#/about">About</a>

    <div id="html"></div>

    <script>
        // hash原理
        let addFun = () => {
            let html = document.querySelector('#html')
            html.innerHTML = location.hash.slice(1)
        }
        window.addEventListener('load', addFun)
        window.addEventListener('hashchange', addFun)
    </script>
</body>
</html>
```

> history

原理: `history.pushState()`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
    history
    <br />

    <a onclick="go('/home')">Home</a>
    <a onclick="go('/about')">About</a>

    <div id="html"></div>

    <script>

        // history Api
        function go (pathname) {
            let html = document.querySelector('#html')
            history.pushState({}, null, pathname) // 参数：传入数据，标题，路径
            html.innerHTML = pathname
        }
        window.addEventListener('popstate', () => {
            // 浏览器前进后退
            go(location.pathname)
        })

    </script>
</body>
</html>
```


## router实现

1. 注册组件
2. 处理好传入参数`mode`, `routes`,　并转换路由表
3. 初始化`hash`, `history`, 存当前的访问记录
4. 处理每个组件共有的`$rotuer`, `$route`, `<router-link>`, `<router-view>`
