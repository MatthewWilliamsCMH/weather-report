// get date
// get lat and lon
// get weather
// write city name and fetch http address to the end of localStorage
// filter weather to index[0] plus all the noon readings for dates after today
// create card 

const searchButton = document.querySelector("#searchButton");
const oneDayForecast = document.querySelector("#oneDayCardEl");
const fiveDayForecast = document.querySelector("#fiveDayCardEl")
const fullDate = new Date();
const searchHistory = JSON.parse(localStorage.getItem("cityName")) || [];
// let cardNumber="";
// let cardNumberIndex="";

let curDate = ""
let searchCity=""
let oneDayArr = [];
let fiveDayArr = [];
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
    weatherData = data;
    trimWeather(weatherData);
    oneDayArr = shortList[0];
    shortList.splice(0,1);
    fiveDayArr=shortList
  
    // I would have like to create all the cards in one function, but I couldn't figure out how to write a variable into a function call like a createElement method
    createOneDayCard(oneDayArr)
    createFiveDayCards(fiveDayArr)
  })
  .catch (function (error) {
    console.error("Error ", error);
  })
}

function trimWeather(data) {
  shortList = weatherData.list.filter(function(el, elIndex) {
  return elIndex == 0 || el.dt_txt.slice(-8) === "12:00:00"})
}


// function createResultCard(resultItem) {
//   const resultCard = document.createElement('div');
//   resultCard.classList.add('result-card');

//   const cardTitle = document.createElement('h3');
//   cardTitle.textContent = resultItem.title;

//   resultCard.append(cardTitle)

//   const cardText = document.createElement('p');
//   cardText.textContent = resultItem.description;

//   resultCard.append(cardText);

//   resultBox.append(resultCard);
// }




function createOneDayCard(oneDayArr) {
  const resultCard = document.getElementById("oneDayCardEl");
  const cardTitle = document.createElement("h2");
  const cardIcon = document.createElement("img");
  const dataList = document.getElementById("dataListEl")
  const cityTemp = document.createElement("li");
  const cityHumidity = document.createElement("li");
  const cityWind = document.createElement("li");

  cardTitle.textContent = `${searchCity} (${findDate()})`;
  cardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${oneDayArr.weather[0].icon}.png`)
  cityTemp.textContent = `Temp: ${oneDayArr.main.temp}°`;
  cityHumidity.textContent = `Humidity: ${oneDayArr.main.humidity}%`;
  cityWind.textContent = `Wind: ${oneDayArr.wind.speed} mph`;

  dataList.appendChild(cityTemp)
  dataList.appendChild(cityHumidity)
  dataList.appendChild(cityWind)
  resultCard.append(cardTitle);
  resultCard.append(cardIcon);
  resultCard.append(dataList)
}

  // need to create div and assign it class fiveDayCard around each group of data
  // need to get the date from fiveDayArr for these
  // I need to write the result cards into an array and then display each card.
  const resultCard = document.getElementById("fiveDayCardEl");
    function createFiveDayCards(fiveDayArr) {
    for (i = 0; i < fiveDayArr.length; i++) {
    const resultCard = document.createElement("div")
    const cardTitle = document.createElement("h2");
    const cardIcon = document.createElement("img");
    const dataList = document.getElementById("fiveDayListEl")
    const cityTemp = document.createElement("li");
    const cityHumidity = document.createElement("li");
    const cityWind = document.createElement("li");

    resultCard.id = i
    resultCard.classList.add("fiveDayCard")
    cardTitle.textContent = `${searchCity} (${findDate()})`;
    console.log(fiveDayArr[i].weather[0].icon)
    cardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${fiveDayArr[i].weather[0].icon}.png`)
    cityTemp.textContent = `Temp: ${fiveDayArr[i].main.temp}°`;
    cityHumidity.textContent = `Humidity: ${fiveDayArr[i].main.humidity}%`;
    cityWind.textContent = `Wind: ${fiveDayArr[i].wind.speed} mph`;
    
    dataList.appendChild(cityTemp)
    dataList.appendChild(cityHumidity)
    dataList.appendChild(cityWind)
    resultCard.append(cardTitle);
    resultCard.append(cardIcon);
    resultCard.append(dataList)
  }
}

function findDate() {
  let currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  curDate = `${month}/${day}/${year}`;
  return curDate;
}

function writeHistory() {
  //unshift search city name to localStorage if it's not already in localStorage
}

function readHistory() {

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