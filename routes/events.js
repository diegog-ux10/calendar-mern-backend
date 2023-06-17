const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");
const { isDate } = require("../helpers/isDate");

const router = Router();

router.use(validateJWT);

router.get("/", getEvents);

router.post(
  "/",
  [
    check("title", "The title is required").not().isEmpty(),
    check("start", "Start Date is required").custom(isDate),
    validateFields,
  ],
  createEvent
);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
