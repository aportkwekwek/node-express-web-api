import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1h", // Token expiration time
    }
  );

  return token;
};

export default generateToken;
