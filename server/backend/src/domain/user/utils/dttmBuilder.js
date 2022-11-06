export default () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const currentHour = currentDate.getHours();
  const currentMin = currentDate.getMinutes();
  const currentSec = currentDate.getSeconds();

  return `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMin}:${currentSec}`;
};
