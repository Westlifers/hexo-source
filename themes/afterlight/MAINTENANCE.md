# Afterlight 日常维护说明

本文按 2026-10-16 的实际代码整理。所有路径均以博客根目录 `D:\code\projects\blog` 为起点；命令也在该目录运行。

## 常用入口

| 想修改什么 | 文件与位置 |
| --- | --- |
| 首页大标题、引言、照片说明 | `themes/afterlight/_config.yml` → `home` |
| 首页主照片 | 同上 → `home.image`；当前原图为 `source/img/selfie2.jpg` |
| 首页两篇精选及配图 | 同上 → `home.featured` |
| 签名、显示名称、页面描述回退文案 | 同上 → `brand` |
| “在日光与夜色之间”“最近写下的”“生活、文字与数学”等固定文字 | `themes/afterlight/layout/index.ejs` |
| 页头“首页／归档／关于”导航 | `themes/afterlight/layout/partial/header.ejs` |
| 页脚链接、署名 | `themes/afterlight/layout/partial/footer.ejs` |
| 关于页内容与照片 | `source/about/index.md` |
| 文章正文、标题、摘要和标签 | `source/_posts/` 下对应的文章文件 |
| 评论开关、仓库、分类、语言 | `themes/afterlight/_config.yml` → `comments` |
| 字体、配色、图片裁切位置 | `themes/afterlight/source/afterlight/theme.css` |
| 动效、操作反馈、手机布局补充 | `themes/afterlight/source/afterlight/refinements.css` |

注意区分两个 `_config.yml`：根目录的文件控制站点、网址、分页和正式主题选择；`themes/afterlight/_config.yml` 控制 Afterlight 的展示与功能。旧的 `_config.icarus.yml` 不控制新主题。日常维护应修改源文件，生成目录 `public/` 和 `.afterlight-preview/` 中的页面会在构建时被覆盖。

## 首页文字与文章

### 大标题、引言和主照片说明

在主题配置的现有 `home` 节点中修改相应字段，不要重复添加一个 `home`：

```yaml
home:
  introduction_post: 做一首世俗的诗.md
  title_lines:
    - 做一首
    - 世俗的诗。
  quote: 记录一些日常，与读书和做数学时产生的想法。
  image: /img/selfie2.jpg
  image_alt: 山与云之下的杨荻
  image_caption: somewhere beyond the blackboard
```

这是字段节选，编辑时保留下面已有的 `featured` 等配置。

- `title_lines` 每项占一行，第二行使用强调样式；当前布局按两行设计。
- `quote` 是大标题下方的文字。
- `introduction_post` 是“从这篇文字认识我”的目标文章源文件名，包含 `.md`，不带 `_posts/`。找不到文章时，这个链接会隐藏。
- `image_alt` 描述照片内容，供辅助阅读与图片无法显示时使用；`image_caption` 是照片下方可见的小字。

下列文字直接写在 `themes/afterlight/layout/index.ejs` 中，可以按原文搜索后修改：`A PERSONAL JOURNAL`、`从这篇文字认识我`、`在日光与夜色之间`、`最近写下的`、`全部归档`、`读下去`、`生活、文字与数学`、`关于我`。只改文字时保留周围标签、类名和链接表达式。

`brand.name` 用于浏览器标题、页头辅助说明和页脚名称；`brand.subtitle` 用于页面描述的回退，并不是首页可见的引言。文章信息栏的“杨荻”和页脚版权署名目前分别写在 `layout/partial/reading.ejs`、`layout/partial/footer.ejs`，不会随 `brand.name` 自动改变。

### 两篇精选

修改主题配置中的 `home.featured`。例如当前照片卡片：

```yaml
featured:
  - source: 日光之下，有一只白猫.md
    image: 1.jpg
    image_alt: 日光下抬头望向镜头的白猫
    label: 日光里的片刻
```

以上 `featured` 应保留在 `home` 下，并按现有文件缩进。`source` 使用文章源文件名；`label` 是卡片上方的小标题。可添加 `quote` 自定义卡片摘要；未填写时优先使用文章 `description`，再取正文摘要。文章标题直接来自文章头部的 `title`。

`image` 是该文章资源文件夹内的相对文件名：这里的 `1.jpg` 对应 `source/_posts/日光之下，有一只白猫/1.jpg`。此字段当前不支持直接填全站 `/img/...` 或外部网址。省略 `image` 会使用文字卡片。

当前最多显示前两篇能找到的精选文章，顺序与配置一致；只在首页第一页显示。新增第三项不会增加第三张卡片，扩展数量需要同时调整 `themes/afterlight/scripts/helpers.js` 和首页布局。精选不会从下方文章列表中移除。

### “最近写下的”列表

列表从真实文章自动生成，无需逐项维护。在文章开头的 YAML 信息中修改：

```yaml
title: 文章标题
description: 希望出现在列表中的简短介绍。
tags: [随笔, 生活]
categories: [杂谈]
```

将字段合并到现有的两行 `---` 之间，保留原有日期及其他字段。列表会展示全部标签；没有标签时展示全部分类。数学文章建议填写简短 `description`，否则主题可能主动留空摘要，避免显示公式源码。列表顺序与每页数量由根配置中的 `index_generator`（包括 `order_by`、`per_page`）控制。

已发布文章的日期、文件名和永久链接会影响网址；只改标题或正文时，通常不需要改这些字段。关于页直接编辑 `source/about/index.md`，它包含自定义 HTML 和局部样式，改文字时保留现有结构。

## 图片与签名

### 换首页主照片

1. 将新原图放在 `source/img/`，建议使用新文件名以保留旧原图。
2. 将 `home.image` 改为 `/img/新文件名.jpg`，同时更新 `image_alt` 和 `image_caption`。
3. 重新构建预览，检查桌面和手机上的取景。当前主图使用 `object-fit: cover`，裁切位置由 `theme.css` 中的 `.hero-photo img` 控制；精选图由 `.featured-image img` 控制，文件后面的手机规则也可能覆盖它。
4. 为新图重新生成优化文件，方法见下节。

模板 `themes/afterlight/layout/index.ejs` 的两个 `partial/home-image` 调用目前分别写有原图尺寸 `3712 × 5568`、`4344 × 5792`。更换不同尺寸照片时，也应更新对应 `width`、`height`；画框的实际显示尺寸仍由 CSS 决定。

### 保持图片加载速度

当前首页使用多尺寸 WebP，并以 JPEG 回退。原图保留在 `source/`；优化图和 `manifest.json` 在 `themes/afterlight/source/afterlight/images/`。它们是需要纳入版本管理的主题资源。

生成器为 `tools/afterlight-images.cjs`，顶部 `inputs` 定义原图路径、输出名称、宽度和质量。更换图片路径时，需同步修改这里的 `source`：它相对于根目录的 `source/`，不带开头斜杠。例如：

```js
{ source: 'img/new-portrait.jpg', name: 'hero', widths: [800, 1200, 1600, 2000], quality: 90 }
```

精选文章图片的路径形如 `_posts/文章文件名去掉扩展名/1.jpg`。修改已有项时保留其他需要的项；每次运行会重新写入整份清单。不同图片应使用不同的 `name`。

在已能加载 Sharp 的开发环境运行：

```powershell
node tools/afterlight-images.cjs
npm run build:afterlight
```

如果提示找不到 `sharp`，可先将 `AFTERLIGHT_SHARP_MODULE` 设为已有 Sharp 模块的绝对路径。本机当前可用的路径为：

```powershell
$env:AFTERLIGHT_SHARP_MODULE = 'C:/Users/Westlifer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'
node tools/afterlight-images.cjs
npm run build:afterlight
```

该路径是本机开发环境路径，换电脑或运行时升级后需重新确认。普通预览、构建和发布不需要 Sharp；只有重新制作图片时需要。生成器只读取原图，不覆盖原图。

不要手动编辑 `manifest.json` 的校验值。配置换了图片或原图内容改变后，主题会回退到原图，避免展示旧照片；此时显示可能正常，但优化尚未生效。重新生成后，检查首页图片请求是否来自 `/afterlight/images/`，并将新衍生图片与清单一起保留。生成器不会自动清除不再使用的旧衍生文件。

### 换签名

当前签名文件是 `themes/afterlight/source/afterlight/signature.svg`，由 `brand.logo: /afterlight/signature.svg` 引用。页头将其作为透明遮罩，颜色跟随浅色／深色文字。因此应保留透明背景和清楚的签名轮廓；SVG 自身的颜色不会成为页头签名的颜色，带不透明底色的图片会产生矩形遮罩。

## 导航与页脚

导航目前不是配置列表，而是 `themes/afterlight/layout/partial/header.ejs` 中的三个链接。改标签文字即可重命名；新增站内链接时沿用 `url_for`，以兼容子路径，例如：

```ejs
<a href="<%= url_for('/about/') %>" <%- page.path === 'about/index.html' ? 'aria-current="page"' : '' %>>关于</a>
```

添加新页面时同时创建对应内容源文件，并为链接设置正确的当前页判断。不要只加链接而没有目标页面。手机导航目前为两行布局，链接变多或名称变长后应重新查看窄屏效果。

页脚在 `themes/afterlight/layout/partial/footer.ejs`。左侧名称来自 `brand.name`，版权年份自动更新；“翻翻旧文”和版权署名在模板内修改。右上角搜索按钮受主题配置 `search.enable` 控制；配色按钮保持浅色／深色二选。

## 评论

在 `themes/afterlight/_config.yml` 中维护 `comments`：

| 字段 | 作用 |
| --- | --- |
| `enable` | 全站文章评论开关，`true` 开启，`false` 关闭 |
| `repo`、`repo_id` | Giscus 绑定的 GitHub 仓库名称及对应 ID |
| `category`、`category_id` | 讨论分类名称及对应 ID |
| `mapping` | 文章与讨论的匹配方式，当前为 `pathname` |
| `lang` | 评论界面语言，当前为 `zh-CN` |

名称和 ID 要成对匹配。沿用现有仓库时无需修改；迁移时用新仓库对应的 Giscus 配置值，不要只改显示名称。当前按网址路径关联讨论，修改 `mapping` 或文章路径可能使旧评论无法匹配。

单篇文章关闭评论：在该文章开头的 YAML 信息内添加 `comments: false`。当前模板只在文章下方显示评论，关于页等普通页面不显示评论区。

正式网站点击“展开评论”才连接 Giscus；配色自动跟随页面。没有历史评论时保留正常空评论框，其他加载错误会显示重试。本地隔离预览主动禁用评论，浏览器脚本也会拦截本机地址，因此本地看不到评论框是预期行为，不要为了预览移除这些限制。

涉及评论功能代码时，入口是 `themes/afterlight/layout/partial/comments.ejs` 和 `themes/afterlight/source/afterlight/comments.js`；离线回归脚本为 `tools/afterlight-comments-check.cjs`，需要 Playwright。真实登录和提交评论不属于本地检查。

## 其他样式与功能入口

| 文件或主题配置字段 | 用途 |
| --- | --- |
| `theme.css` | 基础配色变量、字体栈、首页与正文布局、裁切位置 |
| `components.css` | 搜索、阅读工具、目录、图库、AI 说明、评论区 |
| `refinements.css` | 后续覆盖与细化规则、动效、移动端、打印适配 |
| `math.css`、`math.js` | 数学内容、证明折叠与互链、公式加载反馈 |
| `search.enable`、`search.include_pages` | 搜索开关、是否索引普通页面；文章内 `search: false` 可排除单篇 |
| `gallery.enable` | 图片浏览开关 |
| `reading.tools` | 右下角阅读工具开关 |
| `article_modes` | 特定文章的展示模式，键为源文件名，普通文章一般无需配置 |

表中的 CSS／JS 均位于 `themes/afterlight/source/afterlight/`。改颜色时同时查看浅色与深色变量；改字体时注意当前使用系统字体栈，没有远程字体下载。若基础 CSS 修改后没有生效，检查 `refinements.css` 和文章自身的局部样式是否覆盖。动效保留“减少动态效果”偏好的适配。

## 修改后的本地预览

首次启动预览：

```powershell
Set-Location D:\code\projects\blog
npm run preview:afterlight
```

浏览器打开 `http://127.0.0.1:4173/`。服务只监听本机，不会部署。当前不自动监视文件变化；服务已运行时，在另一个终端重新生成后刷新页面即可：

```powershell
npm run build:afterlight
```

若要重启，先在原终端按 Ctrl+C。端口被其他程序占用时，可运行 `npm run preview:afterlight -- --port 4174` 并打开对应端口。不要同时启动多个构建或写同一个预览输出。

修改后按涉及范围查看：首页、文章、关于页和导航目标；浅色与深色；桌面与手机宽度；照片裁切、文字换行和横向溢出。普通文案修改通常只需重建并目视检查。涉及交互逻辑时，再按 [主题 README 的开发检查说明](README.md#开发检查) 运行对应回归。

继续使用独立分支维护，可本地提交；未经明确要求，不合并到 `master`、不推送、不运行部署。仓库当前对 `master` 的推送会触发自动发布，因此推送本身也是发布动作。预览只写忽略目录 `.afterlight-preview/`，无需提交生成页面。
