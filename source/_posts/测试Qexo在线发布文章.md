---
abbrlink: ''
categories: []
date: '2025-10-11T16:12:56.341296+08:00'
excerpt: 测试 Qexo是Hexo的后台管理程序，我将其托管在Vercel上，现在我可以在后台管理网站上在线编辑或发布博客文章，而不必在本地编译后发布。可惜无法发布到我的服务器上，这也比较危险。Show ...
plugins:
  mathjax: true
tags:
- Test
tikzjax: true
title: 测试Qexo在线发布文章
updated: '2025-10-11T18:06:36.068+08:00'
---
### 测试

Qexo是Hexo的后台管理程序，我将其托管在Vercel上，现在我可以在后台管理网站上在线编辑或发布博客文章，而不必在本地编译后发布。可惜无法发布到我的服务器上，这也比较危险。

### 数学公式测试

> Let $Y$ be an arbitrary compactification of $Y$; let $\beta(X)$ be the Stone-Cech compactification. Show there is a continuous surjective closed map $g : \beta(X) \to Y$ that equals the identity on $X$.
> [This exercise makes precise what we mean by saying that $\beta(X)$ is the “maximal”  compactification of $X$. It shows that every compactification of $X$ is equivalent to a quotient space of $\beta(X)$.]

```tikz
\usepackage{tikz-cd}
\begin{document}
    \begin{tikzcd}
        X && Y \\
        \\
        {\beta(X)}
        \arrow["i", from=1-1, to=1-3, hook]
        \arrow[from=1-1, to=3-1]
        \arrow["\beta(x)", from=3-1, to=1-3]
    \end{tikzcd}
\end{document}
```

### 测试全自动部署

改动文章，测试自动部署
