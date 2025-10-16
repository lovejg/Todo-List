const bcrypt = require("bcrypt");

// 비밀번호 암호화(단방향)
const hashPassword = async (password) => {
  const saltRounds = 10; // 암호화 강도. 높을수록 안전하지만 그만큼 느려짐(보통 10~12 정도로 한다고 함)
  return await bcrypt.hash(password, saltRounds);
};

// 비밀번호 검증(DB에 저장된 암호인 hashedPassword와 비교)
const comparePassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
