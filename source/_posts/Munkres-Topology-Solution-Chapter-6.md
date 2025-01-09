---
title: 'Munkres Topology Solution: Chapter 6'
date: 2025-01-09 22:52:36
categories: [拓扑学, 一般拓扑学]
tags: [Munkres Topology Solution]
toc: true
tikzjax: true
plugins: 
    mathjax: true
---

# §39. Local Finiteness

## Ex.39.1
>Check the statements in Example 1.

<!--more-->

Omitted.

## Ex.39.2
>Find a point-finite open covering $\mathscr{A}$ of $\Bbb R$ that is not locally finite. (The collection $\mathscr{A}$ is point-finite if each point of $\Bbb R$ lies in only finitely many elements of $\mathscr{A}$.)

$\lbrace\Bbb R\rbrace\cup\lbrace(1/(n+1),1/n)\rbrace_n$

## Ex.39.3
>Give an example of a collection of sets $\mathscr{A}$ that is not locally finite, such that the collection $\mathscr{B}=\lbrace\overline A|A\in\mathscr{A}\rbrace$ is locally finite.

Note that if different $A\in\mathscr{A}$ give different closure then the collection $\mathscr{B}$ is definitely not locally finite. So the counterexample happens when closures of many $A\in\mathscr{A}$ coincide.

For example, $\lbrace A\subset\Bbb R|A\supset\Bbb Q\rbrace$ will do.

## Ex.39.4
>Let $\mathscr{A}$ be the following collection of subsets of $\Bbb R$:
$$\mathscr{A}=\lbrace(n,n+2)|n\in\Bbb Z\rbrace$$ Which of the following collections refine $\mathscr{A}$?
$$
\begin{cases}
    \mathscr{B}=\lbrace(x,x+1)|x\in\Bbb R\rbrace\\\\
    \mathscr{C}=\lbrace(n,n+3/2)|n\in\Bbb Z\rbrace\\\\
    \mathscr{D}=\lbrace(x,x+3/2)|x\in\Bbb R\rbrace
\end{cases}
$$


