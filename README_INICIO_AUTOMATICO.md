# 🚀 Inicio Automático - Héroes vs Villanos

## 🎯 **Objetivo**

Ejecutar el servidor y **abrir automáticamente** la página web en el navegador sin tener que escribir la URL manualmente.

---

## 📋 **Scripts Disponibles**

### **1. Windows - Inicio Automático**
```bash
# Opción 1: Script con navegador automático
start-with-browser.bat

# Opción 2: Script básico
start-server.bat

# Opción 3: NPM
npm start
```

### **2. Linux/Mac - Inicio Automático**
```bash
# Opción 1: Script con navegador automático
chmod +x start-with-browser.sh
./start-with-browser.sh

# Opción 2: Script básico
chmod +x start-server.sh
./start-server.sh

# Opción 3: NPM
npm start
```

---

## 🛠️ **Cómo Funciona**

### **Scripts con Navegador Automático**

**Windows (`start-with-browser.bat`):**
1. Instala dependencias con `npm install`
2. Inicia el servidor en segundo plano
3. Espera 3 segundos
4. Abre automáticamente `http://localhost:3001` en el navegador

**Linux/Mac (`start-with-browser.sh`):**
1. Instala dependencias con `npm install`
2. Inicia el servidor en segundo plano
3. Espera 3 segundos
4. Detecta el sistema operativo y abre el navegador correspondiente

---

## 🎯 **Resultado Esperado**

Después de ejecutar cualquiera de los scripts:

1. **Se instalan las dependencias** automáticamente
2. **Se inicia el servidor** en el puerto 3001
3. **Se abre automáticamente** el navegador con la aplicación
4. **No hay errores de file://** porque accedes desde http://localhost:3001
5. **Todas las funciones** están habilitadas

---

## 📱 **Comandos de Uso**

### **Windows**
```bash
# Método más fácil (recomendado)
start-with-browser.bat

# Método alternativo
start-server.bat

# Método con npm
npm start
```

### **Linux/Mac**
```bash
# Método más fácil (recomendado)
chmod +x start-with-browser.sh
./start-with-browser.sh

# Método alternativo
chmod +x start-server.sh
./start-server.sh

# Método con npm
npm start
```

---

## 🔧 **Solución de Problemas**

### **Si el navegador no se abre automáticamente:**

**Windows:**
```bash
# Abrir manualmente
start http://localhost:3001
```

**Linux:**
```bash
# Abrir manualmente
xdg-open http://localhost:3001
```

**macOS:**
```bash
# Abrir manualmente
open http://localhost:3001
```

### **Si el servidor no inicia:**
```bash
# Verificar que Node.js esté instalado
node --version

# Verificar que las dependencias estén instaladas
npm install

# Iniciar manualmente
node app.js
```

---

## 📋 **Checklist de Verificación**

- [ ] **Script ejecutado** correctamente
- [ ] **Dependencias instaladas** automáticamente
- [ ] **Servidor iniciado** en puerto 3001
- [ ] **Navegador abierto** automáticamente
- [ ] **URL correcta**: http://localhost:3001
- [ ] **No errores de file://** en la consola
- [ ] **Botones habilitados** (no opacos)
- [ ] **Funciones de autenticación** funcionando
- [ ] **Sistema de música** funcionando

---

## 🎉 **Después del Inicio**

Una vez que el navegador se abra automáticamente:

1. **Verás la página principal** sin errores de file://
2. **Los botones estarán habilitados** (no opacos)
3. **Podrás registrar usuarios** y hacer login
4. **El sistema de música** funcionará correctamente
5. **Todas las funciones** estarán disponibles

---

## 💡 **Consejos**

- **Usa `start-with-browser.bat`** en Windows para el inicio más fácil
- **Usa `start-with-browser.sh`** en Linux/Mac para el inicio más fácil
- **Si tienes problemas**, ejecuta `npm install` manualmente primero
- **Verifica que el puerto 3001** no esté ocupado por otra aplicación

¡Ahora puedes iniciar la aplicación con un solo clic y el navegador se abrirá automáticamente! 🚀 