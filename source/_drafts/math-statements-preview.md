---
title: 数学排版验收草稿
date: 2026-10-06 12:00:00
engine: statement
toc: true
tikzjax: true
plugins:
  mathjax: true
---

此草稿仅供本地验收，默认构建不包含它。检查 [](#pre:thm-product) 与 [](#pre:def-product) 的自动引用。

## 定义与主定理

::: {.definition #def-product}
集合 $X$ 与 $Y$ 的积是有序对的集合 $X\times Y$。
:::

::: {.lemma #lem-projections}
投影 $\pi_X:X\times Y\to X$ 与 $\pi_Y:X\times Y\to Y$ 是良定义的映射。
:::

::: {.theorem #thm-product}
对任意集合 $Z$，映射 $Z\to X\times Y$ 与一对映射 $Z\to X$、$Z\to Y$ 一一对应。
:::

::: {.proof #proof-product}
由 [](#pre:def-product) 和 [](#pre:lem-projections)，把 $(f,g)$ 送到 $z\mapsto(f(z),g(z))$。复合两个投影得到逆映射，所以 [](#pre:thm-product) 成立。
:::

::: {.remark #rem-uniqueness}
这里的“一一对应”表达积的泛性质；它只依赖投影，不依赖元素的记号。
:::

::: {.example #exa-singleton}
取 $Z=\{*\}$，[](#pre:thm-product) 就给出一个有序对与它的两个分量之间的对应。
:::

## 手机局部滚动

$$
\operatorname{Hom}(Z,X\times Y)\cong\operatorname{Hom}(Z,X)\times\operatorname{Hom}(Z,Y)\cong\{(f,g)\mid f:Z\to X,\ g:Z\to Y\}\cong\{z\mapsto(f(z),g(z))\mid(f,g)\in X^Z\times Y^Z\}.
$$

```tikz
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}[column sep=7em]
Z && X\times Y && Y \\
\\
&& X
\arrow["{(f,g)}", from=1-1, to=1-3]
\arrow["\pi_Y", from=1-3, to=1-5]
\arrow["f"', from=1-1, to=3-3]
\arrow["\pi_X", from=1-3, to=3-3]
\end{tikzcd}
\end{document}
```

脚注兼容性示例。^[这条脚注由 Pandoc 生成。]
