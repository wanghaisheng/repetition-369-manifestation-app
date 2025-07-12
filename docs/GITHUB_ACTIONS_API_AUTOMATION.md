
# GitHub Actions API自动化调用配置

## 概述

本文档说明如何设置GitHub Actions工作流，每隔6天自动调用显化369应用的用户统计API端点，用于数据监控和营销分析。

## API端点信息

- **API URL**: `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats`
- **方法**: GET
- **认证**: 无需认证（公开端点）
- **返回格式**: JSON

### API响应示例
```json
{
  "success": true,
  "timestamp": "2025-01-12T10:30:00.000Z",
  "project": "xianghua369-app",
  "domain": "https://369.heymanifestation.com/app",
  "statistics": {
    "users": {
      "total": 1250,
      "newLast30Days": 180
    },
    "wishes": {
      "total": 3750,
      "active": 2100
    },
    "practice": {
      "sessionsLast7Days": 890,
      "engagementRate": "71.2%"
    }
  }
}
```

## GitHub Actions 工作流配置

### 步骤1：创建工作流文件

在您的GitHub仓库中创建文件：`.github/workflows/user-stats-monitor.yml`

```yaml
name: 显化369用户统计监控

# 每隔6天的凌晨3点执行（UTC时间）
on:
  schedule:
    - cron: '0 3 */6 * *'  # 每6天的凌晨3点执行
  workflow_dispatch:  # 允许手动触发

jobs:
  monitor-user-stats:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: 调用用户统计API
        id: api_call
        run: |
          echo "🚀 开始调用显化369用户统计API..."
          
          # 调用API并保存响应
          response=$(curl -s -w "\n%{http_code}" \
            -H "Content-Type: application/json" \
            -H "User-Agent: GitHub-Actions-Monitor/1.0" \
            https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats)
          
          # 分离响应体和HTTP状态码
          http_code=$(echo "$response" | tail -n1)
          body=$(echo "$response" | head -n -1)
          
          echo "📊 API响应状态码: $http_code"
          echo "📋 API响应内容:"
          echo "$body" | jq '.' || echo "$body"
          
          # 保存响应数据到环境变量
          echo "HTTP_CODE=$http_code" >> $GITHUB_ENV
          echo "API_RESPONSE<<EOF" >> $GITHUB_ENV
          echo "$body" >> $GITHUB_ENV
          echo "EOF" >> $GITHUB_ENV
          
          # 检查API调用是否成功
          if [ "$http_code" -eq 200 ]; then
            echo "✅ API调用成功！"
            
            # 解析统计数据
            total_users=$(echo "$body" | jq -r '.statistics.users.total // "N/A"')
            new_users=$(echo "$body" | jq -r '.statistics.users.newLast30Days // "N/A"')
            total_wishes=$(echo "$body" | jq -r '.statistics.wishes.total // "N/A"')
            active_wishes=$(echo "$body" | jq -r '.statistics.wishes.active // "N/A"')
            recent_sessions=$(echo "$body" | jq -r '.statistics.practice.sessionsLast7Days // "N/A"')
            engagement_rate=$(echo "$body" | jq -r '.statistics.practice.engagementRate // "N/A"')
            
            echo "👥 总用户数: $total_users"
            echo "🆕 新用户(30天): $new_users"
            echo "🌟 总愿望数: $total_wishes"
            echo "✨ 活跃愿望: $active_wishes"
            echo "🧘 最近练习: $recent_sessions"
            echo "📈 参与率: $engagement_rate"
            
            # 保存关键指标到输出
            echo "total_users=$total_users" >> $GITHUB_OUTPUT
            echo "engagement_rate=$engagement_rate" >> $GITHUB_OUTPUT
            echo "success=true" >> $GITHUB_OUTPUT
            
          else
            echo "❌ API调用失败，状态码: $http_code"
            echo "success=false" >> $GITHUB_OUTPUT
            exit 1
          fi

      - name: 生成数据报告
        if: steps.api_call.outputs.success == 'true'
        run: |
          echo "📈 生成数据分析报告..."
          
          # 创建报告文件
          cat > stats_report.md << 'EOF'
          # 显化369应用数据报告
          
          **生成时间**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
          **工作流运行**: #${{ github.run_number }}
          
          ## 📊 核心指标
          
          | 指标 | 数值 |
          |------|------|
          | 总用户数 | ${{ steps.api_call.outputs.total_users }} |
          | 参与率 | ${{ steps.api_call.outputs.engagement_rate }} |
          
          ## 🎯 营销洞察
          
          - 用户增长趋势：稳定上升
          - 用户活跃度：需要持续关注
          - 产品使用情况：整体健康
          
          ## 📝 后续行动
          
          - [ ] 分析用户留存率
          - [ ] 优化用户体验
          - [ ] 准备营销内容
          
          EOF
          
          echo "✅ 报告生成完成"

      - name: 创建成功Issue（如果需要）
        if: steps.api_call.outputs.success == 'true' && github.event_name == 'schedule'
        uses: actions/github-script@v7
        with:
          script: |
            const { data: issues } = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              labels: 'stats-report',
              state: 'open'
            });
            
            // 如果没有开放的统计报告Issue，创建一个新的
            if (issues.length === 0) {
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: '📊 用户统计监控报告 - ' + new Date().toLocaleDateString('zh-CN'),
                body: `
                ## 🎉 显化369应用统计监控成功
                
                **监控时间**: ${new Date().toLocaleString('zh-CN')}
                **工作流**: ${context.workflow}
                **运行编号**: ${context.runNumber}
                
                ### 📈 关键数据
                - 总用户数: ${{ steps.api_call.outputs.total_users }}
                - 用户参与率: ${{ steps.api_call.outputs.engagement_rate }}
                
                ### 🚀 Build in Public 更新
                这些数据可以用于：
                - [ ] Twitter进度分享
                - [ ] Product Hunt数据展示
                - [ ] LinkedIn专业更新
                - [ ] 微信公众号内容创作
                
                ### 📊 原始数据
                \`\`\`json
                ${process.env.API_RESPONSE}
                \`\`\`
                
                **下次监控**: 6天后自动执行
                `,
                labels: ['stats-report', 'automation', 'build-in-public']
              });
            }
          
      - name: 处理API调用失败
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '⚠️ 显化369用户统计API调用失败',
              body: `
              ## 🚨 API监控失败报告
              
              **失败时间**: ${new Date().toLocaleString('zh-CN')}
              **工作流**: ${context.workflow}
              **运行编号**: ${context.runNumber}
              **状态码**: ${process.env.HTTP_CODE || 'Unknown'}
              
              ### 🔍 可能原因
              - [ ] Supabase服务暂时不可用
              - [ ] API端点配置问题
              - [ ] 网络连接问题
              - [ ] Edge Function执行错误
              
              ### 🛠️ 检查步骤
              - [ ] 验证API端点: https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats
              - [ ] 检查Supabase项目状态
              - [ ] 查看Edge Function日志
              - [ ] 测试手动API调用
              
              ### 📞 联系信息
              请检查Supabase Dashboard中的Edge Function日志获取详细错误信息。
              
              **API端点**: https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats
              `,
              labels: ['bug', 'api-monitoring', 'urgent']
            })

  # 备用任务：数据备份
  backup-stats:
    runs-on: ubuntu-latest
    needs: monitor-user-stats
    if: always()
    
    steps:
      - name: 备份统计数据
        run: |
          echo "💾 备份统计数据到GitHub Pages..."
          mkdir -p backup
          echo "${{ needs.monitor-user-stats.outputs.api_response }}" > backup/latest-stats.json
          echo "$(date -u +%s)" > backup/last-update.txt
          echo "✅ 数据备份完成"
```

### 步骤2：自定义配置选项

#### 修改执行频率
```yaml
# 每3天执行
- cron: '0 3 */3 * *'

# 每周执行（周日凌晨）
- cron: '0 3 * * 0'

# 每月1号执行
- cron: '0 3 1 * *'

# 每天执行（用于高频监控）
- cron: '0 3 * * *'
```

#### 添加Slack通知
```yaml
      - name: Slack通知
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#显化369-监控'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          text: |
            显化369用户统计监控 - ${{ job.status }}
            总用户数: ${{ steps.api_call.outputs.total_users }}
            参与率: ${{ steps.api_call.outputs.engagement_rate }}
```

#### 添加微信通知（企业微信）
```yaml
      - name: 企业微信通知
        if: steps.api_call.outputs.success == 'true'
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -d '{
              "msgtype": "markdown",
              "markdown": {
                "content": "## 📊 显化369数据更新\n\n**总用户**: ${{ steps.api_call.outputs.total_users }}\n**参与率**: ${{ steps.api_call.outputs.engagement_rate }}\n\n> 数据来源：自动化监控系统"
              }
            }' \
            ${{ secrets.WECHAT_WEBHOOK_URL }}
```

## Cron表达式详解

```
0 3 */6 * *
│ │  │  │ │
│ │  │  │ └── 星期几 (0-7, 0和7都代表星期日)
│ │  │  └───── 月份 (1-12)
│ │  └──────── 日期 (1-31)
│ └─────────── 小时 (0-23)
└───────────── 分钟 (0-59)
```

- `0 3 */6 * *` = 每6天的凌晨3点执行（UTC时间）

## 安全和最佳实践

### 1. 秘钥管理
```yaml
# 在GitHub Secrets中设置
secrets:
  SLACK_WEBHOOK: "https://hooks.slack.com/services/..."
  WECHAT_WEBHOOK_URL: "https://qyapi.weixin.qq.com/..."
  API_MONITOR_TOKEN: "your-monitoring-token"
```

### 2. 错误处理策略
- 超时设置：30秒
- 重试机制：最多重试3次
- 降级处理：API失败时记录基本信息
- 通知机制：重要失败立即通知

### 3. 数据隐私
- 不记录敏感用户信息
- 仅使用聚合统计数据
- 遵循GDPR和隐私法规
- 定期清理历史日志

## 故障排除

### 常见问题和解决方案

#### 1. 工作流未执行
```bash
# 检查cron表达式
# 确认GitHub Actions权限
# 验证仓库活跃度
```

#### 2. API调用失败
```bash
# 手动测试API
curl -H "Content-Type: application/json" \
     https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats

# 检查Supabase状态
# 验证Edge Function部署
```

#### 3. 权限问题
```bash
# 检查GITHUB_TOKEN权限
# 确认仓库管理员权限
# 验证Actions启用状态
```

### 调试技巧
1. 使用`workflow_dispatch`手动触发测试
2. 添加详细的日志输出
3. 使用GitHub Actions的调试模式
4. 监控Supabase Edge Function日志

## 营销数据应用

### Build in Public 内容创作
1. **Twitter**: 每周数据更新推文
2. **LinkedIn**: 月度增长分析文章
3. **Product Hunt**: 里程碑数据展示
4. **微信公众号**: 深度数据分析文章

### 数据驱动决策
- 用户增长趋势分析
- 功能使用情况统计
- 用户留存率监控
- 产品优化方向指导

## 相关链接

- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Cron表达式生成器](https://crontab.guru/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [显化369 API文档](https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats)

## 更新日志

- **v1.0** (2025-01-12): 初始版本，基础监控功能
- **v1.1** (计划中): 添加数据趋势分析
- **v1.2** (计划中): 集成更多通知渠道

---

*本文档随着API和需求变化会持续更新，建议收藏并定期查看最新版本。*
