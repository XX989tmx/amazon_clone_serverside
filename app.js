const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

app.use(express.static("public/images"));

app.get("/", function (req, res) {
  res.json({ res: "this is home page" });
});

app.get("/products", function (req, res) {
  res.json({ res: "product page" });
});

//routes
// frontend
// api/home
// api/productIndex/:category (カテゴリー単位が最大 index allはない 大カテゴリーがインデックスの最大単位でそこから小カテゴリをネスト的にインデックス.実際にProductをインデックスするのは小カテゴリからで、しかしその場合も、配列の先頭何個かにキャップをかけて部分表示。新着、注目、人気などのトピックごとに角度を変え表示。)
// api/searchResult
// api/:productId (specific product page)
// api/cart
// api/account
// api/account/order-history
// api/buy
// api/order-complete
//

//backend
// api/products/
// api/users/
// api/admins/
// api/orders/
// api/account/
// api/wishlists/
// api/payments/
// api/search/

// app.use("api/products");
// app.use("api/users");
// app.use("api/admins");
// app.use("api/orders");
// app.use("api/accounts");
// app.use("api/wishlists");
// app.use("api/payments");
// app.use("api/search");

app.listen(8080);
