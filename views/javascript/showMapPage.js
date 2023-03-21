mapboxgl.accessToken = 'pk.eyJ1IjoidmFpYmhhdjA4MDYiLCJhIjoiY2xmaTFxMGc2MDd2bzN5cDJ1d2ExeDBtaSJ9.ksRFszOL1mPE2B0oxLvAJA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [79.9802, 13.5269], // starting position [lng, lat]
    zoom: 10, // starting zoom
});