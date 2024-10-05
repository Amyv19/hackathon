let map; // Variable global para el mapa
let marker; // Variable global para el marcador
let airQualityChart; // Variable para la gráfica

// Función para mostrar el mapa inicial
function displayInitialMap() {
    const defaultLat = 20.5937; // Latitud de India
    const defaultLon = 78.9629; // Longitud de India
    map = L.map('map').setView([defaultLat, defaultLon], 3); // Cambia el nivel de zoom según tus preferencias

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);
}

// Crea la gráfica
function createChart(data) {
    const ctx = document.getElementById('airQualityChart').getContext('2d');
    if (airQualityChart) {
        airQualityChart.destroy(); // Destruye la gráfica anterior si existe
    }
    
    airQualityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['CO', 'NO', 'O3', 'PM2.5'],
            datasets: [{
                label: 'Niveles de Contaminantes',
                data: [
                    data.co,
                    data.no,
                    data.o3,
                    data.pm2_5
                ],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.6)', // Color verde para CO
                    'rgba(244, 67, 54, 0.6)', // Color rojo para NO
                    'rgba(33, 150, 243, 0.6)', // Color azul para O3
                    'rgba(255, 193, 7, 0.6)'  // Color amarillo para PM2.5
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)', // Color verde para CO
                    'rgba(244, 67, 54, 1)', // Color rojo para NO
                    'rgba(33, 150, 243, 1)', // Color azul para O3
                    'rgba(255, 193, 7, 1)'  // Color amarillo para PM2.5
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.getElementById('getAQI').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    if (city) {
        getAirQuality(city);
    } else {
        alert('Por favor ingresa el nombre de una ciudad.');
    }
});

async function getAirQuality(city) {
    const apiKey = 'c91b794bd6ef4a769058efc5306b0977'; // Coloca aquí tu API Key de OpenWeatherMap
    const geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Muestra el mensaje de carga
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('airQualityChart').style.display = 'none';

    try {
        const geoResponse = await fetch(geoApiUrl);
        const geoData = await geoResponse.json();

        if (geoResponse.ok) {
            const { coord: { lat, lon } } = geoData;
            console.log(`Latitud: ${lat}, Longitud: ${lon}`); // Agregar para depuración
            const airQualityApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const airResponse = await fetch(airQualityApiUrl);
            const airData = await airResponse.json();

            if (airResponse.ok) {
                displayAirQuality(geoData.name, airData.list[0].components, airData.list[0].main.aqi);
                updateMap(lat, lon); // Actualiza el mapa en vez de recrearlo
                createChart(airData.list[0].components); // Crear la gráfica con los datos de calidad del aire
            } else {
                alert('Error al obtener datos de calidad del aire.');
            }
        } else {
            alert('Ciudad no encontrada. Intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al conectar con la API.');
    } finally {
        // Oculta el mensaje de carga y muestra la gráfica
        document.getElementById('loadingMessage').style.display = 'none';
        document.getElementById('airQualityChart').style.display = 'block';
    }
}

function displayAirQuality(cityName, components, aqi) {
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('aqi').textContent = aqi;
    document.getElementById('co').textContent = components.co;
    document.getElementById('no').textContent = components.no;
    document.getElementById('o3').textContent = components.o3;
    document.getElementById('pm25').textContent = components.pm2_5;
    document.querySelector('.result-box').style.display = 'block'; // Muestra el cuadro de resultados
}

function updateMap(lat, lon) {
    if (marker) {
        marker.setLatLng([lat, lon]); // Si ya hay un marcador, solo actualiza la posición
    } else {
        marker = L.marker([lat, lon]).addTo(map) // Crea un nuevo marcador
            .bindPopup('Ubicación de la ciudad')
            .openPopup();
    }
    map.setView([lat, lon], 13); // Actualiza la vista del mapa
}

window.onload = displayInitialMap; // Muestra el mapa inicial al cargar la página
