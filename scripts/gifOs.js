'use strict';

(function(){
    document.getElementsByTagName('body')[0].className = localStorage.getItem('tema');
})();

ocultarSeccion(['buscar', 'sugerencias', 'tendencias', 'botones-cabecera']);
sugerencias('sugerencias');
getSearchResults('tendencias', '', 'https://api.giphy.com/v1/gifs/trending', '', 12);
activaBusquedaBotones('boton-detalle');

document.getElementById('tema-day').addEventListener('click', evento => {
    document.getElementsByTagName('body')[0].className = '';
    document.querySelector('.detalle-select-tema').style.display = 'none';
    localStorage.setItem('tema', 'day')
});

document.getElementById('tema-night').addEventListener('click', evento => {
    document.getElementsByTagName('body')[0].className = 'dark';
    document.querySelector('.detalle-select-tema').style.display = 'none';
    localStorage.setItem('tema', 'dark')
});

document.getElementById('logos-flechas').addEventListener('click', evento => {
    inicio()
});

document.getElementById('btn-crear-cancelar').addEventListener('click', evento => {
    inicio()
});

document.getElementById('btn-crear-cancelar-1').addEventListener('click', evento => {
    inicio()
});

document.querySelector('.btn-gifos-subido-listo').addEventListener('click', evento => {
    inicio()
});

document.getElementById('input-buscar').addEventListener('input', evento => {
    let valor = document.getElementById('input-buscar').value;

    if (valor.length <= 0) {
        document.querySelector('#boton-buscar').setAttribute('class', 'btn-crear-captura boton-buscar-normal boton-buscar-active');
    } else {
        document.querySelector('#boton-buscar').setAttribute('class', 'btn-crear-captura boton-buscar-normal boton-buscar-input');
        const url = 'https://api.giphy.com/v1/tags/related/' + valor;
        const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
        fetch(url + '?api_key=' + apiKey)
            .then(response => {
                return response.json();
            })
            .then(data => {
                let similar = data.data[Math.floor(Math.random() * 10)];
                let boton = document.querySelector('#boton-sugerido');
                boton.dataset.valor = similar.name;
                boton.innerHTML = '#' + similar.name;

                similar = data.data[Math.floor(Math.random() * 10)];
                boton = document.querySelector('#boton-similar');
                boton.dataset.valor = similar.name;
                boton.innerHTML = '#' + similar.name;

                similar = data.data[Math.floor(Math.random() * 10)];
                boton = document.querySelector('#boton-otro');
                boton.dataset.valor = similar.name;
                boton.innerHTML = '#' + similar.name;

                document.querySelector('#detalle-buscar').removeAttribute('class', 'detalle-buscar-buscado');
                document.querySelector('#detalle-buscar').setAttribute('class', 'detalle-buscar-buscando');
            })
            .catch(error => {
                return error;
            });

        document.querySelector('#detalle-buscar').style.display = 'flex';
    }
});

document.querySelector('.link-mis-guifos').addEventListener('click', evento => {
    ocultarSeccion(['mis-guifos', 'botones-cabecera']);
    getMisGuifos();
});

document.querySelector('#btn-crear-guifos').addEventListener('click', evento => {
    ocultarSeccion(['crear-guifos', 'mis-guifos']);
    document.querySelector('.flecha-regresar').style.display = 'block';
    getMisGuifos();
});

document.querySelector('.select-tema').addEventListener('click', evento => {
    let display_detalle_select_tema = document.querySelector('.detalle-select-tema').style.display == 'flex' ? 'none' : 'flex';
    document.querySelector('.detalle-select-tema').style.display = display_detalle_select_tema;
});

document.querySelector('#boton-buscar').addEventListener('click', evento => {
    document.querySelector('#detalle-buscar').removeAttribute('class', 'detalle-buscar-buscando');
    document.querySelector('#detalle-buscar').setAttribute('class', 'detalle-buscar-buscado');
    ocultarSeccion(['buscar', 'resultado-busqueda', 'botones-cabecera']);

    let valor = document.querySelector('#input-buscar').value;
    getSearchResults('resultado-busqueda', valor, 'https://api.giphy.com/v1/gifs/search', '&q=' + valor, 16);
});

function sugerencias(id_seccion) {
    const url = 'https://api.giphy.com/v1/trending/searches';
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    const found = fetch(url + '?api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            getSearchResults(id_seccion, '', 'https://api.giphy.com/v1/gifs/search', '&q=' + data[Math.floor(Math.random() * 19)], 4);
        })
        .catch(error => {
            return error;
        });
    return found;
}

function getSearchResults(id_seccion, titulo, url, opciones, numero_imagenes) {
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    const found = fetch(url + '?api_key=' + apiKey + '&limit=25' + opciones)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(numero_imagenes == 1){
                return data;
            }else{
                fillGalery(id_seccion, titulo, data.data, numero_imagenes);
            }
        })
        .catch(error => {
            return error;
        });
    return found;
}

function getMisGuifos() {
    let misGuifos = obtenerLocalStorage('myGifOs')
    if(misGuifos != null){
        getSearchResults('mis-guifos', 'Mis guifos', 'https://api.giphy.com/v1/gifs', '&ids=' + misGuifos.join(','), 50);
    }
}

function ocultarSeccion(secciones_activas) {
    let secciones = ['buscar', 'resultado-busqueda', 'tendencias', 'sugerencias', 'mis-guifos', 'crear-guifos', 'buscar', 'botones-cabecera'];

    for (let i = 0; i < secciones.length; i++) {
        let valor_display = 'none';
        if (secciones_activas.includes(secciones[i])) {
            valor_display = secciones[i] == 'botones-cabecera' ? 'flex' : 'block';
        }
        document.getElementById(secciones[i]).style.display = valor_display;
    }
}

function fillGalery(id_seccion, title, data, numero_imagenes) {
    if (title != '') {
        document.querySelector('#' + id_seccion + ' h2').innerHTML = title + ' (resultados)';
    }

    document.querySelector('#' + id_seccion + ' .galeria').innerHTML = '';
    let pinta = false;
    let lineas = parseInt(numero_imagenes / 4);
    for (let j = 0; j < lineas; j++) {
        let arrayPintado = [];
        let columnas = 4;
        for (let i = 0; i < data.length; i++) {
            let datos_imagen = data[i];
            let image_width = datos_imagen.images.fixed_height.width;
            let proporcion = parseInt(image_width / 280);
            let span = proporcion + 1;
            pinta = false;
            if (columnas - span >= 0) {
                columnas -= span;
                pinta = true;
                arrayPintado.push(i);
            }

            if (pinta) {

                let articulo = document.createElement('article');
                articulo.className = 'imagen-con-marco';
                articulo.style.gridColumnStart = 'span ' + span;

                let slug = datos_imagen.slug.split('-', 3);
                if (id_seccion == 'sugerencias') {
                    articulo.style.height = '21.75vw';
                    let divTitulo = document.createElement('div');
                    divTitulo.className = 'titulo-superior titulo-imagen-marco';
                    let spanTitulo = document.createElement('span');
                    spanTitulo.innerHTML = datos_imagen.title;
                    divTitulo.appendChild(spanTitulo);
                    let imgTitulo = document.createElement('img');
                    imgTitulo.src = '/gifOs/imagenes/button3.svg';
                    divTitulo.appendChild(imgTitulo);
                    articulo.appendChild(divTitulo);

                    let boton = document.createElement('button');
                    boton.innerHTML = 'Ver más...';
                    boton.className = 'button-ver-mas boton-detalle';
                    boton.dataset.valor = slug[0];
                    articulo.appendChild(boton);
                } else {
                    articulo.style.height = '20vw';
                    articulo.style.flexDirection = 'column-reverse'
                    let divTitulo = document.createElement('div');
                    divTitulo.className = 'titulo-superior subtitulo-imagen-marco';
                    divTitulo.innerHTML = "#" + slug.join(" #");
                    articulo.appendChild(divTitulo);
                }

                let divImagen = document.createElement('div');
                divImagen.className = 'imagen';
                divImagen.style.height = "20vw";
                divImagen.style.backgroundSize = "100% 100%";
                divImagen.style.backgroundRepeat = "no-repeat";
                divImagen.style.backgroundImage = "url('" + datos_imagen.images.fixed_height.url + "')";
                articulo.appendChild(divImagen);

                document.querySelector('#' + id_seccion + ' .galeria').appendChild(articulo);

            }

        }
        data = removerImagenArreglo(data, arrayPintado);
    }
    activaBusquedaBotones('boton-detalle');
}

function removerImagenArreglo(imagenes_originales, imagenes_pintada) {
    let temporal = imagenes_originales;
    for (let i = imagenes_pintada.length - 1; i >= 0; i--) {
        temporal = temporal.filter((e, index) => index !== imagenes_pintada[i]);
    }
    return temporal;
}

function activaBusquedaBotones(clase) {
    document.querySelectorAll('.' + clase).forEach(box => {
        box.addEventListener('click', evento => {
            console.log(evento);
            document.querySelector('#detalle-buscar').removeAttribute('class', 'detalle-buscar-buscando');
            document.querySelector('#detalle-buscar').setAttribute('class', 'detalle-buscar-buscado');
            ocultarSeccion(['buscar', 'resultado-busqueda', 'botones-cabecera']);

            let valor = box.dataset.valor;
            getSearchResults('resultado-busqueda', valor, 'https://api.giphy.com/v1/gifs/search', '&q=' + valor, 16);
        });
    });
}

function inicio(){
    location.reload()
}
