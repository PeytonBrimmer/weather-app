const apiKey = "caedcef682000464c021dc67bafa2853";

var submitButton = document.getElementById("submit-btn");
submitButton.addEventListener("click", submitButtonEvent);
var cityName = document.getElementById("input");
let clearBtn = document.getElementById("clear-history");
clearBtn.addEventListener("click", clearHistory);

function submitButtonEvent(event) {
    event.preventDefault();
    var cityNameVal = cityName.value;

    if (!cityNameVal) {
        alert("Please enter a city name");
        return;
    } else {
        cityNameVal =  userCityVal.toLowerCase();
        const formattedInput = cityNameVal.replace(/\s+/g, "");
        saveSearches(formattedInput);
        populateSearchHistory();
        document.getElementById("input").value = null;
    }

    searchCoordinatesApi(userCityVal);
};

function clearHistory() {
    event.preventDefault();
    localStorage.removeItem('city');
    populateSearchHistory();
}

function saveSearches(formattedInput) {
    let localStorageData = JSON.parse(localStorage.getItem('city'));
    if (localStorageData === null) {
        localStorageData = []
        localStorageData.push(formattedInput);
    } else {
        let filteredData = localStorageData.filter(data => data.toLowerCase() === formattedInput.toLowerCase()) 
        if (filteredData.length === 0) {
        localStorageData.push(formattedInput)
    }};
        localStorage.setItem('city', JSON.stringify(localStorageData));
    };

    function searchCoordinatesApi(city) {
        var coordinatesUrl ="https://api.openweathermap.org/geo/1.0/direct?q=" + cityNameVal + "&limit=1&appid=" + apiKey;

        fetch(coordinatesUrl)
        .then(response => response.json())
        .then(data => {
            let lat = data[0].lat.toFixed(2);
            let lon = data[0].lon.toFixed(2);
            searchWeatherApi(lat, lon);
    })
        .catch(function (error) {
            alert("City not found");
            console.log(error);
        });
    };

    function searchWeatherApi(lat, lon) {
        var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`;

        fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data);
        })
        .catch(function (error) {
            console.log(error);
            alert("City not found");
        });
    };

    function displayWeather(data) {

        let cityName = data.city.mame;
        document.getElementById("city-name").innerHTML = cityName;
        document.getElementById("current-weather").innerHTML = "";
        document.getElementById("five-day-forecast").innerHTML = "";
            for (var i = -1; i <= data.list.length; i += 8) {
                console.log(i);
                let index;
                if (i === -1) {
                    index = i + 1
                } else {
                    index = i;
                }
        
        let date = new Date(data.list[index].dt * 1000);
        let temperature = Math.round(data.list[index].main.temp);
        let humidity = data.list[index].main.humidity;
        let windSpeed = data.list[index].wind.speed;

        if (i === -1) {
            currentText = `
            <div>
                <img src="https://openweathermap.org/img/w/${data.list[index].weather[0].icon}@2x.png" alt="weather icon">
                <p>${date.toDateString()}</p>
                <p> Temp:&nbsp${temperature}&#176F</p>
                <p> Humidity:&nbsp${humidity}%</p>
                <p> Wind:&nbsp${windSpeed}mph</p>
            </div>
            `;

            document.getElementById("current-weather").innerHTML = currentText;
        } else {
            console.log(index)
            fiveDayText = ''
            fivedaytext = `
            <div class five-day-text>
            <img src="https://openweathermap.org/img/w/${data.list[index].weather[0].icon}2x.png" alt="weather icon">
            <p> ${date.toDateString()}</p>
            <p> Temp:&nbsp${temperature}&#176F</p>
            <p> Humidity:&nbsp${humidity}%</p>
            <p> Wind:&nbsp${windSpeed}mph</p>
            </div>
            `;

            document.getElementById("five-day-forecast").innerHTML += fiveDayText;
        }
    }
};

function populateSearchHistory() {
    document.getElementById("search-history").innerHTML = "";
    let localStorageData = JSON.parse(localStorage.getItem('city'));
    let searchHistoryDiv = document.createElement("div");

    if (localStorageData) {
        for (let i = 0; i < localStorageData.length; i++) {
            let historyBtn = document.createElement("button");
            historyBtn.innerHTML = localStorageData[i];
            historyBtn.className = "history-btn";
            historyBtn.addEventListener("click", function() {
                event.preventDefault();
                let cityName = event.target.innerHTML; 
                searchCoordinatesApi(userCityVal);
            })
            searchHistoryDiv.append(historyBtn)
    }
}

document.getElementById("search-history").append(searchHistoryDiv);
};

populateSearchHistory();

window.onload = function loadSanFranciso() {
    userCityVal = "San Francisco";
    searchCoordinatesApi(userCityVal);
};   