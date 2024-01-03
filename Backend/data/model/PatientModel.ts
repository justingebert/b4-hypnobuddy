import mongoose, { Schema, Document, Types } from 'mongoose';
import { Fear } from './fearModel'; // Adjust the path based on your project structure

interface Patient extends Document {
  fears: Types.Array<Types.ObjectId | Fear>;
  // Add other patient fields as needed
}

const patientSchema = new Schema<Patient>({
  fears: [{ type: Schema.Types.ObjectId, ref: 'Fear' }],
}, { collection: 'patients' });

const PatientModel = mongoose.model<Patient>('Patient', patientSchema);

export default PatientModel;