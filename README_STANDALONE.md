# 🎮 DataFight - Versión Standalone

## ✅ **¡COMPLETAMENTE INDEPENDIENTE!**

Esta versión del juego funciona **100% sin servidor**, sin API, sin base de datos. Todo se ejecuta directamente en el navegador usando **localStorage**.

## 🚀 **Cómo usar:**

### **Opción 1: Doble clic directo**
1. **Haz doble clic en:** `public/index.html`
2. **¡Listo!** El juego se abre directamente

### **Opción 2: Desde el explorador**
1. **Abre tu explorador de archivos**
2. **Ve a la carpeta:** `public/`
3. **Haz doble clic en:** `index.html`

### **Opción 3: Arrastrar al navegador**
1. **Abre tu navegador**
2. **Arrastra el archivo:** `public/index.html` al navegador

---

## 🎯 **Funcionalidades disponibles:**

### **✅ Registro y Login:**
- **Admin predefinido:** `joel_adminofficial` / `080406`
- **Registro de nuevos usuarios**
- **Sistema de roles (admin/user)**

### **✅ Panel de Administración:**
- **Agregar héroes y villanos**
- **Editar personajes existentes**
- **Eliminar personajes**
- **Ver todos los personajes registrados**

### **✅ Selección de Personajes:**
- **Ver héroes y villanos disponibles**
- **Seleccionar hasta 3 héroes**
- **Seleccionar hasta 3 villanos**
- **Sistema de selección 3vs3**

### **✅ Datos predefinidos:**
- **3 héroes:** Iron Man, Spider-Man, Captain America
- **3 villanos:** Thanos, Loki, Venom
- **Admin predefinido** ya configurado

---

## 🔧 **Ventajas de la versión standalone:**

### **✅ Sin dependencias:**
- ❌ No necesita servidor
- ❌ No necesita API
- ❌ No necesita base de datos
- ❌ No necesita npm install
- ❌ No necesita puertos

### **✅ Funciona en cualquier lugar:**
- ✅ Doble clic directo
- ✅ Funciona offline
- ✅ Sin errores de CORS
- ✅ Sin problemas de conexión
- ✅ Sin configuración

### **✅ Datos persistentes:**
- ✅ Los datos se guardan en localStorage
- ✅ Persisten entre sesiones
- ✅ No se pierden al cerrar el navegador

---

## 👤 **Cómo usar el juego:**

### **1. Iniciar sesión como Admin:**
- Username: `joel_adminofficial`
- Password: `080406`

### **2. Agregar personajes:**
- Usa los formularios en el panel de administración
- Cada personaje necesita nombre y alias
- Puedes agregar imagen URL opcional

### **3. Para usuarios normales:**
- Regístrate con cualquier usuario
- Ve a la selección de personajes
- Selecciona 3 héroes y 3 villanos

---

## 🛠️ **Solución de problemas:**

### **No aparece nada:**
- Verifica que el archivo `index.html` esté en la carpeta `public/`
- Asegúrate de que `standalone.js` esté en la misma carpeta

### **No se guardan los datos:**
- Verifica que localStorage esté habilitado en tu navegador
- Intenta en modo incógnito

### **No funciona en algún navegador:**
- Funciona en Chrome, Firefox, Edge, Safari
- Si no funciona, actualiza tu navegador

---

## 📁 **Estructura de archivos:**

```
public/
├── index.html          # Página principal
├── standalone.js       # Lógica del juego (standalone)
└── README_STANDALONE.md # Este archivo
```

---

## 🎮 **Próximas funcionalidades:**

- ⏳ Sistema de batalla interactivo
- ⏳ Pantalla de confirmación de equipos
- ⏳ Lógica de combate con "Pegar" y "Especial"
- ⏳ Efectos visuales y animaciones

---

## 🎯 **Diferencias con la versión con servidor:**

| Característica | Standalone | Con Servidor |
|----------------|------------|--------------|
| **Instalación** | Doble clic | `npm start` |
| **Conexión** | No necesita | `http://localhost:3001` |
| **Datos** | localStorage | MongoDB |
| **Usuarios** | localStorage | Base de datos |
| **Funcionalidad** | Completa | Completa |
| **Offline** | ✅ Sí | ❌ No |

---

**¡Disfruta del juego completamente independiente! 🚀**

*Esta versión es perfecta para demostraciones, presentaciones o uso sin configuración.* 