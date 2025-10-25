const { verifyToken } = require("../utils/jwt");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Authorization 헤더에서 토큰 가져오기

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "인증 토큰이 없습니다." });
    }

    const token = authHeader.split(" ")[1]; // 실제 토큰 값만 추출

    const decoded = verifyToken(token); // 토큰 검증(유효성 + 만료여부) + user.id 추출

    if (!decoded) {
      return res.status(401).json({ error: "유효하지 않은 사용자입니다." });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "유효하지 않은 사용자입니다." });
    }

    req.user = user;
    next(); // 미들웨어 체이닝을 사용하기 때문에(todos.js에서 router 부분 참고) next()가 반드시 필요
  } catch (error) {
    return res
      .status(401)
      .json({ error: "인증에 실패했습니다. 다시 로그인해주세요." });
  }
};

module.exports = authMiddleware;
