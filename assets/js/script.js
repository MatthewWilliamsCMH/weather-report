const searchButton = document.querySelector("#searchButton");
const searchList = [];
let oneDay = "";
let fiveDay = "";
let cityLat = "";
let cityLon = "";

// the code with modifications suggested by Xpert Learning Assistant
async function getForecast(searchCity) {
  await cityLatLon(searchCity)
    .then(({cityLat, cityLon}) => {
      return fetch(`https:api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=5&mode=json&units=imperial&appid=671277334815afdc86042e04b061da17`, {
      })
        .then (function(response) {
          return response.json();
        })
       .then (function(data) {
        alert(cityLat)
        })
      .catch (function (error) {
        console.error("Error ", error);
      })
    })
  };

function cityLatLon(searchCity) {
  //the problem appears to be in this or the .then line. It looks like I'm getting no reply from the fetch, but all the codes say i do
  //I'm not sure if the fetch response is empty or if the .then call can't read it.
  return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=671277334815afdc86042e04b061da17`, {
  })
  .then(function (response) {
    alert(response.statusText)
    // return response.json();
  })
  .then(function(data) {
    cityLat = data[0].lat;
    cityLon = data[0].lon;
    return {cityLat, cityLon}
  })
  .catch(function(error) {
    console.error('Error fetching data:', error);
  })
  .finally(() => {
   console.log("jello")
})
}
  // should I also look for state? what to do if state field empty?


// the code as I wrote it
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
  // test below for content other than letter, period, hyphen.
  const searchCity = document.querySelector("#searchInput").value;
  if (searchCity.trim()!== ""){ 
    getForecast(searchCity);
  } else {
    alert("Please provide a city name.")
    return;
  }
});