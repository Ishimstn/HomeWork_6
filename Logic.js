// Homepage DOM Element List for WeatherDashbord
const apiKey = "64ab24ff82e7fed2e690681378354860";
const currentTime = new Date();
const searchCities = [];

const currentCity = function(response, cityName, weatherIcon) {
    var currentDiv = $("<div>");

    var weatherURL = "http://openweathermap.org/img/wn/" + weatherIcon + ".png"

    var weatherPicture = $("<img>").attr("src", weatherURL);

    var cityEl = $("<h2>").text(cityName + "(" + currentTime.toLocaleDateString("en-US") + ")");

    cityEl.append(weatherPicture);

    var windEl = $("<p>").text("Current Wind Speed: " + response.current.wind_speed);

    var humidityEl = $("<p>").text("Current Humidity: " + response.current.humidity);

    var uvEl = $("<p>").text("Current UV Index: ");

    var uvSpan = $("<span>").text(response.current.uvi);

    uvEl.append(uvSpan);

    if(response.current.uvi >= 0 && response.current.uvi <= 2) {
        uvSpan.addClass("green");
    }

    if(response.current.uvi >= 3 && response.current.uvi <= 7) {
        uvSpan.addClass("yellow");
    }

    if(response.current.uvi >= 8) {
        uvSpan.addClass("red");
    }

    var tempF = (response.current.temp - 273.15) * 1.80 + 32;

    var tempEl = $("<p>").text("Temperature (F) " + tempF.toFixed(2));

    currentDiv.append(cityEl, windEl, humidityEl, tempEl, uvEl);

    $(".col mt-4 mr-5").html(currentDiv);

    createForecast(response)
};

console.log(currentCity);

var createForecast = function(response) {

    $(".col fiveDayOne").empty();

    for (i = 0; i < 5; i++) {

        var urlIcon = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png"

        var fiveDayDiv = $("<div class = 'col-sm-2 forecast-day'>");

        var fiveDayDate = $("<p>").text(currentTime.addDays(i+1).toLocaleDateString("en-US"));

        var fiveDayIcon = $("<img>").attr("src", urlIcon);

        var fiveDayTempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;

        var fiveDayTemp = $("<p>").text("Temp: " + tempF.toFixed(2));

        var fiveDayHum = $("<p>").text("Humidity: " + response.daily[i].humidity);

        fiveDayDiv.append(fiveDayDate, fiveDayIcon, fiveDayTempF, fiveDayTemp, fiveDayHum);

        $(".col fiveDayOne").append(fiveDayDiv);
    }
};

console.log(createForecast);

    const citySearch = function(city) {
        const currentCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
        
        $.ajax({
            url: currentCityUrl,
            method: "GET"
        })
        .then(function(response){
            const callUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + response.coord.lon + "&lat=" + response.coord.lat + "&appid=" + apiKey;

            $.ajax({
                url: callUrl, 
                method: "GET"
            })
            .then(function(callResponse){
                currentCity(callResponse, response.name, response.weather[0].icon);

                searchedCities.upshift(response.name)

                localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
            });
        });
    };

    console.log(citySearch);

    $("#search").on("click", function(){
        citySearch($("#search-city").val().trim());
    });

    Date.prototype.addDays = function(days) {
        var currentDate = new Date(this.valueOf());

        currentDate.setDate(Date.getDate() + days);

        return currentDate;
    }

    var cityCall = function () {
        searchedCities = JSON.parse(localStorage.getItem("searchedCities")) ?? [];

        if (searchedCities.length > 0) {
            citySearch(searchedCities[0]);
        }
    };

    var cityDisplay = function() {
        var cityDiv = $("<div>");

        for(i = 0; searchedCities.length; i++) {
            var newSearch = $('<div class = "new-search" onclick="citySearch(\'' + searchedCities[i] + '\')">');

            newSearch.text(SearchedCities[i]);
            cityDiv.append(newSearch);
        };

        $(".list-group").append(cityDiv);

    };

    $(document).ready(function(){

        cityCall();

        cityDisplay();
    });