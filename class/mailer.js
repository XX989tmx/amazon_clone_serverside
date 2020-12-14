const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
class Mailer {
  orderComplete(name, toMail, totalPrice) {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
      to: toMail, // Change to your recipient
      from: process.env.FROM_MAIL, // Change to your verified sender
      subject: "注文完了のお知らせ",
      text: `ご注文手続きが完了致しました。`,
      html: `<div><h2>${name}様</h2><p>ご利用いただき誠にありがとうございます。以下の内容にて注文を承りました。</p><div><p>注文の詳細</p><p>注文合計:${totalPrice}</p></div></div>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

exports.Mailer = Mailer;
