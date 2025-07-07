
# GitHub Actions 定期API调用配置

## 概述

本文档说明如何设置GitHub Actions工作流，每隔6天自动调用我们的用户统计API端点。

## API端点信息

- **API URL**: `https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats`
- **方法**: GET
- **认证**: 无需认证（公开端点）
- **返回格式**: JSON

## GitHub Actions 工作流配置

### 步骤1：创建工作流文件

在您的GitHub仓库中创建以下文件：`.github/workflows/api-stats-check.yml`

```yaml
name: User Statistics Check

# 每隔6天的凌晨2点执行
on:
  schedule:
    - cron: '0 2 */6 * *'  # 每6天的凌晨2点执行
  workflow_dispatch:  # 允许手动触发

jobs:
  check-user-stats:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Call User Stats API
        run: |
          echo "🚀 开始调用用户统计API..."
          
          # 调用API并保存响应
          response=$(curl -s -w "\n%{http_code}" \
            -H "Content-Type: application/json" \
            https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats)
          
          # 分离响应体和HTTP状态码
          http_code=$(echo "$response" | tail -n1)
          body=$(echo "$response" | head -n -1)
          
          echo "📊 API响应状态码: $http_code"
          echo "📋 API响应内容:"
          echo "$body" | jq '.' || echo "$body"
          
          # 检查API调用是否成功
          if [ "$http_code" -eq 200 ]; then
            echo "✅ API调用成功！"
            
            # 解析统计数据
            total_users=$(echo "$body" | jq -r '.statistics.users.total // "N/A"')
            active_wishes=$(echo "$body" | jq -r '.statistics.wishes.active // "N/A"')
            engagement_rate=$(echo "$body" | jq -r '.statistics.practice.engagementRate // "N/A"')
            
            echo "👥 总用户数: $total_users"
            echo "🌟 活跃愿望数: $active_wishes"
            echo "📈 参与率: $engagement_rate"
            
          else
            echo "❌ API调用失败，状态码: $http_code"
            exit 1
          fi
          
      - name: Create Issue on Failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '⚠️ 用户统计API调用失败',
              body: `
              ## API调用失败报告
              
              **时间**: ${new Date().toISOString()}
              **工作流**: ${context.workflow}
              **运行编号**: ${context.runNumber}
              
              请检查以下内容：
              - [ ] API端点是否正常运行
              - [ ] Supabase服务状态
              - [ ] 网络连接问题
              
              **API端点**: https://hziwbeyokjdswlzzmjem.supabase.co/functions/v1/user-stats
              `,
              labels: ['bug', 'api', 'monitoring']
            })
```

### 步骤2：手动触发测试

1. 推送工作流文件到GitHub仓库
2. 进入GitHub仓库的Actions标签页
3. 选择"User Statistics Check"工作流
4. 点击"Run workflow"按钮进行手动测试

### 步骤3：监控工作流执行

- 工作流将每6天自动执行一次
- 如果API调用失败，会自动创建Issue进行通知
- 可以在Actions页面查看执行历史和日志

## Cron表达式说明

```
0 2 */6 * *
│ │  │  │ │
│ │  │  │ └── 星期几 (0-7, 0和7都代表星期日)
│ │  │  └───── 月份 (1-12)
│ │  └──────── 日期 (1-31)
│ └─────────── 小时 (0-23)
└───────────── 分钟 (0-59)
```

- `0 2 */6 * *` = 每6天的凌晨2点执行

## 其他配置选项

### 修改执行频率

```yaml
# 每3天执行
- cron: '0 2 */3 * *'

# 每周执行
- cron: '0 2 * * 0'

# 每月1号执行
- cron: '0 2 1 * *'
```

### 添加Slack通知

如果您想要接收Slack通知，可以在工作流中添加：

```yaml
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#monitoring'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 添加邮件通知

```yaml
      - name: Send Email Notification
        if: failure()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 587
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: 'API调用失败通知'
          body: '用户统计API调用失败，请检查系统状态。'
          to: your-email@example.com
```

## 安全注意事项

1. 不要在工作流文件中暴露敏感信息
2. 使用GitHub Secrets存储敏感配置
3. 定期检查API访问日志
4. 监控API调用频率避免超出限制

## 故障排除

### 常见问题

1. **工作流未执行**
   - 检查cron表达式语法
   - 确认仓库有足够的权限

2. **API调用失败**
   - 检查API端点URL是否正确
   - 验证Supabase服务状态
   - 检查网络连接

3. **权限问题**
   - 确保工作流有创建Issue的权限
   - 检查GITHUB_TOKEN权限设置

### 调试技巧

- 使用`workflow_dispatch`手动触发测试
- 在步骤中添加更多日志输出
- 使用GitHub Actions的debug模式

## 相关链接

- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Cron表达式生成器](https://crontab.guru/)
- [Supabase Edge Functions文档](https://supabase.com/docs/guides/functions)
