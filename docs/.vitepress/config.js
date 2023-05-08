import { defineConfig } from 'vitepress'

export default defineConfig({
    // ...
    themeConfig: {
        nav: [// 导航栏
            {
                text: '概述',
                link: '/'
            }, {
                text: 'Vue 学习笔记',
                items: [
                    { text: '笔记', link: '/guide/vue/test03' }, // 可不写后缀 .md
                    { text: '其它链接', link: 'https://www.baidu.com/' }// 外部链接
                ]
            }, {
                text: 'Typescript 学习笔记',
                items: [
                    { text: '笔记', link: '/guide/ts/' },// 以 ‘/’结束，默认读取 README.md
                    { text: '其它链接', link: 'https://www.baidu.com/' } // 外部链接
                ]
            }
        ],
        sidebar: [
            {
                text: '首页',
                items: [
                    {
                        text: 'index',
                        link: 'index', 
                    },
                    {
                        text: 'prototype',
                        link: 'prototype', 
                    },
                    {
                        text: '浏览器事件机制（冒泡与捕获）',
                        link: 'base/browerEvent', 
                    },
                ]
            },
            {
                text: '常用正则',
                items: [
                    {
                        text: '常用正则',
                        link: 'regexp', 
                    },
                ]
            },
            {
                text: 'Typescript',
                collapsible: true,
                items:[
                    {
                        text: '基本语法',
                        link: 'typescript/base', 
                    },
                    {
                        text: '函数参数双向协变',
                        link: 'typescript/covariant', 
                    },
                    {
                        text: '类型知识补充',
                        link: 'typescript/extends', 
                    }
                ]
            },
            {
                text:"React",
                collapsible: true,
                items:[
                    {
                        text: 'Fiber',
                        link: 'react/fiber/fiber', 
                    },
                    // {
                    //     text: 'prototype',
                    //     link: 'prototype', 
                    // },
                ]
            },
            {
                text: "Vue",
                collapsible: true,
                items: [
                    {
                        text: '升级Vue3',
                        link: 'vue/upgradevue3'
                    }
                ]
            }
            
        ]
    },
    
})