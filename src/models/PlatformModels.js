/**
 * ============================================================================
 * FILE: src/models/PlatformModels.js
 * PURPOSE: MongoDB Mongoose Schemas for BCS Path & Defense/Police Platform
 * ============================================================================
 */

import mongoose from "mongoose";

/**
 * 1. LECTURE SCHEMA
 * Supports clean Short-Token Images ({{IMG_1:right}}) stored in embeddedImages map
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

  // Stores Base64 images cleanly by token key (e.g. { IMG_1: "data:image/..." }) so editor text stays clean!
  embeddedImages: { type: Object, default: {} },

  mcqTwoColumn: { type: Boolean, default: true },
  lectureTwoColumn: { type: Boolean, default: false },
  writtenTwoColumn: { type: Boolean, default: false },
}, { timestamps: true });

/**
 * 2. VOCABULARY STORY SCHEMA ("গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি শিখুন")
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
 * 4. CHAPTER EXAM TEST SET SCHEMA (Test 1 & Test 2 - 50 Questions each)
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
 * 5. 10-DAY NATIONAL BCS COMBINED 200-MCQ LIVE EXAM (10th, 20th & Last Day of Month)
 * Includes Registration List, Subject-wise 25-Question Tagging & Subject Weakness Breakdown
 */
const BiWeeklyContestSchema = new mongoose.Schema({
  contestId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  examWindowText: { type: String, default: "প্রতি ১০ দিনে ১টি জাতীয় বিসিএস প্রিলিমিনারি পরীক্ষা (মাসে ৩টি: ১০, ২০ ও মাসের শেষ তারিখ)" },
  isActive: { type: Boolean, default: true },
  questions: [
    {
      qNo: { type: Number, required: true }, // 1 to 200
      subjectId: { type: String, default: "bangla" }, // Assigned per 25-question block
      subjectTitle: { type: String, default: "বাংলা ভাষা ও সাহিত্য" },
      category: { type: String, default: "general" }, // "english" | "math" | "general" for tie-breaker
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
      totalScore: { type: Number, required: true },
      englishScore: { type: Number, default: 0 },
      mathScore: { type: Number, default: 0 },
      correctCount: { type: Number, default: 0 },
      wrongCount: { type: Number, default: 0 },
      negativePenalty: { type: Number, default: 0 },
      subjectBreakdown: { type: Array, default: [] }, // [{ subjectId, subjectTitle, total, correct, wrong, marks }]
      weakSubjects: [{ type: String }], // Names of subjects where student scored < 50% or made most mistakes
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

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const VocabStory = mongoose.models.VocabStory || mongoose.model("VocabStory", VocabStorySchema);
export const QuestionBankDoc = mongoose.models.QuestionBankDoc || mongoose.model("QuestionBankDoc", QuestionBankDocSchema);
export const ExamSet = mongoose.models.ExamSet || mongoose.model("ExamSet", ExamSetSchema);
export const BiWeeklyContest = mongoose.models.BiWeeklyContest || mongoose.model("BiWeeklyContest", BiWeeklyContestSchema);
export const StudentProfile = mongoose.models.StudentProfile || mongoose.model("StudentProfile", StudentProfileSchema);