import React from 'react';
import ReactDOM from 'react-dom';

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
        const weather = await getWeatherFromApi(position.coords.latitude,
                                                position.coords.longitude);
        this.setState({ icon: weather.icon.slice(0, -1) });
      }, async () => {
        alert('Loading weather for default location - Helsinki, FI');
        await this.getDefaultWeatherFromApi();
      });
    } else {
      await this.getDefaultWeatherFromApi();
    }
  }

  async getDefaultWeatherFromApi() {
    const weather = await getWeatherFromApi();
    this.setState({ icon: weather.icon.slice(0, -1) });
  }

  render() {
    const { icon } = this.state;

    return (
      <div className="icon">
        { icon && <img alt="weather-icon" src={`/img/${icon}.svg`} /> }
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
