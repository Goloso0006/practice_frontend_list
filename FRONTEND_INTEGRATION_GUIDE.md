# 📋 Guía de Integración Frontend - To-Do List API

## 🎯 Introducción

Este documento proporciona una guía completa para integrar el frontend con nuestra API REST de To-Do List que ya está **desplegada en Render** y funcionando correctamente.

**URL Base de la API:** `https://backend-list-task.onrender.com`

---

## 📁 Estructura del Proyecto Backend

Conocer la estructura del backend te ayudará a comprender mejor cómo funciona nuestra API:

```
backend/
├── src/main/java/com/todolist/backend/
│   ├── BackendApplication.java          # Punto de entrada de la aplicación
│   ├── controller/
│   │   └── TaskController.java          # Controlador REST que define los endpoints
│   ├── service/
│   │   └── TaskService.java             # Lógica de negocio
│   ├── model/
│   │   └── Task.java                    # Entidad/Modelo de datos
│   └── repository/
│       └── TaskRepository.java          # Acceso a base de datos
├── resources/
│   └── application.properties           # Configuración (BD, puerto, etc.)
└── pom.xml                               # Dependencias Maven
```

### Explicación de capas:

1. **Controller (Controlador):** Recibe las solicitudes HTTP y delega a Services
2. **Service (Servicio):** Contiene la lógica de negocio y validaciones
3. **Repository (Repositorio):** Accede directamente a la base de datos
4. **Model (Modelo):** Define la estructura de datos (entidades)

---

## 📦 Modelo de Datos: Task

Cada tarea tiene la siguiente estructura JSON:

```json
{
  "id": 1,
  "title": "Comprar leche",
  "description": "Ir al supermercado",
  "completed": false
}
```

### Atributos:

| Atributo | Tipo | Requerido | Descripción |
|----------|------|-----------|-------------|
| `id` | Long | ❌ Auto-generado | Identificador único de la tarea |
| `title` | String | ✅ Sí | Título o nombre de la tarea (no puede estar vacío) |
| `description` | String | ⚠️ Opcional | Descripción detallada de la tarea |
| `completed` | Boolean | ⚠️ Opcional | Estado: true (completada) / false (pendiente) |

---

## 🔌 Endpoints Disponibles

### 1. GET /tasks - Obtener todas las tareas

Recupera la lista completa de tareas.

**Endpoint:** `GET https://backend-list-task.onrender.com/tasks`

**Parámetros:** Ninguno

**Headers recomendados:**
```
Accept: application/json
```

**Ejemplo con JavaScript/Fetch:**
```javascript
async function getAllTasks() {
  try {
    const response = await fetch('https://backend-list-task.onrender.com/tasks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tasks = await response.json();
    console.log('Tareas obtenidas:', tasks);
    return tasks;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
  }
}
```

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Comprar pan",
    "description": "Ir a la tienda",
    "completed": false
  },
  {
    "id": 2,
    "title": "Estudiar React",
    "description": "Repasar hooks",
    "completed": true
  }
]
```

---

### 2. POST /tasks - Crear una nueva tarea

Crea una nueva tarea en la base de datos.

**Endpoint:** `POST https://backend-list-task.onrender.com/tasks`

**Headers requeridos:**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**
```json
{
  "title": "Mi nueva tarea",
  "description": "Descripción de la tarea",
  "completed": false
}
```

**Validaciones:**
- ✅ El campo `title` es **obligatorio** y no puede estar vacío
- ⚠️ Los campos `description` y `completed` son opcionales

**Ejemplo con JavaScript/Fetch:**
```javascript
async function createTask(taskData) {
  try {
    const response = await fetch('https://backend-list-task.onrender.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description || '',
        completed: taskData.completed || false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const newTask = await response.json();
    console.log('Tarea creada:', newTask);
    return newTask;
  } catch (error) {
    console.error('Error al crear tarea:', error);
  }
}

// Uso:
createTask({
  title: "Hacer ejercicio",
  description: "30 minutos de cardio",
  completed: false
});
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 3,
  "title": "Hacer ejercicio",
  "description": "30 minutos de cardio",
  "completed": false
}
```

**Error esperado (400/500):**
```json
{
  "timestamp": "2026-04-19T10:30:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "El título no puede estar vacío"
}
```

---

### 3. PUT /tasks/{id} - Actualizar una tarea existente

Actualiza los datos de una tarea específica.

**Endpoint:** `PUT https://backend-list-task.onrender.com/tasks/{id}`

**Parámetro de ruta:**
- `{id}` - ID de la tarea a actualizar (Long)

**Headers requeridos:**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**
```json
{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "completed": true
}
```

**Ejemplo con JavaScript/Fetch:**
```javascript
async function updateTask(taskId, updatedData) {
  try {
    const response = await fetch(`https://backend-list-task.onrender.com/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: updatedData.title,
        description: updatedData.description || '',
        completed: updatedData.completed || false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const updatedTask = await response.json();
    console.log('Tarea actualizada:', updatedTask);
    return updatedTask;
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
  }
}

// Uso:
updateTask(1, {
  title: "Comprar pan y leche",
  description: "Actualizado",
  completed: true
});
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "title": "Comprar pan y leche",
  "description": "Actualizado",
  "completed": true
}
```

**Error si no existe el ID:**
```json
{
  "timestamp": "2026-04-19T10:35:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Tarea no encontrada"
}
```

---

### 4. DELETE /tasks/{id} - Eliminar una tarea

Elimina una tarea específica de la base de datos.

**Endpoint:** `DELETE https://backend-list-task.onrender.com/tasks/{id}`

**Parámetro de ruta:**
- `{id}` - ID de la tarea a eliminar (Long)

**Headers recomendados:**
```
Accept: application/json
```

**Ejemplo con JavaScript/Fetch:**
```javascript
async function deleteTask(taskId) {
  try {
    const response = await fetch(`https://backend-list-task.onrender.com/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    console.log(`Tarea ${taskId} eliminada correctamente`);
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
  }
}

// Uso:
deleteTask(1);
```

**Respuesta esperada (200 OK):**
- Sin cuerpo de respuesta (solo código 200)

---

## 🛠️ Buenas Prácticas para Consumir la API

### 1. **Manejo de Errores**

Siempre implementa un manejo robusto de errores:

```javascript
async function apiCall(method, endpoint, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`https://backend-list-task.onrender.com${endpoint}`, options);
    
    // Validar respuesta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    // Verificar si hay contenido en la respuesta
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}
```

### 2. **Configurar CORS (Cross-Origin Resource Sharing)**

Si tu frontend está en un dominio diferente al backend, necesitarás configurar CORS. El backend ya debe estar configurado, pero verifica en la consola del navegador si hay errores CORS.

**Error típico de CORS:**
```
Access to XMLHttpRequest at 'https://backend-list-task.onrender.com/tasks' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

### 3. **Variables de Entorno**

Mantén la URL base en una variable de entorno, no hardcodeada:

```javascript
// .env
REACT_APP_API_URL=https://backend-list-task.onrender.com

// En tu código
const API_URL = process.env.REACT_APP_API_URL || 'https://backend-list-task.onrender.com';

// O con Vite:
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-list-task.onrender.com';
```

### 4. **Implementar Spinners/Loaders**

Siempre muestra feedback visual mientras se realizan peticiones:

```javascript
async function getTasks() {
  showLoader(); // Mostrar spinner
  
  try {
    const tasks = await apiCall('GET', '/tasks');
    displayTasks(tasks);
  } catch (error) {
    showError('No se pudieron cargar las tareas');
  } finally {
    hideLoader(); // Ocultar spinner
  }
}
```

### 5. **Validación en Frontend**

Valida datos **antes** de enviarlos al backend:

```javascript
function validateTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new Error('El título es requerido');
  }
  
  if (task.title.length > 200) {
    throw new Error('El título no puede exceder 200 caracteres');
  }
  
  return true;
}

// Uso
try {
  validateTask(newTask);
  await createTask(newTask);
} catch (error) {
  showError(error.message);
}
```

### 6. **Cacheo (Opcional)**

Considera cachear datos para reducir solicitudes:

```javascript
let tasksCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

async function getTasks(useCache = true) {
  const now = Date.now();
  
  if (useCache && tasksCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return tasksCache;
  }
  
  const tasks = await apiCall('GET', '/tasks');
  tasksCache = tasks;
  cacheTimestamp = now;
  
  return tasks;
}
```

### 7. **Reintentos Automáticos**

Para conexiones inestables, implementa reintentos:

```javascript
async function apiCallWithRetry(method, endpoint, body = null, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall(method, endpoint, body);
    } catch (error) {
      lastError = error;
      console.log(`Intento ${i + 1}/${maxRetries} fallido, reintentando...`);
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Esperar exponencialmente
      }
    }
  }
  
  throw lastError;
}
```

---

## 📝 Ejemplo Completo: Aplicación To-Do List

Aquí hay un ejemplo completo de cómo podría verse la integración:

### HTML (Estructura)
```html
<div id="app">
  <h1>Mi Lista de Tareas</h1>
  
  <div id="loader" style="display:none;">Cargando...</div>
  
  <form id="taskForm">
    <input 
      type="text" 
      id="taskTitle" 
      placeholder="Título de la tarea" 
      required
    >
    <textarea 
      id="taskDescription" 
      placeholder="Descripción (opcional)"
    ></textarea>
    <button type="submit">Agregar Tarea</button>
  </form>
  
  <ul id="taskList"></ul>
</div>
```

### JavaScript (Lógica)
```javascript
const API_URL = 'https://backend-list-task.onrender.com';
const loader = document.getElementById('loader');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', loadTasks);

// Formulario para crear tarea
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;
  
  try {
    await createTask({ title, description, completed: false });
    taskForm.reset();
    await loadTasks();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

async function loadTasks() {
  showLoader(true);
  
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();
    
    taskList.innerHTML = '';
    tasks.forEach(task => renderTask(task));
  } catch (error) {
    console.error('Error cargando tareas:', error);
    alert('No se pudieron cargar las tareas');
  } finally {
    showLoader(false);
  }
}

async function createTask(taskData) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  
  if (!response.ok) throw new Error('Error al crear tarea');
  return response.json();
}

async function updateTask(id, taskData) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  
  if (!response.ok) throw new Error('Error al actualizar tarea');
  return response.json();
}

async function deleteTask(id) {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) throw new Error('Error al eliminar tarea');
}

function renderTask(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <input 
      type="checkbox" 
      ${task.completed ? 'checked' : ''} 
      onchange="toggleTask(${task.id}, ${!task.completed})"
    >
    <span>${task.title}</span>
    <p>${task.description}</p>
    <button onclick="deleteTaskUI(${task.id})">Eliminar</button>
  `;
  taskList.appendChild(li);
}

async function toggleTask(id, completed) {
  try {
    await updateTask(id, { completed });
    await loadTasks();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function deleteTaskUI(id) {
  if (confirm('¿Deseas eliminar esta tarea?')) {
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
}

function showLoader(show) {
  loader.style.display = show ? 'block' : 'none';
}
```

---

## 🚀 Pasos para Comenzar a Integrar

### Paso 1: Verificar que la API está en línea
```javascript
fetch('https://backend-list-task.onrender.com/tasks')
  .then(r => r.json())
  .then(data => console.log('✅ API activa:', data))
  .catch(e => console.error('❌ API no disponible:', e));
```

### Paso 2: Crear función base para llamadas API
Implementa una función reutilizable para todas tus llamadas a la API.

### Paso 3: Crear componentes/funciones para CRUD
- Función para listar tareas
- Función para crear tarea
- Función para actualizar tarea
- Función para eliminar tarea

### Paso 4: Conectar UI con funciones
Vincula botones y formularios con las funciones de API.

### Paso 5: Implementar manejo de errores
Mostrar mensajes útiles al usuario cuando algo falla.

### Paso 6: Pruebas
Prueba cada operación CRUD manualmente en tu aplicación.

---

## 🐛 Troubleshooting (Solución de Problemas)

### Problema: Error CORS
```
Access to XMLHttpRequest at 'https://backend-list-task.onrender.com/tasks'
has been blocked by CORS policy
```
**Solución:** El backend debe estar configurado con CORS habilitado. Contacta al equipo backend.

### Problema: 500 Internal Server Error
```
"El título no puede estar vacío"
```
**Solución:** Asegúrate de validar que el campo `title` no sea vacío antes de enviar.

### Problema: La API responde lentamente
**Solución:** 
- Revisa tu conexión a internet
- Implementa un timeout en tus llamadas
- Usa reintentos automáticos con espera progresiva

### Problema: No veo cambios después de actualizar
**Solución:** Implementa un refresh de datos después de cada operación (CREATE, UPDATE, DELETE).

---

## 📚 Recursos Útiles

### Para React:
- **Axios:** librería HTTP simplificada
  ```bash
  npm install axios
  ```
- **React Query:** manejo avanzado de estado y caché
  ```bash
  npm install @tanstack/react-query
  ```
- **SWR:** obtención de datos con caché
  ```bash
  npm install swr
  ```

### Para Vue:
- **Composable useFetch:** integrado en Vue 3
- **Pinia:** gestión de estado
- **Axios:** cliente HTTP

### Para Angular:
- **HttpClient:** incluido en Angular
- **RxJS:** programación reactiva
- **Interceptors:** para logging y manejo de errores

### Documentación Oficial:
- [MDN Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)
- [MDN CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

---

## ✅ Checklist de Integración

- [ ] Verificar que la API responde en `https://backend-list-task.onrender.com/tasks`
- [ ] Implementar función base para llamadas API
- [ ] Crear función para GET /tasks
- [ ] Crear función para POST /tasks
- [ ] Crear función para PUT /tasks/{id}
- [ ] Crear función para DELETE /tasks/{id}
- [ ] Implementar validación en frontend
- [ ] Agregar manejo de errores
- [ ] Agregar spinners/loaders
- [ ] Pruebas CRUD completas
- [ ] Probar en diferentes navegadores
- [ ] Documentar decisiones técnicas

---

## 📞 Contacto y Soporte

Para dudas sobre:
- **Estructura del backend:** Contacta al equipo backend
- **Endpoints:** Revisa este documento o el archivo `api.md`
- **Errores técnicos:** Revisa la consola del navegador y el servidor

---

**Última actualización:** 19 de Abril de 2026  
**URL API:** `https://backend-list-task.onrender.com`  
**Estado:** ✅ En producción y operativo

