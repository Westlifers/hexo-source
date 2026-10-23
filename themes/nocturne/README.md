# Nocturne / 夜曲

为 Yougi 杨荻设计的独立 Hexo 主题。主题概念是“数学家的夜间观测所”：一条没有内外的莫比乌斯带，与夜晚摩天大楼里的一盏灯。

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
- 首页以非对称文字与空间曲面开场，下接真实作品、时间列表和文章关系星图。正文进入侧边目录与单栏文字的安静布局。
- 日间阅读采用淡紫灰底色，首页雕塑和星图保留夜间舞台。

从作者真实文章中提炼“抽象结构 / 具体生活”的张力。没有沿用 Afterlight 的纸色、签名和首页排版。首页引文来自《做一首世俗的诗》和《Route Six》；摄影全部来自既有文章，压缩副本位于主题 `images/`，不改动原图。

参考研究：[Bruno Simon 的空间交互作品](https://bruno-simon.com/)与 [Codrops 实验视觉案例](https://tympanus.net/codrops/hub/all/page/3/)。借鉴空间交互和材质表现的思路；WebGL 曲面、交互和版式为本项目自行实现，没有复制参考站代码或素材。

## 功能与操作

- WebGL 莫比乌斯带：真实参数化网格、法线光照、暖冷反射、金属细纹和轨道。鼠标轻微控制视角，可暂停。无 WebGL 时显示内置 SVG。30 fps 上限、DPR 上限 1.6、手机降低网格密度，离屏/后台停止更新，尊重系统减少动画设置。
- 全文搜索：点击搜索、`Ctrl/⌘ K` 或 `/`；方向键选结果，Enter 打开，Esc 关闭。包括文章和关于页。索引只在使用时下载，内容以文本节点插入。
- 星图：连线代表真实共同标签或主题；点选文章显示摘要，再打开正文。提供主题筛选、键盘交互及普通链接列表，不需要 WebGL。
- 阅读：目录定位、进度、续读、字号切换、专注模式、收藏、复制链接、图片放大。收藏在空搜索窗口里显示。
- 收藏、阅读位置、字号与配色仅保存于当前浏览器；清理浏览器数据会删除记录，没有账号同步或上传。
- Route Six 点击后播放，页面加载不自动下载整首音频。音色模型及 AI 音乐说明仍在原歌曲文章里。
- 兼容 marked / Pandoc statement 两条数学路径、MathJax、TikZ、定理证明折叠与交叉引用、原诗歌版式、AI 使用说明和现有 Giscus 讨论映射。
- 评论按需加载；本地预览不会连接 Giscus。在线评论与 MathJax 依赖外部服务。

## 配置与维护

主题配置为 `themes/nocturne/_config.yml`。作者名字、简介、数学 CDN、评论仓库可在这里维护。首页三篇精选目前按真实源文件名在 `layout/index.ejs` 中选择，替换时修改对应 `n_post(...)` 和配图。文章照常添加，不需要补封面或新 front-matter。

如需覆盖文章的星图分组，可加：

```yaml
article_kinds:
  example.md: mathematics # essays / poetry / fieldnotes
```

目录和文章内资源的兼容处理在主题 scripts 中；原文章、资源和 URL 未改动。站点 `scripts/` 的三处主题判断让 Nocturne 使用自己的阅读组件，保留其他主题的原有注入路径。

## 检查范围

`check:nocturne` 检查实际构建报告、每篇文章正文、媒体、锚点、TikZ 图、AI 说明、索引成员与站内资源路径。它不替代真实浏览器的视觉、交互、外部服务与设备检查。具体本次验收结果见 `ACCEPTANCE.md`。
