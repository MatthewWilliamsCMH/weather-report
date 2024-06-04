const searchButton = document.querySelector("#searchButton");
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
    getWeather(cityLat, cityLon);
  })
  .catch(function(error) {
    console.error('Error fetching data:', error);
  });
}

function getWeather(lat, lon){
  fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`, {
  });
  .then (function(response) {
    return response.json();
  });
  .then (function(data) {
    oneDay = data.list[0];
    createOneDayCard(oneDay);
  });
  .catch (function (error) {
    console.error("Error ", error);
  });
  
}

function createOneDayCard() {
  const searchDate = findDate();
  
  const resultCard = document.createElement("oneDayCardEl");
  resultCard.classList.add("one-day-card");

  const cardTitle = document.createElement("h2");
  cardTitle.textContent = `${searchCity} (${searchDate}) [icon]`;
  resultCard.append(cardTitle);

  const cardText = document.createElement("ul");
  cardText.textContent = "<li>Temp: " + oneDay.main.temp + "</li>\n" +
  "<li>Humidity: " + oneDay.main.humidity + "</li>\n" +
  "<li>Wind: " + oneDay.wind.speed + "</li>"
  
resultCard.append(cardText);
oneDayCardEl.append(resultCard);

  console.log(oneDay);
  console.log(searchCity);
}

function findDate() {
  const date = new Date();
  const currentYear = String(date.getFullYear());
  const currentMonth = String(date.getMonth() + 1);
  const currentDay = String(date.getDate());
  curDate = `${currentMonth}/${currentDay}/${currentYear}`;
  return curDate;
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

// should I also look for state? what to do if state field empty?

searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  // test below for content other than letter, period, hyphen.
  searchCity = document.querySelector("#searchInput").value;
  if (searchCity.trim()!== ""){ 
    getLatLon(searchCity);
  } else {
    alert("Please provide a city name.")
    return;
  }
});