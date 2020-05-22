sugerencias('sugerencias');
getSearchResults('tendencias', '', 'http://api.giphy.com/v1/gifs/trending', '', 12);

document.getElementById('tema-day').addEventListener('click', evento => {
    document.getElementsByTagName('body')[0].className = '';
    document.querySelector('.detalle-select-tema').style.display = 'none';
});

document.getElementById('tema-night').addEventListener('click', evento => {
    document.getElementsByTagName('body')[0].className = 'dark';
    document.querySelector('.detalle-select-tema').style.display = 'none';
});

document.getElementById('logo').addEventListener('click', evento => {
    document.getElementById('resultado-busqueda').style.display = 'none';
    document.getElementById('tendencias').style.display = 'block';
    document.getElementById('sugerencias').style.display = 'block';
});

document.getElementById('input-buscar').addEventListener('input', evento => {
    let valor = document.getElementById('input-buscar').value;

    const url = 'http://api.giphy.com/v1/tags/related/' + valor;
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    fetch(url + '?api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let similar = data.data[Math.floor(Math.random() * 19)];
            let boton = document.querySelector('#boton-sugerido');
            boton.dataset.valor = similar.name;
            boton.innerHTML = 'Resultado de la busqueda de ' + similar.name;

            similar = data.data[Math.floor(Math.random() * 19)];
            boton = document.querySelector('#boton-similar');
            boton.dataset.valor = similar.name;
            boton.innerHTML = 'Un resultado similar a ' + similar.name;

            similar = data.data[Math.floor(Math.random() * 19)];
            boton = document.querySelector('#boton-otro');
            boton.dataset.valor = similar.name;
            boton.innerHTML = 'Y otro mas... ' + similar.name;
        })
        .catch(error => {
            return error;
        });

    document.querySelector('.detalle-buscar').style.display = 'flex';
});

document.querySelector('.link-mis-guifos').addEventListener('click', evento => {
    let mis_guifos = document.querySelector('#mis-guifos');
    let display_secciones = mis_guifos.style.display == "" ? 'none' : mis_guifos.style.display;

    document.querySelector('#sugerencias').style.display = display_secciones;
    document.querySelector('#tendencias').style.display = display_secciones;
    document.querySelector('#crear-guifos').style.display = display_secciones;

    display_secciones = display_secciones == 'none' ? 'block' : 'none';
    mis_guifos.style.display = display_secciones;
});

document.querySelector('.btn-crear-guifos').addEventListener('click', evento => {
    let crear_guifos = document.querySelector('#crear-guifos');
    let display_secciones = crear_guifos.style.display == "" ? 'none' : crear_guifos.style.display;

    document.querySelector('#buscar').style.display = display_secciones;
    document.querySelector('#sugerencias').style.display = display_secciones;
    document.querySelector('#tendencias').style.display = display_secciones;
    document.querySelector('.botones-cabecera').style.display = display_secciones;

    display_secciones = display_secciones == 'none' ? 'block' : 'none';
    crear_guifos.style.display = display_secciones;
    document.querySelector('#mis-guifos').style.display = display_secciones;
});

document.querySelector('.select-tema').addEventListener('click', evento => {
    let display_detalle_select_tema = document.querySelector('.detalle-select-tema').style.display == 'none' ? 'flex' : 'none';
    document.querySelector('.detalle-select-tema').style.display = display_detalle_select_tema;
});

document.querySelector('.boton-buscar').addEventListener('click', evento => {
    document.querySelector('.detalle-buscar').style.display = 'none';
    let valor = document.querySelector('#input-buscar').value;
    getSearchResults('resultado-busqueda', valor, 'http://api.giphy.com/v1/gifs/search', '&q=' + valor, 16);
});

document.querySelector('#boton-sugerido').addEventListener('click', evento => {
    document.querySelector('.detalle-buscar').style.display = 'none';
    let valor = document.querySelector('#boton-sugerido').dataset.valor;
    getSearchResults('resultado-busqueda', valor, 'http://api.giphy.com/v1/gifs/search', '&q=' + valor, 16);
});

document.querySelector('#boton-similar').addEventListener('click', evento => {
    document.querySelector('.detalle-buscar').style.display = 'none';
    let valor = document.querySelector('#boton-similar').dataset.valor;
    getSearchResults('resultado-busqueda', valor, 'http://api.giphy.com/v1/gifs/search', '&q=' + valor, 16);
});

document.querySelector('#boton-otro').addEventListener('click', evento => {
    document.querySelector('.detalle-buscar').style.display = 'none';
    sugerencias('resultado-busqueda');
});

function sugerencias(id_seccion){
    const url = 'http://api.giphy.com/v1/trending/searches';
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    const found = fetch(url + '?api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            getSearchResults(id_seccion, '', 'http://api.giphy.com/v1/gifs/search', '&q=' + data[Math.floor(Math.random() * 19)], 4);
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
            fillGalery(id_seccion, titulo, data, numero_imagenes);
        })
        .catch(error => {
            return error;
        });
    return found;
}

function fillGalery(id_seccion, title, data, columnas) {
    if (title != '') {
        document.querySelector('#' + id_seccion + ' h2').innerHTML = title + ' (resultados)';
    }

    if(id_seccion == 'resultado-busqueda'){
        document.getElementById('resultado-busqueda').style.display = 'block';
        document.getElementById('tendencias').style.display = 'none';
        document.getElementById('sugerencias').style.display = 'none';
    }else{
        document.getElementById('resultado-busqueda').style.display = 'none';
        document.getElementById('tendencias').style.display = 'block';
        document.getElementById('sugerencias').style.display = 'block';
    }

    document.querySelector('#' + id_seccion + ' .galeria').innerHTML = '';

    for (let i = 0; i < data.data.length; i++) {
        let datos_imagen = data.data[i];
        let image_width = datos_imagen.images.fixed_width.width;
        let span = '1';
        columnas--;
        if (image_width > 280) {
            image_width = 19.5*2;
            span = '2';
            columnas--;
        }else{
            image_width = 19.5;
        }

        if (columnas >= 0) {
            let articulo = document.createElement('article');
            articulo.className = 'imagen-con-marco';
            articulo.style.gridColumnStart = 'span ' + span;
            articulo.style.width = image_width + "vw";
            articulo.style.height = "20vw";
            articulo.style.backgroundSize = "100% 100%";
            articulo.style.backgroundRepeat = "no-repeat";
            articulo.style.backgroundImage = "url('" + datos_imagen.images.fixed_width.url + "')";

            if(id_seccion == 'sugerencias'){
                let divTitulo = document.createElement('div');
                divTitulo.className = 'titulo-superior titulo-imagen-marco';
                let spanTitulo = document.createElement('span');
                spanTitulo.innerHTML = datos_imagen.title;
                divTitulo.appendChild(spanTitulo);
                let imgTitulo = document.createElement('img');
                imgTitulo.src = 'imagenes/button3.svg';
                divTitulo.appendChild(imgTitulo);
                articulo.appendChild(divTitulo);

                let boton = document.createElement('button');
                boton.innerHTML = 'Ver más...';
                boton.className = 'button-ver-mas';
                articulo.appendChild(boton);
            }else{
                let divTitulo = document.createElement('div');
                divTitulo.className = 'titulo-superior subtitulo-imagen-marco';
                let slug = datos_imagen.slug.split('-', 3);
                divTitulo.innerHTML = "#" + slug.join(" #");
                articulo.appendChild(divTitulo);
            }

            document.querySelector('#' + id_seccion + ' .galeria').appendChild(articulo);

        } else {
            i++;
            columnas--;
        }

    }
}
