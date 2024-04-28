---
title: 配置 ssh 免密
date: 2024-04-26 16:03:33
tags:
 - ssh 
categories:
 - 服务器
---

免密SSH登录让你能够在不需要输入密码的情况下，从本地电脑连接到远程服务器。这主要通过SSH密钥对来实现：一个私钥，保留在本地机器；一个公钥，上传到远程服务器。

下面是配置步骤：

### 1. 在本地计算机上生成SSH密钥对

打开一个终端或命令提示符，并运行以下命令。当提示输入文件位置时，可以按Enter键接受默认值。如果已存在密钥对，这将覆盖它们，因此如果你已有密钥对且不希望覆盖，应跳过这步。

```bash
# 方式1
ssh-keygen
#方式2
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

运行上述命令时，你会看到：

```
Generating public/private rsa key pair.
Enter file in which to save the key (/your/home/directory/.ssh/id_rsa):
```

简单地按`Enter`即可，之后会询问你是否要设置密钥密码(passphrase)，可以选择留空。

### 2. 将公钥添加到远程服务器

生成密钥对后，你需要将公钥(`~/.ssh/id_rsa.pub`)添加到远程服务器的`~/.ssh/authorized_keys`文件。这可以通过`ssh-copy-id`命令简化完成。如果你的远程服务器用户名是`username`，服务器地址是`server_address`，运行：

```bash
ssh-copy-id username@server_address
```

如果远程服务器未安装`ssh-copy-id`，或者你从Windows到Linux服务器进行连接，你可能需要手动添加公钥。首先，显示并复制本地机器上的公钥内容：

```bash
cat ~/.ssh/id_rsa.pub
```

然后，登录到你的服务器，编辑`~/.ssh/authorized_keys`文件，并将复制的公钥内容粘贴进去：

```bash
ssh username@server_address
mkdir -p ~/.ssh
echo your_public_key_here >> ~/.ssh/authorized_keys
```

确保替换`your_public_key_here`为之前复制的公钥内容。

### 3. 设置适当的权限

在远程服务器上，为了安全考虑需要设置正确的文件权限：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```
### 4. 添加 ``known_hosts``
```bash
# ${{ HOST }} 是获取 host 变量
ssh-keyscan -H ${{ HOST }} >> ~/.ssh/known_hosts
```

### 4. 测试免密登录

现在，你可以试着从本地计算机SSH连接到远程服务器，如果配置正确，不应再询问密码：

```bash
ssh username@server_address
```

执行以上步骤后，你应该能够在不输入密码的情况下从本地计算机通过SSH连接到远程服务器了。