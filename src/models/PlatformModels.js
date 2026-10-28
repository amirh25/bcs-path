// /**
//  * ============================================================================
//  * FILE: src/models/PlatformModels.js
//  * PURPOSE: MongoDB Mongoose Schemas for BCS Path & Defense/Police Platform
//  * ============================================================================
//  */

// import mongoose from "mongoose";

// /**
//  * 1. LECTURE SCHEMA
//  */
// const LectureSchema = new mongoose.Schema({
//   courseType: { type: String, default: "bcs" },
//   subjectId: { type: String, required: true },
//   lectureNo: { type: Number, required: true },
//   chapterName: { type: String, default: "" },
//   title: { type: String, required: true },
//   isFree: { type: Boolean, default: true },

//   videoUrl: { type: String, default: "" },
//   videoDuration: { type: String, default: "১৫ মিনিট" },

//   lecturePdfUrl: { type: String, default: "" },
//   mcqPdfUrl: { type: String, default: "" },
//   writtenPdfUrl: { type: String, default: "" },

//   mainContent: { type: String, default: "" },
//   mnemonic: { type: String, default: "" },
//   confusionBox: { type: String, default: "" },
//   mcqTextContent: { type: String, default: "" },
//   writtenTextContent: { type: String, default: "" },

//   embeddedImages: { type: Object, default: {} },

//   mcqTwoColumn: { type: Boolean, default: true },
//   lectureTwoColumn: { type: Boolean, default: false },
//   writtenTwoColumn: { type: Boolean, default: false },
// }, { timestamps: true });

// /**
//  * 2. VOCABULARY STORY SCHEMA
//  */
// const VocabStorySchema = new mongoose.Schema({
//   storyNo: { type: Number, required: true },
//   title: { type: String, required: true },
//   subtitle: { type: String, default: "" },
//   storyContent: { type: String, required: true },
//   image1Url: { type: String, default: "" },
//   image1Position: { type: String, default: "right" },
//   image2Url: { type: String, default: "" },
//   image2Position: { type: String, default: "left" },
//   wordMeaningBox: { type: String, default: "" },
//   embeddedImages: { type: Object, default: {} },
// }, { timestamps: true });

// /**
//  * 3. QUESTION BANK DOCUMENT SCHEMA
//  */
// const QuestionBankDocSchema = new mongoose.Schema({
//   courseType: { type: String, default: "bcs" },
//   subjectId: { type: String, required: true },
//   bcsBatch: { type: String, default: "১০ম - ৪৬তম বিসিএস" },
//   title: { type: String, required: true },
//   pdfUrl: { type: String, default: "" },
//   textContent: { type: String, default: "" },
//   highlightBox: { type: String, default: "" },
//   twoColumn: { type: Boolean, default: true },
//   embeddedImages: { type: Object, default: {} },
// }, { timestamps: true });

// /**
//  * 4. CHAPTER EXAM TEST SET SCHEMA (Test 1 & Test 2)
//  */
// const ExamSetSchema = new mongoose.Schema({
//   courseType: { type: String, default: "bcs" },
//   subjectId: { type: String, required: true },
//   lectureNo: { type: Number, required: true },
//   chapterName: { type: String, required: true },
//   testNumber: { type: Number, required: true, enum: [1, 2] },
//   title: { type: String, default: "" },
//   questions: [
//     {
//       qNo: { type: Number, required: true },
//       question: { type: String, required: true },
//       options: [{ type: String }],
//       correctAnswer: { type: Number, default: 0 },
//       explanation: { type: String, default: "" },
//     },
//   ],
// }, { timestamps: true });

// /**
//  * 5. WEEKLY LIVE EXAM SCHEMA (Every Friday 8:00 PM - 200 MCQ)
//  */
// const BiWeeklyContestSchema = new mongoose.Schema({
//   contestId: { type: String, required: true, unique: true },
//   title: { type: String, required: true },
//   examWindowText: {
//     type: String,
//     default: "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড · প্রতি শুক্রবার রাত ৮টায় লাইভ পরীক্ষা",
//   },
//   isActive: { type: Boolean, default: true },
//   questions: [
//     {
//       qNo: { type: Number, required: true },
//       subjectId: { type: String, default: "bangla" },
//       subjectTitle: { type: String, default: "বাংলা ভাষা ও সাহিত্য" },
//       category: { type: String, default: "general" },
//       question: { type: String, required: true },
//       options: [{ type: String }],
//       correctAnswer: { type: Number, default: 0 },
//       explanation: { type: String, default: "" },
//     },
//   ],
//   registrations: [
//     {
//       studentKey: { type: String, required: true },
//       phone: { type: String, required: true },
//       name: { type: String, required: true },
//       institution: { type: String, required: true },
//       paymentMethod: { type: String, default: "bkash" },
//       registeredAt: { type: Date, default: Date.now },
//     },
//   ],
//   submissions: [
//     {
//       studentKey: { type: String, required: true },
//       phone: { type: String, default: "" },
//       name: { type: String, required: true },
//       institution: { type: String, default: "" },
//       avatarUrl: { type: String, default: "" },
//       paymentMethod: { type: String, default: "bkash" },
//       totalScore: { type: Number, required: true },
//       englishScore: { type: Number, default: 0 },
//       mathScore: { type: Number, default: 0 },
//       correctCount: { type: Number, default: 0 },
//       wrongCount: { type: Number, default: 0 },
//       negativePenalty: { type: Number, default: 0 },
//       subjectBreakdown: { type: Array, default: [] },
//       weakSubjects: [{ type: String }],
//       answersMap: { type: Object, default: {} },
//       submittedAt: { type: Date, default: Date.now },
//     },
//   ],
// }, { timestamps: true });

// /**
//  * 6. STUDENT PROFILE SCHEMA
//  */
// const StudentProfileSchema = new mongoose.Schema({
//   phone: { type: String, required: true, unique: true },
//   name: { type: String, default: "Hamza" },
//   targetBcs: { type: String, default: "লক্ষ্য: ৪৭তম BCS" },
//   institution: { type: String, default: "" },
//   hideProfile: { type: Boolean, default: false },
//   avatarUrl: { type: String, default: "" },
// }, { timestamps: true });

// /**
//  * 7. JOB UPDATE NEWS SCHEMA ("চাকরির আপডেট খবর")
//  */
// const JobNewsSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, default: "সরকারি চাকরির বিজ্ঞপ্তি" },
//   publishDateText: { type: String, default: "" },
//   coverImageUrl: { type: String, default: "" },
//   articleContent: { type: String, required: true },
//   twoColumnDesktop: { type: Boolean, default: true },
//   embeddedImages: { type: Object, default: {} },
// }, { timestamps: true });

// /**
//  * 8. BONUS TIPS & VIDEO SCHEMA ("Bonus" Feature)
//  */
// const BonusItemSchema = new mongoose.Schema({
//   courseType: { type: String, default: "bcs" },
//   subjectId: { type: String, default: "ALL" },
//   title: { type: String, required: true },
//   badgeText: { type: String, default: "স্পেশাল বোনাস টিপস" },
//   videoUrl: { type: String, default: "" },
//   pdfUrl: { type: String, default: "" },
//   textContent: { type: String, default: "" },
//   twoColumnDesktop: { type: Boolean, default: false },
//   embeddedImages: { type: Object, default: {} },
// }, { timestamps: true });

// export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
// export const VocabStory = mongoose.models.VocabStory || mongoose.model("VocabStory", VocabStorySchema);
// export const QuestionBankDoc = mongoose.models.QuestionBankDoc || mongoose.model("QuestionBankDoc", QuestionBankDocSchema);
// export const ExamSet = mongoose.models.ExamSet || mongoose.model("ExamSet", ExamSetSchema);
// export const BiWeeklyContest = mongoose.models.BiWeeklyContest || mongoose.model("BiWeeklyContest", BiWeeklyContestSchema);
// export const StudentProfile = mongoose.models.StudentProfile || mongoose.model("StudentProfile", StudentProfileSchema);
// export const JobNews = mongoose.models.JobNews || mongoose.model("JobNews", JobNewsSchema);
// export const BonusItem = mongoose.models.BonusItem || mongoose.model("BonusItem", BonusItemSchema);



/**
 * ============================================================================
 * FILE: src/models/PlatformModels.js
 * PURPOSE: MongoDB Mongoose Schemas for BCS Path & Defense/Police Platform
 * ============================================================================
 */

import mongoose from "mongoose";

/**
 * 1. LECTURE SCHEMA (Supports Video for BOTH BCS and Defense)
 */
const LectureSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" },
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
}, { timestamps: true });

/**
 * 2. VOCABULARY STORY SCHEMA
 */
const VocabStorySchema = new mongoose.Schema({
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
}, { timestamps: true });

/**
 * 3. QUESTION BANK DOCUMENT SCHEMA
 */
const QuestionBankDocSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" },
  subjectId: { type: String, required: true },
  bcsBatch: { type: String, default: "১০ম - ৪৬তম বিসিএস" },
  title: { type: String, required: true },
  pdfUrl: { type: String, default: "" },
  textContent: { type: String, default: "" },
  highlightBox: { type: String, default: "" },
  twoColumn: { type: Boolean, default: true },
  embeddedImages: { type: Object, default: {} },
}, { timestamps: true });

/**
 * 4. CHAPTER EXAM TEST SET SCHEMA (Test 1 & Test 2)
 */
const ExamSetSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" },
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
}, { timestamps: true });

/**
 * 5. WEEKLY LIVE EXAM SCHEMA (Every Friday at 8:00 PM - 200 MCQs)
 */
const BiWeeklyContestSchema = new mongoose.Schema({
  contestId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  examWindowText: { type: String, default: "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড · প্রতি শুক্রবার রাত ৮:০০টা" },
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
      paymentMethod: { type: String, default: "bkash" }, // bkash | nagad | rocket
      registeredAt: { type: Date, default: Date.now },
    },
  ],
  submissions: [
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
  ],
}, { timestamps: true });

/**
 * 6. STUDENT PROFILE SCHEMA
 */
const StudentProfileSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: "Hamza" },
  targetBcs: { type: String, default: "লক্ষ্য: ৪৭তম BCS" },
  institution: { type: String, default: "" },
  hideProfile: { type: Boolean, default: false },
  avatarUrl: { type: String, default: "" },
}, { timestamps: true });

/**
 * 7. JOB UPDATE NEWS SCHEMA ("চাকরির আপডেট খবর")
 */
const JobUpdateNewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  categoryBadge: { type: String, default: "নিয়োগ বিজ্ঞপ্তি ও আপডেট" },
  publishDateText: { type: String, default: "" },
  coverImageUrl: { type: String, default: "" },
  articleContent: { type: String, required: true },
  twoColumnDesktop: { type: Boolean, default: false },
  embeddedImages: { type: Object, default: {} },
}, { timestamps: true });

/**
 * 8. BONUS CONTENT SCHEMA ("Bonus" Tab for Tips, Videos & Strategy)
 */
const BonusItemSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" },
  subjectId: { type: String, default: "ALL" },
  subjectTitle: { type: String, default: "সকল বিষয় (স্পেশাল গাইডলাইন)" },
  title: { type: String, required: true },
  videoUrl: { type: String, default: "" },
  pdfUrl: { type: String, default: "" },
  content: { type: String, default: "" },
  twoColumnDesktop: { type: Boolean, default: false },
  embeddedImages: { type: Object, default: {} },
}, { timestamps: true });

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const VocabStory = mongoose.models.VocabStory || mongoose.model("VocabStory", VocabStorySchema);
export const QuestionBankDoc = mongoose.models.QuestionBankDoc || mongoose.model("QuestionBankDoc", QuestionBankDocSchema);
export const ExamSet = mongoose.models.ExamSet || mongoose.model("ExamSet", ExamSetSchema);
export const BiWeeklyContest = mongoose.models.BiWeeklyContest || mongoose.model("BiWeeklyContest", BiWeeklyContestSchema);
export const StudentProfile = mongoose.models.StudentProfile || mongoose.model("StudentProfile", StudentProfileSchema);
export const JobUpdateNews = mongoose.models.JobUpdateNews || mongoose.model("JobUpdateNews", JobUpdateNewsSchema);
export const BonusItem = mongoose.models.BonusItem || mongoose.model("BonusItem", BonusItemSchema);
