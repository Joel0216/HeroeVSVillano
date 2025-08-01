// Script para probar autenticación
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  console.log('🧪 Probando sistema de autenticación...\n');
  
  try {
    // 1. Probar registro de usuario normal
    console.log('1️⃣ Probando registro de usuario normal...');
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registro exitoso:', {
        userId: registerData.userId,
        role: registerData.role,
        hasToken: !!registerData.token
      });
      
      // 2. Probar login con el usuario creado
      console.log('\n2️⃣ Probando login...');
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'testpass123'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login exitoso:', {
          userId: loginData.userId,
          role: loginData.role,
          hasToken: !!loginData.token
        });
        
        // 3. Probar acceso a música con token
        console.log('\n3️⃣ Probando acceso a configuración de música...');
        const musicResponse = await fetch(`${BASE_URL}/api/music/config`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        if (musicResponse.ok) {
          const musicData = await musicResponse.json();
          console.log('✅ Acceso a música exitoso:', musicData);
        } else {
          console.log('❌ Error accediendo a música:', musicResponse.status);
        }
        
        // 4. Probar acceso admin
        console.log('\n4️⃣ Probando login de admin...');
        const adminResponse = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: 'joel_adminofficial',
            password: '080406'
          })
        });
        
        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          console.log('✅ Login admin exitoso:', {
            userId: adminData.userId,
            role: adminData.role,
            hasToken: !!adminData.token
          });
          
          // 5. Probar acceso a rutas protegidas de admin
          console.log('\n5️⃣ Probando acceso a rutas protegidas de admin...');
          const protectedResponse = await fetch(`${BASE_URL}/api/music/config`, {
            headers: {
              'Authorization': `Bearer ${adminData.token}`
            }
          });
          
          if (protectedResponse.ok) {
            console.log('✅ Acceso a rutas protegidas exitoso');
          } else {
            console.log('❌ Error accediendo a rutas protegidas:', protectedResponse.status);
          }
        } else {
          console.log('❌ Error en login de admin:', adminResponse.status);
        }
        
      } else {
        console.log('❌ Error en login:', loginResponse.status);
      }
      
    } else {
      console.log('❌ Error en registro:', registerResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
  }
  
  console.log('\n🎯 Pruebas completadas');
}

// Ejecutar pruebas
testAuth(); 