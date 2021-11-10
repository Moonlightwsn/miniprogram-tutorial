# 课程2 <span style="margin-left: 32px;">*消息列表*</span>

> 课程目标
> - 利用官方组件库 `WeUI` 和 预制的自定义组件 `MessageCells` 实现仿微信消息列表的展示
> - 通过以上实践来学习小程序开发中基本的配置，常用的 `WXML` 语法和简单的 `js` 交互

***

## 课程准备
- 更新本教程git仓库到最新，找到本节课程示例代码位置 `/docs/examples/message-list`
- 使用微信开发者工具导入该目录即可预览完整示例

> 实操要求：在上一节课的的示例代码基础上，完成课程目标，即改动 `/docs/examples/hello-world` 代码，最终实现 `/docs/examples/message-list` 的效果。
***
> 因为本节课程是学习自定义组件的使用，而非自定义组件的实现，所以 `MessageCells` 组件可以直接从 `/docs/examples/message-list/components` 拷贝到 `/docs/examples/hello-world` 里

***

## 基本配置
- `app.json` 全局配置
```javascript
{
  // 页面路径列表
  "pages":[
    // 申明了index页面的位置，框架将自动寻找对应的 .json .js .wxml .wxss 文件进行处理
    "pages/index/index"
  ],
  // 全局的默认窗口表现
  "window":{
    // 下拉 loading 的样式，仅支持 dark / light
    "backgroundTextStyle":"light",
    // 导航栏背景颜色
    "navigationBarBackgroundColor": "#F7F7F7",
    // 导航栏标题文字内容
    "navigationBarTitleText": "WXchat",
    // 导航栏标题颜色，仅支持 black / white
    "navigationBarTextStyle":"black"
  },
  // 小程序基础样式
  "style": "v2",
  // 指定需要引用的扩展库
  "useExtendedLib": {
    // 这里我们使用的是WeUI
    "weui": true
  }
}
```

- `index.json` 页面配置
```javascript
{
  // 该页面下用到的自定义组件
  "usingComponents": {
    "message-cells": "/components/message-cells/message-cells",
    "message-cell": "/components/message-cell/message-cell"
  }
}
```

***

## 框架接口
- `app.js` 小程序

注册小程序。接受一个 Object 参数，其指定小程序的生命周期回调等

App() 必须在 app.js 中调用，必须调用且只能调用一次，不然会出现无法预期的后果

```javascript
App({
  // 小程序初始化完成时触发，全局只触发一次
  onLaunch() {
      // do something you want to do
  },
  // 一些全局变量
  globalData: {
  },
  // 全局变量也可以是其他命名，只要不和框架接口产生冲突就好
  myGloablData: 1234,
})
```

- `pages/index/index.js` 页面
注册小程序中的一个页面。接受一个 Object 类型参数，其指定页面的初始数据、生命周期回调、事件处理函数等

```javascript
Page({
    // 页面的初始数据
    data: {
    },
})
```

***

## WXML语法参考

- 数据绑定

WXML 中的动态数据均来自对应 Page 的 data
，数据绑定使用 Mustache 语法（双大括号）将变量包起来

```html
<!-- index.wxml -->
<view>content</view>
<view>{{content}}</view>
<view id="item-{{id}}"></view>
<view>{{a + b}} + {{c}} + d</view>
<view hidden="{{flag ? true : false}}"> Hidden </view>
<view wx:if="{{condition}}">其实我并不会被渲染</view>
```

```javascript
// index.js
Page({
    data: {
        content: 'I am not a content',
        id: 0,
        condition: false,
        a: 1,
        b: 2,
        c: 3,
        flag: true,
    },
})
```

- 条件渲染

**wx:if**

在框架中，使用 wx:if="" 来判断是否需要渲染该代码块
```html
<view wx:if="{{condition}}"> True </view>

<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>

<block wx:if="{{true}}">
  <view> view1 </view>
  <view> view2 </view>
</block>
```

- 列表渲染

**wx:for**

在组件上使用 wx:for 控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件

默认数组的当前项的下标变量名默认为 index，数组当前项的变量名默认为 item

```html
<view wx:for="{{array}}">
  {{index}}: {{item.message}}
</view>


<view wx:for="{{array}}" wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>

<view wx:for="{{messages}}" wx:key="id">
  {{item.message}}
</view>
```

```javascript
Page({
  data: {
    array: [{
      message: 'foo',
    }, {
      message: 'bar'
    }],
    messages: [{
        id: 1,
        message: 'first message',
    }, {
        id: 2,
        message: 'second message',
    }]
  }
})
```

## 数据更新与交互

```html
<button bindtap="clickMe">BUTTON</button>
<view>{{count}}</view>
```

```javascript
Page({
    data: {
        count: 1,
    },
    clickMe() {
        this.setData(this.data.count + 1);
    }
})
```
