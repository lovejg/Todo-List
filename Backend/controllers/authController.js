const { User, User } = require("../models");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

// 회원가입
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    const hashed = await hashPassword(password); // 비밀번호 암호화

    // 유저 생성
    const newUser = await User.create({
      email,
      password: hashed,
      name,
    });

    // JWT 발급
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({
      message: "회원가입 완료",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("회원가입 오류: ", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일 확인
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    // 비밀번호 확인
    const isRight = await comparePassword(password, user.password);
    if (!isRight) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // JWT 발급
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: "로그인 성공",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

module.exports = { register, login };
