import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";
import { viteBundler } from '@vuepress/bundler-vite';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { appendDatePlugin } from '@vuepress/plugin-append-date';
import { copyCodePlugin } from '@vuepress/plugin-copy-code';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { seoPlugin } from '@vuepress/plugin-seo';
import { sitemapPlugin } from '@vuepress/plugin-sitemap';
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics';
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics';

export default defineUserConfig({
  title: "booniez",
  description: "思绪合集",
  bundler: viteBundler({}),
  plugins: [
    appendDatePlugin({
      format: 'full',
    }),
    copyCodePlugin({
      // options
    }),
    mediumZoomPlugin({
      // 配置项
    }),
    seoPlugin({
      // 选项
      hostname: 'https://booniez.cn'
    }),
    sitemapPlugin({
      // 选项
      hostname: 'https://booniez.cn'
    }),
    googleAnalyticsPlugin({
      // 配置项
      id: 'G-Y9YKHTXLMM',
    }),
    baiduAnalyticsPlugin({
      // 配置项
      id: '1eca8470f940050615326f382559c127',
    }),
    [
      '@vuepress/last-updated',
      {
        dateOptions:{
          hour12: false
        }
      }
    ],
  ],
  // 打开过后会导致 algolia 检索不到内容
  // 会默认给检索条件 form 里面加上 lang=zh-CN
  // 清空了 algolia 数据，重新收集了 lang为zh-CN的数据集
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN',
      // title: 'VuePress',
      // description: 'Vue 驱动的静态网站生成器',
    },
  },
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    // logo: "/logo.png",
    author: "booniez",
    authorAvatar: "/WX20240411-145310@2x.png",
    lastUpdatedText: "最后更新",
    // lastUpdated: "最后更新",
    // series 为原 sidebar
    // autoSetSeries: true,
    head: [
      [
        'link',{ rel: 'icon', href: '/favicon.ico' }
      ]
    ],
    navbar: [
      { text: "Home", link: "/" },
      {
        text: "Docs",
        children: [
          { text: "iOS", link: "/docs/iOS/summary" },
          { text: "Java", link: "/docs/Java/extends/summary" },
          { text: "mysql", link: "/docs/mysql/mysql-conf" },
          { text: "docker", link: "/docs/docker/docker" },
          { text: "server", link: "/docs/server/config/nginx/nginx-gzip" },
        ],
      },
      // { text: "about", link: "/docs/about/me" },
    ],
    bulletin: {
      
    },
    commentConfig: {
      type: 'waline',
      options: {
        serverURL: 'https://vp-comment-coral.vercel.app/',
        hideComments: false, // 全局隐藏评论，默认 false
        lang: 'zh-CN',
        locales: {
          nick: '昵称',
          nickError: '昵称不能少于3个字符',
          mail: '邮箱',
          mailError: '请填写正确的邮件地址',
          link: '网址',
          optional: '可选',
          placeholder: '欢迎评论',
          sofa: '来发评论吧~',
          submit: '提交',
          like: '喜欢',
          cancelLike: '取消喜欢',
          reply: '回复',
          cancelReply: '取消回复',
          comment: '评论',
          refresh: '刷新',
          more: '加载更多...',
          preview: '预览',
          emoji: '表情',
          uploadImage: '上传图片',
          seconds: '秒前',
          minutes: '分钟前',
          hours: '小时前',
          days: '天前',
          now: '刚刚',
          uploading: '正在上传',
          login: '登录',
          logout: '退出',
          admin: '博主',
          sticky: '置顶',
          word: '字',
          wordHint: '评论字数应在 $0 到 $1 字之间！\n当前字数：$2',
          anonymous: '匿名',
          level0: '潜水',
          level1: '冒泡',
          level2: '吐槽',
          level3: '活跃',
          level4: '话痨',
          level5: '传说',
          gif: '表情包',
          gifSearchPlaceholder: '搜索表情包',
          profile: '个人资料',
          approved: '通过',
          waiting: '待审核',
          spam: '垃圾',
          unsticky: '取消置顶',
          oldest: '按倒序',
          latest: '按正序',
          hottest: '按热度',
          reactionTitle: '你认为这篇文章怎么样？',
        },
      },
    },
    algolia: {
      appId: '01FIT1QHVJ',
      apiKey: '6c048862f4e91172dda00bd6b8eabf77',
      indexName: 'booniez',
      container: '### REPLACE ME WITH A CONTAINER (e.g. div) ###',
      // inputSelector: '### REPLACE ME ####',
      // algoliaOptions: { 'facetFilters': ["lang:$LANG"] },
      debug: false // Set debug to true if you want to inspect the dropdown
    },
    series: {
      "/docs/iOS/": [
        {
          text: "iOS方面",
          children: [
            {
              text: "项目随记",
              children: [
                "iOS-photo-backup",
              ]
              // "summary",

            },
            {
              text: "面试",
              children: [
                "interview/thread",
                "interview/class-struct",
              ]
              // "summary",

            },
          ],
        },
      ],
      "/docs/Java/": [
        {
          text: "继承",
          children: [
            "extends/summary",
            "extends/features",
            "extends/super&this",
            "extends/override",
            "extends/construction-method-features",
            "extends/abstract",
            "extends/code-block",
            "extends/interface",
            "extends/polymorphism",
          ],
        },
      ],
      "/docs/mysql/": [
        {
          text: "mysql",
          children: [
            "mysql-conf",
          ],
        },
      ],
      "/docs/docker/": [
        {
          text: "docker",
          children: [
            "docker",
          ],
        },
      ],
      "/docs/server/": [
        {
          text: "nginx",
          children: [
            "config/nginx/nginx-gzip",
            "config/nginx/nginx-location",
          ],
        },
        {
          text: "ssh",
          children: [
            "config/ssh/ssh-config",
          ],
        },
        {
          text: "mac",
          children: [
            "config/mac/mac-config",
          ],
        },
      ],
    },
  }),
  // debug: true,
});
