import React from 'react';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <>
      <SEOErrorBoundary>
        <UnifiedSEO 
          title="服务条款 - 使用协议与规则 | 显化369"
          description="显化369应用的服务条款，了解使用我们服务的规则和条件"
          keywords="服务条款,使用协议,法律条款,显化369"
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
            <h1 className="text-3xl font-bold text-foreground mb-2">服务条款：显化369使用协议</h1>
            <p className="text-muted-foreground">最后更新：2024年1月</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. 服务协议</h2>
              <p className="text-muted-foreground leading-relaxed">
                欢迎使用显化369应用。通过访问或使用我们的服务，您同意遵守以下条款和条件。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. 服务描述</h2>
              <p className="text-muted-foreground leading-relaxed">
                显化369是一款帮助用户通过369方法进行愿望显化练习的应用程序。我们提供：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>愿望创建和管理工具</li>
                <li>369方法练习指导</li>
                <li>进度跟踪和统计</li>
                <li>社区分享功能</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. 用户责任</h2>
              <p className="text-muted-foreground leading-relaxed">
                作为用户，您同意：
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>提供准确的注册信息</li>
                <li>保护账户安全和密码保密</li>
                <li>不发布违法、有害或不当内容</li>
                <li>尊重其他用户和服务</li>
                <li>不滥用或干扰服务运行</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. 内容和知识产权</h2>
              <p className="text-muted-foreground leading-relaxed">
                您保留对自己创建内容的所有权，同时授予我们使用这些内容为您提供服务的权利。
                应用本身的设计、功能和代码受知识产权法保护。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. 免费服务</h2>
              <p className="text-muted-foreground leading-relaxed">
                显化369目前免费提供服务。我们保留在未来引入付费功能的权利，
                但会提前通知用户任何重大变更。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. 免责声明</h2>
              <p className="text-muted-foreground leading-relaxed">
                显化369是一个练习工具，我们不保证任何特定结果。
                服务按"现状"提供，我们不承担间接损失的责任。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. 服务变更和终止</h2>
              <p className="text-muted-foreground leading-relaxed">
                我们保留随时修改、暂停或终止服务的权利。
                重大变更会提前通知用户。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. 联系我们</h2>
              <p className="text-muted-foreground leading-relaxed">
                如果您对服务条款有任何疑问，请通过以下方式联系我们：
              </p>
              <p className="text-muted-foreground">
                邮箱：legal@xianghua369.com<br />
                Twitter：@edwin_uestc
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;