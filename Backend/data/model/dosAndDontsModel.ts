import mongoose from 'mongoose';

const doAndDontSchema = new mongoose.Schema({
  type: String,
  text: String,
});

export const DoAndDontModel = mongoose.model('DoAndDont', doAndDontSchema);

export interface DoAndDont {
  _id: string;
  type: 'Do' | 'Don\'t';
  text: string;
}
