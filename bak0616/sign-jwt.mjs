import { SignJWT, importPKCS8 } from 'jose'
import { readFileSync } from 'fs'

const keyId = 'T45F65CKWP' // 凭据ID (新)
const privateKeyPem = readFileSync('qweather_private.pem', 'utf-8')

const privateKey = await importPKCS8(privateKeyPem, 'EdDSA')

const jwt = await new SignJWT({})
  .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT', kid: keyId })
  .setIssuedAt()
  .setIssuer(keyId)
  .setSubject(keyId)
  .setExpirationTime('30m')
  .sign(privateKey)

console.log(jwt)
