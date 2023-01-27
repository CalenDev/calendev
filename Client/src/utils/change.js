export default function changeDefaultTimeFormat(date) {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}`;
}
