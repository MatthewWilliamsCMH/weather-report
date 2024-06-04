const searchButton = document.querySelector("#searchButton");
const dataList = document.querySelector("#oneDayCardEl");

const searchList = [];
let searchCity=""
let oneDay = [];
let fiveDay = [];
// let cityLat = "";
// let cityLon = "";

//can we remove this and just put coords into getLatLon?
// function getForecast(searchCity) {
//   const coords = getLatLon(searchCity)
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
  fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`, {
  })
  .then (function(response) {
    return response.json();
  })
  .then (function(data) {
    oneDay = data.list[0];
    createOneDayCard(oneDay)
  })
  .catch (function (error) {
    console.error("Error ", error);
  })
  
}

function createOneDayCard() {
  const searchDate = findDate()
  
  const resultCard = document.createElement("oneDayCardEl");
  resultCard.classList.add("one-day-card");
  
  const cardTitle = document.createElement("h2");
  cardTitle.textContent = `${searchCity} (${searchDate})`;
  
  const cardIcon = document.createElement("img");
  cardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${oneDay.weather[0].icon}@2x.png`)
  
  resultCard.append(cardTitle);
  resultCard.append(cardIcon);

  const cityTemp = document.createElement("li");
  cityTemp.textContent = "Temp: " + oneDay.main.temp + "°";

  const cityHumidity = document.createElement("li");
  cityHumidity.textContent = "Humidity: " + oneDay.main.humidity + "%";

  const cityWind = document.createElement("li");
  cityWind.textContent = "Wind: " + oneDay.wind.speed + " mph";
  
  console.log(oneDay)

  resultCard.appendChild(cityTemp)
  resultCard.appendChild(cityHumidity)
  resultCard.appendChild(cityWind)
  oneDayCardEl.append(resultCard);
}

function findDate() {
  const date = new Date();
  const currentYear = String(date.getFullYear());
  const currentMonth = String(date.getMonth() + 1);
  const currentDay = String(date.getDate());
  curDate = `${currentMonth}/${currentDay}/${currentYear}`
  return curDate;
}

searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  //Need to clear form on click and then repopulate

  // test below for content other than letter, period, hyphen.
  searchCity = document.querySelector("#searchInput").value;
  if (searchCity.trim()!== ""){ 
    getLatLon(searchCity);
  } else {
    alert("Please provide a city name.")
    return;
  }
});