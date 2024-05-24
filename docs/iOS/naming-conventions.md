---
title: 命名规范
date: 2024-05-24 10:48:47
tags:
 - 规范
categories:
 - iOS
---

# iOS 开发命名规范

以下是一份详细的iOS开发命名规范，以辅助开发者编写清晰、一致且易于理解的代码。请确保这些规范与Apple官方的Swift编程语言指南保持一致。

## 一、目的

目的在于确保项目的可维护性、规范化开发流程，提高代码评审的效率。该规范面向iOS开发人员，旨在帮助团队成员之间达成统一的代码书写标准。

## 二、命名规范

### 基本原则

- 不能使用拼音与英文混合命名，绝对避免中文命名。
- 保持英文拼写和语法的正确，确保命名的清晰和无歧义。
- 对于一些国际通用的名称如alibab、taobao、youku、hangzhou，可视同英文。

### 大驼峰与小驼峰

- **大驼峰(CamelCase)**：每个单词的首字母都大写。例：`NameTextField`
- **小驼峰(camelCase)**：第一个单词首字母小写，后续单词首字母大写。例：`nameTextField`

### 2.1 项目命名

项目名应遵循大驼峰命名法。例如：`AoRiseProject`

### 2.2 Bundle Identifier 命名

使用全小写字母的反向域名结构。例如：`com.companyname.service.appname`

### 2.3 类名命名

类名应遵循大驼峰命名法，并可包括类前缀。例如：`KQLoginViewController`

控件类命名建议：

| 控件           | 命名后缀        | 示例                   |
| -------------- | --------------- | ---------------------- |
| UIView         | View            | `KQBaseView`           |
| UIButton       | Button          | `KQSubmitButton`       |
| UILabel        | Label           | `KQNameLabel`          |
| UITextView     | TextView        | `KQDescriptionTextView`|

### 2.4 类的组织结构

建议按照以下标记将`UIViewController`等类组织起来：

```swift
// MARK: - Life Cycle
// View controller lifecycle methods

// MARK: - Public Methods
// Public methods and interface

// MARK: - Private Methods
// Internal workings of the class

// MARK: - Actions
// IBActions and action methods

// MARK: - Delegate Methods
// Delegate method implementations

// MARK: - Network calls
// All network calls

// MARK: - Properties
// Stored and computed properties
```

### 2.5 变量和方法

遵循小驼峰命名法。变量命名要见名知意，方法命名需明确表达出其功能。

### 2.6 全局常量

全局常量使用如下格式命名：`项目前缀_大写字母命名`，例如：`KQ_SCREEN_WIDTH`

### 2.7 参数命名

遵循小驼峰命名法，尽量保持命名的可读性。

## 三、资源文件命名

使用全部小写字母和下划线。例如：`module_purpose_name.png`

## 四、第三方库规范

选择稳定版本且活跃维护的库。使用`cocoapods`进行管理。任何需要修改的第三方库放在`TheThirdLibrary`文件夹中。

## 五、注释规范

保证代码可读性和可维护性。类注释、方法注释和模型属性注释应详尽清晰。

## 六、编码规范

保持代码整洁，方法间留有空行，删除多余的注释。采用合适的代码结构和布局，避免不必要的重复代码。

## 七、其他规范

推荐使用Masonry等布局工具结合xib，而非纯storyboard。提倡方法提取和重用。

以上规范或命名示例只是指导性建议，详细更丰富的内容，请参照Apple的官方文档进行深入学习和应用。

## 参考文档

进一步细节和最佳实践，请访问Apple的[Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)。

参考文章[iOS开发规范](https://juejin.cn/post/7081108596645167135)

上述规范仅供参考，具体的项目可能会有不同的要求，所以请以项目的官方规范文档为准。