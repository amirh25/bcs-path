"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, CheckCircle2, Lock, Award, Sparkles,
  AlertTriangle, PlusCircle, Edit3, Trash2, Eye,
  Clock, Check, XCircle, ShieldCheck, KeyRound, UserCheck
} from "lucide-react";
import { initialSubjects, initialLectures, initialQuestionBank } from "../data/bcsData";

export default function BCSPathPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | syllabus | notes | exam | qbank | admin
  const [subjects] = useState(initialSubjects);
  const [lectures, setLectures] = useState(initialLectures);
  const [questionBank, setQuestionBank] = useState(initialQuestionBank);

  const [activeSubjectId, setActiveSubjectId] = useState("bangladesh");
  const [activeLecture, setActiveLecture] = useState(initialLectures[0]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [screenshotGuard, setScreenshotGuard] = useState(false);

  // User & Payment Management States
  const [paymentRequests, setPaymentRequests] = useState([
    { id: "pay-1", name: "রাকিব হাসান", phone: "01712345678", method: "বিকাশ", trxId: "BK98234X", status: "Pending", date: "আজ" }
  ]);
  const [payForm, setPayForm] = useState({ name: "", phone: "", method: "বিকাশ", trxId: "" });

  // Admin Authentication State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const ADMIN_SECRET_PIN = "bcs2026"; // তোমার গোপন অ্যাডমিন পাসওয়ার্ড

  // Live Mock Test States (0.5 Negative Marking)
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Question Bank Filter States
  const [selectedBatch, setSelectedBatch] = useState("ALL");
  const [selectedQbSubject, setSelectedQbSubject] = useState("ALL");
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // Admin Lecture Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subjectId: "bangladesh",
    lectureNo: "",
    title: "",
    isFree: false,
    mainContent: "",
    mnemonic: "",
    confusionBox: "",
    previousQuestion: "",
  });

  // Admin New Question Form State
  const [newQuestion, setNewQuestion] = useState({
    bcsBatch: "৪৬তম বিসিএস",
    subjectId: "bangladesh",
    question: "",
    opt0: "",
    opt1: "",
    opt2: "",
    opt3: "",
    correctAnswer: 0,
    explanation: "",
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedLec = localStorage.getItem("bcs_path_lectures");
    if (savedLec) {
      const parsed = JSON.parse(savedLec);
      setLectures(parsed);
      setActiveLecture(parsed[0]);
    }
    const savedQb = localStorage.getItem("bcs_path_qbank");
    if (savedQb) setQuestionBank(JSON.parse(savedQb));

    const savedPay = localStorage.getItem("bcs_path_payments");
    if (savedPay) setPaymentRequests(JSON.parse(savedPay));

    const savedSub = localStorage.getItem("bcs_path_subscribed");
    if (savedSub === "true") setIsSubscribed(true);
  }, []);

  // Exam Countdown Timer
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

  // Anti-Piracy Security (Block Copy, Right Click & Window Blur)
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (activeTab !== "admin") {
        e.preventDefault();
        alert("⚠️ পাইরেসি রোধে টেক্সট কপি ও রাইট-ক্লিক অপশন বন্ধ রাখা হয়েছে।");
      }
    };
    const handleKeyDown = (e) => {
      if (activeTab !== "admin" && ((e.ctrlKey && (e.key === "c" || e.key === "p" || e.key === "u" || e.key === "s")) || e.key === "F12")) {
        e.preventDefault();
        alert("⚠️ সিকিউরিটি প্রোটেকশন চালু আছে। শর্টকাট ব্যবহার করা যাবে না।");
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden && activeTab === "notes") {
        setScreenshotGuard(true);
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeTab]);

  // Helper functions to save state
  const saveLecturesToStorage = (updated) => {
    setLectures(updated);
    localStorage.setItem("bcs_path_lectures", JSON.stringify(updated));
  };

  const saveQbToStorage = (updated) => {
    setQuestionBank(updated);
    localStorage.setItem("bcs_path_qbank", JSON.stringify(updated));
  };

  const savePaymentsToStorage = (updated) => {
    setPaymentRequests(updated);
    localStorage.setItem("bcs_path_payments", JSON.stringify(updated));
  };

  // Start Live Exam
  const startLiveExam = () => {
    setExamAnswers({});
    setExamSubmitted(false);
    setTimeLeft(600);
    setActiveTab("exam");
  };

  // Calculate Exam Score with 0.5 Negative Marking
  const calculateExamResult = () => {
    let correct = 0;
    let wrong = 0;
    questionBank.forEach((q) => {
      if (examAnswers[q.id] !== undefined) {
        if (examAnswers[q.id] === q.correctAnswer) correct += 1;
        else wrong += 1;
      }
    });
    const negativePenalty = wrong * 0.5;
    const finalScore = Math.max(0, correct - negativePenalty);
    return { correct, wrong, skipped: questionBank.length - (correct + wrong), negativePenalty, finalScore };
  };

  // Submit Payment TrxID
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!payForm.phone || !payForm.trxId) {
      alert("অনুগ্রহ করে মোবাইল নম্বর এবং Transaction ID (TrxID) দিন!");
      return;
    }
    const newReq = {
      id: `pay-${Date.now()}`,
      name: payForm.name || "বিসিএস পরীক্ষার্থী",
      phone: payForm.phone,
      method: payForm.method,
      trxId: payForm.trxId.toUpperCase(),
      status: "Pending",
      date: new Date().toLocaleDateString("bn-BD"),
    };
    savePaymentsToStorage([newReq, ...paymentRequests]);
    setPayForm({ name: "", phone: "", method: "বিকাশ", trxId: "" });
    setShowPaymentModal(false);
    alert("✅ আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে! অ্যাডমিন প্যানেল থেকে ভেরিফাই করলেই সব লেকচার আনলক হয়ে যাবে।");
  };

  // Admin Approve Payment
  const handleApprovePayment = (id) => {
    const updated = paymentRequests.map((req) =>
      req.id === id ? { ...req, status: "Approved" } : req
    );
    savePaymentsToStorage(updated);
    setIsSubscribed(true);
    localStorage.setItem("bcs_path_subscribed", "true");
    alert("🎉 পেমেন্ট অ্যাপ্রুভ করা হয়েছে! ইউজারের ৬ মাসের সাবস্ক্রিপশন সক্রিয় হয়েছে।");
  };

  // Admin Lecture Upload / Update
  const handleSaveLecture = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.lectureNo) {
      alert("অনুগ্রহ করে লেকচার নম্বর এবং শিরোনাম দিন!");
      return;
    }
    if (editingId) {
      const updated = lectures.map((lec) =>
        lec.id === editingId ? { ...lec, ...formData, lectureNo: Number(formData.lectureNo) } : lec
      );
      saveLecturesToStorage(updated);
      alert("✅ লেকচার নোট সফলভাবে আপডেট হয়েছে!");
      setEditingId(null);
    } else {
      const newLec = {
        id: `lec-${Date.now()}`,
        ...formData,
        lectureNo: Number(formData.lectureNo),
        completed: false,
      };
      saveLecturesToStorage([...lectures, newLec]);
      alert("🎉 নতুন রঙিন লেকচার নোট সফলভাবে আপলোড হয়েছে!");
    }
    setFormData({
      subjectId: "bangladesh",
      lectureNo: "",
      title: "",
      isFree: false,
      mainContent: "",
      mnemonic: "",
      confusionBox: "",
      previousQuestion: "",
    });
  };

  // Admin Add Question to Question Bank
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.opt0 || !newQuestion.opt1) {
      alert("প্রশ্ন এবং অপশনগুলো সঠিকভাবে পূরণ করুন!");
      return;
    }
    const qObj = {
      id: `qb-${Date.now()}`,
      bcsBatch: newQuestion.bcsBatch,
      subjectId: newQuestion.subjectId,
      question: newQuestion.question,
      options: [newQuestion.opt0, newQuestion.opt1, newQuestion.opt2, newQuestion.opt3],
      correctAnswer: Number(newQuestion.correctAnswer),
      explanation: newQuestion.explanation,
    };
    saveQbToStorage([qObj, ...questionBank]);
    setNewQuestion({ ...newQuestion, question: "", opt0: "", opt1: "", opt2: "", opt3: "", explanation: "" });
    alert("✅ প্রশ্ন ব্যাংকে নতুন প্রশ্ন যুক্ত হয়েছে!");
  };

  const handleEditClick = (lec) => {
    setEditingId(lec.id);
    setFormData({
      subjectId: lec.subjectId,
      lectureNo: lec.lectureNo,
      title: lec.title,
      isFree: lec.isFree,
      mainContent: lec.mainContent || "",
      mnemonic: lec.mnemonic || "",
      confusionBox: lec.confusionBox || "",
      previousQuestion: lec.previousQuestion || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLecture = (id) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই লেকচারটি ডিলিট করতে চান?")) {
      saveLecturesToStorage(lectures.filter((l) => l.id !== id));
    }
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

  return (
    <div className={`min-h-screen pb-16 ${activeTab !== "admin" ? "select-none" : ""}`}>
      {/* Header Navigation */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div onClick={() => setActiveTab("dashboard")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg">ব</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">বিসিএস পাঠ</h1>
              <p className="text-[11px] text-gray-500">সিলেবাস-সাজানো প্রস্তুতি</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
            <button onClick={() => setActiveTab("dashboard")} className={`${activeTab === "dashboard" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>ড্যাশবোর্ড</button>
            <button onClick={() => setActiveTab("syllabus")} className={`${activeTab === "syllabus" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>সিলেবাস (প্রিলি+রিটেন)</button>
            <button onClick={() => setActiveTab("notes")} className={`${activeTab === "notes" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>রঙিন লেকচার</button>
            <button onClick={startLiveExam} className={`${activeTab === "exam" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>মক টেস্ট</button>
            <button onClick={() => setActiveTab("qbank")} className={`${activeTab === "qbank" ? "text-black font-bold border-b-2 border-black" : "hover:text-black"} py-5`}>প্রশ্ন ব্যাংক</button>
            <button onClick={() => setActiveTab("admin")} className={`${activeTab === "admin" ? "text-blue-600 font-bold border-b-2 border-blue-600" : "text-blue-600 hover:text-blue-800"} py-5 flex items-center gap-1`}>
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </nav>

          <button
            onClick={() => setShowPaymentModal(true)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${isSubscribed ? "bg-emerald-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
          >
            {isSubscribed ? "✓ প্রিমিয়াম সক্রিয় (১৮০ দিন)" : "সাবস্ক্রাইব · ২০০৳/৬ মাস"}
          </button>
        </div>

        {/* Mobile Nav Bar */}
        <div className="flex md:hidden overflow-x-auto border-t bg-gray-50 px-4 py-2 gap-4 text-xs font-semibold whitespace-nowrap">
          <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "text-black underline" : "text-gray-500"}>ড্যাশবোর্ড</button>
          <button onClick={() => setActiveTab("syllabus")} className={activeTab === "syllabus" ? "text-black underline" : "text-gray-500"}>সিলেবাস</button>
          <button onClick={() => setActiveTab("notes")} className={activeTab === "notes" ? "text-black underline" : "text-gray-500"}>লেকচার নোট</button>
          <button onClick={startLiveExam} className={activeTab === "exam" ? "text-black underline" : "text-gray-500"}>মক টেস্ট</button>
          <button onClick={() => setActiveTab("qbank")} className={activeTab === "qbank" ? "text-black underline" : "text-gray-500"}>প্রশ্ন ব্যাংক</button>
          <button onClick={() => setActiveTab("admin")} className="text-blue-600 font-bold">অ্যাডমিন</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ================= 1. DASHBOARD TAB ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
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
                <button onClick={startLiveExam} className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600">
                  লাইভ মক টেস্ট দিন
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">বিসিএস-এর সকল সাবজেক্ট ({subjects.length}টি)</h3>
                  <span className="text-xs text-gray-500">সাবজেক্টে ক্লিক করে লেকচার তালিকা দেখুন</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subjects.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => setActiveSubjectId(sub.id)}
                      className={`p-4 rounded-xl border bg-white cursor-pointer transition hover:shadow-md ${activeSubjectId === sub.id ? "ring-2 ring-black" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${sub.bg} ${sub.text} font-bold flex items-center justify-center text-sm`}>{sub.initial}</div>
                          <div>
                            <div className="font-bold text-sm">{sub.title}</div>
                            <div className="text-[11px] text-gray-400">{sub.lecturesCount}টি লেকচার · {sub.hours} ঘণ্টা</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700 block">প্রিলি: {sub.preliMarks}</span>
                          {sub.writtenMarks > 0 && (
                            <span className="text-[10px] text-blue-600 font-semibold">রিটেন: {sub.writtenMarks}</span>
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

                {/* Selected Subject Lectures List */}
                <div className="bg-white p-6 rounded-2xl border shadow-xs">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="font-bold text-base">{currentSubject.title} - লেকচারসমূহ</h3>
                      <p className="text-xs text-gray-500">প্রিলিমিনারি: {currentSubject.preliMarks} নম্বর | লিখিত: {currentSubject.writtenMarks} নম্বর</p>
                    </div>
                    <button onClick={() => setActiveTab("admin")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      <PlusCircle className="w-3.5 h-3.5" /> নতুন লেকচার যোগ করুন
                    </button>
                  </div>

                  {subjectLectures.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                      <p className="text-sm text-gray-500 mb-2">এই সাবজেক্টে এখনো কোনো লেকচার আপলোড করা হয়নি।</p>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, subjectId: currentSubject.id, lectureNo: 1 });
                          setActiveTab("admin");
                        }}
                        className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold"
                      >
                        এখনই লেকচার ১ আপলোড করুন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {subjectLectures.map((lec) => {
                        const isLocked = !lec.isFree && !isSubscribed;
                        return (
                          <div
                            key={lec.id}
                            onClick={() => {
                              if (isLocked) setShowPaymentModal(true);
                              else { setActiveLecture(lec); setActiveTab("notes"); }
                            }}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer ${isLocked ? "bg-gray-50 hover:border-gray-300" : "bg-white hover:border-black"}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">{lec.lectureNo}</span>
                              <div>
                                <div className="text-sm font-semibold">{lec.title}</div>
                                <div className="text-[11px] text-gray-400">রঙিন নোট · শর্টকাট ট্রিকস · অধ্যায়ভিত্তিক মক টেস্ট</div>
                              </div>
                            </div>
                            {isLocked ? (
                              <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                                <Lock className="w-3.5 h-3.5" /> প্রিমিয়াম
                              </span>
                            ) : (
                              <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" /> পড়া যাবে
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border shadow-xs">
                  <div className="font-bold text-sm mb-1">আজকের লাইভ মক টেস্ট</div>
                  <p className="text-xs text-gray-500 mb-4">সময়: ১০ মিনিট · নেগেটিভ মার্কিং: ০.৫০ (প্রতি ভুল উত্তরের জন্য)</p>
                  <button onClick={startLiveExam} className="w-full py-2.5 bg-black text-white font-semibold rounded-xl text-xs hover:bg-gray-800 transition">
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
        )}

        {/* ================= 2. SYLLABUS (PRELI + WRITTEN) TAB ================= */}
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
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">প্রিলিমিনারি: {sub.preliMarks} নম্বর</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                        লিখিত: {sub.writtenMarks > 0 ? `${sub.writtenMarks} নম্বর` : "প্রযোজ্য নয়"}
                      </span>
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

        {/* ================= 3. COLORFUL LECTURE READER TAB ================= */}
        {activeTab === "notes" && (
          <div className="bg-white rounded-2xl border shadow-xs p-6 sm:p-10 relative overflow-hidden">
            {/* Dynamic Anti-Piracy Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex flex-wrap gap-24 items-center justify-center rotate-[-20deg] select-none text-2xl font-black">
              <span>USER-2481 · BCS-PATH · DO NOT COPY</span>
              <span>USER-2481 · BCS-PATH · DO NOT COPY</span>
              <span>USER-2481 · BCS-PATH · DO NOT COPY</span>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b pb-4">
              <div>
                <button onClick={() => setActiveTab("dashboard")} className="text-xs font-semibold text-blue-600 hover:underline mb-1">
                  ← ড্যাশবোর্ডে ফিরে যান
                </button>
                <h2 className="text-xl sm:text-2xl font-bold">
                  লেকচার {activeLecture?.lectureNo}: {activeLecture?.title}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setScreenshotGuard(!screenshotGuard)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${screenshotGuard ? "bg-red-50 text-red-600 border-red-200" : "bg-gray-50 text-gray-600"}`}
                >
                  {screenshotGuard ? "গার্ড আনব্লার করুন" : "স্ক্রিনশট গার্ড (Blur)"}
                </button>
              </div>
            </div>

            <div className={`space-y-6 transition duration-300 ${screenshotGuard ? "filter blur-lg select-none" : ""}`}>
              {activeLecture?.mainContent && (
                <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200">
                  <div className="font-bold text-blue-950 text-sm mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" /> মূল লেকচার নোট ও গুরুত্বপূর্ণ তথ্য
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{activeLecture.mainContent}</p>
                </div>
              )}

              {activeLecture?.mnemonic && (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-800 text-sm mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> মনে রাখার সুপার টেকনিক (Mnemonics)
                  </div>
                  <p className="text-sm text-emerald-950 leading-relaxed whitespace-pre-line">{activeLecture.mnemonic}</p>
                </div>
              )}

              {activeLecture?.confusionBox && (
                <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> কনফিউশন ক্লিয়ার বক্স
                  </div>
                  <div className="text-sm text-amber-950 leading-relaxed whitespace-pre-line">{activeLecture.confusionBox}</div>
                </div>
              )}

              {activeLecture?.previousQuestion && (
                <div className="p-5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="font-bold text-rose-800 text-sm mb-1.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-rose-600" /> বিগত বিসিএস পরীক্ষার প্রশ্ন
                  </div>
                  <p className="text-sm text-rose-950 leading-relaxed whitespace-pre-line">{activeLecture.previousQuestion}</p>
                </div>
              )}

              {/* End of Lecture Exam Trigger */}
              <div className="p-6 rounded-2xl bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div>
                  <h4 className="font-bold text-base">এই লেকচারটি পড়া শেষ করেছেন?</h4>
                  <p className="text-xs text-gray-300 mt-0.5">এখনই ০.৫ নেগেটিভ মার্কিংসহ মক টেস্ট দিয়ে নিজের প্রস্তুতি যাচাই করুন।</p>
                </div>
                <button onClick={startLiveExam} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 whitespace-nowrap">
                  লেকচার শেষে পরীক্ষা দিন →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. LIVE MOCK TEST ENGINE TAB ================= */}
        {activeTab === "exam" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-xs flex flex-wrap justify-between items-center gap-4 sticky top-16 z-30">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">বিসিএস লাইভ মক টেস্ট (নেগেটিভ মার্কিং ০.৫০)</h2>
                <p className="text-xs text-gray-500">প্রতিটি সঠিক উত্তরে +১ এবং প্রতিটি ভুল উত্তরে -০.৫০ কাটা যাবে</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm">
                  <Clock className="w-4 h-4" /> সময় বাকি: {formatTime(timeLeft)}
                </div>
                {!examSubmitted && (
                  <button onClick={() => setExamSubmitted(true)} className="px-5 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800">
                    খাতা জমা দিন
                  </button>
                )}
              </div>
            </div>

            {examSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-emerald-950 mb-4">📊 আপনার পরীক্ষার ফলাফল কার্ড</h3>
                {(() => {
                  const res = calculateExamResult();
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="text-xs text-gray-500">মোট প্রশ্ন</div>
                        <div className="text-xl font-bold">{questionBank.length}</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="text-xs text-emerald-600">সঠিক উত্তর (+১)</div>
                        <div className="text-xl font-bold text-emerald-600">{res.correct}</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="text-xs text-rose-600">ভুল উত্তর</div>
                        <div className="text-xl font-bold text-rose-600">{res.wrong}</div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border">
                        <div className="text-xs text-amber-600">নেগেটিভ কর্তন (-০.৫)</div>
                        <div className="text-xl font-bold text-amber-600">-{res.negativePenalty}</div>
                      </div>
                      <div className="bg-black text-white p-4 rounded-xl">
                        <div className="text-xs text-gray-300">চূড়ান্ত স্কোর</div>
                        <div className="text-xl font-black text-emerald-400">{res.finalScore}</div>
                      </div>
                    </div>
                  );
                })()}
                <button onClick={startLiveExam} className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold">
                  আবার পরীক্ষা দিন
                </button>
              </div>
            )}

            <div className="space-y-4">
              {questionBank.map((q, idx) => {
                const selectedOpt = examAnswers[q.id];
                return (
                  <div key={q.id} className="bg-white p-6 rounded-2xl border shadow-xs">
                    <h3 className="font-bold text-sm sm:text-base mb-4">
                      {idx + 1}. {q.question}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        let style = "bg-white hover:border-black";
                        if (!examSubmitted && selectedOpt === optIdx) {
                          style = "bg-black text-white border-black font-bold";
                        } else if (examSubmitted) {
                          if (optIdx === q.correctAnswer) style = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                          else if (selectedOpt === optIdx) style = "bg-rose-50 border-rose-500 text-rose-900 font-bold";
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={examSubmitted}
                            onClick={() => setExamAnswers({ ...examAnswers, [q.id]: optIdx })}
                            className={`p-3 rounded-xl border text-left text-xs transition ${style}`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {examSubmitted && (
                      <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border text-xs text-gray-700">
                        <strong>ব্যাখ্যা:</strong> {q.explanation}
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
                <h2 className="text-xl font-bold">বিসিএস প্রশ্ন ব্যাংক (১০ম - ৪৬তম বিসিএস)</h2>
                <p className="text-xs text-gray-500 mt-1">সাল ও বিষয়ভিত্তিক ফিল্টার করে ব্যাখ্যাসহ বিগত সালের প্রশ্ন অনুশীলন করুন</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-3 py-2 border rounded-xl text-xs font-semibold bg-gray-50">
                  <option value="ALL">সকল বিসিএস (১০ম - ৪৬তম)</option>
                  <option value="৪৬তম বিসিএস">৪৬তম বিসিএস</option>
                  <option value="৪৫তম বিসিএস">৪৫তম বিসিএস</option>
                  <option value="৪৪তম বিসিএস">৪৪তম বিসিএস</option>
                  <option value="৪৩তম বিসিএস">৪৩তম বিসিএস</option>
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
                const isRevealed = revealedAnswers[q.id];
                return (
                  <div key={q.id} className="bg-white p-6 rounded-2xl border shadow-xs">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="font-bold text-sm sm:text-base">{idx + 1}. {q.question}</h3>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold whitespace-nowrap">{q.bcsBatch}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => setRevealedAnswers({ ...revealedAnswers, [q.id]: true })}
                            className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                              isRevealed ? (isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold" : "bg-gray-50 text-gray-500") : "hover:border-black"
                            }`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={() => setRevealedAnswers({ ...revealedAnswers, [q.id]: !isRevealed })} className="text-xs font-bold text-blue-600 hover:underline">
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

        {/* ================= 6. PASSWORD-PROTECTED ADMIN CMS TAB ================= */}
        {activeTab === "admin" && (
          <div>
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm text-center my-12">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold mb-1">অ্যাডমিন সিকিউরিটি লক</h2>
                <p className="text-xs text-gray-500 mb-5">শুধুমাত্র অ্যাডমিন লেকচার নোট আপলোড ও পেমেন্ট অ্যাপ্রুভ করতে পারবেন। (ডেমো পিন: <code>bcs2026</code>)</p>
                <input
                  type="password"
                  placeholder="অ্যাডমিন পিন লিখুন (bcs2026)"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="w-full p-3 border rounded-xl text-xs mb-4 text-center outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  onClick={() => {
                    if (adminPinInput === ADMIN_SECRET_PIN) setIsAdminUnlocked(true);
                    else alert("❌ ভুল পিন! সঠিক পিন দিন: bcs2026");
                  }}
                  className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800"
                >
                  অ্যাডমিন প্যানেল আনলক করুন
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Section A: Pending bKash/Nagad Payment Verification */}
                <div className="bg-white p-6 rounded-2xl border shadow-xs">
                  <h3 className="font-bold text-base mb-1 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-emerald-600" /> স্টুডেন্ট সাবস্ক্রিপশন ও বিকাশ/নগদ পেমেন্ট ভেরিফিকেশন
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">স্টুডেন্টরা ২০০ টাকা পাঠিয়ে TrxID দিলে এখানে জমা হবে। আপনি মিলিয়ে Approve করলেই তার একাউন্ট আনলক হবে।</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b bg-gray-50 text-gray-600">
                          <th className="p-3">নাম ও তারিখ</th>
                          <th className="p-3">মোবাইল নম্বর</th>
                          <th className="p-3">মাধ্যম</th>
                          <th className="p-3">TrxID</th>
                          <th className="p-3">স্ট্যাটাস</th>
                          <th className="p-3">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentRequests.map((req) => (
                          <tr key={req.id} className="border-b">
                            <td className="p-3 font-semibold">{req.name} <span className="text-gray-400 block text-[10px]">{req.date}</span></td>
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
                                <button onClick={() => handleApprovePayment(req.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700">
                                  Approve (Unlock)
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

                {/* Section B: Lecture Note Upload & Management */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-xs">
                    <h2 className="text-lg font-bold mb-1">
                      {editingId ? "✏️ লেকচার নোট আপডেট করুন" : "➕ নতুন রঙিন লেকচার নোট আপলোড করুন"}
                    </h2>
                    <form onSubmit={handleSaveLecture} className="space-y-4 text-xs mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="font-bold block mb-1">সাবজেক্ট</label>
                          <select value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full p-2.5 border rounded-xl bg-gray-50">
                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="font-bold block mb-1">লেকচার নম্বর</label>
                          <input type="number" placeholder="যেমন: 4" value={formData.lectureNo} onChange={(e) => setFormData({ ...formData, lectureNo: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer p-2.5 border rounded-xl w-full bg-gray-50">
                            <input type="checkbox" checked={formData.isFree} onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })} />
                            <span className="font-semibold">ফ্রি ডেমো লেকচার?</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold block mb-1">লেকচারের শিরোনাম (Title)</label>
                        <input type="text" placeholder="যেমন: ভাষা আন্দোলন ও স্বাধিকার আন্দোলন" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
                      </div>

                      <div>
                        <label className="font-bold block mb-1 text-blue-700">🔵 মূল লেকচার নোট (Main Content)</label>
                        <textarea rows={4} placeholder="পিডিএফ থেকে মূল আলোচনা এখানে পেস্ট করুন..." value={formData.mainContent} onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })} className="w-full p-3 border border-blue-200 bg-blue-50/30 rounded-xl" />
                      </div>

                      <div>
                        <label className="font-bold block mb-1 text-emerald-700">🟢 মনে রাখার শর্টকাট ছন্দ (Mnemonics Box)</label>
                        <textarea rows={2} placeholder="শর্টকাট টেকনিক..." value={formData.mnemonic} onChange={(e) => setFormData({ ...formData, mnemonic: e.target.value })} className="w-full p-3 border border-emerald-200 bg-emerald-50/30 rounded-xl" />
                      </div>

                      <div>
                        <label className="font-bold block mb-1 text-amber-700">🟡 কনফিউশন ক্লিয়ার বক্স (Confusion Box)</label>
                        <textarea rows={2} placeholder="কনফিউজিং তথ্য..." value={formData.confusionBox} onChange={(e) => setFormData({ ...formData, confusionBox: e.target.value })} className="w-full p-3 border border-amber-200 bg-amber-50/30 rounded-xl" />
                      </div>

                      <div>
                        <label className="font-bold block mb-1 text-rose-700">🔴 বিগত বিসিএস প্রশ্ন ও উত্তর (Previous BCS Alert)</label>
                        <textarea rows={2} placeholder="বিগত সালের প্রশ্ন..." value={formData.previousQuestion} onChange={(e) => setFormData({ ...formData, previousQuestion: e.target.value })} className="w-full p-3 border border-rose-200 bg-rose-50/30 rounded-xl" />
                      </div>

                      <button type="submit" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800">
                        {editingId ? "আপডেট সেভ করুন" : "লেকচার নোট পাবলিশ করুন"}
                      </button>
                    </form>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border shadow-xs">
                    <h3 className="font-bold text-base mb-4">আপলোডকৃত লেকচার ({lectures.length}টি)</h3>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {lectures.map((lec) => {
                        const subName = subjects.find((s) => s.id === lec.subjectId)?.title;
                        return (
                          <div key={lec.id} className="p-3.5 rounded-xl border bg-gray-50 flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{subName} · লেকচার {lec.lectureNo}</span>
                              <span className="text-[10px] font-bold">{lec.isFree ? "Free" : "Premium"}</span>
                            </div>
                            <div className="font-bold text-xs">{lec.title}</div>
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => { setActiveLecture(lec); setActiveTab("notes"); }} className="flex-1 py-1.5 bg-white border rounded-lg text-[11px] font-semibold">দেখুন</button>
                              <button onClick={() => handleEditClick(lec)} className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold">এডিট</button>
                              <button onClick={() => handleDeleteLecture(lec.id)} className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section C: Question Bank Uploader */}
                <div className="bg-white p-6 rounded-2xl border shadow-xs">
                  <h3 className="font-bold text-base mb-4">➕ প্রশ্ন ব্যাংক ও মক টেস্টে নতুন MCQ প্রশ্ন যোগ করুন</h3>
                  <form onSubmit={handleAddQuestion} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <input type="text" placeholder="প্রশ্নটি লিখুন..." value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className="sm:col-span-2 p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন ক" value={newQuestion.opt0} onChange={(e) => setNewQuestion({ ...newQuestion, opt0: e.target.value })} className="p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন খ" value={newQuestion.opt1} onChange={(e) => setNewQuestion({ ...newQuestion, opt1: e.target.value })} className="p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন গ" value={newQuestion.opt2} onChange={(e) => setNewQuestion({ ...newQuestion, opt2: e.target.value })} className="p-2.5 border rounded-xl" />
                    <input type="text" placeholder="অপশন ঘ" value={newQuestion.opt3} onChange={(e) => setNewQuestion({ ...newQuestion, opt3: e.target.value })} className="p-2.5 border rounded-xl" />
                    <select value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} className="p-2.5 border rounded-xl bg-gray-50">
                      <option value={0}>সঠিক উত্তর: ক</option>
                      <option value={1}>সঠিক উত্তর: খ</option>
                      <option value={2}>সঠিক উত্তর: গ</option>
                      <option value={3}>সঠিক উত্তর: ঘ</option>
                    </select>
                    <input type="text" placeholder="বিসিএস ব্যাচ (যেমন: ৪৬তম বিসিএস)" value={newQuestion.bcsBatch} onChange={(e) => setNewQuestion({ ...newQuestion, bcsBatch: e.target.value })} className="p-2.5 border rounded-xl" />
                    <textarea rows={2} placeholder="ব্যাখ্যা লিখুন..." value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} className="sm:col-span-2 p-2.5 border rounded-xl" />
                    <button type="submit" className="sm:col-span-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                      প্রশ্ন ব্যাংকে যোগ করুন
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Real Payment Submission Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-center mb-1">বিসিএস পাঠ প্রিমিয়াম সাবস্ক্রিপশন</h3>
            <p className="text-xs text-gray-500 text-center mb-4">সব বিষয়ের রঙিন লেকচার নোট, প্রশ্ন ব্যাংক ও আনলিমিটেড মক টেস্ট</p>

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