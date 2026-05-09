---
abbrlink: ''
categories:
- - 范畴论
date: '2026-05-09T15:01:21.560488+08:00'
plugins:
  mathjax: true
tags:
- Co/End Calculus
title: Co/End Calculus
toc: true
updated: '2026-05-09T19:31:10.249+08:00'
---
最近因为在不少文章中遇到End与Coend相关的技术，而且enriched category的课本中也大费周章地定义End，于是决定花些时间专门学习。出乎我意料的是，学习Co/End的核心技术不需要花费多少时间，但足以让人看到其强大的作用。

[Co/End Calculus](https://arxiv.org/abs/1501.02503)系统记载了Co/End Calculus（（余）端演算）的内容，我只读了前面一点点，这些部分其实在任何涉及到End的范畴论书中应该都会提到。本文仅仅是闲暇时简单记录一下Co/End演算的威力。

<!--more-->

## Co/End

End有若干种等价定义，但从实用角度来说，它们没有区别，这里我列出最传统的定义：

> 设 $T:\mathscr{C}\nrightarrow \mathscr D$ 是一个Distributor，一个Wedge是指一族态射 $\tau_C: T(C,C)\to D$ ，而 $T$ 的end是指一个universal wedge $(\int_C T(C,C), \tau)$，使得对任意的Wedge $\tau'$ with vertex D，存在唯一的态射$D\to \int_C T$ 使得所有显然的三角形交换。

对偶地可以得到coend $\int^C T(C,C)$的定义。当然，一般的书上都会先定义Dinaturality，然后将Wedge定义为常值出发的dinatural transformation，还有使用extranaturality来定义的，会得到稍广义一点的定义，但这对本文来说并不重要，更重要的是co/end究竟有什么用？

## Co/End Calculus

Co/End演算的核心公式主要是以下几条，我不加证明地一一列出：

### Fubini Rule

> 设$T: \mathscr{C^{op}\times C\times D^{op}\times D\to E}$ ，则$\int_D\int_CT(C,C,D,D)=\int_C\int_D T(C,C,D,D)=\int_{C,D}T(C,C,D,D)$ ，其中一个存在可推出另外两个存在

### Natural Transformations as Ends

> 设$F,G:\mathscr{C\to D}$，则 $\mathrm{Nat}(F,G)=\int_C \mathscr D(FC,GC)$

### Ninja Yoneda Lemma

> $K : \mathcal{C}^{op} \to \mathbf{Set},H : \mathcal{C} \to \mathbf{Set}$ ，则：
>
> $K \cong \int^{C} KC \times \mathscr{C}(-,C)$
>
> $K \cong \int_C \mathbf{Set}(\mathscr{C}(-,C), KC)$
>
> $H \cong \int^{C} HC \times \mathscr{C}(C,-)$
>
> $H \cong \int_C \mathbf{Set}(\mathscr{C}(C,-), HC)$

关于第一、第三个公式，Fosco Loregian给出一个有趣的记忆方法：这些公式其实指出Hom函子是某种Dirac Delta:

$$
\begin{align*}
h(y) =& \int_{\mathbb{R}} f(x) \cdot \delta(y-x)\, dx\\\\
K(Y) \cong& \int^X KX \times \mathscr{C}(Y,X)
\end{align*}
$$

### Kan Extension as Co/Ends

> $\mathscr{C} \xrightarrow{G} \mathscr{E}, F : \mathscr{C} \to \mathscr{D}$ ，设 $\mathscr{E}$  cocomplete（complete，如果讨论右Kan延拓）， $\mathscr{C}$ 是小范畴，那么：
>
> $$
> \begin{align*}
> \operatorname{Lan}_F G \cong& \int^{C} \mathscr{D}(FC,-) \otimes GC\\\\
> \operatorname{Ran}_F G \cong& \int_C \mathscr{D}(-,FC) \pitchfork GC
> \end{align*}
> $$

### Weighted Co/Limites as Co/Ends

我先指出Weighted limits的定义，在如下情形：

$$
\int W \xrightarrow{\phi} \mathscr{J} \xrightarrow{F} \mathscr{C},
\qquad
\mathscr{J} \xrightarrow{W} \mathbf{Set}.
$$

定义$\lim_W F = \lim F \circ \phi$ ，对偶地，在如下情形：

$$
\int W \xrightarrow{\phi} \mathscr{J} \xrightarrow{F} \mathscr{C},
\qquad
\mathscr{J}^{\mathrm{op}} \xrightarrow{W} \mathbf{Set}.
$$

定义$\operatorname{colim}_W F = \operatorname{colim} F \circ \phi.$

那么，有：

> $$
> \begin{align*}
> \lim_W F \cong& \int_j Wj \pitchfork Fj,
> \\\\
> \operatorname{colim}_W F \cong& \int^j Wj \otimes Fj.
> \end{align*}
> $$

## Co/End Calculus is powerful

知乎上有一个很有趣的比喻，Kan延拓类比为黎曼积分，它的定义很优美，可以推导出很多美好的性质（All concepts are Kan extensions after all），但通过定义去计算Kan延拓异常困难，而Co/End的出现则与牛顿莱布尼茨公式的地位类似，它使得你可以相对简单地、技术地计算出Kan延拓。

这里我就举两个例子，一个是经典的，一个是我在Handbook上随机找的一个证明，我用Co/End改写了证明，它们都使得证明变得更短且更容易follow。

### Pointwise Kan Extension Formula

这其实是Kan Extension as Co/End中一个公式，我们演示一下如何通过Co/End演算证明它。逐点左Kan延拓的公式是$\operatorname {Lan}_F G(D)=\operatorname {colim}(F\downarrow D\xrightarrow {\phi} \mathscr C\xrightarrow{F}\mathscr{E})$，把weighted colimit翻译为coend，再回忆左Kan延拓的伴随刻画，我们实际上需要证明的是：对任意$H:\mathscr{D\to E}$，有

$$
\operatorname{Nat} (\int^C \mathscr D(FC,-)\otimes GC, H)\cong \operatorname{Nat} (G,HF)
$$

证明就是直接的计算：

$$
\begin{align*}
&\operatorname{Nat} \left(\int^C \mathscr D(FC,-)\otimes GC, H\right)\\\\
\cong&\int_D \mathscr{E} \left(\int^C \mathscr D(FC,D)\otimes GC, HD)\right)\\\\
\cong&\int_C\int_D \mathscr{E} (\mathscr D(FC,D)\otimes GC, HD))\\\\
\cong&\int_C\int_D \mathbf{Set} (\mathscr D(FC,D), \mathscr E(GC, HD))\\\\
\cong&\int_C\operatorname{Nat}(\mathscr{D}(FC,-),\mathscr{E}(GC,H-))\\\\
\cong&\int_C\mathscr E(GC, HFC)\\\\
\cong&\operatorname{Nat}(G,HF)
\end{align*}
$$

这就完成了证明。

### Dense Generators iff Restricted Yoneda is Fully Faithful

> 设$(G_i)$ 是$\mathscr C$ 的一族对象，设$\mathscr G$ 是由它们生成的满子范畴，则它是dense family of generators，当且仅当函子$C\mapsto \mathscr{C}(-,C) | _ {\mathscr G}$ 是fully faithful的

Handbook对dense family of generators的定义是，$\mathscr C$ 中的对象$C$ 都是遗忘函子$\operatorname{dom}:\mathscr G/C\to\mathscr C$ 的余极限，翻译成co/end语言，就是$C\cong \int^G\mathscr C(G,C) | _ {\mathscr G}\otimes i(G)$ （我把符号写得很详细，以免产生误会，尤其是Hom函子取的是限制），现在来算一下这代表了什么：

$$
\begin{align*}
&\mathscr{C}(\int^G\mathscr C(G,C) | _ {\mathscr G}\otimes i(G), T)\\\\
\cong&\int_G\mathscr{C}(\mathscr C(G,C) | _ {\mathscr G}\otimes i(G), T)\\\\
\cong& \int_G\mathbf{Set}(\mathscr C(G,C) | _ {\mathscr G},\mathscr{C}(i(G), T))\\\\
\cong&\operatorname{Nat}(\mathscr C(-,C) | _ {\mathscr G},\mathscr C(-,T) | _ {\mathscr G})
\end{align*}
$$

所以Dense当且仅当下式成立，对$C,T$ 自然：

$$
\operatorname{Nat}(\mathscr C(-,C) | _ {\mathscr G},\mathscr C(-,T) | _ {\mathscr G})\cong \mathscr C(C,T)
$$

而这正代表了所要的函子是fully faithful的。
