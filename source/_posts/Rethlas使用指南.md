---
title: Rethlas使用指南
date: 2026-05-30 21:47:35
categories:
- AI4Math
tags:
- Rethlas
--- 

Rethlas是北大团队开源的两个Agent集合体，用于辅助数学证明，其中一个Agent负责推理，另一个Agent负责验证想法，整个过程基本是模拟人类数学工作者的工作流（直觉推导+仔细验证）。最近一位北大的数学工作者用Rethlas连发若干篇代数几何方面的文章，即使没有单位距离猜想重磅，但也引起了一些骚动。这件事特殊的地方在于，[Rethlas是开源的](https://github.com/frenzymath/Rethlas)，只需要对Codex的访问权限即可使用，正好我手里有ChatGPT plus订阅，这两天便花了些时间折腾了一下。

<!--more-->

虽然Rethlas有一个Readme文档，当因为我不是经常写代码，使用没有ui界面的开源工具还是免不了踩不少坑，才勉强跑起来，跑了一个我最近在想的很不成熟的例子，最后一步验证的时候Verifier还是报了错，但整体流程基本跑通了。这里记录一下在我的PC上运行Rethlas时遇到的问题和解决方法。

首先说明，所有的修改都是基于官方Readme中的流程的，应当首先通读官方的文档。

## 在Windows上运行主程序
首先要注意的点是如果你像我一样使用的是windows电脑，正常是无法直接运行.sh文件的，而Rethlas的主入口是一个.sh文件。

在官方文档中，主入口启动的命令是
```bash
cd agents/generation
source .venv/bin/activate
PROBLEM_FILE=data/my_problem.md ./tests/run_example.sh
```
第一行不用解释，第二行应该换成Windows中python进入虚拟环境的方式，例如
```bash
.\.venv\Scripts\activate     
```
第三行则应拆成两行，首先设置 PROBLEM_FILE 常数
```bash
$env:PROBLEM_FILE="data/example/example1.md"
```
然后启动主程序
```bash
bash tests/run_example.sh
```
这里你电脑上很有可能没有bash命令，如果你电脑上安装了Git（如果没有，推荐安装一个），则可以使用Git自带的bash，例如
```bash
D:\code\Git\bin\bash.exe tests/run_example.sh
```

## Verifier问题
我使用Rethlas时问题多集中在Verifier上，第一次运行示例时Verifier报了很多错误。

在`agents/verification/api/server.py`文件中，第74行`build_prompt`函数中，应将`f"Proof:\n{proof}\n\n"`替换为`f"Proof:{proof}\n\n"`，即删除第一个换行符，这是因为至少对于我，使用codex时因为网络问题总是会重连5次，因为不知明原因，每次运行验证时，第一个换行符处会直接中断，然后显示重连尝试。如果在Proof内容前换行，实际证明内容会直接消失，那么待连接成功后Verifier会得到一个空证明，总是返回False。

此外，在运行Verification服务前，应该用
```bash
where.exe codex
```
查找到codex路径，然后先行设置（以我的为例）
```bash
$env:CODEX_BIN="C:\Users\Westlifer\AppData\Roaming\npm\codex.cmd"
```
再启动服务。

## 打包问题
证明结束后，主程序会提示你
```
To view results in the browser, run:
  ./site/serve.sh
Then open http://localhost:3264
```
但我实际运行时总是直接中断。原因查明为`agents/generation/site/serve.sh`文件第102行`python3 "$TRANSFORM" "$source_md" "$tmp"`在我电脑上应改为`python "$TRANSFORM" "$source_md" "$tmp"`，我的电脑上python启动命令只注册了`python`这一个，而没有`python3`。

我注意到两个agent的`config.toml`文件里也涉及使用python启动mcp服务器，但我不确定这里是否需要把python3改python，我是改了的。