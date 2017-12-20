import React from 'react';
import PropTypes from 'prop-types';

const ForecastWeather = ({ icon, type, time }) => (
  <div className="forecast-weather">
    <img alt={type} src={`/img/${icon}.svg`} />
    <p>{type}</p>
    <p>At {time}</p>
  </div>
);

ForecastWeather.propTypes = {
  icon: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default ForecastWeather;
