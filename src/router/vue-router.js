"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HistoryRoute = /** @class */ (function () {
    function HistoryRoute() {
        this.current = null;
    }
    return HistoryRoute;
}());
var VueRouter = /** @class */ (function () {
    function VueRouter(options) {
        this.mode = options.mode || 'hash';
        this.routes = options.routes || [];
        // routes 需要是一个数组 // 先不考虑二级或多级路由
        // 将路由数组转换成格式为：{ '/home': Home, '/about': About } 
        // 好处是：通过路由路径取到文件，渲染取到的文件
        this.routesMap = this.createMap(this.routes);
        // 路由需要存放当前路径
        this.history = new HistoryRoute();
        // 初始化
        this.init();
        console.log(this.history, 'this.history.current');
    }
    VueRouter.prototype.init = function () {
        var _this = this;
        // 初始化 判断mode
        if (this.mode === 'hash') { // hash
            // 首次进入，需要加上 #/
            location.hash ? '' : location.hash = '/';
            window.addEventListener('load', function () {
                _this.history.current = location.hash.slice(1);
            });
            window.addEventListener('hashchange', function () {
                _this.history.current = location.hash.slice(1);
            });
        }
        else { // hisotry
            location.pathname ? '' : location.pathname = '/';
            window.addEventListener('load', function () {
                _this.history.current = location.pathname;
            });
            window.addEventListener('popstate', function () {
                _this.history.current = location.pathname;
            });
        }
    };
    VueRouter.prototype.createMap = function (routes) {
        return routes.reduce(function (memo, current) {
            memo[current.path] = current.component;
            return memo;
        }, {});
    };
    VueRouter.prototype.go = function () { };
    VueRouter.prototype.back = function () { };
    VueRouter.prototype.push = function () { };
    return VueRouter;
}());
// 使用Vue.use 就会调用install方法
VueRouter.install = function (Vue) {
    // 每个组件 都有 this.$router, this.$route
    Vue.mixin({
        beforeCreate: function () {
            // 在所有组件中获取同一个路由实例
            if (this.$options && this.$options.router) { // 定位根组件
                this._root = this; // 把当前实例挂载在_root上
                this._router = this.$options.router; // 把router实例挂载在_router上
                // observer方法
                // 如果history中的current属性变化，也会刷新视图
                // this.xxxx = this._router.history
                Vue.util.defineReactive(this, 'xxx', this._router.history);
            }
            else {
                // vue组件渲染顺序 父 -> 子 -> 孙子 (先序深度算法)
                this._root = this.$parent._root; // 获取路由唯一实例
                this._router = this.$parent._router;
            }
            // 获取组件配置属性
            // console.log(this.$options, '---')
            Object.defineProperty(this, '$router', {
                get: function () {
                    return this._root._router;
                }
            });
            Object.defineProperty(this, '$route', {
                get: function () {
                    return {
                        // 当前路由所在的状态
                        current: this._root._router.history.current
                    };
                }
            });
        }
    });
    Vue.component('router-link', {
        props: {
            to: String,
            tag: String
        },
        methods: {
            handleClick: function () {
            }
        },
        render: function (h) {
            var mode = this._self._root._router.mode;
            var tag = this.tag;
            // return h(tag, {href: `${mode === 'hash' ? '#' + this.to : this.to}`, 'onClick': this.handleClick}, this.$slots.default)
            return h('a', { 'href': "" + (mode === 'hash' ? '#' + this.to : this.to), 'onClick': this.handleClick }, this.$slots.default);
        }
    });
    Vue.component('router-view', {
        render: function (h) {
            // 需要将current变成动态，current变化会影响视图刷新
            // vue实现双向绑定, Object.defineProperty set get
            var current = this._self._root._router.history.current;
            var routesMap = this._self._root._router.routesMap;
            return h(routesMap[current]);
        }
    });
};
exports.default = VueRouter;
