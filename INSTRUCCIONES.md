# 🎮 Instrucciones para usar el Juego de Héroes vs Villanos

## 🚀 Cómo iniciar el proyecto

### 1. **Iniciar el servidor**
```bash
npm start
```

### 2. **Acceder al juego**
**IMPORTANTE:** NO hagas doble clic en el archivo HTML. En su lugar:

1. **Abre tu navegador**
2. **Escribe en la barra de direcciones:** `http://localhost:3001`
3. **Presiona Enter**

## ❌ **NO hagas esto:**
- ❌ Doble clic en `index.html`
- ❌ Abrir `file:///C:/.../index.html`
- ❌ Usar Live Server en VSCode

## ✅ **SÍ haz esto:**
- ✅ Acceder desde `http://localhost:3001`
- ✅ Usar el servidor Express que ya está configurado

## 🔧 **Por qué es importante:**

### **Problema con `file:///`:**
- ❌ No puede hacer llamadas a la API
- ❌ Errores de CORS
- ❌ "Error de conexión" aparece
- ❌ No funciona el registro/login

### **Ventajas de `http://localhost:3001`:**
- ✅ Puede hacer llamadas a la API
- ✅ Sin errores de CORS
- ✅ Todo funciona correctamente
- ✅ Registro y login funcionan

## 👤 **Cómo usar el juego:**

### **1. Registrarse como Admin:**
- Username: `joel_adminofficial`
- Password: `080406`

### **2. Agregar héroes y villanos:**
- Usa los formularios en el panel de administración
- Cada personaje necesita nombre y alias
- Puedes agregar imagen URL opcional

### **3. Ejemplos de personajes:**

**Héroes:**
- **Iron Man:** Tony Stark, Malibu, Los Vengadores
- **Spider-Man:** Peter Parker, Nueva York, Los Vengadores
- **Captain America:** Steve Rogers, Brooklyn, Los Vengadores

**Villanos:**
- **Thanos:** The Mad Titan, Titan, Los Black Order
- **Loki:** Loki Laufeyson, Asgard, Independiente
- **Venom:** Eddie Brock, San Francisco, Independiente

## 🛠️ **Solución de problemas:**

### **Error: "No se puede conectar al servidor"**
1. Verifica que el servidor esté corriendo: `npm start`
2. Asegúrate de acceder desde `http://localhost:3001`
3. No uses `file:///`

### **Error: "Acceso solo para administrador"**
1. Regístrate con el usuario admin correcto
2. Usa "Forzar Logout" si es necesario
3. Verifica que el role sea "admin"

### **Error: "Ya existe un héroe con este nombre"**
- El sistema detecta duplicados automáticamente
- Usa un nombre diferente o edita el existente

## 📱 **Funcionalidades disponibles:**

### **Para Admin:**
- ✅ Agregar héroes y villanos
- ✅ Editar personajes existentes
- ✅ Eliminar personajes
- ✅ Ver todos los personajes registrados

### **Para Usuarios:**
- ✅ Ver héroes y villanos disponibles
- ✅ Seleccionar personajes para batalla
- ✅ Sistema de selección 3vs3 (en desarrollo)

## 🎯 **Próximas funcionalidades:**
- ⏳ Sistema de batalla interactivo
- ⏳ Matchmaking entre usuarios
- ⏳ Pantalla de confirmación de equipos
- ⏳ Lógica de combate con "Pegar" y "Especial"

---

**¡Disfruta del juego! 🎮** 