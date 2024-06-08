const oneDayForecast = document.querySelector ("#oneDayCardEl");
const fiveDayForecast = document.querySelector ("#fiveDayCardEl");

let searchCity = "";
let cityLat = "";
let cityLon = "";
let oneDayArr = [];
let fiveDayArr = [];
let shortList = [];
let weatherData = [];

function getWeather (searchCity) {
  fetch (`http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=imperial&appid=671277334815afdc86042e04b061da17`)
  .then (function (coordinates) {
    return coordinates.json();
  })
  .then (function (coordinatesObj) {
    createOneDayCard (coordinatesObj);
    cityLat = coordinatesObj.coord.lat;
    cityLon = coordinatesObj.coord.lon;
    writeHistory();
    return fetch (`https:api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=40&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`)
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

      oneDayArr = shortList[0];
      shortList.splice (0,1);
      fiveDayArr = shortList.splice (0,5) 

      createFiveDayCards(fiveDayArr)
  })
  .catch (function (error) {
      alert("City not found. Check spelling or provide a larger city that is nearby.");
      return;
  })
};

  // I would have liked to create all the cards in one function, but I ran out of time 
  // trying to make this work. Here, I settled for a less efficient solution.
  function createOneDayCard (oneDayArr) {
  const resultCard = document.getElementById ("oneDayCardEl");
  const cardTitle = document.createElement ("h2");
  const cardIcon = document.createElement ("img");
  const dataList = document.createElement ("ul")
  const cityTemp = document.createElement ("li");
  const cityHumidity = document.createElement ("li");
  const cityWind = document.createElement ("li");

  cardTitle.textContent = `${searchCity} (${oneDayDate()})`;
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

function oneDayDate() {
  const today = new Date().toLocaleDateString('en-us', {day:"numeric", month:"numeric", year:"numeric"})
  return today; 
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
    cardTitle.textContent = `${fiveDayDate(fiveDayArr[i], i)}`;
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

function fiveDayDate(item, i) {
  const dateStr = item.dt_txt
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
    const btnHistoryEl = document.createElement("button");
    
    btnHistoryEl.textContent = city;
    btnHistoryEl.id = city;

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

  searchCity = document.querySelector("#iptSearchEl").value.trim();
    if (searchCity !== "") {
    getWeather(searchCity);
    document.querySelector("#iptSearchEl").value="";
  } else {
    document.querySelector("#iptSearchEl").value="";
    alert("Please provide a proper city name.")
    return;
  }
});

document.addEventListener("onload", readHistory())