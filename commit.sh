#!/bin/bash

cd "$(dirname "$0")"

echo "Inicializando repositorio git..."
git init

echo "Agregando archivos..."
git add .

echo "Haciendo commit inicial..."
git commit -m "feat: setup inicial del proyecto con React 19, Vite y TailwindCSS"

echo "Creando tag v0.1.0..."
git tag -a v0.1.0 -m "Fase 1: Setup inicial - Configuración base del proyecto"

echo "Commits y tags completados!"
git log --oneline
git tag -l
