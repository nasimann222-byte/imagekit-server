import express from "express";
import crypto from "crypto";

const app = express();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

app.get("/generate-upload-token", (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  const expire = Math.floor(Date.now() / 1000) + 600; // 10 মিনিট
  const signatureString = `token=${token}&expire=${expire}`;
  const hmac = crypto.createHmac("sha1", PRIVATE_KEY);
  hmac.update(signatureString);
  const signature = hmac.digest("hex");

  res.json({
    publicKey: PUBLIC_KEY,
    token,
    expire,
    signature
  });
});

app.listen(3000, () => console.log("✅ Server running on Render"));
