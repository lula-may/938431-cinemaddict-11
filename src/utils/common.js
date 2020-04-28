import moment from "moment";

const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};

const formatReleaseDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

const formatRunTime = (duration) => {
  const runTime = moment.duration(duration, `minutes`);
  const hours = runTime.hours();
  const minutes = runTime.minutes();
  return `${hours}h ${minutes}m`;
};

const humanizeDate = (date) => {
  return moment(date).fromNow();
};

export {formatDate, formatReleaseDate, formatRunTime, humanizeDate};
