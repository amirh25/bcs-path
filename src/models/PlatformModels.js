/**
 * ============================================================================
 * FILE: src/models/PlatformModels.js
 * PURPOSE: MongoDB Mongoose Schemas for BCS Path & Multi-Track Defense Platform
 * ============================================================================
 */

import mongoose from "mongoose";

/**
 * 1. LECTURE SCHEMA (Supports Course Isolation across BCS & All Defense Tracks)
 */
const LectureSchema = new mongoose.Schema(
  {
    courseType: { type: String, default: "bcs", index: true },
    subjectId: { type: String, required: true },
    lectureNo: { type: Number, required: true },
    chapterName: { type: String, default: "" },
    title: { type: String, required: true },
    isFree: { type: Boolean, default: true },

    videoUrl: { type: String, default: "" },
    videoDuration: { type: String, default: "১৫ মিনিট" },

    lecturePdfUrl: { type: String, default: "" },
    mcqPdfUrl: { type: String, default: "" },
    writtenPdfUrl: { type: String, default: "" },

    mainContent: { type: String, default: "" },
    mnemonic: { type: String, default: "" },
    confusionBox: { type: String, default: "" },
    mcqTextContent: { type: String, default: "" },
    writtenTextContent: { type: String, default: "" },

    embeddedImages: { type: Object, default: {} },

    mcqTwoColumn: { type: Boolean, default: true },
    lectureTwoColumn: { type: Boolean, default: false },
    writtenTwoColumn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * 2. VOCABULARY STORY SCHEMA
 */
const VocabStorySchema = new mongoose.Schema(
  {
    storyNo: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    storyContent: { type: String, required: true },
    image1Url: { type: String, default: "" },
    image1Position: { type: String, default: "right" },
    image2Url: { type: String, default: "" },
    image2Position: { type: String, default: "left" },
    wordMeaningBox: { type: String, default: "" },
    embeddedImages: { type: Object, default: {} },
  },
  { timestamps: true }
);

/**
 * 3. QUESTION BANK DOCUMENT SCHEMA
 */
const QuestionBankDocSchema = new mongoose.Schema(
  {
    courseType: { type: String, default: "bcs", index: true },
    subjectId: { type: String, required: true },
    bcsBatch: { type: String, default: "১০ম - ৪৬তম বিসিএস" },
    title: { type: String, required: true },
    pdfUrl: { type: String, default: "" },
    textContent: { type: String, default: "" },
    highlightBox: { type: String, default: "" },
    twoColumn: { type: Boolean, default: true },
    embeddedImages: { type: Object, default: {} },
  },
  { timestamps: true }
);

/**
 * 4. CHAPTER EXAM TEST SET SCHEMA (Test 1 & Test 2)
 */
const ExamSetSchema = new mongoose.Schema(
  {
    courseType: { type: String, default: "bcs", index: true },
    subjectId: { type: String, required: true },
    lectureNo: { type: Number, required: true },
    chapterName: { type: String, required: true },
    testNumber: { type: Number, required: true, enum: [1, 2] },
    title: { type: String, default: "" },
    questions: [
      {
        qNo: { type: Number, required: true },
        question: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: Number, default: 0 },
        explanation: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

/**
 * 5. WEEKLY LIVE EXAM SCHEMA (Supports Current Cycle + Archived Previous Results)
 */
const SubmissionObjectSchema = new mongoose.Schema(
  {
    studentKey: { type: String, required: true },
    phone: { type: String, default: "" },
    name: { type: String, required: true },
    institution: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    paymentMethod: { type: String, default: "bkash" },
    totalScore: { type: Number, required: true },
    englishScore: { type: Number, default: 0 },
    mathScore: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    negativePenalty: { type: Number, default: 0 },
    subjectBreakdown: { type: Array, default: [] },
    weakSubjects: [{ type: String }],
    answersMap: { type: Object, default: {} },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const BiWeeklyContestSchema = new mongoose.Schema(
  {
    contestId: { type: String, required: true, unique: true },
    cycleNumber: { type: Number, default: 1 },
    title: { type: String, required: true },
    examWindowText: {
      type: String,
      default: "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড · প্রতি শুক্রবার রাত ৮:০০টা",
    },
    isActive: { type: Boolean, default: true },
    questions: [
      {
        qNo: { type: Number, required: true },
        subjectId: { type: String, default: "bangla" },
        subjectTitle: { type: String, default: "বাংলা ভাষা ও সাহিত্য" },
        category: { type: String, default: "general" },
        question: { type: String, required: true },
        options: [{ type: String }],
        correctAnswer: { type: Number, default: 0 },
        explanation: { type: String, default: "" },
      },
    ],
    registrations: [
      {
        studentKey: { type: String, required: true },
        phone: { type: String, required: true },
        name: { type: String, required: true },
        institution: { type: String, required: true },
        paymentMethod: { type: String, default: "bkash" },
        cycleNumber: { type: Number, default: 1 },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    submissions: [SubmissionObjectSchema],
    // Stores the most recently completed exam cycle for "পূর্ববর্তী ফলাফল" & Top 100 Leaderboard
    previousContestArchive: {
      cycleNumber: { type: Number, default: 0 },
      title: { type: String, default: "" },
      completedAt: { type: Date },
      questions: { type: Array, default: [] },
      submissions: [SubmissionObjectSchema],
    },
  },
  { timestamps: true }
);

/**
 * 6. STUDENT PROFILE & COURSE ACCESS CONTROL SCHEMA
 */
const StudentProfileSchema = new mongoose.Schema(
  {
    studentKey: { type: String, index: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, default: "Amir Hamza" },
    targetBcs: { type: String, default: "লক্ষ্য: বিসিএস" },
    institution: { type: String, default: "" },
    hideProfile: { type: Boolean, default: false },
    avatarUrl: { type: String, default: "" },
    enrolledCourses: {
      type: [String],
      default: [
        "bcs",
        "def_police_trc",
        "def_army_sainik",
        "def_navy_sailor",
        "def_air_airman",
        "def_navy_cadet",
        "def_air_bafa",
        "def_police_army_joint",
        "def_joint_3forces",
        "def_combined_adv",
      ],
    },
  },
  { timestamps: true }
);

/**
 * 7. JOB UPDATE NEWS SCHEMA ("চাকরির আপডেট খবর")
 */
const JobUpdateNewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    categoryBadge: { type: String, default: "নিয়োগ বিজ্ঞপ্তি ও আপডেট" },
    publishDateText: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    articleContent: { type: String, required: true },
    twoColumnDesktop: { type: Boolean, default: false },
    embeddedImages: { type: Object, default: {} },
  },
  { timestamps: true }
);

/**
 * 8. BONUS CONTENT SCHEMA ("Bonus" Tab)
 */
const BonusItemSchema = new mongoose.Schema(
  {
    courseType: { type: String, default: "bcs", index: true },
    subjectId: { type: String, default: "ALL" },
    subjectTitle: { type: String, default: "সকল বিষয় (স্পেশাল গাইডলাইন)" },
    title: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    pdfUrl: { type: String, default: "" },
    content: { type: String, default: "" },
    twoColumnDesktop: { type: Boolean, default: false },
    embeddedImages: { type: Object, default: {} },
  },
  { timestamps: true }
);

/**
 * 9. DYNAMIC SYLLABUS TOPIC SCHEMA (For Admin Upload & Student Syllabus Popup Modal)
 */
const SyllabusItemSchema = new mongoose.Schema(
  {
    courseType: { type: String, required: true, index: true },
    subjectId: { type: String, required: true },
    subjectTitle: { type: String, default: "" },
    topicIndex: { type: Number, default: 0 },
    topicTitle: { type: String, required: true },
    marksText: { type: String, default: "" },
    shortSummary: { type: String, default: "" },
    detailedPopupContent: { type: String, default: "" },
    vivaGuidelines: { type: String, default: "" },
    embeddedImages: { type: Object, default: {} },
  },
  { timestamps: true }
);

/**
 * 10. DYNAMIC NOTIFICATION SCHEMA (Course-Aware & Student-Aware)
 */
const NotificationItemSchema = new mongoose.Schema(
  {
    courseType: { type: String, default: "ALL", index: true }, // ALL | bcs | def_army_sainik ...
    recipientKey: { type: String, default: "ALL", index: true }, // ALL or specific studentKey
    category: {
      type: String,
      default: "announcement", // registration | lecture | video | bonus | syllabus | job_news | announcement
    },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    targetTab: { type: String, default: "dashboard" },
    targetSubjectId: { type: String, default: "" },
    targetContentId: { type: String, default: "" },
    readByKeys: [{ type: String }],
  },
  { timestamps: true }
);

export const Lecture =
  mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const VocabStory =
  mongoose.models.VocabStory || mongoose.model("VocabStory", VocabStorySchema);
export const QuestionBankDoc =
  mongoose.models.QuestionBankDoc ||
  mongoose.model("QuestionBankDoc", QuestionBankDocSchema);
export const ExamSet =
  mongoose.models.ExamSet || mongoose.model("ExamSet", ExamSetSchema);
export const BiWeeklyContest =
  mongoose.models.BiWeeklyContest ||
  mongoose.model("BiWeeklyContest", BiWeeklyContestSchema);
export const StudentProfile =
  mongoose.models.StudentProfile ||
  mongoose.model("StudentProfile", StudentProfileSchema);
export const JobUpdateNews =
  mongoose.models.JobUpdateNews ||
  mongoose.model("JobUpdateNews", JobUpdateNewsSchema);
export const BonusItem =
  mongoose.models.BonusItem || mongoose.model("BonusItem", BonusItemSchema);
export const SyllabusItem =
  mongoose.models.SyllabusItem ||
  mongoose.model("SyllabusItem", SyllabusItemSchema);
export const NotificationItem =
  mongoose.models.NotificationItem ||
  mongoose.model("NotificationItem", NotificationItemSchema);