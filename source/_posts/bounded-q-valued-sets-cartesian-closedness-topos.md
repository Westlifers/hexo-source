---
title: 有界 Q-valued sets 的笛卡尔闭性与 topos
date: '2026-10-04 23:00:00'
categories: [范畴论]
tags: [Quantaloid, Topos]
toc: true
tikzjax: true
engine: statement
plugins:
  mathjax: true
ai:
  level: generated
  note: 本文由 Noema 根据我与它共同讨论、整理的证明撰写。
---

[上一篇](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)讨论了 integral involutive quantaloid 的 weak tabularity 与 topos。这次只从笛卡尔闭性出发，在有界 $Q$-valued sets 中得到同样的结论，而且标量判据可以写得很短：

$$
K_*(Q)\text{ 笛卡尔闭}
\quad\Longleftrightarrow\quad K_*(Q)\text{ 是 topos}
\quad\Longleftrightarrow\quad
\forall a\in Q,\quad\bigl(a^2\le a\ \Longrightarrow\ a^2=a\bigr).
$$

这里 $Q$ 是任意交换幺 quantale，不要求 integral 或 divisible；$K_*(Q)$ 使用有界对角 $D_*Q$，态射取所有左伴随 distributors。证明的核心是一个自推出：乘以 singleton 后，它的两个标记点仍保留原来的交叉 hom，而这个 hom 恰好成为乘积投影的像幂等元。

<!--more-->

## 有界相等度与主定理 { #有界相等度与主定理 }

::: {.definition #def-bounded-q-valued}
设 $Q$ 是交换幺 quantale，乘法用并置表示，单位为 $e$，residual 满足

$$
pa\le b\quad\Longleftrightarrow\quad a\le p\to b.
$$

固定 $Q$ 的 involution 为恒等映射。有界对角 quantaloid 的对象是 $Q$ 中的元素，箭头为

$$
D_*Q(p,q)=\{d\le p\wedge q\mid p(p\to d)=d=q(q\to d)\}.
$$

对象 $p$ 的 identity 是标量 $p$；对 $d:p\to q$、$b:q\to r$，复合为

$$
b\circ_q d=b(q\to d)=(q\to b)d.
$$

下标记录复合经过的对象。join 在 $Q$ 中计算，involution 保持标量并反转方向。因此 $D_*Q$ 总是 integral，且其中每个 endomorphism 都对称，即使 $Q$ 本身并不 integral。

记

$$
K_*(Q)=\operatorname{Map}(\operatorname{SymDist}(D_*Q)).
$$

它的对象是小的对称 $D_*Q$-范畴，态射是它们之间**所有左伴随 distributors**。用 $(-)^\circ$ 表示给定 involution，用 $(-)^*$ 表示实际右伴随，不预先把二者等同。

这些对象就是有界的 $Q$-valued similarities，也对应 Höhle–Kubiak 意义下的相等度；这个对象识别见 Lai–Shen–Tao–Zhang 的 [*Quantale-valued dissimilarity*](https://arxiv.org/pdf/1904.05565v2#page=13)，Theorem 4.5 与 Remark 4.6。非整情形中的“$Q$-Set”也可能指无界的 $DQ$ 版本，或采用集合函数作为态射；本文始终针对上述 $K_*(Q)$。
:::

::: {.theorem #thm-bounded-ccc-topos}
对任意交换幺 quantale $Q$，以下五个条件等价：

1. $K_*(Q)$ 笛卡尔闭；
2. $K_*(Q)$ 是 elementary topos；
3. $K_*(Q)$ 是 Grothendieck topos；
4. $D_*Q$ weakly tabular；
5. 每个 subidempotent 都幂等，即对任意 $a\in Q$，

$$
a^2\le a\quad\Longrightarrow\quad a^2=a.\tag{C}
$$

条件成立时，这个 topos 是 localic 的。
:::

条件 (C) 中的平方是 **$Q$ 的乘法**。下面证明的路线是：笛卡尔闭性使一个指定的自推出被 $-\times S_p$ 保持，从而得到 $\kappa_p(q)=\pi\pi^*$；再取 $p=e\vee a$、$q=a$ 推出 (C)。反向则直接把每条有界对角写成一个 map-span，接上[上一篇的表示定理](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)。

自推出与乘积比较的细节见[投影公式的证明](#proof-kappa-idempotent)。

## 自推出与乘积投影 { #笛卡尔闭性强迫-κ-幂等 }

以下始终在 $D_*Q$ 上工作。记 $S_p$ 为类型为 $p$、hom 为 $1_p$ 的 singleton。矩阵采用 target row、source column 的约定：$X(y,x):|x|\to|y|$。一个 map $F:X\to Z$ 满足

$$
X\le F^*F,\qquad FF^*\le Z.
$$

每个点 $x\in X$ 都有 principal map $j_x:S_{|x|}\to X$，其两方向的分量是 $X(y,x)$ 和 $X(x,y)$，故 $j_y^*j_x=X(y,x)$。这些 principal maps 检测 distributors 是否相等。只有对这样的 principal maps，我们直接使用 $j_x^*=j_x^\circ$。

**先说明自推出怎样构造。** 对 map $f:U\to X$，若 $\varepsilon=ff^*$ 对称，则 adjunction 给出 $\varepsilon\le X$、$\varepsilon^2=\varepsilon$、$\varepsilon f=f$。取 $X$ 的两个带标签副本，副本内部保留 $X$ 的 hom，跨副本的 hom 取 $\varepsilon$，得到对称范畴 $D_f$。它的包含 maps 满足

```tikz
\usepackage{amsmath}
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}[column sep=large,row sep=large]
U \arrow[r,"f"] \arrow[d,"f"'] & X \arrow[d,"r"] \\
X \arrow[r,"\ell"'] & D_f
\end{tikzcd}
\end{document}
```

$$
\ell^*\ell=X=r^*r,\qquad r^*\ell=\varepsilon=\ell^*r.
$$

这个方块确实是 pushout。若 $F,G:X\to Z$ 且 $Ff=Gf$，则

$$
\varepsilon\le G^*G\varepsilon=G^*F\varepsilon\le G^*F,
\qquad \varepsilon\le F^*G.
$$

在两个副本上分别放 $F,G$，得到 $H$；分别放 $F^*,G^*$，得到 $N$。原来的 units 与上述交叉不等式给出 $D_f\le NH$，counits 给出 $HN=FF^*\vee GG^*\le Z$。逐副本的 $Z$-action 成立，另外

$$
HD_f\le HNH\le H,\qquad D_fN\le NHN\le N;
$$

reflexivity 给出反向不等式。因此 $H\dashv N$，且 $H\ell=F$、$Hr=G$；两副本覆盖所有点，也给出唯一性。

这里的对称性条件不能省略。稍后对投影 $\pi$ 应用此构造时，$\pi\pi^*$ 是 $D_*Q$ 中的 endomorphism，所以自动对称；这不是对所有 integral involutive quantaloids 的一般断言。

::: {.lemma #lem-kappa-idempotent}
若 $K_*(Q)$ 笛卡尔闭，则对任意 $p,q$，有

$$
\kappa_p(q):=\top_{q,p}\circ_q\top_{p,q}=\pi\pi^*,
\qquad \pi:S_q\times S_p\to S_p.
$$

特别地，$\kappa_p(q)$ 在对象 $p$ 上幂等。
:::

::: {.proof #proof-kappa-idempotent data-proof-of="lem-kappa-idempotent"}
令 $Y=S_p$。取类型分别为 $p,q$ 的两点对称范畴 $A$，所有 hom 都取相应类型的最大箭头，principal maps 记为 $i:Y\to A$、$j:S_q\to A$。integrality 保证传递性；而 $A$ 是 subterminal：任意 maps $F,G:X\to A$ 都有 $FG^*\le A$，于是

$$
F\le FG^*G\le G,
$$

交换 $F,G$ 得相等。因此 $A\times Y\cong Y$，逆于投影的 map 是 $\langle i,1_Y\rangle$。

由于 $j$ 是 principal，$jj^*$ 对称。按上面的构造得到 $B=A\amalg_{S_q}A$，包含 maps 为 $\ell,r$，且 $r^*\ell=jj^*$。笛卡尔闭性在此只用一次：$-\times Y$ 有右伴随，所以保持这个已构造的 pushout。令 $P=S_q\times Y$，利用 $A\times Y\cong Y$，得到右边的方块：

```tikz
\usepackage{amsmath}
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}[column sep=large,row sep=large]
S_q \arrow[r,"j"] \arrow[d,"j"'] & A \arrow[d,"r"] &
P \arrow[r,"\pi"] \arrow[d,"\pi"'] & Y \arrow[d,"R"] \\
A \arrow[r,"\ell"'] & B & Y \arrow[r,"L"'] & B\times Y
\end{tikzcd}
\end{document}
```

图中两方块均为 pushout；从左到右的操作是乘以 $Y$ 再用上述同构，而非顶点之间另有箭头。标记点变为

$$
L=\langle\ell i,1_Y\rangle,\qquad R=\langle ri,1_Y\rangle.
$$

另一方面，$\pi\pi^*$ 是 singleton $Y$ 上的对称 endomorphism，所以也可构造自推出 $D_\pi=Y\amalg_PY$。设其包含 maps 为 $s,t$。pushout 的唯一性给出保持两条 cocone maps 的同构

$$
\Theta:B\times Y\xrightarrow{\cong}D_\pi,
\qquad \Theta L=s,\quad\Theta R=t.
$$

故

$$
R^*L=t^*s=\pi\pi^*.\tag{1}
$$

再从原来的两点计算同一个交叉 hom。$B$ 中标记点 $\ell i,ri$ 的交叉 hom 为

$$
(ri)^*(\ell i)=i^*r^*\ell i=i^*jj^*i=\kappa_p(q).
$$

令 $C$ 为这两点组成的 full subcategory，$h:C\to B$ 为包含 map，$c_-,c_+:Y\to C$ 为 principal maps。两点类型都是 $p$，所以 integrality 给出常值保类型函子诱导的 $\delta:C\to Y$。配对 $H=\langle h,\delta\rangle:C\to B\times Y$ 仍 fully faithful：

$$
C\le H^*H\le H^*\operatorname{pr}_B^*\operatorname{pr}_BH=h^*h=C.
$$

由 $Hc_-=L$、$Hc_+=R$，得到

$$
R^*L=c_+^*H^*Hc_-=c_+^*c_-=\kappa_p(q).
$$

结合 (1) 即得所求。最后由 adjunction 的三角恒等式，

$$
(\pi\pi^*)^2=\pi\pi^*\pi\pi^*=\pi\pi^*.
$$

整个证明用的是真正的范畴乘积，没有假设 enriched 乘积矩阵的公式，也没有把任意右伴随替换为 involute。
:::

## 从投影幂等到标量判据，再到 topos { #从-κ-到标量判别与-weak-tabularity }

::: {.proof #proof-bounded-necessity data-proof-of="thm-bounded-ccc-topos" data-proof-part="① ⇒ ⑤：笛卡尔闭性 ⇒ (C)"}
[**笛卡尔闭性推出 (C)。**]{.proof-direction} 设 $a^2\le a$，取 $p=e\vee a$。则

$$
pa=a\vee a^2=a,\qquad p\to a=a.
$$

第二个等式的一边来自 $pa=a$，另一边来自 $p\ge e$。所以标量 $a$ 是 $p$ 与 $a$ 之间两个方向上的有界对角，也是这两个 hom 的最大元。因而

$$
\kappa_p(a)=a\circ_a a=a(a\to a)=a.
$$

这里用了对任意 $x$ 都成立的 $x(x\to x)=x$，它来自 residuation 与 $e\le x\to x$。由 [](#pre:lem-kappa-idempotent)，这个 endomorphism 在 $p$ 上幂等，于是

$$
a=a\circ_p a=a(p\to a)=a^2.
$$

计算 $\kappa_p(a)$ 时经过对象 $a$，计算其平方时经过对象 $p$；正是这一区别把范畴的幂等性转成 $Q$ 中的幂等性。
:::

反向要用到底层 maps，也就是 singletons 之间的 maps。

::: {.lemma #lem-bounded-base-maps}
$D_*Q$ 中从 $r$ 到 $p$ 至多有一个 map。它与实际右伴随的标量都是 $r$；存在的充要条件是

$$
r\le p,\qquad p(p\to r)=r,\qquad r(p\to r)=r.
$$
:::

::: {.proof #proof-bounded-base-maps data-proof-of="lem-bounded-base-maps"}
设 $f:r\to p$ 左伴随于 $g:p\to r$。unit 与有界性给出

$$
r\le(p\to g)f\le(p\to p)f=f\le r.
$$

中间等号来自 $f=p(p\to f)$ 及 $p(p\to p)=p$，故 $f=r$。利用同一复合的另一种写法，

$$
r\le g(p\to f)\le g(p\to p)=g\le r,
$$

同样得到 $g=r$。反过来，前两个条件使标量 $r$ 成为两个方向上的箭头；第三个条件给出 unit，而 counit 是 $r(r\to r)=r\le p$。
:::

::: {.proof #proof-bounded-sufficiency data-proof-of="thm-bounded-ccc-topos" data-proof-part="⑤ ⇒ ④：(C) ⇒ weak tabularity"}
[**(C) 推出 weak tabularity。**]{.proof-direction} 取任意有界对角 $d:p\to q$，令 $u=p\to d$。由 $pu=d\le p$，有

$$
pu^2\le pu=d,
$$

residuation 给出 $u^2\le p\to d=u$。(C) 因而给出 $u^2=u$，所以

$$
d(p\to d)=pu^2=pu=d.
$$

在端点 $q$ 上作相同计算，得到 $d(q\to d)=d$。由 [](#pre:lem-bounded-base-maps)，存在底层 maps $a:d\to p$、$b:d\to q$，两者的标量都是 $d$，并且

$$
p\xleftarrow{\ a\ }d\xrightarrow{\ b\ }q,
\qquad b\circ_d a^*=d(d\to d)=d.
$$

每条箭头自身就由一个 map-span 表示，因此满足 weak tabularity：

$$
v=\bigvee\{ba^*\mid a:s\to p,\ b:s\to q\text{ 是底层 maps},\ ba^*\le v\}.
$$
:::

::: {.proof #proof-bounded-completion data-proof-of="thm-bounded-ccc-topos" data-proof-part="④ ⇒ ③ ⇒ ② ⇒ ①；localicity"}
因为 $D_*Q$ integral，[上一篇的表示定理](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)把 weak tabularity 识别为 localic Grothendieck topos。那里检查了 local frames、modularity、给定 involution 与闭 cribles 的相容性，并通过 sheaf 表示对**所有左伴随 distributors**取 maps；这里不重复这些通用步骤。Grothendieck topos 是 elementary topos，后者笛卡尔闭，至此 [](#pre:thm-bounded-ccc-topos)的五个条件形成闭环。
:::

还可写出这个 topos 的 site。在 (C) 下，底层 maps 构成 $Q$ 上的偏序 $P$：

$$
r\preceq p\quad\Longleftrightarrow\quad r\le p\ \text{且}\ p(p\to r)=r.
$$

一族 $(r_i\preceq p)$ 覆盖当且仅当 $\bigvee_i r_i=p$，于是 $K_*(Q)\simeq\operatorname{Sh}(P,J)$。

## Integral 情形与适用范围 { #Integral-情形 }

若 $Q$ 本身 integral，即 $e=\top$，则 $a^2\le a$ 自动成立，(C) 就是所有元素幂等。此时 $ab\le a\wedge b$；若 $z\le a,b$，则

$$
z=z^2\le ab.
$$

所以乘法就是 meet，保持任意 join 的乘法给出 frame distributive law。反向对 frame quantale 显然成立。integral 时 $DQ=D_*Q$，不需要额外假设 divisible，因此

$$
K(DQ)\text{ 笛卡尔闭}
\quad\Longleftrightarrow\quad K(DQ)\text{ 是 topos}
\quad\Longleftrightarrow\quad Q\text{ 是 frame quantale}.
$$

对非整 $Q$，(C) 的前提不能丢掉。例如 $Q=\mathcal P(C_3)$ 取集合的群加法为乘法。若 $A+A\subseteq A$，则 $A$ 为空或有限群中的子半群，因而是子群，所以 $A+A=A$。这满足 (C)，但对生成元 $g$，$\{g\}^2=\{2g\}$ 与 $\{g\}$ 不可比较；(C) 并不声称任意 $a$ 都有 $a\le a^2$。

必要性证明只要求 $-\times S_p$ 保持上面指定的自推出，而没有用到 subobject classifier、一般的像分解，也没有假定笛卡尔闭范畴中所有 pushouts 都存在。实际上，只要有限乘积存在，且所有满足 $e\le p=p^2$ 的 $S_p$ 都 exponentiable，就已足够：对 $a^2\le a$，取 $p=e\vee a$ 有 $p^2=p$，同一证明便推出 (C)。
