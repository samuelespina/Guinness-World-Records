const { Router } = require("express");
const authControlls = require("../controllers/routesControllers");

const router = Router();

router.post("/signup", authControlls.signup);

router.post("/login", authControlls.login);

router.post("/forgot-password", authControlls.forgotPassword);

router.post("/recovery-password", authControlls.recoveryPassword);

router.post("/reset-password", authControlls.resetPassword);

router.get("/get-programming-languages", authControlls.getProgrammingLanguages);

router.get("/get-usages", authControlls.getUsages);

router.post("/get-description", authControlls.getDescription);

router.post("/get-related-languages", authControlls.getRelatedLanguages);

router.post("/get-statistics", authControlls.getStatistics);

module.exports = router;
