# Guia de despliegue: Frontend en Vercel + Backend en Render

Este documento explica como desplegar este frontend en Vercel y conectarlo correctamente con el backend de tareas ya publicado en Render.

## 1. Requisitos previos

1. Tener cuenta en GitHub, Vercel y Render.
2. Tener el repositorio del frontend subido a GitHub.
3. Confirmar que el backend en Render esta activo.
4. URL actual del backend:
https://backend-list-task.onrender.com

## 2. Verificar backend en Render

Antes de desplegar el frontend, valida que la API responde.

1. Abre en navegador:
https://backend-list-task.onrender.com/tasks
2. Si responde JSON (aunque sea arreglo vacio), la API esta disponible.
3. Si falla, revisa logs de Render y estado del servicio.

## 3. Validar CORS en backend

Como el frontend correra en dominio Vercel y el backend en Render, CORS debe permitir el origen del frontend.

1. En backend, habilita CORS para:
http://localhost:5173
2. Despues del deploy, agrega tambien:
https://tu-proyecto.vercel.app
3. Si usas dominio custom, agrega ese dominio tambien.

### Paso adicional: verificar dominio de Vercel en CORS

Antes de probar el frontend, confirma que el backend permita el origen correcto de Vercel.

1. Si ya tienes URL final, agrega la ruta exacta en CORS:
https://practice-frontend-list.vercel.app
2. Si aun no tienes URL final, permite solo dominios de Vercel con patron:
https://*.vercel.app
3. Cuando tengas dominio definitivo, reemplaza el patron por la URL exacta para mayor seguridad.

## 4. Configuracion local del frontend

Este frontend usa Vite y variable de entorno VITE_API_URL.

1. Crea un archivo .env.local en la raiz del proyecto.
2. Agrega:
VITE_API_URL=https://backend-list-task.onrender.com
3. Ejecuta prueba local:
npm install
npm run dev
4. Verifica que las operaciones CRUD funcionen:
crear, listar, actualizar y eliminar tareas.

## 5. Subir cambios a GitHub

1. Confirma que el proyecto compila:
npm run build
2. Sube cambios:
git add .
git commit -m "prepare vercel deployment"
git push

## 6. Desplegar frontend en Vercel

1. Entra a Vercel.
2. Click en Add New Project.
3. Importa el repositorio del frontend desde GitHub.
4. En configuracion de build usa:
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
5. En Environment Variables agrega:
Name: VITE_API_URL
Value: https://backend-list-task.onrender.com
Environment: Production, Preview y Development
6. Ejecuta Deploy.

## 7. Verificar conexion frontend-backend en produccion

1. Abre la URL final de Vercel.
2. Prueba flujo completo:
crear tarea, marcar completada, eliminar tarea.
3. Si algo falla, abre DevTools del navegador y revisa:
Network
Console
Status HTTP
4. Confirma que las requests van a:
https://backend-list-task.onrender.com/tasks

## 8. Checklist rapido

- Backend responde en Render.
- CORS permite el dominio de Vercel.
- VITE_API_URL configurada en Vercel.
- Build en Vercel exitoso.
- CRUD funcionando en produccion.

## 9. Problemas comunes

1. Error CORS.
Causa: backend no permite origen de Vercel.
Solucion: agregar dominio de Vercel en CORS del backend.

2. Error 500 con mensaje de titulo vacio.
Causa: se envio title vacio.
Solucion: revisar validacion del formulario y datos enviados.

3. El frontend no conecta con backend.
Causa: VITE_API_URL no configurada o mal escrita.
Solucion: revisar variable en Vercel y hacer redeploy.

4. En local funciona, en produccion no.
Causa: variable solo en local.
Solucion: agregar variable en Vercel para Production.

## 10. Recomendacion para presentacion academica

1. Mostrar primero el backend respondiendo en Render.
2. Mostrar luego variables en Vercel.
3. Mostrar el flujo CRUD en la app desplegada.
4. Mostrar manejo de error (por ejemplo, titulo vacio).

Con esto el proyecto queda correctamente desplegado y conectado: backend en Render + frontend en Vercel.
