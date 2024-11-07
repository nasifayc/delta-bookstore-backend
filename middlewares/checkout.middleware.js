import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const generateTxRef = () => `chewatatest-${uuidv4()}`;

export const initializeChapaTransaction = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const { email, username, phone_number } = req.user;
    const options = {
      method: "POST",
      url: "https://api.chapa.co/v1/transaction/initialize",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        amount,
        currency: "ETB",
        email,
        username,
        last_name: "",
        phone_number,
        tx_ref: generateTxRef(),
        callback_url:
          "https://webhook.site/077164d6-29cb-40df-ba29-802a00e59a7e60",
        return_url: "https://www.google.com/",
        customization: {
          title: "Purchase Book",
          description: "I love online payments",
        },
        meta: {
          hide_receipt: "true",
        },
      },
    };

    const response = await axios(options);
    req.transactionData = response.data.data.checkout_url;
    next();
  } catch (error) {
    console.error(
      "Chapa Initialization Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Transaction initialization failed.",
      details: error.response ? error.response.data : "Unknown error",
    });
  }
};
