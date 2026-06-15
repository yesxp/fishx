/**
 * Vercel Serverless Function - 和风天气JWT代理
 * 签发JWT并代理请求到QWeather API
 */
const jose = require('jose');

// 配置
const CONFIG = {
  API_HOST: 'https://pa3qqtg6ym.re.qweatherapi.com',
  PROJECT_ID: '4JDXGV6WMN',
  KID: 'K7PT99QKYY',
  // 私钥内容（从环境变量读取）
  PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----\n${process.env.QWEATHER_PRIVATE_KEY}\n-----END PRIVATE KEY-----`
};

let cachedKey = null;
let cachedToken = null;
let tokenExpiry = 0;

// 获取或缓存签名密钥
async function getKey() {
  if (cachedKey) return cachedKey;
  cachedKey = await jose.importPKCS8(CONFIG.PRIVATE_KEY, 'EdDSA');
  return cachedKey;
}

// 生成JWT Token（缓存25分钟）
async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const key = await getKey();
  cachedToken = await new jose.SignJWT({ sub: CONFIG.PROJECT_ID })
    .setProtectedHeader({ alg: 'EdDSA', kid: CONFIG.KID })
    .setIssuedAt(now - 30)
    .setExpirationTime('30m')
    .sign(key);
  tokenExpiry = now + 25 * 60; // 缓存25分钟
  return cachedToken;
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { endpoint, ...params } = req.query;
    if (!endpoint) return res.status(400).json({ error: 'missing endpoint' });

    const token = await getToken();
    const qs = new URLSearchParams(params).toString();
    const url = `${CONFIG.API_HOST}${endpoint}${qs ? '?' + qs : ''}`;

    const apiRes = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // QWeather返回gzip，直接转发
    const data = await apiRes.json();
    res.setHeader('Cache-Control', 's-maxage=600');
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
