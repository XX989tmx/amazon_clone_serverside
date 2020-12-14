const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
class Mailer {
  orderComplete(
    name,
    toMail,
    totalPrice,
    totalCount,
    dateOrdered,
    usedAmazonPoint,
    addedAmazonPoint,
    items
  ) {
    let productTable = "";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const row = `<div><p>商品名:${item.productId.name}</p><p>価格:${item.productId.price}</p><p>点数:${item.quantity}</p></div>`;
      productTable += row;
    }
    const totalString = `<p>小計:${totalPrice}</p><p>注文合計:${totalPrice}</p>`;
    productTable += totalString;

    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
      to: toMail, // Change to your recipient
      from: process.env.FROM_MAIL, // Change to your verified sender
      subject: "注文完了のお知らせ",
      text: `ご注文手続きが完了致しました。`,
      html: `<div><h2>${name}様</h2><p>ご利用いただき誠にありがとうございます。以下の内容にて注文を承りました。</p><div><h3>注文の詳細</h3><p>合計点数：${totalCount}</p><p>小計:${totalPrice}</p><p>ポイントご利用額:${usedAmazonPoint}</p><p>注文合計:${totalPrice}</p><p>獲得ポイント:${addedAmazonPoint}</p><p>ご注文日時:${dateOrdered}</p></div><h3>ご注文商品一覧</h3><div>${productTable}</div></div>`,
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
