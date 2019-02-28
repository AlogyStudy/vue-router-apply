
/**
 * 基本实现 vue-router的功能
 * 
 * mode
 * router-link, router-view
 * this.$router, this.$route
 * Vue.use()注册插件
 */
import { RouterOptions, RouterMode, RouteConfig } from './routerType'

class HistoryRoute {
  current: null | string
  constructor() {
    this.current = null
  }
}

class VueRouter {
  mode: RouterMode
  routes: RouteConfig[]
  routesMap: Object
  history: HistoryRoute
  constructor(options: RouterOptions) {
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    // routes 需要是一个数组 // 先不考虑二级或多级路由
    // 将路由数组转换成格式为：{ '/home': Home, '/about': About } 
    // 好处是：通过路由路径取到文件，渲染取到的文件
    this.routesMap = this.createMap(this.routes)
    // 路由需要存放当前路径
    this.history = new HistoryRoute()
    // 初始化
    this.init()
    console.log(this.history, 'this.history.current')
  }
  init() {
    // 初始化 判断mode
    if (this.mode === 'hash') { // hash
      // 首次进入，需要加上 #/
      location.hash ? '' : location.hash = '/'
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1)
      })
    } else { // hisotry
      location.pathname ? '' : location.pathname = '/'
      window.addEventListener('load', () => {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current = location.pathname
      })
    }
  }
  createMap(routes: RouteConfig[]): Object {
    return routes.reduce((memo: any, current) => {
      memo[current.path] = current.component
      return memo
    }, {})
  }
  go() { }
  back() { }
  push() { }
  // static install (Vue: any) {
  // }
}

// 使用Vue.use 就会调用install方法
(<any>VueRouter).install = function (Vue: any) {
  // 每个组件 都有 this.$router, this.$route
  Vue.mixin({
    beforeCreate() {
      // 在所有组件中获取同一个路由实例
      if (this.$options && this.$options.router) { // 定位根组件
        this._root = this // 把当前实例挂载在_root上
        this._router = this.$options.router // 把router实例挂载在_router上
        // observer方法
        // 如果history中的current属性变化，也会刷新视图
        // this.xxxx = this._router.history
        Vue.util.defineReactive(this, 'xxx', this._router.history)
      } else {
        // vue组件渲染顺序 父 -> 子 -> 孙子 (先序深度算法)
        this._root = this.$parent._root // 获取路由唯一实例
        this._router = this.$parent._router
      }
      // 获取组件配置属性
      // console.log(this.$options, '---')
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router
        }
      })
      Object.defineProperty(this, '$route', {
        get() { // current属性
          return {
            // 当前路由所在的状态
            current: this._root._router.history.current
          }
        }
      })
    }
  })
  Vue.component('router-link', {
    props: {
      to: String,
      tag: String
    },
    methods: {
      handleClick () {
      }
    },
    render(h: Function) {
      let mode = this._self._root._router.mode
      let tag = this.tag
      // return h(tag, {href: `${mode === 'hash' ? '#' + this.to : this.to}`, 'onClick': this.handleClick}, this.$slots.default)
      return h('a', {'href': `${mode === 'hash' ? '#' + this.to : this.to}`, 'onClick': this.handleClick}, this.$slots.default)
    }
  })
  Vue.component('router-view', { // 根据当前状态　current，获取路由表内的组件 {'/about': About}
    render(h: Function) {
      // 需要将current变成动态，current变化会影响视图刷新
      // vue实现双向绑定, Object.defineProperty set get
      let current = this._self._root._router.history.current
      let routesMap = this._self._root._router.routesMap
      return h(routesMap[current])
    }
  })
}

export default VueRouter
