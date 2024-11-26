---
title: 'Munkres Topology Solution: Chapter 5'
date: 2024-11-27 01:02:51
tags: [一般拓扑, 解答]
toc: true
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

(a) This is equivalent to say: $x\in\bigcap_{D\in\mathscr D}\bar D\iff\mathcal N(x)\subset\mathscr D$

(b) 

(c) **This is Wrong.** $T_2$ is necessary for (c). I will provide a counterexample after the proof.
Suppose