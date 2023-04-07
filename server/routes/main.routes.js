const { Router } = require("express");

const Auth = require("../controllers/auth.controller");
const Main = require("../controllers/main.controller");

const router = Router();

router.post("/login", Auth.login);
router.get("/check-login/:token", Auth.checkLogin);

router.get("/get-rooms", Main.getRooms);
router.get("/get-reserve/:id", Main.getReserve);

router.post("/reserve", Main.addReserve);
router.post("/cancel-reserve", Main.cancelReserve);

module.exports = router;
