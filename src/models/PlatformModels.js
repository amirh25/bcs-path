/**
 * ============================================================================
 * FILE: src/models/PlatformModels.js
 * PURPOSE: MongoDB Mongoose Schemas for BCS Path & Defense/Police Platform
 * ============================================================================
 */

import mongoose from "mongoose";

/**
 * 1. LECTURE SCHEMA
 * Supports:
 * - 3 PDF Uploads (Lecture PDF, Chapter MCQ PDF, Written Q&A PDF)
 * - 3 Rich Text / Color-Graded HTML Views + 2-Column Layout Toggle
 * - YouTube Unlisted Video (for Defense & Police)
 */
const LectureSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" }, // "bcs" | "defense"
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, required: true },
  chapterName: { type: String, default: "" },
  title: { type: String, required: true },
  isFree: { type: Boolean, default: true },

  // YouTube Unlisted Video Support
  videoUrl: { type: String, default: "" },
  videoDuration: { type: String, default: "১৫ মিনিট" },

  // 3-Tier PDF Support (File DataURL or Drive Link)
  lecturePdfUrl: { type: String, default: "" },
  mcqPdfUrl: { type: String, default: "" },
  writtenPdfUrl: { type: String, default: "" },

  // 3-Tier Rich Text View Support (with HTML Color Grading & Bold/Font Size)
  mainContent: { type: String, default: "" },
  mnemonic: { type: String, default: "" },
  confusionBox: { type: String, default: "" },
  mcqTextContent: { type: String, default: "" },
  writtenTextContent: { type: String, default: "" },

  // Column Layout Preferences (true = 2 Columns, false = 1 Column)
  mcqTwoColumn: { type: Boolean, default: true },
  lectureTwoColumn: { type: Boolean, default: false },
  writtenTwoColumn: { type: Boolean, default: false },
}, { timestamps: true });

/**
 * 2. QUESTION BANK DOCUMENT SCHEMA (Subject-wise PDF Upload + Rich Text View + 2-Column)
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
}, { timestamps: true });

/**
 * 3. CHAPTER EXAM TEST SET SCHEMA (Test 1 = 50 Questions, Test 2 = 50 Questions)
 * Stores structured 50-question sets published by Admin for specific Subject + Chapter/Lecture
 */
const ExamSetSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" }, // "bcs" | "defense"
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, required: true },
  chapterName: { type: String, required: true }, // Admin-defined Chapter / Lecture Name
  testNumber: { type: Number, required: true, enum: [1, 2] }, // 1 = Test 1, 2 = Test 2
  title: { type: String, default: "" },
  questions: [
    {
      qNo: { type: Number, required: true }, // 1 to 50
      question: { type: String, required: true },
      options: [{ type: String }], // 4 options
      correctAnswer: { type: Number, default: 0 }, // 0, 1, 2, 3
      explanation: { type: String, default: "" }, // Shown on wrong answer
    },
  ],
}, { timestamps: true });

/**
 * 4. STUDENT PROFILE SCHEMA
 */
const StudentProfileSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: "রাফিউল ইসলাম" },
  targetBcs: { type: String, default: "লক্ষ্য: ৪৭তম BCS ও ডিফেন্স ক্যাডার" },
  institution: { type: String, default: "" },
  hideProfile: { type: Boolean, default: false },
  avatarUrl: { type: String, default: "" },
}, { timestamps: true });

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const QuestionBankDoc = mongoose.models.QuestionBankDoc || mongoose.model("QuestionBankDoc", QuestionBankDocSchema);
export const ExamSet = mongoose.models.ExamSet || mongoose.model("ExamSet", ExamSetSchema);
export const StudentProfile = mongoose.models.StudentProfile || mongoose.model("StudentProfile", StudentProfileSchema);