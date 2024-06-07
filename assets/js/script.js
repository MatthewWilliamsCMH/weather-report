const searchButton = document.querySelector("#searchButton");
const oneDayForecast = document.querySelector("#oneDayCardEl");
const fiveDayForecast = document.querySelector("#fiveDayCardEl")

let searchCity=""
let oneDayArr = [];
let fiveDayArr = [];
let weatherData = [];
let shortList = [];

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
  shortList = weatherData.list.filter(function(el, elIndex) {
  const reportInterval = weatherData.list[1].dt_txt.slice(-8);
  const elDate = el.dt_txt.slice(0, el.dt_txt.length-9)
  const index0Date = weatherData.list[0].dt_txt.slice(0, el.dt_txt.length-9)
  return (elIndex === 0 || elIndex === 39) || (elDate !== index0Date && el.dt_txt.slice(-8) === reportInterval)})
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
    cardTitle.textContent = `${searchCity}
(${findDate(fiveDayArr[i])})`;
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
  storedCities = JSON.parse(localStorage.getItem("cityName")) || [];
    if (!storedCities.includes(searchCity.toLowerCase(), 0)) {
      storedCities.unshift(searchCity.toLowerCase());
      localStorage.setItem("cityName", JSON.stringify(storedCities));
      readHistory();
    // }
  }
}

function readHistory() {
  document.getElementById("searchHistoryEl").innerHTML=""

  const storedCities = JSON.parse(localStorage.getItem("cityName")) || [];

  for (let city of storedCities) {
    inputCity = city
    const btn = document.createElement("button");
    
    btn.textContent = inputCity;
    btn.id = inputCity;
    btn.classList.add("btnHistory");
    btn.setAttribute("type", "button");

    searchHistoryEl.appendChild(btn);

    btn.addEventListener("click", function(event) {
      document.getElementById("oneDayCardEl").innerHTML=""
      document.getElementById("fiveDayCardsEl").innerHTML=""
      document.getElementById("searchInput").innerHTML=""
      searchCity = event.target.id;
      getLatLon(searchCity)}
    );
  }
}

searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  document.getElementById("oneDayCardEl").innerHTML=""
  document.getElementById("fiveDayCardsEl").innerHTML=""
  document.getElementById("searchInput").innerHTML=""

  // test below for content other than letter, period, hyphen.
  searchCity = document.querySelector("#searchInput").value;
  if (searchCity.trim()!== ""){
    writeHistory();
    document.querySelector("#searchInput").value="";
    getLatLon(searchCity);
  } else {
    alert("Please provide a city name.")
    return;
  }
});

document.addEventListener("onload", readHistory())