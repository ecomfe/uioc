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
    Action: {
        module: 'Action',
        args: [
            { $ref: 'View' },
            { $ref: 'Model' },
        ]
    },
    View: { module: 'View' },
    Model: { module: 'Model' }
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
    function(IOC, config){
        var ioc = new IOC(config);
        ioc.getComponent('Action', function(Action){
            Action.enter();
        });
    }
);

```

## API

### new IOC(configs [, loader])

#### {Object} configs
构件批量配置对象, 其中每个key 为构件id，值为构建配置，配置选项见IOC.prototype.addComponent

#### {Function} loader
可选，模块加载器函数，默认为全局的 require

### IOC.prototype.addComponent(id, config)
给容器添加一个构件配置

#### {String} id
构件id，不能重复

#### {Object} config
单个构件配置对象

##### {String} config.module
模块加载的路径，将传给 loader，对 AMD loader，不可使用相对路径（使用的是全局 require）

*** 若配置了config.creator 函数,此配置无效。 ***

##### {Function | String} config.creator
构件的构造函数或工厂函数，若未设置为函数，则使用config.module配置的返回值作为creator；
若 creator 为字符串，则使用 config.module 配置的模块返回值的creator属性值作为 creator；

```javascript
var config = {
// 最终为 new A.method();
    A: {
        module: 'A',
        creator: 'method'
    }
};
```

#####  {'transient' | 'singleton' | 'static'} config.scope
构件实例的管理方式，默认为 transient：
 - 为 transient，每次获取构件实例时，都会调用 creator返回一个新的实例；
 - 为 singleton，表示构件为单例，仅在第一次获取实例时调用一次 creator，之后返回同一个实例；
 - 为 static，直接返回 creator。

##### {Boolean=false} isFactory
标识 creator 是否为工厂函数，若为工厂，则在创建实例时，直接调用，否则用 new 进行调用。

##### {Array} args
调用 creator 时传入的参数，完成构造函数依赖注入。
若在单个参数的对象中设置了 $ref 操作符，则表示依赖某个构件，此时将此参数替换为$ref对应的构件实例

```javascript
var config = {
    A: {
        creator: function (name, b){
            this.name = name;
            this.b = b;
        },
        // new creator('string', new B())
        args: [ 'string', { $ref: 'B' } ]
    },
    B: {
        module: 'B'
    }
};
```

##### {Object} properties
完成构件实例创建后，需要注入的属性，key 为属性名，值为要注入的属性值，若值为对象且有$ref，则该属性值会被替换为$ref对应的构件实例。
若实例对应的 `set${Key}` 属性为函数，则会调用实例的函数，将值传入

```javascript

var config = {
    A: {
        creator: function (){
            this.setB = function(b) {
                this.b = b;
            }
        },
        properties: {

            // 实例化 A 后，执行 aInstance.name = 'string';
            name: 'string',

            // 实例化 A 后，执行 aInstance.setB(b)
            setB: { $ref: 'B' }
        }
    },
    B: {
        module: 'B'
    }
};
```

### IOC.prototype.addComponent(configs)
给容器批量添加构件配置

#### {Object} configs
键为构件id，值为构件配置

### IOC.prototype.getComponent(ids, cb)
获取构件实例

#### {String | Array} ids
需要获取的构件 id，可为数组或字符串；
为字符串时，获取id 对应的构件，为数组时，批量获取数组中每个字符串 id 对应的构件

#### {Function} cb
构件获取完毕后的回调函数，会将实例按照 id 的传入顺序作为参数依次传递给 cb：

```javascript
ioc.getComponent(['A', 'B'], function(A, B){

});
```

### IOC.prototype.loader(loader)
设置 ioc 实例的模块加载器

### IOC.prototype.dispose
销毁容器，若 scope 为 singleton 的构件有 dispose 方法，ioc会自动调用。


## TODO

- 支持循环依赖的注入



