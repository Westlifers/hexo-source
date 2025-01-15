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

*Actually, we can show the following:
> TFAE
(1) $X$ is compact.
(2) Every open covering of $X$ has a locally finite subcovering.
(3) Every open covering of $X$ has a point finite subcovering.

The direction $(1)\implies(2)\implies(3)$ is obvious. For $(3)\implies(1)$:

Let $\mathscr{A}=\lbrace U_\alpha\rbrace$ be an open covering of $X$. Pick any element $U\in\mathscr{A}$ and form a new collection $\mathscr{A}'=\lbrace U\cup U_\alpha|U_\alpha\in\mathscr{A}\rbrace$. It is clear that $\mathscr{A}'$ is an open covering of $X$. Then $\mathscr{A}'$ has a point finite subcovering $\mathscr{A}''$. Now pick any point $x\in U$. We can see every element of $\mathscr{A}''$ contains $x$. But $\mathscr{A}''$ is point finite. Therefore $\mathscr{A}''$ is finite, say $\mathscr{A}''=\lbrace U\cup U_\alpha|\alpha\in F\rbrace$ where $F$ is finite. Then $U, U_\alpha\,(\alpha\in F)$ covers $X$. Hence $X$ is compact.

## Ex.41.2
>(a) Show that the product of a paracompact space and a compact space is paracompact. [Hint: Use the tube lemma.]
(b) Conclude that $S_\Omega$ is not paracompact.

(a) Let $X,Y$ be paracompact and compact respectively, and $\mathscr{A}$ be an open covering of $X\times Y$. Since $Y$ is compact, for each $x\in X $, there exists finitely many open sets $U_n(x)\in\mathscr{A}$ that cover $\lbrace x\rbrace\times Y$. By the tube lemma, each $U_n(x)$ actually contains a tube $U_x\times Y$ where $U_x\in\mathcal N(x)$. Now, $\lbrace U_x\rbrace$ forms an open covering of $X$, thus having an open locally finite refinement $\mathscr{B}$ that covers $X$. 

For each $V\in\mathscr{B}$, choose an $x=f(V)\in X$ such that $V\subset U_x$. Then, $\lbrace U_n(f(V))\cap (V\times Y)\rbrace_{V\in\mathscr{B},n}$ is an open covering of $X\times Y$ that is locally finite and refines $\mathscr{A}$, as you can readily check.

(b) Suppose on the contrary $S_\Omega$ is paracompact. Then $S_\Omega\times \overline{S_\Omega}$ is paracompact, by part (a). However, this will lead us to conclude that $S_\Omega\times \overline{S_\Omega}$ is $T_4$ (normal), which is false.

## Ex.41.3
>Is every locally compact Hausdorff space paracompact?

No, consider $S_\Omega$. We have just proven that it is not paracompact.

## Ex.41.4
>(a) Show that if $X$ has the discrete topology, then $X$ is paracompact.
(b) Show that if $f:X\to Y$ is continuous and $X$ is paracompact, the subspace $f(X)$ of $Y$ need not be paracompact.

(a) If $\mathscr{A}$ is an open covering of $X$, then $\lbrace \lbrace x\rbrace\subset X|\exists U\in\mathscr{A},x\in U\rbrace$ is an open refinement of $\mathscr{A}$ that covers $X$.

(b) By part (a), we just need to find a non-paracompact space $X$, then consider the identity map $\mathbb 1: X(\mathrm{Discrete})\to X$. For example, $S_\Omega$.

## Ex.41.5
>Let $X$ be paracompact. We proved a “shrinking lemma” for arbitrary indexed open coverings of $X$. Here is an “expansion lemma” for arbitrary locally finite indexed families in $X$.
Lemma. Let $\lbrace B_\alpha\rbrace_{\alpha\in J}$ be a locally finite indexed family of subsets of the paracompact Hausdorff space $X$. Then there is a locally finite indexed family $\lbrace U_\alpha\rbrace_{\alpha\in J}$ of open sets in $X$ such that $B_\alpha\subset U_\alpha$ for each $\alpha$.

We mimic the trick in Lemma 41.3, part $(3)\implies(4)$.

Write $\mathscr{B}=\set{B_\alpha}$. For each point $x\in X$, there is a neighborhood of $x$ that intersects only finitely many elements of $\mathscr{B}$. The collection of all open sets that intersect only finitely many elements of $\mathscr{B}$ is thus an open covering of $X$. There exists an locally finite open refinement of this collection that covers $X$, then form a collection $\mathscr{C}$ that consists of closures of elements in this refinement. Then $\mathscr{C}$ is an locally finite closed covering of $X$.

Next, for each $B_\alpha\in\mathscr{B}$, let $E(B_\alpha)=X\setminus\bigcup_{C\in\mathscr{C}\text{ and }C\subset X\setminus B_\alpha}C$. Now follow the same argument in Lemma 41.3, you know $\mathscr{U}=\set{U_\alpha}:=\set{E(B_\alpha)|\alpha\in J}$ is a locally finite open collection that covers $X$, satisfying $B_\alpha\subset U\alpha$ for each $\alpha$.

## Ex.41.6
>(a) Let $X$ be a regular space. If $X$ is a countable union of compact subspaces of $X$, then $X$ is paracompact.
(b) Show $\Bbb R^\infty$ is paracompact as a subspace of $\Bbb R^\omega$ in the box topology.

(a) i.e. show that in $T_3$ cases, $\sigma$-compact implies paracompact.

Let $X=\bigcup C_n$ where $C_n$ are compact in $X$. If $\mathscr{A}$ is an open covering of $X$, for each $n$, there are finitely many elements in $\mathscr{A}$ that covers $C_n$, denote it as $\mathscr{D}_n$. Obviously $\mathscr{D}_n$ is locally finite (since finite) so $\mathscr{D}=\bigcup\mathscr{D}_n$ is countably locally finite and is an open covering of $X$. Thus, every open covering has a countably locally finite open refinement that covers $X$. By Lemma 41.3, $X$ is paracompact.

Note that we actually proved $X$ is Lindelof!

(b) $\Bbb R^\infty=\bigcup_n \Bbb R^n_*$, where $\Bbb R^n_*=\set{(x_i)_i\in\Bbb R^\omega|x_i\in\Bbb R\text{ for }i\le n, x_i=0\text{ otherwise}}\cong\Bbb R^n$ is compact.

That $\Bbb R^\infty$ is $T_3$ (even $T_{3.5}$) in box topology is given in Ex.33.9, using the Urysohn Lemma.

## Ex.41.7
>Let X be a regular space.
(a) If $X$ is a finite union of closed paracompact subspaces of $X$, then $X$ is paracompact.
(b) If $X$ is a countable union of closed paracompact subspaces of $X$ whose interiors cover $X$, show $X$ is paracompact.

(a) Clearly we only need to show the case $n=2$. Suppose $X=A_1\cup A_2$ where $A_i$ is closed paracompact subspace of $X$. For any open covering $\mathscr{U}$ of $X$, the collection $\mathscr{U}_i=\set{U\cap A_i|U\in\mathscr{U}}$ is an open covering of $A_i$, thus have a locally finite *closed* refinement $\mathscr{U}_i'$. Since $A_i$ is closed, every element in $\mathscr{U}_i'$ is also closed in $X$. So $\mathscr{V}=\mathscr{U}_1'\cup\mathscr{U}_2'$ is a closed covering of $X$.

For each $x\in X$, if $x\in A_1$ then it has an open nbhd $U$ in $A_1$, such that $U$ intersects finitely many sets in $\mathscr{U}_1'$. There exists an open set $U'$ of $X$ such that $U=U'\cap A_1$. Similarly if $x\in A_2$ there exists an open set $V'$ of $X$ such that $V=V'\cap A_2$ intersects finitely many sets in $\mathscr{U}_2'$. Note that $U'$ still intersects only finitely many elements in $\mathscr{U}_1'$ and similar to $V'$

Now consider two open sets $U'\setminus A_2, V'\setminus A_1$ of $X$. Note that $U'\setminus A_2\subset U, V'\setminus A_1\subset V$, and neither $U'\setminus A_2$ intersect any element in $\mathscr{U}_2'$ nor $V'\setminus A_1$ intersect any element in $\mathscr{U}_1'$. So, if $x\notin A_1$ then $W=U'\setminus A_2$ is a open nbhd of $x$ that intersects only finitely many elements in $\mathscr{V}$, and $x\notin A_1$ is similar. In the case $x\in A_1\cap A_2$, choose $W=U'\cap V'$ and note that $W\subset U',V'$. Thus $\mathscr{V}$ is locally finite. By Lemma 41.3, $X$ is paracompact.

*This problem is not hard, but also not so obvious like some readers might think. Note that unlike compactness, it is **NOT** correct that a subspace $Y\subset X$ is paracompact iff every open covering of $Y$ consisting of open sets of $X$ has locally finite open (in the sense of $X$) refinement that covers $Y$. 

(b) Let $\mathscr{U}$ be an open covering of $X=\bigcup X_n$ with $\bigcup(X_n)^\circ=X$. 

For each $n$, 
$\mathscr{U}_n=\set{U\cap X_n|U\in\mathscr{U}}$ is an open covering of $X_n$. 

Thus there is a family $\mathscr{V}_n'$ of open subsets of $X$ which has the property that $\set{V\cap X_n|V\in\mathscr{V}'_n}$ is a locally-finite open refinement (in $X_n$) of $\mathscr{U}_n$.  Write $\mathscr{V}_n=\set{V\cap(X_n)^\circ|V\in\mathscr{V}'_n}$ to obtain a locally-finite family of open subsets of $X$ which covers the interior $(X_n)^\circ$ and refines $\mathscr{U}_n$. The collection $\mathscr{V}=\bigcup\mathscr{V}_n$ is now a countably locally finite open refinement of $\mathscr{U}$ covering $X$. By Lemma 41.3, $X$ is paracompact

## Ex.41.8
>Let $p:X\to Y$ be a perfect map. (See Exercise 7 of §31.)
(a) Show that if $Y$ is paracompact, so is $X$. [Hint: If $\mathscr{A}$ is an open covering of $X$, find a locally finite open covering of $Y$ by sets $B$ such that $p^{-1}(B)$ can be covered by finitely many elements of $\mathscr{A}$; then intersect $p^{-1}(B)$ with these elements of $\mathscr{A}$.]
(b) Show that if $X$ is a paracompact Hausdorff space, then so is $Y$. [Hint: If $\mathscr{B}$ is a locally finite closed covering of $X$, then $\set{p(B)|B\in\mathscr{B}}$ is a locally finite closed covering of $Y$.]

(a) Recall that perfect map is a surjective continuous map that is closed with compact fibers. If $\mathscr{A}$ is an open covering of $X$. WLOG we may assume $\mathscr{A}$ is closed under finite unions. Let $\mathscr{B}=\set{Y\setminus f(X\setminus A)|A\in\mathscr{A}}$. It is clear that $\mathscr{B}$ is a collection of open sets of $Y$. And since $f$ has compact fibers and $\mathscr{A}$ is closed under finite unions, each fiber $f^{-1}(y)$ is contained in an $A\in\mathscr{A}$. Thus,
$$
\begin{aligned}
X\setminus f^{-1}(y)&\supset X\setminus A\\\\
f(X\setminus f^{-1}(y))&\supset f(X\setminus A)\\\\
Y\setminus f(X\setminus f^{-1}(y))&\subset Y\setminus f(X\setminus A)\\\\
=Y\setminus f f^{-1}(Y\setminus\set{y})&\\\\
=\set{y}&
\end{aligned}
$$
Therefore, $\mathscr{B}$ covers $Y$. So it has a locally finite open refinement $\mathscr{B}'$ that covers $Y$. Now let $\mathscr{A}'=\set{f^{-1}(B')|B'\in\mathscr{B}'}$. This is an open covering of $Y$. It refines $\mathscr{A}$, because for each $A'=f^{-1}(B')\in\mathscr{A}'$ where $B'\in\mathscr{B}'$, there exists an $A\in\mathscr{A}$ such that $B'\subset Y\setminus f(X\setminus A)$. Hence,
$$
\begin{aligned}
A'&\subset f^{-1}(Y\setminus f(X\setminus A))\\\\
&= X\setminus f^{-1}f(X\setminus A)\\\\
&\subset A
\end{aligned}
$$
Therefore, $\mathscr{A}'$ refines $\mathscr{A}$. As for locally finiteness, for each $x\in X,\exists V\ni f(x)$, s.t. $V$ intersects finitely many $B'\in\mathscr{B}'$, then $f^{-1}V$ intersects those $f^{-1}B'$. Moreover, if $f^{-1}V\cap f^{-1}B'\neq\emptyset$, we have $\emptyset\neq f(f^{-1}V\cap f^{-1}B')\subset V\cap B'$, meaning that $f^{-1}V$ will only intersect those elements, thus locally finite.

(b) Recall in Ex.31.7 we have proved that if $f:X\to Y$ is perfect map, then $X$ regular implies $Y$ regular. Here $X$ is paracompact Hausdorff, hence regular, hence $Y$ is regular. Let $\mathscr{U}$ be an open covering of $Y $, take the preimages to form an $\mathscr{A}$, which has a **closed** locally finite refinement $\mathscr{A}'$ that covers $X$. Let $\mathscr{B}$ be the images of elements of $\mathscr{A}'$.

Now clearly $\mathscr{B}$ is a closed covering of $Y$. It refines $\mathscr{A}$, for if $B\in\mathscr{B}$, there exists $A'\in\mathscr{A}',A\in\mathscr{A},U\in\mathscr{U}$ such that: $B=f(A')\subset f(A)=ff^{-1}(U)=U$. Now we prove locally finiteness.

For each $y\in Y$, its fiber is compact, thus can be covered by finitely many open sets, each of which intersects finitely many elements in $\mathscr{A}'$, i.e. $f^{-1}y\subset M=\bigcup A_i'$ . Therefore, $y\in f(\bigcup A_i')$. Closed maps send nbhd to nbhd (in particular, in part (a) we proved $N=Y\setminus f(X\setminus A)\subset f(A)$), so there exists $N$ such that $y\in N\subset f(M)$. Similarly we can prove $f^{-1}N\subset M$. Hence $f^{-1}N$ intersects finitely many elements of $\mathscr A'$. Similar to the end of part (a), we know $N$ intersects at most finitely many elements of $\mathscr B$.

## Ex.41.10
>Theorem. If $X$ is a Hausdorff space that is locally compact and paracompact, then each component of $X$ has a countable basis.
Proof. If $X_0$ is a component of $X$, then $X_0$ is locally compact and paracompact. Let $\mathscr{C}$ be a locally finite covering of $X_0$ by sets open in $X_0$ that have compact closures. Let $U_1$ be a nonempty element of $\mathscr{C}$, and in general let $U_n$ be the union of all elements of $\mathscr{C}$ that intersect $\overline{U_{n-1}}$. Show $\overline{U_n}$ is compact, and the sets $U_n$ cover $X_0$.

**THIS IS FALSE**. A correction may be changing 'paracompact' to 'metrizable'.

After correction, it is equivalent to proving locally compact connected metrizable space is $C_2$. We show $X$ is a countable union of $C_2$ open subspaces, thus is $C_2$.

We follow the hint. Since $X$ is locally compact, those open sets with compact closures form an open covering. Let $\mathscr{C}$ be a locally finite open refinement of it covering $X$ and $\emptyset\neq U_1\in\mathscr{C}$, $U_2=\bigcup\set{U\in\mathscr{C}|U\cap\overline{U_1}\neq\emptyset}$,...,$U_{n+1}=\bigcup\set{U\in\mathscr{C}|U\cap\overline{U_n}\neq\emptyset}$. We prove by induction that $\overline{U_n}$ is compact. It is clear that $\overline{U_1}$ is compact. Now suppose $\overline{U_n}$ is compact. Since $\mathscr{C}$ is locally finite, for each $x\in\overline{U_n}$, there is an open nbhd $U_x$ of $x$ such that $U_x$ intersects only finitely many elements in $\mathscr{C}$. Since $\overline{U_n}$ is compact, we can cover it by finitely many such $U_x$. In particular, $\overline{U_n}$ intersects only finitely many elements of $\mathscr{C}$. By definition, we know that $U_{n+1}$ is a finite union of $U\in\mathscr{C}$. Therefore, $\overline{U_{n+1}}$ is compact. Hence we conclude all $\overline{U_n}$ are compact.

Now we show $X=\bigcup U_n$, where connectedness is used. Let $x\in\overline{\bigcup U_n}$. Every open nbhd of it intersects $\bigcup U_n$, or equivalently, intersects some $U_n$, hence $\overline{U_n}$. By definition, $x\in U_{n+1}$. Therefore, $x\in\bigcup U_n$, i.e. $\overline{\bigcup U_n}=\bigcup U_n$. Hence $\bigcup U_n$ is a non-empty clopen set. By connectedness, $\bigcup U_n=X$

Finally, we have $X=\bigcup\overline{U_n}$. Each $\overline{U_n}$ is a compact metrizable space, hence $C_2$. Being open subspace of $\overline{U_n}$, $U_n$ is $C_2$. Thus we come to our conclusion.


# §42 The Smirnov Metrization Theorem

## Ex.42.1
>Compare Theorem 42.1 with Exercises 7 and 8 of §34.

There are three theorems concerning local metrizability. I list them below: 

>In the following spaces, local metrizability is equivalent to metrizability.
(1) compact Hausdorff spaces (Ex.34.7)
(2) Lindelof regular spaces (Ex.34.8)
(3) paracompact Hausdorff spaces (Theorem 42.1)

## Ex.42.2
>(a) Show that for each $x\in S_\Omega$, the section of $S_\Omega$ by $x$ has a countable basis and hence is metrizable.
(b) Conclude that $S_\Omega$ is not paracompact.

(a) For each $x\in S_\Omega$, denote $S_x$ its section. All open intervals in $S_x$ form a basis of $S_x$. The cardinality is $\aleph_0^2=\aleph_0$, hence $S_x$ is $C_2$. By the Urysohn lemma, $S_x$ is metrizable.

(b) By part (a), $S_\Omega$ is locally metrizable. If moreover $S_\Omega$ is paracompact, then it is metrizable. However, this is false. (Recall that $S_\Omega$ is not compact but is limit point compact).