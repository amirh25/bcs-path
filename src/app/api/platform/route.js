/**
 * ============================================================================
 * FILE: src/app/api/platform/route.js
 * PURPOSE: REST API for Lectures, Vocab Stories, Exam Sets, Weekly Live Exam,
 *          Job Update News ("চাকরির আপডেট খবর") & Bonus Content ("Bonus")
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
  JobUpdateNews,
  BonusItem,
} from "@/models/PlatformModels";

export async function GET() {
  try {
    await connectDB();

    const lectures = await Lecture.find().sort({ lectureNo: 1 });
    const vocabStories = await VocabStory.find().sort({ storyNo: 1 });
    const qbankDocs = await QuestionBankDoc.find().sort({ createdAt: -1 });
    const examSets = await ExamSet.find().sort({ lectureNo: 1, testNumber: 1 });
    const contests = await BiWeeklyContest.find().sort({ createdAt: -1 });
    const jobUpdates = await JobUpdateNews.find().sort({ createdAt: -1 });
    const bonusItems = await BonusItem.find().sort({ createdAt: -1 });
    const studentsCount = await StudentProfile.countDocuments();

    return NextResponse.json({
      success: true,
      lectures,
      vocabStories,
      qbankDocs,
      examSets,
      contests,
      jobUpdates,
      bonusItems,
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

    // 1. Public Student Action: Save Profile & Sync Avatar on Leaderboard
    if (action === "SAVE_PROFILE") {
      const profile = await StudentProfile.findOneAndUpdate(
        { phone: payload.phone || "student_default" },
        payload,
        { upsert: true, new: true }
      );

      // Keep student's avatar & name updated in active Weekly Live Exam leaderboard
      if (payload.avatarUrl || payload.name) {
        const activeContest = await BiWeeklyContest.findOne({ contestId: "bcs-biweekly-main" });
        if (activeContest && activeContest.submissions?.length > 0) {
          let modified = false;
          activeContest.submissions.forEach((sub) => {
            if (
              (payload.studentKey && sub.studentKey === payload.studentKey) ||
              (payload.phone && sub.phone === payload.phone)
            ) {
              if (payload.avatarUrl) sub.avatarUrl = payload.avatarUrl;
              if (payload.name) sub.name = payload.name;
              if (payload.institution !== undefined) sub.institution = payload.institution;
              modified = true;
            }
          });
          if (modified) await activeContest.save();
        }
      }

      return NextResponse.json({ success: true, data: profile });
    }

    // 2. Public Student Action: Register for Weekly Live Exam (With Mobile Banking Selection)
    if (action === "REGISTER_CONTEST_EXAM") {
      const { contestId, studentKey, phone, name, institution, paymentMethod } = payload;
      let contest = await BiWeeklyContest.findOne({ contestId: contestId || "bcs-biweekly-main" });

      if (!contest) {
        contest = await BiWeeklyContest.create({
          contestId: contestId || "bcs-biweekly-main",
          title: "৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
          examWindowText: "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড",
          questions: [],
          registrations: [{ studentKey, phone, name, institution, paymentMethod: paymentMethod || "bkash" }],
          submissions: [],
        });
      } else {
        const existingIdx = contest.registrations.findIndex(
          (r) => r.studentKey === studentKey || r.phone === phone
        );
        if (existingIdx > -1) {
          contest.registrations[existingIdx] = {
            studentKey,
            phone,
            name,
            institution,
            paymentMethod: paymentMethod || "bkash",
            registeredAt: new Date(),
          };
        } else {
          contest.registrations.push({
            studentKey,
            phone,
            name,
            institution,
            paymentMethod: paymentMethod || "bkash",
          });
        }
        await contest.save();
      }
      return NextResponse.json({ success: true, data: contest });
    }

    // 3. Public Student Action: Submit Weekly Live Exam (One attempt per cycle)
    if (action === "SUBMIT_CONTEST_EXAM") {
      const { contestId, submission } = payload;
      const contest = await BiWeeklyContest.findOne({ contestId });
      if (!contest) {
        return NextResponse.json({ success: false, error: "পরীক্ষাটি পাওয়া যায়নি!" }, { status: 404 });
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
            error: "আপনি ইতিমধ্যে এই সপ্তাহের লাইভ পরীক্ষায় অংশগ্রহণ করেছেন! পরবর্তী শুক্রবারের পরীক্ষার আগে পুনরায় দেওয়া যাবে না।",
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
        title: title || "৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
        examWindowText: examWindowText || "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড",
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

    // Save or Update Daily Job News ("চাকরির আপডেট খবর")
    if (action === "SAVE_JOB_NEWS") {
      if (payload._id) {
        const updated = await JobUpdateNews.findByIdAndUpdate(payload._id, payload, { new: true });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await JobUpdateNews.create(payload);
        return NextResponse.json({ success: true, data: created });
      }
    }

    if (action === "DELETE_JOB_NEWS") {
      await JobUpdateNews.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Save or Update Bonus Content ("Bonus")
    if (action === "SAVE_BONUS_ITEM") {
      if (payload._id) {
        const updated = await BonusItem.findByIdAndUpdate(payload._id, payload, { new: true });
        return NextResponse.json({ success: true, data: updated });
      } else {
        const created = await BonusItem.create(payload);
        return NextResponse.json({ success: true, data: created });
      }
    }

    if (action === "DELETE_BONUS_ITEM") {
      await BonusItem.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}