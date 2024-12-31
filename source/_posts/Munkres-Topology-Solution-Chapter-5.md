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

If $x\in\bigcap_{D\in\mathscr D}\bar D$, i.e. $\forall D\in\mathscr D, x\in\bar D$. Then $\forall U\in\mathcal N(x), U\cap D\neq\emptyset$. By maximality of $\mathscr D$, we have $U\in\mathscr D$. Thus we have proven $\mathcal N(x)\subset\mathscr D$.

Conversely, suppose $\mathcal N(x)\subset\mathscr D$, using finite intersection property of $\mathscr D$, we know that $\forall U\in\mathcal N(x)\subset\mathscr D, D\in\mathscr D, U\cap D\neq\emptyset$, which means exactly that $x\in\bar D$.

(b) Let $\mathscr D'=\mathscr D\cup\lbrace A\rbrace$, any finite intersection within $\mathscr D'$ is either a finite intersection within $\mathscr D$ (hence nonempty) or a finite intersection within $\mathscr D$ with $A$: $A\cap D_1\cap...\cap D_n$. Note that $A\cap D_1\cap...\cap D_n\supset D\cap D_1\cap...\cap D_n$, the right side of which is a finite intersection within $\mathscr D$, again nonempty. Therefore $\mathscr D'$ has finite intersection property, and hence equals $\mathcal D$.

(c) **THIS IS FALSE.** $T_2$ is necessary for (c). A counterexample can be found [here.](https://math.stackexchange.com/a/1058472/1109227)

Suppose there are $x\neq y\in\bigcap_{D\in\mathscr D}\bar D$, by (a) this means $\mathcal N(x),\mathcal N(y)\subset\mathscr D$. Use Hausdorff-ness we get disjoint open sets $U\in\mathcal N(x), V\in\mathcal N(y)$, which contradicts to finite intersection property of $\mathscr D$.

## Ex.37.2
> A collection $\mathscr A$ of subsets of $X$ has the *countable intersection property* if every countable intersection of elements of $\mathscr A$ is nonempty. Show that $X$ is a Lindelof space iff for every collection $\mathscr A$ of subsets of $X$ having the countable intersection property, $$\bigcap_{A\in\mathscr A}\bar A$$ is nonempty.

The proof is analogous to the closed set description of compact spaces. 

First suppose $X$ is Lindelof, and $\mathscr A$ has countable intersection property. Let $\mathscr B=\lbrace X\setminus \bar A|A\in\mathscr A\rbrace$. This is a family of open sets. Note that the countable intersection property of $\mathscr A$ implies that countable union of $\mathscr B$ cannot be the whole space $X$, i.e. $\mathscr B$ has no countable subcovering. Therefore, provided $X$ is Lindelof, $\mathscr B$ cannot be a covering. $\cup\mathscr B\neq X\iff\bigcap_{A\in\mathscr A}\bar A\neq\emptyset$

Conversely, suppose for every collection $\mathscr A$ of subsets of $X$ having the countable intersection property, $\bigcap_{A\in\mathscr A}\bar A\neq\emptyset$. Let $\mathscr A$ be an open covering of $X$, $\mathscr B=\lbrace X\setminus A|A\in\mathscr A\rbrace$. $\mathscr B$ is a family of closed sets. That $\mathscr A$ is a covering is equivalent to saying $\cap\mathscr B=\emptyset$, thus it cannot have the countable intersection property, i.e. $\exists \lbrace A_n\rbrace_n\subset\mathscr A$, s.t. $\bigcap_n (X\setminus A_n)=\emptyset$. This shows that $\lbrace A_n\rbrace_n$ is a countable subcovering.

## Ex.37.3
>Consider the three statements:
　　(i) If $X$ is a set and $\mathscr A$ is a collection of subsets of $X$ having th countable intersection property, then there is a collection $\mathscr D$ of subsets of $X$ such that $\mathscr D\supset\mathscr A$ and $\mathscr D$ is maximal w.r.t the countable intersection property.
　　(ii) Suppose $\mathscr D$ is maximal w.r.t. the countable intersection property. Then countable intersections of elements of $\mathscr D$ are in $\mathscr D$. Furthermore, if $A$ is a subset of $X$ that intersects every element of $\mathscr D$, then $A$ is an element of $\mathscr D$.
　　(iii) Products of Lindelof spaces are Lindelof.
(a) Show that (i) and (ii) together imply (iii).
(b) Show that (ii) holds.
(c) Products of Lindelof spaces need not to be Lindelof (see §30). Therefore (i) does not hold. If one attempts to generalize the proof of Lemma 37.1 to the countable intersection property, at what point does the proof break down?

(a) You can prove (a) by directly applying the proof of Theorem 37.3 and change only 'compact' to 'Lindelof' and 'finite intersection property' to 'countable intersection property'. The fact about compact spaces used there has its corresponding version in Ex.37.2 and Lemma 37.2 has its generalization as (ii), so everything will go through.

(b) This is a direct generalization of Lemma 37.2. Check it yourself.

(c) Recall that $\Bbb R_l$ is Lindelof while $\Bbb R_l^2$ is not (Do you still remember why?). You will break down when you try to find a 'maximum' family because this time you have infinite steps to go.

## Ex.37.4
> Here is another theorem whose proof uses Zorn's lemma. Recall that if $A$ is a space and if $x,y\in A$, we say that $x,y$ belong to the same quasicomponent of $A$ if there is no separation $A=C\cup D$ of $A$ into two disjoint sets open in $A$ such that $x\in C, y\in D$.
*Theorem.* Let $X$ be a compact Hausdorff space. Then $x, y$ belong to the same quasicomponent of $X$ iff they belong to the same component of $X$.
(a) Let $\mathscr A$ be a collection of all closed subspaces $A$ of $X$ such that $x, y$ lie in the same quasicomponent of $A$. Let $\mathscr B$ be a subcollection of $\mathscr A$that is simply ordered by proper inclusion. Show that the intersection of the elements of $\mathscr B$ belongs to $\mathscr A$. [*Hint:* Compare Exercise 11 of §26.]
(b) Show $\mathscr A$ has a minimal element $D$.
(c) Show $D$ is connected.

(a) Following the hint, we mimic the proof of Ex.26.11. Suppose not, Let $B_0=\bigcap\mathscr B$. If there exist an open separation $C,D\subset B_0$ s.t. $x\in C, y\in D$. Since $X$ is normal, we find disjoint open sets $C', D'$ in $X$ s.t. $C\subset C', D\subset D'$. Let's consider sets of shape $B\setminus(C'\cup D')$ where $B\in\mathscr B$. They are closed sets, and they cannot be empty for otherwise $C'\cap B,D'\cap B$ will be an open separation of $B$ s.t. $x,y$ lie in them respectively, contrary to the fact that $x,y$ are in the same quasicomponent. Therefore, they satisfies the finite intersection property as they are simply ordered. So $\emptyset\neq\bigcap_{B\in \mathscr{B}}(B \setminus (C'\cup B'))=B_0 \setminus(C'\cup B')=\emptyset$, a contradiction.

(b) Zorn's lemma.

(c) Recall $D$ is minimal s.t. $x.y$ are in the same quasicomponent. So if $D$ is not connected, there will be a separation for $D$, by definition of $D$, $x,y $ will lie in the same part of this separation. Thus this part will be a smaller closed set satisfying $x,y $ are in the same quasicomponent, a contradiction.

## Ex.37.5*




# §38 The Stone-Cech Compactification

## Ex.38.1.
> Verify the statements made in Example 4.

Omitted.

## Ex.38.2.
> Show that the bounded continuous function $g:(0,1)\to \Bbb R$ defined by $g(x) =
\cos(1/x)$ cannot be extended to the compactification of Example 3. Define an imbedding $h : (0, 1) \to [0, 1]^3$ such that the functions $x, \sin(1/x), \cos(1/x)$ are all extendable to the compactification induced by $h$.

Firstly, $g $ is not extendable. Suppose not, if $g $ can be extended to a $\bar g:\overline S\to \Bbb R$, let $i:(0,1)\to\overline S$ be the embedding. We know in $\Bbb R^2$ (and hence in $\overline S$), $(1/n\pi,0)\to(0,0)$, so $\bar g(i(1/n\pi))\to \bar g(0,0)$. However, $\bar g(i(1/n\pi))=g(1/n\pi)=(-1)^n$ doesn't converge, a contradiction.

Secondly, $h(x)=(x,\sin(1/x),\cos(1/x))$ will be a desired embedding, as you can readily check like in Stone compactification.

## Ex.38.3.
>Under what conditions does a metrizable space have a metrizable compactification?

The answer is $C_2$ condition.

If $X $ is a metrizable space with a metrizable compactification $Y $, then $Y $ is a compact metrizable space, hence Lindelof, hence $C_2$. So $X $ is $C_2$.

Conversely, if $X $ is $C_2$, let $B_n $ be a countable basis for it. We refer to Ex.33.4. :
>Ex.33.4. Recall that A is a “$G_\delta$ set” in $X $ if $A $ is the intersection of a countable collection of open sets of $X $.
Theorem. Let $X $ be normal. There exists a continuous function $f : X \to [0, 1]$ such that $f (x) = 0$ for $x \in A$ and $f (x) > 0$ for $x \notin A$, if and only if $A$ is a closed $G_\delta$ set in X.
A function satisfying the requirements of this theorem is said to vanish precisely
on $A $.

And recall that every metrizable space is $T_6 $ space, that is to say, every closed set is $G_\delta$. Therefore, we conclude that for each $n $, there exists an $f_n $ s.t. $f_n$ is vanishes precisely *outside* $B_n $. Now by the imbedding theorem (theorem 34.2) we can imbedding $X $ into $[0,1]^\omega$, which is metrizable. Thus $X $ has a metrizable compactification, which is the closure of its image in $[0,1]^\omega$

## Ex.38.4.
>Let $Y$ be an arbitrary compactification of $Y$; let $\beta(X)$ be the Stone-Cech compactification. Show there is a continuous surjective closed map $g : \beta(X) \to Y$ that equals the identity on $X$.
[This exercise makes precise what we mean by saying that $\beta(X)$ is the “maximal”  compactification of $X$. It shows that every compactification of $X$ is equivalent to a quotient space of $\beta(X)$.]