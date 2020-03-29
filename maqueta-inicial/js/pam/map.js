var map = L.map('map').setView([42.8158236,-1.6850411], 12); // Pamplona

var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors'
}).addTo(map);

function popUpInfo(feature, layer) {
    // ¿Esta característica tiene una propiedad llamada popupContent?
    if (feature.properties && feature.properties.punto_entrega) {
        layer.bindPopup("<b>"+feature.properties.punto_entrega+"</b><br>"+feature.properties.municipio+" ("+feature.properties.telefono+")");
        //layer.bindPopup("<b>"+feature.properties.punto_entrega);
    }
}
L.geoJson(museos, {
    onEachFeature: popUpInfo
    }).addTo(map);
