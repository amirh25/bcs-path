import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  subjectId: { type: String, required: true },
  lectureNo: { type: Number, required: true },
  title: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  mainContent: { type: String, default: "" },
  mnemonic: { type: String, default: "" },
  confusionBox: { type: String, default: "" },
  previousQuestion: { type: String, default: "" },
}, { timestamps: true });

const QuestionSchema = new mongoose.Schema({
  bcsBatch: { type: String, required: true },
  subjectId: { type: String, required: true },
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

export const Lecture = mongoose.models.Lecture || mongoose.model("Lecture", LectureSchema);
export const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);
export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);