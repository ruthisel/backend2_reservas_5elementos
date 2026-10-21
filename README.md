# BACKEND2_RESERVAS_5ELEMENTOS

API RESTful desarrollada con Node.js y Express para la gestión integral de reservas, talleres, encuentros y círculos holísticos. Este proyecto corresponde a la séptima pre-entrega de Backend II, enfocada en la gestión completa de tickets e inscripciones, control estricto de cupos, liberación automática tras cancelaciones y notificaciones por correo electrónico mediante Nodemailer.

---

## Entidades del Sistema y Reglas de Negocio

### 1. Entidad Eventos (`Event`)
- **Atributos:** `title`, `description`, `category`, `date`, `location`, `capacity`, `price`, `status`, `organizer`.
- **Relaciones:** `organizer` es una referencia (`ObjectId`) al modelo `User`.
- **Estados Permitidos (`status`):** `draft` (predeterminado), `published`, `cancelled`, `finished`.

### 2. Entidad Tickets / Inscripciones (`Ticket`)
- **Atributos:** `user`, `event`, `status`, `quantity`, `reservationCode`, `cancelledAt`.
- **Relaciones:** Refiere mediante `ObjectId` al usuario solicitante (`User`) y al evento (`Event`).
- **Estados Permitidos (`status`):** `confirmed` (predeterminado), `pending`, `cancelled`.
- **Identificador de Reserva:** `reservationCode` único generado dinámicamente (`TCK-XXXXXXXX`).

---

## Reglas de Negocio (Capa de Servicios)

### Eventos
- **Fechas:** No se permite crear eventos con fechas pasadas.
- **Capacidad y Precio:** La capacidad debe ser mayor a 0 y el precio mayor o igual a 0.
- **Modificaciones:** Los eventos en estado `cancelled` no pueden ser modificados ni reabiertos.
- **Propiedad:** Los organizadores solo pueden editar o cambiar el estado de sus propios eventos. El rol `admin` puede modificar cualquier evento.

### Inscripciones y Control de Cupos
- **Disponibilidad:** Solo es posible inscribirse a eventos en estado `published`.
- **Unicidad:** Se impide la inscripción duplicada si el usuario ya posee un ticket activo para el mismo evento.
- **Cálculo de Cupos:** Los tickets en estado `cancelled` no ocupan cupo, garantizando que al cancelar una reserva el lugar quede disponible de forma inmediata.
- **Notificaciones:** Al confirmar una inscripción, se emite una notificación por correo electrónico con Nodemailer conteniendo el código de reserva y los detalles del evento.

---

## Tabla de Rutas

### Módulo de Eventos
| Método | Endpoint | Acceso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events` | `organizer`, `admin` | Crea un nuevo evento asignando el `organizer` desde la sesión. |
| `GET` | `/api/events` | Público | Lista eventos con filtros (`status`, `category`, `location`), paginación (`page`, `limit`) y ordenamiento (`sort`). |
| `GET` | `/api/events/:id` | Público | Obtiene el detalle completo de un evento por ID. |
| `PUT` | `/api/events/:id` | Dueño u `admin` | Modifica los datos de un evento (bloqueado para eventos cancelados). |
| `PATCH` | `/api/events/:id/status` | Dueño u `admin` | Actualiza el estado del evento (`draft`, `published`, `cancelled`, `finished`). |

### Módulo de Tickets e Inscripciones
| Método | Endpoint | Acceso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events/:eid/tickets` | Autenticado | Inscribe al usuario autenticado en el evento validando cupos disponibles. |
| `GET` | `/api/tickets/my-tickets` | Autenticado | Retorna el historial de inscripciones propias con `populate` del evento. |
| `GET` | `/api/events/:eid/tickets` | Dueño del evento u `admin` | Lista las inscripciones activas de un evento específico. |
| `PATCH` | `/api/tickets/:tid/cancel` | Dueño del ticket u `admin` | Cancela una inscripción y libera el cupo consumido automáticamente. |

---

## Ejemplo de Respuestas JSON

### Inscripción Exitosa (`POST /api/events/:eid/tickets`)
```json
{
  "status": "success",
  "payload": {
    "_id": "67151a...",
    "user": "6ad795...",
    "event": "68210f...",
    "quantity": 2,
    "reservationCode": "TCK-A1B2C3D4",
    "status": "confirmed",
    "createdAt": "2026-10-21T05:00:00.000Z"
  }
}