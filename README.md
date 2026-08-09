# 室友捉虫办

一个无需安装依赖的中文浏览器小游戏。玩法参考经典 Whac-A-Mole，并针对中文网络语境重新设计了视觉、文案、计分、难度变化、音效和本地最高分。

## 本地运行

```bash
python3 -m http.server 4173
```

打开 <http://localhost:4173>。

## 项目说明

- `assets/roommate-original.jpg`：用户提供的原始照片，仅供本地素材留档。
- `assets/roommate-bug.jpg`：基于照片生成的移动端优化角色素材。
- `assets/roommate-smug.jpg`：未命中时显示的移动端优化动漫得意贴图状态。
- `assets/roommate-cry.jpg`：命中后显示 420 毫秒的移动端优化动漫大哭贴图状态。
- `assets/achievement-birthday.jpg`：捕获第 8 只时显示的 8 月 8 日隐藏生日成就。
- 项目为原创实现，形态调研参考 GitHub `whack-a-mole` topic，尤其是支持替换任意照片的 `LucianoCanziani/whack-whatever-you-want` 的产品思路；未复制其代码。
- 请确保照片中的本人知情并同意此类娱乐用途；不要公开部署或传播未经授权的人像。
