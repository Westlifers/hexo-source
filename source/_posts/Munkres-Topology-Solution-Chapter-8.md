---
title: 'Munkres Topology Solution: Chapter 8'
date: 2025-07-10 15:42:12
categories: [拓扑学, 一般拓扑学]
tags: [Munkres Topology Solution]
toc: true
tikzjax: true
plugins: 
    mathjax: true
---

# §48 Baire Spaces
## Ex.48.1
>Let $X$ equal the countable union $\bigcup B_n$. Show that if $X$ is a nonempty Baire space, at least one of the sets $\overline{B_n}$ has a nonempty interior.

<!--more-->

$X=\bigcup\overline{B_n}$. If every $\overline{B_n}$ has empty interior, since $X$ is Baire, their union has empty interior, contradiction.

## Ex.48.2
>The Baire category theorem implies that $\Bbb R$ cannot be written as a countable union of closed subsets having empty interiors. Show this fails if the sets are not required to be closed.

$\Bbb R=\Bbb Q\cup(\Bbb R\setminus\Bbb Q)$.

## Ex.48.3
>Show that every locally compact Hausdorff space is a Baire space.

A direct proof goes similarly to compact Hausdorff case. Let $A_n$ be closed sets with empty interiors and $U_0\subset X$ be any open set. Since $\mathrm{int} A_1=\emptyset$, $U_0\not\subset A_1$. So there exists $x\in U_0\setminus A_1$. Since $X$ is regular, we can find open nbhd $U_1$ about $x$ such that $U_0\supset \overline{U_1}\supset U_1$. And, since $X$ is locally compact, we can choose $U_1$ such that it has compact closure. Proceed recursively, we have $U_0\supset \overline{U_1}\supset U_1\supset \overline{U_2}\supset\dots$, with $U_i\not\subset A_{i+1}$ and $\overline{U_i}$ being compact. $\overline{U_1}$ is compact, thus having finite intersection property: $\bigcap U_i\neq\emptyset$. Any $x\in\bigcap U_i$ will lie in $U_0$ but outside of $\bigcup A_i$.

An alternative proof is: the one-point compactification of $X$ is Baire, while $X$ is its open subspace, hence $X$ is Baire.

## Ex.48.4
>Show that if every point $x$ of $X$ has a neighborhood that is a Baire space, then $X$ is a Baire space. [Hint: Use the open set formulation of the Baire condition.]

Let $U_n$ be a sequence of dense open sets. For each point $x\in X$, it has an open nbhd $U$ that is itself Baire. $U\cap U_n$ is a sequence of dense open sets in $U$, thus $U\cap\bigcap U_n$ is dense in $U$. In particular, $U\cap\bigcap U_n\neq\emptyset$. Now if $V$ is an arbitrary nonempty open set, choose such $U$ above and note that $U\cap V$ is Baire, thus $U\cap V\cap\bigcap U_n\neq\emptyset$.

## Ex.48.5
>Show that if $Y$ is a $G_\delta$ set in $X$, and if $X$ is compact Hausdorff or complete metric, then $Y$ is a Baire space in the subspace topology. [Hint: Suppose that $Y = \bigcap W_n$, where $W_n$ is open in $X$, and that $B_n$ is closed in $Y$ and has empty interior in $Y$. Given $U_0$ open in $X$ with $U_0\cap Y\neq\emptyset$, find a sequence of open sets $U_n$ of $X$ with $U_n\cap Y$ nonempty, such that
$$
\begin{aligned}
\overline{U_n}&\subset U_{n-1}\\\\
\overline{U_n}\cap\overline{B_n}&=\emptyset\\\\
\mathrm{diam}U_n&<1/n, \text{in the metric case}\\\\
\overline{U_n}&\subset W_n.]
\end{aligned}
$$

Note that topological completeness is $G_\delta$ hereditary, so we don't need to prove the metric case. For the other case, suppose $Y=\bigcap W_n$. Since compactness and Hausdorff-ness are closed hereditary, we can WLOG assume $Y$ is dense. Suppose $V_n$ is a sequence of dense open sets in $Y$, thus dense in $X$. Assume $V_n=U_n\cap Y$ where $U_n$ are open sets in $X$. Then $\bigcap V_n=\bigcap U_n\cap\bigcap W_n$. However, since $U_n$ and $W_n$ are all dense open sets, we know $\bigcap V_n$ is dense.

## Ex.48.6
>Show that the irrationals are a Baire space.

$\Bbb R\setminus\Bbb Q$ is a $G_\delta$ subset of $\Bbb R$.

## Ex.48.7
>Prove the following:
Theorem. If $D$ is a countable dense subset of $\Bbb R$, there is no function $f : \Bbb R\to\Bbb R$ that is continuous precisely at the points of $D$.
Proof.
(a) Show that if $f: \Bbb R\to\Bbb R$, then the set $C$ of points at which $f$ is continuous is a $G_\delta$ set in $\Bbb R$. [Hint: Let $U_n$ be the union of all open sets $U$ of $\Bbb R$ such that $\mathrm{diam} f (U) < 1/n$. Show that $C =\bigcap U_n$.]
(b) Show that $D$ is not a $G_\delta$ set in $\Bbb R$. [Hint: Suppose $D = \bigcap W_n$, where $W_n$ is open in $\Bbb R$. For $d\in D$, set $V_d = \Bbb R − \set{d}$. Show Wn and $V_d$ are dense in $\Bbb R$.]

(a) $$
\set{x|f\text{ continuous at } x}=\bigcap_n\bigcup_m\set{x|\forall s,t\in(x-\frac1m,x+\frac1m),|f(s)-f(t)|<\frac1n},
$$ which is a $G_\delta$ set.

(b) Generally, a $G_\delta$ dense subset of $\Bbb R$ cannot be countable. Otherwise $D=\bigcap W_n$ is an intersection of countable dense open sets. By Baire category theorem, $\bigcap W_n\cap\bigcap _{d\in D}(\Bbb R\setminus\set{d})$ is dense. But this equals $\emptyset$, a contradiction. 

## Ex.48.8
> If $f_n$ is a sequence of continuous functions $f_n : \Bbb R\to \Bbb R$ such that $f_n(x) → f (x)$ for each $x\in\Bbb R$, show that $f$ is continuous at uncountably many points of $\Bbb R$.

By theorem 48.5, the set of continuous point of $f$ is dense. By Ex.48.7, it is not countable.

## Ex.48.9
>Let $g :\Bbb Z_+\to\Bbb Q$ be a bijective function; let $x_n = g(n)$. Define $f : \Bbb R\to\Bbb R$ as follows: $f(x_n) = 1/n$ for $x_n\in\Bbb Q$, $f(x) =0$ for $x\notin\Bbb Q$. Show that $f$ is continuous at each irrational and discontinuous at each rational. Can you find a sequence of continuous functions fn coverging to $f$?

That $f$ is continuous precisely at irrationals is a standard fact in analysis. However, I haven't proven or denied the existence of such $f_n$...

## Ex.48.10
>Prove the following:
Theorem (Uniform boundedness principle). Let $X$ be a complete metric space, and let $\mathcal F$ be a subset of $C(X,\Bbb R)$ such that for each $a\in X$, the set $$\mathcal F_a = \set{ f (a) | f\in\mathcal F }$$ is bounded. Then there is a nonempty open set $U$ of $X$ on which the functions in $\mathcal F$ are uniformly bounded, that is, there is a number $M$ such that $|f (x)|\le M$ for all $x\in U$ and all $f\in\mathcal F$ . [Hint: Let $A_N = \set{x; | f (x)|\le N \text{ for all } f\in F }$.]

We follow the hint. Clearly $X=\bigcup A_n$ since $\mathcal F$ is pointwise bounded, and $A_n$ is a sequence of closed sets. By Ex.48.1, there is at least one set, say $A_{n_0}$, has nonempty interior, and write $U=\mathrm{int}A_{n_0}$. By definition this is what we want. 

## Ex.48.11
>Determine whether or not $\Bbb R_l$ is a Baire space.

Yes. First we claim: a subset $D\subset \Bbb R$ is dense in usual topology, if, and only if it is dense in lower limit topology. Suppose it is dense in usual topology. Now given any point $x$, any open nbhd (in $\Bbb R_l$) $[x,x+\epsilon)$, note that $D\cap [x,\infty)$ is also dense in $[x,\infty)$ in usual topology, and $[x,x+\epsilon)$ is open in this topology. Hence $[x,x+\epsilon)\cap D\neq\emptyset$. (NOTE: I am not asserting that if $D$ dense, $A$ closed, then $D\cap A$ dense in $A$! This is true when $\mathrm{int}A\neq\emptyset$, or when $A$ is open. You can also check this claim directly.)

As for this problem, let $W_n=\bigcup_{\alpha\in J_n}[a_{n,\alpha},b_{n,\alpha})$ be a sequence of dense open sets in $\Bbb R_l$. Now note that any open nbhd (in $\Bbb R_l$) intersects $W_n$, it must intersects some $(a_{n,\alpha},b_{n,\alpha})$. i.e. $\mathrm{int}_ {\Bbb R} W_n$ is a sequence of dense open sets in $\Bbb R_l$, so dense in $\Bbb R$. Therefore, $\bigcup W_n\supset\bigcup\mathrm{int}_ {\Bbb R}W_n$ is dense.

## Ex.48.12
>Show that $\Bbb R^J$ is a Baire space in the box, product, and uniform topologies.

## Ex.48.13
>Let $X$ be a topological space; let $Y$ be a complete metric space. Show that $C(X, Y )$ is a Baire space in the fine topology (see Exercise 11 of §46). [Hint: Given basis elements $B( f_i, \delta_i )$ such that $δ_1 ≤ 1$ and $\delta_{i+1} ≤ \delta_i /3$ and $f_{i+1}\in B( f_i, δ_i /3)$, show that $\bigcap B( f_i, \delta_i )\neq \emptyset$.]