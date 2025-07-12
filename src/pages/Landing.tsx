
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Heart, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  return (
    <>
      <SEOErrorBoundary>
        <UnifiedSEO 
          title="显化369 - 基于科学的愿望实现方法 | 王海盛作品"
          description="由资深开发者王海盛打造的369显化法则应用。基于特斯拉理论，结合现代心理学，帮助用户系统化实现人生目标。透明开发过程，真实用户反馈。"
          keywords="显化369,369方法,愿望实现,王海盛,edwin_uestc,目标达成,吸引力法则,个人成长,build in public"
          type="website"
        />
      </SEOErrorBoundary>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header with Social Links */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">显化369</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://x.com/edwin_uestc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/wanghaisheng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/wanghaisheng/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <Link to="/auth">
                <Button>开始使用</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              🚀 Build in Public · 100天产品挑战
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              将愿望转化为
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                现实
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              基于特斯拉369理论的科学显化方法，结合现代心理学研究，帮助您系统化实现人生目标。已帮助数千用户改变生活轨迹。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/auth">
                <Button size="lg" className="px-8 py-3 text-lg">
                  免费开始显化之旅
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
                <a href="https://github.com/wanghaisheng" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 w-5 h-5" />
                  查看开源代码
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                5000+ 活跃用户
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                4.8/5 用户评分
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                完全免费
              </div>
            </div>
          </div>
        </section>

        {/* About the Founder - E-E-A-T */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">关于创始人</h2>
              <p className="text-xl text-gray-600">透明开发，真实分享</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">王海盛 (Edwin)</h3>
                  <p className="text-lg text-gray-600 mb-4">
                    资深全栈开发者 · 开源贡献者 · Build in Public 践行者
                  </p>
                  <div className="flex space-x-4 mb-6">
                    <a 
                      href="https://x.com/edwin_uestc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      @edwin_uestc
                    </a>
                    <a 
                      href="https://github.com/wanghaisheng" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/wanghaisheng/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>专业经验：</strong>10+ 年全栈开发经验，专注于用户体验和产品设计。曾为多家科技公司提供技术咨询服务。
                  </p>
                  <p>
                    <strong>开发理念：</strong>相信技术应该服务于人类的福祉。通过 Build in Public 方式，完全透明地分享产品开发过程，让用户参与到产品演进中。
                  </p>
                  <p>
                    <strong>显化研究：</strong>深入研究心理学、神经科学与古老智慧的结合，将科学方法融入显化实践，帮助用户以系统化方式实现目标。
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-500" />
                      技术专长
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="secondary">React/TypeScript</Badge>
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Supabase</Badge>
                      <Badge variant="secondary">AI/ML</Badge>
                      <Badge variant="secondary">UI/UX 设计</Badge>
                      <Badge variant="secondary">产品管理</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Build in Public 数据
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">开发天数</span>
                        <span className="font-semibold">45/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">代码提交</span>
                        <span className="font-semibold">280+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户反馈</span>
                        <span className="font-semibold">150+</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Product Features */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">科学的显化方法</h2>
              <p className="text-xl text-gray-600">基于特斯拉369理论的系统化实践</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>愿望管理</CardTitle>
                  <CardDescription>
                    系统化管理您的愿望目标，设置具体的时间线和里程碑
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>369练习</CardTitle>
                  <CardDescription>
                    每日3-6-9次重复练习，强化潜意识程序，加速愿望实现
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>进度跟踪</CardTitle>
                  <CardDescription>
                    数据化跟踪您的显化进度，分析成功模式和改进空间
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Support & Community */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">支持项目发展</h2>
            <p className="text-xl text-gray-600 mb-12">
              显化369 完全免费且开源。如果您觉得有用，可以通过以下方式支持项目持续发展：
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <a 
                href="https://ko-fi.com/tiktoka33697" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-1">Ko-fi 支持</h3>
                  <p className="text-sm text-gray-600">一次性赞助支持</p>
                </div>
              </a>
              
              <a 
                href="https://patreon.com/wanghaisheng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center p-6 border-2 border-dashed border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="text-center">
                  <Users className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-gray-900 mb-1">Patreon 订阅</h3>
                  <p className="text-sm text-gray-600">持续支持开发</p>
                </div>
              </a>
            </div>
            
            <div className="mt-12">
              <Link to="/auth">
                <Button size="lg" className="px-8 py-3 text-lg">
                  立即开始您的显化之旅
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900">显化369</span>
                <span className="text-gray-500">by 王海盛</span>
              </div>
              
              <div className="flex items-center space-x-6">
                <a 
                  href="https://x.com/edwin_uestc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com/wanghaisheng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/wanghaisheng/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t text-center text-sm text-gray-500">
              <p>© 2024 显化369. Built with ❤️ in public. 完全开源，永久免费。</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
