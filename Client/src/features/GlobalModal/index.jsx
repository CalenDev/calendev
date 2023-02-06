import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import commonModalText from '../../utils/commonModalText';
import { selectModal, closeModal } from './GlobalModalSlice';

function GlobalModal() {
  const { isOpen, modalCode } = useSelector(selectModal);
  const dispatch = useDispatch();
  if (!isOpen) return <div />;

  const handleClose = () => dispatch(closeModal());

  return (
    <Modal
      open
      onClose={handleClose}
      aria-labelledby="ModalTitle"
      aria-describedby="ModalDescription"
    >
      <StyledStack>
        <Typography id="ModalTitle" variant="h5" noWrap fontWeight="bold">
          {commonModalText(modalCode).title}
        </Typography>
        <Typography id="ModalDescription" variant="body">
          {commonModalText(modalCode).description}
        </Typography>
        <Stack className="ModalButtonWrapper" mt={2}>
          <Button variant="contained" size="small" onClick={handleClose}>
            <Typography variant="button">닫기</Typography>
          </Button>
        </Stack>
      </StyledStack>
    </Modal>
  );
}

const StyledStack = styled(Stack)`
  position: absolute;
  justify-content: space-between;
  gap: ${(props) => props.theme.spacing(2)};
  width: auto;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: ${(props) => props.theme.spacing(4)};
  border: 2px solid rgb(0, 0, 0, 0.23);

  & .ModalButtonWrapper {
    justify-content: flex-end;
    flex-direction: row;
  }
`;

export default GlobalModal;
