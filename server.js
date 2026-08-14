 const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});
app.get("/staff", (req, res) => {
    res.sendFile(__dirname + "/staff.html");
});
app.get("/all-feedback", (req, res) => {

    let feedbacks = [];

    if (fs.existsSync("feedback.json")) {
        feedbacks = JSON.parse(
            fs.readFileSync("feedback.json")
        );
    }

    res.json(feedbacks);

});

app.post("/feedback", (req, res) => {

    console.log("وصل تقييم جديد:", req.body);

    const { name, phone, comment, rating } = req.body;

    if (!name || !comment) {
        return res.status(400).json({
            message: "البيانات ناقصة"
        });
    }

    let feedbacks = [];

    if (fs.existsSync("feedback.json")) {
        feedbacks = JSON.parse(
            fs.readFileSync("feedback.json")
        );
    }

    feedbacks.push({
        name,
        phone,
        comment,
        rating,
        date: new Date()
    });

    fs.writeFileSync(
        "feedback.json",
        JSON.stringify(feedbacks, null, 2)
    );

    res.json({
        message: "تم إرسال تقييمك بنجاح 💜"
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`💜 نظام تقييم صالون لمسة نونه يعمل على المنفذ ${PORT}`);
})