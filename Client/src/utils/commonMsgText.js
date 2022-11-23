/**
 * 공통적으로 사용하는 문구를 선언한 함수
 * @version 1.0.0
 * @author Dayeon Kim <dayeon-alert@gmail.com>
 * @param {number} code 공통 텍스트와 대응하는 코드값
 * @param {string} arg1 텍스트 중간에 삽입되는 문자열
 * @returns 공통 텍스트
 */
function commonMsgText(code, arg1) {
  const textScript = {
    0: '',
    100: '',
    110: `사용 가능한 ${arg1}입니다.`,
    101: `${arg1}을 입력해주세요.`,
    102: `${arg1}자 미만으로 입력해주세요.`,
    103: `${arg1}를 포함해서 입력해주세요.`,
    104: '중복 확인을 해주세요.',
    105: `사용 중인 ${arg1}입니다.`,
    106: '비밀번호를 8자 이상 입력해주세요.',
    107: '이메일 양식에 맞춰 입력하세요.',
    108: '특수문자는 다음 특수문자만 입력 가능합니다. (!, @, #, $, %, ^, &, *, ?, _, ~)',
    109: '비밀번호와 일치하지 않습니다.',
    111: '이용약관과 개인정보 수집 및 이용에 대한 안내 모두 동의해주세요.',
  };

  return textScript[code] === undefined ? '' : textScript[code];
}

export default commonMsgText;
