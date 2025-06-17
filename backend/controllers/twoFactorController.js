const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { findUserByEmail, updateUser } = require("../utils/fileDB");

// Simula autenticação por token (usando o email como identificador)
function getUserFromHeader(req) {
  const email = req.headers["x-user-email"]; // Simples para teste
  return findUserByEmail(email);
}

exports.setup2FA = async (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const secret = speakeasy.generateSecret({
    name: `MinhaApp (${user.email})`,
  });

  const qrCode = await qrcode.toDataURL(secret.otpauth_url);

  user.temp2FASecret = secret.base32;
  updateUser(user);

  res.json({ qrCode, secret: secret.base32 });
};

exports.verify2FA = (req, res) => {
  const { token } = req.body;
  const user = getUserFromHeader(req);
  if (!user || !user.temp2FASecret)
    return res.status(400).json({ error: "Usuário ou segredo ausente" });

  const verified = speakeasy.totp.verify({
    secret: user.temp2FASecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) return res.status(401).json({ error: "Código inválido" });

  user.twoFactorEnabled = true;
  user.twoFactorSecret = user.temp2FASecret;
  delete user.temp2FASecret;
  updateUser(user);

  res.json({ success: true });
};

exports.validate2FA = (req, res) => {
  const { token } = req.body;
  const user = getUserFromHeader(req);
  if (!user || !user.twoFactorEnabled)
    return res.status(401).json({ error: "2FA não ativado" });

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) return res.status(401).json({ error: "Código inválido" });

  res.json({ success: true, message: "2FA verificado com sucesso" });
};
