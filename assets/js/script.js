// get date
// get lat and lon
// get weather
// write city name and fetch http address to the end of localStorage
// filter weather to index[0] plus all the noon readings for dates after today
// create card 

const searchButton = document.querySelector("#searchButton");
const dataList = document.querySelector("#oneDayCardEl");
const fullDate = new Date();
const searchHistory = JSON.parse(localStorage.getItem("cityName")) || [];

let curDate = ""
let searchCity=""
let oneDay = [];
let fiveDays = [];
let weatherData = [];
let shortList = [];

function getToday (fullDate) {
  const month = (fullDate.getMonth() + 1).toString().padStart(2, '0');
  const day = fullDate.getDate().toString().padStart(2, '0');
  const year = fullDate.getFullYear();
  curDate = `${month}/${day}/${year}`;
}

function getLatLon(searchCity) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=671277334815afdc86042e04b061da17`, {
  })
  .then(function (response) {
    return response.json();
  })
  .then(function(data) {
    const cityLat = data[0].lat;
    const cityLon = data[0].lon;
    getWeather(cityLat, cityLon)
  })
  .catch(function(error) {
    console.error('Error fetching data:', error);
  })
}

function getWeather(lat, lon){
  fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`, {
  })
  .then (function(response) {
    return response.json();
  })
  .then (function(data) {
    weatherData = data
    oneDay = weatherData.list[0];
  
  // in createFiveDaysCards function, iterate over the remaining array
  // to create four new cards
    trimWeather(weatherData)
    createOneDayCard(oneDay)
    createFiveDayCards(fiveDays)
  })
  .catch (function (error) {
    console.error("Error ", error);
  })
}

function trimWeather(data) {
  shortList = weatherData.list.filter(function(el, elIndex) {
  return elIndex == 0 || el.dt_txt.slice(-8) === "12:00:00"})
}

function createCards() {
  for (newCard of shortList)
    if (newCard.indexOf === 0) {
      cardNumber = "one"
    else {
      cardNumber = "five"
    }
  
  const resultCard = document.createElement(`${cardNumber}oneDayCardEl`);
  resultCard.classList.add(`${cardNumber}one-day-card`);
  
  const cardTitle = document.createElement("h2");
  cardTitle.textContent = `${searchCity} (${findDate()})`;
  
  // continue replacing "oneDay" with the cardNumber variable—"one" for the first card, "five" for the subsequent cards

  const cardIcon = document.createElement("img");
  cardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${oneDay.weather[0].icon}.png`)
  
  resultCard.append(cardTitle);
  resultCard.append(cardIcon);

  const cityTemp = document.createElement("li");
  cityTemp.textContent = Temp: " + oneDay.main.temp + "°";

  const cityHumidity = document.createElement("li");
  cityHumidity.textContent = "Humidity: " + oneDay.main.humidity + "%";

  const cityWind = document.createElement("li");
  cityWind.textContent = "Wind: " + oneDay.wind.speed + " mph";
  
  resultCard.appendChild(cityTemp)
  resultCard.appendChild(cityHumidity)
  resultCard.appendChild(cityWind)
  oneDayCardEl.append(resultCard);
}

function createFiveDayCards() {
 
}

function findDate() {
  let currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  curDate = `${month}/${day}/${year}`;
  return curDate;
}

function writeHistory {
  //unshift search city name to localStorage if it's not already in localStorage
}

function readHistory {

}

//on load, read from localStorage; if more than 10 entries, pop the last one

searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  //Need to clear form on click and then repopulate

  // test below for content other than letter, period, hyphen.
  searchCity = document.querySelector("#searchInput").value;
  if (searchCity.trim()!== ""){
    // readHistory();
    // if searchCity is NOT in returned object, add it.
    // localStorage.setItem("cityName", JSON.stringify(searchHistory)); // writes city name to local storage
    getLatLon(searchCity);
  } else {
    alert("Please provide a city name.")
    return;
  }
});