'use strict';

var recorder;
var stream;
var id_intervalo;
var id_barra_progreso;
var pasos = 0;
var segundos = 0;
var blob;

document.getElementById('btn-crear-comenzar').addEventListener('click', comenzarGrabacion);

document.querySelector('#btn-crear-capturando').addEventListener('click', async e => {
    console.log('Stop recording');
    await recorder.stopRecording(stopRecording);
    document.getElementById('crear-guifos').classList.add('vista_previa')
    document.querySelector('.instrucciones > .titulo-superior').innerHTML = 'Vista Previa';
});

document.getElementById('btn-crear-capturar').addEventListener('click', startRecording);
document.getElementById('btn-crear-repetir').addEventListener('click', comenzarGrabacion);
document.getElementById('btn-crear-subir').addEventListener('click', uploadRecording);
document.querySelector('.btn-gifos-subido-copiar').addEventListener('click', copiar)
document.querySelector('.btn-gifos-subido-descargar').addEventListener('click', e => {
    invokeSaveAsDialog(blob, 'filename.gif');
});

function comenzarGrabacion() {
    document.getElementById('crear-guifos').classList.remove('antes_empezar', 'capturando', 'vista_previa', 'subiendo', 'subido')
    document.getElementById('crear-guifos').classList.add('antes_empezar')
    document.getElementById('mis-guifos').style.display = 'block'
    document.querySelector('.instrucciones > .titulo-superior').innerHTML = 'Un Chequeo Antes de Empezar'
    getStreamAndRecord()
}

async function getStreamAndRecord() {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    });

    let video = document.querySelector('video');
    recorder = new RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 320,
        hidden: 240,
        onGifRecordingStarted: function () {
            console.log('started');
        }
    });

    recorder.stream = stream;

    if ("srcObject" in video) {
        video.srcObject = stream;
    } else {
        video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = function (e) {
        video.play();
    };
}

async function startRecording() {
    console.log('Empezamos a grabar')
    segundos = 0;
    pasos = 0;
    id_intervalo = setInterval(tiempoTranscurrido, 1000)
    id_barra_progreso = setInterval(estadosBarraProgreso, 2000)
    document.getElementById('crear-guifos').classList.add('capturando')
    await recorder.startRecording()
}

async function stopRecording() {
    try {
        let video = document.querySelector('video');

        video.srcObject = null

        clearInterval(id_intervalo)
        clearInterval(id_barra_progreso)
        blob = await recorder.getBlob()

        document.querySelector('.img-gifos').src = URL.createObjectURL(recorder.getBlob());

        recorder.stream.stop();

        await recorder.reset();
        await recorder.destroy();
        recorder = null;
    } catch (error) {
        console.log(error);
    }
}

function uploadRecording() {
    document.getElementById('crear-guifos').classList.add('subiendo')
    let formData = new FormData()
    formData.append('file', blob, 'myGift.gif')
    uploadToServer(formData);
}

function uploadToServer(formData) {
    pasos = 0;
    id_barra_progreso = setInterval(estadosBarraProgreso1, 200);
    var miInit = {
        method: 'POST',
        body: formData,
        headers: new Headers(),
        mode: 'cors',
        cache: 'default'
    }

    const url = 'https://upload.giphy.com/v1/gifs';
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    fetch(url + '?api_key=' + apiKey, miInit)
        .then(function (response) {
            return response.json()
        })
        .then(function (json) {
            guardarLocalStorage('myGifOs', json.data.id)
            clearInterval(id_barra_progreso)
            generaPresentacionFinal()
        }).catch(e => {
            console.log(e)
        });
}

async function generaPresentacionFinal() {
    document.getElementById('crear-guifos').classList.remove('antes_empezar', 'capturando', 'vista_previa', 'subiendo', 'subido')
    document.getElementById('crear-guifos').classList.add('subido')
    getMisGuifos();
    let misGuifos = obtenerLocalStorage('myGifOs')
    if (misGuifos.length > 0) {
        let id = misGuifos[misGuifos.length - 1];
        let miImagen = await getSearchResults('mis-guifos', 'Mis guifos', 'https://api.giphy.com/v1/gifs', '&ids=' + id, 1);
        document.querySelector('.img-gifos-subido').style.backgroundSize = "100% 100%"
        document.querySelector('.img-gifos-subido').style.backgroundRepeat = "no-repeat"
        document.querySelector('.img-gifos-subido').style.backgroundImage = "url('" + miImagen.data[0].images.fixed_height.url + "')"
        document.querySelector('.img-gifos-subido').dataset.id = miImagen.data[0].url;
    }
}

function guardarLocalStorage(llave, dato) {

    let datos_misGuifos = localStorage.getItem(llave)
    let misGuifos = []
    if (datos_misGuifos != null) {
        misGuifos = JSON.parse(datos_misGuifos)
    }
    misGuifos.push(dato);
    localStorage.setItem(llave, JSON.stringify(misGuifos))
}

function obtenerLocalStorage(llave) {
    let datos_misGuifos = localStorage.getItem(llave);
    return JSON.parse(datos_misGuifos)
}

function tiempoTranscurrido() {
    segundos++
    let horas = 0
    let minutos = 0
    let restante = 0

    restante = segundos % 60
    minutos = parseInt(segundos / 60)
    if (minutos >= 60) {
        minutos = (minutos % 60)
        horas = parseInt(minutos / 60)
    }
    presentaTiempo(horas, minutos, restante)
}

function presentaTiempo(hora, minuto, segundo) {
    let txt_hora = hora < 10 ? '0' + hora : hora
    let txt_minuto = minuto < 10 ? '0' + minuto : minuto
    let txt_segundo = segundo < 10 ? '0' + segundo : segundo
    let mensaje = txt_hora + ':' + txt_minuto + ':' + txt_segundo
    document.getElementById('tiempo_grabacion').innerHTML = mensaje
}

function estadosBarraProgreso() {
    pasos++
    if (pasos <= 20) {
        document.querySelector('#progreso_' + pasos).classList.remove('libre')
        document.querySelector('#progreso_' + pasos).classList.add('ocupado')
    }
}

function estadosBarraProgreso1() {
    pasos++
    if (pasos <= 20) {
        document.querySelector('#progreso1_' + pasos).classList.remove('libre')
        document.querySelector('#progreso1_' + pasos).classList.add('ocupado')
    }
}

function copiar() {
    // Crea un campo de texto "oculto"
    var aux = document.createElement("input");
    // Asigna el contenido del elemento especificado al valor del campo
    aux.value = document.querySelector('.img-gifos-subido').dataset.id;
    // Añade el campo a la página
    document.body.appendChild(aux);
    // Selecciona el contenido del campo
    aux.select();
    // Copia el texto seleccionado
    document.execCommand("copy");
    // Elimina el campo de texto de la página
    document.body.removeChild(aux);
}