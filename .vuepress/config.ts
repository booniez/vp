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

export default defineUserConfig({
  title: "BitsofBrain",
  description: "Just playing around",
  bundler: viteBundler({}),
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    // logo: "/logo.png",
    author: "booniez",
    authorAvatar: "/WX20240411-145310@2x.png",
    docsRepo: "https://github.com/vuepress-reco/vuepress-theme-reco-next",
    // docsBranch: "main",
    // docsDir: "example",
    lastUpdatedText: "",
    // series 为原 sidebar
    // autoSetSeries: true,
    series: {
      "/docs/iOS/": [
        {
          text: "iOS方面",
          children: [
            "summary"
          ],
        },
      ],
      "/docs/Java/": [
        {
          text: "继承",
          children: [
              "继承/1. 概述",
              "继承/2. 特点",
              "继承/3. super 和 this",
              "继承/4. 方法重写",
              "继承/5. 继承中构造方法访问特点",
              "继承/6. 抽象类"
          ],
        }
      ],
    },
    navbar: [
      { text: "Home", link: "/" },
      {
        text: "Docs",
        children: [
          { text: "iOS", link: "/docs/iOS/summary" },
          { text: "Java", link: "/docs/Java/summary" },
        ],
      },
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
  }),
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
    }),
    sitemapPlugin({
      // 选项
      hostname: 'https://booniez.cn'
    }),
  ],
  // debug: true,
});
