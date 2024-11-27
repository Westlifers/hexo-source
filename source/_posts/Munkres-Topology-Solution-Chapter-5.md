---
title: 'Munkres Topology Solution: Chapter 5'
date: 2024-11-27 01:02:51
categories: [拓扑学, 一般拓扑学]
tags: [Munkres Topology Solution]
toc: true
tikzjax: true
plugins: 
    mathjax: true
---

# §37. Tychonoff Theorem

## Ex.37.1
>Let $X$ be a space. Let $\mathscr D$ be a collection of subsets of $X$ that is maximal with respect to the finite intersection property.
(a) Show that $x\in \bar D$ for every $D\in\mathscr D$ iff every nbhd of $x$ belongs to $\mathscr D$. Which implication uses maximality of $\mathscr D$?
(b) Let $D\in\mathscr D$. Show that if $A\supset D$, then $A\in\mathscr D$
(c) Show that if $X$ satisfies the $T_1$ axiom, there is at most one point belonging to $\bigcap_{D\in\mathscr D}\bar D$

<!--more-->

(a) This is equivalent to saying that $x\in\bigcap_{D\in\mathscr D}\bar D\iff\mathcal N(x)\subset\mathscr D$. 

If $x\in\bigcap_{D\in\mathscr D}\bar D$, i.e. $\forall D\in\mathscr D, x\in\bar D$. Then $\forall U\in\mathcal N(x), U\cap D\neq\empty$. By maximality of $\mathscr D$, we have $U\in\mathscr D$. Thus we have proven $\mathcal N(x)\subset\mathscr D$.

Conversely, suppose $\mathcal N(x)\subset\mathscr D$, using finite intersection property of $\mathscr D$, we know that $\forall U\in\mathcal N(x)\subset\mathscr D, D\in\mathscr D, U\cap D\neq\empty$, which means exactly that $x\in\bar D$.

(b) Let $\mathscr D'=\mathscr D\cup\{A\}$, any finite intersection within $\mathscr D'$ is either a finite intersection within $\mathscr D$ (hence nonempty) or a finite intersection within $\mathscr D$ with $A$: $A\cap D_1\cap...\cap D_n$. Note that $A\cap D_1\cap...\cap D_n\supset D\cap D_1\cap...\cap D_n$, the right side of which is a finite intersection within $\mathscr D$, again nonempty.

(c) **THIS IS FALSE.** $T_2$ is necessary for (c). A counterexample can be found [here](https://math.stackexchange.com/a/1058472/1109227)

Suppose there are $x\neq y\in\bigcap_{D\in\mathscr D}\bar D$, by (a) this means $\mathcal N(x),\mathcal N(y)\subset\mathscr D$. Use Hausdorff-ness we get disjoint open sets $U\in\mathcal N(x), V\in\mathcal N(x)$, which contradicts to finite intersection property of $\mathscr D$.