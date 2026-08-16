const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// عرض ملفات الواجهة
app.use(express.static(__dirname));

const FILE = path.join(__dirname, "feedback.json");

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// استقبال التقييمات
app.post("/feedback", (req, res) => {
  try {
    const { name, phone, service, comment, rating } = req.body;

    // الاسم والتقييم فقط مطلوبان
    if (!name || !rating) {
      return res.status(400).json({
        message: "يرجى تعبئة الاسم والتقييم"
      });
    }

    let feedbacks = [];

    // قراءة التقييمات السابقة
    if (fs.existsSync(FILE)) {
      const data = fs.readFileSync(FILE, "utf8");

      if (data.trim()) {
        feedbacks = JSON.parse(data);
      }
    }

    // إضافة التقييم الجديد
    const newFeedback = {
      id: Date.now(),
      name,
      phone: phone || "",
      service: service || "",
      comment: comment || "",
      rating: Number(rating),
      date: new Date().toLocaleDateString("ar-SA")
    };

    feedbacks.push(newFeedback);

    // حفظ التقييمات
    fs.writeFileSync(
      FILE,
      JSON.stringify(feedbacks, null, 2),
      "utf8"
    );

    res.status(200).json({
      message: "تم إرسال تقييمك بنجاح 💜"
    });

  } catch (error) {
    console.error("Feedback Error:", error);

    res.status(500).json({
      message: "حدث خطأ في السيرفر"
    });
  }
});

// عرض جميع التقييمات
app.get("/feedback", (req, res) => {
  try {
    if (fs.existsSync(FILE)) {
      const data = fs.readFileSync(FILE, "utf8");

      if (data.trim()) {
        return res.json(JSON.parse(data));
      }
    }

    res.json([]);

  } catch (error) {
    console.error("Read Error:", error);

    res.status(500).json({
      message: "حدث خطأ أثناء قراءة التقييمات"
    });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});