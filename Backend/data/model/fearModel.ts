import mongoose from 'mongoose';

const fearSchema = new mongoose.Schema({
    name: String,
    therapistId: String,
    dosAndDonts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DoAndDont' }],
}, {collection: 'fears'});

export const FearModel = mongoose.model('Fear', fearSchema);

export interface Fear {
    _id: string;
    therapistId: string;
    name: string;
    dosAndDonts: string[]; // array of DoAndDont IDs
}
