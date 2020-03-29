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

    if(window.location.pathname === '/pamplona' || window.location.pathname === '/pamplona/'){
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
                L.geoJson(data, {
                    onEachFeature: function(feature,layer){
                        layer.bindPopup("<b>"+feature.properties.entidad+"</b><br>"+feature.properties.municipio+" ("+feature.properties.telefono+")<br>" + feature.properties.horario + "<br>" + feature.properties.notas);
                    }
                }).addTo(map);

            })
        });
    

   
}(window.jQuery, window, document));