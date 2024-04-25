---
title: docker
date: 2024-04-25 16:29:20
---

## docker 相关

### 平时会遇到有些镜像拉去不到，这个时候可以在本地利用魔法拉去到本地
```shell
docker images 
```
- 1. 查看本地镜像
![镜像](/Java/WX20240425-163138@2x.png)
  
- 2. 导出镜像
```shell
docker save -o next.tar yidadaa/chatgpt-next-web:latest
```
- 3. 将 next.tar 传输到服务器上面
- 4. 加载镜像
    
```shell
gzip next.tar
gunzip -c next.tar.gz | docker load
```

此时就可以丝滑的操作了，不用忍受服务器上面半天拉去不下来镜像的烦恼。