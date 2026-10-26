export class UserDTO {
    constructor(user) {
        this.id = user._id || user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
    }
}

export class EventDTO {
    constructor(event) {
        this.id = event._id || event.id;
        this.title = event.title;
        this.description = event.description;
        this.category = event.category;
        this.date = event.date;
        this.location = event.location;
        this.capacity = event.capacity;
        this.price = event.price;
        this.status = event.status;
        this.organizer = event.organizer && event.organizer.email
            ? new UserDTO(event.organizer)
            : event.organizer;
    }
}


export class TicketDTO {
    constructor(ticket) {
        this.id = ticket._id || ticket.id;
        this.reservationCode = ticket.reservationCode;
        this.quantity = ticket.quantity;
        this.status = ticket.status;
        this.createdAt = ticket.createdAt;
        this.user = ticket.user && ticket.user.email ? new UserDTO(ticket.user) : ticket.user;
        this.event = ticket.event && ticket.event.title ? new EventDTO(ticket.event) : ticket.event;
    }
}