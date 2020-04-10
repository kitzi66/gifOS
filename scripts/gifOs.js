getTrending();

let buscar = document.querySelector('.boton-buscar');
buscar.addEventListener('click', evento => {
    let valor = document.querySelector('#input-buscar').value;
    getSearchResults(valor);
    
});

function getSearchResults(search) {
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey + '&limit=4')
        .then(response => {
            return response.json();
        })
        .then(data => {
            fillGalery('resultado-busqueda', search, data);
        })
        .catch(error => {
            return error;
        });
    return found;
}

function getTrending(){
    const apiKey = '8ddUn1OBNxlR9Eoomd5d3zys1iNYSGIH';
    const found = fetch('http://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=4')
        .then(response => {
            return response.json();
        })
        .then(data => {
            fillGalery('tendencias', '', data);
        })
        .catch(error => {
            return error;
        });
    return found;
}

function fillGalery(id_seccion, title, data){
    if(title != ''){
        document.querySelector('#' + id_seccion + ' h2').innerHTML = title + ' (resultados)';
    }
    for(let i = 0; i<data.data.length; i++){
            let selector = document.querySelector('#' + id_seccion + ' .img-' + (i+1));
            selector.setAttribute('src', data.data[i].images.fixed_height.url);
            selector.style.height = data.data[i].images.fixed_height.height;
    }
}
