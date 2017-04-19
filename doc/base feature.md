## 依赖注入方式

uioc提供了3种依赖注入方式以满足绝大多数场景的需要，以下分别介绍：

### 构造函数注入

用于在构造函数执行时就需要依赖的场景，声明的构造函数依赖会按照顺序作为参数传递给构造函数。在组件配置中，配置args来声明构造函数依赖：

```javascript
class List {
    constructor(entityName, model) {
        this.entityName = entityName;
        this.model = model;
    }
}

let config = {
	components: {
		list: {
                    creator: List,
			args: [‘list’, {$ref: ‘listModel’}]
		}
	}
};
```
上述代码声明了list组件的构造函数依赖有两个：

第一个参数依赖为普通依赖，值为’list’。

第二参数依赖为组件依赖，通过**$ref**关键字指名list构造函数第二个参数依赖为一个listModel组件。依赖的类型会在后面详细介绍。

### 属性/接口注入

用于在实例构造完毕后需要依赖的场景。在组件配置中，通过properties配置来声明属性/接口依赖：

```javascript
class List {
    constructor(entityName, model) {
        this.entityName = entityName;
        this.model = model;
    }
    setView(view) {
        this.view = view
    }
    setCurrentContext(context) {
        this.context = context;
    }
}

let config = {
    components: {
        list: {
            creator: List,
            args: ['list', {$ref: 'listModel'}],
            properties: {
                name: 'list',
                view: {$ref: 'listView'},
                context: {
                    $ref: 'listContext',
                    $setter: 'setCurrentContext'
                }
            }
        }
    }
};
```

#### 属性/接口注入策略

uioc会根据声明创建对应的依赖，按照以下步骤将依赖注入给实例：

1. 若属性依赖声明中带有**$setter**关键字，uioc将对实例调用**$setter**关键字声明的接口，将依赖作为参数传入，返回。
2. 若属性依赖声明未带有$setter关键字，则uioc将查找属性名称对应的setter方法(set${Name})，将依赖作为参数传入，返回。
3. 若实例不存在属性setter，则直接通过赋值的方式将依赖注入给实例： instance.propertyName = propertyValue

以上面代码来说：list组件通过properties声明了3个属性依赖：name, view,  context。

name属性为普通依赖，根据属性注入策略，会直接通过instance.name = ‘list’ 赋值给实例；

view属性为组件依赖，依赖listView组件，根据注入策略会先查找是否实例是否存在setView方法，
若存在则会调用 instance.setView(listView)注入listView组件，若不存在则通过instance.view = listView 注入。

context属性为组件依赖，依赖listContext组件，根据注入策略，声明了$setter，则会通过instance.setCurrentContext(listView)注入listContext组件。

### 自动注入

为了简化手动的依赖配置，uioc提供了在属性层面上自动发现并注入依赖的功能，即无需在properties显示声明每个属性/接口依赖，自动注入最终会转化为属性/接口注入。

在组件配置中声明auto:true打开对当前组件的自动注入功能：

```javascript
class List {
    constructor(entityName, model) {
        this.entityName = entityName;
        this.model = model;
    }
    setView(view) {
        this.view = view
    }
    setCurrentContext(context) {
        this.context = context;
    }
    setName(name) {
        this.name = name;
    }
}

let config = {
    components: {
        list: {
            creator: List,
            auto: true,
            args: ['list', {$ref: 'listModel'}],
            properties: {
                name: 'list'
            }
        },
       name: {
            creator() {}   
       }
       view: {
           creator: class View {}
       }
    }
};
```

上述代码中，在list上配置了auto:true开启了自动注入功能。

#### 自动注入步骤

1. uioc会在实例创建完毕后，找出实例所有的setter方法，通过setter解析出对应的属性作为候选依赖。
上述代码中有3个setter：setView, setName, setCurrentContext, 对应的属性候选依赖则是：view, name, currentContext。

2. 根据第一步得到的属性候选依赖，筛选出在uioc里注册过的组件确定为最终的属性依赖。
上述代码中注册过的组件为list, name, view, 因此符合条件的依赖为name和view。

3. 将从setter得到的依赖声明与组件配置中的properties进行合并，若有同名依赖，则采用properties中的依赖声明，最终合并为一份属性/接口依赖。
上述代码中properties声明了name依赖，因此最终name的依赖配置以properties的为准，其值为’list’, 而不是注册过的name组件实例。

4. 根据第三步获得的依赖声明进行属性/接口注入。
上述代码中最终会调用setView和setName方法注入view和name依赖。

**注：由于js的类型动态性，暂时还无法做到在构造函数进行自动注入，但未来在decorator成熟时，可以通过decorator的方式声明自动注入**

## 依赖类型

### 普通类型依赖

普通类型依赖是指无需经过ioc管理，在配置阶段就可以确定值的依赖，主要用于组件的简单配置场景。

如下list组件构造函数的第一个参数依赖为普通类型依赖，其值为’list’，属性name也是值为’list’的普通类型依赖。

```javascript
let config = {
    components: {
        list: {
            creator: List,
            args: ['list', {$ref: 'listModel'}],
            properties: {
                name: 'list',
                view: {$ref: 'listView'}
            }
        }
    }
};
```

### 组件类型依赖

组件类型依赖是指在uioc注册过的那些组件，在依赖配置中通过**$ref**关键字声明组件类型依赖，uioc容器会在获取组件阶段根据依赖配置创建组件需要的依赖实例，再按照注入流程注入。组件类型依赖适用于大多数的场景。

以下代码中，list组件声明了2个组件类型依赖：listModel, listView，listModel会在list构造函数调用时被实例化然后作为参数传入，而listView则是在属性注入阶段被实例化然后注入。

```javascript
let config = {
    components: {
        list: {
            creator: List,
            args: ['list', {$ref: 'listModel'}],
            properties: {
                name: 'list',
                view: {$ref: 'listView'}
            }
        }
    }
};
```

### 集合类型依赖

集合类型依赖是指依赖为数组或字典的类型，集合每个元素是普通类型依赖和组件类型依赖之一。适用于依赖为集合的场景。

#### 数组集合依赖

数组集合依赖通过关键字**$list**声明，$list配置项为数组，数组每个元素为具体的依赖配置声明：

```javascript
class Service {
    constructor(entityName, datasources) {
        this.entityName = entityName;
        this.datasources = datasources;
        this.middleware = [];
    }
    setMiddleware(middleware) {
        this.middleware = middleware;
    }
}

let config = {
    components: {
        service: {
            creator: Service,
            args: [
                'list',
                {
                    $list: [{$ref: 'datasource'}, {id: 1}]
                }
            ],
            properties: {
                entityName: 'list',
                middleware: {
                    $list: [
                        {$ref: 'log'},
                        {
                            onRequest(query, next) {
                                query.timestamp = Date.now();
                                next();
                            }
                        }
                    ]
                }
            }
        }
    }
};
```
如上代码，service组件声明了在构造期需要一个数组依赖作为第二个参数传入，同时组件属性middleware也声明为一个数组依赖。

在数组依赖的每个元素中又可以继续声明每个元素的依赖配置，如在middleware集合依赖中，第一个元素为组件类型依赖，第二个为普通类型依赖。

在获取service组件实例后，每个实例的datasources与middleware均是一个数组，uioc将根据对应的集合依赖配置设置好每个元素值。

#### 字典集合

字典集合依赖通过关键字**$map**声明，$map配置项为key/value形式的js对象，每一个key作为字典集合中的属性名，对应的value项为具体的依赖配置声明：

```javascript
class ServiceFactory {
    setServiceCollection(serviceCollection) {
        this.services = serviceCollection;
    }
}
let config = {
    components: {
        serviceFactory: {
            creator: ServiceFactory,
            properties: {
                serviceCollection: {
                    $map: {
                        list: {$ref: 'listService'},
                        token: {$ref: 'tokenService'},
                        log(message) {
                            console.log(message);
                        }
                    }
                }
            }
        }
    }
};
```

如上代码，serviceFactory组件声明了其属性serviceCollection为一个字典集合依赖，该属性中又有3项依赖分别是list, token, log。

获取serviceFactory组件实例后，uioc将根据serviceCollection每项声明的依赖类型创建依赖并赋值给serviceCollection，serviceCollection最终作为一个js对象传入setServiceCollection方法中。最终我们可以在serviceFactory实例上这样调用： serviceFactory.services.log(); serviceFactory.services.list();

#### 集合类型依赖小结

集合类型依赖本质上是一种简化配置的语法糖，使用者完全可以不用集合依赖而满足需要集合依赖的场景：使用者可以声明一个组件，该组件为一个数组或者字典，每项元素都是需要的依赖即可。

**集合中的每个配置可以递归的继续声明为包括集合类型在内的任意依赖类型，但要注意在集合依赖类型中递归嵌套集合依赖类型会有一定的性能影响，在非必要的时候建议不要对集合依赖嵌套过深**

## 组件实例的管理

uioc 提供了常用的组件实例管理功能：多例，单例，静态以满足绝大多数的场景需求。在组件配置中通过指定不同的scope值来标识。

### 多例transient

多例是指每次获取组件时，uioc容器都会调用配置的creator创建一个新的实例返回。

在组件配置中设置**scope:'transient'**来声明组件是多例的，当然你也可以不用设置，scope的默认值就是'transient'。

```javascript
let config = {
    components: {
        list: {
            creator: class List {},
            scope: 'transient'
        }
    }
};
```
上述代码中每次调用**getComponent**获取到的list组件都是**不同**的。

**注：不同于服务端，在前端更多的是多例场景**

### 单例singleton

单例是指仅在第一次获取组件时，uioc容器会调用组件creator创建新的实例并缓存该实例，之后每次获取组件都会返回缓存的组件实例。

在组件配置中设置**scope:'singleton'**来声明组件是单例的。

在容器销毁时(容器的dispose方法被调用)，若声明了单例的组件带有**dispose**方法，uioc会调用该方法，单例组件可以在dispose里执行清理工作。

```javascript
let config = {
    components: {
        list: {
            creator: class List {},
            scope: 'singleton'
        }
    }
};
```
上述代码中每次调用**getComponent**获取到的list组件都是**相同**的。

### 静态static

静态是指creator是一个静态值，uioc容器在获取静态组件时，将直接返回组件配置的creator，而不是执行creator。通常用于一些常量和静态配置场景。

在组件配置中设置**scope:'static'**来声明组件是静态的。

```javascript
let config = {
    components: {
        constant: {
            creator: {TYPE: 'pc'},
            scope: 'static'
        }
    }
};
```
上述代码中每次调用**getComponent**获取到的constant组件都是**{TYPE: 'pc'}**。

## 组件实例化方式

在实际开发场景中，创建实例的方式有构造函数和工厂，uioc对这两种创建方式都做了支持：通过组件配置项**isFactory**来设置组件的实例化方式。

### 构造函数创建

构造函数创建是uioc的默认组件实例化方式，会在获取组件时，使用new操作符调用组件的creator，其返回值作为组件实例。

```javascript
let config = {
    components: {
        list: {
            creator: class List {},
            isFactory: false // 默认值，无需显示设置
        }
    }
};
```

### 工厂方法创建

工厂方法创建是指uioc在获取组件时，直接对组件的creator进行函数调用，其返回值作为组件实例。

```javascript
let config = {
    components: {
        list: {
            creator: function () {
                return {name: 'list'};
            },
            isFactory: true
        }
    }
};
```
## 组件模块异步加载

组件模块异步加载是指声明组件配置时，组件对应的脚本模块还未下载，在获取组件实例时，uioc会利用当前环境支持的模块加载器动态加载组件的模块，再进行实例化。在组件配置中通过module配置项配置模块id来开启组件的异步加载。

```javascript
let config = {
    components: {
        list: {
            module: 'app/List'
        }
    }
};
```

上述代码中声明了list组件的module，而未设置creator，获取list组件时，uioc先调用当前环境（暂时浏览器端仅支持AMD规范）的模块加载器传入'app/List'，之后将获取到的模块作为list的creator，再进行后续的实例化流程。

**注：当前uioc本身能够支持AMD规范与NodeJS环境的模块加载器，其他的模块加载器可以通过下面介绍的自定义Provider的特性来适配支持**

### 组件异步加载场景概述

浏览器端与其他终端最大的不同之一就在于脚本在大多数场景下是需要下载的。在大规模web app中，我们经常会有各种优化策略来尽可能的缩减首次资源加载的尺寸，其中之一就是将不常用的业务功能模块不作为首次加载的脚本，仅在用户进入该业务功能时再进行异步加载。

基于uioc的异步加载特性我们可以很轻松的针对浏览器做模块的懒加载，增量更新等基于异步的优化策略。

## 自定义模块加载器

在组件模块异步加载一节中，说到uioc利用了当前环境支持的模块加载器加载组件的模块，当前版本的uioc默认使用了AMD规范的**require**接口来加载模块，同时对NodeJS环境做了到AMD规范的非侵入性适配。

在实际场景中，除了AMD规范外，还有CMD，es6 module等场景，uioc未来逐渐对形成统一共识的模块规范做适配，同时也为了满足各种不同的模块场景，uioc允许使用者自定义模块加载器，**自定义的uioc模块加载器需要符合AMD规范的require签名**。

有两种方式设置自定义的模块加载器：
1. 通过在uioc的配置中配置loader。
2. 调用uioc容器实例的setLoaderFunction方法设置。

```javascript
let customLoader = (ids, cb) => {
    console.log('custom loader':, ids);
    window.require(ids, cb);
};
let config = {
    loader: customLoader,
    components: {
       // ....
    }
};

// 或者调用uioc实例setLoaderFunction方法设置
// ioc.setLoaderFunction(customLoader);
```

上述代码中简单演示了自定义loader的设置和编写，在每次异步获取组件模块时，都会打印当前模块id。

## 匿名组件配置

匿名组件配置允许使用者在声明组件依赖（构造函数/属性）时，通过简单的方式继承已有的组件配置并加入新的配置或覆盖已有配置，该特性能够大大减少新组件的声明需要并一定程度的减少配置代码。

匿名组件配置通过在依赖配置中用**$import**关键字声明，$import后跟要继承的组件id:

```javascript
let config = {
    components: {
        service: {
            creator(url) {},
            args: ['/api/entity'],
            properties: {
                method: 'get'
            }
        },
        model: {
            module: 'app/Model',
            args: [{$ref: 'service'}]
        },
        listModel: {
            module: 'app/ListModel',
            args: [
                {
                    $import: 'service',
                    args: ['/api/list']
                }
            ]
        }

    }
};
```
上述代码中model的构造函数依赖了service组件，listModel则依赖一个匿名组件，其配置继承于service，但构造函数依赖有自己的定制。如果不用匿名组件配置特性，则较为繁琐：需要显示声明一个大部分配置与service组件一样的新组件，并在listModel的构造函数依赖中声明对新组件的依赖。
