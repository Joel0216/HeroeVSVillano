import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ['admin', 'usuario'], default: 'usuario' }
});

userSchema.pre('save', function(next) {
  if (this.username) {
    this.username = this.username.trim().toLowerCase();
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User; 