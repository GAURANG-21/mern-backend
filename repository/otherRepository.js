import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../middlewares/sendEmail.js";
import { Stats } from "../models/Stats.js";

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

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

    const length = stats.length;
    const additionalLength = 12 - length;

    let statsData = [];
    for (let i = 0; i < length; i++) statsData.unshift(stats[i]);
    for (let i = 0; i < additionalLength; i++)
      statsData.unshift({
        views: 0,
        subscriptions: 0,
        users: 0,
        createdAt: new Date(Date.now()),
      });

    let usersCount = statsData[11].users;
    let subscriptionsCount = statsData[11].subscriptions;
    let viewsCount = statsData[11].views;
    let usersProfit = true;
    let subscriptionsProfit = true;
    let viewsProfit = true;
    let usersProfitPercentage = 0;
    let subscriptionsProfitPercentage = 0;
    let viewsProfitPercentage = 0;
    let usersDifference = 0;
    let subscriptionsDifference = 0;
    let viewsDifference = 0;

    if (statsData[10].users == 0) {
      usersProfitPercentage = usersCount * 100;
      usersDifference = undefined;
    }
    if (statsData[10].views == 0) {
      viewsProfitPercentage = viewsCount * 100;
      viewsDifference = undefined;
    }
    if (statsData[10].subscriptions == 0) {
      subscriptionsProfitPercentage = subscriptionsCount * 100;
      subscriptionsDifference = undefined;
    }

    if (usersDifference !== undefined) {
      usersDifference = usersCount - statsData[10].users;
      if (usersDifference < 0) usersProfit = false;
      usersProfitPercentage = (usersDifference / statsData[10].users) * 100;
    }
    if (subscriptionsDifference !== undefined) {
      subscriptionsDifference =
        subscriptionsCount - statsData[10].subscriptions;
      if (subscriptionsDifference < 0) subscriptionsProfit = false;
      subscriptionsProfitPercentage =
        (subscriptionsDifference / statsData[10].subscriptions) * 100;
    }
    if (viewsDifference !== undefined) {
      viewsDifference = viewsCount - statsData[10].views;
      if (viewsDifference < 0) viewsProfit = false;
      viewsProfitPercentage = (viewsDifference / statsData[10].views) * 100;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      stats: statsData,
      usersProfit,
      usersProfitPercentage,
      viewsProfit,
      viewsProfitPercentage,
      subscriptionsProfit,
      subscriptionsProfitPercentage,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Unable to get the stats",
      err: error,
    });
  }
};
