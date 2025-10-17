@echo off
cd /d c:\Users\danie\Desktop\projects\podcast
echo Limpiando node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist pnpm-lock.yaml del pnpm-lock.yaml
echo Instalando dependencias...
npm install
echo Instalacion completada!
pause
