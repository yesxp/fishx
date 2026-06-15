module.exports = (req, res) => {
  res.json({ 
    message: 'hello',
    hasEnvKey: !!process.env.QWEATHER_PRIVATE_KEY,
    envKeyLength: process.env.QWEATHER_PRIVATE_KEY ? process.env.QWEATHER_PRIVATE_KEY.length : 0
  });
};
