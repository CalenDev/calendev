import AWS from 'aws-sdk';
import AppError from '../utils/appError.js';

// AWS Configuration user
const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;

try {
  AWS.config.update({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
  });
} catch (error) {
  throw new AppError('Internal Server Error', 500, 'AWS USER CONFIG FAIL');
}

export default AWS;
