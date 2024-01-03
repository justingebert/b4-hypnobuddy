import mongoose from 'mongoose';

const fearSchema = new mongoose.Schema({
    name: String,
    dosAndDonts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DoAndDont' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
}, {collection: 'fears'});

export const FearModel = mongoose.model('Fear', fearSchema);

export interface Fear {
    _id: string;
    name: string;
    dosAndDonts: string[]; // array of DoAndDont IDs
    users: string[]; // array of users IDs
}
