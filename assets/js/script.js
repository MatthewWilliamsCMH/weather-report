// get date
// get lat and lon
// get weather
// write city name and fetch http address to the end of localStorage
// filter weather to index[0] plus all the noon readings for dates after today
// create card 

const searchButton = document.querySelector("#searchButton");
const dataList = document.querySelector("#oneDayCardEl");
const fullDate = new Date();
let curDate = ""
let searchCity=""
let oneDay = [];
let fiveDays = [];


// read city name and fetch http addresses from local Storage
// display city name in left column on button that pulls the fetch request into the createCards routine
const searchList = [];

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
    oneDay = data.list[0];
  
  // I need to determine today's date then take noon or later for to date 
  // then add one to the date and get noon
  // then add one to the date and get noon
  // then add one to the date and get noon
  // then add one to the date nd get noon

  // in createFiveDaysCards function, iterate over the remaining array
  // to create four new cards
    trimWeather(data)
    createOneDayCard(oneDay)
    createFiveDayCards(fiveDays)
  })
  .catch (function (error) {
    console.error("Error ", error);
  })
}
function trimWeather(data) {
// compare ONLY the time in the data.list[i].dt_txt to see if it's 00:00:00
// use the .filter function to remove data.list[i] if the result is false
// compare ONLY the date in fullDate with ONLY the date in data.list[i].dt_txt;


  // console.log(data)

  for (let i = 0; i < data.list.length; i++) {
    let checkTime = data.list[i].dt_txt.slice(-8); // return the last 8 characters, which should be the time in 00:00:00 format
    if (checkTime !== "12:00:00") {
      console.log("true")
      console.log(i)
      console.log(data)
      delete data.list[i]
      console.log("hello")
      console.log(data)
    }
    // console.log(checkDate)
    // console.log(fullDate)
    // console.log(data.list[i].filter(checkDate !== fullDate.toTimeString()));
  }
  // const result = data.filter(item => item.list.dt_text.toTimeString() !== fullDate.toTimeString());
  // console.log(result)
//   for(let i = 0; i < data.length; i++)
//     if (checkDate === fullDate) {
//       if (checkDate .toTimeString() !== fullDate.toTimeString())
//         data[i]
//     }
}

function createOneDayCard() {
  const resultCard = document.createElement("oneDayCardEl");
  resultCard.classList.add("one-day-card");
  
  const cardTitle = document.createElement("h2");
  cardTitle.textContent = `${searchCity} (${findDate()})`;
  
  const cardIcon = document.createElement("img");
  cardIcon.setAttribute("src", `https://openweathermap.org/img/wn/${oneDay.weather[0].icon}.png`)
  
  resultCard.append(cardTitle);
  resultCard.append(cardIcon);

  const cityTemp = document.createElement("li");
  cityTemp.textContent = "Temp: " + oneDay.main.temp + "°";

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