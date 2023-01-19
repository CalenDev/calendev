import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { CommonPaper, CommonStack } from '../../components';

function NotifyEmail() {
  const navigate = useNavigate();

  const handleGoMain = () => {
    navigate('/', { replace: true });
  };

  return (
    <CommonPaper className="notifyemail">
      <CommonStack alignItems="center" spacing={1}>
        <h1>이메일 인증</h1>
        <p>인증메일이 bbq@naver.com (으)로 전송되었습니다.</p>
        <p>받으신 이메일을 열어 버튼을 클릭하면 가입이 완료됩니다.</p>
        <h5>이메일을 확인할수 없나요?</h5>
        <h5>스팸편지함 확인 또는 인증 메일 다시 보내기</h5>
        <Button variant="outlined" onClick={handleGoMain}>확인</Button>
      </CommonStack>
    </CommonPaper>
  );
}

export default NotifyEmail;
