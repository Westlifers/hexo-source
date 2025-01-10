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

$\mathscr{B},\mathscr{C}$. Note that $(0.75,2.25)$ lies in $\mathscr{D}$ but not in $\mathscr{A}$.

## Ex.39.5
>Show that if $X$ has a countable basis, a collection $\mathscr{A}$ of subsets of $X$ is countably locally finite if and only if it is countable.

If $\mathscr{A }$ is countable, then it is of course countably locally finite.

Conversely, if $\mathscr{A }$ is countably locally finite, say $\mathscr{A }=\bigcup\mathscr{A}_n$. Let $\lbrace B_m\rbrace$ be a countable basis for $X$. For each $n\in\Bbb Z,x\in X$, there is an open nbhd $U_x$ of $x$ such that $U_x$ intersects finitely many elements of $\mathscr{A}_n$. Choose an $B_m$ such that $x\in B_m\subset U_x$, then $B_m$ intersects finitely many elements of $\mathscr{A}_n$. Therefore, we see that each $B_m$ intersects finitely many elements of $\mathscr{A}_n$. Hence there are only countably many elements in $\mathscr{A}_n$. Thus $\mathscr{A}$ is countable.

## Ex.39.6
>Consider $\Bbb R^\omega$ in the uniform topology. Given $n$, let $\mathscr{B}_n$ be the collection of all subsets of $\Bbb R^\omega$ of the form $\prod A_i$ , where $A_i=\Bbb R$ for $i\le n$ and $A_i$ equals either $\lbrace 0\rbrace$ or $\lbrace 1\rbrace$ otherwise. Show that the collection $\mathscr{B}=\bigcup_n\mathscr{B}_n$ is countably locally finite, but neither countable nor locally finite.

First, it is easy to see $\mathscr{A}_n$ is even locally discrete: for each open ball $B(x,1/3)$, if it intersects two subsets of the form $\prod A_i\in\mathscr{B}_n$, then we see $\mathrm{diam}B(x,1/3)\ge 1$, a contradiction.

Second, $|\mathscr{B}|=\sum 2^{\aleph_0}=\aleph_0 2^{\aleph_0}=\mathfrak c$, uncountable.

Finally, pick $0\in\Bbb R^\omega$, then $0\in\Bbb R^{n}\times\prod_{i\ge n+1}\lbrace 0\rbrace\in\mathscr{B}_n$ for each $n\in\Bbb Z^+$, thus any open nbhd of $0$ will intersect infinitely many elements in $\mathscr{B}$


# §40. The Nagata-Smirnov Metrization Theorem

## Ex.40.1
>Check the details of Examples 1 and 2.

Omitted.

## Ex.40.2
>A subset $W$ of $X$ is said to be an “$F_\sigma$ set” in $X$ if $W$ equals a countable union of closed sets of $X$. Show that $W$ is an $F_\sigma$ set in $X$ if and only if $X-W$ is a $G_\delta$ set in $X$.
[The terminology comes from the French. The “F” stands for “fermé,” which means “closed,” and the “$\sigma$” for “somme,” which means “union.”]

Omitted.

## Ex.40.3
>Many spaces have countable bases; but no $T_1$ space has a locally finite basis unless it is discrete. Prove this fact.

Suppose $X$ is a $T_1$ space with a locally finite basis. We know that in a $T_1$ space, the intersection of all nbhd of a point $\bigcap\mathcal N(x)$ equals to the point itself. Let $\mathscr{B}$ be a locally finite basis for $X$, $\mathscr{C}$ a subcollection of it containing all basis element containing $x$. By local finiteness, there exists an open nbhd $U$ of $x$ such that $U$ intersects finitely many elements of $\mathscr{C}$, say $C_1,...,C_n$. Then $\lbrace x\rbrace=\bigcap\mathcal N(x)=U\cap C_1\cap...\cap C_n$ is an open set, proving the discreteness of $X$.

## Ex.40.4
>Find a non-discrete space that has a countably locally finite basis but does not have a countable basis.

By Lemma 39.2, every metrizable space has a countably locally finite basis. So it remains us to find a non-discrete, non-$C_2$ metrizable space. For example $\Bbb R^\omega$ in the uniform topology.

## Ex.40.5
>A collection $\mathscr{A}$ of subsets of $X$ is said to be locally discrete if each point of $X$ has a neighborhood that intersects at most one element of $\mathscr{A}$. A collection $\mathscr{B}$ is countably locally discrete (or “$\sigma$-locally discrete”) if it equals a countable union of locally discrete collections. Prove the following:
Theorem (Bing metrization theorem). A space $X$ is metrizable if and only if it is regular and has a basis that is countably locally discrete.

I believe the proof is just a copy of Theorem 40.3. The only thing we need to do is converting the dependent lemmas into locally discrete version. I will list them below, the proof of which is exactly the same as their original version, changing some words.

>Lemma. Let $\mathscr{A}$ be a collection of subsets of $X$ that is locally discrete.
(1) Any subcollection of $\mathscr{A}$ is locally discrete.
(2) The collection $\mathscr{B}=\lbrace \overline A|A\in\mathscr{A}\rbrace$ is locally discrete.
(3) $\overline{\bigcup_{A\in\mathscr{A}}A}=\bigcup_{A\in\mathscr{A}}\overline A$

>Lemma. Let $X$ be a metrizable space. If $\mathscr{A}$ is an open covering of $X$, then there is an open covering $\mathscr{E}$ of $X$ refining $\mathscr{A}$ that is countably locally discrete.

>Lemma. Let $X$ be a regular space with a basis $\mathscr{B}$ that is countably locally discrete. Then $X$ is a $T_6$ space. That is to say, $X$ is normal, and every closed set in $X$ is a $G_\delta$ set in $X$.

Actually the proof of the original version of the last two lemmas in the textbook is already strong enough to prove the discrete version.

# §41 Paracompactness

## Ex.41.1
>Give an example to show that if $X$ is paracompact, it does not follow that for every open covering $\mathscr{A}$ of $X$, there is a locally finite subcollection of $\mathscr{A}$ that covers $X$.

Endow $\Bbb Z$ with the order topology (the same as discrete topology), then $\lbrace(-n,n)\rbrace_n$ is an open covering of $\Bbb Z$ without locally finite subcovering

Actually, we can show the following:
> TFAE
(1) $X$ is compact.
(2) Every open covering of $X$ has a locally finite subcovering.
(3) Every open covering of $X$ has a point finite subcovering.

The direction $(1)\implies(2)\implies(3)$ is obvious. For $(3)\implies(1)$:

Let $\mathscr{A}=\lbrace U_\alpha\rbrace$ be an open covering of $X$. Pick any element $U\in\mathscr{A}$ and form a new collection $\mathscr{A}'=\lbrace U\cup U_\alpha|U_\alpha\in\mathscr{A}\rbrace$. It is clear that $\mathscr{A}'$ is an open covering of $X$. Then $\mathscr{A}'$ has a point finite subcovering $\mathscr{A}''$. Now pick any point $x\in U$. We can see every element of $\mathscr{A}''$ contains $x$. But $\mathscr{A}''$ is point finite. Therefore $\mathscr{A}''$ is finite, say $\mathscr{A}''=\lbrace U\cup U_\alpha|\alpha\in F\rbrace$ where $F$ is finite. Then $U, U_\alpha\,(\alpha\in F)$ covers $X$. Hence $X$ is compact.

## Ex.41.2
>(a) Show that the product of a paracompact space and a compact space is paracompact. [Hint: Use the tube lemma.]
(b) Conclude that $S_\Omega$ is not paracompact.

