const API_KEY = 'T4Jr71iVfwUpGfaxIEnwoUyJDOe8NcRF'; // Reemplázala por la tuya
const API_SECRET = 'hMla6AtnWMIpZMyefeM422jTBvw36Kjk'; // Reemplázala por la tuya
const FACESET_ID = 'my_faceset'; // Identificador único del FaceSet
let registeredFaceToken = null;

// Iniciar la cámara
async function startCamera() {
    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        alert("Error al acceder a la cámara. Verifica los permisos.");
        console.error(error);
    }
}

// Captura una imagen del video y la convierte a base64
async function captureFace() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg').split(',')[1]; // Elimina el encabezado Base64
}

// Crear un FaceSet (solo se ejecuta una vez)
async function createFaceSet() {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('outer_id', FACESET_ID);

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/faceset/create', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    console.log("FaceSet creado:", data);
    alert("FaceSet creado correctamente.");
}

// Registrar un rostro y guardarlo en el FaceSet
async function registerFace() {
    try {
        const imageBase64 = await captureFace();
        const formData = new FormData();
        formData.append('api_key', API_KEY);
        formData.append('api_secret', API_SECRET);
        formData.append('image_base64', imageBase64);

        const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log("Respuesta API Registro:", data);

        if (data.faces && data.faces.length > 0) {
            registeredFaceToken = data.faces[0].face_token;
            alert('¡Rostro registrado exitosamente!');

            // Agregar el rostro al FaceSet
            addFaceToFaceSet(registeredFaceToken);
        } else {
            alert('No se detectó ningún rostro. Verifica la iluminación y posición.');
        }
    } catch (error) {
        alert('Error al registrar el rostro.');
        console.error(error);
    }
}

// Agregar un rostro registrado al FaceSet
async function addFaceToFaceSet(faceToken) {
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('outer_id', FACESET_ID);
    formData.append('face_tokens', faceToken);

    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    console.log("Rostro agregado al FaceSet:", data);
}

// Verificación de rostro (Login)
async function loginFace() {
    try {
        if (!registeredFaceToken) {
            alert('Primero debes registrar tu rostro.');
            return;
        }

        const imageBase64 = await captureFace();
        const formData = new FormData();
        formData.append('api_key', API_KEY);
        formData.append('api_secret', API_SECRET);
        formData.append('image_base64', imageBase64);
        formData.append('outer_id', FACESET_ID); // Se referencia el FaceSet

        const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/search', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log("Respuesta API Login:", data);

        if (data.results && data.results.length > 0) {
            const matchedFaceToken = data.results[0].face_token;
            console.log("Token de rostro comparado:", matchedFaceToken);

            if (matchedFaceToken === registeredFaceToken) {
                window.location.href = 'pokemon/pokemon_index.html';
            } else {
                document.getElementById('message').textContent = 'Rostro no reconocido.';
            }
        } else {
            document.getElementById('message').textContent = 'No se detectó rostro.';
        }
    } catch (error) {
        alert('Error al verificar el rostro.');
        console.error(error);
    }
}

// Eventos de botones
document.getElementById('createFaceSetBtn').addEventListener('click', createFaceSet);
document.getElementById('registerBtn').addEventListener('click', registerFace);
document.getElementById('loginBtn').addEventListener('click', loginFace);

// Iniciar la cámara automáticamente
startCamera();