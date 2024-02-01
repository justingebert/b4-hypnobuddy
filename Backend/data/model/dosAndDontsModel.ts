import mongoose from 'mongoose';

export const doAndDontSchema = new mongoose.Schema({
  fearId: {type: mongoose.Schema.Types.ObjectId, ref: 'Fear'},
  type: String,
  text: String,
});

export const DoAndDontModel = mongoose.model('DoAndDont', doAndDontSchema);

export interface DoAndDont {
  fearId: string;
  _id: string;
  type: 'Do' | 'Don\'t';
  text: string;
}
