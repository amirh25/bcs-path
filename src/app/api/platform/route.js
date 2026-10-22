/**
 * ============================================================================
 * FILE: src/app/api/platform/route.js
 * PURPOSE: Central REST API for BCS Path & Defense/Police Foundation
 * NOTE FOR DEVELOPERS:
 *   - GET: Returns all lectures, qbankDocs, and questions from MongoDB Atlas.
 *   - POST: Handles profile updates and Admin PIN-protected CRUD operations.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Lecture, QuestionBankDoc, Question, StudentProfile } from "@/models/PlatformModels";

export async function GET() {
  try {
    await connectDB();

    const lectures = await Lecture.find().sort({ lectureNo: 1 });
    const qbankDocs = await QuestionBankDoc.find().sort({ createdAt: -1 });
    const questions = await Question.find().sort({ createdAt: -1 });
    const studentsCount = await StudentProfile.countDocuments();

    return NextResponse.json({
      success: true,
      lectures,
      qbankDocs,
      questions,
      studentsCount: studentsCount || 1,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, adminPin, payload } = body;

    // Public Student Action: Update Name & Profile
    if (action === "SAVE_PROFILE") {
      const profile = await StudentProfile.findOneAndUpdate(
        { phone: payload.phone || "student_default" },
        payload,
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, data: profile });
    }

    // Security Gate: Verify Admin PIN for all CMS actions
    const SECRET = process.env.ADMIN_SECRET_PIN || "bcs2026";
    if (adminPin !== SECRET) {
      return NextResponse.json({ success: false, error: "ভুল অ্যাডমিন পিন!" }, { status: 401 });
    }

    // Create or Update Lecture (BCS or Defense/Police)
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

    // Create or Update Question Bank Document (PDF + Text)
    if (action === "SAVE_QBANK_DOC") {
      if (payload._id) {
        const updated = await QuestionBankDoc.findByIdAndUpdate(payload._id, payload, { new: true });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await QuestionBankDoc.create(payload);
        return NextResponse.json({ success: true, data: created });
      }
    }

    if (action === "DELETE_QBANK_DOC") {
      await QuestionBankDoc.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Add Single MCQ Question (BCS or Defense Topic Test)
    if (action === "ADD_QUESTION") {
      const createdQ = await Question.create(payload);
      return NextResponse.json({ success: true, data: createdQ });
    }

    // Bulk Upload MCQ Questions via JSON
    if (action === "BULK_ADD_QUESTIONS") {
      const inserted = await Question.insertMany(payload.questions);
      return NextResponse.json({ success: true, count: inserted.length });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}