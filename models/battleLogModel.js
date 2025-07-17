import mongoose from 'mongoose';

const battleLogSchema = new mongoose.Schema({
  battleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Battle', required: true },
  log: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('BattleLog', battleLogSchema); 