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
- 首页以中文身份、英文场景和全宽弦图开场；珍珠白、淡金与冷银的细线沿真实连接缓慢流动。下接真实作品、时间列表和文章关系星图。正文进入侧边目录与单栏文字的安静布局。关于页采用大字姓名、悬浮人像、自然变换交换图与错落的个人介绍。
- 日间阅读采用淡紫灰底色，首页弦图和星图保留夜间舞台。

从作者真实文章中提炼“抽象结构 / 具体生活”的张力。没有沿用 Afterlight 的纸色、签名和首页排版。首页引文来自《做一首世俗的诗》和《Route Six》；摄影全部来自既有文章，压缩副本位于主题 `images/`，不改动原图。

参考研究：[Bruno Simon 的空间交互作品](https://bruno-simon.com/)与 [Codrops 实验视觉案例](https://tympanus.net/codrops/hub/all/page/3/)。借鉴空间交互和材质表现的思路；WebGL 图形、交互和版式为本项目自行实现，没有复制参考站代码或素材。

## 功能与操作

- DisCoCat 弦图：构建时直接生成完整 SVG，首帧与静态阅读不依赖 JavaScript 或 WebGL。增强后可悬停、点选或键盘聚焦词框，突出直接相接的线；支持方向键、Home/End、Enter/空格与 Escape。类型标记按需展开，原始 SVG 可独立查看。光只是沿连接移动的视觉效果，不代表训练过的语义模型在计算。离屏、后台和用户暂停时停止，尊重系统减少动态效果设置。手机先呈现全图，点击“放大读图”后可横向阅读。
- 全文搜索：点击搜索、`Ctrl/⌘ K` 或 `/`；方向键选结果，Enter 打开，Esc 关闭。包括文章和关于页。索引只在使用时下载，内容以文本节点插入。
- 星图：独立页面 `/atlas/` 与首页共用一张文章关系图；顶部四项导航统一跳转页面。选择子宇宙时镜头平滑聚焦到原图的对应区域，节点和连线位置保持不变，快速切换从当前镜头接续。连线代表真实共同标签或主题；点选文章显示摘要，再打开正文。提供键盘交互及普通链接列表，不需要 WebGL。
- 关于：保留全部自述、照片与原有锚点；人像随精细指针轻微倾斜，边框高光跟随。自然变换交换图的两条路径同步流动，离屏和后台暂停；减少动态设置下显示静态构图。
- 阅读：目录定位、进度、续读、字号切换、专注模式、收藏、复制链接、图片放大。收藏在空搜索窗口里显示。
- 收藏、阅读位置、字号与配色仅保存于当前浏览器；清理浏览器数据会删除记录，没有账号同步或上传。
- Route Six 点击后播放，页面加载不自动下载整首音频。音色模型及 AI 音乐说明仍在原歌曲文章里。
- 兼容 marked / Pandoc statement 两条数学路径、MathJax、TikZ、定理证明折叠与交叉引用、原诗歌版式、AI 使用说明和现有 Giscus 讨论映射。
- 评论按需加载；本地预览不会连接 Giscus。在线评论与 MathJax 依赖外部服务。

## 配置与维护

主题配置为 `themes/nocturne/_config.yml`。作者名字、简介、数学 CDN、评论仓库可在这里维护。首页三篇精选目前按真实源文件名在 `layout/index.ejs` 中选择，替换时修改对应 `n_post(...)` 和配图。文章照常添加，不需要补封面或新 front-matter。

### 首页句子试映

当前候选固定为 S、M、A、C、R、U、E、X、Y。原先六句推荐全部保留，E 是 `The city I watch is full of other people's evenings.`；X、Y 分别是窗光与千百人夜晚的新句。`home.string_candidate: X` 只是首轮试映的起点，尚未定稿。仅本地预览显示折叠的“试映中的句子”选择器，并接受 `?sentence=E` 等参数；正式页面只显示配置的句子。

数据与渲染分开：`source/nocturne/strings/candidates.json` 保存九句、原始端口、连续线、Cup/Cap/Swap 与来源；`raw/` 保存原始 SVG，`provenance/` 保存 CCG 和图数据。SVG 与浏览器共用同一渲染器。构建时另生成精简交互数据：九句试映约 75 KB，正式页面的 X 单句约 9 KB，不在浏览器加载解析模型。

复现导出（使用已安装的本地 lambeq 0.4.3 环境，不下载模型）：

```powershell
& E:/anaconda/envs/discocat/python.exe -B tools/export-nocturne-strings.py
node tools/nocturne-strings-check.cjs
```

导出器优先读取仓库中的 CCG；显式 `--reparse` 才重新使用本地 Bobcat 模型。原始图不做 rewrite。首页给纯 cup 图放柔曲率，E 的 cap/swap 图保留原路径，所有端口连接不变。几何检查对当前九句核对端口、输出、来源与采样交叉数；新增句子后需重跑并视觉检查，不能据此保证任意未来图的曲率都安全。`people` 与 `'s` 是两个真实词框，不为排版合并。

如需覆盖文章的星图分组，可加：

```yaml
article_kinds:
  example.md: mathematics # essays / poetry / fieldnotes
```

目录和文章内资源的兼容处理在主题 scripts 中；原文章、资源和 URL 未改动。站点 `scripts/` 的三处主题判断让 Nocturne 使用自己的阅读组件，保留其他主题的原有注入路径。

## 检查范围

`check:nocturne` 检查实际构建报告、每篇文章正文、媒体、锚点、TikZ 图、AI 说明、索引成员与站内资源路径。它不替代真实浏览器的视觉、交互、外部服务与设备检查。具体本次验收结果见 `ACCEPTANCE.md`。
