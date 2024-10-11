document.addEventListener("DOMContentLoaded", function() {
    const dateDiv = document.querySelector(".main-info__date");
    const tempDiv = document.querySelector(".main-info__temp");
    const geo = document.querySelector(".main-info__geo");
    const min = document.querySelector(".main-info__min");
    const max = document.querySelector(".main-info__max");
    const feelslike_temp = document.querySelector(".main-info__feelslike-temp");
    const main_info = document.querySelector(".main-info__general-main");
    const descr = document.querySelector(".main-info__general-descr");

    const search = document.querySelector(".search__input");

    const humidityElement = document.querySelector("#humidity");
    const windElement = document.querySelector("#wind");
    const pressureElement = document.querySelector("#pressure");
    const visibilityElement = document.querySelector("#visibility");

    const errorMessageDiv = document.querySelector(".error-message");

    moment.locale('ru');

    function fetchWeatherData(city) {
        //fetch(`http://localhost:4000/weather?q=${encodeURIComponent(city)}`)
    
        fetch(` /weather?q=${encodeURIComponent(city)}`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                displayWeatherData(data);
                updateBackground(data.weather[0].main);

                errorMessageDiv.style.display = 'none';

                const {
                    main: {
                        temp, feels_like, temp_min, temp_max,
                        pressure, humidity
                    },
                    visibility, wind: { speed }
                } = data;

                tempDiv.textContent = `${Math.round(temp)} °C`;
                feelslike_temp.textContent = `${Math.round(feels_like)} °C`;
                min.textContent = `${Math.round(temp_min)} °C`;
                max.textContent = `${Math.round(temp_max)} °C`;

                const [{ main: weatherMain, description }] = data.weather;
                main_info.textContent = `${weatherMain}.`;
                descr.textContent = `${description}.`;

                humidityElement.textContent = `${humidity}%`;
                windElement.textContent = `${speed} м/с`;
                pressureElement.textContent = `${pressure} гПа`;
                visibilityElement.textContent = `${visibility / 1000} км`;
            })
            .catch(error => {
                console.error("СКРИПТ Error fetching weather data:", error);
                errorMessageDiv.textContent = 'Ошибка: город не найден. Пожалуйста, попробуйте снова.';
                errorMessageDiv.style.display = 'block';
            });
    }

    function displayWeatherData(data) {
        const { name, dt, sys: { sunrise, sunset }, timezone } = data;
        geo.textContent = `${name}`;

        const localTime = moment.utc(dt * 1000).utcOffset(timezone / 60);
        const sunriseTime = moment.utc(sunrise * 1000).utcOffset(timezone / 60);
        const sunsetTime = moment.utc(sunset * 1000).utcOffset(timezone / 60);

        const formattedDate = localTime.format('D MMMM YYYY, dddd, HH:mm');
        dateDiv.innerHTML = `<div>${formattedDate} </div>`;

        const formattedSunrise = sunriseTime.format('HH:mm');
        const formattedSunset = sunsetTime.format('HH:mm');

        document.getElementById("sunrise-time").textContent = formattedSunrise;
        document.getElementById("sunset-time").textContent = formattedSunset;
    }

    function updateBackground(weatherMain) {
        const body = document.body;
        body.className = '';
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                body.classList.add('sunny');
                break;
            case 'rain':
            case 'drizzle':
            case 'thunderstorm':
                body.classList.add('rainy');
                break;
            case 'clouds':
                body.classList.add('cloudy');
                break;
            case 'snow':
                body.classList.add('snowy');
                break;
            default:
                body.classList.add('default-weather');
                break;
        }
    }

    search.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            let city = search.value.trim();
            city = city.replace(/\s+/g, ' ').trim();
            city = city.replace(/ /g, '-');
            if (city) {
                fetchWeatherData(city);
            }
        }
    });

    fetchWeatherData("Москва");

});
