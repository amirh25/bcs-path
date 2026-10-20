import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Lecture, Question, Payment } from "@/models/PlatformModels";
import { initialLectures, initialQuestionBank } from "@/data/bcsData";

export async function GET() {
  try {
    await connectDB();

    let lectures = await Lecture.find().sort({ lectureNo: 1 });
    let questions = await Question.find().sort({ createdAt: -1 });
    const payments = await Payment.find().sort({ createdAt: -1 });

    // ডাটাবেস একদম নতুন হলে ডেমো লেকচার ও প্রশ্ন ব্যাংক অটোমেটিক সেভ হবে
    if (lectures.length === 0) {
      lectures = await Lecture.insertMany(initialLectures.map(({ id, ...rest }) => rest));
    }
    if (questions.length === 0) {
      questions = await Question.insertMany(initialQuestionBank.map(({ id, ...rest }) => rest));
    }

    return NextResponse.json({ success: true, lectures, questions, payments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, adminPin, payload } = body;

    if (action === "SUBMIT_PAYMENT") {
      const newPay = await Payment.create(payload);
      return NextResponse.json({ success: true, data: newPay });
    }

    const SECRET = process.env.ADMIN_SECRET_PIN || "bcs2026";
    if (adminPin !== SECRET) {
      return NextResponse.json({ success: false, error: "ভুল অ্যাডমিন পিন!" }, { status: 401 });
    }

    if (action === "SAVE_LECTURE") {
      if (payload._id) {
        const updated = await Lecture.findByIdAndUpdate(payload._id, payload, { new: true });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await Lecture.create(payload);
        return NextResponse.json({ success: true, data: created });
      }
    }

    if (action === "DELETE_LECTURE") {
      await Lecture.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    if (action === "ADD_QUESTION") {
      const createdQ = await Question.create(payload);
      return NextResponse.json({ success: true, data: createdQ });
    }

    if (action === "APPROVE_PAYMENT") {
      const sixMonthsLater = new Date();
      sixMonthsLater.setDate(sixMonthsLater.getDate() + 180);
      const updatedPay = await Payment.findByIdAndUpdate(
        payload.id,
        { status: "Approved", expiresAt: sixMonthsLater },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updatedPay });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}