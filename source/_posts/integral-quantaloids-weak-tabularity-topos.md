---
title: Integral quantaloid 的 weak tabularity 与 topos
date: '2026-10-03 08:00:00'
categories: [范畴论]
tags: [Quantaloid, Topos]
toc: true
tikzjax: true
engine: statement
plugins:
  mathjax: true
ai:
  level: generated
  note: 本文由 Noema 根据我的手稿协助整理。
---

本文的出发点是 $Q$-Set 何时构成 topos 的问题。胡晓与申力立在 [*Q-Set is not generally a topos*](https://doi.org/10.1016/j.fss.2025.109484)（Theorem 5.6）中证明：对 commutative、unital、divisible quantale $Q$，$Q$-Set 是 topos 当且仅当 $Q$ 的乘法就是 meet，即 $Q$ 是 frame quantale。用 enriched category 的语言，所讨论的范畴正是 $K(DQ)$。

把底层从 $DQ$ 换成一般的 small integral involutive quantaloid $\mathcal Q$，仍然可以得到一个简洁的答案：$K(\mathcal Q)$ 是 topos 当且仅当 $\mathcal Q$ weakly tabular。下面记录这个刻画的证明。充分性接到已有的 sheaf representation theorem，必要性则来自 topos 中子对象并的有效性；最后再回到 $DQ$ 看原来的问题。

<!--more-->

## 定理与约定 { #定理与约定 }

::: {.definition #def-integral-weak-tabularity}
全文设 $\mathcal Q$ 是一个 small integral involutive quantaloid，其中 integral 指 $1_p=\top_{p,p}$。记 involution 为 $(-)^\circ$，实际的右伴随为 $(-)^*$，复合 $g\circ f$ 简写为 $gf$。我们考虑


$$
K(\mathcal Q)=\operatorname{Map}(\operatorname{SymDist}(\mathcal Q)),
$$


对象是所有小的对称 $\mathcal Q$-范畴，态射是它们之间所有左伴随 distributor；这里不预先要求右伴随等于 involution。

一个底层箭头 $a:s\to p$ 称为 **map**，如果 $a\dashv a^*$。称 $\mathcal Q$ **weakly tabular**，如果每个 $f:p\to q$ 都满足


$$
f=\bigvee\{ba^*\mid a:s\to p,\ b:s\to q\text{ 是 maps},\ ba^*\le f\}.\tag{WT}
$$


也就是说，每条箭头都由它下面的 map-spans 生成。
:::

::: {.theorem #thm-integral-weak-tabularity-topos}
对 small integral involutive quantaloid $\mathcal Q$，$K(\mathcal Q)$ 是 elementary topos 当且仅当 $\mathcal Q$ weakly tabular。此时 $K(\mathcal Q)$ 自动等价于一个 localic Grothendieck topos。
:::

::: {.lemma #lem-integral-base-maps}
先记下一个贯穿证明的事实：每个底层 map 都满足


$$
a^*a=1_s,\qquad a^*=a^\circ,\qquad a=\top_{s,p}.
$$


:::

::: {.proof #proof-integral-base-maps}
[](#pre:lem-integral-base-maps)的第一个等式来自 integrality。若 $a,b:s\to p$ 都是 maps，则 $a=ab^*b\le b$，对调即得 $a=b$。对 $a\dashv a^*$ 取 involution，$(a^*)^\circ$ 也是同类型的 map，故 $a^*=a^\circ$。最后，任意 $h:s\to p$ 都有 $h=ha^\circ a\le a$。因此 (WT) 中也可把 $a^*$ 写成 $a^\circ$。
:::

## 从 weak tabularity 到 topos { #从-weak-tabularity-到-topos }

::: {.proof #proof-integral-wt-sufficiency}
假设 (WT)。每个 span 项 $r=ba^\circ$ 满足 $rr^\circ r=r$，于是对任意 $f$，


$$
f=\bigvee_{r\le f}r\le ff^\circ f\le f,
\qquad\text{即}\qquad f=ff^\circ f.\tag{1}
$$


最后一个不等式用了 $ff^\circ\le 1$。这条正则性等式已经给出所需的代数结构。

对 endomorphism $e:p\to p$，由 $e\le1_p$ 和 (1) 得 $e\le e^\circ$，取 involution 得到 $e=e^\circ$，进而 $e=e^3\le e^2\le e$。所以每个 endomorphism 都是对称幂等元，而且 endohom 上的复合就是 meet：$xy\le x\wedge y$，反之若 $z\le x,y$，则 $z=z^2\le xy$。复合保持任意并，故每个 endohom 都是 frame。

mixed hom 也一样。令 $u=\top_{p,q}$、$e=u^\circ u$，则


$$
\mathcal Q(p,q)\cong\mathord\downarrow e\subseteq\mathcal Q(p,p),
\qquad f\longmapsto u^\circ f,\quad a\longmapsto ua.
$$


这两个映射互逆，因为 $u^\circ ua=ea=a$，而 $f=ff^\circ f\le uu^\circ f\le f$。frame 的主理想仍是 frame，所以 $\mathcal Q$ locally localic。

再令 $x=gf\wedge h$。有 $xx^\circ\le gg^\circ$，故由 (1) 及 integrality，$x=gg^\circ x$；又有 $g^\circ x\le f\wedge g^\circ h$，从而


$$
gf\wedge h\le g(f\wedge g^\circ h).
$$


这正是 modular law。

现在应用 Heymans–Stubbe 的两个结果：[closed-cribles characterization](https://arxiv.org/abs/1012.3870)（Theorem 4.3）指出，locally localic、map-discrete、weakly tabular、weakly modular 的小 quantaloid 恰好是 closed cribles 的 quantaloid。上面已证明 locally localic 与 modular；modularity 给出另外所需的 map-discreteness 和 weak modularity（同文 Lemma 3.3）。其 canonical involution 将 $ba^*$ 送到 $ab^*$，由 (WT) 可知它与给定的 involution 一致。

因此存在小 site $(\mathcal C,J)$，使 $\mathcal Q\simeq\mathcal R(\mathcal C,J)$。再由 [sheaf representation theorem](https://arxiv.org/html/1206.5975v1)（Theorem 3.14），


$$
\operatorname{SymDist}(\mathcal Q)\simeq
\operatorname{Rel}(\operatorname{Sh}(\mathcal C,J)).
$$


右侧的 maps 恰好是 sheaf morphisms 的图，取 maps 便得 $K(\mathcal Q)\simeq\operatorname{Sh}(\mathcal C,J)$。
:::

## 从 topos 恢复每条箭头 { #从-topos-恢复每条箭头 }

::: {.proof #proof-integral-wt-necessity}
反过来，假设 $K(\mathcal Q)$ 是 elementary topos。记类型为 $p$ 的 singleton 为 $S_p$。它是 subterminal：若 $F:X\to S_p$ 有右伴随 $G$，unit 和 counit 逐分量给出


$$
1_{|x|}\le G_xF_x,\qquad F_xG_x\le1_p.
$$


每个 $F_x$ 因而是底层 map，由类型唯一决定，所以 $X\to S_p$ 至多有一个。

另一方面，对称 $X$ 的 representables $j_x:S_{|x|}\to X$ 是 maps（由单点函子的 graph/cograph 给出伴随），而且 jointly epic。采用 $X(x,y):|x|\to|y|$ 的约定，$j_x(y)=X(x,y)$；distributor action 与 $X(x,x)=1_{|x|}$ 给出 $(Fj_x)(y)=F(x,y)$，故在所有 $j_x$ 上相同就意味着逐分量相同。特别地，$(S_p)_{p\in\mathcal Q_0}$ 是一个小的 separating family。

这里要用 topos 的 **effective binary unions**：如果 $i:A\to X$、$j:B\to X$ 是 jointly epic 的两个 monos，那么它们的 pullback 方块同时也是 pushout。换句话说，两个子对象的并是沿交集粘起来的。这个性质可由 topos 的 regularity 和 extensivity 得到：$[i,j]:A+B\to X$ 是其 kernel pair 的 coequalizer，而 kernel pair 分解成两个对角块与两个交集块。

固定 $f:p\to q$，取两个不同的点，类型分别为 $p,q$，定义对称 $\mathcal Q$-范畴 $P_f$，其 hom 矩阵为


$$
B_f=\begin{pmatrix}1_p&amp;f^\circ\\ f&amp;1_q\end{pmatrix}.
$$


矩阵采用 target row、source column 的约定。integrality 保证 $B_f^2=B_f$。两个 representables $i_p:S_p\to P_f$、$i_q:S_q\to P_f$ jointly epic；因为定义域 subterminal，它们也都是 monos。

对底层 maps $a:s\to p$、$b:s\to q$，关键观察是


$$
i_pa=i_qb\quad\Longleftrightarrow\quad ba^\circ\le f.\tag{2}
$$


左边逐分量就是 $a=f^\circ b$、$fa=b$，故推出 $ba^\circ=faa^\circ\le f$。反之，若 $ba^\circ\le f$，则 $b=ba^\circ a\le fa\le b$；最后一步用 $b=\top_{s,q}$。取 involution 后同理得到 $a=f^\circ b$。

令


$$
w=\bigvee\{ba^\circ\mid a:s\to p,\ b:s\to q\text{ 是底层 maps},\ ba^\circ\le f\}.
$$


显然 $w\le f$。将 $P_w$ 的两个 representables 记为 $k_p,k_q$。由 (2) 和 $w$ 的定义，


$$
i_pa=i_qb\quad\Longleftrightarrow\quad k_pa=k_qb.\tag{3}
$$


取 pullback $U=S_p\times_{P_f}S_q$。effective union 告诉我们下图也是 pushout：

```tikz
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}
U && S_q \\
\\
S_p && P_f
\arrow["t", from=1-1, to=1-3]
\arrow["r", swap, from=1-1, to=3-1]
\arrow["i_q", from=1-3, to=3-3]
\arrow["i_p", swap, from=3-1, to=3-3]
\end{tikzcd}
\end{document}
```

对 $U$ 的每个 representable $j_z:S_{|z|}\to U$，复合 $a=rj_z$、$b=tj_z$ 是 singleton 之间的 maps，也就是底层 maps。由 $i_pa=i_qb$ 及 (3)，得到 $k_prj_z=k_qtj_z$。representables jointly epic，故 $k_pr=k_qt$。于是 pushout 给出


$$
v:P_f\to P_w,\qquad vi_p=k_p,\quad vi_q=k_q.
$$


而 $w\le f$ 定义了 identity-on-objects 的 enriched functor $P_w\to P_f$，其 graph distributor $u:P_w\to P_f$ 满足 $uk_p=i_p$、$uk_q=i_q$。分别用两组 representables 的 joint epimorphy，便得 $uv=1_{P_f}$、$vu=1_{P_w}$。

最后还需从这个指定的同构恢复 $f=w$。$u$ 和它的 cograph right adjoint $u^*:P_f\to P_w$，虽然源、靶不同，但其标量矩阵都是 $B_f$。因此


$$
u^*u=B_f^2=B_f.
$$


又因为 $v=u^{-1}$，它也是 $u$ 的右伴随；右伴随唯一，所以 $u^*=v$，进而 $u^*u=1_{P_w}=B_w$。比较非对角项得到 $f=w$，即 (WT)。
:::

[](#pre:thm-integral-weak-tabularity-topos)的两方向证明完毕。充分性已给出 Grothendieck topos，而 singleton 构成小的 subterminal separating family，故由标准的 [localic 判据](https://arxiv.org/abs/1112.2542)（§3），它还是 localic 的。


最后回到 $Q$-Set。设 $(Q,\&amp;,1)$ 是 commutative integral quantale，不必预先假设 divisible。其 [diagonal quantaloid $DQ$](https://arxiv.org/abs/1801.05966)（Proposition 2.2）的箭头 $d:p\to q$ 满足


$$
(p\to d)\mathbin{\&amp;}p=d=q\mathbin{\&amp;}(q\to d),
$$


其中公式内的 $\to$ 是 residual；复合为 $e\diamond d=e\mathbin{\&amp;}(q\to d)$。它在对象 $p$ 上的 identity 是 $p$，所有 endomorphisms 都不超过 $p$，故 $DQ$ integral；交换性又给出保持标量值、反转方向的 involution。

关键是 $DQ(1,1)=Q$，且这个 endohom 的复合就是原乘法 $\&amp;$。若 $DQ$ weakly tabular，第二节已经证明每个 endohom 的复合都是 meet，立即得到 $a\mathbin{\&amp;}b=a\wedge b$；乘法保持任意并，所以 $Q$ 是 frame quantale。反之，若 $Q$ 是 frame quantale，则 $DQ(p,q)=\mathord\downarrow(p\wedge q)$，复合是 meet。每个 $d:p\to q$ 都由对象 $d$ 出发、两个值同为 $d$ 的 maps $a:d\to p$、$b:d\to q$ 给出 $d=ba^\circ$，所以 $DQ$ weakly tabular。因此


$$
K(DQ)\text{ 是 topos}
\quad\Longleftrightarrow\quad DQ\text{ weakly tabular}
\quad\Longleftrightarrow\quad (Q,\&amp;)\text{ 是 frame quantale}.
$$


这也恢复了开头的 Hu–Shen 结论：commutative unital divisible quantale 自动 integral（该文 Proposition 2.1）。

{% raw %}
<style>
.article .content .quantaloid-equation { overflow-x: auto; overflow-y: hidden; max-width: 100%; padding: .4em 0; }
.article .content .tikzjax { max-width: 100%; overflow-x: auto; }
</style>
{% endraw %}
