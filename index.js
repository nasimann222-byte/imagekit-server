import express from "express";
import crypto from "crypto";

const app = express();

// ImageKit keys (environment variables)
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

if (!PRIVATE_KEY || !PUBLIC_KEY) {
  console.error("Please set PRIVATE_KEY and PUBLIC_KEY environment variables.");
  process.exit(1);
}

// Generate upload token endpoint
app.get("/generate-upload-token", (req, res) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");
    const expire = Math.floor(Date.now() / 1000) + 600; // 10 মিনিট পরে expiry
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
  } catch (err) {
    console.error("Error generating signature:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Render এ PORT ব্যবহার
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

