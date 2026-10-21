import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Lecture, Question, Payment, StudentProfile } from "@/models/PlatformModels";
import { initialLectures, initialQuestionBank } from "@/data/bcsData";

export async function GET() {
  try {
    await connectDB();

    let lectures = await Lecture.find().sort({ lectureNo: 1 });
    let questions = await Question.find().sort({ createdAt: -1 });
    const payments = await Payment.find().sort({ createdAt: -1 });

    if (lectures.length === 0) {
      lectures = await Lecture.insertMany(initialLectures.map(({ id, ...rest }) => rest));
    }
    if (questions.length === 0) {
      questions = await Question.insertMany(
        initialQuestionBank.map(({ id, ...rest }) => ({ ...rest, lectureNo: 1 }))
      );
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

    // স্টুডেন্ট পেমেন্ট সাবমিট
    if (action === "SUBMIT_PAYMENT") {
      const newPay = await Payment.create(payload);
      return NextResponse.json({ success: true, data: newPay });
    }

    // স্টুডেন্ট প্রোফাইল সেভ
    if (action === "SAVE_PROFILE") {
      const profile = await StudentProfile.findOneAndUpdate(
        { phone: payload.phone || "guest_student" },
        payload,
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, data: profile });
    }

    // অ্যাডমিন পিন ভেরিফিকেশন
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

    // এক ক্লিকে অসংখ্য MCQ প্রশ্ন আপলোড (Bulk Upload for Chapter Exam)
    if (action === "BULK_ADD_QUESTIONS") {
      const inserted = await Question.insertMany(payload.questions);
      return NextResponse.json({ success: true, count: inserted.length });
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