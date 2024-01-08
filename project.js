 

 
 function clearBox() {
    var inputText = document.getElementById('search').value;

    if (inputText.trim() === '') {
        document.getElementById('box').innerHTML = '';
    }
}

// Assuming you have an input field with id 'search', you can attach the function to its 'input' event
document.getElementById('search').addEventListener('input', clearBox);

 function initMap() {
 
var mapOptions = {
    center:{lat: 28.6139, lng: 77.2090},
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

var map = new google.maps.Map(document.getElementById('googleMap'),mapOptions);


var input = document.getElementById('search');
     
var options = {
    types: ['(cities)'],
}

var autocomplete = new google.maps.places.Autocomplete(input,options);


var ans = document.getElementById('success');

ans.onclick = function(){
    var place = autocomplete.getPlace();
        console.log(place);
     if(place.geometry === undefined || place.geometry === null){
         alert("Please select a valid location");
         return;
     }
     
    map.setCenter(place.geometry.location);
    map.setZoom(10);

    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
    })

     fetchWeather(place.name, place.geometry.location)
};


 document.getElementById('hourly').addEventListener('click', function () {
    var place = autocomplete.getPlace();

    if (place.geometry === undefined || place.geometry === null) {
        alert("Please select a valid location");
        return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(10);

    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
    });

    fetchHourlyData(place.name);
    
});

 
document.getElementById('daily').addEventListener('click', function () {
    var place = autocomplete.getPlace();

    if (place.geometry === undefined || place.geometry === null) {
        alert("Please select a valid location");
        return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(10);

    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
    });


    fetchDailyData(place.name);


});


 document.getElementById('air').addEventListener('click', function () {
    var place = autocomplete.getPlace();
     
    if (place.geometry === undefined || place.geometry === null) {
        alert("Please select a valid location");
        return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(10);

    var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name
    });

    AirQuality(place.name , place.geometry.location);
    });
}


function convertTimestamptoTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour12: false });
}
 

function fetchHourlyData(city) {
    var apikey = 'ab9c6d95c72c58d3a999d85a66299873';
    var apikeyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apikey}`;

    fetch(apikeyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Log the entire API response for debugging
            console.log('API Response:', data);

            // Get hourly data
            hourlyData= data;
            // Log the filtered hourly data for debugging
            console.log('Hourly Data:', hourlyData);

            // Display hourly data
      

            var hourlyContent = hourlyData.list.map(hour => {
                
                return `
                            <p>Time: ${convertTimestamptoTime(hour.dt)}</p>
                            <p>Temperature: ${(hour.main.temp-273.15).toFixed(2)} °C</p>
                            <p>${hour.weather[0].description}</p>
                       `;
            }).join('');

            document.getElementById('box').innerHTML = hourlyContent;
        })
        .catch(error => {
            console.error('Error fetching hourly data', error);
            alert('Error fetching hourly data');
        });
} 





function fetchDailyData(city) {
    var apikey = 'ab9c6d95c72c58d3a999d85a66299873';
    var apikeyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apikey}`;
    
    fetch(apikeyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Log the entire API response for debugging
            console.log('API Response:', data);
            
            // Get daily data
            var dailyData = data.list.filter(item => item.dt_txt.includes('00:00:00'));
            
            // Log the filtered daily data for debugging
            console.log('Daily Data:', dailyData);
            
            // Display daily data
            var dailyContent = dailyData.map(day => {
                return `
                            <p>Time: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                            <p>Temperature: ${(day.main.temp-273.15).toFixed(2)} °C</p>
                            <p>${day.weather[0].description}</p>
                       `;
            }).join('');
            
            document.getElementById('box').innerHTML = dailyContent;
        })
        .catch(error => {
            console.error('Error fetching daily data', error);
            alert('Error fetching daily data');
        })
}




function fetchWeather(city, location) {
    var apikey = 'ab9c6d95c72c58d3a999d85a66299873';
    var apikeyUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}`;

    fetch(apikeyUrl)
        .then(response => response.json())
        .then(data => {
            // Convert temperature from Kelvin to Celsius
            var temperatureCelsius = data.main.temp - 273.15;

            document.getElementById('box').innerHTML =
                `<div style = "font-size: 20px;font-family: 'Arvo', serif;font-weight: bold ; font-color: black; padding-top: 15px">
                    <p>The weather in ${city} is ${data.weather[0].description}</p>
                    <p>Temperature: ${temperatureCelsius.toFixed(2)} °C</p>
                </div>`;
        })
        .catch(error => {
            console.error('Error fetching weather data', error);
            alert('Error fetching weather data');
        });
}


function AirQuality(city , location) {

    var apikey = 'ab9c6d95c72c58d3a999d85a66299873';
    var apikeyUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat()}&lon=${location.lng()}&APPID=${apikey}`;

    fetch(apikeyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Log the entire API response for debugging
            console.log('API Response:', data);
            document.getElementById('box').innerHTML = 
            `<div style = "font-size: 20px;font-family: 'Arvo', serif;font-weight: bold ; font-color: black; padding-top: 15px">
                <p>Air Quality Index: ${data.list[0].main.aqi}</p>
                <p>PM2.5: ${data.list[0].components.pm2_5}</p>
                <p>PM10: ${data.list[0].components.pm10}</p>
            </div>`
        }) 
        .catch(error => {
            console.error('Error fetching air quality data', error);
            alert('Error fetching air quality data');
        })
}



document.addEventListener('DOMContentLoaded', function () {
    initMap();
});    