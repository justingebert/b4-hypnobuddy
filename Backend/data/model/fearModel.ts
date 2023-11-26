import mongoose, { Document, Schema } from 'mongoose';
import { DoAndDont, doAndDontSchema } from './dosAndDontsModel';

export interface Fear extends Document {
    name: string;
    dosAndDonts: DoAndDont['_id'][];
}

const fearSchema = new Schema<Fear>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    dosAndDonts: [{
        type: Schema.Types.ObjectId,
        ref: 'DoAndDont',
    }],
});

export const FearModel = mongoose.model<Fear>('Fear', fearSchema);
