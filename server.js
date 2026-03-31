const express = require("express");
const sendEmail = require("./emailService");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/book-test", async (req, res) => {
  const { name, email } = req.body;

  await sendEmail(
    email,
    "Test Email 🚀",
    `<h2>Hello ${name}, your system is working!</h2>`
  );

  res.send("Email sent successfully");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});