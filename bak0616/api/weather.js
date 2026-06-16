/**
 * Vercel Serverless Function - 和风天气JWT代理
 * 使用 Node.js 内置 crypto 签发 Ed25519 JWT
 */
const crypto = require('crypto');

// 配置
const CONFIG = {
  API_HOST: 'https://pa3qqtg6ym.re.qweatherapi.com',
  PROJECT_ID: '4JDXGV6WMN',
  KID: 'K7PT99QKYY',
  PRIVATE_KEY_PEM: `-----BEGIN PRIVATE KEY-----\n${process.env.QWEATHER_PRIVATE_KEY}\n-----END PRIVATE KEY-----`
};

let cachedKey = null;
let cachedToken = null;
let tokenExpiry = 0;

// Base64URL 编码
function base64url(data) {
  return Buffer.from(data)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 加载私钥
function getKey() {
  if (cachedKey) return cachedKey;
  cachedKey = crypto.createPrivateKey(CONFIG.PRIVATE_KEY_PEM);
  return cachedKey;
}

// 生成 JWT Token（缓存25分钟）
function getToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const header = base64url(JSON.stringify({ alg: 'EdDSA', kid: CONFIG.KID }));
  const payload = base64url(JSON.stringify({
    sub: CONFIG.PROJECT_ID,
    iat: now - 30,
    exp: now + 30 * 60
  }));

  const data = `${header}.${payload}`;
  const key = getKey();
  const sig = crypto.sign(null, Buffer.from(data), key);

  cachedToken = `${data}.${base64url(sig)}`;
  tokenExpiry = now + 25 * 60;
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

    const token = getToken();
    const qs = new URLSearchParams(params).toString();
    const url = `${CONFIG.API_HOST}${endpoint}${qs ? '?' + qs : ''}`;

    const apiRes = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await apiRes.json();
    res.setHeader('Cache-Control', 's-maxage=600');
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack?.split('\n').slice(0, 3) });
  }
};
