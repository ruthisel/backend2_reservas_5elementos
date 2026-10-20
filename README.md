# BACKEND2_RESERVAS_5ELEMENTOS

API RESTful desarrollada con Node.js y Express para la gestión integral de reservas, talleres, encuentros y círculos holísticos. Este proyecto corresponde a la segunda pre-entrega de Backend II, enfocada en la autenticación segura de usuarios, encriptación de credenciales con `bcrypt`, persistencia en MongoDB y manejo robusto de errores mediante una arquitectura por capas desacoplada.

---

## Tecnologías Utilizadas

- **Node.js** (Entorno de ejecución de JavaScript)
- **Express.js** (Framework web para la creación de APIs REST)
- **MongoDB** y **Mongoose** (Base de datos NoSQL y ODM)
- **bcrypt / bcryptjs** (Cifrado de contraseñas mediante hashing unidireccional)
- **dotenv** (Manejo de variables de entorno)
- **ECMAScript Modules (ESM)** (`import` / `export`)

---

## Estructura del Proyecto

El código está estructurado en capas desacopladas dentro de la carpeta `src/` para garantizar la separación de responsabilidades:

BACKEND2_RESERVAS_5ELEMENTOS/
├── src/
│   ├── app.js               # Configuración e inicialización de Express y middlewares
│   ├── server.js            # Punto de entrada principal (arranque del servidor HTTP)
│   ├── config/              # Configuración de base de datos y entorno (db.js)
│   ├── routes/              # Definición de rutas y endpoints
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/         # Manejo de peticiones HTTP (req, res)
│   ├── services/            # Lógica de negocio de la aplicación
│   ├── repositories/        # Capa de abstracción para el acceso a datos
│   ├── dao/                 # Data Access Object (Persistencia Mongo/Memoria)
│   ├── models/              # Schemas de Mongoose (User.js, Event.js)
│   ├── middlewares/         # Middlewares de validación, errores y autenticación
│   └── utils/               # Utilidades generales y helpers (hash.js)
├── .env.example             # Plantilla de variables de entorno (sin credenciales)
├── .gitignore               # Archivos excluidos del control de versiones
├── package.json             # Dependencias y scripts del proyecto
└── README.md                # Documentación general de la plataforma