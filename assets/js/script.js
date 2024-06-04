const searchButton = document.querySelector("#searchButton");
const searchList = [];
let oneDay = "";
let fiveDay = "";
let cityLat = "";
let cityLon = "";

//can we remove this and just put coords into cityLatLon?
function getForecast(searchCity) {
  const coords = cityLatLon(searchCity)
}

function cityLatLon(searchCity) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=671277334815afdc86042e04b061da17`, {
  })
  .then(function (response) {
    return response.json();
  })
  .then(function(data) {
    cityLat = data[0].lat;
    cityLon = data[0].lon;
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
    //do i need this .then at all?
    console.log(data)
  })
  .catch (function (error) {
    console.error("Error ", error);
  })
  }
  
// should I also look for state? what to do if state field empty?


// const searchButton = document.querySelector("#searchButton");
// const searchList = [];
// let oneDay = "";
// let fiveDay = "";
// let myLat = "";
// let myLon = "";

// async function getForecast(searchCity) {
//   await myCoords(searchCity)
//   const response = fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&cnt=5&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`, {
//   })
//   .then(function (response) {
//     return response.json()
//   })
//   .then(function (data) {
//   // .catch
//   //error trapping
//   })
// // };
// };

// async function myCoords(searchCity) {
//   return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=671277334815afdc86042e04b061da17`, {
//   })
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function(data) {
//     myLat = data[0].lat;
//     myLon = data[0].lon;
//     return {myLat, myLon}
//   // .catch
//   // need to catch typos
//   // should I also look for state? what to do if state field empty?
//   })
// };

searchButton.addEventListener("click", function(event) {
  event.preventDefault()
  // test below for content other than letter, period, hyphen.
  const searchCity = document.querySelector("#searchInput").value;
  if (searchCity.trim()!== ""){ 
    getForecast(searchCity);
  } else {
    alert("Please provide a city name.")
    return;
  }
});