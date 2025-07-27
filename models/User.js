import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    sparse: true // Permite valores únicos pero no requeridos
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generar ID único antes de guardar
userSchema.pre('save', function(next) {
  if (this.isNew && !this.userId) {
    // Generar ID único: USER + timestamp + random
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    this.userId = `USER_${timestamp}_${random}`;
  }
  next();
});

export default mongoose.model('User', userSchema); 