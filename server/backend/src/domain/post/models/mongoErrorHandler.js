import mongoose from 'mongoose';
import AppError from '../../../global/utils/appError.js';

export default function handleError(mongoError) {
  // catch err for validation
  if (mongoError instanceof mongoose.Error.ValidationError) {
    throw new AppError('Validtaion Error', 400, 'E400AG');
  } else if (
    mongoError instanceof mongoose.Error.MongooseServerSelectionError
  ) {
    throw new AppError('Internal Server Error', 500, 'E500AC');
  }
}
