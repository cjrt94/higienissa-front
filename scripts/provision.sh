#!/usr/bin/env bash
# Provisión de Firebase para higienissa-front (Fase 0 del back office).
# El ID del proyecto es una VARIABLE — se decide al ejecutar, no está hardcodeado.
#
#   PROJECT_ID=higienissa ./scripts/provision.sh
#
# Región de Firestore/Storage: southamerica-east1 (São Paulo). Plan: Blaze
# (Storage + Cloud Functions lo exigen). Requiere firebase-tools autenticado
# (`firebase login`) y, para el plan Blaze, una cuenta de facturación enlazada.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Definí PROJECT_ID, p.ej. PROJECT_ID=higienissa ./scripts/provision.sh}"
REGION="southamerica-east1"
DISPLAY_NAME="${DISPLAY_NAME:-Grupo Higienissa}"

echo "▸ Proyecto: $PROJECT_ID  ·  Región: $REGION"

# 1. Crear el proyecto (idempotente; ignora si ya existe).
firebase projects:create "$PROJECT_ID" --display-name "$DISPLAY_NAME" || true

# 2. Fijar el proyecto por defecto (.firebaserc parametrizado).
printf '{\n  "projects": {\n    "default": "%s"\n  }\n}\n' "$PROJECT_ID" > .firebaserc
echo "▸ .firebaserc → $PROJECT_ID"

# 3. Crear la Web App y volcar la config del SDK (pegá estos valores en .env → NUXT_PUBLIC_FIREBASE_*).
firebase apps:create web "higienissa-web" --project "$PROJECT_ID" || true
echo "▸ Config del SDK (copiá a .env):"
firebase apps:sdkconfig web --project "$PROJECT_ID" || true

# 4. Base de datos Firestore en la región elegida (permanente).
firebase firestore:databases:create "(default)" --location "$REGION" --project "$PROJECT_ID" \
  || gcloud firestore databases create --location="$REGION" --project="$PROJECT_ID" \
  || echo "  (creá la base Firestore manualmente en la consola, región $REGION)"

# 5. Desplegar reglas + índices + Storage + Cloud Functions (functions requiere Blaze).
firebase deploy --only firestore:rules,firestore:indexes,storage --project "$PROJECT_ID"
firebase deploy --only functions --project "$PROJECT_ID"

# 6. Secreto del Deploy Hook de Vercel para la CF (creá el hook en el dashboard de Vercel primero).
#    firebase functions:secrets:set VERCEL_DEPLOY_HOOK --project "$PROJECT_ID"

cat <<'NOTA'

▸ Pasos manuales que quedan (consola / interactivo):
  a) Authentication → Sign-in method → habilitar Email/Password.
  b) Vercel → Settings → Git → Deploy Hook: crear uno y guardar la URL en
     VERCEL_DEPLOY_HOOK (secret de la CF, ver paso 6) y en las env vars de Vercel.
  c) Completar .env con NUXT_PUBLIC_FIREBASE_* (paso 3), FIREBASE_SERVICE_ACCOUNT
     (Configuración del proyecto → Cuentas de servicio → generar clave privada,
     JSON en una sola línea) y NUXT_PUBLIC_SITE_URL.
  d) Crear el usuario staff:  STAFF_EMAIL=... STAFF_PASSWORD=... node scripts/create-staff.mjs
  e) Poblar Firestore:        npm run seed

NOTA
echo "✔ Provisión base lista."
