# Nocturne / 夜曲

为 Yougi 杨荻设计的独立 Hexo 主题。首页用一句关于城市与日常生活的英语，展开它真实的 DisCoCat 弦图：词语与组合结构一起成为夜曲的主视觉。

## 本地使用

```sh
npm run preview:nocturne
```

打开 http://127.0.0.1:4186 。预览独立写入 `.nocturne-preview/`，不修改正式 `_config.yml`、`public/`、`db.json` 或部署配置。原 Afterlight 与 Icarus 均保留。

```sh
npm run build:nocturne
npm run check:nocturne
node tools/nocturne-preview.cjs --build-only --root /journal/
node tools/nocturne-check.cjs --subpath
```

正式采用时将站点 `_config.yml` 的 `theme` 改为 `nocturne`。本次开发没有合并主分支、推送或部署。

## 设计系统

- 夜幕 `#15121b`：主要背景；灯室 `#201b27`：阅读控件和浮层。
- 瓷白 `#f0e9e4`：主文字；月灰 `#aaa0ac`：次要文字。
- 香槟 `#e9bf97`：金属高光与操作反馈；冷银 `#b6bddd`：数学空间。
- 中文标题与正文使用系统宋体序列；西文使用 Palatino / Georgia；导航使用系统无衬线字体。没有阻塞阅读的远程字体请求。
- 首页以无框英文排字和全宽弦图开场：句子直接悬在冷银弦线之上，中文译文落在图右侧留白。首次进入时描出连接，指向词语时相接的线掠过一道光；暖色只在选词与句子类型处点亮。下接真实作品、时间列表和文章关系星图。正文进入侧边目录与单栏文字的安静布局。关于页以姓名和自述为主，小幅肖像与山景随文呈现，保留自然变换背景与错落的个人介绍。
- 日间阅读采用淡紫灰底色，首页弦图和星图保留夜间舞台。

从作者真实文章中提炼“抽象结构 / 具体生活”的张力。首页句子结合《做一首世俗的诗》《上海、杭州游记》和《Route Six》的城市旁观意象创作；它不是文章原句的直接引用。摄影全部来自既有文章，压缩副本位于主题 `images/`，不改动原图。

参考研究：[Bruno Simon 的空间交互作品](https://bruno-simon.com/)与 [Codrops 实验视觉案例](https://tympanus.net/codrops/hub/all/page/3/)。借鉴空间交互和材质表现的思路；主题视觉、交互和版式为本项目自行实现，没有复制参考站代码或素材。

## 功能与操作

### 2026-10-25 整站升级

首页保留已选定的句文、银弦与“世俗的形状。”，后半段以城市长幅、白猫横幅和数学排字组成不等尺度的作品展示，随后接最近文章与星图。删去独立引言和重复阅读路线，作品区小标题采用“埋首之间，或流连街头”。页首签名沿用 Afterlight 的手写字形，微调笔画、尾线和留白，适配深浅配色。夜紫、瓷白、冷银、香槟色继续共用；中文宋体与西文 Palatino 保留，无新增远程字体、动画框架或 WebGL 依赖。

| 研究来源 | 在本主题中的取舍与落地 |
| --- | --- |
| [Maggie Appleton 的 Garden](https://maggieappleton.com/garden) | 借鉴多入口内容发现。归档提供真实主题、年份、标签、阅读时长排序与收藏；星图关系由真实元数据解释。 |
| [Josh W. Comeau 的文章站](https://www.joshwcomeau.com/) | 参考把可交互解释与文章主体结合的方向。保留真实 DisCoCat 图作为首页独特交互，数学正文的主要空间仍留给证明。 |
| [Gwern 的长文设计说明](https://gwern.net/design) | 长文工具按阅读需要出现：桌面章节轨迹、手机目录面板、选文后的摘录工具，避免常驻多排操作打断文章。 |
| [WebKit 原生跨文档转场](https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/) | 使用 CSS View Transitions 的短暂叠化和独立导航元素，不截获站内链接，不引入 PJAX。减少动态效果时不启用，浏览器不支持时正常导航。 |
| [MDN 原生 dialog 动画](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | 搜索和图片浮层使用 starting-style、display/overlay 的离散过渡；保留原生对话框行为。 |
| [WAI 键盘界面实践](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)与[对话框规范](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | 区分星图焦点与选中态，按空间方向移动节点；阅读面板关闭后恢复操作位置。 |
| [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API) | 音乐支持真实播放进度、键盘拖动和可用浏览器的媒体控制集成。只在用户播放后加载音频，无 JavaScript 时保留原生控件。 |
| [Atom 标准 RFC 4287](https://www.rfc-editor.org/rfc/rfc4287) | 构建 /atom.xml，覆盖已发布文章的标题、时间、摘要和原文链接；全站提供订阅发现链接，摘要不混入文章样式或脚本。 |

这轮也研究了 [Codrops 的动态排字转场](https://tympanus.net/codrops/2021/09/29/kinetic-typography-page-transition/)与 [content-visibility](https://web.dev/articles/content-visibility)。最终没有加入全屏遮挡转场或对数学正文的跳过布局：前者会打断频繁跳转，后者需要额外验证公式重排、锚点与续读位置。现有 SVG 继续承担主要视觉，新增动效优先回应人的操作。

- **归档**：完整文章列表、四主题、年份、标签、最新／最早／短篇排序；筛选可复制 URL。年份和排序采用主题化 combobox/listbox，支持键盘操作与原生 select 后备。收藏沿用本地存储，并呈现已有阅读进度。归档搜索标题、摘要与标签；全站搜索负责全文，并显示匹配位置附近的摘句和高亮。
- **阅读**：章节进度、上一节／下一节、手机目录；排版面板直接选择字号与行距。普通段落在构建时获得基于文本的稳定锚点，选择文字后可复制带出处的摘录或位置链接。原始正文不改写，原有锚点保留；包含公式的选区只提供位置链接。
- **星图**：实线表示共同标签或分类，虚线仅表示同主题；常态只展示稀疏线索，选中或悬停后显示该文的完整邻域，关联列表仍保留全部关系及依据。总览只显示每组少量标题，进入子宇宙后展开该组标题。主题、关系模式和文章路径可保存到链接中，支持刷新与历史恢复。图下不再重复展示图例和帮助文案，选中后仍提供完整关联及依据，普通文章列表后备保留。
- **声音与订阅**：Route Six 收入主页唯一的 Nocturne 页脚，采用紧凑唱片、播放按钮、进度与时长；支持时接入系统媒体控制。/atom.xml 可用于订阅，分享页面附标题、摘要和站点图片元数据。全站仍在本地预览阶段。

### 基础能力

- DisCoCat 弦图：构建时直接生成完整 SVG，首帧与静态阅读不依赖 JavaScript 或 WebGL。无框词语保留透明点击区域与清晰的键盘焦点标记，可悬停、点选或键盘聚焦，突出直接相接的线；支持方向键、Home/End、Enter/空格与 Escape。类型标记按需展开，原始 SVG 可独立查看。光只是沿连接移动的视觉效果，不代表训练过的语义模型在计算。入场描线与流光在离屏、后台和用户暂停时停止，尊重系统减少动态效果设置。手机先呈现全图与可读整句，点击“放大读图”后可横向阅读。
- 全文搜索：点击搜索、`Ctrl/⌘ K` 或 `/`；方向键选结果，Enter 打开，Esc 关闭。包括文章和关于页。索引只在使用时下载，内容以文本节点插入。
- 星图：独立页面 `/atlas/` 与首页共用一张文章关系图；顶部四项导航统一跳转页面。选择子宇宙时镜头平滑聚焦到原图的对应区域，节点和连线位置保持不变，快速切换从当前镜头接续。连线代表真实共同标签或主题；点选文章显示摘要，再打开正文。提供键盘交互及普通链接列表，不需要 WebGL。
- 关于：保留全部自述、照片与原有锚点；人像采用低调的小幅照片，取消倾斜双框与指针聚光。自然变换交换图的两条路径同步流动，离屏和后台暂停；减少动态设置下显示静态构图。
- 魔方成绩：关于页 Cubing 一节展示 WCA 个人最佳，2026-10-25 与 [WCA 数据](https://www.worldcubeassociation.org/api/v0/persons/2023YANG65)及[粗饼个人页](https://cubing.com/results/person/2023YANG65)核对。7 个有效项目的单次/平均、3 场比赛与 62 次成功复原作为静态快照保存在 `source/about/index.md`，不在访客浏览时请求第三方；更新时同步修改表格与核对日期。原文斜转 3.14 秒的非官方纪录单独保留。
- 阅读：目录定位、进度、续读、字号切换、专注模式、收藏、复制链接、图片放大。收藏在空搜索窗口里显示。
- 收藏、阅读位置、字号与配色仅保存于当前浏览器；清理浏览器数据会删除记录，没有账号同步或上传。
- Route Six 点击后播放，页面加载不自动下载整首音频。音色模型及 AI 音乐说明仍在原歌曲文章里。
- 兼容 marked / Pandoc statement 两条数学路径、MathJax、TikZ、定理证明折叠与交叉引用、原诗歌版式、AI 使用说明和现有 Giscus 讨论映射。
- 评论按需加载；本地预览不会连接 Giscus。在线评论与 MathJax 依赖外部服务。

## 配置与维护

主题配置为 `themes/nocturne/_config.yml`。作者名字、简介、数学 CDN、评论仓库可在这里维护。首页三篇精选目前按真实源文件名在 `layout/index.ejs` 中选择，替换时修改对应 `n_post(...)` 和配图。文章照常添加，不需要补封面或新 front-matter。

### 首页句子与弦图

首页使用已确定的句子：

> The city I watch is full of other people's evenings.

本地预览与正式页面使用同一幅 E 弦图。句子直接来自图数据，不通过主题配置、选择器或查询参数切换。

数据与渲染分开：`source/nocturne/strings/evenings.json` 是单个图对象，包含 `schemaVersion: 1`、E 的句文、原始端口、连续线、Cup/Cap/Swap、来源与 `method`。原始图为 `strings/raw/E.svg`，解析依据为 `strings/provenance/E-ccg.json` 和 `E-diagram.json`。构建时输出 `/nocturne/strings/evenings-runtime.json`，仅包含浏览器交互需要的数据。首帧 SVG 与增强后的图共用同一渲染器，浏览器不加载解析模型。

复现导出（使用已安装的本地 lambeq 0.4.3 环境，不下载模型）：

```powershell
& E:/anaconda/envs/discocat/python.exe -B tools/export-nocturne-evenings.py
node tools/nocturne-evenings-check.cjs
```

导出器优先读取仓库中的 CCG；显式 `--reparse` 才重新使用本地 Bobcat 模型。原始图不做 rewrite。首页独立调整展示曲率，保留 E 的 cap/swap 连通关系、端口次序与唯一交叉；几何检查核对端口、输出、来源、交叉所属线条与采样自交。修改图数据或渲染器后需重跑检查并复核视觉。`people` 与 `'s` 是两个真实词语节点，不为排版合并。

如需覆盖文章的星图分组，可加：

```yaml
article_kinds:
  example.md: mathematics # essays / poetry / fieldnotes
```

目录和文章内资源的兼容处理在主题 scripts 中；原文章、资源和 URL 未改动。站点 `scripts/` 的三处主题判断让 Nocturne 使用自己的阅读组件，保留其他主题的原有注入路径。

## 检查范围

`check:nocturne` 检查实际构建报告、每篇文章正文、媒体、锚点、TikZ 图、AI 说明、索引成员与站内资源路径。它不替代真实浏览器的视觉、交互、外部服务与设备检查。具体本次验收结果见 `ACCEPTANCE.md`。
