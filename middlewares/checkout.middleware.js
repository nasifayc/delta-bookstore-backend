import axios from "axios";

export const initializeChapaTransaction = async (req, res, next) => {
  try {
    const options = {
      method: "POST",
      url: "https://api.chapa.co/v1/transaction/initialize",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        amount: "10",
        currency: "ETB",
        email: "nasifayc11@gmail.com",
        first_name: "Nasifay",
        last_name: "Chala",
        phone_number: "0900624702",
        tx_ref: "chewatatest-6669",
        callback_url:
          "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
        return_url: "https://www.google.com/",
        customization: {
          title: "Emergency",
          description: "I love online payments",
        },
        meta: {
          hide_receipt: "true",
        },
      },
    };

    const response = await axios(options);
    req.transactionData = response.data; // Pass the response data to the next middleware
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

// import axios from "axios";

// export const initializeChapaTransaction = async (req, res, next) => {
//   try {
//     const { amount, email, first_name, last_name, phone_number, tx_ref } = req.body;

//     const options = {
//       method: "POST",
//       url: "https://api.chapa.co/v1/transaction/initialize",
//       headers: {
//         Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       data: {
//         amount,
//         currency: "ETB",
//         email,
//         first_name,
//         last_name,
//         phone_number,
//         tx_ref,
//         callback_url: "https://webhook.site/your-callback-url",
//         return_url: "https://www.google.com/",
//         customization: {
//           title: "Payment for my favourite merchant",
//           description: "I love online payments",
//         },
//         meta: {
//           hide_receipt: "true",
//         },
//       },
//     };

//     const response = await axios(options);
//     req.transactionData = response.data; // Attach the Chapa response to the request object
//     next();
//   } catch (error) {
//     console.error("Chapa Initialization Error:", error);
//     res.status(500).json({ error: "Transaction initialization failed." });
//   }
// };