# 🔧 Configuración de Variables de Entorno en Render

## ❌ **Problema Identificado**

El error 500 en login se debe a que **la variable de entorno `MONGODB_URI` no está configurada** en el servidor de producción (Render).

**Síntomas:**
- Error 500 al intentar login
- Base de datos no conectada en producción
- Rutas de autenticación devuelven 404

---

## ✅ **Solución: Configurar Variables de Entorno**

### **1. Acceder a Render Dashboard**

1. Ve a [render.com](https://render.com)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto `heroesvsvillano`

### **2. Configurar Variables de Entorno**

1. En tu proyecto, ve a **Environment** → **Environment Variables**
2. Haz clic en **Add Environment Variable**
3. Agrega las siguientes variables:

#### **Variable 1: MONGODB_URI**
```
Key: MONGODB_URI
Value: mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority
```

#### **Variable 2: NODE_ENV**
```
Key: NODE_ENV
Value: production
```

#### **Variable 3: PORT**
```
Key: PORT
Value: 10000
```

### **3. Guardar y Redesplegar**

1. Haz clic en **Save Changes**
2. Ve a **Manual Deploy** → **Deploy latest commit**
3. Espera a que el despliegue termine

---

## 🔍 **Verificación de Configuración**

### **Script de Verificación**
```bash
# Ejecutar en local para verificar
node scripts/check_env.js
```

### **Verificar en Producción**
```bash
# Hacer una petición de prueba
curl -X POST https://heroesvsvillano.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"joel_adminofficial","password":"080406"}'
```

---

## 🛠️ **Comandos de Solución**

### **1. Verificar Variables Locales**
```bash
node scripts/check_env.js
```

### **2. Probar Conexión Local**
```bash
node scripts/test_db_connection.js
```

### **3. Probar Login Local**
```bash
node scripts/test_login.js
```

### **4. Probar Login en Producción**
```bash
node scripts/test_frontend_login.js
```

---

## 📋 **Checklist de Configuración**

- [ ] **MONGODB_URI** configurada en Render
- [ ] **NODE_ENV** configurada como "production"
- [ ] **PORT** configurado (opcional, Render lo asigna automáticamente)
- [ ] **Variables guardadas** en Render
- [ ] **Aplicación redesplegada** después de los cambios
- [ ] **Login funciona** en producción
- [ ] **Base de datos conectada** en producción

---

## 🎯 **Resultado Esperado**

Después de configurar las variables de entorno:

- ✅ **Login exitoso** en producción
- ✅ **Base de datos conectada** en Render
- ✅ **Token JWT generado** correctamente
- ✅ **Autenticación funciona** en todas las rutas
- ✅ **No más errores 500** en login

---

## 🔧 **Solución Alternativa (Si las Variables No Funcionan)**

Si las variables de entorno no se aplican correctamente:

### **1. Verificar en el Código**
```javascript
// En db.js, agregar más logging
console.log('🔍 Variables de entorno:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Configurada' : 'No configurada');
console.log('- NODE_ENV:', process.env.NODE_ENV);
```

### **2. Forzar URI en Producción**
```javascript
// En db.js, modificar la URI
const MONGO_URI = process.env.MONGODB_URI || 
  (process.env.NODE_ENV === 'production' 
    ? 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority'
    : 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority');
```

---

## 🎉 **Después de la Configuración**

Una vez configuradas las variables de entorno:

1. **El servidor se conectará** a MongoDB Atlas
2. **Las rutas de autenticación** funcionarán correctamente
3. **El login devolverá** tokens JWT válidos
4. **El frontend podrá** autenticarse correctamente
5. **Todas las funciones** del sistema estarán disponibles

¡La aplicación estará completamente funcional en producción! 🚀 