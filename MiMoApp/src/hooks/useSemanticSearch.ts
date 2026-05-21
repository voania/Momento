import { useCallback } from 'react';
import { usePhotoStore, useSettingsStore } from '../store';
import type { Photo } from '../types';

// ============================================================
// useSemanticSearch — 中文自然语言搜索
// 解析模式：时间 + 地点 + 内容 → 匹配照片
// 后期接入 TFLite 文本嵌入实现真正的语义搜索
// ============================================================

interface ParsedQuery {
  timeTerms: string[];
  locationTerms: string[];
  contentTerms: string[];
}

function parseQuery(query: string): ParsedQuery {
  // 时间关键词
  const timePatterns = [
    /去年/g, /今年/g, /昨天/g, /今天/g, /上[个]?月/g,
    /(\d{4})年/g, /(\d{1,2})月/g, /春天/g, /夏天/g, /秋天/g, /冬天/g,
  ];
  // 地点关键词（常见搜索词）
  const locationKeywords = ['海边', '山', '公园', '家', '公司', '学校', '餐厅', '旅行', '北京', '上海'];
  // 内容关键词
  const contentKeywords = ['日落', '日出', '花', '猫', '狗', '食物', '车', '建筑', '雪', '雨'];

  const timeTerms: string[] = [];
  const locationTerms: string[] = [];
  const contentTerms: string[] = [];

  for (const p of timePatterns) {
    const m = query.match(p);
    if (m) timeTerms.push(m[0]);
  }
  for (const kw of locationKeywords) {
    if (query.includes(kw)) locationTerms.push(kw);
  }
  for (const kw of contentKeywords) {
    if (query.includes(kw)) contentTerms.push(kw);
  }

  return { timeTerms, locationTerms, contentTerms };
}

export function useSemanticSearch() {
  const photos = usePhotoStore((s) => s.photos);
  const addSearchHistory = useSettingsStore((s) => s.addSearchHistory);

  const search = useCallback(
    (query: string): Photo[] => {
      addSearchHistory(query);
      const { timeTerms, locationTerms, contentTerms } = parseQuery(query);
      const q = query.toLowerCase();

      return photos
        .filter((p) => !p.isDeleted)
        .filter((p) => {
          let score = 0;
          // 全文匹配
          if (p.filename.toLowerCase().includes(q)) score += 3;
          if (p.aiTags?.some((t) => t.toLowerCase().includes(q))) score += 5;
          if (p.locationName?.toLowerCase().includes(q)) score += 4;
          if (p.dateTaken.includes(q)) score += 2;

          // 语义匹配
          for (const lt of locationTerms) {
            if (p.locationName?.includes(lt)) score += 6;
          }
          for (const ct of contentTerms) {
            if (p.aiTags?.some((t) => t.includes(ct))) score += 7;
          }
          // 时间匹配（简单年份/月份过滤）
          for (const tt of timeTerms) {
            if (tt.includes('去年')) {
              const lastYear = (new Date().getFullYear() - 1).toString();
              if (p.dateTaken.startsWith(lastYear)) score += 8;
            }
            if (tt.match(/(\d{4})年/)) {
              const year = tt.match(/(\d{4})年/)![1];
              if (p.dateTaken.startsWith(year)) score += 8;
            }
          }

          return score > 0;
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    [photos, addSearchHistory],
  );

  return { search };
}
