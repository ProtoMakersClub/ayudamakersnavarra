(function($, window, document) {
    var mapConfigValues = {
        navarra: {
            coords: [42.5266345,-1.6927823],
            zoomLevel: 9
        },
        pamplona: {
            coords: [42.8158236,-1.6850411],
            zoomLevel: 12
        }
    }
    var mapConfig = mapConfigValues['navarra'];

    var jsonFile = 'navarra.json';
    if(window.location.pathname === '/pamplona' || window.location.pathname === '/pamplona/'){
        jsonFile = 'pamplona.json'
        mapConfig =  mapConfigValues['pamplona'];
    }

    $('#map').each(function(el){ 
        var map = L.map('map').setView(mapConfig.coords, mapConfig.zoomLevel); // Navarra
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);


    
        fetch("/json/navarra.json")
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
                

                L.geoJson(data, {
                    onEachFeature: popUpInfo
                }).addTo(map);

            })
        });
    
    function popUpInfo(feature, layer) {
        // ¿Esta característica tiene una propiedad llamada popupContent?
        if (feature.properties && feature.properties.punto_entrega) {
            layer.bindPopup("<b>"+feature.properties.punto_entrega+"</b><br>"+feature.properties.municipio+" ("+feature.properties.telefono+")");
            //layer.bindPopup("<b>"+feature.properties.punto_entrega);
        }
    }
   
}(window.jQuery, window, document));