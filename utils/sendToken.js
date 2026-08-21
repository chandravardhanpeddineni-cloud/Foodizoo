const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {

  const token = user.getJWTToken();
  const isCrossSiteFrontend =
    process.env.FRONTEND_URL &&
    !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
      process.env.FRONTEND_URL,
    );

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: isCrossSiteFrontend ? "none" : "lax",
    secure: Boolean(isCrossSiteFrontend),
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

module.exports = sendToken;
