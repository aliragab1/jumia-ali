const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      lowercase: true,
      unique: true,
      lowercase: true,
    },
    profileImg: String,
    password: {
      type: String,
      required: [true, "password required"],
      minLingth: [6, "too short password"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};
// findOne, findAll and update
userSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
userSchema.post("save", (doc) => {
  setImageURL(doc);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
