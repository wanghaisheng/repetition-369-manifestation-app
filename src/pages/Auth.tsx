
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedSEO } from '@/components/seo/UnifiedSEO';
import { SEOErrorBoundary } from '@/components/seo/SEOErrorBoundary';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { isAuthenticated, signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "请填写完整信息",
        description: "邮箱和密码都是必填项",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      if (isSignUpMode) {
        result = await signUp(email, password);
        if (!result.error) {
          toast({
            title: "注册成功！",
            description: "请查看邮箱验证链接，或直接登录开始使用",
          });
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          toast({
            title: "登录成功！",
            description: "欢迎回到显化369",
          });
        }
      }

      if (result.error) {
        toast({
          title: isSignUpMode ? "注册失败" : "登录失败",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "操作失败",
        description: "请检查网络连接后重试",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEOErrorBoundary>
        <UnifiedSEO 
          title={isSignUpMode ? "注册账户 - 显化369" : "登录 - 显化369"}
          description={isSignUpMode ? "创建显化369账户，开始您的愿望实现之旅" : "登录显化369，继续您的显化练习"}
          keywords="显化369登录,注册,用户账户,愿望实现,369方法"
        />
      </SEOErrorBoundary>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header with back link */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>
            
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-gray-900">显化369</span>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isSignUpMode ? '创建账户' : '欢迎回来'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isSignUpMode ? '开始您的显化之旅' : '继续您的显化练习'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              <Tabs value={isSignUpMode ? "signup" : "signin"} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger 
                    value="signin" 
                    onClick={() => setIsSignUpMode(false)}
                  >
                    登录
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    onClick={() => setIsSignUpMode(true)}
                  >
                    注册
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">密码</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? '登录中...' : '登录'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">密码</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="设置密码 (至少6位)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? '注册中...' : '创建账户'}
                    </Button>
                  </form>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    注册即表示您同意我们的服务条款和隐私政策
                  </p>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-gray-600">
                  显化369 完全免费使用，无隐藏费用
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              需要帮助？{' '}
              <a 
                href="https://x.com/edwin_uestc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                联系开发者
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
