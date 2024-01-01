import mongoose from 'mongoose';

const fearSchema = new mongoose.Schema({
    name: {type: String, unique: false },
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    dosAndDonts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DoAndDont' }],
}, {collection: 'fears'});

fearSchema.index({ name: 1, therapistId: 1 }, { unique: true });

export const FearModel = mongoose.model('Fear', fearSchema);

export interface Fear {
    _id: string;
    therapistId: string;
    name: string;
    dosAndDonts: string[]; // array of DoAndDont IDs
}
