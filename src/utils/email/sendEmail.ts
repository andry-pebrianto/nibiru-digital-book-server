import { google } from "googleapis";
import nodemailer from "nodemailer";
import Env from "../variables/Env";
import { handleLog } from "../winston/logger";

// oauth2 config
const oAuth2Client = new google.auth.OAuth2(
  Env.GOOGLE_CLIENT_ID,
  Env.GOOGLE_CLIENT_SECRET,
  Env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: Env.GMAIL_REFRESH_TOKEN });

export const sendEmail = async (emailOptions: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    // config nodemailer
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: Env.EMAIL_USER,
        clientId: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET,
        refreshToken: Env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token || "",
      },
    });

    // send email
    transporter
      .sendMail(emailOptions)
      .then((info) => {
        console.log("Email sended successfully.");
        console.log(info);
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.log(error.message);
          handleLog(error.message, "NO USER");
        }

        process.exit(1);
      });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      handleLog(error.message, "NO USER");
    }

    process.exit(1);
  }
};
