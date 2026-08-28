
// ========================================
// WEATHER APP - OPEN-METEO
// No API Key Required
// ========================================


// ========================================
// HTML ELEMENTS
// ========================================

const locationInput = document.getElementById("locationInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeBtn = document.getElementById("themeBtn");
const unitBtn = document.getElementById("unitBtn");

const weatherCard = document.getElementById("weatherCard");
const highlightsSection = document.getElementById("highlightsSection");

const hourlySection = document.getElementById("hourlySection");
const hourlyContainer = document.getElementById("hourlyContainer");

const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");

const temperatureGraphSection =
    document.getElementById("temperatureGraphSection");

const temperatureGraph =
    document.getElementById("temperatureGraph");

const graphArea =
    document.getElementById("graphArea");

const graphLine =
    document.getElementById("graphLine");

const graphPoints =
    document.getElementById("graphPoints");

const graphLabels =
    document.getElementById("graphLabels");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const locationName = document.getElementById("locationName");
const countryName = document.getElementById("countryName");
const localTime = document.getElementById("localTime");

const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const temperatureUnit = document.getElementById("temperatureUnit");
const condition = document.getElementById("condition");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const favoriteBtn =
    document.getElementById("favoriteBtn");


// ========================================
// HIGHLIGHTS
// ========================================

const uvIndex = document.getElementById("uvIndex");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");
const cloudiness = document.getElementById("cloudiness");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");


// ========================================
// FAVORITES & RECENT
// ========================================

const favoritesSection =
    document.getElementById("favoritesSection");

const favoritesContainer =
    document.getElementById("favoritesContainer");

const recentSection =
    document.getElementById("recentSection");

const recentContainer =
    document.getElementById("recentContainer");


// ========================================
// VARIABLES
// ========================================

let weatherData = null;

let currentLocationData = null;

let isCelsius = true;

let isDarkMode =
    localStorage.getItem("weatherDarkMode") === "true";


// ========================================
// LOCAL STORAGE
// ========================================

let recentCityList =
    JSON.parse(
        localStorage.getItem("recentCities")
    ) || [];

let favoriteCityList =
    JSON.parse(
        localStorage.getItem("favoriteCities")
    ) || [];


// ========================================
// WEATHER CODE
// OPEN-METEO WMO CODES
// ========================================

function getWeatherInfo(code, isDay = true) {

    const weatherMap = {

        0: {
            text: isDay ? "Clear Sky" : "Clear Night",
            icon: isDay ? "☀️" : "🌙",
            type: "sunny"
        },

        1: {
            text: "Mainly Clear",
            icon: isDay ? "🌤️" : "🌙",
            type: "sunny"
        },

        2: {
            text: "Partly Cloudy",
            icon: "⛅",
            type: "cloudy"
        },

        3: {
            text: "Overcast",
            icon: "☁️",
            type: "cloudy"
        },

        45: {
            text: "Fog",
            icon: "🌫️",
            type: "cloudy"
        },

        48: {
            text: "Depositing Rime Fog",
            icon: "🌫️",
            type: "cloudy"
        },

        51: {
            text: "Light Drizzle",
            icon: "🌦️",
            type: "rainy"
        },

        53: {
            text: "Moderate Drizzle",
            icon: "🌦️",
            type: "rainy"
        },

        55: {
            text: "Dense Drizzle",
            icon: "🌧️",
            type: "rainy"
        },

        56: {
            text: "Freezing Drizzle",
            icon: "🌧️",
            type: "rainy"
        },

        57: {
            text: "Heavy Freezing Drizzle",
            icon: "🌧️",
            type: "rainy"
        },

        61: {
            text: "Slight Rain",
            icon: "🌦️",
            type: "rainy"
        },

        63: {
            text: "Moderate Rain",
            icon: "🌧️",
            type: "rainy"
        },

        65: {
            text: "Heavy Rain",
            icon: "🌧️",
            type: "rainy"
        },

        66: {
            text: "Freezing Rain",
            icon: "🌧️",
            type: "rainy"
        },

        67: {
            text: "Heavy Freezing Rain",
            icon: "🌧️",
            type: "rainy"
        },

        71: {
            text: "Slight Snow",
            icon: "🌨️",
            type: "cloudy"
        },

        73: {
            text: "Moderate Snow",
            icon: "❄️",
            type: "cloudy"
        },

        75: {
            text: "Heavy Snow",
            icon: "❄️",
            type: "cloudy"
        },

        77: {
            text: "Snow Grains",
            icon: "❄️",
            type: "cloudy"
        },

        80: {
            text: "Slight Rain Showers",
            icon: "🌦️",
            type: "rainy"
        },

        81: {
            text: "Moderate Rain Showers",
            icon: "🌧️",
            type: "rainy"
        },

        82: {
            text: "Violent Rain Showers",
            icon: "⛈️",
            type: "rainy"
        },

        85: {
            text: "Slight Snow Showers",
            icon: "🌨️",
            type: "cloudy"
        },

        86: {
            text: "Heavy Snow Showers",
            icon: "❄️",
            type: "cloudy"
        },

        95: {
            text: "Thunderstorm",
            icon: "⛈️",
            type: "rainy"
        },

        96: {
            text: "Thunderstorm with Hail",
            icon: "⛈️",
            type: "rainy"
        },

        99: {
            text: "Severe Thunderstorm",
            icon: "⛈️",
            type: "rainy"
        }

    };

    return (
        weatherMap[code] ||
        {
            text: "Unknown",
            icon: "🌡️",
            type: "cloudy"
        }
    );
}


// ========================================
// CONVERT TEMPERATURE
// ========================================

function convertTemperature(celsius) {

    if (isCelsius) {
        return Math.round(celsius);
    }

    return Math.round(
        (celsius * 9 / 5) + 32
    );
}


// ========================================
// DISPLAY RECENT SEARCHES
// ========================================

function displayRecentCities() {

    if (!recentSection || !recentContainer) {
        return;
    }

    recentContainer.innerHTML = "";

    if (recentCityList.length === 0) {

        recentSection.classList.add("hidden");

        return;
    }

    recentSection.classList.remove("hidden");

    recentCityList.forEach(function(city) {

        const card =
            document.createElement("div");

        card.className = "city-card";

        card.innerHTML = `
            <span class="city-name">
                🕐 ${city}
            </span>
        `;

        card.addEventListener(
            "click",
            function() {

                locationInput.value = city;

                getWeather();

            }
        );

        recentContainer.appendChild(card);

    });
}


// ========================================
// SAVE RECENT CITY
// ========================================

function saveRecentCity(city) {

    if (!city) {
        return;
    }

    city = city.trim();

    if (!city) {
        return;
    }

    recentCityList =
        recentCityList.filter(function(item) {

            return (
                item.toLowerCase() !==
                city.toLowerCase()
            );

        });

    recentCityList.unshift(city);

    recentCityList =
        recentCityList.slice(0, 5);

    localStorage.setItem(
        "recentCities",
        JSON.stringify(recentCityList)
    );

    displayRecentCities();
}


// ========================================
// DISPLAY FAVORITES
// ========================================

function displayFavorites() {

    if (!favoritesSection ||
        !favoritesContainer) {

        return;
    }

    favoritesContainer.innerHTML = "";

    if (favoriteCityList.length === 0) {

        favoritesSection.classList.add(
            "hidden"
        );

        return;
    }

    favoritesSection.classList.remove(
        "hidden"
    );

    favoriteCityList.forEach(function(city) {

        const card =
            document.createElement("div");

        card.className = "city-card";

        const name =
            document.createElement("span");

        name.className = "city-name";

        name.textContent =
            `⭐ ${city}`;

        const removeBtn =
            document.createElement("button");

        removeBtn.className =
            "remove-favorite";

        removeBtn.textContent = "🗑️";

        removeBtn.title =
            "Remove from favorites";

        removeBtn.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                removeFavorite(city);

            }
        );

        card.appendChild(name);

        card.appendChild(removeBtn);

        card.addEventListener(
            "click",
            function() {

                locationInput.value = city;

                getWeather();

            }
        );

        favoritesContainer.appendChild(card);

    });
}


// ========================================
// ADD / REMOVE FAVORITE
// ========================================

function toggleFavorite() {

    if (!currentLocationData) {
        return;
    }

    const city =
        currentLocationData.name;

    const index =
        favoriteCityList.findIndex(
            function(item) {

                return (
                    item.toLowerCase() ===
                    city.toLowerCase()
                );

            }
        );

    if (index === -1) {

        favoriteCityList.push(city);

    } else {

        favoriteCityList.splice(
            index,
            1
        );

    }

    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(favoriteCityList)
    );

    updateFavoriteButton();

    displayFavorites();
}


function removeFavorite(city) {

    favoriteCityList =
        favoriteCityList.filter(
            function(item) {

                return (
                    item.toLowerCase() !==
                    city.toLowerCase()
                );

            }
        );

    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(favoriteCityList)
    );

    updateFavoriteButton();

    displayFavorites();
}


// ========================================
// FAVORITE BUTTON
// ========================================

function updateFavoriteButton() {

    if (!favoriteBtn ||
        !currentLocationData) {

        return;
    }

    const city =
        currentLocationData.name;

    const isFavorite =
        favoriteCityList.some(
            function(item) {

                return (
                    item.toLowerCase() ===
                    city.toLowerCase()
                );

            }
        );

    favoriteBtn.textContent =
        isFavorite ? "★" : "☆";

    favoriteBtn.classList.toggle(
        "active",
        isFavorite
    );

    favoriteBtn.title =
        isFavorite
            ? "Remove from favorites"
            : "Add to favorites";
}


if (favoriteBtn) {

    favoriteBtn.addEventListener(
        "click",
        toggleFavorite
    );

}


// ========================================
// GET LOCATION FROM OPEN-METEO
// ========================================

async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=en` +
        `&format=json`;

    const response =
        await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to search location."
        );
    }

    const data =
        await response.json();

    if (!data.results ||
        data.results.length === 0) {

        throw new Error(
            "City not found. Please enter a valid city name."
        );
    }

    return data.results[0];
}


// ========================================
// GET WEATHER
// ========================================

async function getWeather() {

    const location =
        locationInput.value.trim();

    if (location === "") {

        showError(
            "Please enter a city name."
        );

        return;
    }

    loading.classList.remove("hidden");

    weatherCard.classList.add("hidden");

    highlightsSection.classList.add("hidden");

    hourlySection.classList.add("hidden");

    forecastSection.classList.add("hidden");

    temperatureGraphSection.classList.add(
        "hidden"
    );

    errorMessage.textContent = "";

    try {

        // ========================================
        // GEOCODING
        // ========================================

        const place =
            await getCoordinates(location);

        currentLocationData = {

            name: place.name,

            country:
                place.country || "",

            region:
                place.admin1 || "",

            latitude:
                place.latitude,

            longitude:
                place.longitude,

            timezone:
                place.timezone

        };


        // ========================================
        // OPEN-METEO WEATHER
        // ========================================

        const url =
            `https://api.open-meteo.com/v1/forecast` +

            `?latitude=${place.latitude}` +

            `&longitude=${place.longitude}` +

            `&current=` +
            `temperature_2m,relative_humidity_2m,apparent_temperature,` +
            `is_day,precipitation,weather_code,cloud_cover,pressure_msl,` +
            `surface_pressure,wind_speed_10m,wind_direction_10m` +

            `&hourly=` +
            `temperature_2m,weather_code,precipitation_probability,` +
            `visibility,cloud_cover,uv_index` +

            `&daily=` +
            `weather_code,temperature_2m_max,temperature_2m_min,` +
            `apparent_temperature_max,apparent_temperature_min,` +
            `precipitation_probability_max,sunrise,sunset,uv_index_max` +

            `&temperature_unit=celsius` +

            `&wind_speed_unit=kmh` +

            `&forecast_days=7` +

            `&timezone=auto`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );
        }

        const data =
            await response.json();

        weatherData = data;


        // ========================================
        // SAVE RECENT CITY
        // ========================================

        saveRecentCity(
            place.name
        );


        // ========================================
        // DISPLAY
        // ========================================

        displayCurrentWeather();

        displayHighlights();

        displayHourlyForecast();

        displayForecast();

        displayTemperatureGraph();

        displayWeatherAlert();

        changeWeatherBackground();


    } catch (error) {

        weatherCard.classList.add(
            "hidden"
        );

        highlightsSection.classList.add(
            "hidden"
        );

        hourlySection.classList.add(
            "hidden"
        );

        forecastSection.classList.add(
            "hidden"
        );

        temperatureGraphSection.classList.add(
            "hidden"
        );

        showError(
            error.message
        );

        console.error(
            "Weather Error:",
            error
        );

    } finally {

        loading.classList.add(
            "hidden"
        );

    }
}


// ========================================
// CURRENT WEATHER
// ========================================

function displayCurrentWeather() {

    const current =
        weatherData.current;

    locationName.textContent =
        currentLocationData.name;

    countryName.textContent =
        currentLocationData.region
            ? `${currentLocationData.region}, ${currentLocationData.country}`
            : currentLocationData.country;

    localTime.textContent =
        `Local time: ${new Date().toLocaleString(
            "en-US",
            {
                timeZone:
                    weatherData.timezone,
                dateStyle:
                    "medium",
                timeStyle:
                    "short"
            }
        )}`;

    const info =
        getWeatherInfo(
            current.weather_code,
            current.is_day === 1
        );

    condition.textContent =
        info.text;

    weatherIcon.src =
        `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="120"
                 height="120"
                 viewBox="0 0 120 120">
                <text x="60"
                      y="85"
                      text-anchor="middle"
                      font-size="70">
                    ${info.icon}
                </text>
            </svg>
        `)}`;

    weatherIcon.alt =
        info.text;

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    updateTemperature();

    updateFavoriteButton();

    weatherCard.classList.remove(
        "hidden"
    );
}


// ========================================
// HIGHLIGHTS
// ========================================

function displayHighlights() {

    const current =
        weatherData.current;

    const daily =
        weatherData.daily;

    const hourly =
        weatherData.hourly;

    uvIndex.textContent =
        daily.uv_index_max[0] !== null
            ? daily.uv_index_max[0]
            : "--";

    const currentHour =
        findCurrentHourIndex();

    if (hourly.visibility[currentHour] != null) {

        visibility.textContent =
            `${(
                hourly.visibility[currentHour] /
                1000
            ).toFixed(1)} km`;

    } else {

        visibility.textContent =
            "-- km";
    }

    pressure.textContent =
        `${Math.round(
            current.pressure_msl
        )} mb`;

    cloudiness.textContent =
        `${current.cloud_cover}%`;

    sunrise.textContent =
        formatTime(
            daily.sunrise[0]
        );

    sunset.textContent =
        formatTime(
            daily.sunset[0]
        );

    highlightsSection.classList.remove(
        "hidden"
    );
}


// ========================================
// CURRENT HOUR INDEX
// ========================================

function findCurrentHourIndex() {

    const times =
        weatherData.hourly.time;

    const currentTime =
        new Date(weatherData.current.time);

    let closestIndex = 0;

    let smallestDifference =
        Infinity;

    times.forEach(
        function(time, index) {

            const difference =
                Math.abs(
                    new Date(time) -
                    currentTime
                );

            if (
                difference <
                smallestDifference
            ) {

                smallestDifference =
                    difference;

                closestIndex =
                    index;
            }

        }
    );

    return closestIndex;
}


// ========================================
// TIME FORMAT
// ========================================

function formatTime(time) {

    if (!time) {
        return "--";
    }

    const date =
        new Date(time);

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


// ========================================
// TEMPERATURE
// ========================================

function updateTemperature() {

    if (!weatherData) {
        return;
    }

    const current =
        weatherData.current;

    const temp =
        convertTemperature(
            current.temperature_2m
        );

    const feels =
        convertTemperature(
            current.apparent_temperature
        );

    temperature.textContent =
        temp;

    feelsLike.textContent =
        `${feels}°${isCelsius ? "C" : "F"}`;

    temperatureUnit.textContent =
        isCelsius ? "°C" : "°F";

    unitBtn.textContent =
        isCelsius ? "°F" : "°C";
}


// ========================================
// HOURLY FORECAST
// ========================================

function displayHourlyForecast() {

    hourlyContainer.innerHTML = "";

    const hourly =
        weatherData.hourly;

    const currentIndex =
        findCurrentHourIndex();

    const maxHours =
        Math.min(
            currentIndex + 12,
            hourly.time.length
        );

    for (
        let i = currentIndex;
        i < maxHours;
        i++
    ) {

        const time =
            new Date(
                hourly.time[i]
            );

        const info =
            getWeatherInfo(
                hourly.weather_code[i],
                true
            );

        const temp =
            convertTemperature(
                hourly.temperature_2m[i]
            );

        const rain =
            hourly.precipitation_probability[i] ??
            0;

        const card =
            document.createElement("div");

        card.className =
            "hourly-card";

        card.innerHTML = `

            <div class="hourly-time">
                ${time.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "numeric"
                    }
                )}
            </div>

            <div style="
                font-size: 38px;
                margin: 5px 0;
            ">
                ${info.icon}
            </div>

            <div class="hourly-temp">
                ${temp}°
            </div>

            <div class="hourly-rain">
                💧 ${rain}% rain
            </div>

        `;

        hourlyContainer.appendChild(
            card
        );
    }

    if (maxHours > currentIndex) {

        hourlySection.classList.remove(
            "hidden"
        );
    }
}


// ========================================
// 7-DAY FORECAST
// ========================================

function displayForecast() {

    forecastContainer.innerHTML = "";

    const daily =
        weatherData.daily;

    // EXACTLY 7 DAYS

    for (
        let i = 0;
        i < Math.min(7, daily.time.length);
        i++
    ) {

        const date =
            new Date(
                daily.time[i] + "T12:00:00"
            );

        const dayName =
            i === 0
                ? "Today"
                : date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                );

        const info =
            getWeatherInfo(
                daily.weather_code[i],
                true
            );

        const temp =
            convertTemperature(
                daily.temperature_2m_max[i]
            );

        const rain =
            daily.precipitation_probability_max[i] ??
            0;

        const card =
            document.createElement("div");

        card.className =
            "forecast-card";

        card.innerHTML = `

            <div class="forecast-day">
                ${dayName}
            </div>

            <div style="
                font-size: 40px;
                margin: 5px 0;
            ">
                ${info.icon}
            </div>

            <div class="forecast-temp">
                ${temp}°
            </div>

            <div class="forecast-condition">
                ${info.text}
            </div>

            <div class="forecast-rain">
                💧 ${rain}% rain
            </div>

        `;

        forecastContainer.appendChild(
            card
        );
    }

    if (daily.time.length > 0) {

        forecastSection.classList.remove(
            "hidden"
        );
    }
}


// ========================================
// TEMPERATURE GRAPH
// ========================================

function displayTemperatureGraph() {

    if (!temperatureGraph ||
        !graphLine ||
        !graphArea ||
        !graphPoints) {

        return;
    }

    const hourly =
        weatherData.hourly;

    const currentIndex =
        findCurrentHourIndex();

    const graphData = [];

    for (
        let i = currentIndex;
        i < Math.min(
            currentIndex + 8,
            hourly.time.length
        );
        i++
    ) {

        graphData.push({

            temp:
                convertTemperature(
                    hourly.temperature_2m[i]
                ),

            time:
                new Date(
                    hourly.time[i]
                )

        });
    }

    if (graphData.length < 2) {
        return;
    }

    const width = 700;
    const height = 260;

    const paddingX = 35;
    const paddingY = 35;

    const temperatures =
        graphData.map(
            item => item.temp
        );

    const minTemp =
        Math.min(...temperatures) - 2;

    const maxTemp =
        Math.max(...temperatures) + 2;

    const points =
        graphData.map(
            function(item, index) {

                const x =
                    paddingX +
                    (
                        index /
                        (graphData.length - 1)
                    ) *
                    (
                        width -
                        paddingX * 2
                    );

                const y =
                    height -
                    paddingY -
                    (
                        (
                            item.temp -
                            minTemp
                        ) /
                        (
                            maxTemp -
                            minTemp
                        )
                    ) *
                    (
                        height -
                        paddingY * 2
                    );

                return {
                    x,
                    y,
                    temp: item.temp,
                    time: item.time
                };
            }
        );

    const polylinePoints =
        points
            .map(
                p =>
                    `${p.x},${p.y}`
            )
            .join(" ");

    graphLine.setAttribute(
        "points",
        polylinePoints
    );

    const areaPath =
        `M ${points[0].x} ${height - paddingY}
         L ${points
            .map(
                p =>
                    `${p.x} ${p.y}`
            )
            .join(" L ")}
         L ${points[points.length - 1].x}
           ${height - paddingY}
         Z`;

    graphArea.setAttribute(
        "d",
        areaPath
    );

    graphPoints.innerHTML = "";

    points.forEach(
        function(point) {

            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );

            circle.setAttribute(
                "cx",
                point.x
            );

            circle.setAttribute(
                "cy",
                point.y
            );

            circle.setAttribute(
                "class",
                "graph-point"
            );

            circle.setAttribute(
                "fill",
                "white"
            );

            circle.setAttribute(
                "stroke",
                "#4facfe"
            );

            const text =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );

            text.setAttribute(
                "x",
                point.x
            );

            text.setAttribute(
                "y",
                point.y - 10
            );

            text.setAttribute(
                "class",
                "graph-temp"
            );

            text.setAttribute(
                "fill",
                "currentColor"
            );

            text.textContent =
                `${point.temp}°`;

            graphPoints.appendChild(
                circle
            );

            graphPoints.appendChild(
                text
            );

        }
    );

    graphLabels.innerHTML = "";

    points.forEach(
        function(point) {

            const label =
                document.createElement(
                    "span"
                );

            label.textContent =
                point.time.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "numeric"
                    }
                );

            graphLabels.appendChild(
                label
            );

        }
    );

    temperatureGraphSection.classList.remove(
        "hidden"
    );
}


// ========================================
// WEATHER ALERT
// ========================================

function displayWeatherAlert() {

    // Remove old alert

    const oldAlert =
        document.getElementById(
            "weatherAlert"
        );

    if (oldAlert) {
        oldAlert.remove();
    }

    const current =
        weatherData.current;

    const daily =
        weatherData.daily;

    let alertText = "";

    let alertType = "";

    // Thunderstorm

    if (
        current.weather_code >= 95
    ) {

        alertText =
            "Thunderstorm conditions detected. Stay indoors and avoid exposed areas.";

        alertType =
            "⚠️ Severe Weather Alert";

    }

    // Heavy rain

    else if (
        current.weather_code === 65 ||
        current.weather_code === 82
    ) {

        alertText =
            "Heavy rain conditions detected. Be careful while travelling.";

        alertType =
            "🌧️ Rain Alert";

    }

    // Heavy snow

    else if (
        current.weather_code === 75 ||
        current.weather_code === 86
    ) {

        alertText =
            "Heavy snowfall conditions detected.";

        alertType =
            "❄️ Snow Alert";

    }

    // High rain probability

    else if (
        daily.precipitation_probability_max[0] >= 70
    ) {

        alertText =
            `High chance of rain today: ${daily.precipitation_probability_max[0]}%.`;

        alertType =
            "🌧️ Rain Alert";

    }

    // High UV

    else if (
        daily.uv_index_max[0] >= 8
    ) {

        alertText =
            `High UV Index expected today: ${daily.uv_index_max[0]}.`;

        alertType =
            "☀️ UV Alert";

    }

    if (!alertText) {
        return;
    }

    const alert =
        document.createElement("div");

    alert.id =
        "weatherAlert";

    alert.style.cssText = `
        margin-top: 20px;
        padding: 15px;
        border-radius: 14px;
        background: #fff3cd;
        color: #856404;
        border: 1px solid #ffe69c;
        text-align: left;
        font-size: 14px;
    `;

    alert.innerHTML = `
        <strong>
            ${alertType}
        </strong>
        <br>
        <span>
            ${alertText}
        </span>
    `;

    weatherCard.after(alert);
}


// ========================================
// WEATHER BACKGROUND
// ========================================

function changeWeatherBackground() {

    const current =
        weatherData.current;

    const info =
        getWeatherInfo(
            current.weather_code,
            current.is_day === 1
        );

    document.body.classList.remove(
        "sunny",
        "rainy",
        "cloudy",
        "night"
    );

    if (
        current.is_day === 0 &&
        current.weather_code <= 3
    ) {

        document.body.classList.add(
            "night"
        );

        return;
    }

    document.body.classList.add(
        info.type
    );
}


// ========================================
// ERROR
// ========================================

function showError(message) {

    errorMessage.textContent =
        message;
}


// ========================================
// CURRENT LOCATION
// ========================================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        showError(
            "Location is not supported by your browser."
        );

        return;
    }

    loading.classList.remove(
        "hidden"
    );

    errorMessage.textContent = "";

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            locationInput.value =
                `${latitude},${longitude}`;

            try {

                // Reverse geocode

                const response =
                    await fetch(
                        `https://geocoding-api.open-meteo.com/v1/reverse?` +
                        `latitude=${latitude}` +
                        `&longitude=${longitude}` +
                        `&count=1` +
                        `&language=en` +
                        `&format=json`
                    );

                const data =
                    await response.json();

                if (
                    data.results &&
                    data.results.length > 0
                ) {

                    locationInput.value =
                        data.results[0].name;

                }

                await getWeather();

            } catch (error) {

                await getWeather();

            }

        },

        function(error) {

            loading.classList.add(
                "hidden"
            );

            if (error.code === 1) {

                showError(
                    "Location permission denied. Please allow location access."
                );

            } else if (error.code === 2) {

                showError(
                    "Your location could not be determined."
                );

            } else if (error.code === 3) {

                showError(
                    "Location request timed out."
                );

            } else {

                showError(
                    "Unable to access your location."
                );

            }

        }
    );
}


// ========================================
// DARK / LIGHT MODE
// ========================================

if (isDarkMode) {

    document.body.classList.add(
        "dark"
    );

    themeBtn.textContent =
        "☀️";

} else {

    themeBtn.textContent =
        "🌙";
}


themeBtn.addEventListener(
    "click",
    function() {

        isDarkMode =
            !isDarkMode;

        document.body.classList.toggle(
            "dark",
            isDarkMode
        );

        localStorage.setItem(
            "weatherDarkMode",
            isDarkMode
        );

        themeBtn.textContent =
            isDarkMode
                ? "☀️"
                : "🌙";

    }
);


// ========================================
// CELSIUS / FAHRENHEIT
// ========================================

unitBtn.addEventListener(
    "click",
    function() {

        isCelsius =
            !isCelsius;

        updateTemperature();

        if (weatherData) {

            displayHourlyForecast();

            displayForecast();

            displayTemperatureGraph();

        }

    }
);


// ========================================
// SEARCH
// ========================================

searchBtn.addEventListener(
    "click",
    getWeather
);


// ========================================
// CURRENT LOCATION BUTTON
// ========================================

locationBtn.addEventListener(
    "click",
    getCurrentLocation
);


// ========================================
// ENTER KEY
// ========================================

locationInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            getWeather();

        }

    }
);


// ========================================
// INITIAL DISPLAY
// ========================================

displayRecentCities();

displayFavorites();


// ========================================
// DEFAULT CITY
// ========================================

locationInput.value =
    "London";

getWeather();

