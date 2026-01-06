# 🚀 GitHub Actions Setup Guide

## Configuración del Workflow para Generación Automática de APK

Este repositorio está configurado para generar automáticamente un APK cuando se hace merge a `main`.

### 📋 Requisitos Previos

1. **Cuenta de Expo**
   - Regístrate gratis en: https://expo.dev/signup
   - El plan gratuito incluye builds ilimitadas

2. **Expo CLI instalado localmente**
   ```bash
   npm install -g eas-cli
   ```

3. **Inicializar EAS en el proyecto**
   ```bash
   eas login
   eas build:configure
   ```

### 🔑 Configurar Secrets en GitHub

#### 1. Obtener tu EXPO_TOKEN

```bash
# Generar token de acceso
eas token:create

# Copiar el token que se muestra
```

#### 2. Añadir el token a GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**
4. Nombre: `EXPO_TOKEN`
5. Valor: Pega el token de Expo
6. Click en **Add secret**

### 🔧 Configurar EAS Build (Primera vez)

```bash
# Desde tu proyecto local
eas build:configure

# Crear primera build de prueba
eas build --platform android --profile preview
```

Esto creará:
- `eas.json` - Configuración de builds (ya creado)
- Registrará tu proyecto en Expo

### 📱 Workflow Automático

#### ¿Cuándo se ejecuta?

- ✅ Automáticamente al hacer merge/push a `main`
- ✅ Manualmente desde GitHub Actions tab

#### ¿Qué hace?

1. 📥 Clona el repositorio
2. 📦 Instala dependencias
3. 🏗️ Construye el APK con EAS Build
4. ⏳ Espera a que termine la build
5. 📥 Descarga el APK
6. 🏷️ Crea un Release en GitHub (usando la versión de `package.json`)
7. 📤 Sube el APK al Release

#### Resultado

- 🎉 Nuevo release en: `https://github.com/javilatte/ticket-goat/releases`
- 📱 APK descargable: `TicketGOAT-v1.0.0.apk`

### 🌳 Git Workflow Recomendado

```bash
# 1. Crear feature desde develop
git checkout develop
git pull
git checkout -b feature/nombre-feature

# 2. Hacer cambios y commits
git add .
git commit -m "feat: descripción"
git push -u origin feature/nombre-feature

# 3. Crear Pull Request a develop en GitHub
# 4. Mergear después de review

# 5. Cuando develop esté listo para release
# Crear PR de develop → main
# Al mergear, se generará automáticamente el APK

# 6. Si necesitas actualizar la versión
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
git push --follow-tags
```

### 🔍 Monitorear Builds

```bash
# Ver estado de builds
eas build:list

# Ver detalles de una build específica
eas build:view [BUILD_ID]

# Ver logs
eas build:view [BUILD_ID] --logs
```

### 🐛 Troubleshooting

#### Build falla

1. Revisar logs en: https://expo.dev/accounts/[tu-cuenta]/projects/ticket-goat/builds
2. Verificar que `EXPO_TOKEN` esté configurado correctamente
3. Asegurarse de que el proyecto esté inicializado con EAS

#### Token inválido

```bash
# Regenerar token
eas token:create

# Actualizar en GitHub Settings → Secrets
```

#### Primera build tarda mucho

- Es normal, puede tardar 10-20 minutos
- Builds posteriores son más rápidas (cache)

### 📖 Recursos

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Checklist de Setup

- [ ] Cuenta de Expo creada
- [ ] `eas-cli` instalado globalmente
- [ ] `eas login` ejecutado
- [ ] `eas build:configure` ejecutado
- [ ] Primera build de prueba exitosa
- [ ] `EXPO_TOKEN` añadido a GitHub Secrets
- [ ] Workflow probado (hacer push a main)
- [ ] Release generado correctamente

¡Una vez completado, tu pipeline de CI/CD estará funcionando! 🚀
