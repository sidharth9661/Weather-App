const https = require("https");
const fs = require('fs');
// API keys
const appId = "5ebf6fbc947413821be4c39cc5127813";

// Fatching data using Api
function showWeather(cityName, res) {
    //console.log(cityName);
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=" + appId + "&units=metric";
    https.get(url, function(response_data) {
        console.log(response_data.statusCode);

        if (response_data.statusCode !== 200) {
            console.log("Something Went Wrong");
            res.send("<p style='text-align: center; padding-top: 4%; color: blue; font-size: 80px;'>" + response_data.statusCode + "</p><h1 style='text-align: center; padding-top: 4%;'>Something went wrong.</h1>")
        } else {
            response_data.on("data", function(data) {
                //console.log(data);  // hexa code form
                const WeatherData = JSON.parse(data);
                console.log(WeatherData); // json object formate

                const temp = Math.round((WeatherData.main.temp).toFixed(2));
                const city = WeatherData.name;
                const weaterDescription = WeatherData.weather[0].description;
                const iconCode = WeatherData.weather[0].icon;
                const WeatherStatus = WeatherData.weather[0].main;
                const countryCode = WeatherData.sys.country;
                const windSpeed = WeatherData.wind.speed;
                const visibility = Number((WeatherData.visibility) / 1000);
                const humidity = WeatherData.main.humidity;

                //res.send(`Temperature of ${city} is ${temp}°F & ${celsius}°C <br> <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png">`);
                res.render('index.ejs', {
                    temp: temp,
                    city: city,
                    iconCode: iconCode,
                    WeatherStatus: WeatherStatus,
                    countryCode: countryCode,
                    windSpeed: windSpeed,
                    visibility: visibility,
                    humidity: humidity

                    // WeatherData: WeatherData
                });
            });
        }
    });
}

module.exports = { showWeather };