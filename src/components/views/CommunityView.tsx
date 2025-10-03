
import { useState } from 'react';
import { MessageCircle, Heart, Share, Plus, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export const CommunityView = () => {
  const [posts] = useState([
    {
      id: 1,
      author: {
        name: '小雨',
        avatar: '🌸',
        level: '显化新手'
      },
      content: '今天是我练习369方法的第15天！早上书写的时候感受到了前所未有的平静和专注，感觉愿望真的在慢慢靠近我。分享给大家一个小技巧：写完后闭上眼睛深呼吸，想象愿望已经实现的画面，效果会更好哦！✨',
      category: '经验分享',
      likes: 23,
      comments: 8,
      timeAgo: '2小时前',
      isLiked: false
    },
    {
      id: 2,
      author: {
        name: '阳光',
        avatar: '☀️',
        level: '显化达人'
      },
      content: '成功显化了新工作！！！从开始练习369到收到心仪公司的offer，用了整整33天。关键是要相信，要感恩，要坚持。每天写肯定句的时候都要带着感恩的心情，就像愿望已经实现了一样。感谢这个方法，感谢大家的陪伴！🙏',
      category: '成功案例',
      likes: 156,
      comments: 42,
      timeAgo: '6小时前',
      isLiked: true
    },
    {
      id: 3,
      author: {
        name: '月亮',
        avatar: '🌙',
        level: '显化导师'
      },
      content: '关于显化过程中的疑虑和恐惧，这是很正常的。当你开始怀疑的时候，记住：怀疑只是旧有思维模式的抵抗。继续坚持书写，用爱和感恩填满你的心，宇宙会回应你的。分享一句我很喜欢的话："当你真心渴望某样东西时，整个宇宙都会联合起来帮助你实现。"💫',
      category: '心得体会',
      likes: 89,
      comments: 27,
      timeAgo: '1天前',
      isLiked: false
    }
  ]);

  const [topics] = useState([
    { name: '经验分享', count: 234, color: 'bg-ios-blue' },
    { name: '成功案例', count: 89, color: 'bg-ios-green' },
    { name: '心得体会', count: 156, color: 'bg-manifest-gold' },
    { name: '疑问解答', count: 78, color: 'bg-ios-purple' }
  ]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '经验分享': 'bg-ios-blue/10 text-ios-blue',
      '成功案例': 'bg-ios-green/10 text-ios-green',
      '心得体会': 'bg-manifest-gold/10 text-manifest-warm-gold',
      '疑问解答': 'bg-ios-purple/10 text-ios-purple'
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="flex-1 bg-ios-secondary-background px-4 py-6 pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">显化社区</h1>
          <p className="text-gray-600">分享经验，互相鼓励</p>
        </div>
        <Button className="bg-ios-blue hover:bg-blue-600 rounded-ios px-4 py-2 shadow-ios">
          <Plus className="w-5 h-5 mr-2" />
          发布
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ios-green rounded-ios flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">1,234</div>
              <div className="text-sm text-gray-600">活跃用户</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border-0 shadow-ios rounded-ios">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-manifest-gold rounded-ios flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">567</div>
              <div className="text-sm text-gray-600">成功案例</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Topics */}
      <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">热门话题</h3>
        <div className="grid grid-cols-2 gap-3">
          {topics.map((topic, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-ios">
              <div className={`w-8 h-8 ${topic.color} rounded-ios flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">{topic.count}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{topic.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 bg-white border-0 shadow-ios rounded-ios">
            {/* Author */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                {post.author.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">{post.author.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {post.author.level}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{post.timeAgo}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>

            {/* Content */}
            <p className="text-gray-700 leading-relaxed mb-4">
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className={`flex items-center space-x-2 ${
                  post.isLiked ? 'text-ios-red' : 'text-gray-500'
                }`}>
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
              </div>

              <button className="text-gray-500">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <Button variant="outline" className="rounded-ios border-ios-blue text-ios-blue px-8">
          加载更多
        </Button>
      </div>
    </div>
  );
};
