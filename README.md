# HelpDeskPro - Sistema de Gestión de Tickets

Sistema web desarrollado con Next.js, TypeScript y MongoDB para la gestión eficiente de tickets de soporte técnico.

## Descripción

HelpDeskPro es una aplicación que centraliza la gestión de tickets de soporte, permitiendo a los clientes crear y dar seguimiento a sus solicitudes, mientras que los agentes pueden gestionar, responder y resolver tickets de manera organizada.

## Funcionalidades Principales

- **Autenticación con Roles**: Login diferenciado para clientes y agentes
- **Gestión de Tickets**: Crear, editar, actualizar estado y cerrar tickets
- **Sistema de Comentarios**: Hilo de conversación en cada ticket
- **Notificaciones por Email**: Alertas automáticas para eventos importantes
- **Dashboard de Agente**: Vista completa con filtros por estado
- **Dashboard de Cliente**: Vista personalizada de tickets propios
- **Componentes Reutilizables**: Button, Badge y Card tipados con TypeScript

## Tecnologías Utilizadas

- **Frontend**: React, Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: Context API + bcryptjs
- **HTTP Client**: Axios
- **Email**: Nodemailer

## Requisitos Previos

- Node.js 18+ 
- MongoDB instalado localmente o conexión a MongoDB Atlas
- Cuenta de Gmail para envío de correos (con contraseña de aplicación)

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/yezid-jr/HelpDeskPro-Ticket-Management-System.git
cd helpdesk-pro
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
MONGODB_URI=mongodb://localhost:27017/helpdesk
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
```

**Nota**: Para obtener la contraseña de aplicación de Gmail:
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en dos pasos
3. Contraseñas de aplicaciones
4. Genera una nueva contraseña para "Mail"

### 4. Iniciar MongoDB

Si usas MongoDB local:

```bash
mongod
```

### 5. Crear usuarios de prueba

Conectarse a MongoDB y ejecutar:

```javascript
use helpdesk

// Hash de "password123"
const hashedPassword = "$2a$10$rXGkxJpqN4ZG.jQv8F5jC.XXXXXXXXXXXXXXXXXXXXXXXXXXX"

db.users.insertMany([
  {
    name: "Cliente Test",
    email: "client@test.com",
    password: hashedPassword,
    role: "client",
    createdAt: new Date()
  },
  {
    name: "Agente Test",
    email: "agent@test.com",
    password: hashedPassword,
    role: "agent",
    createdAt: new Date()
  }
])
```

**Importante**: Debes hashear la contraseña usando bcrypt. Puedes usar este script:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('password123', 10);
console.log(hash);
```

### 6. Ejecutar el proyecto

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Usuarios de Prueba

- **Cliente**: 
  - Email: `client@test.com`
  - Contraseña: `password123`

- **Agente**: 
  - Email: `agent@test.com`
  - Contraseña: `password123`

## Capturas de Pantalla

### Login
![Login](./screenshots/login.png)

### Panel de Cliente - Crear Ticket
![Cliente Dashboard](./screenshots/client-create.png)

### Panel de Agente - Gestión de Tickets
![Agente Dashboard](./screenshots/agent-dashboard.png)

### Vista de Detalle con Comentarios
![Ticket Detail](./screenshots/ticket-detail.png)

## Estructura del Proyecto

```
helpdesk-pro/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/route.ts
│   │   │   ├── tickets/route.ts
│   │   │   └── comments/route.ts
│   │   ├── client/page.tsx
│   │   ├── agent/page.tsx
│   │   ├── login/page.tsx
│   │   ├── ticket/[id]/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Card.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── mongodb.ts
│   │   └── email.ts
│   └── models/
│       ├── User.ts
│       ├── Ticket.ts
│       └── Comment.ts
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## Roles y Permisos

### Cliente
- Ver solo sus propios tickets
- Crear nuevos tickets
- Agregar comentarios a sus tickets
- Ver respuestas de agentes

### Agente
- Ver todos los tickets del sistema
- Filtrar tickets por estado
- Cambiar estado de tickets
- Asignar prioridad
- Responder con comentarios
- Cerrar tickets

## Sistema de Notificaciones

El sistema envía correos automáticos en los siguientes eventos:

1. **Ticket Creado**: Al cliente cuando crea un ticket
2. **Nueva Respuesta**: Al cliente cuando un agente comenta
3. **Ticket Cerrado**: Al cliente cuando se cierra su ticket

## Validaciones Implementadas

- Campos obligatorios en formularios
- Autenticación requerida para todas las operaciones
- Validación de roles antes de acciones sensibles
- Manejo de errores con try/catch
- Mensajes claros de éxito/error al usuario

## Testing

Para probar la aplicación:

1. Iniciar sesión como **cliente**
2. Crear un ticket con título y descripción
3. Verificar recepción de email
4. Cerrar sesión e iniciar como **agente**
5. Ver el ticket creado
6. Agregar un comentario
7. Cambiar el estado del ticket
8. Verificar que el cliente recibe emails

## Notas de Desarrollo

- La aplicación usa localStorage para persistir la sesión
- Los emails se envían de forma asíncrona sin bloquear la respuesta
- MongoDB debe estar corriendo antes de iniciar la app
- Las contraseñas se hashean con bcrypt antes de guardarlas

## Mejoras Futuras (No Implementadas)

- Cron jobs para recordatorios automáticos
- Encuestas post-cierre
- Asignación automática de agentes
- Búsqueda avanzada de tickets
- Exportación de reportes
- Adjuntar archivos a tickets

## Datos del Desarrollador

- **Nombre**: [TU NOMBRE COMPLETO]
- **Clan**: [TU CLAN]
- **Correo**: [tu_correo@email.com]
- **Documento**: [TU DOCUMENTO DE IDENTIDAD]

---

## Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta el linter
```

## Solución de Problemas

### Error de conexión a MongoDB
```
Verificar que MongoDB esté corriendo
Revisar la URL en MONGODB_URI
```

### Error al enviar emails
```
Verificar credenciales de Gmail
Asegurarse de usar contraseña de aplicación
Verificar que EMAIL_USER y EMAIL_PASS estén configurados
```

### Error "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```