---
title: Go | 函数注意事项
tags: Go
categories: Go
description: 函数注意事项和使用细节
abbrlink: 1021065066
date: 2022-11-24 16:51:35
---

> 本篇收录至[Golang专栏](https://blog.i-xiao.space/categories/Go/)，持续更新，欢迎访问😊

# 细节汇总
1. 函数的形参列表可以是多个，返回值列表也可以是多个
2. 形参列表和返回值列表的数据类型，可以是值类型、也可以是引用类型
3. 函数的命名遵循标识符命名规范，首字母不能是数字，首字母大写表示该函数可以被本包文件和其它文件使用，类似public；首字母小写只能被本包文件使用，类似private。
4. 函数中的变量是局部的，外部不能访问。**作用域**
5. 基本数据类型和数组都是值传递的，即进行值拷贝。在函数内修改，不会影响到原来的值，
6. 如果希望函数内的变量能够修改函数外的变量，可以传入变量的地址（**&**），函数内以指针的方式操作变量，从效果上看类似**引用**
7. Go函数不支持函数重载。
8. 在Go中，函数也是一种数据类型，可以赋值给一个变量，则该变量是一个函数类型的变量，通过该变量可以对函数调用。
9. 函数既然是一种数据类型，因此在Go中，函数也可以作为形参，并且调用。（**回调函数**）
10. 为了简化数据类型定义，Go支持自定义数据类型
语法： type 自定数据类型名 数据类型 // (相当于一个别名)
案例： **type myInt int**                           // 这时，myInt就等价于int来使用了
    **type mySum  func(int, int) int**   // 这时，mySum就等价于func(int, int) int
11. 支持对函数返回值命名（**可以不受返回值顺序限制**）
12. 使用 _ 下划线标识符，忽略返回值。（**占位符**）
13. Go支持可变参数

# 值传递和指针传递
```go
func test(n1 int) {
	n1 = n1 + 10
	fmt.Println("test n1=", n1)
}

// 指针类型接收处理
func test02(n2 *int) {
	*n2 = *n2 + 10
	fmt.Println("test02 n2=", *n2)
}

func main() {
	n1 := 20
	n2 := 2
	test(n1) // 值类型
	test02(&n2) // 指针类型
	fmt.Println("main n1=", n1)
	fmt.Println("main n2=", n2)
}
```

# 什么是重载
重载： 函数名相同，但是形参不同或者数据类型不同的情况
Golang语言中是不支持传统的函数重载的，`fn redeclared in this block`
Golang语言是支持可变参数的，**空接口**的形式

![](https://pic.imgdb.cn/item/637f31c216f2c2beb1c2f216.jpg)

# 函数类型的变量
类型： **func(int, int) int**

```go
func getSum(n1 int, n2 int) int {
	return n1 + n2
}
func getSums(n1 int, n2 int, n3 int) int {
	return n1 + n2 + n3
}

// main 函数
sumFn := getSum
res := sumFn(10, 20)
fmt.Printf("%T %v\n", res, res) // int 30
fmt.Printf("%T \n", sumFn) // func(int, int) int

sumsFn := getSums
result := sumsFn(10, 20, 30)
fmt.Printf("result : %T %v\n", result, result) // result : int 60
fmt.Printf("sumsFn类型：%T \n", sumFn) // sumsFn类型：func(int, int) int

```
# 函数作为形参传入
```go
func getSum(n1 int, n2 int) int {
	return n1 + n2
}
func testFn(fnVar func(int, int) int, num1 int, num2 int) int {
	return fnVar(num1, num2) // 调用传入的函数，并返回值
}

// 函数类型形参
sumFn := getSum
total := testFn(sumFn, 1, 2)
fmt.Println("total=", total) // 3
```
# 自定义数据类型

1. 自定义函数数据类型， 相当于起了一个别名

```go
type mySum func(int, int) int

func testFn(fnVar mySum, num1 int, num2 int) int {
	return fnVar(num1, num2)
}

// func testFn(fnVar func(int, int) int, num1 int, num2 int) int {
// 	return fnVar(num1, num2)
// }
```

2. 自定义数据类型

```go
// main函数下
type myInt int
var num1 myInt = 2
// var num2 int = num1 // 这样是报错的， myInt和int并不等价
var num2 int = int(num1) // 显式类型转换
fmt.Printf("num1的类型：%T 值：%v \n", num1, num1) // num1的类型：main.myInt 值：2
fmt.Printf("num2的类型：%T 值：%v \n", num2, num2) // num2的类型：int 值：2
```

3. 定义的类型: 包名.类型名，如：`utils.myInt`
```go
// 以下是utils包
package utils

import "fmt"

func TestFn() string {
	fmt.Println("TestFn 函数被调用")
	type myInt int
	var n myInt = 10
	fmt.Printf("n的类型：%T 值：%v", n, n) // n的类型：utils.myInt 值：10
	return "hahaha"
}

```
# 返回值命名
```go
func sumSub(n1 int, n2 int) (sum int, sub int) {
    // 这里不需要声明sum, sub变量了，也不用在return时写
	sum = n1 + n2
	sub = n1 - n2
	return
}

// main函数
sum, sub := sumSub(9, 8)
fmt.Println("sum=", sum, "sub=", sub) // sum= 17 sub= 1
```
# 可变参数
基本语法
**1、支持零到多个参数**
`func sum(args... int) {}`
**2、支持1到多个参数**
`func sum(n1 int, args... int) {}`
args：就是一个承接的变量名，可以自定义，如：`func sum(n1 int, **vars**... int) {}`

说明：

- args是slice切片，通过`args[index]`可以访问到各个值
- args必须放到形参列表的最后面

参数个数可变
```go
func sumV2(n1 int, args ...int) int {
	sum := n1
	fmt.Printf("args类型是：%T\n", args) // args类型是：[]int
	// 遍历args切片
	for i := 0; i < len(args); i++ {
		sum += args[i]
	}
	return sum
}

// main函数
// 参数可变
total02 := sumV2(1, 2, 3, 4)
fmt.Println("total02=", total02) // total02= 10
```

# 练习

交换变量a, b的值
```go
package main

import "fmt"

func swap(n1 *int, n2 *int) {
	*n1 = *n1 + *n2
	*n2 = *n1 - *n2 // *n1
	*n1 = *n1 - *n2 // *n2
}

func main() {
	a := 12
	b := 20
	swap(&a, &b)
	fmt.Println("a = ", a, "b = ", b)
}
```

---

我是 [**甜点cc**](https://blog.i-xiao.space/)☭

微信公众号：【看见另一种可能】

热爱前端开发，也喜欢专研各种跟本职工作关系不大的技术，技术、产品兴趣广泛且浓厚。本号主要致力于分享个人经验总结，希望可以给一小部分人一些微小帮助。

希望能和大家一起努力营造一个良好的学习氛围，为了个人和家庭、为了我国的互联网物联网技术、数字化转型、数字经济发展做一点点贡献。数风流人物还看中国、看今朝、看你我。