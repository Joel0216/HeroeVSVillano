import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  id: Number,
  name: String,
  life: Number,
  maxLife: Number,
  shield: Number,
  maxShield: Number,
  powerBar: Number
}, { _id: false });

const turnSchema = new mongoose.Schema({
  turnNumber: Number,
  attacker: String,
  defender: String,
  attackType: String,
  damage: Number,
  isCritical: Boolean,
  attackDescription: String,
  attackerLife: Number,
  defenderLife: Number,
  timestamp: String
}, { _id: false });

const battleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  heroTeam: [teamMemberSchema],
  villainTeam: [teamMemberSchema],
  currentHeroIndex: Number,
  currentVillainIndex: Number,
  currentTurn: String,
  turns: [turnSchema],
  status: String,
  winner: { type: String, default: null },
  date: String
});

export default mongoose.model('Battle', battleSchema); 