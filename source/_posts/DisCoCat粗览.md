---
title: DisCoCat粗览
date: 2024-11-03 14:32:30
tags: [应用范畴论]
plugins: 
    mathjax: true
---

DisCoCat(Categorical Compositional Distributional Semantics)是一种使用范畴论来为自然语言提供语义解释的模型，我的导师让我阅读相关的文献做一个综述，作为我的本科毕业论文。我此前对NLP基本一无所知，所以我感觉这对我可能算是一个比较大的挑战，这也是我第一次认真进行科研活动，希望能做得尽量好。我目前粗读了几篇文章，感觉这个模型虽然实用性不大，但能将范畴论用在这个方面也算有点意思，所以打算开个文章简单介绍一下它，也算对我的思路做个梳理。

<!--more-->

# 语法——Pregroup Grammar
我们首先需要一个重要的概念：预群（Pregroup）。一个预群是一个偏序集且是幺半群$(G,\cdot,1)$，满足每个元素$x$都有左、右伴随$x^r,x^l$，使得
$$
\begin{cases}
    xx^r\le1,\\\\
    x^lx\le1,\\\\
    x^rx\ge1,\\\\
    xx^l\ge1
\end{cases}
$$

1999年，Lambek首先提出了Pregroup grammar[^1]，这是一种将自然语言的语法编码成一种有伴随结构的偏序集的方法，主要思想是这样的：在一个自然语言中，有着一些基础类型（Type），构成一个集合（或者偏序集）$B$，然后用$B$去自由生成一个Pregroup $\mathscr{P}(B)$。随即在这个结构里指定一个特殊的类型$s$，称作句类型（sentence type）。我们然后为这个自然语言的每个单词$w$指定一个类型$T\in\mathscr P(B)$。在这些操作之后，一个句子作为一串单词的组合$w_1...w_n$，就自然拥有一个类型$T_1...T_n$，假如$T_1...T_n\le s$，我们就认为这个句子符合语法（grammatical）。基于$B$中的基本序关系和预群公理的将复合类型$T$不断消去为$1$的过程称为类型推导（Type reduction）

总结来说，一个Pregroup grammar就是一个四元组$G=(B,\Sigma,\Delta,s)$，其中，$B$表示基础类型的集合（偏序集），$\Sigma$表示词汇表，即所有的单词，$\Delta\subset\Sigma\times\mathscr P(B)$是一个关系，称作字典，也就是为单词分配类型，最后$s\in\mathscr P(B)$表示句类型。

但是敏锐的人可以发现，依赖自由预群的方法有一个明显的缺陷：即无法区分同一句子的不同的类型推导。举个简单的例子：*men and women whom I liked*. 这句话明显是有两种意思，根据whom的修饰对象确定，也就是说它有两种可能的语法结构，Pregroup grammar必须要对此作出区分。

假设以下基本类型：$\pi_1,\pi,s_2,s,p$以及偏序关系$s_2\to s,\pi_1\to\pi$，并为单词分配合适的类型（这里省略）。则以上例句的语法正确性由下式保证：

$pp^r \quad p \quad p^lpp^rp \quad o^lls^lπ_1π^r \quad s_2 \quad o^l \to p$

而如果仔细检查语法推导过程，可以发现存在两种推导方法（我用括号标出关键不同之处），这似乎对应了两种语法结构。

$pp^r \quad p \quad p^l(pp^r)p \quad o^lls^lπ_1π^r \quad s_2 \quad o^l \to p$

$pp^r \quad p \quad (p^lp)p^rp \quad o^lls^lπ_1π^r \quad s_2 \quad o^l \to p$

可惜在自由预群的视角下，推导过程并不重要，只有大小关系而已。后来（2010年之后）Anne Preller提出应当使用自由刚性范畴代替自由预群[^2]。这是非常天才且关键的观察，根据她的具体构造方法，不同的推导过程天然地被区分开了。




# 语义——Semantics

有了这做基础，我们可以继续为Pregroup grammar赋予语义。2010年时，Bob Coecke使用$\mathscr P(B)\times\mathbf{FVect}_\mathbb{R}$这个范畴为一个句子赋予语义[^3]，他的方法后来被称为Product Space Representation。

但结合后来者的工作，这种表示方式实在有些不自然。现在常用的赋予语义的方法是首先给定一个预群语法$G$，我们作一个*词汇范畴*（Lexical category）$\mathscr L(G)$来同时编码语法与词汇（作法后面详说），然后选定一个语义范畴（Semantic category），通常的选择是$\mathbf{FVect}_\mathbb{R}$。于是乎，只要给出一个强幺半函子（还要求保持所有刚性结构，注意$\mathbf{FVect}_\mathbb{R}$也是刚性的，只是左右伴随相等），我们基本上就做到了把单词的语义组合为句子的语义。

虽然Preller最初给出的是对任何一个范畴自由生成刚性范畴的方法，但我们需要的并不是此，而是Antonin Delpeuch（这位老哥现在已经离开学术界多年了）在2014年提出的幺半范畴的*自守化*[^4]，基本思想差不多，但后者对幺半范畴做，且使得生成的范畴的幺半结构保持为原本的。

词汇范畴的构造简要来说是先对偏序集$\mathscr{P}(B)$作范畴化，将此范畴幺半化，然后根据字典$\Delta$往其中添加所谓的Lexical morphisms（但实际上刚才定义的字典是不够的，我与曾经在此领域工作的一位学者讨论了一下，他认为lexical morphisms are beyond the lexicon，也就是说我们需要假设更多的信息），最后对得到的幺半范畴作自守化。

其实，是否需要自守化，取决于模型的复杂程度。如果我们的语法中每个词对应的lexical morphism仅仅是基本类型间的箭头，那我们根本不需要自守化：自由刚性范畴就够了。这也解释了为什么有些文献中meaning morphism也可以用正规图来表示，而有些文献中meaning morphism却很复杂，不是正规的图表示。

### Product space representation
先不使用词汇范畴的概念，传统的做法是这样的：首先对$\mathscr P(B)$自由生成一个刚性范畴得到语法范畴$\mathscr C(B)$。然后选定一个语义范畴，这里用$\mathbf{FVect}_\mathbb{R}$来做示范。考虑乘积范畴$\mathscr C(B)\times \mathbf{FVect}_\mathbb{R}$，然后为每个基本类型$T$取定一个对应的线性空间$N_T$，而词汇$w$本身是一些通过分布式语义的方法得到的词向量$\vec w$，它们存在于对应类型对应的空间中。现在任意给一个句子$p=w_1...w_n$，为了得到句子的词向量$\vec p\in N_s$，我们：
1. 为每个词$w_i$确定一个类型$T_i$
2. 在范畴$\mathscr C(B)$中确定一个type reduction$f:T_1...T_n\to s$，对应地，选择一个线性映射$g:N_1\otimes...\otimes N_n\to N_s$
3. 计算$g(\vec{w_1}\otimes...\otimes\vec{w_n})=\vec p$

### PS revisited
我已经提到，虽然现在人们常用强幺半函子来表示语义，但这个模型需要假设比一个经典预群语法更多的信息。那么，如果我们有一个函子模型，能不能还原出一个PS模型（乘积空间）呢？答案是能[^5]，但需要一些范畴论的办法。简单介绍如下：




# From Sentences to Discourses

以上，我们只能把单词的含义通过语法结构组合为单独句子的语义，但实际文本中，句子之间是有着必然联系的。有人试着向这个方向探索。




# 思想实验

本来想给这节起名为应用场景的，但就我目前看到的文献来说，很难说DisCoCat有什么有价值的实际应用。大部分相关文章本质上都是在做思想实验，涉及到的例子都是极小规模的，比如只有两三个基本类型，包括至多四五个单词，词的类型都是人为规定，而语句都是简单的如SVO型句子，而词的含义也处在简单的一二维向量空间中。按理来说如果想将这个模型应用到实际中，必须使用机器学习算法从大量文本中提取字典和词义，词义应当处在一些相当大维数的空间中。目前似乎也有人做了这样的实践，Alexis Toumi开发的DisCoPy。





[^1]: Lambek, J. Pregroup Grammars and Chomsky’s Earliest Examples. J of Log Lang and Inf 17, 141–160 (2008). https://doi.org/10.1007/s10849-007-9053-2
[^2]: Preller, Anne & Lambek, Joachim. (2007). Free Compact 2-Categories. Mathematical Structures in Computer Science. 17. 10.1017/S0960129506005901. 
[^3]: Coecke, Bob & Sadrzadeh, Mehrnoosh & Clark, Stephen. (2010). Mathematical Foundations for a Compositional Distributional Model of Meaning. Lambek Festschrift Linguistic Analysis. 36. 
[^4]: Delpeuch, Antonin. (2014). Autonomization of Monoidal Categories. 
[^5]: Bradley, Tai-Danae & Lewis, Martha & Master, Jade & Theilman, Brad. (2018). Translating and Evolving: Towards a Model of Language Change in DisCoCat. Electronic Proceedings in Theoretical Computer Science. 283. 50-61. 10.4204/EPTCS.283.4. 