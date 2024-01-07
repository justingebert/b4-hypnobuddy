import mongoose from 'mongoose';

interface IReflexion {
  mood: string;
  description?: string;
  deepDiveQuestion?: string;
  deepDiveAnswer?: string;
  date: Date;
}

const ReflexionSchema = new mongoose.Schema<IReflexion>({
  mood: { type: String, required: true },
  description: { type: String, required: false },
  deepDiveQuestion: { type: String, required: false },
  deepDiveAnswer: { type: String, required: false },
  date: { type: Date, default: Date.now }
});

const Reflexion = mongoose.model<IReflexion>('Reflexion', ReflexionSchema);
export default Reflexion;