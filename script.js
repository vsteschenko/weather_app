"use strict";

let apiKey = 'cffe01dfb401cd828b0205ada2aa39b1';
let accessKey = 'kMYSqoycZOLWJrayF3I-LVvPTl_j_KzCXAouT1Uwxpc';

let selectBody = document.querySelector('body');
selectBody.style.backgroundColor = 'black';
selectBody.style.fontFamily = "'Roboto Flex', sans-serif";
let container = document.createElement('div');
selectBody.style.margin = '10px 1% 0px 1%';
selectBody.appendChild(container);
container.style.width = '100%';
container.style.height = '100vh';
container.style.backgroundColor = '#6bc6ef';
container.style.borderTopLeftRadius = '10px';
container.style.borderTopRightRadius = '10px';
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.justifyContent = 'center';
container.style.alignItems = 'center';
// container.style.border = '1px solid red';

let divForm = document.createElement('div');
container.appendChild(divForm);
divForm.style.height = '80px';
divForm.style.width = '100%';
// divForm.style.border = '1px solid red';
// idea add ? sign next to submit button and show a box with info to add Brussels, BE or Moscow, RU
let newForm = document.createElement('form');
divForm.appendChild(newForm);

let input1 = document.createElement('input');
input1.setAttribute('type', 'text');
input1.setAttribute('id', 'myText')
input1.setAttribute('name', 'city');
newForm.appendChild(input1);

divForm.style.display = 'flex';
divForm.style.alignItems = 'center';
divForm.style.justifyContent = 'center';

let buttonSubmit = document.createElement('input');
buttonSubmit.setAttribute('type', 'button');
buttonSubmit.setAttribute('value', 'Submit');
buttonSubmit.style.marginLeft = '10px';
newForm.appendChild(buttonSubmit);

// let containerForContainers = document.createElement('div')
let containerForContainers = document.createElement('div');
container.appendChild(containerForContainers);

let containerForWeather = document.createElement('div');
containerForContainers.appendChild(containerForWeather);
containerForWeather.style.display = 'flex';
containerForWeather.style.flexDirection = 'column';
containerForWeather.style.justifyContent = 'center';
containerForWeather.style.width = '290px';
containerForWeather.style.alignItems = 'center';
containerForWeather.style.margin = '2% 10%';
containerForWeather.style.border = '1px solid grey';
containerForWeather.style.borderRadius = '10px';
containerForWeather.style.padding = '10px';
// containerForWeather.style.display = 'none';

//START PAGE---------------------------------------------------------------------------------------------------------------->
fetch(`https://api.openweathermap.org/data/2.5/weather?q=Greenwich,UK&appid=${apiKey}`)
.then(response => response.json())
.then(json => {
    // Store data in local storage
    displayWeather(json);
})
.catch(error => {
    console.log('There was an error!', error);
});

buttonSubmit.addEventListener('click', function() {
    // containerForGreenwich.style.display = 'none';
    containerForWeather.style.display = 'flex';
    let selectInput = document.getElementById('myText').value;
    // Check if data exists in local storage
    let storedData = localStorage.getItem(selectInput);
    if (storedData) {
        // Data exists in local storage
        displayWeather(JSON.parse(storedData));
    } else {
        // Data doesn't exist, fetch from API
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectInput}&appid=${apiKey}`)
            .then(response => response.json())
            .then(json => {
                // Store data in local storage
                localStorage.setItem(selectInput, JSON.stringify(json));
                displayWeather(json);
            })
            .catch(error => {
                console.log('There was an error!', error);
            });
    }

    // Check if chart already exists, remove it if it does
    let existingChart = document.getElementById('weatherChart');
    if (existingChart) {
        existingChart.parentElement.remove(); // Remove the parent element which contains the chart
    }
    let existingNewContainer = document.getElementsByClassName('newContainer')[0];
    if (existingNewContainer) {
        existingNewContainer.remove();
    }
    displayImage(selectInput);
});

let convertKelvinToCelsius = f => {
    return Math.floor(f - 273.15)
}
let displayWeather = data => {
    let coordLon = data.coord.lon;
    let coordLat = data.coord.lat;

    let weatherMain = data.weather[0].main;
    let feelsLike = data.main.feels_like;
    let info = document.createElement('p');
    containerForWeather.innerHTML = '';
    containerForWeather.appendChild(info);
    info.innerHTML = `${data.name}`;

    let currentTemperature = document.createElement('h1');
    containerForWeather.appendChild(currentTemperature);
    currentTemperature.innerHTML = `${convertKelvinToCelsius(data.main.temp)}`

    let elementWeatherMain = document.createElement('p');
    containerForWeather.appendChild(elementWeatherMain);
    elementWeatherMain.innerHTML = weatherMain;

    let elementFeelsLike = document.createElement('p');
    containerForWeather.appendChild(elementFeelsLike);
    elementFeelsLike.innerHTML = `Feels like ${convertKelvinToCelsius(feelsLike)}`;
    elementFeelsLike.style.marginBottom = '50px';
//FORECAST------------------------------------------------------------------------------------------->
fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordLat}&lon=${coordLon}&appid=${apiKey}`)
    .then(reply => reply.json())
    .then(json => {
        console.log(`Forecast for ${json.list[0].dt_txt}: ${convertKelvinToCelsius(json.list[0].main.temp)}`)
        let newArr = [];
        json.list.forEach(element => {
            const regex = /^\d{4}-\d{2}-\d{2} 12:00:00$/;
            if (regex.test(element.dt_txt)) {
                newArr.push(element);
            }
        });

        let arrForChart = [];
        for (let i = 0; i < 4; i++) {
            arrForChart.push(json.list[i]);
        }

        let arrForMain = [];
        for (let i = 0; i < 4; i++) {
            arrForMain.push(json.list[i].main);
        }

        let divForForecast = document.createElement('div');
        containerForWeather.appendChild(divForForecast);
        divForForecast.style.width = '100%';
        divForForecast.style.height = '100%';

        newArr.forEach(day => {

            let divForNextDay = document.createElement('div');
            divForForecast.appendChild(divForNextDay);

            const date = new Date(day.dt_txt);
            const options = { weekday: 'long' };
            const dayOfWeek = date.toLocaleDateString('en-US', options);

            let divForDay = document.createElement('div');
            divForNextDay.appendChild(divForDay);
            divForNextDay.style.display = 'flex';
            divForNextDay.style.flexDirection = 'row';

            divForDay.innerHTML = dayOfWeek;
            divForDay.style.height = '30px';
            divForDay.style.width = '70px';
            divForDay.style.display = 'flex';
            divForDay.style.flexDirection = 'row';
            //console.log(day)
            let divForTemp = document.createElement('div');
            divForNextDay.appendChild(divForTemp);
            divForTemp.innerHTML = convertKelvinToCelsius(day.main.temp);
            divForNextDay.style.justifyContent = 'space-between';
            let divForClouds = document.createElement('div');
            divForNextDay.appendChild(divForClouds);
            if (day.weather[0].main == "Clouds") {
                let cloudImage = document.createElement('i');
                divForClouds.appendChild(cloudImage)
                cloudImage.classList.add('fa-solid')
                cloudImage.classList.add('fa-cloud')
                cloudImage.style.color = 'white';
            } else if (day.weather[0].main == "Rain") {
                let cloudImage = document.createElement('i');
                divForClouds.appendChild(cloudImage)
                cloudImage.classList.add('fa-solid')
                cloudImage.classList.add('fa-cloud-showers-heavy')
                cloudImage.style.color = 'white'; 
            } else if(day.weather[0].main == "Clear") {
                let cloudImage = document.createElement('i');
                divForClouds.appendChild(cloudImage)
                cloudImage.classList.add('fa-solid')
                cloudImage.classList.add('fa-sun')
                cloudImage.style.color = 'yellow'; 
            } else if(day.weather[0].main == "Snow") {
                let cloudImage = document.createElement('i');
                divForClouds.appendChild(cloudImage)
                cloudImage.classList.add('fa-regular')
                cloudImage.classList.add('fa-snowflake')
                cloudImage.style.color = 'white';
            } else {
                divForClouds.innerHTML = day.weather[0].main;
            }
        })
        //CHART --------------------------------------------------------------------------------------------------------->
        let divForChart = document.createElement('div');
        containerForContainers.appendChild(divForChart);
        let canvasChart = document.createElement('canvas');
        canvasChart.style.width = '100%';
        canvasChart.setAttribute('id', 'weatherChart');
        divForChart.appendChild(canvasChart);
        divForChart.style.width = '290px';
        divForChart.style.height = '180px';
        divForChart.style.margin = '2% 10%';
        divForChart.style.border = '1px solid grey';
        divForChart.style.borderRadius = '10px';
        divForChart.style.padding = '10px';
        divForChart.style.display = 'flex';
        divForChart.style.justifyContent = 'center';
        const ctx = document.getElementById('weatherChart');

        const times = arrForChart.map(obj => {
            const match = /\s(\d{2}):/.exec(obj.dt_txt);
            return match ? match[1] : null;
        });
 
        new Chart(ctx, {
            type: 'line',
            data: {
              labels: [`${times[0]}:00`, `${times[1]}:00`, `${times[2]}:00`, `${times[3]}:00`],
              datasets: [{
                label: '# Celsius',
                data: [convertKelvinToCelsius(arrForMain[0].temp), convertKelvinToCelsius(arrForMain[1].temp), convertKelvinToCelsius(arrForMain[2].temp), convertKelvinToCelsius(arrForMain[3].temp)],
                borderWidth: 1,
                tension: 0.4
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
    })
    .catch(error => {
        console.log('There was an error!', error);
    });
}

const fetchImage = async (cityName) => {
    let url = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${accessKey}&per_page=1`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results[0].urls.regular);
    return data.results[0].urls.regular
}
//fetchImage();

const displayImage = async (cityName) => {
    let imageUrl = await fetchImage(cityName);
    let newContainer = document.createElement('div');
    newContainer.classList.add('newContainer');
    containerForContainers.appendChild(newContainer);
    let img = document.createElement('img');
    img.setAttribute('src', `${imageUrl}`);
    img.setAttribute('alt', 'Image of the city');
    newContainer.appendChild(img);
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '10px';

}
//displayImage();
// containerForContainers.style.border = '1px solid red';
containerForContainers.style.width = '100%';
containerForContainers.style.display = 'flex';
containerForContainers.style.flexWrap = 'wrap';
// containerForContainers.style.alignItems = 'center';
containerForContainers.style.justifyContent = 'center';
containerForContainers.style.width = '98%';
