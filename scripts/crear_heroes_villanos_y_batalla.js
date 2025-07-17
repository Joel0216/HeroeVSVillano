// Script para crear 3 héroes, 3 villanos y una batalla 3vs3 manualmente
// Requiere Node.js >= 18 (fetch nativo)

const API = 'http://localhost:3001/api';
const TOKEN = 'AQUI_TU_TOKEN_JWT'; // <-- Pega aquí tu token JWT válido

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
};

const heroes = [
  { name: 'Solaris', alias: 'El Radiante', city: 'Ciudad Luz', team: 'Guardianes' },
  { name: 'Aquamán', alias: 'Señor del Agua', city: 'Atlántida', team: 'Guardianes' },
  { name: 'Viento', alias: 'El Susurro', city: 'Cumbres', team: 'Guardianes' }
];

const villains = [
  { name: 'Sombra', alias: 'El Oscuro', city: 'Nocturnia', team: 'Legión' },
  { name: 'Tóxico', alias: 'El Corrosivo', city: 'Vertedero', team: 'Legión' },
  { name: 'Destructor', alias: 'El Imparable', city: 'Ruinas', team: 'Legión' }
];

async function crearEntidad(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function obtener(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function main() {
  // Crear héroes
  for (const hero of heroes) {
    await crearEntidad(`${API}/heroes`, hero);
  }
  // Crear villanos
  for (const villain of villains) {
    await crearEntidad(`${API}/villains`, villain);
  }
  // Obtener IDs
  const heroesDB = await obtener(`${API}/heroes`);
  const villainsDB = await obtener(`${API}/villains`);
  // Armar equipos
  const heroTeam = heroesDB.slice(0, 3).map(h => ({ characterId: h.id, type: 'hero' }));
  const villainTeam = villainsDB.slice(0, 3).map(v => ({ characterId: v.id, type: 'villain' }));
  // Crear batalla
  const batalla = await crearEntidad(`${API}/battles/turn-based-teams`, { heroTeam, villainTeam });
  console.log('Batalla creada:', JSON.stringify(batalla, null, 2));
}

main().catch(e => console.error('Error:', e.message)); 