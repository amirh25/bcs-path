/**
 * ============================================================================
 * FILE: src/app/api/platform/route.js
 * PURPOSE: Full-Stack REST API for Multi-Course BCS & Defense Platform,
 *          Weekly Live Exam Archive, Dynamic Notifications & Popup Syllabus
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
  SyllabusItem,
  NotificationItem,
} from "@/models/PlatformModels";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const studentKey = searchParams.get("studentKey") || "";
    const phone = searchParams.get("phone") || "";

    const [
      lectures,
      vocabStories,
      qbankDocs,
      examSets,
      contests,
      jobUpdates,
      bonusItems,
      syllabusItems,
      notifications,
      studentsCount,
    ] = await Promise.all([
      Lecture.find().sort({ lectureNo: 1 }),
      VocabStory.find().sort({ storyNo: 1 }),
      QuestionBankDoc.find().sort({ createdAt: -1 }),
      ExamSet.find().sort({ lectureNo: 1, testNumber: 1 }),
      BiWeeklyContest.find().sort({ createdAt: -1 }),
      JobUpdateNews.find().sort({ createdAt: -1 }),
      BonusItem.find().sort({ createdAt: -1 }),
      SyllabusItem.find().sort({ topicIndex: 1, createdAt: 1 }),
      NotificationItem.find().sort({ createdAt: -1 }).limit(60),
      StudentProfile.countDocuments(),
    ]);

    let studentProfileDoc = null;
    if (studentKey || phone) {
      studentProfileDoc = await StudentProfile.findOne({
        $or: [
          ...(studentKey ? [{ studentKey }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      });
    }

    return NextResponse.json({
      success: true,
      lectures,
      vocabStories,
      qbankDocs,
      examSets,
      contests,
      jobUpdates,
      bonusItems,
      syllabusItems,
      notifications,
      studentProfileDoc,
      studentsCount: studentsCount || 1,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { action, adminPin, payload } = body;

    // 1. Student Action: Save Profile & Enrolled Courses
    if (action === "SAVE_PROFILE") {
      const lookupKey = payload.phone || payload.studentKey || "student_default";
      const profile = await StudentProfile.findOneAndUpdate(
        { phone: lookupKey },
        {
          ...payload,
          phone: lookupKey,
        },
        { upsert: true, new: true }
      );

      // Sync avatar & name in Weekly Live Exam Leaderboard
      if (payload.avatarUrl || payload.name) {
        const activeContest = await BiWeeklyContest.findOne({
          contestId: "bcs-biweekly-main",
        });
        if (activeContest) {
          let modified = false;
          (activeContest.submissions || []).forEach((sub) => {
            if (
              (payload.studentKey && sub.studentKey === payload.studentKey) ||
              (payload.phone && sub.phone === payload.phone)
            ) {
              if (payload.avatarUrl) sub.avatarUrl = payload.avatarUrl;
              if (payload.name) sub.name = payload.name;
              if (payload.institution !== undefined)
                sub.institution = payload.institution;
              modified = true;
            }
          });
          if (modified) await activeContest.save();
        }
      }

      return NextResponse.json({ success: true, data: profile });
    }

    // 2. Student Action: Unlock / Enroll in a Specific Course
    if (action === "ENROLL_COURSE") {
      const { studentKey, phone, courseKey } = payload;
      const lookupKey = phone || studentKey || "student_default";
      const profile = await StudentProfile.findOneAndUpdate(
        { phone: lookupKey },
        {
          $setOnInsert: { studentKey, name: payload.name || "শিক্ষার্থী" },
          $addToSet: { enrolledCourses: courseKey },
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, data: profile });
    }

    // 3. Student Action: Mark Notification as Read
    if (action === "MARK_NOTIFICATION_READ") {
      const { notificationId, studentKey } = payload;
      if (notificationId && studentKey) {
        await NotificationItem.findByIdAndUpdate(notificationId, {
          $addToSet: { readByKeys: studentKey },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === "MARK_ALL_NOTIFICATIONS_READ") {
      const { studentKey } = payload;
      if (studentKey) {
        await NotificationItem.updateMany(
          { readByKeys: { $ne: studentKey } },
          { $addToSet: { readByKeys: studentKey } }
        );
      }
      return NextResponse.json({ success: true });
    }

    // 4. Student Action: Register for Current Weekly Live Exam Cycle
    if (action === "REGISTER_CONTEST_EXAM") {
      const {
        contestId,
        studentKey,
        phone,
        name,
        institution,
        paymentMethod,
      } = payload;
      let contest = await BiWeeklyContest.findOne({
        contestId: contestId || "bcs-biweekly-main",
      });

      const currentCycle = contest?.cycleNumber || 1;

      if (!contest) {
        contest = await BiWeeklyContest.create({
          contestId: contestId || "bcs-biweekly-main",
          cycleNumber: 1,
          title:
            "৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
          examWindowText: "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড",
          questions: [],
          registrations: [
            {
              studentKey,
              phone,
              name,
              institution,
              paymentMethod: paymentMethod || "bkash",
              cycleNumber: 1,
            },
          ],
          submissions: [],
        });
      } else {
        const existingIdx = contest.registrations.findIndex(
          (r) =>
            (r.studentKey === studentKey || (phone && r.phone === phone)) &&
            Number(r.cycleNumber || 1) === Number(currentCycle)
        );
        if (existingIdx > -1) {
          contest.registrations[existingIdx] = {
            studentKey,
            phone,
            name,
            institution,
            paymentMethod: paymentMethod || "bkash",
            cycleNumber: currentCycle,
            registeredAt: new Date(),
          };
        } else {
          contest.registrations.push({
            studentKey,
            phone,
            name,
            institution,
            paymentMethod: paymentMethod || "bkash",
            cycleNumber: currentCycle,
          });
        }
        await contest.save();
      }

      // Create a personal registration confirmation notification for this student
      await NotificationItem.create({
        courseType: "bcs",
        recipientKey: studentKey,
        category: "registration",
        title: "আপনার সাপ্তাহিক পরীক্ষার রেজিস্ট্রেশন সম্পন্ন হয়েছে!",
        message: `${name}, শুক্রবার রাত ৮:০০টার সাপ্তাহিক লাইভ পরীক্ষার জন্য আপনার রেজিস্ট্রেশন নিশ্চিত করা হয়েছে।`,
        targetTab: "biweekly_contest",
      });

      return NextResponse.json({ success: true, data: contest });
    }

    // 5. Student Action: Submit Weekly Live Exam
    if (action === "SUBMIT_CONTEST_EXAM") {
      const { contestId, submission } = payload;
      const contest = await BiWeeklyContest.findOne({ contestId });
      if (!contest) {
        return NextResponse.json(
          { success: false, error: "পরীক্ষাটি পাওয়া যায়নি!" },
          { status: 404 }
        );
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
            error:
              "আপনি ইতিমধ্যে এই সপ্তাহের লাইভ পরীক্ষায় অংশগ্রহণ করেছেন! পরবর্তী পর্বের আগে পুনরায় দেওয়া যাবে না।",
          },
          { status: 400 }
        );
      }

      contest.submissions.push(submission);
      await contest.save();

      await NotificationItem.create({
        courseType: "bcs",
        recipientKey: submission.studentKey,
        category: "registration",
        title: "সাপ্তাহিক পরীক্ষার খাতা সফলভাবে জমা হয়েছে!",
        message: `আপনার প্রাপ্ত নম্বর: ${submission.totalScore}। জাতীয় লিডারবোর্ডে আপনার মেধাক্রম দেখুন।`,
        targetTab: "biweekly_contest",
      });

      return NextResponse.json({ success: true, data: contest });
    }

    // ================= ADMIN PIN VERIFICATION =================
    const SECRET = process.env.ADMIN_SECRET_PIN || "bcs2026";
    if (adminPin !== SECRET) {
      return NextResponse.json(
        { success: false, error: "ভুল অ্যাডমিন পিন!" },
        { status: 401 }
      );
    }

    // Helper to dispatch optional admin notification
    const maybeCreateAdminNotification = async ({
      sendNotification,
      notificationTitle,
      notificationMessage,
      courseType,
      category,
      targetTab,
      targetSubjectId = "",
      targetContentId = "",
    }) => {
      if (!sendNotification) return;
      await NotificationItem.create({
        courseType: courseType || "ALL",
        recipientKey: "ALL",
        category: category || "announcement",
        title: notificationTitle,
        message: notificationMessage || "",
        targetTab: targetTab || "dashboard",
        targetSubjectId,
        targetContentId: String(targetContentId || ""),
      });
    };

    if (action === "SAVE_LECTURE") {
      const {
        sendNotification,
        customNotificationText,
        ...lectureFields
      } = payload;
      let savedDoc;
      if (lectureFields._id) {
        savedDoc = await Lecture.findByIdAndUpdate(
          lectureFields._id,
          lectureFields,
          { new: true }
        );
      } else {
        savedDoc = await Lecture.create(lectureFields);
      }

      const hasVideo = Boolean(
        lectureFields.videoUrl && lectureFields.videoUrl.trim()
      );
      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          (hasVideo
            ? `🎬 নতুন ভিডিও ও লেকচার আপলোড: ${savedDoc.title}`
            : `📘 নতুন লেকচার নোট আপলোড: ${savedDoc.title}`),
        notificationMessage: `লেকচার #${savedDoc.lectureNo} প্রকাশিত হয়েছে। সরাসরি দেখতে ক্লিক করুন।`,
        courseType: savedDoc.courseType || "bcs",
        category: hasVideo ? "video" : "lecture",
        targetTab: "subject_lectures",
        targetSubjectId: savedDoc.subjectId,
        targetContentId: savedDoc._id,
      });

      return NextResponse.json({ success: true, data: savedDoc });
    }

    if (action === "DELETE_LECTURE") {
      await Lecture.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    if (action === "SAVE_VOCAB_STORY") {
      const { sendNotification, customNotificationText, ...vocabFields } =
        payload;
      let savedDoc;
      if (vocabFields._id) {
        savedDoc = await VocabStory.findByIdAndUpdate(
          vocabFields._id,
          vocabFields,
          { new: true }
        );
      } else {
        savedDoc = await VocabStory.create(vocabFields);
      }

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          `📖 নতুন ভোকাবুলারি স্টোরি: ${savedDoc.title}`,
        notificationMessage:
          "গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি পড়তে ক্লিক করুন।",
        courseType: "bcs",
        category: "lecture",
        targetTab: "subject_lectures",
        targetSubjectId: "english_grammar",
        targetContentId: savedDoc._id,
      });

      return NextResponse.json({ success: true, data: savedDoc });
    }

    if (action === "DELETE_VOCAB_STORY") {
      await VocabStory.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    if (action === "SAVE_QBANK_DOC") {
      const { sendNotification, customNotificationText, ...qbFields } = payload;
      let savedDoc;
      if (qbFields._id) {
        savedDoc = await QuestionBankDoc.findByIdAndUpdate(
          qbFields._id,
          qbFields,
          { new: true }
        );
      } else {
        savedDoc = await QuestionBankDoc.create(qbFields);
      }

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          `📚 নতুন প্রশ্ন ব্যাংক যুক্ত হয়েছে: ${savedDoc.title}`,
        notificationMessage: savedDoc.bcsBatch || "প্রশ্ন ব্যাংক অনুশীলন করুন।",
        courseType: savedDoc.courseType || "bcs",
        category: "lecture",
        targetTab: "qbank",
        targetSubjectId: savedDoc.subjectId,
        targetContentId: savedDoc._id,
      });

      return NextResponse.json({ success: true, data: savedDoc });
    }

    if (action === "DELETE_QBANK_DOC") {
      await QuestionBankDoc.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    if (action === "SAVE_EXAM_SET") {
      const {
        courseType,
        subjectId,
        lectureNo,
        testNumber,
        chapterName,
        title,
        questions,
        sendNotification,
        customNotificationText,
      } = payload;
      const validQuestions = (questions || []).filter(
        (q) => q.question && q.question.trim() !== ""
      );

      if (validQuestions.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "কমপক্ষে ১টি প্রশ্ন পূরণ করে Publish করুন!",
          },
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

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          `🎯 নতুন মক টেস্ট প্রকাশিত: ${chapterName} (Test ${testNumber})`,
        notificationMessage: `মোট ${validQuestions.length}টি এমসিকিউ প্রশ্নসহ মক টেস্টটি এখন উন্মুক্ত।`,
        courseType: courseType || "bcs",
        category: "announcement",
        targetTab: "mock_test_hub",
        targetSubjectId: subjectId,
      });

      return NextResponse.json({ success: true, data: savedSet });
    }

    if (action === "DELETE_EXAM_SET") {
      await ExamSet.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Weekly Live Exam Save + Archive Previous Cycle for "পূর্ববর্তী ফলাফল"
    if (action === "SAVE_BIWEEKLY_CONTEST") {
      const {
        contestId,
        title,
        examWindowText,
        questions,
        resetSubmissions,
        sendNotification,
      } = payload;
      const validQuestions = (questions || []).filter(
        (q) => q.question && q.question.trim() !== ""
      );

      if (validQuestions.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              "কমপক্ষে ১টি প্রশ্ন পূরণ করে ২০০ প্রশ্নের পরীক্ষাটি Publish করুন!",
          },
          { status: 400 }
        );
      }

      const existingContest = await BiWeeklyContest.findOne({
        contestId: contestId || "bcs-biweekly-main",
      });

      const nextCycleNumber = resetSubmissions
        ? (existingContest?.cycleNumber || 1) + 1
        : existingContest?.cycleNumber || 1;

      const updateData = {
        contestId: contestId || "bcs-biweekly-main",
        cycleNumber: nextCycleNumber,
        title:
          title ||
          "৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
        examWindowText:
          examWindowText || "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড",
        isActive: true,
        questions: validQuestions,
      };

      // Archive the most recently completed exam before starting a fresh weekly cycle!
      if (resetSubmissions) {
        if (existingContest && existingContest.submissions?.length > 0) {
          updateData.previousContestArchive = {
            cycleNumber: existingContest.cycleNumber || 1,
            title: existingContest.title,
            completedAt: new Date(),
            questions: existingContest.questions || [],
            submissions: existingContest.submissions || [],
          };
        }
        updateData.submissions = [];
        updateData.registrations = [];
      }

      const savedContest = await BiWeeklyContest.findOneAndUpdate(
        { contestId: updateData.contestId },
        updateData,
        { upsert: true, new: true }
      );

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle: `🏆 সাপ্তাহিক লাইভ পরীক্ষা আপডেট: ${updateData.title}`,
        notificationMessage:
          "প্রতি শুক্রবার রাত ৮:০০টার সাপ্তাহিক পরীক্ষায় অংশ নিতে রেজিস্ট্রেশন করুন।",
        courseType: "bcs",
        category: "announcement",
        targetTab: "biweekly_contest",
      });

      return NextResponse.json({ success: true, data: savedContest });
    }

    // Save or Update Job News ("চাকরির আপডেট খবর")
    if (action === "SAVE_JOB_NEWS") {
      const { sendNotification, customNotificationText, ...newsFields } =
        payload;
      let savedDoc;
      if (newsFields._id) {
        savedDoc = await JobUpdateNews.findByIdAndUpdate(
          newsFields._id,
          newsFields,
          { new: true }
        );
      } else {
        savedDoc = await JobUpdateNews.create(newsFields);
      }

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          `📰 চাকরির আপডেট খবর: ${savedDoc.title}`,
        notificationMessage: `${savedDoc.categoryBadge} • বিস্তারিত পড়তে ক্লিক করুন।`,
        courseType: "ALL",
        category: "job_news",
        targetTab: "job_news_modal",
        targetContentId: savedDoc._id,
      });

      return NextResponse.json({ success: true, data: savedDoc });
    }

    if (action === "DELETE_JOB_NEWS") {
      await JobUpdateNews.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Save or Update Bonus Content ("Bonus")
    if (action === "SAVE_BONUS_ITEM") {
      const { sendNotification, customNotificationText, ...bonusFields } =
        payload;
      let savedDoc;
      if (bonusFields._id) {
        savedDoc = await BonusItem.findByIdAndUpdate(
          bonusFields._id,
          bonusFields,
          { new: true }
        );
      } else {
        savedDoc = await BonusItem.create(bonusFields);
      }

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          `🎁 নতুন Bonus টিপস ও গাইডলাইন: ${savedDoc.title}`,
        notificationMessage: `${savedDoc.subjectTitle} — বোনাস কনটেন্ট দেখতে ক্লিক করুন।`,
        courseType: savedDoc.courseType || "bcs",
        category: "bonus",
        targetTab: "bonus_hub",
        targetSubjectId: savedDoc.subjectId,
        targetContentId: savedDoc._id,
      });

      return NextResponse.json({ success: true, data: savedDoc });
    }

    if (action === "DELETE_BONUS_ITEM") {
      await BonusItem.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Save or Update Subject Syllabus Item (For Popup Window)
    if (action === "SAVE_SYLLABUS_ITEM") {
      const { sendNotification, customNotificationText, ...sylFields } =
        payload;
      let savedDoc;
      if (sylFields._id) {
        savedDoc = await SyllabusItem.findByIdAndUpdate(
          sylFields._id,
          sylFields,
          { new: true }
        );
      } else {
        savedDoc = await SyllabusItem.create(sylFields);
      }

      await maybeCreateAdminNotification({
        sendNotification,
        notificationTitle:
          customNotificationText?.trim() ||
          `📋 সিলেবাস আপডেট: ${savedDoc.subjectTitle} (${savedDoc.topicTitle})`,
        notificationMessage:
          "বিস্তারিত সিলেবাস ও ভাইভা গাইডলাইন পপ-আপে দেখতে ক্লিক করুন।",
        courseType: savedDoc.courseType || "bcs",
        category: "syllabus",
        targetTab: "syllabus",
        targetSubjectId: savedDoc.subjectId,
        targetContentId: savedDoc._id,
      });

      return NextResponse.json({ success: true, data: savedDoc });
    }

    if (action === "DELETE_SYLLABUS_ITEM") {
      await SyllabusItem.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    // Direct Custom Announcement Notification from Admin
    if (action === "SEND_CUSTOM_NOTIFICATION") {
      const created = await NotificationItem.create({
        courseType: payload.courseType || "ALL",
        recipientKey: "ALL",
        category: payload.category || "announcement",
        title: payload.title,
        message: payload.message || "",
        targetTab: payload.targetTab || "dashboard",
      });
      return NextResponse.json({ success: true, data: created });
    }

    if (action === "DELETE_NOTIFICATION") {
      await NotificationItem.findByIdAndDelete(payload.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid Action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}