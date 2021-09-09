var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city");
var forecastContainerEl = document.querySelector("#forecast-container");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityname;

var currentTempEl =  document.querySelector("#temp");
var currentWindEl =  document.querySelector("#wind");
var currentHumidityEl =  document.querySelector("#humidity");
var currentUVEl =  document.querySelector("#uv");
var currentCityEl =  document.querySelector("#current-city");
var currentDateEl =  document.querySelector("#current-date");
var currentIconEl =  document.querySelector("#current-weather-icon");

//containers for 5-day forecast
var day1El =  document.querySelector("#day-1");
var day2El =  document.querySelector("#day-2");
var day3El =  document.querySelector("#day-3");
var day4El =  document.querySelector("#day-4");
var day5El =  document.querySelector("#day-5");

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    cityname = cityInputEl.value.trim();

    if (cityname) {
    getCityForecast(cityname);
    cityInputEl.value = "";
    } else {
    alert("Please enter a city username");
    }
    // console.log(event);
  };

  var getCityForecast = function(city) {
    var latitude;
    var longitude;

    // format mapquest api url
      var mapQuestURL = "https://www.mapquestapi.com/geocoding/v1/address?key=xFoBCwhlyhe2EfOZcOnPDnysweefqiOo&inFormat=kvp&outFormat=json&location=" + city +",US&thumbMaps=false"
      fetch(mapQuestURL)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    // determine the longitude and latitude based on city using MapQuest api
                    latitude = data.results[0].locations[0].latLng.lat;
                    longitude = data.results[0].locations[0].latLng.lng;
                    
                    //format the openweather one call api url 
                    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=08dbab0eeefe53317d2e0ad7c2a2e060";
                    
                    // make a request to the url
                    fetch(apiUrl)
                        .then(function(response) {
                            // request was successful
                            if (response.ok) {
                            response.json().then(function(data) {
                                displayForecast(data);
                                displayNextFivedays(data);
                            });
                            } else {
                            alert('Error: City Not Found');
                            }
                        })
                        .catch(function(error) {
                            // Notice this `.catch()` getting chained onto the end of the `.then()` method
                            alert("Unable to connect to GitHub");
                        });
                });
            } else {
                alert('Error: City Not Found (MapQuest API)');
            }
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to MapQuest");
        });

        
    
  };

  var displayNextFivedays = function (data) {
    
    // get icon from one call api 
    var iconID = data.daily[1].weather[0].icon;
    day1El.innerHTML= "<b>" + moment(moment(new Date())).add(1, 'days').format("MM/DD/YYYY") + "</b><br><img alt='weather icon' src=https://openweathermap.org/img/wn/" + iconID + ".png>" + "<br>Temp: " + data.daily[1].temp.day + "°F<br>Wind:  " + data.daily[1].wind_speed + " MPH<br>Humidity: " + data.daily[1].humidity + "%" ;
    console.log(day2El);
    iconID = data.daily[2].weather[0].icon;
    day2El.innerHTML= moment(moment(new Date())).add(2, 'days').format("MM/DD/YYYY") + "<br><img alt='weather icon' src=https://openweathermap.org/img/wn/" + iconID + ".png>" + "<br>Temp: " + data.daily[2].temp.day + "°F<br>Wind:  " + data.daily[1].wind_speed + " MPH<br>Humidity: " + data.daily[2].humidity + "%" ;

    iconID = data.daily[3].weather[0].icon;
    day3El.innerHTML= moment(moment(new Date())).add(3, 'days').format("MM/DD/YYYY") + "<br><img alt='weather icon' src=https://openweathermap.org/img/wn/" + iconID + ".png>" + "<br>Temp: " + data.daily[3].temp.day + "°F<br>Wind:  " + data.daily[1].wind_speed + " MPH<br>Humidity: " + data.daily[3].humidity + "%" ;

    iconID = data.daily[4].weather[0].icon;
    day4El.innerHTML= moment(moment(new Date())).add(4, 'days').format("MM/DD/YYYY") + "<br><img alt='weather icon' src=https://openweathermap.org/img/wn/" + iconID + ".png>" + "<br>Temp: " + data.daily[4].temp.day + "°F<br>Wind:  " + data.daily[1].wind_speed + " MPH<br>Humidity: " + data.daily[4].humidity + "%" ;

    iconID = data.daily[4].weather[0].icon;
    day5El.innerHTML= moment(moment(new Date())).add(5, 'days').format("MM/DD/YYYY") + "<br><img alt='weather icon' src=https://openweathermap.org/img/wn/" + iconID + ".png>" + "<br>Temp: " + data.daily[5].temp.day + "°F<br>Wind:  " + data.daily[1].wind_speed + " MPH<br>Humidity: " + data.daily[5].humidity + "%" ;
  };
  
  var displayForecast = function(data) {
    // check if api returned any repos
    if (data.length === 0) {
        forecastContainerEl.textContent = "No forecast found.";
        return;
    }
    currentCityEl.textContent = cityname + " ";
    currentDateEl.textContent =  "(" + moment(new Date()).format("MM/DD/YYYY") + ")";
    // get icon from one call api 
    var iconID = data.current.weather[0].icon;
    // construct API url to retrieve icon
    var iconURL = "https://openweathermap.org/img/wn/" + iconID + ".png"
    currentIconEl.setAttribute("src", iconURL) 

    currentTempEl.textContent = data.current.temp + "°F";
    currentWindEl.textContent = data.current.wind_speed + " MPH";
    currentHumidityEl.textContent = data.current.humidity + " %";
    currentUVEl.textContent = data.current.uvi;
    if (data.current.uvi >= 3 && data.current.uvi < 6){
        currentUVEl.setAttribute("style", "background-color:#28a745");
    }else if(data.current.uvi >= 6 && data.current.uvi <= 8){
        currentUVEl.setAttribute("style", "background-color:#ffc107");
    }else if (data.current.uvi > 8){
        currentUVEl.setAttribute("style", "background-color:#dc3545");

    };

//   // clear old content
//   forecastContainerEl.textContent = "";
//   repoSearchTerm.textContent = searchTerm;

  // loop over repos
//   for (var i = 0; i < repos.length; i++) {
//       // format repo name
//       var repoName = repos[i].owner.login + "/" + repos[i].name;
  
//       // create a container for each repo
//       // create a link for each repo
//       var repoEl = document.createElement("a");
//       repoEl.classList = "list-item flex-row justify-space-between align-center";
//       repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

//       // create a span element to hold repository name
//       var titleEl = document.createElement("span");
//       titleEl.textContent = repoName;

//       // create a status element
//       var statusEl = document.createElement("span");
//       statusEl.classList = "flex-row align-center";

//       // check if current repo has issues or not
//       if (repos[i].open_issues_count > 0) {
//       statusEl.innerHTML =
//           "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
//       } else {
//       statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//       }
    
//       // append to container
//       repoEl.appendChild(titleEl);
//       // append to container
//       repoEl.appendChild(statusEl);  
  
//       // append container to the dom
//       repoContainerEl.appendChild(repoEl);
//   }
//   console.log(repos);
//   console.log(searchTerm);
};

searchFormEl.addEventListener("submit", formSubmitHandler);