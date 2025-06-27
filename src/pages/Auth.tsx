
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react';

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');

  const { signUp, signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        result = await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName
        });
      } else {
        result = await signIn({
          email: formData.email,
          password: formData.password
        });
      }

      if (result.error) {
        setError(result.error.message);
      } else if (isSignUp) {
        setError('注册成功！请检查您的邮箱以验证账户。');
      }
    } catch (err) {
      setError('发生了意外错误，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-manifest-warm-gold/10 via-manifest-lavender/10 to-ios-blue/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-0 shadow-ios rounded-ios">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-manifest-warm-gold to-manifest-lavender rounded-ios flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? '创建账户' : '欢迎回来'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? '开始您的显化之旅' : '继续您的369练习'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">
                姓名
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="请输入您的姓名"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 rounded-ios border-gray-200 focus:border-ios-blue"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              邮箱
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="请输入您的邮箱"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="pl-10 rounded-ios border-gray-200 focus:border-ios-blue"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              密码
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入您的密码"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pl-10 pr-10 rounded-ios border-gray-200 focus:border-ios-blue"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-3 rounded-ios text-sm ${
              error.includes('成功') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender hover:from-manifest-warm-gold/90 hover:to-manifest-lavender/90 text-white rounded-ios py-3 font-semibold shadow-ios"
          >
            {loading ? '处理中...' : (isSignUp ? '创建账户' : '登录')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFormData({ email: '', password: '', fullName: '' });
            }}
            className="text-ios-blue hover:text-ios-blue/80 font-medium"
          >
            {isSignUp ? '已有账户？点击登录' : '没有账户？点击注册'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
