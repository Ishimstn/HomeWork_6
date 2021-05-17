// Homepage DOM Element List for WeatherDashbord
const APIKey = "64ab24ff82e7fed2e690681378354860";
var currentTime = new Date();
var searchedCities = [];


var responseCity = function(response, cityName, weatherIcon) {
    var currentdiv = $("<div>");
    
    var iconLink = "http://openweathermap.org/img/wn/" + weatherIcon + ".png"
    
    var icon = $("<img>").attr("src", iconLink);
    
    var cityEl = $("<h3>").text(cityName + "(" + currentTime.toLocaleDateString("en-US") + ")")
    
    cityEl.append(icon);
    
    var windEl = $("<p>").text("Wind Speed: " + response.current.wind_speed);
    
    var humidityEl = $("<p>").text("Humidity: " + response.current.humidity);
    
    var uvEl = $("<p>").text("UV Index: ");
    
    var uvSpan = $("<span>").text(response.current.uvi);
    
    uvEl.append(uvSpan);
    
    if (response.current.uvi >= 0 && response.current.uvi <= 2) 
        uvSpan.addClass("green");
    if (response.current.uvi >= 3 && response.current.uvi <= 7) 
        uvSpan.addClass("yellow");
    if (response.current.uvi >= 8) 
        uvSpan.addClass("red");
    
    var tempF = (response.current.temp - 273.15) * 1.80 + 32;
    var tempEl = $("<p>").text("Temperature (F) " + tempF.toFixed(2));

    currentdiv.append(cityEl, windEl, humidityEl, tempEl, uvEl)

    $("#main-content").html(currentdiv);

    createForecast(response)
};

var createForecast = function(response) {

    $("#5-day-forecast").empty();

    for (i = 0; i < 5; i++) {
        
        var iconL = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png"
    
        var fivedaydiv = $("<div class='col-sm-2 forecast-day'>");
        var fivedaydate = $("<p>").text(currentTime.addDays(i+1).toLocaleDateString("en-US"));
        var fivedayicon = $("<img>").attr("src", iconL);
        var fivedaytempF = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
        var fivedaytemp = $("<p>").text("Temp: " + fivedaytempF.toFixed(2));
        var fivedayhumidity = $("<p>").text("Humidity: " + response.daily[i].humidity);        

        fivedaydiv.append(fivedaydate, fivedayicon, fivedaytemp, fivedayhumidity);

        $("#5-day-forecast").append(fivedaydiv);

    }       
    
};

var citySearch = function(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        var callQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lon=" + response.coord.lon + "&lat=" + response.coord.lat + "&appid=" + APIKey;

        $.ajax({
            url: callQueryUrl,
            method: "GET"
        })

        .then(function(callResponse) {      
            responseCity(callResponse, response.name, response.weather[0].icon);
            searchedCities.unshift(response.name)

            localStorage.setItem("searchedCities", JSON.stringify(searchedCities)); 
        });
    });
};

$("#search").on("click", function() {
    citySearch($("#search-city").val().trim());
   
});

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

var oneCityCall = function () {
    searchedCities = JSON.parse(localStorage.getItem("searchedCities")) ?? [];
    if (searchedCities.length>0) {
        citySearch(searchedCities[0]);
    };
};

var cityDisplay = function() {
    var currentdiv = $("<div>");    
    for (i = 0; i < searchedCities.length; i++) {
        var newSearch = $('<div class="new-search" onclick="searchCity(\'' + searchedCities[i] + '\')">');
        newSearch.text(searchedCities[i]); 
        currentdiv.append(newSearch);
    };       

    $("#storage").append(currentdiv);

};   


$(document).ready(function() {
    
    oneCityCall();

    cityDisplay();
});