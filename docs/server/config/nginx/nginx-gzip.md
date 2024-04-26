---
title: 配置 gzip
date: 2024-04-26 10:03:33
tags:
 - nginx 
categories:
 - 服务器
---

## 配置 gzip

在Nginx中启用Gzip压缩可以帮助减少服务器响应的大小，从而加快网站加载速度。要在Nginx服务器上启用Gzip压缩，您需要编辑Nginx配置文件。通常，这个配置文件被命名为`nginx.conf`，通常位于`/etc/nginx/`或`/usr/local/nginx/conf/`目录下。

以下是启用Gzip压缩的基本步骤和示例配置：

1. **打开Nginx配置文件** ：

   使用文本编辑器打开`nginx.conf`，例如使用`vim`或`nano`编辑器。
   ```bash
   sudo vim /etc/nginx/nginx.conf
   ```

2. **在http模块中启用Gzip** ：

   在`http`模块中添加或修改以下指令来启用Gzip压缩。确保您是在`http`块内添加这些配置，而不是在`server`或`location`块。
   ```nginx
   http {
       gzip on; # 启用Gzip压缩
       gzip_vary on; # 让代理服务器缓存Gzip和非Gzip版本的资源
       gzip_proxied any; # 无论代理服务器的缓存条件如何，都启用压缩
       gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript; # 指定哪些类型的数据进行压缩
       gzip_comp_level 6; # 压缩级别，范围是1-9，5是个比较均衡的选择
       gzip_min_length 256; # 只压缩大于这个大小的响应
       gzip_buffers 16 8k; # 设置用于缓存压缩结果的缓冲区数量和大小
       gzip_http_version 1.1; # 最低HTTP协议版本
       # 更多配置项可以根据需求进行添加
   }
   ```

    - `gzip_on` 指令启用或禁用gzip压缩。
    - `gzip_vary` 向响应头添加`Vary: Accept-Encoding`，这使得支持Gzip的缓存可以根据请求头中的`Accept-Encoding`值来分别缓存压缩过的和未压缩的版本。
    - `gzip_proxied` 指定在代理服务器环境下哪些响应可以被压缩。
    - `gzip_types` 指定哪些内容类型（MIME类型）应该被压缩。默认情况下，仅文本文件被压缩，因此您可能希望添加更多类型，比如`application/javascript` 或 `application/json`。
    - `gzip_comp_level` 设置压缩级别，从1（最快、压缩最少）到9（最慢、压缩最多）的范围。

3. **重启Nginx服务**：

   修改配置文件后，您需要重启Nginx服务来使这些变更生效。
   ```bash
   sudo systemctl restart nginx
   ```
   或者如果您使用的是老版本的系统可能需要使用：
   ```bash
   sudo service nginx restart
   ```

这就完成了Nginx的Gzip压缩配置。以上步骤和配置将帮助您在Nginx服务器上启用Gzip压缩，提高网页加载速度和效率。