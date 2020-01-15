import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).format(`DD/MM/YYYY HH:mm`);
};

export const formatTimeEvent = (date) => {
  return moment(date).format(`HH : mm`);
};

export const findDateDifference = (startDate, endDate) => {
  const b = moment(startDate);
  const a = moment(endDate);

  const days = a.diff(b, `days`);
  b.add(days, `days`);

  const hours = a.diff(b, `hours`);
  b.add(hours, `hours`);

  const minutes = a.diff(b, `minutes`);

  return [days, hours, minutes];
};

export const formatDifference = (array) => {
  const [days, hours, minutes] = array;
  return (`${days ? `${days}D` : ``} ${hours ? `${hours}H` : ``} ${minutes ? `${minutes}M` : ``}`);
};

export const createDateDifference = (startDate, endDate) => {
  const difference = findDateDifference(startDate, endDate);
  return formatDifference(difference);
};

export const textCapitalize = (text) => {
  if (text) {
    return text[0].toUpperCase() + text.slice(1);
  }
  return ``;
};
