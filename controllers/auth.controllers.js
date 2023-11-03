const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET_KEY);
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json(userData);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
};