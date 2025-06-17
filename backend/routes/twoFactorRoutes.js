const express = require("express");
const router = express.Router();
const controller = require("../controllers/twoFactorController");

router.post("/2fa/setup", controller.setup2FA);
router.post("/2fa/verify", controller.verify2FA);
router.post("/2fa/validate", controller.validate2FA);

module.exports = router;
