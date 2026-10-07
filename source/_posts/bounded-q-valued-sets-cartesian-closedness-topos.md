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

[上一篇](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)证明了：对 small integral involutive quantaloid $\mathcal R$，$K(\mathcal R)$ 是 topos 当且仅当 $\mathcal R$ weakly tabular。这次继续问：如果只假设笛卡尔闭，能推出多少？

对任意交换幺 quantale $Q$，答案在有界相等度的版本中仍然很简洁。记 $D_*Q$ 为 bounded-diagonal quantaloid，$K_*(Q)=K(D_*Q)$，则


$$
K_*(Q)\text{ 笛卡尔闭}
\quad\Longleftrightarrow\quad K_*(Q)\text{ 是 topos}
\quad\Longleftrightarrow\quad
p(p\to x)^2=p(p\to x)\quad(x\le p).
$$


这里不要求 $Q$ integral 或 divisible。证明的关键是在一般 integral 底层上，从一个指数对象推出 $\kappa_t(q)=\top_{q,t}\top_{t,q}$ 的幂等性。

<!--more-->

## 有界相等度与主定理 { #有界相等度与主定理 }
::: {.definition #def-bounded-q-valued}

设 $Q$ 是交换幺 quantale，乘法用并置表示，单位记为 $e$，residual 由


$$
pa\le b\quad\Longleftrightarrow\quad a\le p\to b
$$


确定。固定 $Q$ 的 involution 为恒等映射。$D_*Q$ 的对象是 $Q$ 中的元素，箭头为


$$
D_*Q(p,q)=\{d\le p\wedge q\mid p(p\to d)=d=q(q\to d)\}.
$$


对象 $p$ 上的 identity 是标量 $p$。对 $d:p\to q$、$b:q\to r$，复合为


$$
b\circ_q d=b(q\to d)=(q\to b)d.
$$


下标 $q$ 标明复合经过的对象；同一个标量出现在不同 hom 中时，这个下标尤其重要。平行箭头的 join 在 $Q$ 中计算，involution 保持标量、反转方向。由于每个 $p$-endomorphism 都不超过 identity $p$，$D_*Q$ 总是 integral，即使 $Q$ 本身并不 integral。

我们考虑


$$
K_*(Q)=\operatorname{Map}(\operatorname{SymDist}(D_*Q)).
$$


对象是小的对称 $D_*Q$-范畴，态射是它们之间**所有左伴随 distributors**。仍用 $(-)^\circ$ 表示给定的 involution，用 $(-)^*$ 表示实际的右伴随，不预先把二者等同。

这些对象就是有界的 $Q$-valued similarities，也对应 Höhle–Kubiak 意义下的相等度；这个对象识别见 Lai–Shen–Tao–Zhang 的 [*Quantale-valued dissimilarity*](https://arxiv.org/pdf/1904.05565v2#page=13)，Theorem 4.5 与 Remark 4.6。非整情形中，“$Q$-Set”还可能指无界的 $DQ$ 版本，或者采用集合函数的态射约定；下文的结论始终针对上述 $K_*(Q)$。
:::

::: {.theorem #thm-bounded-ccc-topos}
对任意交换幺 quantale $Q$，以下条件等价：

1. $K_*(Q)$ 笛卡尔闭；
2. $K_*(Q)$ 是 elementary topos；
3. $K_*(Q)$ 是 Grothendieck topos；
4. $D_*Q$ weakly tabular；
5. 对任意 $d\le p$，若 $p(p\to d)=d$，则 $d(p\to d)=d$；
6. 对任意 $x\le p$，有 $p(p\to x)^2=p(p\to x)$。

条件成立时，这个 topos 是 localic 的。
:::

第 5 条说每个有界、$p$-divisible 的元素在对象 $p$ 上幂等，下面记为 (RI)。第 6 条的平方则是 **$Q$ 中的乘法**，左边为 $p\cdot(p\to x)\cdot(p\to x)$。

## 笛卡尔闭性强迫 κ 幂等 { #笛卡尔闭性强迫-κ-幂等 }

先暂时回到一般的 small integral involutive quantaloid $\mathcal R$，记


$$
K(\mathcal R)=\operatorname{Map}(\operatorname{SymDist}(\mathcal R)),
\qquad \kappa_t(q)=\top_{q,t}\top_{t,q}.
$$


这里 $\top_{t,q}$ 指最大的箭头 $t\to q$，$gf$ 表示先 $f$ 后 $g$。矩阵采用 target row、source column 的约定，即 $A(y,x):|x|\to|y|$。一个对称范畴满足 $I\le A$、$A^2=A$、$A^\circ=A$；distributor $F:A\to B$ 满足 $BF=F=FA$，而 $F\dashv F^*$ 意味着


$$
A\le F^*F,\qquad FF^*\le B.
$$



记类型为 $t$、hom 为 $1_t$ 的 singleton 为 $S_t$。integrality 给出 $A(x,x)=1_{|x|}$，所以每个点都有 principal map


$$
j_x:S_{|x|}\to A,\qquad
j_x(y)=A(y,x),\qquad j_x^*(y)=A(x,y).
$$


有 $j_y^*j_x=A(y,x)$，且 $Fj_x$ 正好是 $F$ 的第 $x$ 列。因此这些 principal maps 检测以 $A$ 为源的 distributors 是否相等。singleton 之间的 maps 就是底层 $\mathcal R$ 中的左伴随箭头，下称底层 maps。

::: {.lemma #lem-kappa-idempotent}
如果 $K(\mathcal R)$ 笛卡尔闭，则对任意 $t,q$，都有 $\kappa_t(q)^2=\kappa_t(q)$。
:::

::: {.proof #proof-kappa-idempotent}
固定 $t,q$，简记


$$
u=\top_{t,q},\qquad k=u^\circ u=\kappa_t(q),\qquad c=k^2.
$$


$k,c$ 都对称，且 $c\le k\le1_t$。只需证明 $k\le c$。

**先看共同定义域上的 maps。** 若 $a:s\to t$、$b:s\to q$ 是底层 maps，则 $b^*b=1_s$：一边来自 adjunction unit，另一边来自 integrality。于是


$$
aa^*=a(b^*b)a^*=(ab^*)(ba^*)
\le\top_{q,t}\top_{t,q}=k.
$$


由三角恒等式 $aa^*a=a$ 及 $k\le1_t$ 得


$$
ka=a,\qquad ca=a.\tag{1}
$$


这里始终使用实际的右伴随。

**用指数对象连接两个点。** 令 $Y=S_t$，取两个类型均为 $t$ 的点构成


$$
Z=\begin{pmatrix}1_t&amp;c\\c&amp;1_t\end{pmatrix},
$$


其 principal maps 记为 $x,x':S_t\to Z$。由 $c=c^\circ\le1_t$ 可知 $Z$ 是对称范畴；这里并不需要 $c$ 幂等。

对 $r=t,q$，取 $K(\mathcal R)$ 中真正的范畴乘积 $P_r=S_r\times Y$，第二投影记为 $\rho_r$。我们有


$$
x\rho_q=x'\rho_q.\tag{2}
$$


事实上，$P_q$ 的任一 principal map $w:S_s\to P_q$ 经两个投影给出底层 maps $b:s\to q$、$a=\rho_qw:s\to t$。$xa$ 的两项是 $a,ca$，$x'a$ 的两项是 $ca,a$，由 (1) 相等。再用 principal maps 检测相等性，就得到 (2)。这一步没有假设乘积的 enriched 矩阵公式。

取指数对象 $E=Z^Y$。将


$$
x\rho_t,\ x'\rho_t:S_t\times Y\to Z,
\qquad x\rho_q=x'\rho_q:S_q\times Y\to Z
$$


分别转置为


$$
f,h:S_t\to E,\qquad g:S_q\to E.
$$


再取两点对称范畴


$$
A=\begin{pmatrix}1_t&amp;u^\circ\\u&amp;1_q\end{pmatrix},
$$


其 principal maps 为 $i:S_t\to A$、$j:S_q\to A$。integrality 保证这个矩阵确实满足传递性。将 $x\pi_Y,x'\pi_Y:A\times Y\to Z$ 转置，得到 $U,V:A\to E$。转置的自然性和 (2) 给出


$$
Ui=f,\quad Uj=g,\qquad Vi=h,\quad Vj=g.
$$


因此两条 adjunction unit $A\le U^*U$、$A\le V^*V$ 蕴涵


$$
u\le g^*f,\quad u\le g^*h,
\qquad u^\circ\le f^*g,\quad u^\circ\le h^*g.
$$


结合 $gg^*\le E$，得到


$$
k\le h^*gg^*f\le h^*f,
\qquad k\le f^*gg^*h\le f^*h.\tag{3}
$$



**把两个转置组装成一个 map。** 令


$$
D=\begin{pmatrix}1_t&amp;k\\k&amp;1_t\end{pmatrix},\qquad
M=\begin{pmatrix}f&amp;h\end{pmatrix},\qquad
N=\begin{pmatrix}f^*\\h^*\end{pmatrix}.
$$


$D$ 同样是对称范畴。由 $f,h$ 的 units 和 (3)，有 $D\le NM$；由它们的 counits，有 $MN=ff^*\vee hh^*\le E$。

还要检查 $M,N$ 确实是 distributors。它们的 $E$-action 逐列、逐行成立；另外


$$
MD\le MNM\le EM=M,\qquad
DN\le NMN\le NE=N.
$$


由 $D$ 的 reflexivity 得到反向不等式。因此 $M:D\to E$、$N:E\to D$ 是 distributors，且 $M\dashv N$。

**最后代入 evaluation。** 从 $D$ 到 $Y=S_t$ 的常值保类型函子诱导 map $\delta:D\to Y$。若 $d_0,d_1:S_t\to D$ 是两个 principal maps，则


$$
Md_0=f,\quad Md_1=h,\qquad
\delta d_0=1_Y=\delta d_1.
$$


利用真正乘积的配对，定义


$$
T=\operatorname{ev}\langle M,\delta\rangle:D\to Z.
$$



```tikz
\usepackage{amsmath}
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}
D && E\times Y \\
&& Z
\arrow["{\langle M,\delta\rangle}", from=1-1, to=1-3]
\arrow["{\operatorname{ev}}", from=1-3, to=2-3]
\arrow["T", swap, from=1-1, to=2-3]
\end{tikzcd}
\end{document}
```

令 $\Delta:S_t\to S_t\times Y$ 为对角 map。转置定义给出


$$
Td_0=\operatorname{ev}\langle f,1_Y\rangle=x\rho_t\Delta=x,
\qquad
Td_1=\operatorname{ev}\langle h,1_Y\rangle=x'\rho_t\Delta=x'.
$$


于是把 $T$ 的 unit 限制到两个 principal maps 上，得到


$$
k=d_1^*d_0
\le d_1^*T^*Td_0
=(Td_1)^*(Td_0)
=x'^*x=c=k^2.
$$


结合 $k^2\le k$，[](#pre:lem-kappa-idempotent)得证。
:::

整个证明只用了有限乘积、一个指数对象 $Z^{S_t}$ 和几个有限对称范畴。因此只要有限乘积存在，且每个 singleton 都 exponentiable，也足以推出所有 $\kappa_t(q)$ 幂等；无需任何 pushout 假设。

## 从 κ 到标量判别与 weak tabularity { #从-κ-到标量判别与-weak-tabularity }

现在回到 $D_*Q$。先记下对任意 $p$ 都成立的恒等式


$$
p(p\to p)=p.\tag{4}
$$


一边来自 residuation，另一边来自 $e\le p\to p$。

假设 $K_*(Q)$ 笛卡尔闭，取 $d\le p$ 且 $p(p\to d)=d$。标量 $d$ 是 $p\to d$ 和 $d\to p$ 两个方向上的箭头；由有界性，它还是这两个 hom 的最大元。因此


$$
\kappa_p(d)=\top_{d,p}\circ_d\top_{p,d}
=d(d\to d)=d.
$$


这个等式把 $d$ 看成 $p$ 上的 endomorphism。[](#pre:lem-kappa-idempotent)说明它在 $p$ 上幂等，于是


$$
d=\kappa_p(d)\circ_p\kappa_p(d)=d(p\to d).
$$


这就证明了 (RI)。注意，计算 $\kappa_p(d)$ 时经过对象 $d$，计算它的平方时经过对象 $p$。

接着证明 (RI) 恰好等价于 weak tabularity。回忆 (WT) 的定义：每条箭头 $v:p\to q$ 都满足


$$
v=\bigvee\{ba^*\mid a:r\to p,\ b:r\to q\text{ 是底层 maps},\ ba^*\le v\}.\tag{WT}
$$


为把这个条件化成标量，先确定 $D_*Q$ 的底层 maps。

::: {.lemma #lem-bounded-base-maps}
$D_*Q$ 中从 $r$ 到 $p$ 至多有一个 map。如果存在，它和实际右伴随的标量值都为 $r$；存在的充要条件是
$r\le p$、$p(p\to r)=r$、$r(p\to r)=r$。
:::

::: {.proof #proof-bounded-base-maps}
设 $f:r\to p$ 左伴随于 $g:p\to r$。unit 给出


$$
r\le g\circ_p f=(p\to g)f\le(p\to p)f=f\le r.
$$


中间的等号用到了 $f=p(p\to f)$ 和 (4)，故 $f=r$。同样，利用复合的另一种写法，


$$
r\le g(p\to f)\le g(p\to p)=g\le r,
$$


故 $g=r$。反过来，前两个条件保证标量 $r$ 是两个方向上的箭头；第三个条件给出 unit，而 counit 是 $r(r\to r)=r\le p$，引理得证。
:::

::: {.proof #proof-bounded-wt-to-ri}
[**(WT) 推出 (RI)。**]{.proof-direction} 给定 $d:p\to p$，(WT) 将它写成 map-spans $p\xleftarrow{a_i}r_i\xrightarrow{b_i}p$ 的复合之并。由 [](#pre:lem-bounded-base-maps)，$a_i,b_i,a_i^*$ 的标量都是 $r_i$，所以


$$
b_i\circ_{r_i}a_i^*=r_i(r_i\to r_i)=r_i,
\qquad r_i\circ_p r_i=r_i(p\to r_i)=r_i.
$$


于是 $d=\bigvee_i r_i$，且


$$
d\circ_p d
=\bigvee_{i,j}(r_i\circ_p r_j)
\ge\bigvee_i(r_i\circ_p r_i)
=d.
$$


integrality 给出反向不等式，故 $d\circ_p d=d$，也就是 (RI)。这个论证也包括空并。
:::

::: {.proof #proof-bounded-ri-to-wt}
[**(RI) 推出 (WT)。**]{.proof-direction} 若 $d:p\to q$，则在两个端点应用 (RI)，得到


$$
d(p\to d)=d=d(q\to d).
$$


由 [](#pre:lem-bounded-base-maps)，存在标量都为 $d$ 的底层 maps $a:d\to p$、$b:d\to q$，且


$$
b\circ_d a^*=d(d\to d)=d.
$$


因此每条箭头甚至由单个 map-span 表示，当然满足 (WT)。
:::

::: {.proof #proof-bounded-scalar-equivalence}
最后，(RI) 与 [](#pre:thm-bounded-ccc-topos)中的标量恒等式等价。对 $x\le p$，令 $d=p(p\to x)$。由 residuation，$d\le x\le p$，并且


$$
p\to d=p\to x:
$$


一边来自 $d\le x$，另一边来自 $p(p\to x)=d$。所以 $p(p\to d)=d$，对 $d$ 应用 (RI) 正好得到


$$
p(p\to x)^2=p(p\to x).
$$


反之，对满足 $d\le p$、$p(p\to d)=d$ 的 $d$，在这个恒等式中取 $x=d$，便得到 (RI)。
:::

至此，笛卡尔闭性推出 (RI)，而 (RI)、(WT) 与标量恒等式彼此等价。因为 $D_*Q$ integral，[上一篇的定理](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)把 (WT) 等价地识别为 elementary topos，并进一步给出 localic Grothendieck topos。每个 Grothendieck topos 都是 elementary topos，每个 elementary topos 都笛卡尔闭，主定理的各条件于是全部等价。

## Integral 情形 { #Integral-情形 }

若 $Q$ 本身 integral，即 $e=\top$，则 divisibility 方程自动蕴涵 $d\le p\wedge q$，所以 $DQ=D_*Q$；这里不需要假设 $Q$ divisible。

在 [](#pre:thm-bounded-ccc-topos)的标量恒等式中取 $p=e$，由 $e\to x=x$ 得到 $x^2=x$。integrality 给出 $ab\le a\wedge b$；另一方面，若 $z\le a,b$，则


$$
z=z^2\le ab.
$$


所以乘法正好是 meet。乘法保持任意 join，便说明 $Q$ 是 frame quantale。反之，frame quantale 对 $d\le p$ 满足


$$
p\wedge(p\to d)=d,
\qquad d\wedge(p\to d)=d,
$$


因而满足 (RI)。因此在任意交换 integral quantale 上，


$$
K(DQ)\text{ 笛卡尔闭}
\quad\Longleftrightarrow\quad K(DQ)\text{ 是 topos}
\quad\Longleftrightarrow\quad Q\text{ 是 frame quantale}.
$$


对非整 $Q$，则保留主定理的相对幂等条件 $p(p\to x)^2=p(p\to x)$，并始终使用有界的 $D_*Q$。

{% raw %}
<style>
.article .content .quantaloid-equation { overflow-x: auto; overflow-y: hidden; max-width: 100%; padding: .4em 0; }
.article .content .tikzjax { max-width: 100%; overflow-x: auto; }
</style>
{% endraw %}
