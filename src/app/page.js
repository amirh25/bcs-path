"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, CheckCircle2, Lock, Award, Sparkles,
  AlertTriangle, PlusCircle, Trash2, Clock,
  ShieldCheck, KeyRound, UserCheck, RefreshCw,
  Camera, Building2, EyeOff, Eye, FileText,
  HelpCircle, PenTool, RotateCcw, Shuffle, Upload, ChevronRight
} from "lucide-react";
import { initialSubjects, initialLectures, initialQuestionBank } from "../data/bcsData";

// Helper: Google Drive বা সাধারণ PDF লিংককে Embed-friendly লিংকে রূপান্তর করা
function formatPdfUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:application/pdf")) return url;
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return url;
}

export default function BCSPathPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [subjects] = useState(initialSubjects);
  const [lectures, setLectures] = useState(initialLectures);
  const [questionBank, setQuestionBank] = useState(initialQuestionBank);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  // ================= 1. STUDENT PROFILE STATE =================
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "রাফিউল ইসলাম",
    targetBcs: "লক্ষ্য: ৪৭তম BCS",
    institution: "",
    hideProfile: false,
    avatarUrl: "",
    progress: 36,
    completedLectures: 34,
    completedQuizzes: 12,
  });
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // ================= 2. LECTURE & 3-TIER PDF VIEWER STATE =================
  const [activeSubjectId, setActiveSubjectId] = useState("bangla");
  const [activeLecture, setActiveLecture] = useState(initialLectures[0]);
  // 'lecture' | 'mcq_pdf' | 'written_pdf'
  const [activePdfStep, setActivePdfStep] = useState("lecture");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [screenshotGuard, setScreenshotGuard] = useState(false);

  // ================= 3. CHAPTER EXAM ENGINE STATE =================
  const [examQuestions, setExamQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSourceMeta, setExamSourceMeta] = useState({ subjectId: "ALL", lectureNo: null });

  // ================= 4. QUESTION BANK & ADMIN STATE =================
  const [selectedBatch, setSelectedBatch] = useState("ALL");
  const [selectedQbSubject, setSelectedQbSubject] = useState("ALL");
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const [payForm, setPayForm] = useState({ name: "", phone: "", method: "বিকাশ", trxId: "" });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: "bangla",
    lectureNo: "",
    title: "",
    isFree: false,
    lecturePdfUrl: "",
    mcqPdfUrl: "",
    writtenPdfUrl: "",
    mainContent: "",
    mnemonic: "",
    confusionBox: "",
    previousQuestion: "",
  });

  const [newQuestion, setNewQuestion] = useState({
    bcsBatch: "৪৬তম বিসিএস",
    subjectId: "bangla",
    lectureNo: 1,
    question: "",
    opt0: "",
    opt1: "",
    opt2: "",
    opt3: "",
    correctAnswer: 0,
    explanation: "",
  });

  const [bulkJsonInput, setBulkJsonInput] = useState("");

  // Load Profile & Cloud Data
  const fetchCloudData = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("/api/platform");
      const data = await res.json();
      if (data.success) {
        setLectures(data.lectures);
        if (data.lectures.length > 0) setActiveLecture(data.lectures[0]);
        setQuestionBank(data.questions);
        setPaymentRequests(data.payments);

        const savedPhone = localStorage.getItem("bcs_user_phone");
        if (savedPhone) {
          setUserPhone(savedPhone);
          const approved = data.payments.some((p) => p.phone === savedPhone && p.status === "Approved");
          if (approved) setIsSubscribed(true);
        }
      }
    } catch (err) {
      console.error("Database fetch error:", err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudData();
    const savedSub = localStorage.getItem("bcs_path_subscribed");
    if (savedSub === "true") setIsSubscribed(true);

    const savedProf = localStorage.getItem("bcs_student_profile");
    if (savedProf) {
      try {
        setProfile(JSON.parse(savedProf));
      } catch (e) {}
    }
  }, []);

  // Save Profile Changes
  const updateProfile = async (updatedFields) => {
    const newProf = { ...profile, ...updatedFields };
    setProfile(newProf);
    localStorage.setItem("bcs_student_profile", JSON.stringify(newProf));
    try {
      await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SAVE_PROFILE",
          payload: { ...newProf, phone: userPhone || "guest_student" },
        }),
      });
    } catch (e) {}
  };

  // Profile Photo Upload Handler (Max 2MB)
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Local PDF File to DataURL Converter for Admin Upload
  const handleAdminPdfFileSelect = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("⚠️ ৪ মেগাবাইটের চেয়ে বড় PDF হলে সরাসরি ফাইল আপলোড না করে Google Drive-এ রেখে লিংকটি বক্সে পেস্ট করুন!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ================= EXAM ENGINE (50 RANDOM QUESTIONS, 30 SEC PER QUESTION) =================
  const startChapterExam = (subjectId = "ALL", lectureNo = null, titleText = "লাইভ মক টেস্ট") => {
    let pool = questionBank;

    if (subjectId !== "ALL") {
      const subMatched = questionBank.filter((q) => q.subjectId === subjectId);
      if (lectureNo !== null) {
        const chapMatched = subMatched.filter((q) => Number(q.lectureNo || 1) === Number(lectureNo));
        pool = chapMatched.length > 0 ? chapMatched : subMatched.length > 0 ? subMatched : questionBank;
      } else {
        pool = subMatched.length > 0 ? subMatched : questionBank;
      }
    }

    // Fisher-Yates Random Shuffle & Pick up to 50 Questions
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected50 = shuffled.slice(0, 50);

    setExamQuestions(selected50);
    setExamSourceMeta({ subjectId, lectureNo });
    setExamTitle(titleText);
    setExamAnswers({});
    setExamSubmitted(false);
    // 30 seconds per question!
    setTimeLeft(selected50.length * 30);
    setActiveTab("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Option 1: Retake the exact same question set
  const retakeSameQuestionSet = () => {
    setExamAnswers({});
    setExamSubmitted(false);
    setTimeLeft(examQuestions.length * 30);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Option 2: Start a brand new exam with newly shuffled 50 questions from same chapter
  const startNewRandomSetFromSameChapter = () => {
    startChapterExam(examSourceMeta.subjectId, examSourceMeta.lectureNo, examTitle);
  };

  // Exam Timer Countdown
  useEffect(() => {
    if (activeTab !== "exam" || examSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExamSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, examSubmitted]);

  const calculateExamResult = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    examQuestions.forEach((q) => {
      const qKey = q._id || q.id;
      if (examAnswers[qKey] === undefined) {
        unanswered += 1;
      } else if (examAnswers[qKey] === q.correctAnswer) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });
    const negativePenalty = wrong * 0.5;
    const finalScore = Math.max(0, correct - negativePenalty);
    return { correct, wrong, unanswered, negativePenalty, finalScore };
  };

  // Anti-Piracy Protection
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (activeTab !== "admin") {
        e.preventDefault();
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, [activeTab]);

  // Payment Submit
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payForm.phone || !payForm.trxId) {
      alert("অনুগ্রহ করে মোবাইল নম্বর এবং Transaction ID (TrxID) দিন!");
      return;
    }
    const payload = {
      name: payForm.name || profile.name,
      phone: payForm.phone,
      method: payForm.method,
      trxId: payForm.trxId.toUpperCase(),
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SUBMIT_PAYMENT", payload }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("bcs_user_phone", payForm.phone);
      setUserPhone(payForm.phone);
      setPayForm({ name: "", phone: "", method: "বিকাশ", trxId: "" });
      setShowPaymentModal(false);
      fetchCloudData();
      alert("✅ আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে! অ্যাডমিন অ্যাপ্রুভ করলেই সব প্রিমিয়াম নোট আনলক হয়ে যাবে।");
    }
  };

  const handleApprovePayment = async (id) => {
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "APPROVE_PAYMENT", adminPin: adminPinInput, payload: { id } }),
    });
    const data = await res.json();
    if (data.success) {
      setIsSubscribed(true);
      localStorage.setItem("bcs_path_subscribed", "true");
      fetchCloudData();
      alert("🎉 পেমেন্ট অ্যাপ্রুভ করা হয়েছে!");
    } else {
      alert(data.error);
    }
  };

  // Admin Save Lecture (with 3 PDFs)
  const handleSaveLecture = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.lectureNo) {
      alert("অনুগ্রহ করে লেকচার নম্বর এবং শিরোনাম দিন!");
      return;
    }
    const payload = {
      ...(editingId ? { _id: editingId } : {}),
      ...formData,
      lectureNo: Number(formData.lectureNo),
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SAVE_LECTURE", adminPin: adminPinInput, payload }),
    });
    const data = await res.json();
    if (data.success) {
      alert(editingId ? "✅ লেকচার ও PDF সফলভাবে আপডেট হয়েছে!" : "🎉 নতুন লেকচার ও PDF ক্লাউডে পাবলিশ হয়েছে!");
      setEditingId(null);
      setFormData({
        subjectId: "bangla",
        lectureNo: "",
        title: "",
        isFree: false,
        lecturePdfUrl: "",
        mcqPdfUrl: "",
        writtenPdfUrl: "",
        mainContent: "",
        mnemonic: "",
        confusionBox: "",
        previousQuestion: "",
      });
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteLecture = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই লেকচারটি ডিলিট করতে চান?")) return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE_LECTURE", adminPin: adminPinInput, payload: { id } }),
    });
    const data = await res.json();
    if (data.success) fetchCloudData();
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.opt0 || !newQuestion.opt1) {
      alert("প্রশ্ন এবং অপশনগুলো সঠিকভাবে পূরণ করুন!");
      return;
    }
    const payload = {
      bcsBatch: newQuestion.bcsBatch,
      subjectId: newQuestion.subjectId,
      lectureNo: Number(newQuestion.lectureNo || 1),
      question: newQuestion.question,
      options: [newQuestion.opt0, newQuestion.opt1, newQuestion.opt2, newQuestion.opt3],
      correctAnswer: Number(newQuestion.correctAnswer),
      explanation: newQuestion.explanation,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ADD_QUESTION", adminPin: adminPinInput, payload }),
    });
    const data = await res.json();
    if (data.success) {
      setNewQuestion({ ...newQuestion, question: "", opt0: "", opt1: "", opt2: "", opt3: "", explanation: "" });
      fetchCloudData();
      alert("✅ অধ্যায়ভিত্তিক প্রশ্ন ব্যাংকে নতুন MCQ যুক্ত হয়েছে!");
    }
  };

  const handleBulkQuestionUpload = async () => {
    try {
      const parsed = JSON.parse(bulkJsonInput);
      if (!Array.isArray(parsed)) throw new Error("JSON অবশ্যই একটি Array হতে হবে!");
      const res = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BULK_ADD_QUESTIONS",
          adminPin: adminPinInput,
          payload: { questions: parsed },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBulkJsonInput("");
        fetchCloudData();
        alert(`🎉 এক ক্লিকে ${data.count}টি MCQ প্রশ্ন সফলভাবে আপলোড হয়েছে!`);
      }
    } catch (err) {
      alert("❌ JSON ফরম্যাট সঠিক নয়! অনুগ্রহ করে নিচের নমুনার মতো করে দিন।");
    }
  };

  const handleEditClick = (lec) => {
    setEditingId(lec._id || lec.id);
    setFormData({
      subjectId: lec.subjectId,
      lectureNo: lec.lectureNo,
      title: lec.title,
      isFree: lec.isFree,
      lecturePdfUrl: lec.lecturePdfUrl || "",
      mcqPdfUrl: lec.mcqPdfUrl || "",
      writtenPdfUrl: lec.writtenPdfUrl || "",
      mainContent: lec.mainContent || "",
      mnemonic: lec.mnemonic || "",
      confusionBox: lec.confusionBox || "",
      previousQuestion: lec.previousQuestion || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSubject = subjects.find((s) => s.id === activeSubjectId) || subjects[0];
  const subjectLectures = lectures
    .filter((l) => l.subjectId === activeSubjectId)
    .sort((a, b) => a.lectureNo - b.lectureNo);

  const filteredQuestions = questionBank.filter((q) => {
    const batchMatch = selectedBatch === "ALL" || q.bcsBatch === selectedBatch;
    const subMatch = selectedQbSubject === "ALL" || q.subjectId === selectedQbSubject;
    return batchMatch && subMatch;
  });

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Select subject and go directly to Subject Lecture Notes page
  const handleSelectSubject = (subId) => {
    setActiveSubjectId(subId);
    const subLecs = lectures.filter((l) => l.subjectId === subId).sort((a, b) => a.lectureNo - b.lectureNo);
    if (subLecs.length > 0) {
      setActiveLecture(subLecs[0]);
    } else {
      setActiveLecture(null);
    }
    setActivePdfStep("lecture");
    setActiveTab("subject_lectures");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen bg-[#f8f9fb] pb-16 ${activeTab !== "admin" ? "select-none" : ""}`}>
      {/* ================= TOP NAVBAR ================= */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div onClick={() => setActiveTab("dashboard")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg">ব</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">বিসিএস পাঠ</h1>
              <p className="text-[11px] text-emerald-600 font-semibold">
                {dbLoading ? "ক্লাউড সিঙ্ক হচ্ছে..." : "● ক্লাউড ডাটাবেস সংযুক্ত"}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={() => setActiveTab("dashboard")} className={`${activeTab === "dashboard" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>ড্যাশবোর্ড</button>
            <button onClick={() => setActiveTab("syllabus")} className={`${activeTab === "syllabus" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>সিলেবাস (প্রিলি+রিটেন)</button>
            <button onClick={() => setActiveTab("subject_lectures")} className={`${activeTab === "subject_lectures" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>রঙিন লেকচার</button>
            <button onClick={() => startChapterExam("ALL", null, "৪৭তম বিসিএস পূর্ণাঙ্গ লাইভ মক টেস্ট")} className={`${activeTab === "exam" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>মক টেস্ট</button>
            <button onClick={() => setActiveTab("qbank")} className={`${activeTab === "qbank" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>প্রশ্ন ব্যাংক</button>
            <button onClick={() => setActiveTab("admin")} className={`${activeTab === "admin" ? "text-blue-600 font-bold border-b-2 border-blue-600" : "text-blue-600 hover:text-blue-800"} py-5 flex items-center gap-1`}>
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </nav>

          <button
            onClick={() => setShowPaymentModal(true)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${isSubscribed ? "bg-emerald-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
          >
            {isSubscribed ? "✓ প্রিমিয়াম সক্রিয়" : "সাবস্ক্রাইব · ২০০৳/৬ মাস"}
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden overflow-x-auto border-t bg-gray-50 px-4 py-2 gap-4 text-xs font-semibold whitespace-nowrap">
          <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "text-black underline" : "text-gray-500"}>ড্যাশবোর্ড</button>
          <button onClick={() => setActiveTab("syllabus")} className={activeTab === "syllabus" ? "text-black underline" : "text-gray-500"}>সিলেবাস</button>
          <button onClick={() => setActiveTab("subject_lectures")} className={activeTab === "subject_lectures" ? "text-black underline" : "text-gray-500"}>লেকচার ও PDF</button>
          <button onClick={() => startChapterExam("ALL", null, "লাইভ মক টেস্ট")} className={activeTab === "exam" ? "text-black underline" : "text-gray-500"}>মক টেস্ট</button>
          <button onClick={() => setActiveTab("qbank")} className={activeTab === "qbank" ? "text-black underline" : "text-gray-500"}>প্রশ্ন ব্যাংক</button>
          <button onClick={() => setActiveTab("admin")} className="text-blue-600 font-bold">অ্যাডমিন</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ================= 1. DASHBOARD WITH LEFT PROFILE PANEL ================= */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR: INTERACTIVE STUDENT PROFILE SYSTEM (3 Cols) */}
            <aside className="lg:col-span-3 bg-white rounded-2xl border p-5 shadow-xs space-y-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-full bg-amber-300 border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-3">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Student Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-gray-800">{profile.name.charAt(0)}</span>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="প্রোফাইল ছবি পরিবর্তন করুন"
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow hover:bg-black transition"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <h3
                  onClick={() => setShowProfileEditModal(true)}
                  className="font-bold text-base text-gray-900 cursor-pointer hover:underline"
                >
                  {profile.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">{profile.targetBcs}</p>

                {/* Institution Display (Respects Privacy Toggle) */}
                {profile.institution && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    {profile.hideProfile ? (
                      <span className="text-gray-500 italic flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> অন্যদের কাছে লুকানো
                      </span>
                    ) : (
                      <span>{profile.institution}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-600">মোট অগ্রগতি</span>
                  <span className="text-gray-900">{profile.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${profile.progress}%` }}></div>
                </div>
                <p className="text-[11px] text-gray-500">
                  {profile.completedLectures} টি লেকচার সম্পন্ন · {profile.completedQuizzes} টি কুইজ সম্পন্ন
                </p>
              </div>

              {/* Interactive Action Cards */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Upload Profile Photo Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 rounded-xl border bg-gray-50/70 hover:bg-gray-100 flex items-center justify-between text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">প্রোফাইল ছবি পরিবর্তন</div>
                      <div className="text-[10px] text-gray-400">JPG, PNG (সর্বোচ্চ 2MB)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* 2. Add/Edit Institution Button */}
                <button
                  onClick={() => setShowProfileEditModal(true)}
                  className="w-full p-3 rounded-xl border bg-gray-50/70 hover:bg-gray-100 flex items-center justify-between text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">প্রতিষ্ঠান (ঐচ্ছিক)</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[130px]">
                        {profile.institution ? profile.institution : "আপনার প্রতিষ্ঠান যোগ করুন"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* 3. Hide Profile / Institution Privacy Toggle */}
                <div className="w-full p-3 rounded-xl border bg-gray-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center">
                      {profile.hideProfile ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">প্রোফাইল লুকান</div>
                      <div className="text-[10px] text-gray-400 leading-tight">
                        আপনার প্রতিষ্ঠান অন্যদের জন্য লুকানো থাকবে
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateProfile({ hideProfile: !profile.hideProfile })}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                      profile.hideProfile ? "bg-black" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        profile.hideProfile ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </aside>

            {/* CENTER & RIGHT CONTENT (9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Top Hero Banner */}
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full font-semibold">৪৭তম ও ৪৮তম বিসিএস স্পেশাল</span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2">১০টি পূর্ণাঙ্গ সাবজেক্ট · ১৩০+ রঙিন লেকচার নোট</h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">প্রিলিমিনারি ২০০ নম্বর এবং লিখিত ৯০০ নম্বরের সম্পূর্ণ গোছানো প্রস্তুতি এক প্ল্যাটফর্মে।</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab("syllabus")} className="px-4 py-2.5 bg-white text-black rounded-xl text-xs font-bold hover:bg-gray-100">
                    সিলেবাস ও মানবণ্টন
                  </button>
                  <button
                    onClick={() => startChapterExam("ALL", null, "৪৭তম বিসিএস স্পেশাল লাইভ মক টেস্ট")}
                    className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600"
                  >
                    লাইভ মক টেস্ট দিন
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 10 BCS Subjects Grid */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">বিসিএস-এর সকল সাবজেক্ট ({subjects.length}টি)</h3>
                    <span className="text-xs text-blue-600 font-semibold">সাবজেক্টে ক্লিক করলেই লেকচার পেজ ওপেন হবে →</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subjects.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectSubject(sub.id)}
                        className="p-4 rounded-xl border bg-white cursor-pointer transition hover:shadow-md hover:border-black group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${sub.bg} ${sub.text} font-bold flex items-center justify-center text-sm`}>
                              {sub.initial}
                            </div>
                            <div>
                              <div className="font-bold text-sm group-hover:text-blue-600 transition">{sub.title}</div>
                              <div className="text-[11px] text-gray-400">{sub.lecturesCount}টি লেকচার · {sub.hours} ঘণ্টা</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 block">প্রিলি: {sub.preliMarks}</span>
                            {sub.writtenMarks > 0 && (
                              <span className="text-[10px] text-blue-600 font-semibold">লিখিত: {sub.writtenMarks}</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-2">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${sub.progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>সম্পন্ন {sub.completed}/{sub.lecturesCount}</span>
                          <span className="font-semibold">{sub.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Cards */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border shadow-xs">
                    <div className="font-bold text-sm mb-1">আজকের লাইভ মক টেস্ট</div>
                    <p className="text-xs text-gray-500 mb-4">প্রতি প্রশ্নের সময়: ৩০ সেকেন্ড · নেগেটিভ মার্কিং: ০.৫০</p>
                    <button
                      onClick={() => startChapterExam("ALL", null, "আজকের লাইভ মক টেস্ট (৫০টি র‍্যান্ডম প্রশ্ন)")}
                      className="w-full py-2.5 bg-black text-white font-semibold rounded-xl text-xs hover:bg-gray-800 transition"
                    >
                      মক টেস্ট শুরু করুন →
                    </button>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border shadow-xs">
                    <div className="font-bold text-sm mb-1">বিসিএস মানবণ্টন সামারি</div>
                    <p className="text-xs text-gray-500 mb-4">পিএসসি নির্ধারিত সর্বশেষ সিলেবাস</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-2.5 bg-blue-50 text-blue-900 rounded-lg font-semibold">
                        <span>প্রিলিমিনারি পরীক্ষা (MCQ)</span>
                        <span>২০০ নম্বর</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-purple-50 text-purple-900 rounded-lg font-semibold">
                        <span>লিখিত পরীক্ষা (আবশ্যিক)</span>
                        <span>৯০০ নম্বর</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-lg font-semibold">
                        <span>মৌখিক পরীক্ষা (Viva)</span>
                        <span>২০০ নম্বর</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. SUBJECT LECTURE NOTES + 3-TIER PDF & CHAPTER EXAM FLOW ================= */}
        {activeTab === "subject_lectures" && (
          <div className="space-y-6">
            {/* Subject Switcher Bar */}
            <div className="bg-white p-4 rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold hover:bg-gray-50"
                >
                  ← ড্যাশবোর্ড
                </button>
                <div>
                  <h2 className="font-bold text-base sm:text-lg">{currentSubject.title} — সকল লেকচার ও পিডিএফ হাব</h2>
                  <p className="text-xs text-gray-500">
                    প্রিলিমিনারি: {currentSubject.preliMarks} নম্বর · লিখিত: {currentSubject.writtenMarks} নম্বর
                  </p>
                </div>
              </div>

              <select
                value={activeSubjectId}
                onChange={(e) => handleSelectSubject(e.target.value)}
                className="px-3.5 py-2 border rounded-xl text-xs font-bold bg-gray-50"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Lecture List for Selected Subject (4 Cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl border p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b pb-3">
                  <span className="font-bold text-sm">অধ্যায় / লেকচার তালিকা ({subjectLectures.length}টি)</span>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, subjectId: currentSubject.id, lectureNo: subjectLectures.length + 1 });
                      setActiveTab("admin");
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> লেকচার যোগ
                  </button>
                </div>

                {subjectLectures.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed">
                    <p className="text-xs text-gray-500 mb-3">এই বিষয়ে এখনো কোনো লেকচার PDF আপলোড করা হয়নি।</p>
                    <button
                      onClick={() => {
                        setFormData({ ...formData, subjectId: currentSubject.id, lectureNo: 1 });
                        setActiveTab("admin");
                      }}
                      className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold"
                    >
                      + লেকচার ০১ আপলোড করুন
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {subjectLectures.map((lec) => {
                      const isLocked = !lec.isFree && !isSubscribed;
                      const isSelected = (activeLecture?._id || activeLecture?.id) === (lec._id || lec.id);
                      return (
                        <div
                          key={lec._id || lec.id}
                          onClick={() => {
                            if (isLocked) {
                              setShowPaymentModal(true);
                            } else {
                              setActiveLecture(lec);
                              setActivePdfStep("lecture");
                            }
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                            isSelected ? "bg-black text-white border-black" : "bg-white hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center ${
                                isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {lec.lectureNo < 10 ? `0${lec.lectureNo}` : lec.lectureNo}
                            </span>
                            <div>
                              <div className="text-xs font-bold leading-snug">Lecture {lec.lectureNo < 10 ? `0${lec.lectureNo}` : lec.lectureNo}: {lec.title}</div>
                              <div className={`text-[10px] mt-0.5 ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                                লেকচার PDF · ৫০০ MCQ PDF · লিখিত PDF
                              </div>
                            </div>
                          </div>
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                          ) : (
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? "text-emerald-400" : "text-emerald-600"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Complete Guided Flow (Lecture PDF -> Chapter MCQ PDF -> Written PDF -> Online Exam) (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {!activeLecture ? (
                  <div className="bg-white rounded-2xl border p-12 text-center text-gray-500 text-sm">
                    বাম পাশের তালিকা থেকে একটি লেকচার নির্বাচন করুন।
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border shadow-xs p-6 relative overflow-hidden space-y-6">
                    {/* Step Progression Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                          {currentSubject.title} · Lecture {activeLecture.lectureNo < 10 ? `0${activeLecture.lectureNo}` : activeLecture.lectureNo}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold mt-1">{activeLecture.title}</h3>
                      </div>

                      <button
                        onClick={() => setScreenshotGuard(!screenshotGuard)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${
                          screenshotGuard ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {screenshotGuard ? "আনব্লার করুন" : "স্ক্রিনশট গার্ড"}
                      </button>
                    </div>

                    {/* 3-Tier Resource Tabs (1. Lecture PDF, 2. All MCQ PDF, 3. Written Q&A PDF) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => setActivePdfStep("lecture")}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                          activePdfStep === "lecture"
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        <FileText className="w-5 h-5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">১. মূল লেকচার PDF</div>
                          <div className={`text-[10px] ${activePdfStep === "lecture" ? "text-blue-100" : "text-gray-500"}`}>
                            রঙিন নোট ও শর্টকাট
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActivePdfStep("mcq_pdf")}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                          activePdfStep === "mcq_pdf"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        <HelpCircle className="w-5 h-5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">২. এই Chapter-এর সকল MCQ</div>
                          <div className={`text-[10px] ${activePdfStep === "mcq_pdf" ? "text-emerald-100" : "text-gray-500"}`}>
                            অধ্যায়ভিত্তিক MCQ PDF শিট
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setActivePdfStep("written_pdf")}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 ${
                          activePdfStep === "written_pdf"
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        <PenTool className="w-5 h-5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold">৩. লিখিত প্রশ্ন ও উত্তর PDF</div>
                          <div className={`text-[10px] ${activePdfStep === "written_pdf" ? "text-purple-100" : "text-gray-500"}`}>
                            Written Q&A গাইডলাইন
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Active PDF / Content Viewer */}
                    <div className={`space-y-6 transition duration-300 ${screenshotGuard ? "filter blur-lg select-none" : ""}`}>
                      
                      {/* VIEW 1: LECTURE PDF & NOTES */}
                      {activePdfStep === "lecture" && (
                        <div className="space-y-5">
                          {activeLecture.lecturePdfUrl ? (
                            <div className="rounded-xl overflow-hidden border bg-gray-900">
                              <div className="bg-gray-800 text-white px-4 py-2 text-xs font-semibold flex justify-between items-center">
                                <span>📄 Lecture {activeLecture.lectureNo} — সম্পূর্ণ রঙিন লেকচার PDF ভিউয়ার</span>
                                <span className="text-emerald-400">Anti-Copy সক্রিয়</span>
                              </div>
                              <iframe
                                src={formatPdfUrl(activeLecture.lecturePdfUrl)}
                                className="w-full h-[550px] bg-white"
                                title="Lecture PDF Viewer"
                              />
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-blue-900">
                              💡 <strong>অ্যাডমিন নোট:</strong> এই লেকচারে এখনো আলাদা PDF ফাইল যুক্ত করা হয়নি (নিচে টেক্সট নোট দেখানো হচ্ছে)। অ্যাডমিন প্যানেল থেকে যেকোনো সময় রঙিন PDF আপলোড করতে পারবেন।
                            </div>
                          )}

                          {/* Colorful Text Boxes (if available) */}
                          {activeLecture.mainContent && (
                            <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200">
                              <div className="font-bold text-blue-950 text-sm mb-2 flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-blue-600" /> মূল লেকচার সারসংক্ষেপ
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{activeLecture.mainContent}</p>
                            </div>
                          )}
                          {activeLecture.mnemonic && (
                            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                              <div className="font-bold text-emerald-800 text-sm mb-1.5 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-emerald-600" /> মনে রাখার সুপার টেকনিক (Mnemonics)
                              </div>
                              <p className="text-sm text-emerald-950 leading-relaxed whitespace-pre-line">{activeLecture.mnemonic}</p>
                            </div>
                          )}
                          {activeLecture.confusionBox && (
                            <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                              <div className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-amber-600" /> কনফিউশন ক্লিয়ার বক্স
                              </div>
                              <div className="text-sm text-amber-950 leading-relaxed whitespace-pre-line">{activeLecture.confusionBox}</div>
                            </div>
                          )}

                          {/* Next Step Action Box: Go to Chapter MCQ PDF */}
                          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-sm text-emerald-950">লেকচার PDF পড়া শেষ করেছেন?</h4>
                              <p className="text-xs text-emerald-700">এখন এই অধ্যায়ের সকল MCQ প্রশ্নের PDF শিটটি পড়ে ফেলুন।</p>
                            </div>
                            <button
                              onClick={() => setActivePdfStep("mcq_pdf")}
                              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 whitespace-nowrap shadow-xs"
                            >
                              এই Chapter-এর সকল MCQ দেখুন →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: CHAPTER MCQ PDF (e.g. 500 MCQs PDF) */}
                      {activePdfStep === "mcq_pdf" && (
                        <div className="space-y-5">
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-sm text-emerald-950">
                                📚 এই Chapter-এর সকল MCQ PDF (Lecture {activeLecture.lectureNo})
                              </h4>
                              <p className="text-xs text-emerald-700">
                                সম্পূর্ণ MCQ PDF শিটটি পড়ার পর নিচে "পরীক্ষা দিন" বাটনে ক্লিক করে অনলাইন পরীক্ষায় অংশ নিন।
                              </p>
                            </div>
                          </div>

                          {activeLecture.mcqPdfUrl ? (
                            <div className="rounded-xl overflow-hidden border bg-gray-900">
                              <div className="bg-emerald-900 text-white px-4 py-2 text-xs font-semibold flex justify-between items-center">
                                <span>📑 অধ্যায়ভিত্তিক পূর্ণাঙ্গ MCQ ব্যাংক PDF (৫০০+ প্রশ্নোত্তর)</span>
                                <span>Read-Only Mode</span>
                              </div>
                              <iframe
                                src={formatPdfUrl(activeLecture.mcqPdfUrl)}
                                className="w-full h-[550px] bg-white"
                                title="Chapter MCQ PDF Viewer"
                              />
                            </div>
                          ) : (
                            <div className="p-8 rounded-xl border border-dashed text-center bg-gray-50">
                              <p className="text-sm font-semibold text-gray-700 mb-1">এই অধ্যায়ের MCQ PDF এখনো আপলোড করা হয়নি</p>
                              <p className="text-xs text-gray-500 mb-4">অ্যাডমিন প্যানেল থেকে এই লেকচারের জন্য ৫০০টি MCQ-সংবলিত PDF আপলোড করতে পারবেন।</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* VIEW 3: WRITTEN QUESTION WITH ANSWER PDF */}
                      {activePdfStep === "written_pdf" && (
                        <div className="space-y-5">
                          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                            <h4 className="font-bold text-sm text-purple-950">
                              ✍️ বিসিএস লিখিত প্রশ্ন ও উত্তর PDF (Lecture {activeLecture.lectureNo})
                            </h4>
                            <p className="text-xs text-purple-700">
                              এই অধ্যায়ের বিগত সালের বিসিএস লিখিত প্রশ্ন এবং স্ট্যান্ডার্ড নমুনা উত্তর ও ডায়াগ্রাম।
                            </p>
                          </div>

                          {activeLecture.writtenPdfUrl ? (
                            <div className="rounded-xl overflow-hidden border bg-gray-900">
                              <div className="bg-purple-900 text-white px-4 py-2 text-xs font-semibold flex justify-between items-center">
                                <span>📝 লিখিত প্রশ্ন ও উত্তর (Written Q&A PDF)</span>
                                <span>৯০০ নম্বরের প্রস্তুতি</span>
                              </div>
                              <iframe
                                src={formatPdfUrl(activeLecture.writtenPdfUrl)}
                                className="w-full h-[550px] bg-white"
                                title="Written Q&A PDF Viewer"
                              />
                            </div>
                          ) : (
                            <div className="p-8 rounded-xl border border-dashed text-center bg-gray-50">
                              <p className="text-sm font-semibold text-gray-700 mb-1">এই অধ্যায়ের লিখিত প্রশ্নোত্তর PDF এখনো আপলোড করা হয়নি</p>
                              <p className="text-xs text-gray-500">অ্যাডমিন প্যানেল থেকে Written Question with Answer PDF যুক্ত করুন।</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* BOTTOM CTA: ONLINE CHAPTER EXAM BUTTON ("পরীক্ষা দিন") */}
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 to-black text-white flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                            ধাপ ৪ · অনলাইন অ্যাসেসমেন্ট
                          </span>
                          <h4 className="font-bold text-base mt-1.5">এই অধ্যায়ের অনলাইন MCQ পরীক্ষায় অংশ নিন</h4>
                          <p className="text-xs text-gray-300 mt-0.5">
                            এলোমেলোভাবে ৫০টি প্রশ্ন · প্রতি প্রশ্নের সময় ৩০ সেকেন্ড · ভুল উত্তরের বিস্তারিত ব্যাখ্যাসহ ফলাফল
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            startChapterExam(
                              activeLecture.subjectId,
                              activeLecture.lectureNo,
                              `Lecture ${activeLecture.lectureNo}: ${activeLecture.title}`
                            )
                          }
                          className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-sm font-black hover:bg-emerald-600 whitespace-nowrap shadow-lg cursor-pointer"
                        >
                          পরীক্ষা দিন →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. SYLLABUS TAB ================= */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold">বিসিএস পূর্ণাঙ্গ সিলেবাস ও নম্বর বণ্টন (প্রিলি + রিটেন)</h2>
                <p className="text-xs text-gray-500 mt-1">কোন সাবজেক্টের কোন টপিক থেকে কত নম্বর আসে তার নিখুঁত গাইডলাইন</p>
              </div>
              <div className="flex gap-2 text-xs font-bold">
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">প্রিলি মোট: ২০০</span>
                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg">রিটেন মোট: ৯০০</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {subjects.map((sub, idx) => (
                <div key={sub.id} className="bg-white rounded-2xl border shadow-xs overflow-hidden">
                  <div className="p-5 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-lg ${sub.bg} ${sub.text} font-bold flex items-center justify-center`}>{idx + 1}</span>
                      <div>
                        <h3 className="font-bold text-base">{sub.title}</h3>
                        <p className="text-xs text-gray-500">মোট লেকচার নোট: {sub.lecturesCount}টি</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectSubject(sub.id)}
                        className="px-3 py-1 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800"
                      >
                        লেকচার ও PDF দেখুন →
                      </button>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">প্রিলিমিনারি: {sub.preliMarks}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sub.syllabusBreakdown.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl border bg-gray-50/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-sm text-gray-900">{item.topic}</span>
                            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{item.marks} নম্বর</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. CHAPTER-WISE RANDOM 50 MCQ EXAM SYSTEM ================= */}
        {activeTab === "exam" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-xs flex flex-wrap justify-between items-center gap-4 sticky top-16 z-30">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase">অনলাইন এমসিকিউ পরীক্ষা · ৩০ সেকেন্ড/প্রশ্ন</span>
                <h2 className="text-lg sm:text-xl font-bold">{examTitle || "বিসিএস অধ্যায়ভিত্তিক পরীক্ষা"}</h2>
                <p className="text-xs text-gray-500">
                  মোট প্রশ্ন: {examQuestions.length}টি (এলোমেলোভাবে নির্বাচিত) · সঠিক উত্তরে +১ · ভুল উত্তরে -০.৫০
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm">
                  <Clock className="w-4 h-4" /> সময় বাকি: {formatTime(timeLeft)}
                </div>
                {!examSubmitted && (
                  <button
                    onClick={() => setExamSubmitted(true)}
                    className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800"
                  >
                    খাতা জমা দিন
                  </button>
                )}
              </div>
            </div>

            {/* Exam Result & Retake Options */}
            {examSubmitted && (
              <div className="bg-white border-2 border-emerald-500 p-6 rounded-2xl shadow-sm space-y-6">
                {(() => {
                  const res = calculateExamResult();
                  return (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                        <div>
                          <h3 className="text-xl font-black text-gray-900">📊 আপনার পরীক্ষার ফলাফল কার্ড</h3>
                          <p className="text-xs text-gray-500">নিচে আপনার প্রতিটি ভুল উত্তরের বিস্তারিত ব্যাখ্যা দেওয়া হয়েছে</p>
                        </div>

                        {/* RETAKE & NEW RANDOM 50 SET BUTTONS */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={retakeSameQuestionSet}
                            className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-4 h-4" /> একই প্রশ্নসেটে আবার পরীক্ষা দিন
                          </button>
                          <button
                            onClick={startNewRandomSetFromSameChapter}
                            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                          >
                            <Shuffle className="w-4 h-4" /> নতুন প্রশ্নসেটে আরেকটি পরীক্ষা দিন (Random 50)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-xl border">
                          <div className="text-xs text-gray-500">মোট প্রশ্ন</div>
                          <div className="text-xl font-bold">{examQuestions.length}</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                          <div className="text-xs text-emerald-700">সঠিক উত্তর (+১)</div>
                          <div className="text-xl font-bold text-emerald-700">{res.correct}</div>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                          <div className="text-xs text-rose-700">ভুল উত্তর</div>
                          <div className="text-xl font-bold text-rose-700">{res.wrong}</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                          <div className="text-xs text-amber-700">নেগেটিভ কর্তন (-০.৫)</div>
                          <div className="text-xl font-bold text-amber-700">-{res.negativePenalty}</div>
                        </div>
                        <div className="bg-black text-white p-4 rounded-xl">
                          <div className="text-xs text-gray-300">চূড়ান্ত প্রাপ্ত নম্বর</div>
                          <div className="text-2xl font-black text-emerald-400">{res.finalScore}</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const qKey = q._id || q.id;
                const selectedOpt = examAnswers[qKey];
                const isWrongAnswer = examSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctAnswer;

                return (
                  <div
                    key={qKey}
                    className={`bg-white p-6 rounded-2xl border shadow-xs ${
                      isWrongAnswer ? "ring-2 ring-rose-400 bg-rose-50/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="font-bold text-sm sm:text-base">
                        {idx + 1}. {q.question}
                      </h3>
                      {isWrongAnswer && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-[11px] font-bold shrink-0">
                          ✗ ভুল উত্তর
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        let style = "bg-white hover:border-black";
                        if (!examSubmitted && selectedOpt === optIdx) {
                          style = "bg-black text-white border-black font-bold";
                        } else if (examSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            style = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                          } else if (selectedOpt === optIdx) {
                            style = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                          }
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={examSubmitted}
                            onClick={() => setExamAnswers({ ...examAnswers, [qKey]: optIdx })}
                            className={`p-3 rounded-xl border text-left text-xs transition ${style}`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Show Detailed Explanation for Wrong Answers (and after submission) */}
                    {examSubmitted && (
                      <div
                        className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
                          isWrongAnswer
                            ? "bg-rose-50 border-rose-200 text-rose-950"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="font-bold mb-1">
                          ✓ সঠিক উত্তর: {q.options[q.correctAnswer]}
                        </div>
                        <div>
                          <strong>ব্যাখ্যা:</strong> {q.explanation || "সঠিক উত্তরটি সিলেবাস ও প্রামাণ্য তথ্যের ভিত্তিতে যাচাইকৃত।"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 5. QUESTION BANK TAB ================= */}
        {activeTab === "qbank" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold">বিসিএস প্রশ্ন ব্যাংক (১০ম - ৪৬তম বিসিএস ও অধ্যায়ভিত্তিক)</h2>
                <p className="text-xs text-gray-500 mt-1">সাল ও বিষয়ভিত্তিক ফিল্টার করে ব্যাখ্যাসহ বিগত সালের প্রশ্ন অনুশীলন করুন</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-3 py-2 border rounded-xl text-xs font-semibold bg-gray-50">
                  <option value="ALL">সকল বিসিএস (১০ম - ৪৬তম)</option>
                  <option value="৪৬তম বিসিএস">৪৬তম বিসিএস</option>
                  <option value="৪৫তম বিসিএস">৪৫তম বিসিএস</option>
                  <option value="৪৪তম বিসিএস">৪৪তম বিসিএস</option>
                  <option value="অধ্যায়ভিত্তিক">অধ্যায়ভিত্তিক</option>
                </select>
                <select value={selectedQbSubject} onChange={(e) => setSelectedQbSubject(e.target.value)} className="px-3 py-2 border rounded-xl text-xs font-semibold bg-gray-50">
                  <option value="ALL">সকল বিষয়</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const qKey = q._id || q.id;
                const isRevealed = revealedAnswers[qKey];
                return (
                  <div key={qKey} className="bg-white p-6 rounded-2xl border shadow-xs">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="font-bold text-sm sm:text-base">{idx + 1}. {q.question}</h3>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold whitespace-nowrap">
                        {q.bcsBatch} · Lec {q.lectureNo || 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => setRevealedAnswers({ ...revealedAnswers, [qKey]: true })}
                            className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                              isRevealed ? (isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold" : "bg-gray-50 text-gray-500") : "hover:border-black"
                            }`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => setRevealedAnswers({ ...revealedAnswers, [qKey]: !isRevealed })} className="text-xs font-bold text-blue-600 hover:underline">
                      {isRevealed ? "ব্যাখ্যা লুকান ▲" : "সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা দেখুন ▼"}
                    </button>
                    {isRevealed && (
                      <div className="mt-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                        <strong>সঠিক উত্তর:</strong> {q.options[q.correctAnswer]} <br />
                        <strong>ব্যাখ্যা:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 6. CLOUD ADMIN CMS (PDF UPLOADER + CHAPTER MCQ SETTER) ================= */}
        {activeTab === "admin" && (
          <div>
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm text-center my-12">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold mb-1">অ্যাডমিন সিকিউরিটি লক</h2>
                <p className="text-xs text-gray-500 mb-5">লেকচার PDF, MCQ PDF, Written PDF ও প্রশ্ন আপলোড করতে পিন দিন (`bcs2026`)</p>
                <input
                  type="password"
                  placeholder="অ্যাডমিন পিন লিখুন (bcs2026)"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="w-full p-3 border rounded-xl text-xs mb-4 text-center outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => {
                    if (adminPinInput === "bcs2026") setIsAdminUnlocked(true);
                    else alert("❌ ভুল পিন! সঠিক পিন দিন: bcs2026");
                  }}
                  className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800"
                >
                  অ্যাডমিন প্যানেল আনলক করুন
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 1. Lecture & 3-PDF Upload Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-xs">
                    <h2 className="text-lg font-bold mb-1">
                      {editingId ? "✏️ লেকচার ও PDF আপডেট করুন" : "➕ নতুন লেকচার, MCQ PDF ও Written PDF আপলোড করুন"}
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">
                      কম্পিউটার থেকে সরাসরি PDF ফাইল সিলেক্ট করুন অথবা বড় ফাইলের ক্ষেত্রে Google Drive লিংক দিন
                    </p>

                    <form onSubmit={handleSaveLecture} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="font-bold block mb-1">সাবজেক্ট নির্বাচন করুন</label>
                          <select value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full p-2.5 border rounded-xl bg-gray-50 font-semibold">
                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="font-bold block mb-1">লেকচার নম্বর (যেমন: 1, 2)</label>
                          <input type="number" placeholder="যেমন: 1" value={formData.lectureNo} onChange={(e) => setFormData({ ...formData, lectureNo: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer p-2.5 border rounded-xl w-full bg-gray-50">
                            <input type="checkbox" checked={formData.isFree} onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })} />
                            <span className="font-semibold">ফ্রি লেকচার? (সবার জন্য উন্মুক্ত)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold block mb-1">লেকচারের শিরোনাম (Title)</label>
                        <input type="text" placeholder="যেমন: Lecture 01 - প্রাচীন বাংলার জনপদ ও ইতিহাস" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                      </div>

                      {/* 3-TIER PDF UPLOAD BOXES */}
                      <div className="grid grid-cols-1 gap-4 p-4 rounded-2xl bg-gray-50 border">
                        <div className="font-bold text-sm text-gray-900">📎 অধ্যায়ভিত্তিক ৩টি PDF ফাইল যুক্ত করুন:</div>

                        {/* PDF 1: Lecture PDF */}
                        <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-2">
                          <label className="font-bold text-blue-800 block">১. মূল লেকচার নোট PDF (AI ডিজাইনকৃত রঙিন নোট)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="PDF-এর Google Drive লিংক বা URL পেস্ট করুন..."
                              value={formData.lecturePdfUrl}
                              onChange={(e) => setFormData({ ...formData, lecturePdfUrl: e.target.value })}
                              className="flex-1 p-2 border rounded-lg"
                            />
                            <label className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-3.5 h-3.5" /> ফাইল সিলেক্ট করুন
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "lecturePdfUrl")} className="hidden" />
                            </label>
                          </div>
                        </div>

                        {/* PDF 2: Chapter 500 MCQ PDF */}
                        <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2">
                          <label className="font-bold text-emerald-800 block">২. “এই Chapter-এর সকল MCQ” PDF (যেমন: ৫০০টি MCQ শিট)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="অধ্যায়ভিত্তিক সকল MCQ PDF-এর লিংক পেস্ট করুন..."
                              value={formData.mcqPdfUrl}
                              onChange={(e) => setFormData({ ...formData, mcqPdfUrl: e.target.value })}
                              className="flex-1 p-2 border rounded-lg"
                            />
                            <label className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-3.5 h-3.5" /> ফাইল সিলেক্ট করুন
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "mcqPdfUrl")} className="hidden" />
                            </label>
                          </div>
                        </div>

                        {/* PDF 3: Written Question with Answer PDF */}
                        <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-2">
                          <label className="font-bold text-purple-800 block">৩. লিখিত প্রশ্ন ও উত্তর PDF (Written Question with Answer)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="লিখিত প্রশ্ন ও উত্তরের PDF লিংক পেস্ট করুন..."
                              value={formData.writtenPdfUrl}
                              onChange={(e) => setFormData({ ...formData, writtenPdfUrl: e.target.value })}
                              className="flex-1 p-2 border rounded-lg"
                            />
                            <label className="px-3 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-3.5 h-3.5" /> ফাইল সিলেক্ট করুন
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "writtenPdfUrl")} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold block mb-1 text-gray-700">অতিরিক্ত টেক্সট নোট / সারসংক্ষেপ (ঐচ্ছিক)</label>
                        <textarea rows={3} placeholder="চাইলে লেকচারের টেক্সট নোটও এখানে দিতে পারেন..." value={formData.mainContent} onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })} className="w-full p-3 border rounded-xl" />
                      </div>

                      <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800">
                        {editingId ? "আপডেট সেভ করুন" : "লেকচার ও PDF পাবলিশ করুন"}
                      </button>
                    </form>
                  </div>

                  {/* Uploaded Lectures List */}
                  <div className="bg-white p-6 rounded-2xl border shadow-xs">
                    <h3 className="font-bold text-base mb-4">আপলোডকৃত লেকচার তালিকা ({lectures.length}টি)</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {lectures.map((lec) => {
                        const subName = subjects.find((s) => s.id === lec.subjectId)?.title;
                        const lKey = lec._id || lec.id;
                        return (
                          <div key={lKey} className="p-3.5 rounded-xl border bg-gray-50 flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{subName} · Lec {lec.lectureNo}</span>
                              <span className="text-[10px] font-bold">{lec.isFree ? "Free" : "Premium"}</span>
                            </div>
                            <div className="font-bold text-xs">{lec.title}</div>
                            <div className="flex flex-wrap gap-1 text-[10px]">
                              {lec.lecturePdfUrl && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border">✓ Lecture PDF</span>}
                              {lec.mcqPdfUrl && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border">✓ MCQ PDF</span>}
                              {lec.writtenPdfUrl && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border">✓ Written PDF</span>}
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => { setActiveSubjectId(lec.subjectId); setActiveLecture(lec); setActiveTab("subject_lectures"); }} className="flex-1 py-1.5 bg-white border rounded-lg text-[11px] font-semibold">দেখুন</button>
                              <button onClick={() => handleEditClick(lec)} className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold">এডিট</button>
                              <button onClick={() => handleDeleteLecture(lKey)} className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Chapter-wise Online Exam Question Setter */}
                <div className="bg-white p-6 rounded-2xl border shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold text-base">🎯 অধ্যায়ভিত্তিক অনলাইন পরীক্ষার MCQ প্রশ্ন সেট করুন</h3>
                    <p className="text-xs text-gray-500">
                      নির্দিষ্ট সাবজেক্ট এবং লেকচার নম্বর (যেমন: Lecture 1) সিলেক্ট করে প্রশ্ন যোগ করুন। স্টুডেন্টরা ওই লেকচারের নিচে "পরীক্ষা দিন" বাটনে ক্লিক করলে এখান থেকেই এলোমেলোভাবে ৫০টি প্রশ্ন আসবে।
                    </p>
                  </div>

                  <form onSubmit={handleAddQuestion} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="font-bold block mb-1">সাবজেক্ট</label>
                      <select value={newQuestion.subjectId} onChange={(e) => setNewQuestion({ ...newQuestion, subjectId: e.target.value })} className="w-full p-2.5 border rounded-xl bg-gray-50">
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold block mb-1">লেকচার / অধ্যায় নম্বর</label>
                      <input type="number" placeholder="যেমন: 1" value={newQuestion.lectureNo} onChange={(e) => setNewQuestion({ ...newQuestion, lectureNo: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">বিসিএস ব্যাচ / ট্যাগ</label>
                      <input type="text" placeholder="যেমন: ৪৬তম বিসিএস" value={newQuestion.bcsBatch} onChange={(e) => setNewQuestion({ ...newQuestion, bcsBatch: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                    </div>

                    <input type="text" placeholder="প্রশ্নটি লিখুন..." value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className="sm:col-span-3 p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন ক" value={newQuestion.opt0} onChange={(e) => setNewQuestion({ ...newQuestion, opt0: e.target.value })} className="p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন খ" value={newQuestion.opt1} onChange={(e) => setNewQuestion({ ...newQuestion, opt1: e.target.value })} className="p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন গ" value={newQuestion.opt2} onChange={(e) => setNewQuestion({ ...newQuestion, opt2: e.target.value })} className="p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন ঘ" value={newQuestion.opt3} onChange={(e) => setNewQuestion({ ...newQuestion, opt3: e.target.value })} className="p-2.5 border rounded-xl" />
                    <select value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} className="p-2.5 border rounded-xl bg-gray-50 font-bold">
                      <option value={0}>সঠিক উত্তর: ক</option>
                      <option value={1}>সঠিক উত্তর: খ</option>
                      <option value={2}>সঠিক উত্তর: গ</option>
                      <option value={3}>সঠিক উত্তর: ঘ</option>
                    </select>
                    <textarea rows={2} placeholder="ভুল উত্তর দিলে যে বিস্তারিত ব্যাখ্যা দেখানো হবে তা লিখুন..." value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} className="sm:col-span-3 p-2.5 border rounded-xl" />
                    <button type="submit" className="sm:col-span-3 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                      + অধ্যায়ভিত্তিক প্রশ্ন ব্যাংকে যুক্ত করুন
                    </button>
                  </form>

                  {/* Bulk 50-500 MCQ JSON Importer */}
                  <div className="border-t pt-5">
                    <h4 className="font-bold text-xs text-gray-800 mb-1">⚡ এক ক্লিকে ৫০-৫০০টি MCQ বাল্ক আপলোড (JSON Format)</h4>
                    <textarea
                      rows={3}
                      placeholder='[{"subjectId":"bangla","lectureNo":1,"bcsBatch":"অধ্যায় ১","question":"চর্যাপদ কোন ছন্দে রচিত?","options":["মাত্রাবৃত্ত","অক্ষরবৃত্ত","স্বরবৃত্ত","গদ্যছন্দ"],"correctAnswer":0,"explanation":"আধুনিক বাংলা ছন্দের বিচারে চর্যাপদ মাত্রাবৃত্ত ছন্দে রচিত।"}]'
                      value={bulkJsonInput}
                      onChange={(e) => setBulkJsonInput(e.target.value)}
                      className="w-full p-3 border rounded-xl text-xs font-mono bg-gray-50 mb-2"
                    />
                    <button onClick={handleBulkQuestionUpload} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold">
                      সবগুলো প্রশ্ন একসাথে আপলোড করুন
                    </button>
                  </div>
                </div>

                {/* 3. Payment Verification Table */}
                <div className="bg-white p-6 rounded-2xl border shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-600" /> স্টুডেন্ট সাবস্ক্রিপশন ও পেমেন্ট অ্যাপ্রুভাল ({paymentRequests.length}টি)
                    </h3>
                    <button onClick={fetchCloudData} className="px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-gray-50">
                      <RefreshCw className="w-3.5 h-3.5" /> রিফ্রেশ
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                          <th className="p-3">নাম</th>
                          <th className="p-3">মোবাইল নম্বর</th>
                          <th className="p-3">মাধ্যম</th>
                          <th className="p-3">TrxID</th>
                          <th className="p-3">স্ট্যাটাস</th>
                          <th className="p-3">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentRequests.map((req) => (
                          <tr key={req._id || req.id} className="border-b">
                            <td className="p-3 font-semibold">{req.name}</td>
                            <td className="p-3">{req.phone}</td>
                            <td className="p-3">{req.method}</td>
                            <td className="p-3 font-mono font-bold text-blue-700">{req.trxId}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {req.status === "Pending" ? (
                                <button onClick={() => handleApprovePayment(req._id || req.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">
                                  Approve
                                </button>
                              ) : (
                                <span className="text-emerald-600 font-bold">✓ ভেরিফাইড</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= STUDENT PROFILE & INSTITUTION EDIT MODAL ================= */}
      {showProfileEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold">শিক্ষার্থী প্রোফাইল ও শিক্ষাপ্রতিষ্ঠান আপডেট</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">আপনার নাম</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">আপনার লক্ষ্য (Target BCS)</label>
                <input
                  type="text"
                  value={profile.targetBcs}
                  onChange={(e) => setProfile({ ...profile, targetBcs: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">শিক্ষাপ্রতিষ্ঠানের নাম (বিশ্ববিদ্যালয় / কলেজ)</label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় / মেট্রোপলিটন ইউনিভার্সিটি"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-gray-50 border">
                <input
                  type="checkbox"
                  checked={profile.hideProfile}
                  onChange={(e) => setProfile({ ...profile, hideProfile: e.target.checked })}
                />
                <span className="font-semibold">অন্যান্য শিক্ষার্থীদের কাছ থেকে আমার শিক্ষাপ্রতিষ্ঠানের তথ্য লুকিয়ে রাখুন</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  updateProfile(profile);
                  setShowProfileEditModal(false);
                }}
                className="flex-1 py-2.5 bg-black text-white rounded-xl text-xs font-bold"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAYMENT MODAL ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-center mb-1">বিসিএস পাঠ প্রিমিয়াম সাবস্ক্রিপশন</h3>
            <p className="text-xs text-gray-500 text-center mb-4">সব বিষয়ের রঙিন লেকচার PDF, ৫০০+ MCQ PDF, লিখিত PDF ও মক টেস্ট</p>

            <div className="bg-gray-50 p-4 rounded-xl border text-center mb-4">
              <span className="text-2xl font-black text-black">২০০ ৳</span>
              <span className="text-xs text-gray-500"> / ৬ মাসের মেয়াদ</span>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg text-pink-950">
                <strong>বিকাশ / নগদ / রকেট (Send Money):</strong> <code>017XXXXXXXX</code>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["বিকাশ", "নগদ", "রকেট"].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setPayForm({ ...payForm, method: m })}
                    className={`py-2 rounded-lg border font-bold ${payForm.method === m ? "bg-black text-white border-black" : "bg-gray-50"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <input type="text" placeholder="আপনার নাম" value={payForm.name} onChange={(e) => setPayForm({ ...payForm, name: e.target.value })} className="w-full p-2.5 border rounded-lg outline-none" />
              <input type="text" placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন (017...)" value={payForm.phone} onChange={(e) => setPayForm({ ...payForm, phone: e.target.value })} className="w-full p-2.5 border rounded-lg outline-none" />
              <input type="text" placeholder="Transaction ID (TrxID) লিখুন" value={payForm.trxId} onChange={(e) => setPayForm({ ...payForm, trxId: e.target.value })} className="w-full p-2.5 border rounded-lg outline-none uppercase" />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2.5 border rounded-xl font-semibold hover:bg-gray-50">বাতিল</button>
                <button type="submit" className="flex-1 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800">
                  পেমেন্ট সাবমিট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}