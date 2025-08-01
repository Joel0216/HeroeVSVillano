// Script para verificar variables de entorno
console.log('🔍 Verificando variables de entorno...\n');

console.log('📋 Variables de entorno disponibles:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurada' : '❌ No configurada');

if (process.env.MONGODB_URI) {
  console.log('📋 URI de MongoDB:', process.env.MONGODB_URI.substring(0, 50) + '...');
} else {
  console.log('⚠️ MONGODB_URI no está configurada');
  console.log('💡 En Render, ve a tu proyecto > Environment > Environment Variables');
  console.log('💡 Agrega: MONGODB_URI = mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority');
}

console.log('\n🎯 Variables de entorno completas:');
Object.keys(process.env).forEach(key => {
  if (key.includes('MONGODB') || key.includes('NODE') || key.includes('PORT')) {
    console.log(`- ${key}: ${process.env[key]}`);
  }
}); 