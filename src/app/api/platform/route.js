

/**
 * ============================================================================
 * FILE: src/app/api/platform/route.js
 * PURPOSE: Central REST API supporting 10-Day Contest Registration, Bulk 200-Q
 *          Uploads, Subject Weakness Analytics, and Shortcode Image Storage.
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

    // 2. Public Student Action: Register for 10-Day 200-MCQ National Exam
    if (action === "REGISTER_CONTEST") {
      const { contestId, studentKey, name, phone, institution } = payload;
      let contest = await BiWeeklyContest.findOne({ contestId: contestId || "bcs-biweekly-main" });
      if (!contest) {
        contest = await BiWeeklyContest.create({
          contestId: "bcs-biweekly-main",
          title: "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
          questions: [],
          registrations: [],
          submissions: [],
        });
      }

      const existingRegIndex = contest.registrations.findIndex(
        (r) => r.studentKey === studentKey || r.phone === phone
      );
      if (existingRegIndex === -1) {
        contest.registrations.push({ studentKey, name, phone, institution });
      } else {
        contest.registrations[existingRegIndex] = {
          studentKey,
          name,
          phone,
          institution,
          registeredAt: new Date(),
        };
      }
      await contest.save();
      return NextResponse.json({ success: true, data: contest });
    }

    // 3. Public Student Action: Submit 10-Day 200-MCQ Exam
    // Keeps student's Leaderboard rank active until their next exam submission!
    if (action === "SUBMIT_CONTEST_EXAM") {
      const { contestId, submission } = payload;
      const contest = await BiWeeklyContest.findOne({ contestId });
      if (!contest) {
        return NextResponse.json({ success: false, error: "পরীক্ষাটি পাওয়া যায়নি!" }, { status: 404 });
      }

      const alreadyTaken = contest.submissions.some(
        (sub) => sub.studentKey === submission.studentKey || (submission.phone && sub.phone === submission.phone)
      );
      if (alreadyTaken) {
        return NextResponse.json(
          {
            success: false,
            error: "আপনি ইতিমধ্যে এই পর্বের পরীক্ষায় অংশগ্রহণ করেছেন! পরবর্তী ১০ দিনের পরীক্ষার আগ পর্যন্ত আপনার এই পজিশনই লিডারবোর্ডে থাকবে।",
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

    // 4. Lecture Save / Delete
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

    // 5. Vocabulary Story Save / Delete
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

    // 6. Question Bank Document Save / Delete
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

    // 7. Save Chapter Test 1 & Test 2 (50 Questions)
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

    // 8. Publish / Update 10-Day 200-MCQ National Contest
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
        title: title || "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
        examWindowText: examWindowText || "প্রতি ১০ দিনে ১টি জাতীয় মেধা যাচাই পরীক্ষা (১০, ২০ ও ৩০ তারিখ)",
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