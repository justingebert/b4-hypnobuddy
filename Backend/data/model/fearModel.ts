import mongoose from 'mongoose';

const fearSchema = new mongoose.Schema({
    name: String,
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    dosAndDonts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DoAndDont' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
}, {collection: 'fears'});

fearSchema.index({ name: 1, therapistId: 1 }, { unique: true });
export const FearModel = mongoose.model('Fear', fearSchema);

export interface Fear {
    _id: string;
    therapistId: string;
    name: string;
    dosAndDonts: string[]; // array of DoAndDont IDs
    users: string[]; // array of users IDs
}
