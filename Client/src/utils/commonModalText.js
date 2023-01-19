function commonModalText(code) {
  const textScript = {
    0: {
      title: '',
      description: '',
    },
    1: {
      title: '비 정상적인 접근',
      description: '올바르게 사이트를 이용해주세요.',
    },
    2: {
      title: '유효기간 만료',
      description: '비밀번호 링크를 재발급 받아주세요.',
    },
    3: {
      title: '로그인 만료',
      description : "다시 로그인 해주세요."
      
    }
  };

  return textScript[code] === undefined ? textScript[0] : textScript[code];
}

export default commonModalText;
