const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());
  return ` ${year}/${month}/${day} ${hours}:${minutes}`;
};
