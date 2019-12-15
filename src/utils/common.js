import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).format(`DD/MM/YYYY HH:mm`);
};

export const formatTimeEvent = (date) => {
  return moment(date).format(`HH : mm`);
};

export const createDateDifference = (startDate, endDate) => {
  const b = moment(startDate);
  const a = moment(endDate);

  const days = a.diff(b, `days`);
  b.add(days, `days`);

  const hours = a.diff(b, `hours`);
  b.add(hours, `hours`);

  const minutes = a.diff(b, `minutes`);

  return (`${days ? `${days}D` : ``} ${hours ? `${hours}H` : ``} ${minutes ? `${minutes + 1}M` : ``}`);
};
