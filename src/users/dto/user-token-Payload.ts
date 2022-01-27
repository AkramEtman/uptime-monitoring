import mongoose from 'mongoose';

export interface ITokenPayload {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  notification: string;
  iat?: number;
  exp?: number;
}