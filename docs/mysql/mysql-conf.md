---
title: mysql
date: 2024-04-24 16:14:58
tags:
 - mysql
categories: 
 - 后台
---


## mysql 常见问题

### 排序规则
- utf8mb4_general_ci 对字母的大小写不敏感。说得更直白一点，就是不区分大小写。
- utf8mb4_bin 对字符大小写敏感，也就是区分大小写


在MySQL中，排序是数据检索中非常重要的一个环节。根据字符集和排序规则（Collation），MySQL排序的行为可能有所不同。排序方式通常由字段的排序规则来决定，而这个排序规则又与该字段使用的字符集紧密相关。下面列举了一些MySQL中常见的排序方式：

1. **二进制排序（Binary Collation）**：
    - 名称通常以`_bin`结尾。
    - 比较基于字符的二进制值。
    - 区分大小写。

   示例：`utf8mb4_bin`, `latin1_bin`

2. **不区分大小写的排序（Case-Insensitive Collation）**：
    - 名称通常以`_ci`结尾。
    - 在比较时，不区分字母的大小写。

   示例：`utf8mb4_general_ci`, `latin1_swedish_ci`

3. **区分大小写的排序（Case-Sensitive Collation）**：
    - 名称通常以`_cs`结尾。
    - 在比较时，会区分字母的大小写。

   示例：`utf8mb4_general_cs`, `latin1_general_cs`

4. **Unicode排序（Unicode Collation）**：
    - 用于Unicode字符集（如`utf8mb4`）的特定排序规则。
    - 根据Unicode标准来比较字符。

   示例：`utf8mb4_unicode_ci`, `utf8_unicode_ci`

5. **Accent-sensitive和Accent-insensitive排序**：
    - Accent-sensitive（名称可能包含`_as`）会区分字符的变音符号。
    - Accent-insensitive（名称可能包含`_ai`）则不会区分变音符号。

   示例：通常在具体字符集的Collation中体现，如`utf8mb4_spanish_ci`可能会区分西班牙语特有的变音符号。

6. **版本特定的排序规则**：
    - 随着Unicode标准的更新，MySQL也会引入新的排序规则来适应这些变化。
    - 这些排序规则通常包含了版本号。例如：`utf8mb4_0900_ai_ci`是基于Unicode 9.0版本的排序规则，不区分大小写和变音符号。

在实际使用中，选择合适的排序规则对于确保数据按预期的方式排序非常重要。例如，如果你的应用主要是英文环境，那么选择一个如`utf8mb4_general_ci`这样的通用不区分大小写的排序规则是合适的。如果你需要处理多种语言，考虑使用基于Unicode标准的排序规则，如`utf8mb4_unicode_ci`或者更具体的版本`utf8mb4_0900_ai_ci`，来确保符合Unicode标准的排序。

此外，选择排序规则时也需要考虑性能因素。不同的排序规则可能会因为其比较机制的复杂性而影响查询的性能。在性能和准确性之间需要做出适当的平衡。

:::tip
对比 utf8mb4_general_ci 和 utf8mb4_0900_ai_ci

`utf8mb4_0900_ai_ci` 和 `utf8mb4_general_ci` 是MySQL中的两种排序规则（Collation），它们都适用于 `utf8mb4` 字符集，但在排序和比较字符串时有所不同。以下是这两个排序规则的主要区别：

1. **版本和标准**：
   - `utf8mb4_0900_ai_ci` 基于 Unicode 9.0 排序规则，是相对较新的排序规则，考虑了Unicode较新的标准和字符。
   - `utf8mb4_general_ci` 是更早期的排序规则，没有针对最新的Unicode版本进行优化。

2. **准确性**：
   - `utf8mb4_0900_ai_ci` 提供了更准确的Unicode排序结果。因为它基于最新的Unicode标准，所以在处理全球各个语言的字符时更为准确，特别是一些新增的Unicode字符和表情符号。
   - `utf8mb4_general_ci` 为了兼容性和性能提供了一种比较通用的排序方式，但在某些语言或特别的字符对比中可能不够准确。

3. **性能**：
   - `utf8mb4_0900_ai_ci` 在某些复杂的字符对比中可能会稍微慢一些，因为它需要遵循更详细的Unicode标准和规则。
   - `utf8mb4_general_ci` 旨在提供较快的排序和比较操作，尽管其牺牲了一些准确性。

4. **对大小写和变音符号的敏感度**：
   - `utf8mb4_0900_ai_ci` 和 `utf8mb4_general_ci` 都是大小写不敏感（Case-insensitive）和变音符号不敏感（Accent-insensitive）的排序规则。这表示在这两种排序规则下，大小写字母被视为等同，而字母的变音符号也不会影响排序结果。

选择哪一个排序规则取决于你的具体需求。如果你需要最新的Unicode标准支持，并且对排序的准确性有较高要求，`utf8mb4_0900_ai_ci` 是一个更好的选择。如果你更注重性能，或者是在一个兼容性要求更高的老项目中工作，那么`utf8mb4_general_ci` 可能是更适合的选项。不过，对于大多数现代应用来说，推荐使用基于最新Unicode标准的 `utf8mb4_0900_ai_ci` 来确保对全球各种语言和新字符的良好支持。
:::