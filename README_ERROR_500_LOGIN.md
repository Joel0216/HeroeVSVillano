# 🔧 Solución Error 500 en Login - DataFight

## ❌ **Problema Identificado**

**Error reportado:**
```
POST https://heroesvsvillano.onrender.com/api/auth/login
500 (Internal Server Error)

Error en autenticación: Error: HTTP error! status: 500 - Error interno del servidor
```

**Causas posibles:**
- ❌ Falta de conexión a la base de datos MongoDB
- ❌ Usuario admin no existe en la base de datos
- ❌ Errores en el manejo de bcrypt
- ❌ Problemas con el middleware de autenticación

---

## ✅ **Soluciones Implementadas**

### **1. Conexión a Base de Datos**
```javascript
// Agregado en app.js
import { connectDB } from './db.js';

// Conectar a la base de datos al iniciar
connectDB();
```

### **2. Mejora en Manejo de Errores**
```javascript
// En routes/auth.js - Login mejorado
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Intento de login:', { body: req.body });
    
    const { username, password } = req.body;
    
    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: username y password' 
      });
    }
    
    // Buscar usuario en la base de datos
    const user = await User.findOne({ username: normalizedUsername });
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    // Generar token JWT
    const token = jwt.sign({ 
      id: user._id, 
      userId: user.userId,
      role: user.role 
    }, SECRET_KEY, { expiresIn: '1d' });
    
    // Responder con éxito
    res.status(200).json({ 
      message: 'Login exitoso',
      token, 
      userId: user.userId,
      role: user.role,
      username: user.username
    });
    
  } catch (error) {
    console.error('❌ Error en login:', error);
    
    // Manejar errores específicos
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({ error: 'Error de conexión a la base de datos' });
    }
    
    if (error.name === 'TypeError' && error.message.includes('bcrypt')) {
      return res.status(500).json({ error: 'Error al verificar contraseña' });
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
```

### **3. Script para Crear Usuario Admin**
```javascript
// scripts/create_admin.js
async function createAdmin() {
  const adminUsername = 'joel_adminofficial';
  const adminPassword = '080406';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const adminUser = new User({
    username: adminUsername,
    password: hashedPassword,
    role: 'admin'
  });
  
  await adminUser.save();
}
```

---

## 🧪 **Scripts de Prueba**

### **1. Probar Conexión a Base de Datos**
```bash
node scripts/test_db_connection.js
```

### **2. Crear Usuario Admin**
```bash
node scripts/create_admin.js
```

### **3. Probar Endpoint de Login**
```bash
node scripts/test_login.js
```

---

## 🔍 **Diagnóstico de Problemas**

### **Error 500 - Error Interno del Servidor**

**Posibles causas:**
1. **Base de datos no conectada**
   - Verificar que MongoDB esté funcionando
   - Revisar logs de conexión

2. **Usuario no existe**
   - Ejecutar `node scripts/create_admin.js`
   - Verificar que el usuario esté en la base de datos

3. **Error de bcrypt**
   - Verificar que bcryptjs esté instalado
   - Revisar que la contraseña esté hasheada correctamente

4. **Error de JWT**
   - Verificar que jsonwebtoken esté instalado
   - Revisar la SECRET_KEY

### **Logs Útiles**
```javascript
// En la consola del servidor
console.log('🔐 Intento de login:', { body: req.body });
console.log('📋 Username normalizado:', normalizedUsername);
console.log('❌ Usuario no encontrado:', normalizedUsername);
console.log('❌ Contraseña incorrecta para usuario:', normalizedUsername);
console.log('✅ Login exitoso para usuario:', user.username);
```

---

## 🎯 **Credenciales de Admin**

```
Usuario: joel_adminofficial
Contraseña: 080406
Role: admin
```

---

## 📋 **Checklist de Verificación**

- [ ] **Base de datos conectada** correctamente
- [ ] **Usuario admin existe** en la base de datos
- [ ] **Contraseña hasheada** correctamente
- [ ] **JWT funciona** correctamente
- [ ] **Logs detallados** en consola
- [ ] **Errores específicos** en lugar de genéricos
- [ ] **Respuestas HTTP** correctas (200, 401, 400, 500)
- [ ] **Frontend recibe** respuesta correcta

---

## 🛠️ **Comandos de Solución**

### **1. Verificar Dependencias**
```bash
npm install bcryptjs jsonwebtoken mongoose
```

### **2. Crear Usuario Admin**
```bash
node scripts/create_admin.js
```

### **3. Probar Conexión**
```bash
node scripts/test_db_connection.js
```

### **4. Probar Login**
```bash
node scripts/test_login.js
```

### **5. Reiniciar Servidor**
```bash
node app.js
```

---

## 🎉 **Resultado Esperado**

Después de aplicar las soluciones:

- ✅ **Login exitoso** con credenciales válidas
- ✅ **Error 401** para credenciales inválidas
- ✅ **Error 400** para campos faltantes
- ✅ **Logs detallados** para debugging
- ✅ **Respuestas específicas** en lugar de genéricas
- ✅ **Usuario admin** disponible para pruebas

¡El error 500 debe estar completamente solucionado! 🔧 