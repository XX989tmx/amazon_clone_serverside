const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const produtcsRoutes = require("./routes/produtcs-routes");
const usersRoutes = require("./routes/users-routes");
const sellersRoutes = require("./routes/sellers-routes");
const { ServerlessApplicationRepository } = require("aws-sdk");
const ordersRoutes = require("./routes/orders-routes");
const addressesRoutes = require("./routes/addresses-routes");


const app = express();
app.use(bodyParser.json());

app.use(express.static("public/images"));

app.use("/api/products", produtcsRoutes);
// =====products route=====
// /api/products/all  => productIndex
// /api/products/specificProduct/:product => specificproduct
// /api/products/productIndex/:category => productIndexcategoryIndex
// /api/products/createNewProduct => createNewProduct
// /api/products/newlyAddedRankingTop50/:category => newlyAddedRankingTop50
// /api/products/bestsellerRankingTop50/:category => bestsellerRankingTop50
// /api/products/wishlistRankingTop50/:category => wishlistRankingTop50
// /api/products/bargain/:category => bargain campaign products
// ========================

app.use("/api/orders",ordersRoutes);

app.use("/api/addresses",addressesRoutes)

app.use("/api/users", usersRoutes);

app.use("/api/sellers", sellersRoutes);

app.get("/", function (req, res) {
  res.json({ res: "this is home page" });
});
//routes
// frontend
// api/home
// api/productIndex/:category (カテゴリー単位が最大 index allはない 大カテゴリーがインデックスの最大単位でそこから小カテゴリをネスト的にインデックス.実際にProductをインデックスするのは小カテゴリからで、しかしその場合も、配列の先頭何個かにキャップをかけて部分表示。新着、注目、人気などのトピックごとに角度を変え表示。) スキーマはカテゴリごとに作っている可能性あり。
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
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-7slh6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
