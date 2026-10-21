import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, required: true },
  title: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  // 3-Tier PDF Support (Lecture PDF, Chapter MCQ PDF, Written Q&A PDF)
  lecturePdfUrl: { type: String, default: "" },
  mcqPdfUrl: { type: String, default: "" },
  writtenPdfUrl: { type: String, default: "" },
  // Text fallback notes
  mainContent: { type: String, default: "" },
  mnemonic: { type: String, default: "" },
  confusionBox: { type: String, default: "" },
  previousQuestion: { type: String, default: "" },
}, { timestamps: true });

const QuestionSchema = new mongoose.Schema({
  bcsBatch: { type: String, default: "অধ্যায়ভিত্তিক" },
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, default: 1 }, // নির্দিষ্ট লেকচার/অধ্যায়ের সাথে যুক্ত
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: "" },
}, { timestamps: true });

const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  method: { type: String, required: true },
  trxId: { type: String, required: true },
  status: { type: String, default: "Pending" },
  expiresAt: { type: Date },
}, { timestamps: true });

const StudentProfileSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: "রাফিউল ইসলাম" },
  targetBcs: { type: String, default: "লক্ষ্য: ৪৭তম BCS" },
  institution: { type: String, default: "" },
  hideProfile: { type: Boolean, default: false },
  avatarUrl: { type: String, default: "" },
  completedLectures: { type: Number, default: 34 },
  completedQuizzes: { type: Number, default: 12 },
}, { timestamps: true });

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export const StudentProfile = mongoose.models.StudentProfile || mongoose.model("StudentProfile", StudentProfileSchema);