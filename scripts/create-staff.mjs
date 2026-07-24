// Crea (o actualiza) el usuario staff del back office: cuenta en Firebase Auth +
// doc users/{uid} con rol admin activo (el admin lee el rol de Firestore, no de claims).
//
//   STAFF_EMAIL=alguien@higienissa.com STAFF_PASSWORD='••••••' node scripts/create-staff.mjs
//
// Requiere FIREBASE_SERVICE_ACCOUNT en .env o el entorno.

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv() {
  const p = join(ROOT, '.env')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
loadEnv()

const email = process.env.STAFF_EMAIL
const password = process.env.STAFF_PASSWORD
const name = process.env.STAFF_NAME || 'Admin'
const lastName = process.env.STAFF_LASTNAME || 'Higienissa'
if (!email || !password) { console.error('✖ Definí STAFF_EMAIL y STAFF_PASSWORD.'); process.exit(1) }
const raw = process.env.FIREBASE_SERVICE_ACCOUNT
if (!raw) { console.error('✖ Falta FIREBASE_SERVICE_ACCOUNT en .env o el entorno.'); process.exit(1) }

initializeApp({ credential: cert(JSON.parse(raw)) })
const auth = getAuth()
const db = getFirestore()

let user
try {
  user = await auth.getUserByEmail(email)
  await auth.updateUser(user.uid, { password })
  console.log(`▸ Usuario existente actualizado: ${email}`)
} catch {
  user = await auth.createUser({ email, password, displayName: `${name} ${lastName}` })
  console.log(`▸ Usuario creado: ${email}`)
}

await db.doc(`users/${user.uid}`).set(
  { name, lastName, email, role: 'admin', active: true, updatedAt: FieldValue.serverTimestamp() },
  { merge: true },
)
console.log(`✔ users/${user.uid} → role admin, activo. Ya podés entrar a /admin/login.`)
