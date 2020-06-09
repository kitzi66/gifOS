'use strict';

var recorder;
var stream;
var id_intervalo;
var segundos = 0;
var blob;

document.getElementById('btn-crear-comenzar').addEventListener('click', e => {
    document.getElementById('mis-guifos').style.display = 'none';
    document.querySelector('.detalle-instrucciones').style.display = 'none';
    document.querySelector('.precaptura').style.display = 'block';
    document.querySelector('#btn-crear-comenzar').style.display = 'none';
    document.getElementById('tiempo_grabacion').style.display = 'none';
    document.querySelector('.instrucciones').style.width = '59.8vw';
    document.querySelector('.instrucciones').style.height = '38.1vw';
    document.querySelector('.instrucciones > .titulo-superior').innerHTML = 'Un Chequeo Antes de Empezar';
    getStreamAndRecord();
});

document.getElementById('btn-crear-capturar').addEventListener('click', startRecording);

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
            document.querySelector('.precaptura-botones').style.justifyContent = 'space-between'
            document.getElementById('tiempo_grabacion').style.display = 'inline';
            document.querySelector('#btn-crear-capturar').classList.remove('btn-crear-capturar');
            document.querySelector('#btn-crear-capturar').classList.add('btn-crear-capturando');
            agregarEventoGrabando('btn-crear-capturando');
        }
    });

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
    console.log('Empezamos a grabar');
    id_intervalo = setInterval(tiempoTranscurrido, 1000);
    await recorder.startRecording();
    recorder.stream = stream;
}

async function stopRecording() {
    try {
        let video = document.querySelector('video');

        video.src = video.srcObject = null;

        clearInterval(id_intervalo);
        blob = await recorder.getBlob();
        video.src = URL.createObjectURL(blob);
        recorder.stream.stop();

        await recorder.reset();
        await recorder.destroy();
        recorder = null;
        invokeSaveAsDialog(blob, 'prueba.webm');
    } catch (error) {
        console.log(error);
    }
}

function uploadRecording() {
    var formData = new FormData();
    formData.append('file', blob, 'myGift.gif');
    //uploadToServer(formData);
}

function uploadToServer(formData) {

    var miInit = {
        method: 'POST',
        body: formData,
        headers: new Headers(),
        mode: 'cors',
        cache: 'default'
    };

    const url = 'http://upload.giphy.com/v1/gifs';
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';

    fetch(url + '?api_key=' + apiKey, miInit)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (json) {
            console.log(json);
            guardarLocalStorage('myGifOs', json.data.id);
        });
}

function guardarLocalStorage(llave, dato) {
    let consecutivo = localStorage.getItem('consecutivo_' + llave);
    if (consecutivo == null) {
        consecutivo = 1;
    }
    localStorage.setItem(llave + '_' + consecutivo, dato);
    localStorage.setItem('consecutivo_' + llave, consecutivo + 1);
}

function obtenerLocalStorage(llave) {
    let consecutivo = localStorage.getItem('consecutivo_' + llave);
    let imagenes = [];
    /*if(consecutivo == null){
        return imagenes;
    }*/

    for (let i = 1; i <= consecutivo; i++) {
        imagenes.push(localStorage.getItem(llave + '_' + i));
    }

    return imagenes;
}

function tiempoTranscurrido() {
    segundos++;
    let horas = 0;
    let minutos = 0;
    let restante = 0;

    restante = segundos % 60;
    minutos = parseInt(segundos / 60);
    if (minutos >= 60) {
        minutos = (minutos % 60);
        horas = parseInt(minutos / 60);
    }
    presentaTiempo(horas, minutos, restante);
}

function presentaTiempo(hora, minuto, segundo) {
    let txt_hora = hora < 10 ? '0' + hora : hora;
    let txt_minuto = minuto < 10 ? '0' + minuto : minuto;
    let txt_segundo = segundo < 10 ? '0' + segundo : segundo;
    let mensaje = txt_hora + ':' + txt_minuto + ':' + txt_segundo;
    //console.log(mensaje);
    document.getElementById('tiempo_grabacion').innerHTML = mensaje;
}

function agregarEventoGrabando(clase) {
    document.querySelector('.' + clase).addEventListener('click', async e => {
        console.log('Stop recording');
        await recorder.stopRecording();
        stopRecording();
    });
}