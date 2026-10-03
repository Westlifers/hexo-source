---
title: Integral quantaloid 的 weak tabularity 与 topos
date: '2026-10-03 08:00:00'
categories: [范畴论]
tags: [Quantaloid, Topos]
toc: true
tikzjax: true
plugins:
  mathjax: true
ai:
  level: generated
  note: 本文由 Noema 根据我的手稿协助整理。
---

本文的出发点是 {% raw %}<span>$Q$</span>{% endraw %}-Set 何时构成 topos 的问题。胡晓与申力立在 [*Q-Set is not generally a topos*](https://doi.org/10.1016/j.fss.2025.109484)（Theorem 5.6）中证明：对 commutative、unital、divisible quantale {% raw %}<span>$Q$</span>{% endraw %}，{% raw %}<span>$Q$</span>{% endraw %}-Set 是 topos 当且仅当 {% raw %}<span>$Q$</span>{% endraw %} 的乘法就是 meet，即 {% raw %}<span>$Q$</span>{% endraw %} 是 frame quantale。用 enriched category 的语言，所讨论的范畴正是 {% raw %}<span>$K(DQ)$</span>{% endraw %}。

把底层从 {% raw %}<span>$DQ$</span>{% endraw %} 换成一般的 small integral involutive quantaloid {% raw %}<span>$\mathcal Q$</span>{% endraw %}，仍然可以得到一个简洁的答案：{% raw %}<span>$K(\mathcal Q)$</span>{% endraw %} 是 topos 当且仅当 {% raw %}<span>$\mathcal Q$</span>{% endraw %} weakly tabular。下面记录这个刻画的证明。充分性接到已有的 sheaf representation theorem，必要性则来自 topos 中子对象并的有效性；最后再回到 {% raw %}<span>$DQ$</span>{% endraw %} 看原来的问题。

<!--more-->

## 定理与约定

全文设 {% raw %}<span>$\mathcal Q$</span>{% endraw %} 是一个 small integral involutive quantaloid，其中 integral 指 {% raw %}<span>$1_p=\top_{p,p}$</span>{% endraw %}。记 involution 为 {% raw %}<span>$(-)^\circ$</span>{% endraw %}，实际的右伴随为 {% raw %}<span>$(-)^*$</span>{% endraw %}，复合 {% raw %}<span>$g\circ f$</span>{% endraw %} 简写为 {% raw %}<span>$gf$</span>{% endraw %}。我们考虑
{% raw %}<div class="quantaloid-equation">$$
K(\mathcal Q)=\operatorname{Map}(\operatorname{SymDist}(\mathcal Q)),
$$</div>{% endraw %}
对象是所有小的对称 {% raw %}<span>$\mathcal Q$</span>{% endraw %}-范畴，态射是它们之间所有左伴随 distributor；这里不预先要求右伴随等于 involution。

一个底层箭头 {% raw %}<span>$a:s\to p$</span>{% endraw %} 称为 **map**，如果 {% raw %}<span>$a\dashv a^*$</span>{% endraw %}。称 {% raw %}<span>$\mathcal Q$</span>{% endraw %} **weakly tabular**，如果每个 {% raw %}<span>$f:p\to q$</span>{% endraw %} 都满足
{% raw %}<div class="quantaloid-equation">$$
f=\bigvee\{ba^*\mid a:s\to p,\ b:s\to q\text{ 是 maps},\ ba^*\le f\}.\tag{WT}
$$</div>{% endraw %}
也就是说，每条箭头都由它下面的 map-spans 生成。

> **定理.** 对 small integral involutive quantaloid {% raw %}<span>$\mathcal Q$</span>{% endraw %}，{% raw %}<span>$K(\mathcal Q)$</span>{% endraw %} 是 elementary topos 当且仅当 {% raw %}<span>$\mathcal Q$</span>{% endraw %} weakly tabular。此时 {% raw %}<span>$K(\mathcal Q)$</span>{% endraw %} 自动等价于一个 localic Grothendieck topos。

先记下一个贯穿证明的事实：每个底层 map 都满足
{% raw %}<div class="quantaloid-equation">$$
a^*a=1_s,\qquad a^*=a^\circ,\qquad a=\top_{s,p}.
$$</div>{% endraw %}
第一个等式来自 integrality。若 {% raw %}<span>$a,b:s\to p$</span>{% endraw %} 都是 maps，则 {% raw %}<span>$a=ab^*b\le b$</span>{% endraw %}，对调即得 {% raw %}<span>$a=b$</span>{% endraw %}。对 {% raw %}<span>$a\dashv a^*$</span>{% endraw %} 取 involution，{% raw %}<span>$(a^*)^\circ$</span>{% endraw %} 也是同类型的 map，故 {% raw %}<span>$a^*=a^\circ$</span>{% endraw %}。最后，任意 {% raw %}<span>$h:s\to p$</span>{% endraw %} 都有 {% raw %}<span>$h=ha^\circ a\le a$</span>{% endraw %}。因此 (WT) 中也可把 {% raw %}<span>$a^*$</span>{% endraw %} 写成 {% raw %}<span>$a^\circ$</span>{% endraw %}。

## 从 weak tabularity 到 topos

假设 (WT)。每个 span 项 {% raw %}<span>$r=ba^\circ$</span>{% endraw %} 满足 {% raw %}<span>$rr^\circ r=r$</span>{% endraw %}，于是对任意 {% raw %}<span>$f$</span>{% endraw %}，
{% raw %}<div class="quantaloid-equation">$$
f=\bigvee_{r\le f}r\le ff^\circ f\le f,
\qquad\text{即}\qquad f=ff^\circ f.\tag{1}
$$</div>{% endraw %}
最后一个不等式用了 {% raw %}<span>$ff^\circ\le 1$</span>{% endraw %}。这条正则性等式已经给出所需的代数结构。

对 endomorphism {% raw %}<span>$e:p\to p$</span>{% endraw %}，由 {% raw %}<span>$e\le1_p$</span>{% endraw %} 和 (1) 得 {% raw %}<span>$e\le e^\circ$</span>{% endraw %}，取 involution 得到 {% raw %}<span>$e=e^\circ$</span>{% endraw %}，进而 {% raw %}<span>$e=e^3\le e^2\le e$</span>{% endraw %}。所以每个 endomorphism 都是对称幂等元，而且 endohom 上的复合就是 meet：{% raw %}<span>$xy\le x\wedge y$</span>{% endraw %}，反之若 {% raw %}<span>$z\le x,y$</span>{% endraw %}，则 {% raw %}<span>$z=z^2\le xy$</span>{% endraw %}。复合保持任意并，故每个 endohom 都是 frame。

mixed hom 也一样。令 {% raw %}<span>$u=\top_{p,q}$</span>{% endraw %}、{% raw %}<span>$e=u^\circ u$</span>{% endraw %}，则
{% raw %}<div class="quantaloid-equation">$$
\mathcal Q(p,q)\cong\mathord\downarrow e\subseteq\mathcal Q(p,p),
\qquad f\longmapsto u^\circ f,\quad a\longmapsto ua.
$$</div>{% endraw %}
这两个映射互逆，因为 {% raw %}<span>$u^\circ ua=ea=a$</span>{% endraw %}，而 {% raw %}<span>$f=ff^\circ f\le uu^\circ f\le f$</span>{% endraw %}。frame 的主理想仍是 frame，所以 {% raw %}<span>$\mathcal Q$</span>{% endraw %} locally localic。

再令 {% raw %}<span>$x=gf\wedge h$</span>{% endraw %}。有 {% raw %}<span>$xx^\circ\le gg^\circ$</span>{% endraw %}，故由 (1) 及 integrality，{% raw %}<span>$x=gg^\circ x$</span>{% endraw %}；又有 {% raw %}<span>$g^\circ x\le f\wedge g^\circ h$</span>{% endraw %}，从而
{% raw %}<div class="quantaloid-equation">$$
gf\wedge h\le g(f\wedge g^\circ h).
$$</div>{% endraw %}
这正是 modular law。

现在应用 Heymans–Stubbe 的两个结果：[closed-cribles characterization](https://arxiv.org/abs/1012.3870)（Theorem 4.3）指出，locally localic、map-discrete、weakly tabular、weakly modular 的小 quantaloid 恰好是 closed cribles 的 quantaloid。上面已证明 locally localic 与 modular；modularity 给出另外所需的 map-discreteness 和 weak modularity（同文 Lemma 3.3）。其 canonical involution 将 {% raw %}<span>$ba^*$</span>{% endraw %} 送到 {% raw %}<span>$ab^*$</span>{% endraw %}，由 (WT) 可知它与给定的 involution 一致。

因此存在小 site {% raw %}<span>$(\mathcal C,J)$</span>{% endraw %}，使 {% raw %}<span>$\mathcal Q\simeq\mathcal R(\mathcal C,J)$</span>{% endraw %}。再由 [sheaf representation theorem](https://arxiv.org/html/1206.5975v1)（Theorem 3.14），
{% raw %}<div class="quantaloid-equation">$$
\operatorname{SymDist}(\mathcal Q)\simeq
\operatorname{Rel}(\operatorname{Sh}(\mathcal C,J)).
$$</div>{% endraw %}
右侧的 maps 恰好是 sheaf morphisms 的图，取 maps 便得 {% raw %}<span>$K(\mathcal Q)\simeq\operatorname{Sh}(\mathcal C,J)$</span>{% endraw %}。

## 从 topos 恢复每条箭头

反过来，假设 {% raw %}<span>$K(\mathcal Q)$</span>{% endraw %} 是 elementary topos。记类型为 {% raw %}<span>$p$</span>{% endraw %} 的 singleton 为 {% raw %}<span>$S_p$</span>{% endraw %}。它是 subterminal：若 {% raw %}<span>$F:X\to S_p$</span>{% endraw %} 有右伴随 {% raw %}<span>$G$</span>{% endraw %}，unit 和 counit 逐分量给出
{% raw %}<div class="quantaloid-equation">$$
1_{|x|}\le G_xF_x,\qquad F_xG_x\le1_p.
$$</div>{% endraw %}
每个 {% raw %}<span>$F_x$</span>{% endraw %} 因而是底层 map，由类型唯一决定，所以 {% raw %}<span>$X\to S_p$</span>{% endraw %} 至多有一个。

另一方面，对称 {% raw %}<span>$X$</span>{% endraw %} 的 representables {% raw %}<span>$j_x:S_{|x|}\to X$</span>{% endraw %} 是 maps（由单点函子的 graph/cograph 给出伴随），而且 jointly epic。采用 {% raw %}<span>$X(x,y):|x|\to|y|$</span>{% endraw %} 的约定，{% raw %}<span>$j_x(y)=X(x,y)$</span>{% endraw %}；distributor action 与 {% raw %}<span>$X(x,x)=1_{|x|}$</span>{% endraw %} 给出 {% raw %}<span>$(Fj_x)(y)=F(x,y)$</span>{% endraw %}，故在所有 {% raw %}<span>$j_x$</span>{% endraw %} 上相同就意味着逐分量相同。特别地，{% raw %}<span>$(S_p)_{p\in\mathcal Q_0}$</span>{% endraw %} 是一个小的 separating family。

这里要用 topos 的 **effective binary unions**：如果 {% raw %}<span>$i:A\to X$</span>{% endraw %}、{% raw %}<span>$j:B\to X$</span>{% endraw %} 是 jointly epic 的两个 monos，那么它们的 pullback 方块同时也是 pushout。换句话说，两个子对象的并是沿交集粘起来的。这个性质可由 topos 的 regularity 和 extensivity 得到：{% raw %}<span>$[i,j]:A+B\to X$</span>{% endraw %} 是其 kernel pair 的 coequalizer，而 kernel pair 分解成两个对角块与两个交集块。

固定 {% raw %}<span>$f:p\to q$</span>{% endraw %}，取两个不同的点，类型分别为 {% raw %}<span>$p,q$</span>{% endraw %}，定义对称 {% raw %}<span>$\mathcal Q$</span>{% endraw %}-范畴 {% raw %}<span>$P_f$</span>{% endraw %}，其 hom 矩阵为
{% raw %}<div class="quantaloid-equation">$$
B_f=\begin{pmatrix}1_p&amp;f^\circ\\ f&amp;1_q\end{pmatrix}.
$$</div>{% endraw %}
矩阵采用 target row、source column 的约定。integrality 保证 {% raw %}<span>$B_f^2=B_f$</span>{% endraw %}。两个 representables {% raw %}<span>$i_p:S_p\to P_f$</span>{% endraw %}、{% raw %}<span>$i_q:S_q\to P_f$</span>{% endraw %} jointly epic；因为定义域 subterminal，它们也都是 monos。

对底层 maps {% raw %}<span>$a:s\to p$</span>{% endraw %}、{% raw %}<span>$b:s\to q$</span>{% endraw %}，关键观察是
{% raw %}<div class="quantaloid-equation">$$
i_pa=i_qb\quad\Longleftrightarrow\quad ba^\circ\le f.\tag{2}
$$</div>{% endraw %}
左边逐分量就是 {% raw %}<span>$a=f^\circ b$</span>{% endraw %}、{% raw %}<span>$fa=b$</span>{% endraw %}，故推出 {% raw %}<span>$ba^\circ=faa^\circ\le f$</span>{% endraw %}。反之，若 {% raw %}<span>$ba^\circ\le f$</span>{% endraw %}，则 {% raw %}<span>$b=ba^\circ a\le fa\le b$</span>{% endraw %}；最后一步用 {% raw %}<span>$b=\top_{s,q}$</span>{% endraw %}。取 involution 后同理得到 {% raw %}<span>$a=f^\circ b$</span>{% endraw %}。

令
{% raw %}<div class="quantaloid-equation">$$
w=\bigvee\{ba^\circ\mid a:s\to p,\ b:s\to q\text{ 是底层 maps},\ ba^\circ\le f\}.
$$</div>{% endraw %}
显然 {% raw %}<span>$w\le f$</span>{% endraw %}。将 {% raw %}<span>$P_w$</span>{% endraw %} 的两个 representables 记为 {% raw %}<span>$k_p,k_q$</span>{% endraw %}。由 (2) 和 {% raw %}<span>$w$</span>{% endraw %} 的定义，
{% raw %}<div class="quantaloid-equation">$$
i_pa=i_qb\quad\Longleftrightarrow\quad k_pa=k_qb.\tag{3}
$$</div>{% endraw %}
取 pullback {% raw %}<span>$U=S_p\times_{P_f}S_q$</span>{% endraw %}。effective union 告诉我们下图也是 pushout：

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

对 {% raw %}<span>$U$</span>{% endraw %} 的每个 representable {% raw %}<span>$j_z:S_{|z|}\to U$</span>{% endraw %}，复合 {% raw %}<span>$a=rj_z$</span>{% endraw %}、{% raw %}<span>$b=tj_z$</span>{% endraw %} 是 singleton 之间的 maps，也就是底层 maps。由 {% raw %}<span>$i_pa=i_qb$</span>{% endraw %} 及 (3)，得到 {% raw %}<span>$k_prj_z=k_qtj_z$</span>{% endraw %}。representables jointly epic，故 {% raw %}<span>$k_pr=k_qt$</span>{% endraw %}。于是 pushout 给出
{% raw %}<div class="quantaloid-equation">$$
v:P_f\to P_w,\qquad vi_p=k_p,\quad vi_q=k_q.
$$</div>{% endraw %}
而 {% raw %}<span>$w\le f$</span>{% endraw %} 定义了 identity-on-objects 的 enriched functor {% raw %}<span>$P_w\to P_f$</span>{% endraw %}，其 graph distributor {% raw %}<span>$u:P_w\to P_f$</span>{% endraw %} 满足 {% raw %}<span>$uk_p=i_p$</span>{% endraw %}、{% raw %}<span>$uk_q=i_q$</span>{% endraw %}。分别用两组 representables 的 joint epimorphy，便得 {% raw %}<span>$uv=1_{P_f}$</span>{% endraw %}、{% raw %}<span>$vu=1_{P_w}$</span>{% endraw %}。

最后还需从这个指定的同构恢复 {% raw %}<span>$f=w$</span>{% endraw %}。{% raw %}<span>$u$</span>{% endraw %} 和它的 cograph right adjoint {% raw %}<span>$u^*:P_f\to P_w$</span>{% endraw %}，虽然源、靶不同，但其标量矩阵都是 {% raw %}<span>$B_f$</span>{% endraw %}。因此
{% raw %}<div class="quantaloid-equation">$$
u^*u=B_f^2=B_f.
$$</div>{% endraw %}
又因为 {% raw %}<span>$v=u^{-1}$</span>{% endraw %}，它也是 {% raw %}<span>$u$</span>{% endraw %} 的右伴随；右伴随唯一，所以 {% raw %}<span>$u^*=v$</span>{% endraw %}，进而 {% raw %}<span>$u^*u=1_{P_w}=B_w$</span>{% endraw %}。比较非对角项得到 {% raw %}<span>$f=w$</span>{% endraw %}，即 (WT)。

两方向证明完毕。充分性已给出 Grothendieck topos，而 singleton 构成小的 subterminal separating family，故由标准的 [localic 判据](https://arxiv.org/abs/1112.2542)（§3），它还是 localic 的。


最后回到 {% raw %}<span>$Q$</span>{% endraw %}-Set。设 {% raw %}<span>$(Q,\&amp;,1)$</span>{% endraw %} 是 commutative integral quantale，不必预先假设 divisible。其 [diagonal quantaloid {% raw %}<span>$DQ$</span>{% endraw %}](https://arxiv.org/abs/1801.05966)（Proposition 2.2）的箭头 {% raw %}<span>$d:p\to q$</span>{% endraw %} 满足
{% raw %}<div class="quantaloid-equation">$$
(p\to d)\mathbin{\&amp;}p=d=q\mathbin{\&amp;}(q\to d),
$$</div>{% endraw %}
其中公式内的 {% raw %}<span>$\to$</span>{% endraw %} 是 residual；复合为 {% raw %}<span>$e\diamond d=e\mathbin{\&amp;}(q\to d)$</span>{% endraw %}。它在对象 {% raw %}<span>$p$</span>{% endraw %} 上的 identity 是 {% raw %}<span>$p$</span>{% endraw %}，所有 endomorphisms 都不超过 {% raw %}<span>$p$</span>{% endraw %}，故 {% raw %}<span>$DQ$</span>{% endraw %} integral；交换性又给出保持标量值、反转方向的 involution。

关键是 {% raw %}<span>$DQ(1,1)=Q$</span>{% endraw %}，且这个 endohom 的复合就是原乘法 {% raw %}<span>$\&amp;$</span>{% endraw %}。若 {% raw %}<span>$DQ$</span>{% endraw %} weakly tabular，第二节已经证明每个 endohom 的复合都是 meet，立即得到 {% raw %}<span>$a\mathbin{\&amp;}b=a\wedge b$</span>{% endraw %}；乘法保持任意并，所以 {% raw %}<span>$Q$</span>{% endraw %} 是 frame quantale。反之，若 {% raw %}<span>$Q$</span>{% endraw %} 是 frame quantale，则 {% raw %}<span>$DQ(p,q)=\mathord\downarrow(p\wedge q)$</span>{% endraw %}，复合是 meet。每个 {% raw %}<span>$d:p\to q$</span>{% endraw %} 都由对象 {% raw %}<span>$d$</span>{% endraw %} 出发、两个值同为 {% raw %}<span>$d$</span>{% endraw %} 的 maps {% raw %}<span>$a:d\to p$</span>{% endraw %}、{% raw %}<span>$b:d\to q$</span>{% endraw %} 给出 {% raw %}<span>$d=ba^\circ$</span>{% endraw %}，所以 {% raw %}<span>$DQ$</span>{% endraw %} weakly tabular。因此
{% raw %}<div class="quantaloid-equation">$$
K(DQ)\text{ 是 topos}
\quad\Longleftrightarrow\quad DQ\text{ weakly tabular}
\quad\Longleftrightarrow\quad (Q,\&amp;)\text{ 是 frame quantale}.
$$</div>{% endraw %}
这也恢复了开头的 Hu–Shen 结论：commutative unital divisible quantale 自动 integral（该文 Proposition 2.1）。

{% raw %}
<style>
.article .content .quantaloid-equation { overflow-x: auto; overflow-y: hidden; max-width: 100%; padding: .4em 0; }
.article .content .tikzjax { max-width: 100%; overflow-x: auto; }
</style>
{% endraw %}
