// Structured (array/object) translations. Kept out of Paraglide because
// values contained JSON with {...} that Paraglide interprets as input vars.
import { getLocale } from "@/paraglide/runtime";

const DATA = {
  "zh": {
    "landing_features_list": [
      {
        "title": "369神奇数字",
        "description": "基于特斯拉的369理论，利用宇宙数字的神奇力量"
      },
      {
        "title": "智能提醒系统",
        "description": "个性化的练习提醒，帮您养成持续显化的习惯"
      },
      {
        "title": "进度可视化",
        "description": "清晰的数据展示，让您看到显化过程的每一步进展"
      },
      {
        "title": "社区分享",
        "description": "与全球显化者交流经验，分享成功故事"
      },
      {
        "title": "日常练习跟踪",
        "description": "跟踪您的日常369书写练习，培养持续习惯"
      },
      {
        "title": "目标达成分析",
        "description": "高级分析功能监控您的显化成功率"
      },
      {
        "title": "冥想融合",
        "description": "引导冥想增强您的显化练习效果"
      },
      {
        "title": "跨平台同步",
        "description": "随时随地在任何设备上访问您的显化日记"
      }
    ],
    "landing_testimonials_list": [
      {
        "name": "李小明",
        "role": "创业者",
        "content": "使用显化369三个月，成功获得了心仪的投资机会。这个应用让我的显化练习更加系统化。",
        "rating": 5
      },
      {
        "name": "张美丽",
        "role": "设计师",
        "content": "每天的369练习让我更加专注于目标，工作和生活都有了明显的改善。",
        "rating": 5
      },
      {
        "name": "王强",
        "role": "学生",
        "content": "简单易用的界面，强大的提醒功能，让我坚持了100天的显化练习！",
        "rating": 5
      }
    ],
    "landing_about_credentials": [
      "10年+软件开发经验",
      "开源项目贡献者",
      "显化方法研究者",
      "个人成长导师"
    ],
    "about_method_principles": [
      "神经可塑性：重复书写重塑大脑神经通路，让积极思维成为习惯",
      "积极心理学：正向肯定句提升自我效能感和行动动力",
      "正念冥想：专注练习减轻焦虑、增强意图清晰度",
      "自我实现预言：当你相信并期待某事，你会不自觉地采取行动促成它"
    ]
  },
  "en": {
    "landing_features_list": [
      {
        "title": "369 Magic Numbers",
        "description": "Based on Tesla's 369 theory, utilizing the magical power of universal numbers"
      },
      {
        "title": "Smart Reminder System",
        "description": "Personalized practice reminders to help you develop consistent manifestation habits"
      },
      {
        "title": "Progress Visualization",
        "description": "Clear data display to show every step of your manifestation journey"
      },
      {
        "title": "Community Sharing",
        "description": "Connect with global manifestors, share experiences and success stories"
      },
      {
        "title": "Daily Practice Tracking",
        "description": "Track your daily 369 writing sessions and build consistent habits"
      },
      {
        "title": "Goal Achievement Analytics",
        "description": "Advanced analytics to monitor your manifestation success rate"
      },
      {
        "title": "Meditation Integration",
        "description": "Guided meditations to enhance your manifestation practice"
      },
      {
        "title": "Cross-Platform Sync",
        "description": "Access your manifestation journal from any device, anywhere"
      }
    ],
    "landing_testimonials_list": [
      {
        "name": "John Smith",
        "role": "Entrepreneur",
        "content": "After using Manifest369 for three months, I successfully secured the investment opportunity I desired. This app made my manifestation practice more systematic.",
        "rating": 5
      },
      {
        "name": "Sarah Johnson",
        "role": "Designer",
        "content": "Daily 369 practice helped me focus more on my goals, with significant improvements in both work and life.",
        "rating": 5
      },
      {
        "name": "Mike Chen",
        "role": "Student",
        "content": "Simple interface, powerful reminder features - helped me maintain 100 days of manifestation practice!",
        "rating": 5
      }
    ],
    "landing_about_credentials": [
      "10+ years software development experience",
      "Open source contributor",
      "Manifestation method researcher",
      "Personal growth mentor"
    ],
    "about_method_principles": [
      "Neuroplasticity: Repetitive writing rewires neural pathways, making positive thinking habitual",
      "Positive Psychology: Positive affirmations enhance self-efficacy and motivation for action",
      "Mindfulness Meditation: Focused practice reduces anxiety and enhances intention clarity",
      "Self-Fulfilling Prophecy: When you believe and expect something, you unconsciously take actions to make it happen"
    ]
  }
} as const;

type Key = keyof typeof DATA["zh"];
export function structured<T = unknown>(key: Key): T {
  const locale = getLocale() as "zh" | "en";
  return DATA[locale][key] as unknown as T;
}
