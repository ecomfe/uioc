uioc
====
uioc 是一个轻量级的前端 ioc 容器，因为不知道叫什么名字好，所以就是 unnamed ioc 了。！
uioc 能够很好的与 AMD/CMD 模块加载器配合工作，将依赖的创建转移给 ioc，能够更大程度的提高模块复用性。

## ioc 是干嘛的
以下的例子是常见的一个 mvc 业务功能的简化实现：model，view，action，分别演示了在无依赖注入，有依赖注入，和使用 ioc 容器管理依赖的写法

### 无依赖注入的时候
以下例子中：Action 中依赖了 Model 和 View，通过loader加载了两个依赖，并在构造函数中实例化 Model 和 View，将依赖硬编码至 Action 中。
这使得要对 Action 进行测试时，难以对 View 和 Model 进行 mock。也使得要对 Action 进行复用，必然需要一并使用绑定的 View 和 Model，
而 View 是经常变化的，这很难满足复用的目的。

```javascript

// Action.js
define(function () {
   var View = require('./View');
   var Model = require('./Model');
   function Action() {
        this.model = new Model();
        this.view = new View();
        this.view.model = this.model;
   }

    Action.prototype.enter = function () {
        this.model.load();
        this.view.render();
    };

    return Action;
});

// View.js
define(function () {
   function View() {
   }

    View.prototype.render = function () {
          document.body.innerHTML = this.model.get('name');
    };

    return View;
});

// Model.js
define(function () {
   function Model() {
        this.stores = {};
   }

    Model.prototype.load = function () {
        this.set('name', 'Hello');
    };

    return Model;
});

// main.js
require(
    ['Action'],
    function(Action){
        var action = new Action();
        action.enter();
    }
);

```

### 有依赖注入时
为了使得 Action 更好的复用和测试，以下例子将 View 和 Model 作为 Action 构造函数的参数注入，Action 内部将不再承担 Model 和 View 的创建职责。
Model 和 View 的创建交给了外部主程序代码，这使得 View 和 Model 的实现可以由外部进行替换。Action 仅针对 View 和 Model 的接口编程。

```javascript

// Action.js
define(function () {
   function Action(model, view) {
        this.model = model;
        this.view = view;
        this.view.model = this.model;
   }

    Action.prototype.enter = function () {
        this.model.load();
        this.view.render();
    };

    return Action;
});

// View.js
define(function () {
   function View() {
   }

    View.prototype.render = function () {
          document.body.innerHTML = this.model.get('name');
    };

    return View;
});

// Model.js
define(function () {
   function Model() {
        this.stores = {};
   }

    Model.prototype.load = function () {
        this.set('name', 'Hello');
    };

    return Model;
});

// main.js
require(
    ['Action', 'View', 'Model'],
    function(Action, View, Model){
        var view = new View();
        var model = new Model();
        var action = new Action(model, view);
        action.enter();
    }
);

```

### ioc 容器管理依赖创建

第二个例子解决了模块与依赖创建分离的问题，将依赖的创建丢给了 main，这会导致 main 中的实例化代码膨胀，而 ioc 很好的承当了依赖的注入与创建。
仅需要一份构件配置文件，ioc 容器会自动解析配置和各个构件的依赖关系，在获取实例时，会将依赖自动注入。当 View 和 Model 的实现变化时，仅需要更改配置即可。

```javascript
// config.js
define({
    components: {
        action: {
            module: 'Action',
            args: [
                { $ref: 'view' },
                { $ref: 'model' },
            ]
        },
        view: { module: 'view' },
        model: { module: 'model' }    
    }
});


// Action.js
define(function () {
   function Action(model, view) {
        this.model = model;
        this.view = view;
        this.view.model = this.model;
   }

    Action.prototype.enter = function () {
        this.model.load();
        this.view.render();
    };

    return Action;
});

// View.js
define(function () {
   function View() {
   }

    View.prototype.render = function () {
          document.body.innerHTML = this.model.get('name');
    };

    return View;
});

// Model.js
define(function () {
   function Model() {
        this.stores = {};
   }

    Model.prototype.load = function () {
        this.set('name', 'Hello');
    };

    return Model;
});

// main.js
require(
    ['ioc', 'config'],
    function(IoC, config){
        var ioc = new IoC(config);
        ioc.getComponent('action', function(action){
            action.enter();
        });
    }
);

```

## $ref 操作符

$ref 用来声明当前构件所依赖的构件，IoC容器获取当前构件时，会自动寻找其依赖并创建依赖，最后将其按照指定的注入方式（构造函数/属性/setter）注入。

```javascript
ioc.addComponent('action', {
    module: 'Action',
    args: [
        { $ref: 'view' },
        { $ref: 'model' },
    ]
});
```

如上代码：获取 action 时，将会创建 view 和 model 的依赖，并作为参数传递给 action 的构造函数


## $import 操作符

$import 操作符是为了简化配置而诞生的，在实际场景中经常遇到需要重用一个模块，但仅仅是参数不同，0.1版本时需要重新定义一个构件配置，
使用$import操作符则可以重用现有的构件配置，同时覆盖需要的配置项，IoC 会为$import创建一个匿名的构件配置。

```javascript
var components = {
       requestStrategy: {
                module: 'common/RequestStrategy'
       },
       appData: {
              // ....
             properties: {
                    requestStrategy: {
                            $import: 'requestStrategy',
                            args: ['app', 'app']
                    }
             }
       },
      creativeData: {
              // ....
             properties: {
                    requestStrategy: {
                            $import: 'requestStrategy',
                            args: ['creative', 'creative']
                    }
             }
       }
};

var ioc = IoC({ components: components });

```

如上代码：appData 与 creativeData 重用了 requestStrategy 的配置，并覆盖了 args 的配置项。

## 集合操作符 $list 与 $map

$list 与 $map 让我们可以声明某个依赖为数组或映射表集合，在集合配置中，我们还可以**嵌套的使用 uioc 提供的各种操作符（$import, $ref, $list, $map）进行更深层次的依赖声明**。

$list 可以让一系列的依赖以数组集合的形式注入到实例上，$list的配置为数组：{$list: ['value', {$ref: 'dep'}, {$list: ['nested value']}]}

$map 则是让一系列的依赖以对象集合的形式注入到实例上，$map的配置为简单的对象: {$map: {value: 1, dep: {$ref: 'dep'}, nest: {$map: {nestProp: 'nested prop'}}}

demo 如下：

```javascript
var components = {
      a: {
          creator: function () {
              this.say = function () {
                  console.log('a');
              };
          }
      },
      b: {
         creator: function () {
             this.say = function () {
                  console.log('b');
              };
         }
      },
      main: {
         creator: function (name, listArg) {
            this.name = name;
            this.listArg = listArg;
            this.say = function () {
                console.log(this.name);
                this.listArg.forEach(function (item) {
                    item.say();
                });
            };
         },
         args: ['main', {$list: [{$ref: 'a'}, {$ref: 'b'}]}],
         properties: {
              mapCollection: {
                    a: {$ref: 'a'},
                    b: {$ref: 'b'}
              }
         }
      }
};

var ioc = IoC({components: components});
ioc.getComponent('main', function (main) {
    main.say(); // 输出：main a b
    main.mapCollection.a.say(); // 输出 a
    main.mapCollection.b.say(); // 输出 b
});

```

## [API](http://ecomfe.github.io/uioc/doc/IoC.html)



