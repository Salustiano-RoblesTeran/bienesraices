(function (){
    const lat =  -26.8325366;
    const lng =  -65.2962519;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
}) ()