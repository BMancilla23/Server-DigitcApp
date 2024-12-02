import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

const generateRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, SECRET_KEY, { expiresIn: "1d" });
};

export default generateRefreshToken;
