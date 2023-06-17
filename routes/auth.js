const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const {
  createUser,
  userLogin,
  revalidateToken,
} = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

router.post(
  "/new",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be grater then 6 characters").isLength({
      min: 6,
    }),
    validateFields,
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "Email must be correct").isEmail(),
    check("password", "Password must be greater then 6 characters").isLength({
      min: 6,
    }),
    validateFields,
  ],
  userLogin
);

router.get("/renew", validateJWT, revalidateToken);

module.exports = router;
