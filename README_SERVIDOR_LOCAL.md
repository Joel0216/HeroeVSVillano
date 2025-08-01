# 🚀 Servidor Local - DataFight

## ❌ **Problema Solucionado**

**Error anterior:**
- ❌ Acceso desde `file://` causaba errores CORS
- ❌ `fetch()` fallaba con `net::ERR_FAILED`
- ❌ Sistema de música no funcionaba

**Solución implementada:**
- ✅ **Servidor Express local** en puerto 3001
- ✅ **Rutas corregidas** para funcionar con localhost
- ✅ **Detección automática** de acceso desde file://
- ✅ **Manejo de errores CORS** con mensajes claros

---

## 🎯 **Cómo Usar el Servidor**

### **Opción 1: Script Automático (Recomendado)**

#### **Windows:**
```bash
# Doble clic en el archivo
start-server.bat
```

#### **Linux/Mac:**
```bash
# Ejecutar en terminal
./start-server.sh
```

### **Opción 2: Comando Manual**

```bash
# Instalar dependencias
npm install

# Iniciar servidor
node app.js
```

### **Acceso:**
- 🌐 **URL correcta:** `http://localhost:3001`
- ❌ **URL incorrecta:** `file:///C:/ruta/al/proyecto`

---

## 🔧 **Funcionalidades del Servidor**

### **Puerto y Configuración:**
- **Puerto:** 3001 (configurable con variable de entorno PORT)
- **CORS:** Habilitado para desarrollo local
- **Archivos estáticos:** Servidos desde `/public`
- **API:** Rutas en `/api/*`

### **Rutas API Implementadas:**

#### **Música:**
```javascript
GET    /api/music/config     // Obtener configuración
POST   /api/music/lobby      // Subir música de lobby
POST   /api/music/battle     // Subir música de batalla
DELETE /api/music/lobby      // Eliminar música de lobby
DELETE /api/music/battle     // Eliminar música de batalla
```

#### **Personajes:**
```javascript
GET    /api/heroes           // Obtener héroes
POST   /api/heroes           // Crear héroe
PUT    /api/heroes/:id       // Actualizar héroe
DELETE /api/heroes/:id       // Eliminar héroe

GET    /api/villains         // Obtener villanos
POST   /api/villains         // Crear villano
PUT    /api/villains/:id     // Actualizar villano
DELETE /api/villains/:id     // Eliminar villano
```

#### **Autenticación:**
```javascript
POST   /api/auth/register    // Registrar usuario
POST   /api/auth/login       // Iniciar sesión
```

---

## 🛠️ **Solución de Problemas**

### **Error: "Access to fetch has been blocked by CORS policy"**

**Causa:** Acceso desde `file://` en lugar de `http://localhost:3001`

**Solución:**
1. Ejecuta `node app.js`
2. Abre `http://localhost:3001` en el navegador
3. No uses doble clic en `index.html`

### **Error: "Failed to fetch"**

**Causa:** Servidor no está ejecutándose

**Solución:**
```bash
# Verificar que el servidor esté corriendo
node app.js

# Deberías ver:
# Servidor corriendo en el puerto 3001
# Documentación Swagger disponible en http://localhost:3001/api-docs
```

### **Error: "Cannot find module"**

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
```

---

## 📁 **Estructura del Proyecto**

```
api-superheroes/
├── app.js                    # Servidor principal
├── start-server.bat          # Script Windows
├── start-server.sh           # Script Linux/Mac
├── public/
│   ├── index.html           # Página principal
│   ├── standalone.js        # Frontend JS
│   └── uploads/             # Archivos subidos
│       ├── music/           # Música
│       └── images/          # Imágenes
├── data/
│   └── music-config.json    # Configuración música
└── package.json             # Dependencias
```

---

## 🎵 **Sistema de Música**

### **Funcionamiento:**
1. **Admin sube música** → Se guarda en `/public/uploads/music/`
2. **Configuración se actualiza** → En `/data/music-config.json`
3. **Música se reproduce** → Automáticamente desde servidor
4. **Persistencia** → Entre recargas y usuarios

### **Formatos soportados:**
- ✅ MP3 (audio/mpeg)
- ✅ WAV (audio/wav)
- ✅ OGG (audio/ogg)
- ✅ M4A (audio/mp4)

### **Límites:**
- **Tamaño máximo:** 10MB por archivo
- **Almacenamiento:** Físico en servidor
- **Acceso:** HTTP desde localhost

---

## 🔍 **Verificación de Funcionamiento**

### **Checklist:**

- [ ] **Servidor ejecutándose** en puerto 3001
- [ ] **Acceso desde** `http://localhost:3001`
- [ ] **No errores CORS** en consola
- [ ] **Música se sube** correctamente
- [ ] **Música se reproduce** automáticamente
- [ ] **Persistencia** al recargar página
- [ ] **Funcionamiento** para todos los usuarios

### **Logs útiles:**

```javascript
// En consola del navegador
console.log('🌐 Protocolo actual:', window.location.protocol);
console.log('🎵 Configuración:', await fetch('/api/music/config').then(r => r.json()));

// En consola del servidor
console.log('📁 Archivo subido:', req.file);
console.log('⚙️ Configuración guardada:', musicConfig);
```

---

## 🎉 **Resultado Final**

El sistema ahora funciona **completamente sin errores CORS**:

- ✅ **Servidor local** en puerto 3001
- ✅ **Rutas corregidas** para localhost
- ✅ **Detección automática** de errores file://
- ✅ **Manejo robusto** de errores CORS
- ✅ **Funcionamiento completo** del sistema de música
- ✅ **Persistencia** entre sesiones y usuarios

¡El sistema está listo para desarrollo y producción! 🚀 