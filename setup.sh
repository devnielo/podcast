#!/bin/bash

cd "$(dirname "$0")"

echo "Limpiando node_modules..."
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml

echo "Instalando dependencias..."
npm install --legacy-peer-deps

echo "Instalación completada!"
