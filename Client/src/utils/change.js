function changeDefaultTimeFormat(date) {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }-${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()}`;
}

function changeUserRoleToGrade(roleCd) {
  switch (roleCd) {
    case 'RA':
      return '일반회원';
    case 'RB':
      return '인증회원';
    case 'RC':
      return '관리자';
    default:
      return '';
  }
}

export { changeDefaultTimeFormat, changeUserRoleToGrade };
