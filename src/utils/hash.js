import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = async (plain) => {
  return await bcrypt.hash(plain, parseInt(process.env.BCRYPT_SALT_ROUNDS));
};

export const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};
