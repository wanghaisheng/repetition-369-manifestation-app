import React from 'react';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const Privacy = () => {
  return (
    <>
      <SEOErrorBoundary>
        <UnifiedSEO 
          title="隐私政策 - 数据保护与用户隐私 | 显化369"
          description="显化369应用的隐私政策，了解我们如何保护您的个人信息和数据安全"
          keywords="隐私政策,数据保护,用户隐私,显化369"
        />
      </SEOErrorBoundary>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">隐私政策：显化369数据保护承诺</h1>
            <p className="text-muted-foreground">最后更新：2024年1月</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. 信息收集</h2>
              <p className="text-muted-foreground leading-relaxed">
                显化369致力于保护您的隐私。我们仅收集为您提供服务所必需的信息：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>账户信息：邮箱地址、用户名</li>
                <li>愿望和练习数据：您创建的愿望内容和练习记录</li>
                <li>使用数据：应用使用统计和偏好设置</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. 信息使用</h2>
              <p className="text-muted-foreground leading-relaxed">
                我们使用收集的信息用于：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>提供和改进应用服务</li>
                <li>保存您的愿望和练习进度</li>
                <li>发送重要的服务通知</li>
                <li>分析和优化用户体验</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. 数据安全</h2>
              <p className="text-muted-foreground leading-relaxed">
                我们采用行业标准的安全措施保护您的数据：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>数据加密传输和存储</li>
                <li>访问控制和身份验证</li>
                <li>定期安全审计和更新</li>
                <li>最小化数据收集原则</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. 第三方服务</h2>
              <p className="text-muted-foreground leading-relaxed">
                我们使用以下第三方服务来提供更好的体验：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Supabase - 数据存储和用户认证</li>
                <li>Google Analytics - 匿名使用统计</li>
                <li>Microsoft Clarity - 用户体验分析</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. 用户权利</h2>
              <p className="text-muted-foreground leading-relaxed">
                您拥有以下权利：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>访问和更正您的个人信息</li>
                <li>删除您的账户和相关数据</li>
                <li>导出您的数据</li>
                <li>随时撤回同意</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. 联系我们</h2>
              <p className="text-muted-foreground leading-relaxed">
                如果您对隐私政策有任何疑问，请通过以下方式联系我们：
              </p>
              <p className="text-muted-foreground">
                邮箱：privacy@xianghua369.com<br />
                Twitter：@edwin_uestc
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;