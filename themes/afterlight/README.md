# Afterlight

个人 Hexo 博客主题的本地预览。第一阶段视觉风格已确认，第二阶段已接通阅读工具、搜索、数学增强、AI 说明和图片浏览；第三阶段首轮细化了动效、操作反馈和移动布局。评论组件已接入，线上联调留待发布前。白猫随笔按用户新稿替换为四段，其余文章与全部媒体源文件保留。

## 本地预览

在博客根目录运行：

```sh
npm run preview:afterlight
```

打开 http://127.0.0.1:4173/ 。预览只监听本机，重新运行前先停止已有进程。更换端口可运行 `npm run preview:afterlight -- --port 4174`。

只构建、不启动服务：

```sh
npm run build:afterlight
```

生成页面位于 `.afterlight-preview/afterlight/`，构建清单位于 `.afterlight-preview/build-afterlight.json`。临时配置与独立缓存也位于这个已忽略目录，不改动正式的 `public/`、`db.json` 和站点主题选择。修改模板或配置后重新执行构建，刷新浏览器即可查看；当前服务不自动监视文件变化。

## 可调整的设计入口

- `_config.yml`：签名、首页标题与引言、主图、精选文章及作品类型。
- `source/afterlight/theme.css`：颜色、字体、间距、阅读宽度、响应式布局与既有作品的局部适配。
- `source/afterlight/signature.svg`：手绘 Yougi 矢量签名。页头将透明 SVG 作为遮罩，使用当前文字颜色，浅深背景共用同一份轮廓；替换时也应使用透明背景的轮廓素材。
- `layout/index.ejs`：首页构图。
- `layout/partial/reading.ejs`：文章与普通页面的阅读框架。
- `source/afterlight/components.css`：搜索、阅读工具、目录弹层、图片浏览、AI 说明及评论区的样式。
- `source/afterlight/refinements.css`：第三阶段的层次、操作状态、过渡、手机导航与特殊作品的主题适配。
- `source/afterlight/{reading,search,gallery,math,comments}.js`：各自的页面交互；共用原生 dialog 的关闭与焦点管理。

精选文章按源文件名关联到真实 Hexo 文章。相对封面文件名按该文章的实际生成路径解析；没有图片时使用文字版式。普通文章无需新增任何字段。首页时间列表遵循 Hexo 分页，第一页的精选不会删减列表中的文章。

列表展示每篇文章的全部标签，没有标签时展示全部分类。桌面端右对齐并允许换行，900px 及以下移到标题区域下方。

中文标题与正文优先使用 Noto Serif SC，界面优先使用 Noto Sans SC；英文正文与诗歌搭配 Georgia。当前使用系统已安装字体，不加载远程字体；缺少这些字体的设备会使用后续字体栈。跨设备统一字体及字体文件精简留待发布前处理。

## 目前的功能边界

阅读工具位于文章与普通页面的右下角，支持专注阅读、目录、回到顶部和位置重置。可鼠标／触摸拖动；聚焦工具按钮后，Alt＋方向键移动、Home 重置、Escape 逐层收起。专注状态与工具位置在当前标签页会话中保存，不影响首页、归档和搜索页。目录支持当前章节高亮、焦点恢复与移动端弹层。

搜索通过导航放大镜或 Ctrl／Command＋K 打开，索引已发布文章和关于页的标题、正文、标签及分类；不包含草稿。`search: false` 可逐篇排除。搜索索引按需从本站加载，无第三方搜索服务；提供失败重试与空结果状态。

文章图片可点击或键盘打开，左右方向键切换，Escape 关闭；原有指向其他页面的图片链接保留。图片或祖先标记 `data-no-gallery`／`.no-gallery` 可退出图库。公式与交换图不进入图库。

图库支持手机横向滑动切图、加载与失败反馈，固定展示区减少切换时的布局跳动；纵向滚动与双指缩放保持浏览器行为。搜索提供命中高亮和加载状态。阅读工具切换专注、重置位置时显示短暂反馈。

动效集中在首页轻微入场、卡片悬停、按钮按压、手动配色切换、弹层开合与图片载入；不等待滚动才显示正文。CSS 和 JavaScript 均响应 `prefers-reduced-motion`。手机导航采用签名／功能按钮与导航链接两行布局，主要按钮至少 44px 高；弹层根据可视视口高度调整。

Pandoc／Lua 内容生成仍属于站点渲染器；证明折叠、证明互链、目标锚点展开和局部数学滚动由主题内的 `math.js`／`math.css` 负责。MathJax 由主题统一初始化，每篇正文只主动排版一次。普通页面导航替代 PJAX，无需原 Insight 节点恢复或 PJAX 缓存锚点修复。

AI 说明在文章标题信息区由模板渲染一次。`lib/ai-disclosure.cjs` 为两主题共享原等级及默认文案；原 `ai.note` 中的作者 HTML 链接保留。Afterlight 停止旧正文注入，Icarus 继续原来的显示方式。

配色仅有浅色和深色，首次默认浅色；旧版本保存的“随系统”偏好按浅色处理。手动选择会保存，操作系统的配色变化不会再改变页面。

Giscus 沿用原仓库、讨论分类及 `pathname` 映射，正式站点上点击“展开评论”才加载，配色随主题更新；实现依据 [Giscus 的配置消息接口](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#parent-to-giscus-message-events)。预览构建自动设置 `afterlight_preview: true`，浏览器另有本机地址检查，因此本地不连接评论服务。已用完全拦截网络的模拟客户端验证加载、失败重试和主题通信；尚未验证线上讨论读取、登录及提交。

MathJax 与 TikZ 字体沿用现有 CDN 依赖。本文档不承诺离线数学渲染；文章及图库保留原图，首页使用下面说明的响应式衍生图。已抽测本地 `/simple/` 子路径的搜索、导航和数学资源，目标 CI、线上评论、完整发布元信息和实体手机验收仍留待后续阶段。

## 首页图片

主照片和白猫精选卡片使用原生 `picture`、`srcset` 和 `sizes`，优先 WebP，以 JPEG 回退。主照片优先加载，精选图延迟加载。只缩放和编码，不预裁切；原有 CSS 裁切、定位、画框与动画继续生效，文章中的原图链接不变。

衍生文件及校验清单位于 `source/afterlight/images/`。主照片提供 800/1200/1600/2000px，白猫提供 480/800/1200/1600px；最低山景尺寸与质量经过画面对照，保留树木、衣服和山脊细节。模板识别已知原图来源；更换配置图片或原图内容后，会回退到新原图，避免误用过期衍生图。

准备新衍生文件时，在仓库根目录运行 `node tools/afterlight-images.cjs`，然后重新构建预览。脚本需要 Sharp，可设置 `AFTERLIGHT_SHARP_MODULE` 指向开发环境已有模块；未添加部署依赖。衍生文件直接纳入版本管理，普通 Hexo 构建不执行图片转换，也不要求安装 Sharp。原图只读，绝不覆盖。

2026-10-16 本地实测：两张原图合计 12,146,739 字节；普通桌面选择 148,792 字节，2× 桌面 259,332 字节，390px/3× 手机 295,072 字节。下载字节减少约 97.6%–98.8%；这不是对线上实际加载秒数的承诺。已核对原图 SHA-256、响应式文件选择、无重复原图请求、WebP 不受支持时的 JPEG 回退、无脚本显示、原裁切尺寸以及子路径资源地址。

## Icarus 与 Git

站点 `_config.yml` 仍选择 Icarus，旧主题继续正常使用。旧阅读、数学前端资源和 AI 正文注入仅在 Afterlight 下停用；原前端文件完整保留，Icarus 仍使用它们。没有修改依赖目录或文章源文件。

可用下面的命令在独立目录验证旧主题：

```sh
node tools/afterlight-preview.cjs --build-only --theme icarus
```

Git 仅允许本地提交。除非用户明确要求，不推送、合并到主分支或部署。

## 开发检查

先构建两个独立输出，并启动 Afterlight 本地预览，再运行 `npm run check:afterlight`。检查工具需要开发环境的 Playwright 和本机 Chrome；可以用 `AFTERLIGHT_PLAYWRIGHT_MODULE` 指向已有 Playwright 模块，`AFTERLIGHT_BROWSER` 选择浏览器 channel。没有将浏览器测试包加入博客的发布依赖。

检查覆盖文章内容与旧主题对比、全部本地链接、搜索、证明锚点、阅读状态、拖动、触摸、图库、40 个响应式状态、音频、无脚本与禁用存储的降级。结果写入忽略目录 `.afterlight-preview/phase-two-checks.json`；完整阶段记录见 `afterlight-planning/PHASE_TWO.md`。
