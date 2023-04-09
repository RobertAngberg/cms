import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Post from "./schemas/postSchema.js";
import User from "./schemas/userSchema.js";
import multer from "multer";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

const uploadMiddleware = multer({ dest: "uploads/" });
const app = express();
dotenv.config();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
const salt = bcrypt.genSaltSync(10);
const secret = "hjkjklkjhbgvfcvfbgnjkij";

// app.use(
//   cors({
//     origin:
//       "https://64316c9cdb504a283736d6de--ephemeral-kulfi-b48b50.netlify.app/",
//   })
// );
// app.options("*", cors());

app.use(cors());

const whitelist = [
  "http://localhost:3000",
  "https://ephemeral-kulfi-b48b50.netlify.app/",
];

// ✅ Enable pre-flight requests
app.options("*", cors());

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

/* ---------- Regga användare ---------- */

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

/* ---------- Inlogg ---------- */

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Inloggningsuppgifterna är fel");
  }
});

/* ---------- Kolla om inloggad (från Header.js) ---------- */

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

/* ---------- Logga ut, rensa token ---------- */

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

/* ---------- Ny post ---------- */

import path from "path";
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/");
    },

    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),

  limits: { fileSize: 10000000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Fel: bilder endast.");
    }
  },
});

app.post(
  "/add",
  upload.fields([
    { name: "mainImage" },
    // Får inte till att kunna ladda upp array, gör såhär istället...
    { name: "galleryImage1" },
    { name: "galleryImage2" },
    { name: "galleryImage3" },
  ]),
  (req, res) => {
    console.log("asdf");
    const { token } = req.cookies;

    // Fortsätt bara om auth stämmer
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      // Req.body är ett object
      // Deconstructa så man kan använda alla properties och lägga in i db
      // Lägga in req.body direkt funkar inte
      const { title, price, description, slug, categories } = req.body;

      if (req.files["galleryImage1"] === undefined) {
      }
      if (req.files["galleryImage2"] === undefined) {
        req.files["galleryImage2"] = "asdf";
      }
      if (req.files["galleryImage3"] === undefined) {
        req.files["galleryImage3"] = "asdf";
      }

      const newProductDocument = new Post({
        title: title,
        mainImage: req.files["mainImage"][0].filename,
        galleryImage1: req.files["galleryImage1"][0].filename,
        galleryImage2: req.files["galleryImage2"][0].filename,
        galleryImage3: req.files["galleryImage3"][0].filename,
        price: price,
        description: description,
        slug: slug,
        categories: categories,
        author: info.id,
      });
      res.json(newProductDocument);
      newProductDocument.save((error, newProductDocument) => {
        if (error) return console.error(error);
        console.log(`${newProductDocument.title} sparad!`);
      });
    });
  }
);

/* ---------- Uppdatera post ---------- */

app.put("/post", uploadMiddleware.single("galleryImages"), async (req, res) => {
  if (req.file) {
    fs.renameSync(req.file.path, "uploads/" + req.file.originalname);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, tokenInfo) => {
    if (err) throw err;

    // Deconstructa request så man kan använda alla uppdaterade värden
    const { _id, title, price, description, slug } = req.body;

    // Leta rätt document i db, använd _id, spara som postData
    const postData = await Post.findById(req.body._id);

    // Auth: kolla att postData.author stämmer med token id
    const isAuthor =
      JSON.stringify(postData.author) === JSON.stringify(tokenInfo.id);
    if (!isAuthor) {
      return res.status(400).json("Du är inte author till produkten/artikeln");
    }

    // Om fil är uppladdad, ta med den, annars skippa
    if (req.file) {
      await postData.updateOne({
        _id,
        mainImage: req.file.originalname,
        title,
        price,
        description,
        slug,
      });
    } else {
      await postData.updateOne({
        _id,
        title,
        price,
        description,
        slug,
      });
    }

    res.json(postData);
  });
});

/* ---------- Hitta posts, max 20 ---------- */

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

/* ---------- Visa single post ---------- */

app.get("/post/:slug", async (req, res) => {
  const slug = req.params.slug;
  const postData = await Post.find({ slug: slug }).populate("author", [
    "username",
  ]);
  res.json(postData);
});

/* ---------- DB connect ---------- */

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO);

/* ---------- Lyssna ---------- */

app.listen(5000);
