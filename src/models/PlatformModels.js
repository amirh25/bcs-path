/**
 * ============================================================================
 * FILE: src/models/PlatformModels.js
 * PURPOSE: MongoDB Mongoose Schemas for Multi-Course EdTech Platform
 * COURSES SUPPORTED:
 *   1. "bcs"     -> BCS Preparation (Course 01)
 *   2. "defense" -> Defense & Police Constable Job Foundation (Course 02)
 * ============================================================================
 */

import mongoose from "mongoose";

/**
 * 1. LECTURE SCHEMA
 * Supports both BCS (3-tier PDFs + Text View) and Defense/Police (YouTube Unlisted Video + Lecture PDF)
 */
const LectureSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" }, // "bcs" | "defense"
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, required: true },
  title: { type: String, required: true },
  isFree: { type: Boolean, default: true },

  // Defense & Police Special Video Fields (YouTube Unlisted Support)
  videoUrl: { type: String, default: "" },
  videoDuration: { type: String, default: "১৫ মিনিট" },

  // 3-Tier PDF Support (Lecture PDF, Chapter MCQ PDF, Written Q&A PDF)
  lecturePdfUrl: { type: String, default: "" },
  mcqPdfUrl: { type: String, default: "" },
  writtenPdfUrl: { type: String, default: "" },

  // Rich Text View Support
  mainContent: { type: String, default: "" },
  mnemonic: { type: String, default: "" },
  confusionBox: { type: String, default: "" },
  mcqTextContent: { type: String, default: "" },
  writtenTextContent: { type: String, default: "" },
}, { timestamps: true });

/**
 * 2. QUESTION BANK DOCUMENT SCHEMA (Subject-wise PDF + Text View)
 */
const QuestionBankDocSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" }, // "bcs" | "defense"
  subjectId: { type: String, required: true },
  bcsBatch: { type: String, default: "১০ম - ৪৬তম বিসিএস" },
  title: { type: String, required: true },
  pdfUrl: { type: String, default: "" },
  textContent: { type: String, default: "" },
  highlightBox: { type: String, default: "" },
}, { timestamps: true });

/**
 * 3. ONLINE EXAM / TOPIC TEST MCQ SCHEMA
 */
const QuestionSchema = new mongoose.Schema({
  courseType: { type: String, default: "bcs" }, // "bcs" | "defense"
  bcsBatch: { type: String, default: "অধ্যায়ভিত্তিক" },
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, default: 1 },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: "" },
}, { timestamps: true });

/**
 * 4. STUDENT PROFILE SCHEMA
 */
const StudentProfileSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: "রাফিউল ইসলাম" },
  targetBcs: { type: String, default: "লক্ষ্য: ৪৭তম BCS ও ডিফেন্স অফিসার" },
  institution: { type: String, default: "" },
  hideProfile: { type: Boolean, default: false },
  avatarUrl: { type: String, default: "" },
}, { timestamps: true });

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const QuestionBankDoc = mongoose.models.QuestionBankDoc || mongoose.model("QuestionBankDoc", QuestionBankDocSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export const StudentProfile = mongoose.models.StudentProfile || mongoose.model("StudentProfile", StudentProfileSchema);