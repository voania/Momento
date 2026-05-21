// ============================================================
// 中文自然语言解析器 — 解析"去年在海边拍的日落"
// 输出：{ time: "2025", location: "海边", keyword: "日落" }
// 后期扩展：添加更多模式或接入轻量 NLP 模型
// ============================================================

export interface ParsedIntent {
  time?: string;
  location?: string;
  keyword?: string;
  category?: string;
  raw: string;
}

const PATTERNS: Array<{ regex: RegExp; field: keyof ParsedIntent; extract: (m: RegExpMatchArray) => string }> = [
  // 时间
  { regex: /(\d{4})年/, field: 'time', extract: (m) => m[1] },
  { regex: /去年/, field: 'time', extract: () => String(new Date().getFullYear() - 1) },
  { regex: /今年/, field: 'time', extract: () => String(new Date().getFullYear()) },
  { regex: /(\d{1,2})月/, field: 'time', extract: (m) => m[0] },
  // 地点
  { regex: /在(.{1,4})拍/, field: 'location', extract: (m) => m[1] },
  { regex: /(海边|山上|公园|家里|公司|学校|餐厅)/, field: 'location', extract: (m) => m[1] },
  // 内容
  { regex: /(日落|日出|夕阳|花|猫|狗|食物|车|建筑|雪|雨|夜景)/, field: 'keyword', extract: (m) => m[1] },
];

export function parseIntent(query: string): ParsedIntent {
  const intent: ParsedIntent = { raw: query };

  for (const { regex, field, extract } of PATTERNS) {
    const match = query.match(regex);
    if (match && !intent[field]) {
      intent[field] = extract(match);
    }
  }

  return intent;
}
