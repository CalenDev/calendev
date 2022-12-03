import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

function CommonModal(props) {
  const { open, onClose, modalInfo } = props;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="ModalTitle"
      aria-describedby="ModalDescription"
    >
      <StyledStack>
        <Typography id="ModalTitle" variant="h5" noWrap fontWeight="bold">
          {modalInfo.modalTitle}
        </Typography>
        <Typography id="ModalDescription" variant="body">
          {modalInfo.modalDescription}
        </Typography>
        <Stack className="ModalButtonWrapper" mt={2}>
          <Button variant="contained" size="small" onClick={onClose}>
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

CommonModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalInfo: PropTypes.shape({
    modalTitle: PropTypes.string.isRequired,
    modalDescription: PropTypes.string.isRequired,
  }),
};

CommonModal.defaultProps = {
  modalInfo: {
    modalTitle: '',
    modalDescription: '',
  },
};

export default CommonModal;
