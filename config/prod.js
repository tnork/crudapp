// prod.js - production keys here!!
module.exports = {
  mongoURI: process.env.MONGO_URI,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  emailAddress: process.env.EMAIL_ADDRESS,
  secret: process.env.SECRET
};
