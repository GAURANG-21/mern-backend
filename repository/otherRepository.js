import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../middlewares/sendEmail.js";

export const contact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please fill name, email and message!" });
  }

  const to = process.env.MY_EMAIL;
  const subject = "Contact the courseUp creator";
  const text = `I am ${name} and my email is ${email}\n${message}`;
  await sendEmail(to, subject, text);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Email sent successfully",
  });
};

export const requestCourse = async (req, res) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course) {
    return res
      .status(400)
      .json({ error: "Please fill name, email and the course to request!" });
  }

  const to = process.env.MY_EMAIL;
  const subject = "Contact the courseUp creator";
  const text = `I am ${name} and my email is ${email}.\nI am requesting you for the course : ${course}`;
  await sendEmail(to, subject, text);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Request for the course has been sent successfully",
  });
};
