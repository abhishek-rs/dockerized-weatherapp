import React from 'react';
import ReactDOM from 'react-dom';
import CurrentWeather from './CurrentWeather';
import ForecastWeather from './ForecastWeather';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (lat, lon) => {
  try {
    let fetchURL = `${baseURL}/weather`;
    if (lat && lon) {
      fetchURL = `${baseURL}/weather?lat=${lat}&lon=${lon}`;
    }
    const response = await fetch(fetchURL);
    return response.json();
  } catch (error) {
    console.error(error);
  }
  return {};
};

const getForecastFromApi = async (lat, lon) => {
  try {
    let fetchURL = `${baseURL}/forecast`;
    if (lat && lon) {
      fetchURL = `${baseURL}/forecast?lat=${lat}&lon=${lon}`;
    }
    const response = await fetch(fetchURL);
    return response.json();
  } catch (error) {
    console.error(error);
  }
  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
    };
    this.getDefaultWeatherFromApi = this.getDefaultWeatherFromApi.bind(this);
  }

  async componentWillMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentWeather = await getWeatherFromApi(position.coords.latitude,
                                                position.coords.longitude);
        const forecast = await getForecastFromApi(position.coords.latitude,
                                                  position.coords.longitude);
        this.setState(
          { currentWeatherIcon: currentWeather.icon.slice(0, -1),
            currentWeatherType: currentWeather.main,
            completeForecast: forecast,
          });
      }, async () => {
        alert('Loading weather for default location - Helsinki, FI');
        await this.getDefaultWeatherFromApi();
      });
    } else {
      await this.getDefaultWeatherFromApi();
    }
  }

  async getDefaultWeatherFromApi() {
    const currentWeather = await getWeatherFromApi();
    const forecast = await getForecastFromApi();
    this.setState(
      { currentWeatherIcon: currentWeather.icon.slice(0, -1),
        currentWeatherType: currentWeather.main,
        completeForecast: forecast,
      });
  }

  render() {
    const { currentWeatherIcon, currentWeatherType, completeForecast } = this.state;
    let forecastData = [];
    forecastData = completeForecast ?
                      completeForecast.reduce((res, f) => {
                        res.push(
                          <ForecastWeather
                            key={f.date}
                            icon={f.weather.icon.slice(0, -1)}
                            type={f.weather.main}
                            time={f.date}
                          />
                        );
                        return res;
                      }, [])
                    : [];
    return (
      <div className="main-container">
        <h2>Current weather</h2>
        { currentWeatherIcon &&
          <CurrentWeather icon={currentWeatherIcon} type={currentWeatherType} />
        }
        <h2>Forecast</h2>
        <div className="forecast-container">
          {forecastData}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
