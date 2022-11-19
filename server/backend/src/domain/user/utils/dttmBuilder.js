export default () => {
  const currentDate = new Date();
  const utc =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;

  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const currentDateKR = new Date(utc + KR_TIME_DIFF);

  const currentDayKR = currentDateKR.getDate();
  const currentMonthKR = currentDateKR.getMonth() + 1;
  const currentYearKR = currentDateKR.getFullYear();
  const currentHourKR = currentDateKR.getHours();
  const currentMinKR = currentDateKR.getMinutes();
  const currentSecKR = currentDateKR.getSeconds();

  return `${currentYearKR}-${currentMonthKR}-${currentDayKR} ${currentHourKR}:${currentMinKR}:${currentSecKR}`;
};
