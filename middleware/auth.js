import jwt from 'jsonwebtoken';
const SECRET_KEY = 'tu_clave_secreta'; // Usa variable de entorno en producción

export function authMiddleware(req, res, next) {
  console.log('🔐 authMiddleware llamado');
  const authHeader = req.headers.authorization;
  console.log('📋 Auth header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No hay token válido');
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('🔑 Token recibido:', token.substring(0, 20) + '...');
  
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    console.log('✅ Token válido, payload:', payload);
    req.user = { 
      id: payload.id, 
      userId: payload.userId,
      role: payload.role 
    };
    console.log('👤 Usuario asignado:', req.user);
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
}

export function requireAdmin(req, res, next) {
  console.log('👑 requireAdmin llamado');
  console.log('👤 Usuario actual:', req.user);
  
  if (!req.user || req.user.role !== 'admin') {
    console.log('❌ Usuario no es admin');
    return res.status(403).json({ error: 'Acceso solo para administrador' });
  }
  
  console.log('✅ Usuario es admin, continuando...');
  next();
}

export function requireUsuario(req, res, next) {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ error: 'Acceso solo para usuarios' });
  }
  next();
} 