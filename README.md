# BACKEND2_RESERVAS_5ELEMENTOS

API RESTful desarrollada con Node.js y Express para la gestión integral de reservas, talleres, encuentros y círculos holísticos. Este proyecto corresponde a la quinta pre-entrega de Backend II, enfocada en la implementación de autorización por roles (RBAC), control de acceso a recursos y gestión de permisos HTTP.

---

## Tecnologías Utilizadas

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **Passport.js** (Estrategias Local y JWT)
- **JSON Web Tokens (JWT)** & **cookie-parser**
- **bcrypt** (Hashing de contraseñas)

---

## Matriz de Permisos (RBAC)

| Acción | `user` | `organizer` | `admin` |
| :--- | :---: | :---: | :---: |
| Consultar eventos publicados (`GET /api/events`) | ✅ | ✅ | ✅ |
| Crear eventos (`POST /api/events`) | ❌ | ✅ | ✅ |
| Modificar eventos propios (`PUT /api/events/:id`) | ❌ | ✅ | ✅ |
| Modificar cualquier evento (`PUT /api/events/:id`) | ❌ | ❌ | ✅ |
| Ver todos los usuarios (`GET /api/users`) | ❌ | ❌ | ✅ |

---

## Tabla de Rutas y Endpoints Protegidos

| Método | Endpoint | Descripción | Roles Permitidos | Código sin Sesión | Código sin Rol |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `POST` | `/api/sessions/register` | Registro de usuario (rol predeterminado: `user`) | Público | N/A | N/A |
| `POST` | `/api/sessions/login` | Autenticación y generación de cookie `currentUser` | Público | N/A | N/A |
| `GET` | `/api/sessions/current` | Consulta de perfil autenticado | Todos | `401 Unauthorized` | N/A |
| `POST` | `/api/events` | Creación de un nuevo evento | `organizer`, `admin` | `401 Unauthorized` | `403 Forbidden` |
| `PUT` | `/api/events/:id` | Modificación de evento | `organizer` (propio), `admin` | `401 Unauthorized` | `403 Forbidden` |
| `GET` | `/api/users` | Listado administrativo de usuarios | `admin` | `401 Unauthorized` | `403 Forbidden` |
| `POST` | `/api/sessions/logout` | Cierre de sesión y eliminación de cookie | Todos | N/A | N/A |

---

## Manejo de Respuestas de Error HTTP

- **`401 Unauthorized`**: El usuario no tiene una sesión activa válida (falta la cookie, el token expiró o la firma de JWT es inválida).
- **`403 Forbidden`**: El usuario está autenticado correctamente, pero su rol no posee el nivel de acceso requerido para ejecutar la acción solicitada.