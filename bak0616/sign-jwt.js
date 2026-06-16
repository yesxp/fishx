const { importPKCS8, SignJWT } = require('jose');
const fs = require('fs');

async function signJWT() {
  const privateKeyPem = fs.readFileSync('qweather_private.pem', 'utf8');
  const privateKey = await importPKCS8(privateKeyPem, 'EdDSA');
  
  const jwt = await new SignJWT({})
    .setProtectedHeader({ 
      alg: 'EdDSA', 
      kid: 'T45F65CKWP'  // 新Key ID
    })
    .setIssuedAt()
    .setIssuer('T45F65CKWP')
    .setSubject('T45F65CKWP')
    .setExpirationTime('30m')
    .sign(privateKey);
  
  console.log(jwt);
}

signJWT().catch(console.error);
