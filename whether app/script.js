const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherinfosection=document.querySelector('.weather-info');
const notfoundsection=document.querySelector('.not-found');
const searchcitysection=document.querySelector('.search-city');

const counrtytxt=document.querySelector('.country-txt');
const tempTxt=document.querySelector('.temp-text');
const conditontxt=document.querySelector('.condition-text');
const humiditytxt=document.querySelector('.Humidity-value-txt');
const windvaluetxt=document.querySelector('.Wind-value-txt');
const weathersummaryimg=document.querySelector('.weather-summary-img');
const currentdate=document.querySelector('.current-date-txt');
const forecastitemcontainer=document.querySelector('.forecast-items-container');

const apikeys = "00264b81e86bf56dfd5e1047ebde8eb0";

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != "") {
        updateWeatherinfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
})

cityInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter' && cityInput.value.trim() != "") {
        updateWeatherinfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
})

async  function getFetchData(endpoint,city) {
    const apiurl=`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikeys}&units=metric`;
    
    const response= await fetch(apiurl);

    return response.json();
}

function getweatherIcon(id){
    if(id<=232){
        return 'thunderstorm.svg';
    }
    if(id<=321){
        return 'drizzle.svg';
    }
    if(id<=321){
        return 'drizzle.svg';
    }
    if(id<=531){
        return 'rain.svg';
    }
    if(id<=622){
        return 'snow.svg';
    }
    if(id<=781){
        return 'atmosphere.svg';
    }
    if(id<=800){
        return 'clear.svg';
    }
    else return 'clouds.svg';
}

function getcurrentDate() {

    const currentDate = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
    };
    return currentDate.toLocaleDateString('en-GB', options);
}
async function updateWeatherinfo(city) {
    const weatherData= await getFetchData('weather',city);
    if(weatherData.cod != 200) {
        showdisplaysection(notfoundsection);
        return
    }
    console.log(weatherData);
   const{
    name:counrty,
    main: {temp, humidity},
    weather:[{id,main}],
    wind: {speed},
   }= weatherData

   counrtytxt.textContent = counrty;
   tempTxt.textContent = Math.round(temp) + '°C';
   conditontxt.textContent = main;
   humiditytxt.textContent = humidity + '%';
   windvaluetxt.textContent = speed + 'km/h';
 
   currentdate.textContent=getcurrentDate();
   weathersummaryimg.src=`assets/weather/${getweatherIcon(id)}`
   
   await updateforecast(city)

   showdisplaysection(weatherinfosection);
}

async function updateforecast(city){
    const forecastData=await getFetchData('forecast', city);
    const timetaken='12:00:00';
    const todaydate=new Date().toISOString().split('T')[0];

   forecastitemcontainer.innerHTML='';
    forecastData.list.forEach(forecastweather => {
        if(forecastweather.dt_txt.includes(timetaken) && !forecastweather.dt_txt.includes(todaydate)){
              updateforecastitems(forecastweather);
        }
    })
}
function updateforecastitems(weatherData){
     const{
    dt_txt:date,
    main: {temp},
    weather:[{id}],
   }= weatherData

     const datetaken=new Date(date);
     const dateoption={
        day: '2-digit',
        month: 'short'
     }
     const dateresult=datetaken.toLocaleDateString('en-US', dateoption);
   const forecastitem=`
    <div class="forecast-items">
            <h5 class="forecast-item-date regular-txt">${dateresult}</h5>
            <img src="assets/weather/${getweatherIcon(id)}"  class="forecast-item-img">
           <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
     </div>
   `
   forecastitemcontainer.insertAdjacentHTML('beforeend', forecastitem);
}

function showdisplaysection(section) {
   [weatherinfosection, searchcitysection, notfoundsection].forEach(section => section.style.display = 'none');
   section.style.display = 'flex';
}
