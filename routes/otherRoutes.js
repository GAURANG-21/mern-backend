import express from "express";
import { contact, requestCourse } from "../repository/otherRepository.js";

const router = express.Router();

// Contact form
router.route("/contact").post(contact);

//Request form
router.route("/courseRequest").post(requestCourse);

export default router;
