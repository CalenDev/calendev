export default {
  /**
   *
   * @param {number} targetYear : 특정 년도 지정
   * @param {number} targetMonth : 특정 달을 지정 1 ~ 12 사이값 입력
   * @returns [특정년월 시작 dttm, 특정년월 끝나는 시간 dttm]
   */
  buildSingleMonthDttm: (targetYear, targetMonth) => {
    const startDate = 1;
    const endDate = new Date(targetYear, targetMonth, 0).getDate();

    const startDttm = `${targetYear}-${targetMonth}-${startDate} 00:00:00`;
    const endDttm = `${targetYear}-${targetMonth}-${endDate} 23:59:59`;

    return [startDttm, endDttm];
  },

  buildCurrentKSTDttm: () => {
    const currentDate = new Date();
    const utc = currentDate.getTime();

    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const currentDateKR = new Date(utc + KR_TIME_DIFF);
    const currentDayKR = currentDateKR.getDate();
    const currentMonthKR = currentDateKR.getMonth() + 1;
    const currentYearKR = currentDateKR.getFullYear();
    const currentHourKR = currentDateKR.getHours();
    const currentMinKR = currentDateKR.getMinutes();
    const currentSecKR = currentDateKR.getSeconds();

    return `${currentYearKR}-${currentMonthKR}-${currentDayKR} ${currentHourKR}:${currentMinKR}:${currentSecKR}`;
  },
  buildCurrentUTCDttm: () => {
    const currentDate = new Date();
    const utc = currentDate.getTime();
    const currentDayKR = currentDate.getDate();
    const currentMonthKR = currentDate.getMonth() + 1;
    const currentYearKR = currentDate.getFullYear();
    const currentHourKR = currentDate.getHours();
    const currentMinKR = currentDate.getMinutes();
    const currentSecKR = currentDate.getSeconds();

    return `${currentYearKR}-${currentMonthKR}-${currentDayKR} ${currentHourKR}:${currentMinKR}:${currentSecKR}`;
  },
};
