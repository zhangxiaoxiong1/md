import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/login',
      component:()=>import('@/pages/login')
    },
    {
      path:'/index',
      component:()=>import('@/pages/index'),
      children:[
        {
          path:'/home',
          component:()=>import('@/views/home')
        },
        {
          path:'/menu',
          component:()=>import('@/views/menu/index.vue'),
          meta:{
            name:'菜单列表'
          }
        },
        {
          path:'/role',
          component:()=>import('@/views/role/index.vue'),
          meta:{
            name:'角色列表'
          }
        },
        {
          path:'/user',
          component:()=>import('@/views/user/index.vue'),
          meta:{
            name:'管理员列表'
          }
        },
        {
          path:'/sort',
          component:()=>import('@/views/sort/index.vue'),
          meta:{
            name:'商品分类列表'
          }
        },
        {
          path:'/goods',
          component:()=>import('@/views/goods')
        },
        {
          path:'',
          redirect:'/home'
        }
      ]
    },
    {
      path:'*',
      redirect:'/index'
    }
  ]
})
