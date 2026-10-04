---
title: 有界 Q-valued sets 的笛卡尔闭性与 topos
date: '2026-10-04 23:00:00'
categories: [范畴论]
tags: [Quantaloid, Topos]
toc: true
tikzjax: true
plugins:
  mathjax: true
ai:
  level: generated
  note: 本文由 Noema 根据我与它共同讨论、整理的证明撰写。
---

[上一篇](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)证明了：对 small integral involutive quantaloid {% raw %}<span>$\mathcal R$</span>{% endraw %}，{% raw %}<span>$K(\mathcal R)$</span>{% endraw %} 是 topos 当且仅当 {% raw %}<span>$\mathcal R$</span>{% endraw %} weakly tabular。这次继续问：如果只假设笛卡尔闭，能推出多少？

对任意交换幺 quantale {% raw %}<span>$Q$</span>{% endraw %}，答案在有界相等度的版本中仍然很简洁。记 {% raw %}<span>$D_*Q$</span>{% endraw %} 为 bounded-diagonal quantaloid，{% raw %}<span>$K_*(Q)=K(D_*Q)$</span>{% endraw %}，则
{% raw %}<div class="quantaloid-equation">$$
K_*(Q)\text{ 笛卡尔闭}
\quad\Longleftrightarrow\quad K_*(Q)\text{ 是 topos}
\quad\Longleftrightarrow\quad
p(p\to x)^2=p(p\to x)\quad(x\le p).
$$</div>{% endraw %}
这里不要求 {% raw %}<span>$Q$</span>{% endraw %} integral 或 divisible。证明的关键是在一般 integral 底层上，从一个指数对象推出 {% raw %}<span>$\kappa_t(q)=\top_{q,t}\top_{t,q}$</span>{% endraw %} 的幂等性。

<!--more-->

## 有界相等度与主定理

设 {% raw %}<span>$Q$</span>{% endraw %} 是交换幺 quantale，乘法用并置表示，单位记为 {% raw %}<span>$e$</span>{% endraw %}，residual 由
{% raw %}<div class="quantaloid-equation">$$
pa\le b\quad\Longleftrightarrow\quad a\le p\to b
$$</div>{% endraw %}
确定。固定 {% raw %}<span>$Q$</span>{% endraw %} 的 involution 为恒等映射。{% raw %}<span>$D_*Q$</span>{% endraw %} 的对象是 {% raw %}<span>$Q$</span>{% endraw %} 中的元素，箭头为
{% raw %}<div class="quantaloid-equation">$$
D_*Q(p,q)=\{d\le p\wedge q\mid p(p\to d)=d=q(q\to d)\}.
$$</div>{% endraw %}
对象 {% raw %}<span>$p$</span>{% endraw %} 上的 identity 是标量 {% raw %}<span>$p$</span>{% endraw %}。对 {% raw %}<span>$d:p\to q$</span>{% endraw %}、{% raw %}<span>$b:q\to r$</span>{% endraw %}，复合为
{% raw %}<div class="quantaloid-equation">$$
b\circ_q d=b(q\to d)=(q\to b)d.
$$</div>{% endraw %}
下标 {% raw %}<span>$q$</span>{% endraw %} 标明复合经过的对象；同一个标量出现在不同 hom 中时，这个下标尤其重要。平行箭头的 join 在 {% raw %}<span>$Q$</span>{% endraw %} 中计算，involution 保持标量、反转方向。由于每个 {% raw %}<span>$p$</span>{% endraw %}-endomorphism 都不超过 identity {% raw %}<span>$p$</span>{% endraw %}，{% raw %}<span>$D_*Q$</span>{% endraw %} 总是 integral，即使 {% raw %}<span>$Q$</span>{% endraw %} 本身并不 integral。

我们考虑
{% raw %}<div class="quantaloid-equation">$$
K_*(Q)=\operatorname{Map}(\operatorname{SymDist}(D_*Q)).
$$</div>{% endraw %}
对象是小的对称 {% raw %}<span>$D_*Q$</span>{% endraw %}-范畴，态射是它们之间**所有左伴随 distributors**。仍用 {% raw %}<span>$(-)^\circ$</span>{% endraw %} 表示给定的 involution，用 {% raw %}<span>$(-)^*$</span>{% endraw %} 表示实际的右伴随，不预先把二者等同。

这些对象就是有界的 {% raw %}<span>$Q$</span>{% endraw %}-valued similarities，也对应 Höhle–Kubiak 意义下的相等度；这个对象识别见 Lai–Shen–Tao–Zhang 的 [*Quantale-valued dissimilarity*](https://arxiv.org/pdf/1904.05565v2#page=13)，Theorem 4.5 与 Remark 4.6。非整情形中，“{% raw %}<span>$Q$</span>{% endraw %}-Set”还可能指无界的 {% raw %}<span>$DQ$</span>{% endraw %} 版本，或者采用集合函数的态射约定；下文的结论始终针对上述 {% raw %}<span>$K_*(Q)$</span>{% endraw %}。

> **定理.** 对任意交换幺 quantale {% raw %}<span>$Q$</span>{% endraw %}，以下条件等价：
>
> 1. {% raw %}<span>$K_*(Q)$</span>{% endraw %} 笛卡尔闭；
> 2. {% raw %}<span>$K_*(Q)$</span>{% endraw %} 是 elementary topos；
> 3. {% raw %}<span>$K_*(Q)$</span>{% endraw %} 是 Grothendieck topos；
> 4. {% raw %}<span>$D_*Q$</span>{% endraw %} weakly tabular；
> 5. 对任意 {% raw %}<span>$d\le p$</span>{% endraw %}，若 {% raw %}<span>$p(p\to d)=d$</span>{% endraw %}，则 {% raw %}<span>$d(p\to d)=d$</span>{% endraw %}；
> 6. 对任意 {% raw %}<span>$x\le p$</span>{% endraw %}，有 {% raw %}<span>$p(p\to x)^2=p(p\to x)$</span>{% endraw %}。
>
> 条件成立时，这个 topos 是 localic 的。

第 5 条说每个有界、{% raw %}<span>$p$</span>{% endraw %}-divisible 的元素在对象 {% raw %}<span>$p$</span>{% endraw %} 上幂等，下面记为 (RI)。第 6 条的平方则是 **{% raw %}<span>$Q$</span>{% endraw %} 中的乘法**，左边为 {% raw %}<span>$p\cdot(p\to x)\cdot(p\to x)$</span>{% endraw %}。

## 笛卡尔闭性强迫 κ 幂等

先暂时回到一般的 small integral involutive quantaloid {% raw %}<span>$\mathcal R$</span>{% endraw %}，记
{% raw %}<div class="quantaloid-equation">$$
K(\mathcal R)=\operatorname{Map}(\operatorname{SymDist}(\mathcal R)),
\qquad \kappa_t(q)=\top_{q,t}\top_{t,q}.
$$</div>{% endraw %}
这里 {% raw %}<span>$\top_{t,q}$</span>{% endraw %} 指最大的箭头 {% raw %}<span>$t\to q$</span>{% endraw %}，{% raw %}<span>$gf$</span>{% endraw %} 表示先 {% raw %}<span>$f$</span>{% endraw %} 后 {% raw %}<span>$g$</span>{% endraw %}。矩阵采用 target row、source column 的约定，即 {% raw %}<span>$A(y,x):|x|\to|y|$</span>{% endraw %}。一个对称范畴满足 {% raw %}<span>$I\le A$</span>{% endraw %}、{% raw %}<span>$A^2=A$</span>{% endraw %}、{% raw %}<span>$A^\circ=A$</span>{% endraw %}；distributor {% raw %}<span>$F:A\to B$</span>{% endraw %} 满足 {% raw %}<span>$BF=F=FA$</span>{% endraw %}，而 {% raw %}<span>$F\dashv F^*$</span>{% endraw %} 意味着
{% raw %}<div class="quantaloid-equation">$$
A\le F^*F,\qquad FF^*\le B.
$$</div>{% endraw %}

记类型为 {% raw %}<span>$t$</span>{% endraw %}、hom 为 {% raw %}<span>$1_t$</span>{% endraw %} 的 singleton 为 {% raw %}<span>$S_t$</span>{% endraw %}。integrality 给出 {% raw %}<span>$A(x,x)=1_{|x|}$</span>{% endraw %}，所以每个点都有 principal map
{% raw %}<div class="quantaloid-equation">$$
j_x:S_{|x|}\to A,\qquad
j_x(y)=A(y,x),\qquad j_x^*(y)=A(x,y).
$$</div>{% endraw %}
有 {% raw %}<span>$j_y^*j_x=A(y,x)$</span>{% endraw %}，且 {% raw %}<span>$Fj_x$</span>{% endraw %} 正好是 {% raw %}<span>$F$</span>{% endraw %} 的第 {% raw %}<span>$x$</span>{% endraw %} 列。因此这些 principal maps 检测以 {% raw %}<span>$A$</span>{% endraw %} 为源的 distributors 是否相等。singleton 之间的 maps 就是底层 {% raw %}<span>$\mathcal R$</span>{% endraw %} 中的左伴随箭头，下称底层 maps。

> **引理.** 如果 {% raw %}<span>$K(\mathcal R)$</span>{% endraw %} 笛卡尔闭，则对任意 {% raw %}<span>$t,q$</span>{% endraw %}，都有 {% raw %}<span>$\kappa_t(q)^2=\kappa_t(q)$</span>{% endraw %}。

固定 {% raw %}<span>$t,q$</span>{% endraw %}，简记
{% raw %}<div class="quantaloid-equation">$$
u=\top_{t,q},\qquad k=u^\circ u=\kappa_t(q),\qquad c=k^2.
$$</div>{% endraw %}
{% raw %}<span>$k,c$</span>{% endraw %} 都对称，且 {% raw %}<span>$c\le k\le1_t$</span>{% endraw %}。只需证明 {% raw %}<span>$k\le c$</span>{% endraw %}。

**先看共同定义域上的 maps。** 若 {% raw %}<span>$a:s\to t$</span>{% endraw %}、{% raw %}<span>$b:s\to q$</span>{% endraw %} 是底层 maps，则 {% raw %}<span>$b^*b=1_s$</span>{% endraw %}：一边来自 adjunction unit，另一边来自 integrality。于是
{% raw %}<div class="quantaloid-equation">$$
aa^*=a(b^*b)a^*=(ab^*)(ba^*)
\le\top_{q,t}\top_{t,q}=k.
$$</div>{% endraw %}
由三角恒等式 {% raw %}<span>$aa^*a=a$</span>{% endraw %} 及 {% raw %}<span>$k\le1_t$</span>{% endraw %} 得
{% raw %}<div class="quantaloid-equation">$$
ka=a,\qquad ca=a.\tag{1}
$$</div>{% endraw %}
这里始终使用实际的右伴随。

**用指数对象连接两个点。** 令 {% raw %}<span>$Y=S_t$</span>{% endraw %}，取两个类型均为 {% raw %}<span>$t$</span>{% endraw %} 的点构成
{% raw %}<div class="quantaloid-equation">$$
Z=\begin{pmatrix}1_t&amp;c\\c&amp;1_t\end{pmatrix},
$$</div>{% endraw %}
其 principal maps 记为 {% raw %}<span>$x,x':S_t\to Z$</span>{% endraw %}。由 {% raw %}<span>$c=c^\circ\le1_t$</span>{% endraw %} 可知 {% raw %}<span>$Z$</span>{% endraw %} 是对称范畴；这里并不需要 {% raw %}<span>$c$</span>{% endraw %} 幂等。

对 {% raw %}<span>$r=t,q$</span>{% endraw %}，取 {% raw %}<span>$K(\mathcal R)$</span>{% endraw %} 中真正的范畴乘积 {% raw %}<span>$P_r=S_r\times Y$</span>{% endraw %}，第二投影记为 {% raw %}<span>$\rho_r$</span>{% endraw %}。我们有
{% raw %}<div class="quantaloid-equation">$$
x\rho_q=x'\rho_q.\tag{2}
$$</div>{% endraw %}
事实上，{% raw %}<span>$P_q$</span>{% endraw %} 的任一 principal map {% raw %}<span>$w:S_s\to P_q$</span>{% endraw %} 经两个投影给出底层 maps {% raw %}<span>$b:s\to q$</span>{% endraw %}、{% raw %}<span>$a=\rho_qw:s\to t$</span>{% endraw %}。{% raw %}<span>$xa$</span>{% endraw %} 的两项是 {% raw %}<span>$a,ca$</span>{% endraw %}，{% raw %}<span>$x'a$</span>{% endraw %} 的两项是 {% raw %}<span>$ca,a$</span>{% endraw %}，由 (1) 相等。再用 principal maps 检测相等性，就得到 (2)。这一步没有假设乘积的 enriched 矩阵公式。

取指数对象 {% raw %}<span>$E=Z^Y$</span>{% endraw %}。将
{% raw %}<div class="quantaloid-equation">$$
x\rho_t,\ x'\rho_t:S_t\times Y\to Z,
\qquad x\rho_q=x'\rho_q:S_q\times Y\to Z
$$</div>{% endraw %}
分别转置为
{% raw %}<div class="quantaloid-equation">$$
f,h:S_t\to E,\qquad g:S_q\to E.
$$</div>{% endraw %}
再取两点对称范畴
{% raw %}<div class="quantaloid-equation">$$
A=\begin{pmatrix}1_t&amp;u^\circ\\u&amp;1_q\end{pmatrix},
$$</div>{% endraw %}
其 principal maps 为 {% raw %}<span>$i:S_t\to A$</span>{% endraw %}、{% raw %}<span>$j:S_q\to A$</span>{% endraw %}。integrality 保证这个矩阵确实满足传递性。将 {% raw %}<span>$x\pi_Y,x'\pi_Y:A\times Y\to Z$</span>{% endraw %} 转置，得到 {% raw %}<span>$U,V:A\to E$</span>{% endraw %}。转置的自然性和 (2) 给出
{% raw %}<div class="quantaloid-equation">$$
Ui=f,\quad Uj=g,\qquad Vi=h,\quad Vj=g.
$$</div>{% endraw %}
因此两条 adjunction unit {% raw %}<span>$A\le U^*U$</span>{% endraw %}、{% raw %}<span>$A\le V^*V$</span>{% endraw %} 蕴涵
{% raw %}<div class="quantaloid-equation">$$
u\le g^*f,\quad u\le g^*h,
\qquad u^\circ\le f^*g,\quad u^\circ\le h^*g.
$$</div>{% endraw %}
结合 {% raw %}<span>$gg^*\le E$</span>{% endraw %}，得到
{% raw %}<div class="quantaloid-equation">$$
k\le h^*gg^*f\le h^*f,
\qquad k\le f^*gg^*h\le f^*h.\tag{3}
$$</div>{% endraw %}

**把两个转置组装成一个 map。** 令
{% raw %}<div class="quantaloid-equation">$$
D=\begin{pmatrix}1_t&amp;k\\k&amp;1_t\end{pmatrix},\qquad
M=\begin{pmatrix}f&amp;h\end{pmatrix},\qquad
N=\begin{pmatrix}f^*\\h^*\end{pmatrix}.
$$</div>{% endraw %}
{% raw %}<span>$D$</span>{% endraw %} 同样是对称范畴。由 {% raw %}<span>$f,h$</span>{% endraw %} 的 units 和 (3)，有 {% raw %}<span>$D\le NM$</span>{% endraw %}；由它们的 counits，有 {% raw %}<span>$MN=ff^*\vee hh^*\le E$</span>{% endraw %}。

还要检查 {% raw %}<span>$M,N$</span>{% endraw %} 确实是 distributors。它们的 {% raw %}<span>$E$</span>{% endraw %}-action 逐列、逐行成立；另外
{% raw %}<div class="quantaloid-equation">$$
MD\le MNM\le EM=M,\qquad
DN\le NMN\le NE=N.
$$</div>{% endraw %}
由 {% raw %}<span>$D$</span>{% endraw %} 的 reflexivity 得到反向不等式。因此 {% raw %}<span>$M:D\to E$</span>{% endraw %}、{% raw %}<span>$N:E\to D$</span>{% endraw %} 是 distributors，且 {% raw %}<span>$M\dashv N$</span>{% endraw %}。

**最后代入 evaluation。** 从 {% raw %}<span>$D$</span>{% endraw %} 到 {% raw %}<span>$Y=S_t$</span>{% endraw %} 的常值保类型函子诱导 map {% raw %}<span>$\delta:D\to Y$</span>{% endraw %}。若 {% raw %}<span>$d_0,d_1:S_t\to D$</span>{% endraw %} 是两个 principal maps，则
{% raw %}<div class="quantaloid-equation">$$
Md_0=f,\quad Md_1=h,\qquad
\delta d_0=1_Y=\delta d_1.
$$</div>{% endraw %}
利用真正乘积的配对，定义
{% raw %}<div class="quantaloid-equation">$$
T=\operatorname{ev}\langle M,\delta\rangle:D\to Z.
$$</div>{% endraw %}

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

令 {% raw %}<span>$\Delta:S_t\to S_t\times Y$</span>{% endraw %} 为对角 map。转置定义给出
{% raw %}<div class="quantaloid-equation">$$
Td_0=\operatorname{ev}\langle f,1_Y\rangle=x\rho_t\Delta=x,
\qquad
Td_1=\operatorname{ev}\langle h,1_Y\rangle=x'\rho_t\Delta=x'.
$$</div>{% endraw %}
于是把 {% raw %}<span>$T$</span>{% endraw %} 的 unit 限制到两个 principal maps 上，得到
{% raw %}<div class="quantaloid-equation">$$
k=d_1^*d_0
\le d_1^*T^*Td_0
=(Td_1)^*(Td_0)
=x'^*x=c=k^2.
$$</div>{% endraw %}
结合 {% raw %}<span>$k^2\le k$</span>{% endraw %}，引理得证。

整个证明只用了有限乘积、一个指数对象 {% raw %}<span>$Z^{S_t}$</span>{% endraw %} 和几个有限对称范畴。因此只要有限乘积存在，且每个 singleton 都 exponentiable，也足以推出所有 {% raw %}<span>$\kappa_t(q)$</span>{% endraw %} 幂等；无需任何 pushout 假设。

## 从 κ 到标量判别与 weak tabularity

现在回到 {% raw %}<span>$D_*Q$</span>{% endraw %}。先记下对任意 {% raw %}<span>$p$</span>{% endraw %} 都成立的恒等式
{% raw %}<div class="quantaloid-equation">$$
p(p\to p)=p.\tag{4}
$$</div>{% endraw %}
一边来自 residuation，另一边来自 {% raw %}<span>$e\le p\to p$</span>{% endraw %}。

假设 {% raw %}<span>$K_*(Q)$</span>{% endraw %} 笛卡尔闭，取 {% raw %}<span>$d\le p$</span>{% endraw %} 且 {% raw %}<span>$p(p\to d)=d$</span>{% endraw %}。标量 {% raw %}<span>$d$</span>{% endraw %} 是 {% raw %}<span>$p\to d$</span>{% endraw %} 和 {% raw %}<span>$d\to p$</span>{% endraw %} 两个方向上的箭头；由有界性，它还是这两个 hom 的最大元。因此
{% raw %}<div class="quantaloid-equation">$$
\kappa_p(d)=\top_{d,p}\circ_d\top_{p,d}
=d(d\to d)=d.
$$</div>{% endraw %}
这个等式把 {% raw %}<span>$d$</span>{% endraw %} 看成 {% raw %}<span>$p$</span>{% endraw %} 上的 endomorphism。引理说明它在 {% raw %}<span>$p$</span>{% endraw %} 上幂等，于是
{% raw %}<div class="quantaloid-equation">$$
d=\kappa_p(d)\circ_p\kappa_p(d)=d(p\to d).
$$</div>{% endraw %}
这就证明了 (RI)。注意，计算 {% raw %}<span>$\kappa_p(d)$</span>{% endraw %} 时经过对象 {% raw %}<span>$d$</span>{% endraw %}，计算它的平方时经过对象 {% raw %}<span>$p$</span>{% endraw %}。

接着证明 (RI) 恰好等价于 weak tabularity。回忆 (WT) 的定义：每条箭头 {% raw %}<span>$v:p\to q$</span>{% endraw %} 都满足
{% raw %}<div class="quantaloid-equation">$$
v=\bigvee\{ba^*\mid a:r\to p,\ b:r\to q\text{ 是底层 maps},\ ba^*\le v\}.\tag{WT}
$$</div>{% endraw %}
为把这个条件化成标量，先确定 {% raw %}<span>$D_*Q$</span>{% endraw %} 的底层 maps。

> **引理.** {% raw %}<span>$D_*Q$</span>{% endraw %} 中从 {% raw %}<span>$r$</span>{% endraw %} 到 {% raw %}<span>$p$</span>{% endraw %} 至多有一个 map。如果存在，它和实际右伴随的标量值都为 {% raw %}<span>$r$</span>{% endraw %}；存在的充要条件是
> {% raw %}<span>$r\le p$</span>{% endraw %}、{% raw %}<span>$p(p\to r)=r$</span>{% endraw %}、{% raw %}<span>$r(p\to r)=r$</span>{% endraw %}。

设 {% raw %}<span>$f:r\to p$</span>{% endraw %} 左伴随于 {% raw %}<span>$g:p\to r$</span>{% endraw %}。unit 给出
{% raw %}<div class="quantaloid-equation">$$
r\le g\circ_p f=(p\to g)f\le(p\to p)f=f\le r.
$$</div>{% endraw %}
中间的等号用到了 {% raw %}<span>$f=p(p\to f)$</span>{% endraw %} 和 (4)，故 {% raw %}<span>$f=r$</span>{% endraw %}。同样，利用复合的另一种写法，
{% raw %}<div class="quantaloid-equation">$$
r\le g(p\to f)\le g(p\to p)=g\le r,
$$</div>{% endraw %}
故 {% raw %}<span>$g=r$</span>{% endraw %}。反过来，前两个条件保证标量 {% raw %}<span>$r$</span>{% endraw %} 是两个方向上的箭头；第三个条件给出 unit，而 counit 是 {% raw %}<span>$r(r\to r)=r\le p$</span>{% endraw %}，引理得证。

**(WT) 推出 (RI)。** 给定 {% raw %}<span>$d:p\to p$</span>{% endraw %}，(WT) 将它写成 map-spans {% raw %}<span>$p\xleftarrow{a_i}r_i\xrightarrow{b_i}p$</span>{% endraw %} 的复合之并。由引理，{% raw %}<span>$a_i,b_i,a_i^*$</span>{% endraw %} 的标量都是 {% raw %}<span>$r_i$</span>{% endraw %}，所以
{% raw %}<div class="quantaloid-equation">$$
b_i\circ_{r_i}a_i^*=r_i(r_i\to r_i)=r_i,
\qquad r_i\circ_p r_i=r_i(p\to r_i)=r_i.
$$</div>{% endraw %}
于是 {% raw %}<span>$d=\bigvee_i r_i$</span>{% endraw %}，且
{% raw %}<div class="quantaloid-equation">$$
d\circ_p d
=\bigvee_{i,j}(r_i\circ_p r_j)
\ge\bigvee_i(r_i\circ_p r_i)
=d.
$$</div>{% endraw %}
integrality 给出反向不等式，故 {% raw %}<span>$d\circ_p d=d$</span>{% endraw %}，也就是 (RI)。这个论证也包括空并。

**(RI) 推出 (WT)。** 若 {% raw %}<span>$d:p\to q$</span>{% endraw %}，则在两个端点应用 (RI)，得到
{% raw %}<div class="quantaloid-equation">$$
d(p\to d)=d=d(q\to d).
$$</div>{% endraw %}
由引理，存在标量都为 {% raw %}<span>$d$</span>{% endraw %} 的底层 maps {% raw %}<span>$a:d\to p$</span>{% endraw %}、{% raw %}<span>$b:d\to q$</span>{% endraw %}，且
{% raw %}<div class="quantaloid-equation">$$
b\circ_d a^*=d(d\to d)=d.
$$</div>{% endraw %}
因此每条箭头甚至由单个 map-span 表示，当然满足 (WT)。

最后，(RI) 与主定理中的标量恒等式等价。对 {% raw %}<span>$x\le p$</span>{% endraw %}，令 {% raw %}<span>$d=p(p\to x)$</span>{% endraw %}。由 residuation，{% raw %}<span>$d\le x\le p$</span>{% endraw %}，并且
{% raw %}<div class="quantaloid-equation">$$
p\to d=p\to x:
$$</div>{% endraw %}
一边来自 {% raw %}<span>$d\le x$</span>{% endraw %}，另一边来自 {% raw %}<span>$p(p\to x)=d$</span>{% endraw %}。所以 {% raw %}<span>$p(p\to d)=d$</span>{% endraw %}，对 {% raw %}<span>$d$</span>{% endraw %} 应用 (RI) 正好得到
{% raw %}<div class="quantaloid-equation">$$
p(p\to x)^2=p(p\to x).
$$</div>{% endraw %}
反之，对满足 {% raw %}<span>$d\le p$</span>{% endraw %}、{% raw %}<span>$p(p\to d)=d$</span>{% endraw %} 的 {% raw %}<span>$d$</span>{% endraw %}，在这个恒等式中取 {% raw %}<span>$x=d$</span>{% endraw %}，便得到 (RI)。

至此，笛卡尔闭性推出 (RI)，而 (RI)、(WT) 与标量恒等式彼此等价。因为 {% raw %}<span>$D_*Q$</span>{% endraw %} integral，[上一篇的定理](https://hexo.yougi.top/2026/10/03/integral-quantaloids-weak-tabularity-topos/)把 (WT) 等价地识别为 elementary topos，并进一步给出 localic Grothendieck topos。每个 Grothendieck topos 都是 elementary topos，每个 elementary topos 都笛卡尔闭，主定理的各条件于是全部等价。

## Integral 情形

若 {% raw %}<span>$Q$</span>{% endraw %} 本身 integral，即 {% raw %}<span>$e=\top$</span>{% endraw %}，则 divisibility 方程自动蕴涵 {% raw %}<span>$d\le p\wedge q$</span>{% endraw %}，所以 {% raw %}<span>$DQ=D_*Q$</span>{% endraw %}；这里不需要假设 {% raw %}<span>$Q$</span>{% endraw %} divisible。

在主定理的标量恒等式中取 {% raw %}<span>$p=e$</span>{% endraw %}，由 {% raw %}<span>$e\to x=x$</span>{% endraw %} 得到 {% raw %}<span>$x^2=x$</span>{% endraw %}。integrality 给出 {% raw %}<span>$ab\le a\wedge b$</span>{% endraw %}；另一方面，若 {% raw %}<span>$z\le a,b$</span>{% endraw %}，则
{% raw %}<div class="quantaloid-equation">$$
z=z^2\le ab.
$$</div>{% endraw %}
所以乘法正好是 meet。乘法保持任意 join，便说明 {% raw %}<span>$Q$</span>{% endraw %} 是 frame quantale。反之，frame quantale 对 {% raw %}<span>$d\le p$</span>{% endraw %} 满足
{% raw %}<div class="quantaloid-equation">$$
p\wedge(p\to d)=d,
\qquad d\wedge(p\to d)=d,
$$</div>{% endraw %}
因而满足 (RI)。因此在任意交换 integral quantale 上，
{% raw %}<div class="quantaloid-equation">$$
K(DQ)\text{ 笛卡尔闭}
\quad\Longleftrightarrow\quad K(DQ)\text{ 是 topos}
\quad\Longleftrightarrow\quad Q\text{ 是 frame quantale}.
$$</div>{% endraw %}
对非整 {% raw %}<span>$Q$</span>{% endraw %}，则保留主定理的相对幂等条件 {% raw %}<span>$p(p\to x)^2=p(p\to x)$</span>{% endraw %}，并始终使用有界的 {% raw %}<span>$D_*Q$</span>{% endraw %}。

{% raw %}
<style>
.article .content .quantaloid-equation { overflow-x: auto; overflow-y: hidden; max-width: 100%; padding: .4em 0; }
.article .content .tikzjax { max-width: 100%; overflow-x: auto; }
</style>
{% endraw %}
