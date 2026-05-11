# Instrucciones Finales: Configurar Firebase

¡El sistema ya está programado con la nueva arquitectura! 
Para que todo funcione, solo necesitas activar dos cosas en tu panel de Firebase. Sigue estos pasos exactos:

## 1. Activar la Base de Datos (Firestore)
1. Ve al panel de tu proyecto en Firebase.
2. En el menú de la izquierda, busca **"Compilación"** (o "Build") y haz clic en **"Firestore Database"**.
3. Haz clic en el botón **"Crear base de datos"**.
4. Te pedirá una ubicación. Deja la que viene por defecto y dale a **Siguiente**.
5. Te preguntará las reglas de seguridad. Selecciona **"Comenzar en modo de prueba"** (Start in test mode) y haz clic en **Habilitar**.

## 2. Activar los Usuarios (Authentication)
1. En el menú de la izquierda, bajo "Compilación", haz clic en **"Authentication"**.
2. Haz clic en el botón **"Comenzar"**.
3. Verás una lista de proveedores (Google, Facebook, etc.). Haz clic en **"Correo electrónico/Contraseña"** (Email/Password).
4. Activa la primera opción ("Habilitar") y dale a **Guardar**.

## 3. Crear tu Usuario Administrador (IMPORTANTE)
1. En la misma pantalla de Authentication, ve a la pestaña de arriba que dice **"Users"** (Usuarios).
2. Haz clic en el botón **"Agregar usuario"**.
3. Escribe el correo: `admin@hcd.gob.ar`
4. Ponle una contraseña fácil que recuerdes (ej: `123456`).
5. Dale a Agregar.
*(Puedes repetir este paso para crear los correos de los demás concejales, ejemplo: `perez@hcd.gob.ar`, `gomez@hcd.gob.ar`, etc).*

---

### ¡Listo para probar!
- Abre el archivo `index.html` haciendo doble clic.
- Verás la nueva **Pantalla de Login**.
- Ingresa con `admin@hcd.gob.ar` y la contraseña que creaste.
- Como eres administrador, verás el botón **"Cargar Excel"** para poder subir todos los proyectos de golpe si quieres, o puedes tocar **"Nuevo Proyecto"**.
- Si entras con la cuenta de un concejal (ej: `perez@hcd.gob.ar`), NO verá el botón de Cargar Excel, y solo podrá editar los proyectos que él mismo haya creado.
