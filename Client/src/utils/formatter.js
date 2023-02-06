function dttmFormatter(time = '') {
  const curTime = time.length > 0 ? new Date(time) : new Date();
  curTime.setHours(curTime.getHours() + 9);
  return curTime.toISOString().replace('T', ' ').substring(0, 19);
}

export default dttmFormatter;
