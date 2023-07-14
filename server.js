// Handling programming errors for express
process.on("uncaughtException", (err) => {
  console.log("uncaughtException: ", err);
});

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/globalMiddlewareErr");
const dbConnection = require("./config/database");
const compression = require("compression");

const cors = require("cors");

// Routes
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");

// Connect with db
dbConnection();

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
// Middlewares
app.use(express.json());
// app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static("uploads"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/team2/products", productRoute);
app.use("/api/team2/subcategories", subCategoryRoute);
app.use("/api/team2/brands", brandRoute);
app.use("/api/team2/categories", categoryRoute);
app.use("/api/team2/users", userRoute);
app.use("/api/team2/auth", authRoute);
app.use("/api/team2/reviews", reviewRoute);
app.use("/api/team2/cart", cartRoute);
app.use("/api/team2/orders", orderRoute);

app.all("*", (req, res, next) => {
  // res.json({ msg: `Can't find this route: ${req.originalUrl}` });
  // const err = new Error(`Can't find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global error handling middleware for express
app.use(globalError);

// app.use((err, req, res, next) => {
//   res.status(400).json({ err, sta: "kjhhjk" });
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handling programming errors for others (Ex. database if catch doesn't exist)
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection: ", err);
});
