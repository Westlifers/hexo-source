---
title: 'Munkres Topology Solution: Chapter 7'
date: 2025-01-15 21:20:42
categories: [拓扑学, 一般拓扑学]
tags: [Munkres Topology Solution]
toc: true
tikzjax: true
plugins: 
    mathjax: true
---

# §43 Complete Metric Spaces

## Ex.43.1
>Let X be a metric space.
(a) Suppose that for some $\epsilon>0$, every $\epsilon$-ball in $X$ has compact closure. Show that $X$ is complete.
(b) Suppose that for each $x\in X$ there is an $\epsilon>0$ such that the ball $B(x,\epsilon)$ has compact closure. Show by means of an example that $X$ need not be complete.

<!--more-->

(a) Let $\set{x_n}$ be a Cauchy sequence of $X$. For large enough $N$, $\forall m,n\ge N$, we have $d(x_m,x_n)<\epsilon/2$. Therefore the open ball $B(x_N,\epsilon)$ covers all but finitely many $x_n$'s. So $\set{x_n}$ is covered by finitely many $\epsilon$-ball, hence covered by their closures, which is compact. Compactness implies sequential compactness, so $\set{x_n}$ has convergent subsequence. Being Cauchy, it converges.

(b) $(0,1)$

## Ex.43.2
> Let $(X,d_X)$ and $(Y, d_Y)$ be metric spaces; let $Y$ be complete. Let $A\subset X$. Show that if $f : A \to Y$ is uniformly continuous, then $f$ can be uniquely extended to a continuous function $g : \overline A \to Y$ , and $g$ is uniformly continuous.

In proceeding problems I will not distinguish $d_X,d_Y...$, i.e. I will omit subscripts. Usually this will not lead confusion.

Metric spaces are Hausdorff, so $f$ can indeed uniquely extend to the closure of its domain. Now we prove $g$ is uniformly continuous. For every $\epsilon>0$, let $x,y\in\overline A$. We have sequences $x_n\to x,y_n\to y$. By uniform continuity, there exists $\delta$ such that once $x',y'\in A$ satisfies $d(x',y')<\delta$, we have $d(f(x'),f(y'))<\epsilon/2$. Now let $d(x,y)\le\delta/2$ and $N$ large enough so that $d(x,x_n)<\delta/4, d(y,y_n)<\delta/4$ hold for $n\ge N$. Then for such $n$ we have $d(x_n, y_n)<\delta$. Therefore, 
$$
\begin{aligned}
d(f(x),f(y))\le& d(f(x),f(x_n))+d(f(x_n),f(y_n))+d(f(y_n),f(y))\\\\
\le& d(f(x),f(x_n))+d(f(y_n),f(y)) + \epsilon/2
\end{aligned}
$$
Let $n\to\infty$ we have $d(f(x),f(y))\le\epsilon/2<\epsilon$.

## Ex.43.3
>Two metrics $d$ and $d'$ on a set $X$ are said to be metrically equivalent if the identity map $i : (X, d) → (X, d')$ and its inverse are both uniformly continuous.
(a) Show that d is metrically equivalent to the standard bounded metric $\overline d$ derived from $d$.
(b) Show that if $d$ and $d'$ are metrically equivalent, then $X$ is complete under $d$ if and only if it is complete under $d'$.

You may interpret metrically equivalent as one metric will dominate the other: if $d$ is sufficiently small, then $d'$ will be sufficiently small and vice versa.

(a) In the interpretation above, this is clear.

(b) A sequence $\set{x_n}$ is Cauchy in the sense of $d$ if and only if it is Cauchy in then sense of $d'$. And it converges in the sense of $d$ if and only if it converges in then sense of $d'$.

## Ex.43.4
>Show that the metric space $(X, d)$ is complete if and only if for every nested sequence $A_1\supset A_2\supset...$ of nonempty closed sets of X such that $\newcommand\diam{\mathrm{diam}}$ $\diam A_n\to 0$, the intersection of the sets $A_n$ is nonempty.

First, suppose $X$ is complete under $d$. Choose, for each $n$, an $x_n\in A_n$. Then since $\diam A_n\to 0$, we know $\set{x_n}$ is a Cauchy sequence. hence converges to some $x$. Because $A_n$ are closed, $x\in A_n$ for each $n$. Therefore, $x\in\bigcap A_n$.

Conversely, suppose $X$ satisfies the nested closed sets condition. Let $\set{x_n}$ be a Cauchy sequence. Suppose on the contrary it doesn't converge, i.e. it has no limit point. Then it is closed. Similarly $A_N:=\set{x_N,x_{N+1},...}$ is closed for each $n$. $\set{x_n}$ being Cauchy implies $\diam A_n\to 0$. So $\bigcap A_n\neq\emptyset$. However, by definition, $\bigcap A_n=\emptyset$.

## Ex.43.5
>If $(X, d)$ is a metric space, recall that a map $f : X \to X$ is called a contraction if there is a number $α < 1$ such that $d( f (x), f (y)) ≤ \alpha d(x, y)$ for all $x, y\in X$. Show that if $f$ is a contraction of a complete metric space, then there is a unique point $x ∈ X$ such that $f(x) = x$. Compare Exercise 7 of §28.

This a well known theorem from calculus. I will skip.

## Ex.43.6
>A space $X$ is said to be topologically complete if there exists a metric for the topology of $X$ relative to which $X$ is complete.
(a) Show that a closed subspace of a topologically complete space is topologically complete.
(b) Show that a countable product of topologically complete spaces is topologically complete (in the product topology).
(c) Show that an open subspace of a topologically complete space is topologically complete. [Hint: If $U\subset X$ and $X$ is complete under the metric $d$, define $\phi : U\to R$ by the equation $\phi(x) = 1/d(x, X − U)$. Imbed $U$ in $X × R$ by setting $f (x) = x\times \phi(x)$.]
(d) Show that if $A$ is a $G_\delta$ set in a topologically complete space, then $A$ is topologically complete. [Hint: Let $A$ be the intersection of the open sets $U_n$, for $n\in\Bbb Z_+$. Consider the diagonal imbedding $f (a) = (a, a,... )$ of $A$ into $\prod U_n$.] Conclude that the irrationals are topologically complete.

(a) Clear.

(b) This has been proven in previous chapters. Recall: set $\overline\rho(x,y)=\sup_i{\frac{d_{i}(x_i,y_i)}{i}}$ where $d_i$ is metric for $X_i$ relative to which $X_i$ is complete.

(c) Define $\phi : U\to R$ by the equation $\phi(x) = 1/d(x, X − U)$. Define furthermore $D(x,y)=d(x,y)+|\phi(x)-\phi(y)|$. It is clear $D$ is a metric on $U$. 

Now we prove it induces the subspace topology. Actually, since we know $\phi$ is continuous, $d(x_n,x)\to 0\iff D(x_n,x)\to 0$. Therefore, they determine the same convergency structure, hence induce the same topology.

Finally we prove completeness. If $\set{x_n}$ is a Cauchy sequence w.r.t. $D$, then since $D\ge d$, we see $\set{x_n}$ is Cauchy sequence w.r.t. $d$. Therefore, there exists an $x$ s.t. $d(x_n,x)\to 0$, hence $D(x_n,x)\to 0$ by continuity of $f$.

(d) Suppose $A=\cap_n U_n\subset X$ and put $L=X^\Bbb N,S=\prod U_n\subset L$. The diagonal imbedding $f:A\to L$ is a topological embedding (You may check this if you are not sure). By Hausdorffness $f(A)$ is closed in $L$ hence closed in $S$. Therefore $A\cong f(A)$ is complete.

## Ex.43.7
>Show that the set of all sequences $(x_1, x_2,...)$ such that $\sum x_i^2$ converges is complete in the $l^2$-metric. (See Exercise 8 of §20.)

Standard result in analysis, omitted.

## Ex.43.8
>If $X$ and $Y$ are spaces, define
$$
e : X \times \mathcal C(X, Y) \to Y
$$
by the equation $e(x, f) = f(x)$; the map $e$ is called the *evaluation map*. Show that if $d$ is a metric for $Y$ and $C(X, Y)$ has the corresponding uniform topology, then $e$ is continuous. We shall generalize this result in §46.

For all $(x,f)\in X \times \mathcal C(X, Y)$, let $B=B_d(f(x),\epsilon)$ be an open ball nbhd of $e(x,f)=f(x)$. Consider the open nbhd $U=f^{-1}(B_d(f(x),\epsilon/2)\times B_{\overline\rho}(f,\epsilon/2))$ of $(x,f)$, where $\overline\rho$ denotes the uniform metric. If $(y,g)\in U$, then $d(g(y),f(x))\le d(g(y),f(y))+d(f(y),f(x))\le \overline\rho(g,f)+d(f(y),f(x))\le \epsilon/2+\epsilon/2=\epsilon$. Hence $e(y,g)\in B$, which implies continuity of $e$.

## Ex.43.9
> Let $(X, d)$ be a metric space. Show that there is an isometric imbedding $h$ of $X$ into a complete metric space $(Y, D)$, as follows: Let $\tilde{X}$ denote the set of all Cauchy sequences
$$\mathbf{x} = (x_1, x_2, \ldots)$$
of points of $X$. Define $\mathbf{x} \sim \mathbf{y}$ if
$$
d(x_n, y_n) \longrightarrow 0.
$$
Let $[\mathbf{x}]$ denote the equivalence class of $\mathbf{x}$; and let $Y$ denote the set of these equivalence classes. Define a metric $D$ on $Y$ by the equation
$$
D([\mathbf{x}], [\mathbf{y}]) = \lim_{n \to \infty} d(x_n, y_n).
$$
(a) Show that $\sim$ is an equivalence relation, and show that $D$ is a well-defined metric.
(b) Define $h : X \to Y$ by letting $h(x)$ be the equivalence class of the constant sequence $(x, x, \ldots)$
$$
h(x) = [(x, x, \ldots)].
$$
Show that $h$ is an isometric imbedding.
(c) Show that $h(X)$ is dense in $Y$; indeed, given $\mathbf{x} = (x_1, x_2, \ldots) \in \tilde{X}$, show the sequence $h(x_n)$ of points of $Y$ converges to the point $[\mathbf{x}]$ of $Y$.
(d) Show that if $A$ is a dense subset of a metric space $(Z, \rho)$, and if every Cauchy sequence in $A$ converges in $Z$, then $Z$ is complete.
(e) Show that $(Y, D)$ is complete.


## Ex.43.10
>Theorem (Uniqueness of the completion). Let $ h : X \to Y $ and $ h' : X \to Y' $ be isometric imbeddings of the metric space $(X, d)$ in the complete metric spaces $(Y, D)$ and $(Y', D')$, respectively. Then there is an isometry of $(h(X), D)$ with $(h'(X), D')$ that equals $h'h^{-1}$ on the subspace $h(X)$.


# §44 A Space-Filling Curve

## Ex.44.1
>Given $n$, show there is a continuous surjective map $g : I \to I^n$. [Hint: Consider
$f \times f : I \times I \to I^2 \times I^2$.]

We have surjections $I\xrightarrow{f} I^2\xrightarrow{f\times f} I^4\to...\to I^{2^n}$. Composite with an projection then we are done.

## Ex.44.2
>Show there is a continuous surjective map $f : \Bbb R \to \Bbb R^n$.

Similar to Ex.44.1, we only need a surjection $g:\Bbb R\to\Bbb R^2$. Let $f_k$ be the surjection $I\to [-k,k]^2$, this can be done by a multiplication on the Peano curve. Next define $g:[0,\infty)\to \Bbb R^2$ as: $g|_{[n-1,n]}(x)=f_n(x-n+1)$. This is well defined and surjective. It's continuity is guaranteed by the pasting lemma. Let me note again that the pasting lemma is still valid on a locally-finite family of closed sets.

It is easy to construct the desired surjection through $g$.

## Ex.44.3
>(a) If $\mathbb{R}^\omega$ is given the product topology, show there is no continuous surjective map $f : \mathbb{R} \to \mathbb{R}^\omega$. [Hint: Show that $\mathbb{R}^\omega$ is not a countable union of compact subspaces.]
(b) If $\mathbb{R}^\omega$ is given the product topology, determine whether or not there is a continuous surjective map of $\mathbb{R}$ onto the subspace $\mathbb{R}^\infty$.
(c) What happens to the statements in (a) and (b) if $\mathbb{R}^\omega$ is given the uniform topology or the box topology?

(a) We follow the hint. Note that $\sigma$-compactness is preserved by continuous map, so it suffices to show $\Bbb R^\omega$ is not $\sigma$-compact. Suppose for the contrary, $\Bbb R^\omega=\bigcup C_n$. Because $\Bbb R$ is not compact, we can choose for each $n$, an $x_n\in\Bbb \setminus\pi_n(C_n)$. Thus, let $x=(x_n)$, we have $\pi_n(x)=x_n\notin\pi_n(C_n)$, hence $x\notin C_n$. Therefore, $x\notin\bigcup C_n$, a contraction.

(b) Yes. By Ex.44.1 and suitable scalings, we have continuous surjections $f_n:[n,n+1]\to [-n, n]^n$. WLOG we can assume $f_n(n+1)=f_{n+1}(n+1)$, pasting lemma works again to give continuous surjection $f: [0,\infty)\to \bigcup [-n,n]^n=\Bbb R^\infty$.

(c) For $\Bbb R^\omega$, no. Because otherwise the continous surjection is also continuos under product topology (since product topology is coarsest).

For $\Bbb R^\infty$, yes. Because what we constructed in (b) is continous in all three topology (they coincide in finite-dimensional spaces).

## Ex.44.4
>(a) Let $X$ be a Hausdorff space. Show that if there is a continuous surjective map $f : I \to X$, then $X$ is compact, connected, weakly locally connected, and metrizable. [Hint: Show $f$ is a perfect map.]
(b) The converse of the result in (a) is a famous theorem of point-set topology called the *Hahn-Mazurkiewicz theorem* (see [H-Y], p. 129). Assuming this theorem, show there is a continuous surjective map $f : I \to I^\omega$. A Hausdorff space that is the continuous image of the closed unit interval is often called a *Peano space*.

(a) Compactness and connectedness are obvious. For metrizability, we follow the hint. $f$ is continous surjective, and every fiber is closed in $I$, hence compact, hence $f$ is a perfect map. By Ex.31.7, $X$ is both regular and second countable, hence metrizable. As for weakly locally connectedness, note that $f$ is a closed map, and closed map will map nbhd to nbhd.

(b) We need to show that $I^\omega$ is: compact, connected, weakly locally connected, and metrizable. Compactness follows from Tychonoff's theorem. Any product of connected (resp. metrizable) space is connected (resp. metrizable) (Ex.23.10). $I^\omega$ is even locally connected ($\prod X_n$ is locally connected iff every $X_n$ is locally connected and all but finitely many $X_n$ are connected).


# §45 Compactness in Metric Spaces

## Ex.45.1
>If $X_n$ is metrizable with metric $d_n$, then $D(x, y) = \sup\{\bar d_i (x_i , y_i )/i \}$ is a metric for the product space $X = \prod X_n$. Show that $X$ is totally bounded under $D$ if each $X_n$ is totally bounded under $d_n$. Conclude without using the Tychonoff theorem that a countable product of compact metrizable spaces is compact.

That $D$ induces product topology has been proven in previous chapters. Now, if every $d_n$ is totally bounded, that is, for every $\epsilon>0$, there are finitely many open balls $\set{B_i^n}_i$ of radius $\epsilon$ centering at $x^i_n$ that cover $X_n$. Let $N$ large enough so that $1/N<\epsilon$. 

Now for any point $y=(y_n)\in X$, for each $i\le N$, we have $y_i\in B_i^{k_i}(x_i^{k_i},\epsilon)$ for some $k_i$. Thus $y\in B_D((x_1^{k_1},\dots,x_N^{k_N},x_{N+1}^0,\dots),\epsilon)$, where $(x_j^0)$ is a fixed point in $X$. Therefore, $\set{B_D(x_1^{k_1},\dots,x_N^{k_N},x^0_{N+1},\dots)}$ is a finite set of open balls covering $X$.

For the last statement, note that if every $X_n$ is compact, they are totally bounded and complete. By the above we know $D$ is totally bounded, and that $D$ is complete is proven in previous chapters. Hence $(X, D)$ is compact.

## Ex.45.2
>Let $(Y, d)$ be a metric space; let $\mathcal F$ be a subset of $C(X, Y)$.
(a) Show that if $\mathcal F$ is finite, then $\mathcal F$ is equicontinuous.
(b) Show that if $f_n$ is a sequence of elements of $C(X, Y)$ that converges uniformly, then the collection $\set{f_n}$ is equicontinuous.
(c) Suppose that $\mathcal F$ is a collection of differentiable functions $f : \Bbb R\to\Bbb R$ such that each $x\in\Bbb R$ lies in a neighborhood $U$ on which the derivatives of the functions in $\mathcal F$ are uniformly bounded. [This means that there is an $M$ such that $|f'(x)|\le M$ for all $f$ in $\mathcal F$ and all $x\in U$.] Show that $\mathcal F$ is equicontinuous.

(a) For every $\epsilon>0, x\in X$, choose open nbhd $U_i$ of $x$ s.t. $\forall z\in U_i$, $f_i(z)\in B(f(x),\epsilon)$. Let $U=\bigcap U_i$ then we are done.

(b) Suppose $f_n$ converges to $f$, obviously $f$ is continous. For every $\epsilon>0, x\in X$, choose open nbhd $U$ of $x$ s.t. $f(U)\subset B(f(x), \epsilon/2)$. Since $f_n$ converges uniformly, for large enough $N$, if $n>N$ we have $\bar\rho(f_n, f)<\epsilon/2$, in particular, $f_n(U)\subset B(f(x),\epsilon)$. Now, for $f_1,\dots,f_N$, we can choose $U_1,\dots,U_N$ such that $f_i(U_i)\subset B(f(x),\epsilon)$. Let $U=U\cap\bigcap U_i$ then we are done.

An alternative proof would be: $\set{f_n}_n\cup\set{f}$ is compact in uniform topology, hence totally bounded. Therefore $\set{f_n}_n$ is totally bounded, hence equicontinuous.

(c) Use the mean value theorem.

## Ex.45.3
>Prove the following:
Theorem (Arzela’s theorem). Let $X$ be compact; let $f_n\in C(X,\Bbb R^k)$. If the collection $\set{fn}$ is pointwise bounded and equicontinuous, then the sequence $f_n$ has a uniformly convergent subsequence.

By Ascoli's theorem, $\mathcal{\overline F}$ is compact in uniform topology, so every sequence has a convergent subsequence.

## Ex.45.4
>(a) Let $f_n : I\to \Bbb R$ be the function $f_n(x) = x^n$. The collection $F = \set{f_n}$ is pointwise bounded but the sequence $(f_n)$ has no uniformly convergent subsequence; at what point or points does $F$ fail to be equicontinuous?
(b) Repeat (a) for the functions $f_n$ of Exercise 9 of §21.

(a) Failure point is $x=1$. Classical counterexample in analysis where a convergent sequence fail to be uniformly convergent.

(b) Checking details, omitted.

## Ex.45.5
>Let $X$ be a space. A subset $\mathcal F$ of $C(X,\Bbb R)$ is said to vanish uniformly at infinity if given $\epsilon > 0$, there is a compact subspace $C$ of $X$ such that $| f (x)| < \epsilon$ for $x\in X − C$ and $f\in F$ . If $\mathcal F$ consists of a single function $f$ , we say simply that $f$ vanishes at infinity. Let $C_0(X,\Bbb R)$ denote the set of continuous functions $f : X\to R$ that vanish at infinity.
Theorem. Let $X$ be locally compact Hausdorff; give $C_0(X,\Bbb R)$ the uniform topology. A subset $\mathcal F$ of $C_0(X,\Bbb R)$ has compact closure if and only if it is pointwise bounded, equicontinuous, and vanishes uniformly at infinity. [Hint: Let $Y$ denote the one-point compactification of $X$. Show that $C_0(X,\Bbb R)$ is isometric with a closed subspace of $C(Y,\Bbb R)$ if both are given the sup metric.]

We follow the hint. First we embed $C_0(X,\Bbb R)$ into $C(Y,\Bbb R)$ where $Y=X\cup\set{\infty}$ is the one-point compactification of $X$. Let $\eta:C_0(X,\Bbb R)\to C(Y,\Bbb R)$ be $\eta(f)|_X= f; \eta(\infty)=0$. It is clear that $\eta$ is well defined since $f$ vanishes at infinity. And $\eta$ is clearly an isometric. Now we prove that its image is closed.

It is not hard to show that $f\in\mathrm{im}\eta$ iff $f(\infty)=0$. Indeed, $\eta(f)(\infty)=0$ holds by definition. Conversely, if $f(\infty)=0$, then for each $\epsilon>0$ we can choose an open nbhd $U$ about $\infty$ s.t. $f(U)\in B(0,\epsilon)$, but $U$ is a complement of a compact set $X$, thus $f|_X$ vanishes at infinity. Now, if $\eta(f_n)$ converges to $g$, observing $g(\infty)=0$ is sufficient to show $g\in\mathrm{im}\eta$.

So, $\mathcal F$ has compact closure in $C_0(X,\Bbb R)$ iff $\mathcal F'=\eta(\mathcal F)$ has compact closure in $\mathrm{im}\eta$. By closedness $\mathrm{Cl}_{\mathrm{im}\eta}\mathcal F'=\overline{\mathcal F'}\cap \mathrm{im}\eta=\overline{\mathcal F'}$ (because $\overline{\mathcal F'}\subset \mathrm{im}\eta$). Thus $\mathcal F$ has compact closure in $C_0(X,\Bbb R)$ iff $\mathcal F'$ has compact closure in $C(Y,\Bbb R)$ iff $\mathcal F'$ is pointwise bounded and equicontinuous.

Finally, note that $\mathcal F'$ is pointwise bounded iff $\mathcal F$ is pointwise bounded. If $\mathcal F'$ is equicontinuous, clearly $\mathcal F$ is equicontinuous, and that $\mathcal F'$ is equicontinuous at $\infty$ implies that $f\in\mathcal F'$ can be arbitrarily small around $\infty$, that is complement of compact sets, i.e. $\mathcal F$ vanishes at infinity. The reverse direction is similar. Thus $\mathcal F'$ is equicontinuous actually means $\mathcal F$ both is equicontinuous and vanishes at infinity. Done.

## Ex.45.6
>Show that our proof of Ascoli’s theorem goes through if $\Bbb R^n$ is replaced by any metric space in which all closed bounded subspaces are compact.

Checking details, omitted.

## Ex.45.7
## Ex.45.8
Hausdorff metric.



# §46 Pointwise and Compact Convergence
## Ex.46.1
> Show that the sets $B_C(f, \epsilon)$ form a basis for a topology on $Y^X$.

Given $B_C(f, \epsilon)$ and $B_D(g, \delta)$ where $C, D$ are compact, we need to show that their intersection contains some $B_F(h, \gamma)$ for each $h$ in the intersection. Let $F=B\cup C$, $\gamma=\min\set{\epsilon-\inf_{x\in C} d(f(x),g(x)),\delta}$ and $h=g$ will be good.

## Ex.46.2
> Prove Theorem 46.7.

## Ex.46.3
> Show that the set $B(\Bbb R,\Bbb R)$ of bounded functions $f: \Bbb R\to \Bbb R$ is closed in $\Bbb R^{\Bbb R}$ in the uniform topology, but not in the topology of compact convergence.



# §47 Ascoli’s Theorem


