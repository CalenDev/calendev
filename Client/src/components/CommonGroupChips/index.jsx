import CommonSelectBox from '../CommonSelectBox';

export default function CommonGroupChips(props) {
  return (
    <CommonSelectBox
      limitTags={3}
      multiple
      {...props}
    />
  );
}
