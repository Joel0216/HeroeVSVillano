import jwt from 'jsonwebtoken';
const SECRET_KEY = 'tu_clave_secreta'; // Usa variable de entorno en producción

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = { id: payload.id, rol: payload.rol };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administrador' });
  }
  next();
}

export function requireUsuario(req, res, next) {
  if (!req.user || req.user.rol !== 'usuario') {
    return res.status(403).json({ error: 'Acceso solo para usuarios' });
  }
  next();
} 