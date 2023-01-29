const commonEventPropGetter = (event) => {
  const { eventType } = event.resource;

  switch (eventType) {
    case 'AAA':
      return { style: { backgroundColor: '#E57373' } };
    case 'AAB':
      return { style: { backgroundColor: '#00ACC1' } };
    case 'AAC':
      return { style: { backgroundColor: '#80DEEA' } };
    case 'AAD':
      return { style: { backgroundColor: '#90A4AE' } };
    case 'AAE':
      return { style: { backgroundColor: '#80CBC4' } };
    case 'AAF':
      return { style: { backgroundColor: '#E57373' } };
    case 'AAG':
      return { style: { backgroundColor: '#00ACC1' } };
    case 'AAH':
      return { style: { backgroundColor: '#80DEEA' } };
    case 'AAI':
      return { style: { backgroundColor: '#90A4AE' } };
    case 'AAJ':
      return { style: { backgroundColor: '#80CBC4' } };
    case 'AAK':
      return { style: { backgroundColor: '#90A4AE' } };
    case 'AAL':
      return { style: { backgroundColor: '#80CBC4' } };
    default:
      return { styled: { backgroundColor: '#000' } };
  }
};

export default commonEventPropGetter;
