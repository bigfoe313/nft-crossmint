import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve frontend

// Create NFT order endpoint
app.post("/create-nft-order", async (req, res) => {
  try {
    const { recipient } = req.body;

    const response = await fetch("https://staging.crossmint.com/api/2022-06-09/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.CROSSMINT_API_KEY
      },
      body: JSON.stringify({
        recipient,
        payment: { type: "erc20", token: process.env.ERC20_TOKEN_ADDRESS },
        lineItems: [{ quantity: 1, collectionId: process.env.CROSSMINT_COLLECTION_ID }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create NFT order" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
