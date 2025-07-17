import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  alias: { type: String, required: true },
  city: { type: String, required: true },
  team: { type: String, required: true },
  userId: { type: String, required: true }
});

heroSchema.pre('save', async function(next) {
  if (this.id == null) {
    try {
      const last = await this.constructor.findOne().sort('-id');
      this.id = last && last.id ? last.id + 1 : 1;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model('Hero', heroSchema);