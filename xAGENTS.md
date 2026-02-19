# 🤖 Project Agents & Guidelines: TuFiesta PWA

## 📌 Contexto del Sistema
Este repositorio contiene la PWA del **Área Privada del Proveedor** de TuFiesta.com.uy. 
El sistema gestiona la relación entre **Personas**, **Contratos** y **Fichas** (servicios).

## 🛠 Stack Tecnológico
- **Framework:** Next.js 16 (App Router).
- **Base de Datos:** MariaDB / MySQL.
- **ORM:** Prisma v6.3.1 (Uso estricto de PascalCase para modelos).
- **Estado:** Zustand (Store para sesión y navegación).
- **Estilos:** Tailwind CSS (Enfoque Mobile-First).

## 🗄️ Reglas de Base de Datos (Ref: Anexo 1.pdf)
Al generar queries o componentes, respetar la estructura existente:
- `tfd_personas`: Tabla maestra de usuarios (`PersonaDoc` es el identificador legal).
- `tfd_contratos`: Define la relación comercial.
- `tfd_fichas`: Los servicios publicados.
- **Relaciones:** Usar siempre las tablas intermedias `tfd_personas_contrato` y `tfd_personas_fichas` para validar permisos.

## ⚖️ Lógica de Negocio Crítica (Ref: Etapa 1 MVP)
1. **Validación de Deuda:** Antes de permitir acciones de edición, verificar facturas pendientes en `tfd_facturas`. Si existe deuda, el agente debe redirigir o bloquear la acción, permitiendo solo el flujo de pago.
2. **Seguridad:** Las contraseñas se manejan en `PersonaLoginClave` con hash (Bcrypt). No exponer este campo en consultas de cliente.
3. **SEO & Multimedia:** Las imágenes de las fichas deben seguir el patrón `lc-rubro-nombre.jpg`.

## 🤖 Instrucciones para el Agente de IA
- **Personalidad:** Senior Developer pragmático.
- **Prioridad:** No inventar campos de base de datos. Si un campo no está en el `Anexo 1.pdf`, preguntar o marcar como pendiente.
- **Componentes:** Usar "Server Components" por defecto. Solo usar `"use client"` cuando sea estrictamente necesario para interactividad o Zustand.