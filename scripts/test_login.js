// Script para probar el endpoint de login
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testLogin() {
  console.log('🧪 Probando endpoint de login...\n');
  
  try {
    // 1. Probar login con credenciales válidas
    console.log('1️⃣ Probando login con credenciales válidas...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'joel_adminofficial',
        password: '080406'
      })
    });
    
    console.log('📊 Status:', loginResponse.status);
    console.log('📋 Headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login exitoso:', {
        message: loginData.message,
        userId: loginData.userId,
        role: loginData.role,
        username: loginData.username,
        hasToken: !!loginData.token
      });
    } else {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log('❌ Error en login:', errorData);
    }
    
    // 2. Probar login con credenciales inválidas
    console.log('\n2️⃣ Probando login con credenciales inválidas...');
    const invalidResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'usuario_inexistente',
        password: 'password_incorrecto'
      })
    });
    
    console.log('📊 Status:', invalidResponse.status);
    
    if (!invalidResponse.ok) {
      const errorData = await invalidResponse.json().catch(() => ({}));
      console.log('✅ Error esperado:', errorData);
    }
    
    // 3. Probar login sin campos requeridos
    console.log('\n3️⃣ Probando login sin campos requeridos...');
    const missingFieldsResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'joel_adminofficial'
        // password faltante
      })
    });
    
    console.log('📊 Status:', missingFieldsResponse.status);
    
    if (!missingFieldsResponse.ok) {
      const errorData = await missingFieldsResponse.json().catch(() => ({}));
      console.log('✅ Error esperado:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
  }
  
  console.log('\n🎯 Pruebas completadas');
}

// Ejecutar pruebas
testLogin(); 