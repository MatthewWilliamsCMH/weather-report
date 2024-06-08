// const Button = document.querySelector("#btnSearchEl");
const oneDayForecast = document.querySelector("#oneDayCardEl");
const fiveDayForecast = document.querySelector("#fiveDayCardEl")

let searchCity=""
let oneDayArr = [];
let fiveDayArr = [];
let forecasts = [];
let shortList = [];
let cityLat=""
let cityLon=""
let weatherData = [];

function getWeather(searchCity) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=671277334815afdc86042e04b061da17`)
  .then(function (coordinates) {
    return coordinates.json();
  })
  .then(function (coordinatesObj) {
    cityLat = coordinatesObj[0].lat;
    cityLon = coordinatesObj[0].lon;
    return fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=40&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`)
  })
  .then (function (forecastResponse) {
    return forecastResponse.json();
  })
  .then (function (forecastObj) {
    weatherData = forecastObj
    shortList = weatherData.list.filter(function (el, elIndex) {
      const reportInterval = weatherData.list[1].dt_txt.slice(-8);
      const elDate = el.dt_txt.slice(0, el.dt_txt.length-9)
      const index0Date = weatherData.list[0].dt_txt.slice(0, el.dt_txt.length-9)
      return (elIndex === 0 || elIndex === 39) || (elDate !== index0Date && el.dt_txt.slice(-8) === reportInterval)})
  })

  oneDayArr = shortList[0];
  shortList.splice(0,1);
  fiveDayArr = shortList.splice(0,5) // removes extra reading from last day if necessary

  // I would have liked to create all the cards in one function, but I ran out of time 
  // trying to make this work. Here, I settled for a less efficient solution.
  createOneDayCard(oneDayArr)
  createFiveDayCards(fiveDayArr)
}

function createOneDayCard(oneDayArr) {
  const resultCard = document.getElementById("oneDayCardEl");
  const cardTitle = document.createElement("h2");
  const cardIcon = document.createElement("img");
  const dataList = document.createElement("ul")
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

    resultCard.classList.add("fiveDayCard")
    resultCard.id = i
    cardTitle.textContent = `${findDate(fiveDayArr[i])}`;
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
}

function writeHistory() {
  cities = JSON.parse(localStorage.getItem("cityName")) || [];
    if (!cities.includes(searchCity.toLowerCase(), 0)) {
      cities.unshift(searchCity.toLowerCase());
      localStorage.setItem("cityName", JSON.stringify(cities));
      readHistory();
    // }
  }
}

function readHistory() {
  document.getElementById("searchHistoryEl").innerHTML=""

  const cities = JSON.parse(localStorage.getItem("cityName")) || [];

  for (let city of cities) {
    // inputCity = city
    const btnHistoryEl = document.createElement("button");
    
    btnHistoryEl.textContent = city;
    btnHistoryEl.id = city;

    // btn.textContent = inputCity;
    // btn.id = inputCity;
    btnHistoryEl.classList.add("btn-history");
    btnHistoryEl.setAttribute("type", "button");

    searchHistoryEl.appendChild(btnHistoryEl);

    btnHistoryEl.addEventListener("click", function(event) {
      document.getElementById("oneDayCardEl").innerHTML=""
      document.getElementById("fiveDayCardsEl").innerHTML=""
      document.getElementById("iptSearchEl").innerHTML=""
      searchCity = event.target.id;
      getWeather(searchCity)}
    );
  }
}

btnSearchEl.addEventListener("click", function(event) {
  event.preventDefault()
  document.getElementById("oneDayCardEl").innerHTML=""
  document.getElementById("fiveDayCardsEl").innerHTML=""
  document.getElementById("iptSearchEl").innerHTML=""

  // test below for content other than letter, period, hyphen.
  searchCity = document.querySelector("#iptSearchEl").value.trim();
      if (searchCity !== "") {
  // if (searchCity.trim() !== "") {
  // if (searchCity.trim() !== "" && weatherData.length != 0){
    getWeather(searchCity);
    writeHistory();
    document.querySelector("#iptSearchEl").value="";
  } else {
    document.querySelector("#iptSearchEl").value="";
    alert("Please provide a proper city name.")
    return;
  }
});

document.addEventListener("onload", readHistory())