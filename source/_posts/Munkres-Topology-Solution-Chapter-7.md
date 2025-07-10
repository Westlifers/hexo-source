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
(c) Show that an open subspace of a topologically complete space is topologically complete. [Hint: If $U\subset X$ and $X$ is complete under the metric $d$, define $\phi : U\to R$ by the equation $\phi(x) = 1/d(x, X − U)$. Imbed $U$ in $X\times R$ by setting $f (x) = x\times \phi(x)$.]
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

(c) For $\Bbb R^\omega$, no. Because otherwise the continuous surjection is also continuos under product topology (since product topology is coarsest).

For $\Bbb R^\infty$, yes. Because what we constructed in (b) is continuous in all three topology (they coincide in finite-dimensional spaces).

## Ex.44.4
>(a) Let $X$ be a Hausdorff space. Show that if there is a continuous surjective map $f : I \to X$, then $X$ is compact, connected, weakly locally connected, and metrizable. [Hint: Show $f$ is a perfect map.]
(b) The converse of the result in (a) is a famous theorem of point-set topology called the *Hahn-Mazurkiewicz theorem* (see [H-Y], p. 129). Assuming this theorem, show there is a continuous surjective map $f : I \to I^\omega$. A Hausdorff space that is the continuous image of the closed unit interval is often called a *Peano space*.

(a) Compactness and connectedness are obvious. For metrizability, we follow the hint. $f$ is continuous surjective, and every fiber is closed in $I$, hence compact, hence $f$ is a perfect map. By Ex.31.7, $X$ is both regular and second countable, hence metrizable. As for weakly locally connectedness, note that $f$ is a closed map, and closed map will map nbhd to nbhd.

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

(b) Suppose $f_n$ converges to $f$, obviously $f$ is continuous. For every $\epsilon>0, x\in X$, choose open nbhd $U$ of $x$ s.t. $f(U)\subset B(f(x), \epsilon/2)$. Since $f_n$ converges uniformly, for large enough $N$, if $n>N$ we have $\bar\rho(f_n, f)<\epsilon/2$, in particular, $f_n(U)\subset B(f(x),\epsilon)$. Now, for $f_1,\dots,f_N$, we can choose $U_1,\dots,U_N$ such that $f_i(U_i)\subset B(f(x),\epsilon)$. Let $U=U\cap\bigcap U_i$ then we are done.

An alternative proof would be: $\set{f_n}_n\cup\set{f}$ is compact in uniform topology, hence totally bounded. Therefore $\set{f_n}_n$ is totally bounded, hence equicontinuous.

(c) Use the mean value theorem.

## Ex.45.3
>Prove the following:
Theorem (Arzela's theorem). Let $X$ be compact; let $f_n\in C(X,\Bbb R^k)$. If the collection $\set{fn}$ is pointwise bounded and equicontinuous, then the sequence $f_n$ has a uniformly convergent subsequence.

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

Finally, note that $\mathcal F'$ is pointwise bounded iff $\mathcal F$ is pointwise bounded. If $\mathcal F'$ is equicontinuous, clearly $\mathcal F$ is equicontinuous, and that $\mathcal F'$ is equicontinuous at $\infty$ implies that $f\in\mathcal F'$ can be arbitrarily small around $\infty$, that is, arbitrarily small on complement of compact sets, i.e. $\mathcal F$ vanishes at infinity. The reverse direction is similar. Thus $\mathcal F'$ is equicontinuous actually means $\mathcal F$ both is equicontinuous and vanishes at infinity. Done.

## Ex.45.6
>Show that our proof of Ascoli's theorem goes through if $\Bbb R^n$ is replaced by any metric space in which all closed bounded subspaces are compact.

Checking details, omitted.

## Ex.45.7
## Ex.45.8
Hausdorff metric.



# §46 Pointwise and Compact Convergence
## Ex.46.1
> Show that the sets $B_C(f, \epsilon)$ form a basis for a topology on $Y^X$.

Given $B_C(f, \epsilon)$ and $B_D(g, \delta)$ where $C, D$ are compact, we need to show that their intersection contains some $B_F(h, \gamma)$ for each $h$ in the intersection. Let $\gamma=\min\set{\epsilon-\sup_{x\in C} d(f(x),h(x)),\delta-\sup_{x\in D} d(g(x),h(x))}$. Then: $B_{C\cup D}(h,\gamma)\subset B_C(h,\gamma)\subset B_C(f,\epsilon)$
The last inclusion follows from triangular inequality: if $p\in B_C(h,\gamma)$, then over $C$ we have 
$$
\sup_C d(p(x),f(x))\le \sup_C d(p(x),h(x))+\sup_C d(h(x),f(x))<\epsilon
$$
Similarly, $B_{C\cup D}(h,\gamma)\subset B_D(g,\delta)$.

## Ex.46.2
> Prove Theorem 46.7.

>Theorem 46.7. Let $X$ be a space; let $(Y, d)$ be a metric space. For the function space $Y^X$, one has the following inclusions of topologies: (uniform) ⊃ (compact convergence) ⊃ (pointwise convergence). If $X$ is compact, the first two coincide, and if $X$ is discrete, the second two coincide.

That pointwise convergence topology is coarser than compact convergence topology is obvious, since a point is a compact set. 

As for the first two: Let $B_C(f,\epsilon)$ be a basis element of compact convergence topology and g is in it, then it is obvious that $\emptyset\neq B_{\bar\rho}(g,\epsilon-\sup_C d(f(x),g(x)))\subset B_C(f,\epsilon)$. Therefore, the uniform topology is finer.

If $X$ is compact, we have $B_X(f,\epsilon)=B_{\bar\rho}(f,\epsilon)$, thus the compact convergence topology is finer. Therefore, it coincides with the uniform topology.

If $X$ is discrete, compact sets are precisely finite sets. Thus the basis elements of compact convergence topology coincides with those of pointwise topology.

## Ex.46.3
> Show that the set $B(\Bbb R,\Bbb R)$ of bounded functions $f: \Bbb R\to \Bbb R$ is closed in $\Bbb R^{\Bbb R}$ in the uniform topology, but not in the topology of compact convergence.

That the uniform limit of bounded functions is bounded is a standard result in analysis. As for that bounded functions can converge to unbounded functions in compact convergence topology, consider functions: 
$$
f_n(x)=
\begin{cases}
0, x\le 0\\\\
x, 0\le x\le n\\\\
n, x\ge n
\end{cases}
$$
```tikz
\begin{document}
\begin{tikzpicture}[scale=1.2]
  % Axes
  \draw[->] (-1,0) -- (4,0) node[right] {$x$};
  \draw[->] (0,-1) -- (0,3) node[above] {$f_n(x)$};

  % Function graph for n=2
  \draw[thick,blue] (-1,0) -- (0,0);         % f(x)=0 for x<=0
  \draw[thick,blue] (0,0) -- (2,2);          % f(x)=x for 0<=x<=2
  \draw[thick,blue] (2,2) -- (3.5,2);        % f(x)=2 for x>=2

  % Dots at breakpoints
  \filldraw[blue] (0,0) circle (1.2pt);        % filled dot at (0,0)
  \filldraw[blue] (2,2) circle (1.2pt);        % filled dot at (2,2)

  % Dashed projections to axes from (2,2)
  \draw[dashed] (2,2) -- (2,0);
  \draw[dashed] (2,2) -- (0,2);

  % Labels
  \node at (2,-0.2) {$n$};
  \node at (-0.2,2) {$n$};

\end{tikzpicture}
\end{document}
```

On any compact set (bounded closed set) they converge to the ReLu function $\Bbb 1_{x\ge 0}\cdot x$, which is unbounded.

## Ex.46.4
>Consider the sequence of continuous functions $f_n : \Bbb R\to\Bbb R$ defined by $f_n(x) = x/n$. In which of the three topologies of Theorem 46.7 does this sequence converge? Answer the same question for the sequence given in Exercise 9 of §21.

$\set{f_n}$ converges to $0$ in product topology and compact convergence topology. It doesn't converge in uniform topology.

## Ex.46.5
>Consider the sequence of functions $f_n : (−1, 1)\to\Bbb R$, defined by
$$
f_n(x)=\sum_{k=1}^\infty kx^k
$$
(a) Show that $(f_n)$ converges in the topology of compact convergence; conclude that the limit function is continuous. (This is a standard fact about power series.)
(b) Show that $(f_n)$ does not converge in the uniform topology.

(a) Any compact set is covered by a closed interval, thus there exists an $M<1$ such that $|kx^k|\le kM^k$ for all $k$. $\sum kM^k$ converges. By Weierstrass' principle, the power series converges (uniformly) on compact sets.

(b) $f_n$ converges pointwisely to $\frac{x}{(1-x)^2}$. This convergence is not uniform, omitted. (consider the tail $R_N(x)\ge (N+1)x^{N+1}$ and let $x=1-1/N$)

## Ex.46.6
>Show that in the compact-open topology, $C(X, Y)$ is Hausdorff if $Y$ is Hausdorff, and regular if $Y$ is regular. [Hint: If $\overline U ⊂ V$, then $S(C,U)\subset S(C, V)$.]

If $Y$ is Hausdorff, given $f\neq g\in C(X,Y)$ with $f(x)\neq g(x)$, there are two disjoint open sets $U, V$ seperating them. Now $S(\set{x}, U), S(\set{y}, V)$ seperates $f,g$.

If $Y$ is regular, given $f\in C(X,Y)$ and $f\in S(C,U)$, then there is an open set $V$ containing the compact set $f(C)$ so that $f(C)\subset V\subset\overline V\subset U$. We claim $f\in S(C, V)\subset\overline{S(C,V)}\subset S(C,U)$. If $g\notin S(C,U)$, i.e. $\exists c\in C,g(c)\notin U$, again by regularity there is an open nbhd $W$ of $g(c)$ s.t. $W\cap \overline V=\emptyset$. Therefore $g\in S(\set{c}, W)$, and clearly $S(\set{c}, W)\cap S(C,V)=\emptyset$. Thus we have proven $\overline{S(C,V)}\subset S(C,U)$.

## Ex.46.7
>Show that if $Y$ is locally compact Hausdorff, then composition of maps $C(X,Y)\times C(Y, Z)\to C(X, Z)$ is continuous, provided the compact-open topology is used throughout. [Hint: If $g\circ f ∈ S(C,U)$, find $V$ such that $f (C) ⊂ V$ and $g(\overline V)\subset U$.]

Given $f\in C(X,Y), g\in C(Y,Z)$, and an open nbhd $g\circ f\in S(C,U)$. Then $f\in S(C, g^{-1}(U))$ and $g\in S(f(C), U)$. But $S(C, g^{-1}(U))\times S(f(C), U)$ is not sufficient. For the conclusion we just need an open set $V$ such that $f(C)\subset V$ and $g(\overline V)\subset U$ where $\overline V$ is compact. Thus $S(C, V)\times S(\overline V, U)$ will be good.

This is possible in a locally compact Hausdorff space. For every point $x$ in $f(C)$, we can choose an open nbhd $V_x$ of it so that $x\in V_x\subset\overline{V_x}\subset g^{-1}(U)$ and $\overline{V_x}$ is compact. Since $f(C)$ is compact, we can cover it by finitely many such $V_x$. Take $V$ to be the union of them, which meets our requirements.


## Ex.46.8
>Let $C'(X, Y)$ denote the set $C(X, Y)$ in some topology $\tau$ . Show that if the evaluation map $e : X\times C'(X, Y )\to Y$ is continuous, then $\tau$ contains the compact-open topology. [Hint: The induced map $E : C'(X, Y)\to C(X, Y)$ is continuous.]

We follow the hint. The induced map $E:C'(X,Y)\to C(X,Y)$ is continuous. But, as you can check, this map equals to the identity map. Therefore, $C'(X,Y)$ has finer topology.


## Ex.46.9
>Here is an (unexpected) application of Theorem 46.11 to quotient maps. (Compare Exercise 11 of §29.)
Theorem. If $p : A\to B$ is a quotient map and $X$ is locally compact Hausdorff, then $i_X\times p : X\times A → X\times B$ is a quotient map.
Proof.
(a) Let $Y$ be the quotient space induced by $i_X\times p$; let $q : X\times A\to Y$ be the quotient map. Show there is a bijective continuous map $f : Y\to X\times B$ such that $f\circ q = i_X\times p$.
(b) Let $g = f^{-1}$. Let $G : B\to C(X, Y )$ and $Q : A\to C(X, Y )$ be the maps induced by $g$ and $q$, respectively. Show that $Q = G\circ p$.
(c) Show that $Q$ is continuous; conclude that $G$ is continuous, so that $g$ is continuous.

(a) 
```tikz
\usepackage{tikz-cd}
\begin{document}
    \begin{tikzcd}
        X\times A && Y \\
        \\
        X\times B && \\
        \arrow["i_X\times p", swap, from=1-1, to=3-1]
        \arrow["q", from=1-1, to=1-3]
        \arrow["f", from=1-3, to=3-1, dashed, shift left=1]
        \arrow["g=f^{-1}"{xshift=8pt}, from=3-1, to=1-3, dashed, shift left=1]
    \end{tikzcd}
\end{document}
```
Use the universal property of quotient spaces.

(b) 
```tikz
\usepackage{tikz-cd}
\begin{document}
    \begin{tikzcd}
        A && C(X,Y) \\
        \\
        B && \\
        \arrow["p", swap, from=1-1, to=3-1]
        \arrow["Q", from=1-1, to=1-3]
        \arrow["F", from=1-3, to=3-1, dashed, shift left=1]
        \arrow["G", from=3-1, to=1-3, dashed, shift left=1]
    \end{tikzcd}
\end{document}
```
Check by definition.

(c) $Q$ is induced by $q$, hence continuous. Note that $p$ is quotient map. Given open set $U$ in $C(X,Y)$, that $G^{-1}U$ is open is equivalent to $q^{-1}G^{-1}U$ is open, i.e. $Q^{-1}U$ is open, which is true since $Q$ is continuous. Therefore, $G$ is continuous. Since $X$ is locally compact, $g$ is continuous. Hence $f$ is homeomorphism, $i_X\times p$ is quotient map.

## Ex.46.10
>A space is locally compact if it can be covered by open sets each of which is contained in a compact subspace of $X$. It is said to be $\sigma$-compact if it can be covered by countably many such open sets.
(a) Show that if $X$ is locally compact and second-countable, it is $\sigma$-compact.
(b) Let $(Y, d)$ be a metric space. Show that if $X$ is $\sigma$-compact, there is a metric for the topology of compact convergence on $Y^X$ such that if $(Y, d)$ is complete, $Y^X$ is complete in this metric. [Hint: Let $A_1, A_2,\dots $ be a countable collection of compact subspaces of $X$ whose interiors cover $X$. Let $Y_i$ denote the set of all functions from $A_i$ to $Y$ , in the uniform topology. Define a homeomorphism of $Y^X$ with a closed subspace of the product space $Y_1\times Y_2\dots$.]

Let me note first that in some literatures a $\sigma$-compact space is defined as a space that is union of countably many compact sets. They are **NOT** equivalent. Our one is weaker. A counterexample would be $\Bbb Q\subset\Bbb R$ in usual topology. (In $\Bbb Q$ every compact set has empty interior.) However, they are equivalent if $X$ is locally compact Hausdorff.

(a) $X=\bigcup U_\alpha$ where each $U_\alpha$ is contained in a compact set $C_\alpha$. There is a countable basis for $X$, say $V_n$, each of which is contained in some $U_\alpha$, therefore some $C_\alpha$. Thus $X=\bigcup V_n$ satisfies the definition.

(b) We follow the hint. $Y_i$'s are complete because $Y$ is complete. Then the product $Y_0:=Y_1\times Y_2\times \cdots$ is complete. Let's prove that $Y^X$ is homeomorphic to a closed subspace of $Y_0$, thus we are done.

Define a map $\phi : Y^X\to Y_0$ by $\phi(f)=(f|_{A_1}, \dots)$. It is clear that $\phi$ is injective and continuous. 

Note that the compact convergence topology is initial w.r.t. the restriction maps onto compact sets. But $X$ is $\sigma$-compact, thus it is initial w.r.t. the restriction maps onto $A_i$'s. Therefore, $\phi$ is an embedding into the product space $Y_0$.

Now let us characterize the image of $\phi$: 
$$
\mathrm{im}\phi=\set{(f_1, f_2, \ldots) \big{|} f_i: A_i\to Y, \forall m,n,f_m|_ {A_m\cap A_n}=f_n|_ {A_m\cap A_n}}.
$$
This is closed, because if $(f_i)\notin\mathrm{im}\phi$, say $f_m|_ {A_m\cap A_n}\neq f_n|_ {A_m\cap A_n}$ where $m<n$, then by denoting $\delta=\sup_{A_m\cap A_n}(f_m,f_n)$ we know that $A_1\times\dots\times B_{\bar\rho_n}(f_n,\delta/2)\times\dots\times B_{\bar\rho_m}(f_m,\delta/2)\times\dots$ has empty intersection with $\mathrm{im}\phi$.

(The same holds if we replace $Y^X$ by $C(X,Y)$.)

## Ex.46.11
>Let $(Y, d)$ be a metric space; let $X$ be a space. Define a topology on $C(X, Y)$ as follows: Given $f\in C(X, Y)$, and given a positive continuous function $δ : X → \Bbb R_+$ on $X$, let $B(f, \delta) = \set{g | d(f (x), g(x)) < \delta(x) \text{ for all } x\in X}$.
(a) Show that the sets $B(f, \delta)$ form a basis for a topology on $C(X, Y)$. We call it the fine topology.
(b) Show that the fine topology contains the uniform topology.
(c) Show that if $X$ is compact, the fine and uniform topologies agree.
(d) Show that if $X$ is discrete, then $C(X, Y ) = Y^X$ and the fine and box topologies agree.

(a) If $h\in B(f,\delta)\cap B(g,\gamma)$, let $d_f(x)=d(f(x),h(x)),d_g(x)=d(g(x),h(x))$. We know $d_f< \delta,d_g<\gamma$, hence $\delta-d_f$ and $\gamma-d_g$ are positive continuous functions. Then note that $B(h,\min\set{d_f,d_g})\subset B(f,\delta)\cap B(g,\gamma)$.

(b) $B_\bar\rho(f,\epsilon)\subset B(f,\epsilon)$, where the latter $\epsilon$ stands for constant map.

(c) If $X$ is compact, we have extreme value theorem, hence $B_\bar\rho(f,\min\delta)= B(f,\delta)$.

(d) $C(X, Y ) = Y^X$ is clear since $X$ is discrete. 
A basis open set for box topology is precisely $U=\set{g|d(f(x),g(x))<\epsilon_x}$ about a function $f$, the map $x\mapsto \epsilon_x$ is continuous, therefore it is also what fine basis about $f$ would be. Hence fine and box toplogy agree.

# §47 Ascoli's Theorem

## Ex.47.1
>Which of the following subsets of $C(\Bbb R,\Bbb R)$ are pointwise bounded? Which are equicontinuous?
(a) The collection $\set{f_n}$, where $f_n(x) = x + \sin nx$.
(b) The collection $\set{g_n}$, where $g_n(x) = n + \sin x$.
(c) The collection $\set{h_n}$, where $h_n(x) = |x|1/n$.
(d) The collection $\set{k_n}$, where $k_n(x) = n \sin(x/n)$.

Pointwise bounded: (a) (c) (d).
equicontinuous: (b) (d).

This shows by example that even in $C(\Bbb R,\Bbb R)$, pointwise boundedness and equicontinuity are independent.

## Ex.47.2
>Prove the following:
Theorem. If $X$ is a locally compact Hausdorff space, then a subspace $\mathcal F$ of $C(X,\Bbb R^n)$ in the topology of compact convergence has compact closure if and only if $\mathcal F$ is pointwise bounded and equicontinuous under either of the standard metrics on $\Bbb R^n$.

First let's compare this exercise with classical Ascoli's theorem:
Classical Ascoli's theorem: $\overline{\mathcal F}$ has compact closure, provided $X$ is compact and $C(X,\Bbb R^n)$ takes uniform topology.
Ex.47.2: $\overline{\mathcal F}$ has compact closure, provided $X$ is locally compact Hausdorff and $C(X,\Bbb R^n)$ takes compact convergence topology.

This problem is clear from Ascoli's theorem if you note by Ex.46.6 that $C(X,\Bbb R^n)$ is Hausdorff, hence being contained in a compact is equivalent to having compact closure.

## Ex.47.3
>Show that the general version of Ascoli's theorem implies the classical version (Theorem 45.4) when $X$ is Hausdorff.

When $X$ is compact, the uniform topology and the compact open topology agree. The rest goes the same as Ex.47.2.

## Ex.47.4
>Prove the following:
Theorem (Arzela's theorem, general version). Let $X$ be a Hausdorff space that is $\sigma$-compact; let $f_n$ be a sequence of functions $f_n : X\to \Bbb R^k$. If the collection $\set{f_n}$ is pointwise bounded and equicontinuous, then the sequence $f_n$ has a subsequence that converges, in the topology of compact convergence, to a continuous function. [Hint: Show $C(X,\Bbb R^k)$ is first-countable.]

Recall Ex.46.10 shows that $(\Bbb R^k)^X$ and $C(X, \Bbb R^k)$ are topologically complete. $\sigma$-compactness implies local compactness, thus Ex.47.2 shows that $\set{f_n}$ has compact closure. Recall in metric spaces compactness is equivalent to sequential compactness. 

## Ex.47.5
>Let $(Y, d)$ be a metric space; let $f_n : X\to Y$ be a sequence of continuous functions; let $f : X\to Y$ be a function (not necessarily continuous). Suppose $f_n$ converges to $f$ in the topology of pointwise convergence. Show that if $\set{f_n}$ is equicontinuous, then $f$ is continuous and $f_n$ converges to $f$ in the topology of compact convergence.

First we prove continuity of $f$. 
$$
d(f(x),f(x_0))\le d(f(x), f_N(x)) + d(f_N(x),f_N(x_0)) + d(f_N(x_0),f(x_0))
$$
Since $f_n$ is equicontinuous, we can choose an open nbhd of $x_0$ such that the first and the last term are sufficiently small for any $N$. Next choose $N$ large enough such that the middle term is sufficiently small.

Next we prove that $f_n$ converges to $f$ in compact convergence topology. i.e. we need to prove that if an equicontinuous sequence $\set{f_n}$ converges to $f$ pointwisely on a compact set, then the convergence is uniform. This is easy: Given $\epsilon>0$, by equicontinuity, for any point $x$ there is an open nbhd $U_x$ such that $d(f_n(x),f_n(y))<\epsilon$ on it. Cover the compact set with finitely many sets $U_{x_1},\dots,U_{x_n}$, on each of which $d(f_n(x),f_n(x_i))<\epsilon$ holds. 

Suppose $x\in U_i$, then we have:
$$
d(f_N(x),f(x))<d(f_N(x),f_N(x_i)) + d(f_N(x_i),f(x_i)) + d(f(x_i),f(x))
$$
The first term is smaller than $\epsilon$ on $U_i$. The last term is smaller than $\epsilon$ by taking $n\to\infty$ on the first term. The middle term is smaller than $\epsilon$ if $N$ is sufficiently large. Therefore, $d(f_N(x),f(x))$ is dominated by $3\epsilon$ on $U_k$ for large $N$, proving uniformity.