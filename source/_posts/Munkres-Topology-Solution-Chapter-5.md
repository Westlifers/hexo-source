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




# §38. The Stone-Cech Compactification

## Ex.38.1
> Verify the statements made in Example 4.

Omitted.

## Ex.38.2
> Show that the bounded continuous function $g:(0,1)\to \Bbb R$ defined by $g(x) =
\cos(1/x)$ cannot be extended to the compactification of Example 3. Define an imbedding $h : (0, 1) \to [0, 1]^3$ such that the functions $x, \sin(1/x), \cos(1/x)$ are all extendable to the compactification induced by $h$.

Firstly, $g $ is not extendable. Suppose not, if $g $ can be extended to a $\bar g:\overline S\to \Bbb R$, let $i:(0,1)\to\overline S$ be the embedding. We know in $\Bbb R^2$ (and hence in $\overline S$), $(1/n\pi,0)\to(0,0)$, so $\bar g(i(1/n\pi))\to \bar g(0,0)$. However, $\bar g(i(1/n\pi))=g(1/n\pi)=(-1)^n$ doesn't converge, a contradiction.

Secondly, $h(x)=(x,\sin(1/x),\cos(1/x))$ will be a desired embedding, as you can readily check like in Stone compactification.

## Ex.38.3
>Under what conditions does a metrizable space have a metrizable compactification?

The answer is $C_2$ condition.

If $X $ is a metrizable space with a metrizable compactification $Y $, then $Y $ is a compact metrizable space, hence Lindelof, hence $C_2$. So $X $ is $C_2$.

Conversely, if $X $ is $C_2$, let $B_n $ be a countable basis for it. We refer to Ex.33.4. :
>Ex.33.4. Recall that A is a “$G_\delta$ set” in $X $ if $A $ is the intersection of a countable collection of open sets of $X $.
Theorem. Let $X $ be normal. There exists a continuous function $f : X \to [0, 1]$ such that $f (x) = 0$ for $x \in A$ and $f (x) > 0$ for $x \notin A$, if and only if $A$ is a closed $G_\delta$ set in X.
A function satisfying the requirements of this theorem is said to vanish precisely on $A $.

And recall that every metrizable space is $T_6 $ space, that is to say, every closed set is $G_\delta$. Therefore, we conclude that for each $n $, there exists an $f_n $ s.t. $f_n$ is vanishes precisely *outside* $B_n $. Now by the imbedding theorem (theorem 34.2) we can imbedding $X $ into $[0,1]^\omega$, which is metrizable. Thus $X $ has a metrizable compactification, which is the closure of its image in $[0,1]^\omega$

## Ex.38.4
>Let $Y$ be an arbitrary compactification of $Y$; let $\beta(X)$ be the Stone-Cech compactification. Show there is a continuous surjective closed map $g : \beta(X) \to Y$ that equals the identity on $X$.
[This exercise makes precise what we mean by saying that $\beta(X)$ is the “maximal”  compactification of $X$. It shows that every compactification of $X$ is equivalent to a quotient space of $\beta(X)$.]

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

As shown in the figure, let $j=\beta(i)$ be the continuous extension of the embedding $i$. We show $\beta(i)$ is surjective and closed. 

That it is closed follows from the fact that $j$ is a continuous map between compact Hausdorff spaces. Note that 
$$
Y=\mathrm{Cl}_Y i(X)=\mathrm{Cl}_Y j(X)\subset\mathrm{Cl}_Yj(\beta(X))=j(\beta(X))
$$
The last equality follows from closedness of $j$.

## Ex.38.5
> (a) Show that every continuous real-valued function defined on $S_\Omega$ is “eventually constant.” [Hint: First prove that for each $\epsilon$, there is an element $\alpha$ of $S_\Omega$ such that $|f(\beta)-f(\alpha)|<\epsilon$ for all $\beta>\alpha$ Then let $\epsilon=1/n$ for $n\in\Bbb Z_+$ and consider the corresponding points $\alpha_n$.]
(b) Show that the one-point compactification of $S_\Omega$ and the Stone-Cech compactification are equivalent.
(c) Conclude that every compactification of $S_\Omega$ is equivalent to the one-point compactification.

We follow the hint.

(a) Suppose contrary to the hint, i.e. $\exists \epsilon_0>0, \forall\alpha,\exists\beta>\alpha$ s.t. $|f(\beta)-f(\alpha)|\ge \epsilon_0$. Now fix an arbitrary $\alpha_1$, we have a corresponding $\beta$, write it as $\alpha_2$. Repeat this process, we will have an increasing sequence $\alpha_n$ satisfying $|f(\alpha_n)-f(\alpha_{n+1})|\ge \epsilon_0$. Since there are countably many $\alpha_n $, they have an upper bound. Let $\alpha$ be their least upper bound. Clearly $\alpha_n\to\alpha $.

By continuity of $f $, there exists a nbhd $U$ of $\alpha$ s.t. $\forall x\in U, |f(x)-f(\alpha)|<\epsilon_0/2$. Choose an $n$ such that $\alpha_n, \alpha_{n+1}\in U$, then the above equation yields $|f(\alpha_n)-f(\alpha_{n+1})|< \epsilon_0$, a contradiction.

(b) By the uniqueness of Stone compactification, it suffices to prove that one point compactification of $S_\Omega$ satisfies the extension property. Let $f:S_\Omega\to\Bbb R$ be continuous. By part (a) $f$ is eventually constant, say eventually be $r$. Let $g:\overline{S_\Omega}\to\Bbb R$ with $g|_{X_\Omega}=f, g(\Omega)=r$. It is easy to verify the continuity of $g $. Thus the one-point compactification is equivalent to the Stone compactification.

(c) Let $Y$ be an arbitrary compactification. By ex.38.4 there exists a continuous surjective closed function $f: \overline{S_\Omega}\to Y$. However, $f$ equals to identity on $X$. $f$ Being surjective, we conclude that $|Y\setminus X|=1$ and $f$ is thus injective. Being closed and continuous, $f$ is thus a homeomorphism, proving equivalence.

## Ex.38.6
>Let $X$ be completely regular. Show that $X$ is connected if and only if $\beta(X)$ is connected. [Hint: If $X=A\cup B$ is an separation of $X$, let $f(x)=0$ for $x\in A$, $f(x)=1$ for $x\in B$.]

We will use an obvious equivalent characterization of connectedness, which you can prove directly:

> $X$ is connected if and only if every continuous function $X\to 2$ is constant, where $2$ denotes the 2-point space with discrete topology (which is obviously compact Hausdorff).

Suppose $\beta X$ is connected. Let $f:X\to 2$ be an continuous function and extend it to $g: \beta X\to 2$. $g$ is constant, so $f $ is constant. Therefore $X $ is connected.

Conversely, suppose $X $ is connected. Since $X$ is dense in $\beta X $, the connectedness of $X $ implies the connectedness of its closure, i.e. $\beta X $.

## Ex.38.7
>Let X be a discrete space; consider the space $\beta X$.
(a) Show that if $A\subset X$, then $\overline A$ and $\overline{X-A}$ are disjoint, where the closures are taken in $\beta X$.
(b) Show that if $U$ is open in $\beta X$, then $\overline U$ is open in $\beta X$.
(c) Show that $\beta X$ is totally disconnected.

(a) (All closures below in this problem are taken in $\beta X$) Since $X$ is discrete, there exists a continuous function $f: X\to I $ s.t. $f(A)=0,f(X\setminus A)=1$. Now extend it to $g: \beta X\to I$. Note that all the spaces involved are Hausdorff, so $g|_{\overline A}$ is uniquely determined by $g|_A=f|_A$. Hence we have $g(\overline A)=0$, similarly $g(\overline{X\setminus A})=1$. Hence disjoint.

(b) This question is asking us to prove that $\beta X$ is *extremely disconnected*. Similarly to part (a) we have a continuous $g:\beta X\to I $ s.t. $g(\overline{X\cap U})=0, g(\overline{X\setminus U})=1$. But this time notice that $X$ is dense, a standard argument shows $\overline{X\cap U}=\overline{U}$, hence $g(\overline{U})=0$. 

Next we prove $g(\beta X\setminus\overline U)=1$. Suppose not, there exists an $x\notin\overline U $ s.t. $g(x)<1$. By continuity we find a nbhd $U_x$ of $x$ such that $U_x\cap \overline U=\emptyset,g(U_x)<1$. Since $X$ is dense, we have $X\cap U_x\neq\emptyset$. However, $g$ is of value either $0$ or $1$ on $X$, $g(U_x\cap X)<1\implies g(U_x\cap X)=0\implies U_x\cap X\subset X\cap U$, contradicting to $U_x\cap \overline U=\emptyset$.

Therefore, $\overline U=g^{-1}([0,1/2))$ is an open set.

(c) We have a even more general result: An extremely disconnected space is totally disconnected. Let $A$ be a subset of at least two points, say $x\neq y$. By Hausdorff-ness we have disjoint open sets $U,V$ such that $x\in U, y\in V$. Then $y\notin\overline U$, therefore $A\cap\overline U$ is an non-trivial clopen set of $A$. This implies that the only possible connected subspace are singletons.

## Ex.38.8
>Show that $\beta(\Bbb Z_+)$ has cardinality at least as great as $I^I$ , where $I=[0,1]$. [Hint: The space $I^I$ has a countable dense subset.]

Indeed, $I^I$ is separable. Actually, $\mathfrak{c}$-product of separable spaces is still separable, where $\mathfrak c$ denotes the cardinality of the reals. This is a special case of Hewitt-Marczewski-Pondiczery theorem. FYI see [here](https://math.stackexchange.com/questions/526454/uncountable-product-of-separable-spaces-is-separable). Here we don't need that strong theorem. If you are familiar with analysis, consider the set of polynomials with rational coefficients, then apply Stone-Weierstrass theorem.

Let $D$ be a countable dense subset of $I^I$. Since $\Bbb Z_+$ is discrete, any bijection $f:\Bbb Z_+\to D$ is continuous. Extend it to Stone compactification, we get $g:\beta\Bbb Z_+\to I^I$. Moreover, $\mathrm{im}g\supset D$, and notice that $g$ is a continuous function from a compact space to Hausdorff space, hence closed map. We conclude that $\mathrm{im}g=\overline{\mathrm{im}g}\supset\overline D=I^I$. So $g$ is surjective.

## Ex.38.9
>(a) If $X$ is normal and $y$ is a point of $\beta(X)-X$, show that $y$ is not the limit of a sequence of points of $X$.
(b) Show that if $X$ is completely regular and non-compact, then $\beta(X)$ is not metrizable.

(a) Suppose $y$ is the limit of $x_n\in X$ and $y\in\beta X\setminus X$, then the set $\lbrace x_n\rbrace_n\cup\lbrace y\rbrace$ is compact, hence closed. Therefore, $\lbrace x_n\rbrace_n=(\lbrace x_n\rbrace_n\cup\lbrace y\rbrace)\cap X$ is closed in $X$. 

Next, we show $\lbrace x_n\rbrace_n$ is discrete as a subspace. For each $n $, we can separate $x_n,y$ by two disjoint open sets $U\ni x_n,V\ni y$ in $\beta X$. Since $x_n\to y$, $U$ will contain only finitely many $x_m$'s, say $x_{m_1},...,x_{m_k}$. Let $U'=U\setminus\lbrace x_{m_j}\rbrace_{j=1}^k$. Then $U'\cap X$ is a nbhd of $x_n$ that intersects $\lbrace x_n\rbrace_n$ only on $x_n$, proving discreteness of $\lbrace x_n\rbrace_n$.

Finally, we conclude the contradiction. Assign $f(x_n)=z_n=1/2+(-1)^n 1/2$, since $\lbrace x_n\rbrace_n$ is discrete, $f$ is continuous from $\lbrace x_n\rbrace_n$ to $I$. By Tietze's extension theorem, we can extend $f$ to a continuous function $f: X\to I$, and then extend it further to $\beta X\to I$. Thus, $f(y)=f(\lim x_n)=\lim f(x_n)=\lim z_n$. But we know $z_n$ does not converge, a contradiction.

(b) If $X$ is non-compact, then it is a proper subspace of $\beta X$. So there exists an $y\in\beta X\setminus X$. Since $X$ is dense, $y$ is a limit point of $X$. By part (a), there is no sequence converging to $y$, so $\beta X$ does not satisfy the sequence lemma, thus not metrizable

## Ex.38.10
>We have constructed a correspondence $X\to\beta X$ that assigns, to each completely regular space, its Stone-Cech compactification. Now let us assign, to each continuous map $f:X\to Y$ of completely regular spaces, the unique continuous map $\beta(f):\beta(X)\to\beta(Y)$ that extends the map $i\circ f$, where $i:Y\to\beta(Y)$ is the inclusion map. Verify the following:
(i) If $\mathbb 1_X:X\to X$ is the identity map of $X$, then $\beta(\mathbb 1_X)$ is the identity map of $\beta(X)$.
(ii) If $f:X\to Y$ and $g:Y\to Z$, then $\beta(g\circ f)=\beta(g)\circ\beta(f)$. These properties tell us that the correspondence we have constructed is what is called a functor; it is a functor from the “category” of completely regular spaces and continuous maps of such spaces, to the “category” of compact Hausdorff spaces and continuous maps of such spaces. You will see these properties again in Part II of the book; they are fundamental in algebra and in algebraic topology.

This is the only place of Part I of the book where category theory is mentioned. These problems are standard category technics. I'll take part (ii) as example.

```tikz
\usepackage{tikz-cd}
\begin{document}
    \begin{tikzcd}
        X & Y & Z & X && Z \\
        \\
        {\beta X} & {\beta Y} & {\beta Z} & {\beta X} && {\beta Z}
        \arrow["f", from=1-1, to=1-2]
        \arrow["i", from=1-1, to=3-1]
        \arrow["g", from=1-2, to=1-3]
        \arrow["j", from=1-2, to=3-2]
        \arrow["k", from=1-3, to=3-3]
        \arrow["{g\circ f}", from=1-4, to=1-6]
        \arrow["i"', from=1-4, to=3-4]
        \arrow["k", from=1-6, to=3-6]
        \arrow["{\beta f}", dashed, from=3-1, to=3-2]
        \arrow["{\beta g}", dashed, from=3-2, to=3-3]
        \arrow["{\beta(g\circ f)}"', dashed, from=3-4, to=3-6]
    \end{tikzcd}
\end{document}
```

Recall that the extension of a function to Stone compactification is unique. Both diagram above commute. So the bottom arrows equal.