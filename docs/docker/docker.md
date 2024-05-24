---
title: docker
date: 2024-04-25 16:29:20
tags:
 - docker 
categories:
 - 服务器
---

## docker 相关

### 拉取镜像很难？

平时会遇到有些镜像拉取不到，这个时候可以在本地利用魔法拉去到本地，然后手动上传到服务器。

```shell
docker images 
```
- 1. 查看本地镜像
![镜像](/Java/WX20240425-163138@2x.png)
  
- 2. 导出镜像
```shell
docker save -o next.tar yidadaa/chatgpt-next-web:latest
gzip next.tar

# 或者
docker save yidadaa/chatgpt-next-web:latest | gzip > next.tar.gz

```
- 3. 将 next.tar.gz 传输到服务器上面
- 4. 加载镜像
    
```shell
gunzip -c next.tar.gz | docker load
```

此时就可以丝滑的操作了，不用忍受服务器上面半天拉去不下来镜像的烦恼。

### 清理空间？

参考原始文档 https://docs.docker.com/reference/cli/docker/image/prune/

- 1. 移除所有没有容器使用的镜像
    
```bash
docker image prune -a

```
- 2. 跳过警告提示：--force或-f
    
```bash
docker image prune -f
```

- 3. 超过24小时创建的镜像
    
```bash
docker image prune -a --filter "until=24h"
```