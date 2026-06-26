// LLM 润色接口
// V1：mock（开发期）- 简单模板替换
// V2：DeepSeek / 通义千问 / OpenAI 等（生产期）

export interface CopywritingStyle {
  key: 'proud' | 'modest' | 'funny' | 'artistic' | 'minimal'
  label: string
  emoji: string
}

export const COPYWRITING_STYLES: CopywritingStyle[] = [
  { key: 'proud', label: '得意', emoji: '😎' },
  { key: 'modest', label: '谦虚', emoji: '🙇' },
  { key: 'funny', label: '搞笑', emoji: '😂' },
  { key: 'artistic', label: '文艺', emoji: '🎨' },
  { key: 'minimal', label: '简约', emoji: '✒️' },
]

export interface CopywritingContext {
  species_name: string
  weight_g?: number
  spot_name?: string
  method?: string
  mood?: string
}

export interface PolishedCopy {
  style: CopywritingStyle['key']
  text: string
}

// ========== V1: 模板替换（mock）==========

// 5 风格的种子文案（开发期 fallback）
const SEED_TEMPLATES: Record<CopywritingStyle['key'], string[]> = {
  proud: [
    '今日大丰收！{species_name} 上钩，足足 {weight} 斤，钓王就是我！',
    '手感来了挡不住，{species_name} 乖乖入护，{weight} 斤完美！',
  ],
  modest: [
    '运气不错，遇到一条 {species_name}（{weight}），新手报到~',
    '新人第一鱼，感谢前辈指点，{species_name} {weight}！',
  ],
  funny: [
    '{species_name}：你拽我干嘛？我在水里多自由！',
    '我和 {species_name} 的对视：它眼里是恐惧，我眼里是午饭。',
  ],
  artistic: [
    '暮色四合，一竿独钓，{species_name} 跃出水面，是自然最纯粹的馈赠。',
    '{species_name} {weight}，静水留痕，钓鱼人的浪漫。',
  ],
  minimal: [
    '{species_name} {weight}。{spot}。',
    '获。{species_name} {weight}。',
  ],
}

function mockPolish(ctx: CopywritingContext, style: CopywritingStyle['key']): string {
  const templates = SEED_TEMPLATES[style]
  const tpl = templates[Math.floor(Math.random() * templates.length)]
  return tpl
    .replace(/\{species_name\}/g, ctx.species_name)
    .replace(/\{weight\}/g, ctx.weight_g ? `${(ctx.weight_g / 500).toFixed(1)} 斤` : '数尾')
    .replace(/\{spot\}/g, ctx.spot_name || '野塘')
}

// ========== V2: LLM API（生产期）==========

const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY || ''
const LLM_ENDPOINT = import.meta.env.VITE_LLM_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions'
const LLM_MODEL = import.meta.env.VITE_LLM_MODEL || 'deepseek-chat'

const STYLE_PROMPTS: Record<CopywritingStyle['key'], string> = {
  proud: '语气得意张扬，钓王范儿，可以用 emoji',
  modest: '语气谦虚低调，新手学习姿态',
  funny: '语气诙谐幽默，可以拟人化',
  artistic: '文艺青年风格，诗意画面感',
  minimal: '极简留白，惜字如金',
}

async function polishByLLM(ctx: CopywritingContext, style: CopywritingStyle['key']): Promise<string> {
  if (!LLM_API_KEY) {
    return mockPolish(ctx, style)
  }
  try {
    const prompt = `你是一位钓鱼爱好者，请根据以下信息写一条${STYLE_PROMPTS[style]}的朋友圈文案（30字以内）：
- 鱼种：${ctx.species_name}
- 重量：${ctx.weight_g ? `${ctx.weight_g}g` : '未知'}
- 钓点：${ctx.spot_name || '未知'}
- 钓法：${ctx.method || '未知'}

只返回文案内容，不要其他解释。`

    const res = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.8,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || mockPolish(ctx, style)
  } catch (e) {
    console.error('[LLM] 调用失败，降级到 mock:', e)
    return mockPolish(ctx, style)
  }
}

/**
 * 主入口：润色文案
 */
export async function polishCopywriting(
  ctx: CopywritingContext,
  style: CopywritingStyle['key']
): Promise<string> {
  return polishByLLM(ctx, style)
}

/**
 * 批量润色：5 种风格
 */
export async function polishAllStyles(ctx: CopywritingContext): Promise<PolishedCopy[]> {
  return Promise.all(
    COPYWRITING_STYLES.map(async (s) => ({
      style: s.key,
      text: await polishCopywriting(ctx, s.key),
    }))
  )
}

// ========== AI 鱼小渔 ==========

const FISH_XIAOYU_PROMPT = `你是「鱼小渔」，一位友好的钓鱼助手。
回答要求：
- 简洁实用（100 字内）
- 亲切口语化
- 必要时给具体数字（温度/水深/时间段等）
- 不确定就说不确定，不要编造`

export interface XiaoyuContext {
  weather?: { temp: number; text: string }
  tide?: { height: number; time: string; type: 'high' | 'low' }[]
  location?: string
  question: string
}

export async function askXiaoyu(ctx: XiaoyuContext): Promise<string> {
  if (!LLM_API_KEY) {
    return mockXiaoyu(ctx)
  }
  try {
    const contextStr = [
      ctx.weather ? `当前天气：${ctx.weather.text} ${ctx.weather.temp}°C` : '',
      ctx.tide?.length ? `潮汐：${ctx.tide.map(t => `${t.time} ${t.type === 'high' ? '涨' : '退'} ${t.height}cm`).join('，')}` : '',
      ctx.location ? `位置：${ctx.location}` : '',
    ].filter(Boolean).join('\n')

    const res = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: 'system', content: FISH_XIAOYU_PROMPT },
          { role: 'user', content: `${contextStr}\n\n问题：${ctx.question}` },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || mockXiaoyu(ctx)
  } catch (e) {
    console.error('[LLM] 鱼小渔调用失败:', e)
    return mockXiaoyu(ctx)
  }
}

function mockXiaoyu(ctx: XiaoyuContext): string {
  // 简单的 mock 回答
  const q = ctx.question
  if (q.includes('天气') || q.includes('适不适合')) {
    return ctx.weather
      ? `当前${ctx.weather.text}，${ctx.weather.temp}°C，比较适合钓鱼。`
      : '今天天气不错，适合出钓。'
  }
  if (q.includes('鱼') || q.includes('钓什么')) {
    return '建议根据当地水域和季节选择目标鱼，可参考鱼种图鉴。'
  }
  return '好问题！建议查看天气、潮汐和目标鱼习性综合判断。'
}
