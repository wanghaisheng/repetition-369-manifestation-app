
export interface PracticeMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number; // in minutes
  phases: PracticePhase[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

export interface PracticePhase {
  id: string;
  name: string;
  duration: number; // in seconds
  instruction: string;
  type: 'writing' | 'meditation' | 'visualization' | 'breathing';
  repetitions?: number;
  guidance?: string[];
}

export interface ActiveSession {
  mode: PracticeMode;
  currentPhase: number;
  startTime: Date;
  phaseStartTime: Date;
  completed: boolean;
  results?: SessionResults;
}

export interface SessionResults {
  totalDuration: number;
  completedPhases: number;
  writingCount: number;
  mood: 'excellent' | 'good' | 'neutral' | 'poor';
  notes?: string;
}

export class PracticeModeService {
  private static modes: PracticeMode[] = [
    {
      id: 'classic',
      name: '经典369模式',
      description: '传统的369显化练习，适合初学者',
      icon: '✨',
      duration: 15,
      difficulty: 'beginner',
      benefits: ['建立基础习惯', '熟悉显化流程', '培养专注力'],
      phases: [
        {
          id: 'morning',
          name: '晨间练习',
          duration: 300, // 5 minutes
          instruction: '写下你的愿望3次，感受内心的渴望',
          type: 'writing',
          repetitions: 3,
          guidance: [
            '找一个安静的地方坐下',
            '深呼吸，放松身心',
            '用心书写，感受每个字的力量',
            '相信你的愿望正在显化'
          ]
        },
        {
          id: 'afternoon',
          name: '午间练习',
          duration: 360, // 6 minutes
          instruction: '写下你的愿望6次，想象愿望实现的场景',
          type: 'writing',
          repetitions: 6,
          guidance: [
            '回忆上午的练习',
            '继续保持积极的心态',
            '每一次书写都充满感恩',
            '感受愿望的能量在增强'
          ]
        },
        {
          id: 'evening',
          name: '晚间练习',
          duration: 540, // 9 minutes
          instruction: '写下你的愿望9次，带着感恩之心结束',
          type: 'writing',
          repetitions: 9,
          guidance: [
            '回顾一天的收获',
            '感恩已经拥有的一切',
            '相信明天会更好',
            '让愿望在睡梦中继续发酵'
          ]
        }
      ]
    },
    {
      id: 'meditation',
      name: '冥想增强模式',
      description: '结合冥想和可视化的深度练习',
      icon: '🧘',
      duration: 25,
      difficulty: 'intermediate',
      benefits: ['深化专注力', '增强可视化能力', '平静内心'],
      phases: [
        {
          id: 'breathing',
          name: '呼吸准备',
          duration: 180, // 3 minutes
          instruction: '进行深呼吸，让身心进入平静状态',
          type: 'breathing',
          guidance: [
            '采用腹式呼吸',
            '吸气4秒，屏息4秒，呼气4秒',
            '专注于呼吸的节奏',
            '感受身体的放松'
          ]
        },
        {
          id: 'visualization',
          name: '愿望可视化',
          duration: 600, // 10 minutes
          instruction: '闭上眼睛，生动地想象你的愿望已经实现',
          type: 'visualization',
          guidance: [
            '想象愿望实现后的具体场景',
            '感受成功时的喜悦和满足',
            '让画面尽可能清晰生动',
            '体验愿望实现的真实感受'
          ]
        },
        {
          id: 'affirmation_writing',
          name: '肯定句书写',
          duration: 720, // 12 minutes
          instruction: '将刚才的可视化体验转化为文字',
          type: 'writing',
          repetitions: 18,
          guidance: [
            '用现在时态描述你的愿望',
            '加入刚才可视化的细节',
            '每次书写都重新体验那种感受',
            '相信文字的力量'
          ]
        }
      ]
    },
    {
      id: 'intensive',
      name: '密集突破模式',
      description: '高强度练习，快速提升显化能量',
      icon: '🚀',
      duration: 45,
      difficulty: 'advanced',
      benefits: ['快速提升', '突破瓶颈', '最大化效果'],
      phases: [
        {
          id: 'energy_buildup',
          name: '能量积累',
          duration: 600, // 10 minutes
          instruction: '通过快速书写积累显化能量',
          type: 'writing',
          repetitions: 33,
          guidance: [
            '保持高度专注',
            '快速而有力地书写',
            '感受能量在体内流动',
            '每一次书写都加强意图'
          ]
        },
        {
          id: 'deep_meditation',
          name: '深度冥想',
          duration: 900, // 15 minutes
          instruction: '进入深度冥想状态，与宇宙能量连接',
          type: 'meditation',
          guidance: [
            '进入更深层的意识状态',
            '感受与宇宙的连接',
            '让愿望与宇宙频率共振',
            '接收来自宇宙的回应'
          ]
        },
        {
          id: 'integration',
          name: '能量整合',
          duration: 1200, // 20 minutes
          instruction: '整合练习收获，锚定显化意图',
          type: 'writing',
          repetitions: 108,
          guidance: [
            '将冥想体验转化为文字',
            '每次书写都是对宇宙的宣告',
            '感受愿望已经在路上',
            '用感恩的心结束练习'
          ]
        }
      ]
    }
  ];

  static getAllModes(): PracticeMode[] {
    return this.modes;
  }

  static getModeById(id: string): PracticeMode | undefined {
    return this.modes.find(mode => mode.id === id);
  }

  static getModesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): PracticeMode[] {
    return this.modes.filter(mode => mode.difficulty === difficulty);
  }

  static createSession(modeId: string): ActiveSession | null {
    const mode = this.getModeById(modeId);
    if (!mode) return null;

    return {
      mode,
      currentPhase: 0,
      startTime: new Date(),
      phaseStartTime: new Date(),
      completed: false
    };
  }

  static advancePhase(session: ActiveSession): ActiveSession {
    const nextPhaseIndex = session.currentPhase + 1;
    
    if (nextPhaseIndex >= session.mode.phases.length) {
      return {
        ...session,
        completed: true
      };
    }

    return {
      ...session,
      currentPhase: nextPhaseIndex,
      phaseStartTime: new Date()
    };
  }

  static getCurrentPhase(session: ActiveSession): PracticePhase | null {
    if (session.currentPhase >= session.mode.phases.length) {
      return null;
    }
    return session.mode.phases[session.currentPhase];
  }

  static getSessionDuration(session: ActiveSession): number {
    return Date.now() - session.startTime.getTime();
  }

  static getPhaseDuration(session: ActiveSession): number {
    return Date.now() - session.phaseStartTime.getTime();
  }

  static getPhaseProgress(session: ActiveSession): number {
    const currentPhase = this.getCurrentPhase(session);
    if (!currentPhase) return 100;

    const elapsed = this.getPhaseDuration(session);
    const total = currentPhase.duration * 1000; // Convert to milliseconds
    return Math.min((elapsed / total) * 100, 100);
  }

  static getSessionProgress(session: ActiveSession): number {
    if (session.completed) return 100;
    
    const totalPhases = session.mode.phases.length;
    const completedPhases = session.currentPhase;
    const currentPhaseProgress = this.getPhaseProgress(session) / 100;
    
    return ((completedPhases + currentPhaseProgress) / totalPhases) * 100;
  }

  static completeSession(session: ActiveSession, results: SessionResults): ActiveSession {
    return {
      ...session,
      completed: true,
      results
    };
  }

  static recommendMode(userLevel: 'beginner' | 'intermediate' | 'advanced', availableTime: number): PracticeMode | null {
    const suitableModes = this.modes.filter(mode => 
      mode.difficulty === userLevel && mode.duration <= availableTime
    );

    if (suitableModes.length === 0) {
      // Fallback to beginner mode if no suitable mode found
      return this.modes.find(mode => mode.difficulty === 'beginner') || null;
    }

    // Return the mode that best fits the available time
    return suitableModes.reduce((best, current) => 
      Math.abs(current.duration - availableTime) < Math.abs(best.duration - availableTime) 
        ? current : best
    );
  }
}
