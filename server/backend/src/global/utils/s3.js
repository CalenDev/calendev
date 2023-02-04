import AWS from '../config/awsConfig.js';
import AppError from './appError.js';

const s3 = new AWS.S3();
const { S3_BUCKET_NAME, S3_URL_EXPIRES } = process.env;

const getSignedUrl = async (presignedUrlReq) => {
  try {
    const objectParamsPreSign = {
      Bucket: S3_BUCKET_NAME,
      Key: presignedUrlReq.getFileName,
      Expires: Number(S3_URL_EXPIRES),
    };

    const presignedUrl = s3.getSignedUrl('putObject', objectParamsPreSign);
    return presignedUrl;
  } catch (error) {
    throw new AppError('Internal Server Error', 500, 'E500AG');
  }
};
export default { getSignedUrl };
