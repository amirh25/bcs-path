/**
 * ============================================================================
 * FILE: src/app/api/platform/route.js
 * PURPOSE: REST API for Lectures, Vocab Stories, Exam Sets, and 10-Day 200-MCQ Exam
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
  Lecture,
  VocabStory,
  QuestionBankDoc,
  ExamSet,
  BiWeeklyContest,
  StudentProfile,
} from "@/models/PlatformModels";

export async function GET() {
  try {
    await connectDB();

    const lectures = await Lecture.find().sort({ lectureNo: 1 });
    const vocabStories = await VocabStory.find().sort({ storyNo: 1 });
    const qbankDocs = await QuestionBankDoc.find().sort({ createdAt: -1 });
    const examSets = await ExamSet.find().sort({ lectureNo: 1, testNumber: 1 });
    const contests = await BiWeeklyContest.find().sort({ createdAt: -1 });
    const studentsCount = await StudentProfile.countDocuments();

    return NextResponse.json({
      success: true,
      lectures,
      vocabStories,
      qbankDocs,
      examSets,
      contests,
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

    // 1. Public Student Action: Save Profile
    if (action === "SAVE_PROFILE") {
      const profile = await StudentProfile.findOneAndUpdate(
        { phone: payload.phone || "student_default" },
        payload,
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, data: profile });
    }

    // 2. Public Student Action: Register for 10-Day 200-MCQ National Exam (Phone, Name, Institution)
    if (action === "REGISTER_CONTEST_EXAM") {
      const { contestId, studentKey, phone, name, institution } = payload;
      let contest = await BiWeeklyContest.findOne({ contestId: contestId || "bcs-biweekly-main" });

      if (!contest) {
        contest = await BiWeeklyContest.create({
          contestId: contestId || "bcs-biweekly-main",
          title: "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
          questions: [],
          registrations: [{ studentKey, phone, name, institution }],
          submissions: [],
        });
      } else {
        const existingIdx = contest.registrations.findIndex(
          (r) => r.studentKey === studentKey || r.phone === phone
        );
        if (existingIdx > -1) {
          contest.registrations[existingIdx] = { studentKey, phone, name, institution, registeredAt: new Date() };
        } else {
          contest.registrations.push({ studentKey, phone, name, institution });
        }
        await contest.save();
      }
      return NextResponse.json({ success: true, data: contest });
    }

    // 3. Public Student Action: Submit 10-Day 200-MCQ National BCS Exam (One attempt per cycle)
    if (action === "SUBMIT_CONTEST_EXAM") {
      const { contestId, submission } = payload;
      const contest = await BiWeeklyContest.findOne({ contestId });
      if (!contest) {
        return NextResponse.json({ success: false, error: "পরীক্ষাটি পাওয়া যায়নি!" }, { status: 404 });
      }

      const alreadyTaken = contest.submissions.some(
        (sub) =>
          sub.studentKey === submission.studentKey ||
          (submission.phone && sub.phone === submission.phone)
      );
      if (alreadyTaken) {
        return NextResponse.json(
          {
            success: false,
            error: "আপনি ইতিমধ্যে এই ১০ দিনের পর্বের পরীক্ষায় অংশগ্রহণ করেছেন! পরবর্তী পরীক্ষার আগে পুনরায় দেওয়া যাবে না।",
          },
          { status: 400 }
        );
      }

      contest.submissions.push(submission);
      await contest.save();
      return NextResponse.json({ success: true, data: contest });
    }

    // ================= ADMIN PIN VERIFICATION =================
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

    if (action === "SAVE_VOCAB_STORY") {
      if (payload._id) {
        const updated = await VocabStory.findByIdAndUpdate(payload._id, payload, { new: true });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await VocabStory.create(payload);
        return NextResponse.json({ success: true, data: created });
      }
    }

    if (action === "DELETE_VOCAB_STORY") {
      await VocabStory.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

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

    if (action === "SAVE_EXAM_SET") {
      const { courseType, subjectId, lectureNo, testNumber, chapterName, title, questions } = payload;
      const validQuestions = (questions || []).filter((q) => q.question && q.question.trim() !== "");

      if (validQuestions.length === 0) {
        return NextResponse.json(
          { success: false, error: "কমপক্ষে ১টি প্রশ্ন পূরণ করে Publish করুন!" },
          { status: 400 }
        );
      }

      const savedSet = await ExamSet.findOneAndUpdate(
        {
          courseType: courseType || "bcs",
          subjectId,
          lectureNo: Number(lectureNo),
          testNumber: Number(testNumber),
        },
        {
          courseType: courseType || "bcs",
          subjectId,
          lectureNo: Number(lectureNo),
          chapterName,
          testNumber: Number(testNumber),
          title: title || `Test ${testNumber}`,
          questions: validQuestions,
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ success: true, data: savedSet });
    }

    if (action === "DELETE_EXAM_SET") {
      await ExamSet.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Publish / Update 10-Day 200-MCQ National Contest Exam
    // Keeps existing leaderboard intact UNLESS Admin checks resetSubmissions for a new 10-day cycle!
    if (action === "SAVE_BIWEEKLY_CONTEST") {
      const { contestId, title, examWindowText, questions, resetSubmissions } = payload;
      const validQuestions = (questions || []).filter((q) => q.question && q.question.trim() !== "");

      if (validQuestions.length === 0) {
        return NextResponse.json(
          { success: false, error: "কমপক্ষে ১টি প্রশ্ন পূরণ করে ২০০ প্রশ্নের পরীক্ষাটি Publish করুন!" },
          { status: 400 }
        );
      }

      const updateData = {
        contestId: contestId || "bcs-biweekly-main",
        title: title || "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড প্রিলিমিনারি পরীক্ষা (২০০ নম্বর)",
        examWindowText: examWindowText || "প্রতি ১০ দিনে ১টি জাতীয় মেধা যাচাই পরীক্ষা (১০, ২০ ও মাসের শেষ তারিখ)",
        isActive: true,
        questions: validQuestions,
      };

      if (resetSubmissions) {
        updateData.submissions = [];
        updateData.registrations = [];
      }

      const savedContest = await BiWeeklyContest.findOneAndUpdate(
        { contestId: updateData.contestId },
        updateData,
        { upsert: true, new: true }
      );

      return NextResponse.json({ success: true, data: savedContest });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}