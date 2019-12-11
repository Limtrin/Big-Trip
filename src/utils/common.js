const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = castTimeFormat(date.getFullYear()).slice(2);
  const day = castTimeFormat(date.getDay() + 1);

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const formatTimeDifference = (date) => {
  let minutes = Math.round(date / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  return (`${hours}H ${minutes}M`);
};

export const formatTimeEvent = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours} : ${minutes}`;
};