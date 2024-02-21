"use strict"

let apiKey = "d09fe4bedc9883cb83721fbf50ad1e73";
let giphyApiKey = "pgsQLA8GteBTgyPuSTeg2bM13LQIMk5u";

let cityInput = document.getElementById("city-input");
let stateInput = document.getElementById("state-input");
let submit = document.getElementById("submit");
let locationDisplay = document.getElementById("saved-locations");
let listRecent = document.getElementById("list-recent");
let listFavorite = document.getElementById("list-favorite");
let imageHolder = document.getElementById("image");
let weatherImage = document.getElementById("weather-image");
let tempImage = document.getElementById("temp-image");
let weatherText = document.getElementById("weather-text");
let tempText = document.getElementById("temp-text");
let locationName = document.getElementById("location-name")
let saveLocationButton = document.getElementById("save-location")


let savedLocation = [];
let favoriteLocation = [];

let latAndLon = function() {
    let cityName = cityInput.value;
    let stateCode = stateInput.value;
    saveLocation(cityName, stateCode);
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},US&limit=5&appid=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
        let lat = data[0].lat;
        let lon = data[0].lon        
        return [lat, lon]
    })
}

let weatherData = function(lat, lon){
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then((res) => 
        res.json())
    .then((data) => {
      return data
    })
}

function saveLocation (name, state){
    savedLocation.push({name, state})
}

function addToFavorites(name, state){
    favoriteLocation.push({name, state})
    console.log(favoriteLocation)
    let para = document.createElement("li");
        listFavorite.appendChild(para);
        para.innerText = name;
        para.addEventListener("click", function(){
                favoriteLocation.forEach(function(location){
                    if(location.name == name){
                        cityInput.value = location.name;
                        stateInput.value = location.state;
                        fetchWeather();
                    }
                    else{
                        return;
                    }
                })
        })
}

let getGiphy = function(keyword){
    return fetch(`https://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${giphyApiKey}`)
    .then((res) => res.json())
    .then((data) => {
        return data
    })
}

function fetchWeather(){
latAndLon().then(function(result){
    weatherData(result[0], result[1]).then(function(weather){
        console.log(savedLocation)
        locationName.innerText = weather.name;
        getGiphy(weather.weather[0].main).then(function(results){
            let randomImage = results.data[Math.floor(Math.random() * 50)].images.original.url
            weatherImage.style.backgroundImage = `url('${randomImage}')`;
            weatherText.innerText = weather.weather[0].main;
        })
    })
    weatherData(result[0], result[1]).then(function(weather){
        if(weather.main.temp < 32){
            getGiphy("cold").then(function(results){
                let randomImage = results.data[Math.floor(Math.random() * 50)].images.original.url
                tempImage.style.backgroundImage = `url('${randomImage}')`;
                tempText.innerText = `Cold: ${weather.main.temp} Farenheit`;
            })
        }
        else if (weather.main.temp > 70){
            getGiphy("hot").then(function(results){
                let randomImage = results.data[Math.floor(Math.random() * 50)].images.original.url
                tempImage.style.backgroundImage = `url('${randomImage}')`;
                tempText.innerText = `Hot: ${weather.main.temp} Farenheit`;
            })
        }
        else {
            getGiphy("chilly").then(function(results){
                let randomImage = results.data[Math.floor(Math.random() * 50)].images.original.url
                tempImage.style.backgroundImage = `url('${randomImage}')`;
                tempText.innerText = `Chilly: ${weather.main.temp} Farenheit`;
            })
        }
    })
    })
}

submit.addEventListener("click", function(e){
    e.preventDefault();    
    if(!fetchWeather())
    {
        locationName.innerText = "Can not find that location. Please try again and check the spelling of your city name.";
    };
    saveLocationButton.style.display = "flex";
    })

saveLocationButton.addEventListener("click", function(){
        let newFavorite = savedLocation.slice(-1)[0]
        console.log(newFavorite);
        addToFavorites(newFavorite.name, newFavorite.state);
        }
    )