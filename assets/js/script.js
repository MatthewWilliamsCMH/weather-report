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

// function getToday (fullDate) {
//   const month = (fullDate.getMonth() + 1).toString().padStart(2, '0');
//   const day = fullDate.getDate().toString().padStart(2, '0');
//   const year = fullDate.getFullYear();
//   curDate = `${month}/${day}/${year}`;
// }

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
    fiveDayArr = shortList
  
    // I would have liked to create all the cards in one function, but I ran out of time 
    // trying to make this work. Here, I settled for a less efficient solution.
    createOneDayCard(oneDayArr)
    createFiveDayCards(fiveDayArr)
  })
  .catch (function (error) {
    console.error("Error ", error);
  })
}

function trimWeather(data) {
  // Due to the five-day limit in the API, I have to take the time stamp for index[0]
  // for the one-day forecast and then get the time-stamp value of the next element in the
  // array as my filter to return an additional five days. Choosing to always use noon
  // for example, will in certain conditions result in only four days of reportable data.
  shortList = weatherData.list.filter(function(el, elIndex) {
  const reportInterval = weatherData.list[1].dt_txt.slice(-8);
  const elDate = el.dt_txt.slice(0, el.dt_txt.length-9)
  const index0Date = weatherData.list[0].dt_txt.slice(0, el.dt_txt.length-9)
  return elIndex === 0 || (elDate !== index0Date && el.dt_txt.slice(-8) === reportInterval)})
}

function createOneDayCard(oneDayArr) {
  const resultCard = document.getElementById("oneDayCardEl");
  const cardTitle = document.createElement("h2");
  const cardIcon = document.createElement("img");
  const dataList = document.getElementById("dataListEl")
  const cityTemp = document.createElement("li");
  const cityHumidity = document.createElement("li");
  const cityWind = document.createElement("li");

  cardTitle.textContent = `${searchCity} (${findDate(oneDayArr)})`;
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

function createFiveDayCards(fiveDayArr) {
  const resultCards = document.getElementById("fiveDayCardsEl");
  for (i = 0; i < fiveDayArr.length; i++) {
    const resultCard = document.createElement("card")
    const cardTitle = document.createElement("h2");
    const cardIcon = document.createElement("img");
    const dataList = document.createElement("ul")
    const cityTemp = document.createElement("li");
    const cityHumidity = document.createElement("li");
    const cityWind = document.createElement("li");

    resultCards.classList.add("fiveDayCards")
    resultCard.id = i
    resultCard.classList.add("fiveDayCard")
    // todayDate.setDate(todayDate.getDate() + 1)
    cardTitle.textContent = `${searchCity} (${findDate(fiveDayArr[i])})`;
    // cardTitle.textContent = `${searchCity} (${findDate()})`;
    cardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${fiveDayArr[i].weather[0].icon}.png`)
    cityTemp.textContent = `Temp: ${fiveDayArr[i].main.temp}°`;
    cityHumidity.textContent = `Humidity: ${fiveDayArr[i].main.humidity}%`;
    cityWind.textContent = `Wind: ${fiveDayArr[i].wind.speed} mph`;
    
    dataList.appendChild(cityTemp);
    dataList.appendChild(cityHumidity);
    dataList.appendChild(cityWind);
    resultCard.append(cardTitle);
    resultCard.append(cardIcon);
    resultCard.append(dataList);
    resultCards.append(resultCard);
  }
}

function findDate(myArray, i) {
  const dateStr = myArray.dt_txt
  const dateParts = dateStr.split("-")
  const trimmedDate = dateParts[2].slice(0, dateParts[2].length-9)
  const cardDate = `${dateParts[1]}-${trimmedDate}-${dateParts[0]}`
  return cardDate


  // const currentDate = new Date();
  // const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  // const day = currentDate.getDate().toString().padStart(2, '0');
  // const year = currentDate.getFullYear();
  // curDate = `${month}/${day}/${year}`;
  // return curDate;
}

function incrementDate() {
    let nextDate = new Date(findDate())
    nextDate.setDate(nextDate.getDate() + i + 1)
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