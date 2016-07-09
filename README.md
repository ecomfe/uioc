uioc ![building status](https://travis-ci.org/ecomfe/uioc.svg?branch=master) ![doc status](https://doc.esdoc.org/github.com/ecomfe/uioc/badge.svg)
===

# 关于
uioc是用JavaScript写的一个轻量级IoC容器，为JavaScript应用提供了IoC功能。通过使用配置的方式管理模块依赖，最大程度的提高了模块的复用性。

在1.0版本中，增加了aop的支持，对应用从横向关注点上提供了复用支持。

# 安装

```shell
npm install uioc —save
```
# 基本使用

## Step 1：定义模块

IoC最大的要求之一就是不要在模块中引入具体依赖的实现，对应在JavaScript中则是不要显示的引入依赖模块，仅在注入点面向依赖接口编程。

```javascript
// List.js
export default class List {
    // 构造函数注入实现了ListModel接口的依赖
    constructor(listModel) {
        this.model = listModel;
    }

    // 属性/接口注入实现了ListView接口的依赖
    setView(listView) {
        this.view = listView;
    }

    enter() {
        let data = this.model.load();
        this.view.render(data);
    }
}

// MyListModel.js
export default class MyListModel {
    load() {
        return {data: 'data'};
    }
}

// MyListView.js
export default class MyListView {
    render(data) {
        console.log(data);
    }
}
```
上述代码中在List类有两个依赖view和model，分别实现了ListModel和ListView（隐式）接口，
而MyListModel和MyListView类则是ListModel与ListView接口的具体实现。

## Step 2：定义IoC配置，实例化IoC容器

```javascript
// ioc.js
import {IoC} from 'uioc';
import List from './List';
import MyListModel from './MyListModel';
import MyListView from './MyListView';

let config = {
    components: {
        list: {
            creator: List,
            args: [
                {$ref: 'listModel'}
            ],
            properties: {
                view: {
                    $ref: {'listView'}
                }
            },

            listModel: {
                creator: MyListModel
            },

            listView: {
                creator: MyListView
            }
        }
    }
};

let ioc = new IoC(config);

export default ioc;
```

上述代码中，声明了list, listModel, listView三个组件，
其中list通过$ref关键字声明了2个依赖：listModel是list的构造函数依赖，
会在实例化list的时候，将创建好的listModel依赖传入构造函数；
listView是list的属性依赖，会在实例化list完成后，将创建好的listView赋值给list，赋值方式为有setter则调用setter，无setter则直接对象赋值。

## Step 3:  定义入口文件，从ioc实例获取入口组件启动整个应用

```javascript
// main.js
import ioc from 'ioc';

ioc.getComponent('list').then(list => list.enter());
```
上述代码中通过ioc容器实例获取了list组件，ioc容器将根据配置创建好list的相关依赖并注入给list，最终组装成完整的list实例传递给promise的resolve回调。

# [基础特性](https://github.com/ecomfe/uioc/wiki/Base-Feature)

# 高级特性

- [插件机制](https://github.com/ecomfe/uioc/wiki/plugins)
- [aop](https://github.com/ecomfe/uioc/wiki/aop)

# [API](https://doc.esdoc.org/github.com/ecomfe/uioc/)

# [0.3.x版本文档](https://github.com/ecomfe/uioc/wiki/0.3.x-readme)
