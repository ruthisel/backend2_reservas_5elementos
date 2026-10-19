import { Schema, model } from 'mongoose';

const eventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        capacity: { type: String || Number, required: true },
        date: { type: Date, required: true },
        organizer: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

export const EventModel = model('Event', eventSchema);