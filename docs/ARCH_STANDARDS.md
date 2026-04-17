# 技术架构与零硬编码规范 (Architecture & Decoupling Standards)

## 1. 核心哲学：三大支柱
1.  **逻辑全抽离 (Logic Fully Decoupled)**: 业务规则与渲染框架（React/RN）、运行环境（Browser/Node/Worker）完全解耦。
2.  **UI 抽象化 (UI Abstracted)**: 视图层仅作为数据状态的"投影"，使用设计令牌（Tokens）而非硬编码像素。
3.  **存储契约化 (Storage Contracted)**: 业务层不依赖特定数据库 SDK，仅通过定义的存储接口（Interface）进行交互。

## 2. 展示层与逻辑分工
*   **Astro (编排层)**: 负责服务端路由、静态生成（SSG）策略及 SEO 注入。
*   **React (表现层)**: 纯 UI 组件。严禁包含 `fetch` 调用、特定数据库 SDK（如 Supabase）或原生浏览器 API 调用。
*   **Hooks (交互层)**: 处理客户端副作用，调用 Service 层，不感知数据来源。
*   **Services (逻辑层)**: 【平台无关】处理业务规则、计算与验证。禁止引用 `window`, `document`, `localStorage`。

## 3. 存储适配器模式 (Storage Adapter Pattern)
所有持久化操作必须经由 `IStorageAdapter` 接口。
*   **契约化**: 定义 CRUD、Auth、Query 的统一签名。
*   **实现层**:
    *   `sqljsAdapter`: 本地开发与离线沙盒。
    *   `SupabaseAdapter`: 云端快速原型（当前默认）。
    *   `D1Adapter`: 生产环境高性能 Cloudflare Worker 适配。
    *   `RNAdapter`: 未来 React Native 原生存储适配。
*   **零耦合**: 业务代码中严禁出现 `import { createClient } from '@supabase/supabase-js'`。

## 4. 渲染策略：流量幂律法则 (90/10 Rule)
*   **动态预渲染**: 构建时查询流量分析，仅预渲染前 10% 的高频页面（SSG）。
*   **按需 SSR**: 长尾页面使用 Cloudflare Workers 实时渲染并自动进入 KV 缓存。
*   **零数据库耦合构建**: 预渲染所需数据从备份或缓存提取，不强制依赖构建时的生产数据库连接。

## 5. 零硬编码准则 (Zero Hardcoding Policy)
*   **无硬编码文字**: 所有文案进入 i18n 系统。
*   **无硬编码样式**: 禁止 `style={{...}}`。必须使用基于变量的原子类（Tailwind）或设计系统 Token。
*   **无硬编码路径**: 所有的路由、本地存储 Key 必须定义为类型化的常量。
*   **无硬编码配置**: 存储提供商切换仅需修改环境变量。

---

## 6. RN 迁移就绪检查清单 (Ready for React Native)
- [ ] 逻辑层是否完全不包含 DOM/Web API（如 `window.scrollTo`）？
- [ ] 所有的样式是否可以通过 Token 映射到 `StyleSheet`？
- [ ] 所有的存储调用是否都通过了 Adapter 抽象？
