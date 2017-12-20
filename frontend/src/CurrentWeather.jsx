import React from 'react';
import PropTypes from 'prop-types';

const CurrentWeather = ({ icon, type }) => (
  <div className="current-weather">
    <img alt={type} src={`/img/${icon}.svg`} />
    <p>{type}</p>
  </div>
);

CurrentWeather.propTypes = {
  icon: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default CurrentWeather;
