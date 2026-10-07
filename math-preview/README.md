# 数学排版实现与验收

2026-10-07（北京时间）：阅读模式与数学排版已在同一工作区完成合并；两篇指定数学文章已迁移，其他文章继续使用 marked。源码与截图审核已通过，获准发布；Icarus 主题源码、站点配置和 npm 依赖未修改；CI 的 Pandoc 安装版本固定为 3.1.11.1。
阅读补丁来自用户直接上传的 reading-mode-041b923.patch（29,187 字节，SHA256 8563c6383dadf30a86cabd9bcbae42136a76ce9bc5837b5e0531b3f5134fd7fc），仅新增预期三个站点文件。历史材料化阻塞已由直接上传解决。

## 实现

- `scripts/statement-renderer.js`：仅 `engine: statement` 的文章交给 Pandoc 和固定版本 Statement Lua；执行前校验哈希，超时 30 秒。保留 HTML 岛，待 Hexo 提取 more 后包裹正文与摘要。仅在送入 Pandoc 的数学片段中解码旧稿 ampersand HTML 实体，保持与原浏览器相同的 TeX。继承 Icarus 全局布尔插件开关，保持 PJAX 页面选择器一致。
- `math-preview/statement.yaml`：中文环境名称，共享编号；证明不编号。
- `source/css/math-statements.css`：灰蓝与中性浅色层次、锚点高亮、手机局部滚动。
- `source/js/math-statements.js`：原生 details 证明默认展开；宽公式与 TikZ 图局部滚动；适配异步 MathJax 和 PJAX。
- `source/_drafts/math-statements-preview.md`：未发布验收草稿，展示环境、交叉引用、证明、宽公式、真实 TikZ 图、脚注。

官方 hexo-renderer-pandoc 会全局接管 Markdown，因此未安装，采用最小单篇适配器。
已迁移 `integral-quantaloids-weak-tabularity-topos.md` 和 `bounded-q-valued-sets-cartesian-closedness-topos.md`。保留原标题、日期、分类、标签、AI 声明、more、原章节锚点、外部链接及数学论证。增加渲染开关、语义环境和八处自动交叉引用；去除两篇稿件的行内 raw/span 及显示公式 raw/div 包装，使用 Pandoc 原生数学段落。所有公式源码字节及顺序不变。

## 阅读模式与整合修复

- `scripts/reading-mode.js`、`source/css/reading-mode.css`、`source/js/reading-mode.js`：独立站点扩展，48px 可收起/拖动工具、专注布局、目录、当前位置高亮、键盘操作和会话位置保存。
- 阅读工具、目录与数学框共用克制灰蓝变量。数学容器在两种布局中负责局部滚动。
- 工具挂载在 body，避开 Icarus 文章入场动画的 transform；修复按钮暂时缩放、拖动坐标偏移及小屏溢出。
- 保留 Insight 已初始化的搜索框节点跨 PJAX 导航，修复主题原有的搜索框替换后事件指向旧节点问题。未修改主题源码。

## 写作语法

front matter 增加 `engine: statement`，仍使用 `plugins: { mathjax: true }` 与需要的 `tikzjax: true`。

```markdown
::: {.theorem #thm-product}
定理内容。
:::

参见 [](#pre:thm-product)。

::: {.proof #proof-product data-proof-of="thm-product"}
证明内容。
:::
```

可选类别：`.definition`、`.lemma`、`.theorem`、`.proposition`、`.corollary`、`.remark`、`.example`、`.proof`。ID 应唯一稳定，不能以自动编号充当标签。
采用类别在前的属性顺序，避免紧邻左花括号的井号被 Hexo 识别为模板注释。以上围栏与引用写法已在草稿和两篇迁移文章实际验证。
HTML 岛内部 Markdown 不展开；需要 Markdown 的内容使用 fenced div。证明在禁用 JavaScript 时仍完整显示。

分开的证明用 `data-proof-of` 明确指定同篇文章中的命题 ID；不能用自动编号，也不按相邻位置推断。一个定理分成多个证明时，各段再写 `data-proof-part`：

```markdown
::: {.proof #proof-product-forward data-proof-of="thm-product" data-proof-part="充分性"}
这一方向的证明。
:::

::: {.proof #proof-product-backward data-proof-of="thm-product" data-proof-part="必要性"}
另一方向的证明。
:::
```

直接相邻且唯一的证明仅显示可链接的“证明：引理 4”等折叠标题，省略重复的证明目标与位置。隔着标题、说明文字，或同一命题有多段证明时，站点脚本仍在证明前显示指向命题的“证明目标”，并在命题末尾列出所有“证明位置”；点击后会展开目标证明。只有显式且有效的对应关系才添加链接，不会自动关联未声明或不存在的命题。禁用 JavaScript 时仍保留原有命题和完整证明正文。

正常构建排除验收草稿；本地先 `npx hexo clean`，再 `npx hexo generate --draft` 可查看；切回正常构建也先 clean，以免沿用不同草稿状态的缓存。保留逐篇 opt-in，不推断其他历史文章适合整体迁移。

## 验证与证据

- Hexo clean + generate 成功；草稿默认不发布。`git diff --check` 与源码补丁 `git apply --check` 通过。
- `evidence/migration-audit.json`：规范化环境与八处引用标记后，两篇正文逐字相同；164／232 个公式的字节及顺序完全相同，元数据、原 URL、more 和旧章节锚点保留。
- `evidence/migration-browser.json`：真实 Chromium 桌面与 390px 手机渲染、公式、交换图、默认展开与折叠证明、引用定位、旧锚点；无 JavaScript 或 MathJax 错误，无手机整页横向溢出。
- `evidence/paragraph-content-audit.json`：所有 proof summary 使用默认“证明”；WT→RI 与 RI→WT 方向保留在正文，顺序不变。扫描无脱离段落的行内公式；原公式与浏览器 MathJax 输入逐条比较（仅规范化旧 HTML 实体与空白）。
- `evidence/no-stale-scroll.json`：点击引用后滚到另一章节，再插入/展开/替换固定工具 DOM 和开合其他证明，不回跳旧 hash。模拟工具不冒充未合并的阅读模式。定位仅由导航、新正文插入和排版完成触发。
- `evidence/layout-matrix.json`：两篇文章在 320／390／768／1440／1920 屏宽均无整页溢出，记录每个公式和图容器边界；各完成十次证明切换。
- `evidence/resize-hash-qa.json`：浏览器 DOM 控制用例验证过宽行内公式在 320px 包裹、1920px 恢复文本流；折叠证明内 hashchange 与后退定位通过，跨页真实 PJAX 定位至文章证明通过。修复 Icarus 将数字缓存参数追加到 hash 的情况。控制用例不修改文章源稿。
- `evidence/pjax-browser.log`：首页进入数学文章、后退和前进保持页面状态，公式数量正确。此日志属于较早在线验证，最终离线回归另见下项。
- `evidence/qa-offline-browser.json`：最终离线核心回归只允许 localhost HTTP，不使用证书忽略参数；本地 MathJax、字体、公式、证明、交换图、Route Six 图片和十个诗节、音频加载通过，无脚本或本地资源错误。
- 早期在线截图运行使用过证书忽略参数，不能作为正常 TLS 连接验证。最终离线回归不使用该参数；后续在线连接遇证书错误应记录失败并停止该连接。
- `evidence/migrated-*-desktop-full.png`、`migrated-*-mobile-full.png`、`migrated-*-collapsed.png` 为两篇实际构建全文和折叠截图。
- `evidence/qa-offline-*-desktop-full.png` 为最终离线桌面全文截图。`v2-*` 为专用草稿的引用定位、公式及图横向滚动截图；对应审计为 beautify-acceptance.json、beautify-diagram-scroll.json。

四篇早期兼容样例包括两篇数学文章、Munkres 第 5 章和 Route Six。Munkres 原稿无脚注调用，脚注由专用验收草稿验证；Route Six 原稿未修改。兼容副本已移出 source。
静态 ZIP 携带七个验收页面关联媒体、MathJax 和字体，解压后以 `python -m http.server 8000` 预览。评论依赖网络；历史页面未打包全部媒体。此包是验收包，不是部署包。
整合证据位于 `evidence/integrated/`：20 个布局（两篇 × 普通/专注 × 五屏宽）无整页溢出，逐一记录所有公式和 SVG 边界；每篇十次证明开合、十轮前进后退、首页无残留或重复控件、搜索四条结果通过。鼠标四角、触控拖动及点击、键盘移动/重置、会话位置、实际 Munkres 长目录独立滚动、目录当前项、关闭证明内的引用及无旧 hash 回跳通过。
安全区使用非零 inset 的 DOM 控制用例；headless Chromium 不能证明真机刘海屏表现。引用内部目标与过宽行内公式也有明确标注的 DOM 控制用例，未改文章源稿。
联机 Giscus 在离线测试中被阻止，仅确认原评论容器与脚本挂载保留，不声称完成在线评论加载或提交测试。Route Six 图片/HTML、音频和既有 Munkres 公式回归通过。
离线 QA 草稿位于 `/qa/math-statements-preview/`，仅存在于验收包；生产输出及搜索索引排除该草稿。
父任务最终审核通过，用户明确批准正常推送 Westlifers/hexo-source master 并触发自动部署。实际发布结果以对应 commit 的 CI 与线上核验为准。

## 版本与来源

Hexo 7.3.0；Icarus 6.1.0；marked 6.3.0；TikZJax filter 1.0.2；hexo-reference 1.0.4；Pandoc 3.1.11.1；MathJax 3.2.2；Playwright 1.62.1；Chromium 151.0.7922.173。
Statement 0.5.1，MIT，commit `57d3f2b94520ec5013735af33d14e4d536686664`；Lua SHA256 `1e9e378702abb8d596872e9f7bd575dc84ac9e80602856acdf166d6fcab11f88`。用户已批准该 Lua 的下载与测试执行。
构建机需要 Pandoc；现有 GitHub workflow 原来默认 latest，现使用官方 action 的 pandoc-version 输入固定为已验证的 3.1.11.1。未执行工作流或部署；实际 CI 运行结果仍待获准推送后确认。
来源：https://github.com/dialoa/statement 、https://dialoa.github.io/statement/ 、https://github.com/hexojs/hexo-renderer-pandoc 。
