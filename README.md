# BACKEND2_RESERVAS_5ELEMENTOS

API RESTful desarrollada con Node.js y Express para la gestión integral de reservas, talleres, encuentros y círculos holísticos. Este proyecto corresponde a la sexta pre-entrega de Backend II, enfocada en el CRUD completo de la entidad `events`, lógica de negocio avanzada, control de permisos por propiedad de recursos, filtrado, paginación y ordenamiento.

---

## Entidad Eventos y Reglas de Negocio

### Modelo de Evento (`Event`)
- **Atributos:** `title`, `description`, `category`, `date`, `location`, `capacity`, `price`, `status`, `organizer`.
- **Relaciones:** `organizer` es una referencia (`ObjectId`) al modelo `User`.
- **Estados Permitidos (`status`):** `draft` (predeterminado), `published`, `cancelled`, `finished`.

### Reglas de Negocio (Capa de Servicios)
- **Fechas:** No se permite crear eventos con fechas pasadas.
- **Capacidad y Precio:** La capacidad debe ser mayor a 0 y el precio mayor o igual a 0.
- **Cancelaciones:** Los eventos en estado `cancelled` no pueden ser modificados ni reabiertos.
- **Propiedad de Recursos:** Los organizadores (`organizer`) solo pueden editar o cambiar el estado de sus propios eventos. El rol `admin` puede modificar cualquier evento.

---

## Tabla de Rutas de Eventos

| Método | Endpoint | Acceso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events` | `organizer`, `admin` | Crea un nuevo evento asignando automáticamente el `organizer` desde `req.user`. |
| `GET` | `/api/events` | Público | Lista eventos publicados con soporte para filtros (`status`, `category`, `location`, rango de fechas), paginación (`page`, `limit`) y ordenamiento (`sort`). |
| `GET` | `/api/events/:id` | Público | Obtiene el detalle completo de un evento por ID. |
| `PUT` | `/api/events/:id` | Dueño del evento u `admin` | Modifica los datos de un evento (bloqueado para eventos cancelados). |
| `PATCH` | `/api/events/:id/status` | Dueño del evento u `admin` | Actualiza el estado del evento (`draft`, `published`, `cancelled`, `finished`). |

---