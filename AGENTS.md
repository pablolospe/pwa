# 🤖 AGENTS.md - Stage 0: PWA Foundation & Validation

## 🎯 Objetivo de la Etapa
Validar la viabilidad técnica de la PWA. El éxito se define por una aplicación "Hola Mundo" instalable, con comportamiento nativo y performance óptima en dispositivos móviles antes de proceder a la lógica de negocio.

## 🛠 Tech Stack & Rules
- **Framework:** Next.js 16 (App Router obligatorio).
- **Styling:** Tailwind CSS (Mobile-first estricto).
- **ORM:** Prisma v6.3.1 (Referencia: Anexo 1.pdf para futuros esquemas).
- **State:** Zustand (Store ligero para UI/Sesión).

## 🚀 PWA Advanced Skills (Instrucciones de Implementación)
El Agente debe aplicar estos criterios técnicos para elevar la calidad de la PWA:

1. **Native UI/UX (Safe Areas):**
   - Utilizar `env(safe-area-inset-top)` y `env(safe-area-inset-bottom)` en el layout principal para evitar colisiones con el notch de iOS y la barra de navegación de Android.
   - Deshabilitar el "pull-to-refresh" nativo si interfiere con la navegación de la App.

2. **Web App Manifest Config:**
   - `display: standalone` (para ocultar la UI del navegador).
   - `background_color` y `theme_color` alineados al branding de TuFiesta.
   - Configurar `icons` en tamaños 192x192 y 512x512 con `purpose: any maskable`.

3. **Offline & Resilience:**
   - Implementar un Service Worker que cachee el "Shell" de la aplicación.
   - Crear una ruta `/offline` para mostrar cuando no hay conexión.

4. **Performance & Installability:**
   - Priorizar `next/font` para evitar saltos de layout (CLS).
   - El archivo `manifest.json` debe estar correctamente vinculado en el `<head>`.

## 📋 Definition of Done (DoD) - Etapa 0
- [ ] La app es reconocida como instalable por Chrome (Android) y Safari (iOS).
- [ ] El Splash Screen se genera correctamente y es visible al abrir la app instalada.
- [ ] No hay scroll horizontal residual en pantallas móviles.
- [ ] Puntuación de PWA en Lighthouse > 90.

## 📁 Estructura Esperada
- `app/layout.tsx`: Configuración de Viewport y Metadata PWA.
- `public/manifest.json`: Definición de la App.
- `public/icons/`: Assets visuales de la marca.

### Skill: Push Notification Engine
- Implementar **VAPID keys** para asegurar la comunicación con el Push Service.
- Configurar el Service Worker para escuchar el evento `push` y mostrar `self.registration.showNotification()`.
- Gestionar la suscripción del usuario vinculando el `subscriptionId` a su `PersonaDoc` en la base de datos (`tfd_personas`).

---
**Nota para el Agente:** Si el prompt de instalación no aparece en el celular tras la configuración, el agente debe priorizar el debug del Service Worker antes de generar cualquier otro componente.