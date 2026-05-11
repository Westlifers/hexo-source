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
<div style="text-align: right; font-style: italic; color: #5f6f89; margin: 2em 0;">
  This is the (co)end,<br>
  My only (co)friend.<br>
  <span style="font-size: 0.9em;">— anonymous co/end enjoyer</span>
</div>

最近因为在不少文章中遇到End与Coend相关的技术，而且enriched category的课本中也大费周章地定义End，于是决定花些时间专门学习。出乎我意料的是，学习Co/End的核心技术不需要花费多少时间，但足以让人看到其强大的作用。

[Co/End Calculus](https://arxiv.org/abs/1501.02503)系统记载了Co/End Calculus（（余）端演算）的内容，我只读了前面一点点，这些部分其实在任何涉及到End的范畴论书中应该都会提到。本文仅仅是闲暇时简单记录一下Co/End演算的威力。

<!--more-->

## Co/End

End有若干种等价定义，但从实用角度来说，它们没有区别，这里我列出最传统的定义：

> 设 $T:\mathscr{C}\nrightarrow \mathscr D$ 是一个Distributor，一个Wedge是指一族态射 $\tau_C: D\to T(C,C)$ ，而 $T$ 的end是指一个universal wedge $(\int_C T(C,C), \tau)$，使得对任意的Wedge $\tau'$ with vertex D，存在唯一的态射$D\to \int_C T(C,C)$ 使得所有显然的三角形交换。

对偶地可以得到coend $\int^C T(C,C)$的定义。当然，一般的书上都会先定义Dinaturality，然后将Wedge定义为常值出发的dinatural transformation，还有使用extranaturality来定义的，会得到稍广义一点的定义，但这对本文来说并不重要，更重要的是co/end究竟有什么用？

## Co/End Calculus

Co/End演算的核心公式主要是以下几条，我不加证明地一一列出：

### Fubini Rule

> 设$T:\mathscr C^{op}\times \mathscr C\times \mathscr D^{op}\times \mathscr D\to \mathscr E$ ，则$\int_D\int_CT(C,C,D,D)=\int_C\int_D T(C,C,D,D)=\int_{C,D}T(C,C,D,D)$，其中一个存在可推出另外两个存在

### Natural Transformations as Ends

> 设$F,G:\mathscr{C\to D}$，则 $\mathrm{Nat}(F,G)\cong\int_C \mathscr D(FC,GC)$

### Ninja Yoneda Lemma

> $K : \mathscr{C}^{op} \to \mathbf{Set},H : \mathscr{C} \to \mathbf{Set}$ ，则：
>
> $K \cong \int^{C} KC \times \mathscr{C}(-,C)$
>
> $K \cong \int_C \mathbf{Set}(\mathscr{C}(-,C), KC)$
>
> $H \cong \int^{C} HC \times \mathscr{C}(C,-)$
>
> $H \cong \int_C \mathbf{Set}(\mathscr{C}(C,-), HC)$
>
>（如果涉及的co/end都存在）

关于第一、第三个公式，Fosco Loregian给出一个有趣的记忆方法：这些公式其实指出Hom函子是某种Dirac Delta:

$$
\begin{align*}
h(y) =& \int_{\mathbb{R}} f(x) \cdot \delta(y-x)\mathrm dx\\\\
K(Y) \cong& \int^X KX \times \mathscr{C}(Y,X)
\end{align*}
$$

另外，顺便指出，因为函子范畴中（余）极限是逐点计算的，所以co/end也是逐点计算的，以第一个公式举例，这意味着
$$
K(D) \cong \int^{C} KC \times \mathscr{C}(D,C)
$$

### Kan Extension as Co/Ends

> $G: \mathscr{C}\to \mathscr{E}, F : \mathscr{C} \to \mathscr{D}$ ，设 $\mathscr{E}$  cocomplete（complete，如果讨论右Kan延拓）， $\mathscr{C}$ 是小范畴，那么：
>
> $$
> \begin{align*}
> \operatorname{Lan}_F G \cong& \int^{C} \mathscr{D}(FC,-) \otimes GC\\\\
> \operatorname{Ran}_F G \cong& \int_C \mathscr{D}(-,FC) \pitchfork GC
> \end{align*}
> $$

### Weighted Co/Limits as Co/Ends

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
> \operatorname{lim}_W F \cong& \int_j Wj \pitchfork Fj,
> \\\\
> \operatorname{colim}_W F \cong& \int^j Wj \otimes Fj.
> \end{align*}
> $$

### Hom与Co/End的交换

在Co/End演算中还经常使用如下规则：Hom函子可以把coend变成end，也可以把end变成end。具体来说，若相关的end/coend存在，则有自然同构
$$
\mathscr E\left(\int^{C} T(C,C),X\right)
\cong
\int_C \mathscr E(T(C,C),X),
$$
以及
$$
\mathscr E\left(X,\int_C T(C,C)\right)
\cong
\int_C \mathscr E(X,T(C,C)).
$$
它们本质上只是（余）极限与Hom的交换性。

## Co/End Calculus is powerful

知乎上有一个很有趣的比喻，Kan延拓类比为黎曼积分，它的定义很优美，可以推导出很多美好的性质（All concepts are Kan extensions after all），但通过定义去计算Kan延拓异常困难，而Co/End的出现则与牛顿莱布尼茨公式的地位类似，它使得你可以相对简单地、技术地计算出Kan延拓。

这里我就举两个例子，一个是经典的，一个是我在Handbook上随机找的一个证明，我用Co/End改写了证明，它们都使得证明变得更短且更容易follow。

### Pointwise Kan Extension Formula

这其实是Kan Extension as Co/End中一个公式，我们演示一下如何通过Co/End演算证明它。逐点左Kan延拓的公式是$\operatorname {Lan}_F G(D)=\operatorname {colim}(F\downarrow D\xrightarrow {\phi} \mathscr C\xrightarrow{G}\mathscr{E})$，把weighted colimit翻译为coend，再回忆左Kan延拓的伴随刻画，我们实际上需要证明的是：对任意$H:\mathscr{D\to E}$，有

$$
\operatorname{Nat} \left(\int^C \mathscr D(FC,-)\otimes GC, H\right)\cong \operatorname{Nat} (G,HF)
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
&\mathscr{C}\left(\int^G\mathscr C(G,C) | _ {\mathscr G}\otimes i(G), T\right)\\\\
\cong&\int_G\mathscr{C}(\mathscr C(G,C) | _ {\mathscr G}\otimes i(G), T)\\\\
\cong& \int_G\mathbf{Set}(\mathscr C(G,C) | _ {\mathscr G},\mathscr{C}(i(G), T))\\\\
\cong& \operatorname{Nat}(\mathscr C(-,C) | _ {\mathscr G},\mathscr C(-,T) | _ {\mathscr G})
\end{align*}
$$

所以Dense当且仅当下式成立，对$C,T$ 自然：

$$
\operatorname{Nat}(\mathscr C(-,C) | _ {\mathscr G},\mathscr C(-,T) | _ {\mathscr G})\cong \mathscr C(C,T)
$$

而这正代表了所要的函子是fully faithful的。

## Size Issue

本文中为了突出Co/End演算的思想，我没有反复强调size issue。严格来说，许多公式都需要相应的小性假设。例如，若要写
$$
\operatorname{Nat}(F,G)\cong \int_{C\in \mathscr C}\mathscr D(FC,GC),
$$
通常需要 $\mathscr C$ 是小范畴，$\mathscr D$ 局部小；若要使用逐点Kan延拓公式
$$
(\operatorname{Lan}_F G)(D)\cong \int^{C\in\mathscr C}\mathscr D(FC,D)\otimes G(C),
$$
也通常要求 $\mathscr C$ 小，并要求目标范畴中存在相应的张量与coend。类似地，函子范畴中的end/coend逐点计算，也依赖于目标范畴具有相应的极限或余极限，Ninja Yoneda中也指明，假设涉及的co/end存在时，才有后面的结果。因此，本文中的公式应理解为“在相关对象存在且size条件合适时成立”的自然同构。换言之，Co/End演算本身并不会消除小性与存在性问题；它的作用是在这些问题已经被妥善处理之后，把许多泛性质证明转化为形式化、可计算的代数操作。

### Large Co/Ends

严格来说，end/coend 通常是相对于小索引范畴定义的。如果 $\mathscr C$ 是大范畴，那么表达式
$$
\int_{C\in\mathscr C} T(C,C),
\qquad
\int^{C\in\mathscr C} T(C,C)
$$
就涉及所谓的 large end / large coend。它们不能像小 co/end 那样自动存在，因为这相当于要求目标范畴具有大规模的极限或余极限。例如 $\mathbf{Set}$ 只具有小极限和小余极限，而不具有任意大极限和大余极限。

因此，在严格使用 large co/end 时，需要额外说明其存在性。常见做法包括：引入 Grothendieck universe，把相关“大”范畴放到更高宇宙中视为“小”范畴；或者用一个小的稠密子范畴、小的生成子范畴替代原来的大索引范畴；或者在 locally presentable / accessible 的框架下，把表面上的大构造化归为小构造。否则，large co/end 最多只能被理解为形式记号，表示“若该对象存在，则它满足相应的泛性质”。

因此，Co/End演算的size问题可以概括为：普通演算规则主要负责形式计算，而小性条件负责保证这些形式计算所涉及的对象确实存在。

### Example: large coend to small coend

一个典型例子是有限集合范畴（骨架）
$$
i:\mathbf{FinSet}\hookrightarrow \mathbf{Set}
$$
在 $\mathbf{Set}$ 中是稠密的，证明留给读者，可以使用我们前文例子提到的等价刻画。直观地说，每个集合 $X$ 都可以由它的有限子集拼起来；更范畴论地说，有典范同构
$$
X\cong \int^{n\in \mathbf{FinSet}}\mathbf{Set}(n,X)\times n.
$$
这里右边的coend只在小范畴 $\mathbf{FinSet}$ 上取，因此是一个small coend。它表达的正是“$X$ 由所有有限集合到 $X$ 的映射所生成，并且按自然的重参数化关系取商”。

这个例子可以用来解释large coend如何被small coend替代。形式上，由Ninja Yoneda lemma，对于函子
$$
F:\mathbf{Set}\to \mathbf{Set},
$$
我们希望写
$$
F(X)\cong \int^{S\in \mathbf{Set}}\mathbf{Set}(S,X)\times F(S).
$$
但是这里的索引范畴是大范畴 $\mathbf{Set}$，因此这是一个large coend，严格来说不能自动认为存在。若 $F$ 是finitary functor，即 $F$ 保持filtered colimits，则 $F$ 已经由它在有限集合上的取值决定，于是上式可以替换为小的coend：
$$
F(X)\cong \int^{n\in \mathbf{FinSet}}\mathbf{Set}(n,X)\times F(n).
$$
换言之，$\mathbf{FinSet}$ 的稠密性把原本形式上的large Ninja Yoneda公式压缩成了一个真正的小coend公式。

需要注意的是，仅仅有稠密子范畴还不意味着任意函子都可以这样降维。对于
$$
F:\mathbf{Set}\to \mathbf{Set},
$$
公式
$$
F(X)\cong \int^{n\in \mathbf{FinSet}}\mathbf{Set}(n,X)\times F(n)
$$
成立的关键是 $F$ 是finitary，也就是它由有限集合上的信息决定。若 $F$ 不是finitary，例如完整幂集函子 $\mathcal P$，那么右边只会捕捉有限信息，不能恢复全部的 $\mathcal P(X)$。因此，稠密子范畴的作用是提供一个可能的small replacement，而具体能否替换，还取决于被计算的函子是否由这个稠密子范畴决定。

我以上式的证明作为本文的结尾：
$$
\begin{align*}
F(X) &\cong F\left(\operatorname{colim}_{(n\to X)\in\mathbf{FinSet}/X} n\right) \\\\
&\cong \operatorname{colim} _ {(n\to X)\in\mathbf{FinSet}/X} F(n) \\\\
&\cong \int^{n\in\mathbf{FinSet}}\mathbf{Set}(n,X)\times F(n)
\end{align*}
$$

顺带一提，上面的论证显然可以立刻推广为：

>设 $\mathscr C$ 是一个局部小范畴，不要求其为小范畴。设
$$
i:\mathscr G\hookrightarrow \mathscr C
$$
>是一个小的满子范畴。假设：
>1. $\mathscr G$ 在 $\mathscr C$ 中稠密（或者，用本文的语言，$(G_i)$是一族稠密的生成元），
>2. $\mathscr G$ 在 $\mathscr C$ 中对有限余极限封闭。也就是说，由 $\mathscr G$ 中对象组成的有限图，其在 $\mathscr C$ 中的余极限存在仍属于 $\mathscr G$（或者，更弱地，$\mathscr G/C$是filtered）。
>
>设 $\mathscr E$ 是余完备范畴，并设
$$
F:\mathscr C\to \mathscr E
$$
>是 finitary functor，即 $F$ 保持 filtered colimits。则对每个 $C\in\mathscr C$，有自然同构
$$
F(C)
\cong
\int^{G\in\mathscr G}\mathscr C(G,C)\otimes F(G).
$$
>等价地，
$$
F\simeq \operatorname{Lan}_i(Fi).
$$
