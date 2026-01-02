import dotenv from 'dotenv';
dotenv.config();

export const MONGOURI = process.env.MONGOURI;
export const JWT_SECRET = process.env.JWT_SECRET;
