// Keyword Density Analysis Tool for SEO Optimization

export interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number; // Percentage (0-100)
  positions: number[]; // Character positions in text
  suggestions: string[];
  status: 'low' | 'optimal' | 'high';
}

export interface KeywordDensityReport {
  totalWords: number;
  analyses: KeywordAnalysis[];
  overallScore: number; // 0-100
  recommendations: string[];
}

/**
 * Calculate keyword density for given keywords in content
 * @param content - The text content to analyze
 * @param keywords - Array of keywords to track (phrases or single words)
 * @param targetDensity - Target density percentage (default: 2.5-3.5%)
 * @returns Detailed keyword analysis report
 */
export function analyzeKeywordDensity(
  content: string,
  keywords: string[],
  targetDensity: { min: number; max: number } = { min: 2, max: 4 }
): KeywordDensityReport {
  // Clean content: remove markdown syntax, HTML tags, extra spaces
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert markdown links to text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[#*_~]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Calculate total words (Chinese and English)
  const words = cleanContent.match(/[\u4e00-\u9fa5]+|[a-zA-Z0-9]+/g) || [];
  const totalWords = words.length;

  if (totalWords === 0) {
    return {
      totalWords: 0,
      analyses: [],
      overallScore: 0,
      recommendations: ['内容为空，无法分析关键词密度。']
    };
  }

  const analyses: KeywordAnalysis[] = keywords.map(keyword => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const normalizedContent = cleanContent.toLowerCase();
    
    // Count occurrences
    let count = 0;
    const positions: number[] = [];
    let position = 0;

    while ((position = normalizedContent.indexOf(normalizedKeyword, position)) !== -1) {
      count++;
      positions.push(position);
      position += normalizedKeyword.length;
    }

    // Calculate density
    const keywordWords = normalizedKeyword.match(/[\u4e00-\u9fa5]+|[a-zA-Z0-9]+/g)?.length || 1;
    const density = totalWords > 0 ? (count * keywordWords / totalWords) * 100 : 0;

    // Determine status
    let status: 'low' | 'optimal' | 'high';
    if (density < targetDensity.min) {
      status = 'low';
    } else if (density > targetDensity.max) {
      status = 'high';
    } else {
      status = 'optimal';
    }

    // Generate suggestions
    const suggestions: string[] = [];
    if (status === 'low') {
      const neededCount = Math.ceil((targetDensity.min * totalWords) / (keywordWords * 100)) - count;
      suggestions.push(`建议增加 ${neededCount} 次关键词使用，以达到最低密度 ${targetDensity.min}%`);
      suggestions.push(`在标题、小标题或段落开头自然融入关键词`);
    } else if (status === 'high') {
      const excessCount = count - Math.floor((targetDensity.max * totalWords) / (keywordWords * 100));
      suggestions.push(`关键词使用过多，建议减少 ${excessCount} 次，避免关键词堆砌`);
      suggestions.push(`使用同义词或相关词替换部分关键词`);
    } else {
      suggestions.push(`关键词密度理想，保持当前使用频率`);
    }

    return {
      keyword,
      count,
      density: parseFloat(density.toFixed(2)),
      positions,
      suggestions,
      status
    };
  });

  // Calculate overall score
  const optimalCount = analyses.filter(a => a.status === 'optimal').length;
  const overallScore = keywords.length > 0 
    ? Math.round((optimalCount / keywords.length) * 100)
    : 0;

  // Generate overall recommendations
  const recommendations: string[] = [];
  const lowDensityKeywords = analyses.filter(a => a.status === 'low');
  const highDensityKeywords = analyses.filter(a => a.status === 'high');

  if (overallScore === 100) {
    recommendations.push('✅ 所有关键词密度都在理想范围内！');
  } else {
    if (lowDensityKeywords.length > 0) {
      recommendations.push(
        `⚠️ ${lowDensityKeywords.length} 个关键词密度偏低：${lowDensityKeywords.map(k => k.keyword).join('、')}`
      );
      recommendations.push('建议在文章开头、中间和结尾段落自然地增加这些关键词');
    }
    
    if (highDensityKeywords.length > 0) {
      recommendations.push(
        `⚠️ ${highDensityKeywords.length} 个关键词密度过高：${highDensityKeywords.map(k => k.keyword).join('、')}`
      );
      recommendations.push('避免关键词堆砌，使用同义词或相关表达替换部分关键词');
    }
  }

  // Additional SEO tips
  if (totalWords < 300) {
    recommendations.push('💡 文章字数较少（<300字），考虑扩展内容以提升SEO效果');
  }
  
  if (totalWords > 2000) {
    recommendations.push('💡 文章较长（>2000字），确保关键词在各部分均匀分布');
  }

  return {
    totalWords,
    analyses,
    overallScore,
    recommendations
  };
}

/**
 * Extract potential keywords from content
 * @param content - The text content
 * @param topN - Number of top keywords to return
 * @returns Array of potential keywords sorted by frequency
 */
export function extractPotentialKeywords(content: string, topN: number = 10): string[] {
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_~]/g, '')
    .toLowerCase();

  // Extract words (Chinese and English)
  const words = cleanContent.match(/[\u4e00-\u9fa5]{2,}|[a-zA-Z]{3,}/g) || [];

  // Count frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    // Filter out common stop words
    const stopWords = ['the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'are', 'was', 'were', 'been'];
    if (!stopWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // Sort by frequency and return top N
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * Validate SEO keywords format
 * @param keywords - Comma-separated keywords string
 * @returns Array of cleaned keywords
 */
export function parseKeywords(keywords: string): string[] {
  return keywords
    .split(/[,，、]/) // Support multiple separators
    .map(k => k.trim())
    .filter(k => k.length > 0)
    .filter((k, index, self) => self.indexOf(k) === index); // Remove duplicates
}

/**
 * Generate keyword distribution heatmap data
 * @param content - The text content
 * @param keyword - Keyword to track
 * @param segmentCount - Number of segments to divide content into
 * @returns Array of density values for each segment
 */
export function getKeywordDistribution(
  content: string,
  keyword: string,
  segmentCount: number = 10
): number[] {
  const cleanContent = content.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();
  const segmentLength = Math.ceil(cleanContent.length / segmentCount);
  
  const distribution: number[] = [];
  
  for (let i = 0; i < segmentCount; i++) {
    const start = i * segmentLength;
    const end = Math.min(start + segmentLength, cleanContent.length);
    const segment = cleanContent.slice(start, end);
    
    let count = 0;
    let position = 0;
    while ((position = segment.indexOf(normalizedKeyword, position)) !== -1) {
      count++;
      position += normalizedKeyword.length;
    }
    
    distribution.push(count);
  }
  
  return distribution;
}
