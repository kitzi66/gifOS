'use strict';

var video, recorder;

function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    })
        .then(async function (stream) {
            video = document.querySelector('video');
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: function () {
                    console.log('started')
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
        })
}

function startRecording() {
    recorder.startRecording();
}

function stopRecording() {
    recorder.stopRecording(function () {
        let blob = recorder.getBlob();
        console.log('Stop recording');
        recorder.getDataURL(function (dataURI) {
            video.src = dataURI;
        });
    });
}

function uploadRecording() {
    var formData = new FormData();
    formData.append('file', recorder.getBlob(), 'myGift.gif');
    //uploadToServer(formData);
    guardarLocalStorage('myGifOs', json.data.id);
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

function guardarLocalStorage(llave, dato){
    let consecutivo = localStorage.getItem('consecutivo_myGifOs');
    if(consecutivo == null){
        consecutivo = 1;
    }
    localStorage.setItem(llave + '_' + consecutivo,dato);
    localStorage.setItem('consecutivo_myGifOs', consecutivo+1);
}