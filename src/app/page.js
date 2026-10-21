"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, CheckCircle2, Award, Sparkles, AlertTriangle,
  Trash2, Clock, ShieldCheck, KeyRound, RefreshCw,
  Camera, Building2, EyeOff, Eye, FileText, HelpCircle,
  PenTool, RotateCcw, Shuffle, Upload, ChevronRight,
  ArrowLeft, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen,
  CheckSquare, Edit3, Layers
} from "lucide-react";
import { initialSubjects } from "../data/bcsData";

// Helper: PDF URL-কে Anti-Download ও Embed-friendly মোডে রূপান্তর করা
function formatSecurePdfUrl(url) {
  if (!url) return "";
  // Base64 বা সরাসরি PDF লিংকের শেষে #toolbar=0 যুক্ত করলে ব্রাউজারের ডাউনলোড ও প্রিন্ট বার হাইড হয়ে যায়
  if (url.startsWith("data:application/pdf")) {
    return `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
  }
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
}

export default function BCSPathPlatform() {
  // Navigation & History Stack for Professional Back Button
  const [activeTab, setActiveTab] = useState("dashboard");
  const [navHistory, setNavHistory] = useState([]);

  const navigateTo = (tabName) => {
    if (tabName !== activeTab) {
      setNavHistory((prev) => [...prev, activeTab]);
      setActiveTab(tabName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoBack = () => {
    if (navHistory.length > 0) {
      const prevTab = navHistory[navHistory.length - 1];
      setNavHistory((prev) => prev.slice(0, -1));
      setActiveTab(prevTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveTab("dashboard");
    }
  };

  // Core Data States (100% Dynamic from Admin Uploads)
  const [subjects] = useState(initialSubjects);
  const [lectures, setLectures] = useState([]);
  const [qbankDocs, setQbankDocs] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  // ================= 1. DYNAMIC PROGRESS & 4-STEP COMPLETION STATE =================
  // progressMap structure: { [lectureId]: { lecture: true, mcq: true, written: true, exam: true, completed: true } }
  const [progressMap, setProgressMap] = useState({});
  const [completedQuizzesCount, setCompletedQuizzesCount] = useState(0);

  // ================= 2. STUDENT PROFILE STATE =================
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "রাফিউল ইসলাম",
    targetBcs: "লক্ষ্য: ৪৭তম BCS",
    institution: "",
    hideProfile: false,
    avatarUrl: "",
  });
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // ================= 3. LECTURE & WIDE PDF / TEXT VIEWER STATE =================
  const [activeSubjectId, setActiveSubjectId] = useState("bangladesh");
  const [activeLecture, setActiveLecture] = useState(null);
  // 'lecture' | 'mcq_pdf' | 'written_pdf'
  const [activePdfStep, setActivePdfStep] = useState("lecture");
  // 'pdf' | 'text'
  const [contentViewMode, setContentViewMode] = useState("pdf");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);
  const [screenshotGuard, setScreenshotGuard] = useState(false);

  // ================= 4. QUESTION BANK (PDF + TEXT VIEW) STATE =================
  const [selectedQbSubject, setSelectedQbSubject] = useState("ALL");
  const [activeQbankDoc, setActiveQbankDoc] = useState(null);
  const [qbankViewMode, setQbankViewMode] = useState("pdf"); // 'pdf' | 'text' | 'mcq_practice'
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // ================= 5. CHAPTER EXAM ENGINE STATE =================
  const [examQuestions, setExamQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSourceMeta, setExamSourceMeta] = useState({ subjectId: "ALL", lectureNo: null, lectureId: null });

  // ================= 6. ADMIN CMS STATE =================
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminSection, setAdminSection] = useState("lectures"); // 'lectures' | 'qbank' | 'mcq'
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: "bangladesh",
    lectureNo: 1,
    title: "",
    lecturePdfUrl: "",
    mcqPdfUrl: "",
    writtenPdfUrl: "",
    mainContent: "",
    mnemonic: "",
    confusionBox: "",
    mcqTextContent: "",
    writtenTextContent: "",
  });

  const [qbFormData, setQbFormData] = useState({
    subjectId: "bangladesh",
    bcsBatch: "১০ম - ৪৬তম বিসিএস",
    title: "",
    pdfUrl: "",
    textContent: "",
    highlightBox: "",
  });
  const [editingQbId, setEditingQbId] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    bcsBatch: "৪৬তম বিসিএস",
    subjectId: "bangladesh",
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

  // Fetch Live Data from MongoDB Cloud
  const fetchCloudData = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("/api/platform");
      const data = await res.json();
      if (data.success) {
        setLectures(data.lectures || []);
        setQbankDocs(data.qbankDocs || []);
        setQuestionBank(data.questions || []);
        if (data.qbankDocs?.length > 0 && !activeQbankDoc) {
          setActiveQbankDoc(data.qbankDocs[0]);
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
    const savedProf = localStorage.getItem("bcs_student_profile");
    if (savedProf) {
      try { setProfile(JSON.parse(savedProf)); } catch (e) {}
    }
    const savedProg = localStorage.getItem("bcs_lecture_progress_v2");
    if (savedProg) {
      try { setProgressMap(JSON.parse(savedProg)); } catch (e) {}
    }
    const savedQuizzes = localStorage.getItem("bcs_completed_quizzes_count");
    if (savedQuizzes) setCompletedQuizzesCount(Number(savedQuizzes) || 0);
  }, []);

  // Mark a step (lecture / mcq / written / exam) as visited for a specific lecture
  const markLectureStep = (lectureId, stepKey) => {
    if (!lectureId) return;
    setProgressMap((prev) => {
      const current = prev[lectureId] || {
        lecture: true,
        mcq: false,
        written: false,
        exam: false,
        completed: false,
      };
      const updated = { ...current, [stepKey]: true };
      const nextMap = { ...prev, [lectureId]: updated };
      localStorage.setItem("bcs_lecture_progress_v2", JSON.stringify(nextMap));
      return nextMap;
    });
  };

  // Complete current lecture & move to Next Lecture dynamically
  const completeAndGoToNextLecture = (lec, subjectLecs) => {
    const lecId = lec._id || lec.id;
    setProgressMap((prev) => {
      const nextMap = {
        ...prev,
        [lecId]: { lecture: true, mcq: true, written: true, exam: true, completed: true },
      };
      localStorage.setItem("bcs_lecture_progress_v2", JSON.stringify(nextMap));
      return nextMap;
    });

    const currentIndex = subjectLecs.findIndex((l) => (l._id || l.id) === lecId);
    if (currentIndex !== -1 && currentIndex + 1 < subjectLecs.length) {
      const nextLec = subjectLecs[currentIndex + 1];
      setActiveLecture(nextLec);
      setActivePdfStep("lecture");
      markLectureStep(nextLec._id || nextLec.id, "lecture");
      window.scrollTo({ top: 0, behavior: "smooth" });
      alert(`🎉 অভিনন্দন! লেকচার ${lec.lectureNo} সম্পন্ন হয়েছে। এখন লেকচার ${nextLec.lectureNo} শুরু হলো!`);
    } else {
      alert(`🎉 অভিনন্দন! আপনি এই বিষয়ের লেকচার ${lec.lectureNo} সফলভাবে সম্পন্ন করেছেন!`);
    }
  };

  // Dynamic Calculation of Subject & Overall Progress
  const getSubjectDynamicStats = (subId) => {
    const subLecs = lectures.filter((l) => l.subjectId === subId);
    const totalCount = subLecs.length;
    const completedCount = subLecs.filter((l) => progressMap[l._id || l.id]?.completed).length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { totalCount, completedCount, percent };
  };

  const totalUploadedLectures = lectures.length;
  const totalCompletedLectures = lectures.filter((l) => progressMap[l._id || l.id]?.completed).length;
  const overallProgressPercent =
    totalUploadedLectures > 0 ? Math.round((totalCompletedLectures / totalUploadedLectures) * 100) : 0;

  // Save Profile
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
          payload: { ...newProf, phone: "student_default" },
        }),
      });
    } catch (e) {}
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatarUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleAdminPdfFileSelect = (e, fieldName, isQbank = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4.5 * 1024 * 1024) {
      alert("⚠️ ৪.৫ মেগাবাইটের চেয়ে বড় PDF হলে সরাসরি ফাইল আপলোড না করে Google Drive-এ আপলোড করে লিংকটি (Anyone with link) বক্সে পেস্ট করুন!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (isQbank) {
        setQbFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      } else {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // ================= CHAPTER EXAM ENGINE (50 RANDOM QUESTIONS, 30 SEC/Q) =================
  const startChapterExam = (subjectId = "ALL", lectureNo = null, titleText = "লাইভ মক টেস্ট", lectureId = null) => {
    let pool = questionBank;

    if (subjectId !== "ALL") {
      const subMatched = questionBank.filter((q) => q.subjectId === subjectId);
      if (lectureNo !== null) {
        const chapMatched = subMatched.filter((q) => Number(q.lectureNo || 1) === Number(lectureNo));
        pool = chapMatched.length > 0 ? chapMatched : subMatched;
      } else {
        pool = subMatched;
      }
    }

    if (pool.length === 0) {
      alert("⚠️ এই অধ্যায়ে এখনো কোনো অনলাইন MCQ প্রশ্ন যুক্ত করা হয়নি! অ্যাডমিন প্যানেল থেকে প্রশ্ন যুক্ত করুন।");
      return;
    }

    // Fisher-Yates Shuffle & Pick up to 50 Questions
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected50 = shuffled.slice(0, 50);

    if (lectureId) {
      markLectureStep(lectureId, "exam");
    }

    setExamQuestions(selected50);
    setExamSourceMeta({ subjectId, lectureNo, lectureId });
    setExamTitle(titleText);
    setExamAnswers({});
    setExamSubmitted(false);
    setTimeLeft(selected50.length * 30);
    navigateTo("exam");
  };

  const handleFinishExam = () => {
    setExamSubmitted(true);
    if (examSourceMeta.lectureId) {
      markLectureStep(examSourceMeta.lectureId, "exam");
    }
    const nextCount = completedQuizzesCount + 1;
    setCompletedQuizzesCount(nextCount);
    localStorage.setItem("bcs_completed_quizzes_count", String(nextCount));
  };

  const retakeSameQuestionSet = () => {
    setExamAnswers({});
    setExamSubmitted(false);
    setTimeLeft(examQuestions.length * 30);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNewRandomSetFromSameChapter = () => {
    startChapterExam(examSourceMeta.subjectId, examSourceMeta.lectureNo, examTitle, examSourceMeta.lectureId);
  };

  useEffect(() => {
    if (activeTab !== "exam" || examSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
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
      if (examAnswers[qKey] === undefined) unanswered += 1;
      else if (examAnswers[qKey] === q.correctAnswer) correct += 1;
      else wrong += 1;
    });
    const negativePenalty = wrong * 0.5;
    const finalScore = Math.max(0, correct - negativePenalty);
    return { correct, wrong, unanswered, negativePenalty, finalScore };
  };

  // Anti-Piracy & Anti-Download Protection
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (activeTab !== "admin") e.preventDefault();
    };
    const handleKeyDown = (e) => {
      if (
        activeTab !== "admin" &&
        ((e.ctrlKey && (e.key === "s" || e.key === "p" || e.key === "u")) || e.key === "F12")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab]);

  // Admin Save Lecture (Preserves selected subjectId so no mismatch happens!)
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
      isFree: true,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SAVE_LECTURE", adminPin: adminPinInput, payload }),
    });
    const data = await res.json();
    if (data.success) {
      const savedSubName = subjects.find((s) => s.id === formData.subjectId)?.title;
      alert(
        editingId
          ? `✅ "${savedSubName}" বিষয়ে লেকচারটি সফলভাবে আপডেট হয়েছে!`
          : `🎉 "${savedSubName}" বিষয়ে নতুন লেকচার সফলভাবে পাবলিশ হয়েছে!`
      );
      setEditingId(null);
      // Keep the same subjectId selected so Admin doesn't accidentally upload to wrong subject!
      setFormData((prev) => ({
        ...prev,
        lectureNo: Number(prev.lectureNo) + 1,
        title: "",
        lecturePdfUrl: "",
        mcqPdfUrl: "",
        writtenPdfUrl: "",
        mainContent: "",
        mnemonic: "",
        confusionBox: "",
        mcqTextContent: "",
        writtenTextContent: "",
      }));
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

  // Admin Save Question Bank Document (PDF + Text View)
  const handleSaveQbankDoc = async (e) => {
    e.preventDefault();
    if (!qbFormData.title) {
      alert("অনুগ্রহ করে প্রশ্নব্যাংকের শিরোনাম দিন!");
      return;
    }
    const payload = {
      ...(editingQbId ? { _id: editingQbId } : {}),
      ...qbFormData,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SAVE_QBANK_DOC", adminPin: adminPinInput, payload }),
    });
    const data = await res.json();
    if (data.success) {
      alert(editingQbId ? "✅ প্রশ্নব্যাংক আপডেট হয়েছে!" : "🎉 নতুন প্রশ্নব্যাংক (PDF + Text) পাবলিশ হয়েছে!");
      setEditingQbId(null);
      setQbFormData((prev) => ({
        ...prev,
        title: "",
        pdfUrl: "",
        textContent: "",
        highlightBox: "",
      }));
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteQbankDoc = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই প্রশ্নব্যাংকটি ডিলিট করতে চান?")) return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE_QBANK_DOC", adminPin: adminPinInput, payload: { id } }),
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
      alert("✅ অধ্যায়ভিত্তিক পরীক্ষায় নতুন MCQ প্রশ্ন যুক্ত হয়েছে!");
    }
  };

  const handleBulkQuestionUpload = async () => {
    try {
      const parsed = JSON.parse(bulkJsonInput);
      if (!Array.isArray(parsed)) throw new Error("JSON Array required");
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
      alert("❌ JSON ফরম্যাট সঠিক নয়!");
    }
  };

  const handleEditLectureClick = (lec) => {
    setEditingId(lec._id || lec.id);
    setAdminSection("lectures");
    setFormData({
      subjectId: lec.subjectId,
      lectureNo: lec.lectureNo,
      title: lec.title,
      lecturePdfUrl: lec.lecturePdfUrl || "",
      mcqPdfUrl: lec.mcqPdfUrl || "",
      writtenPdfUrl: lec.writtenPdfUrl || "",
      mainContent: lec.mainContent || "",
      mnemonic: lec.mnemonic || "",
      confusionBox: lec.confusionBox || "",
      mcqTextContent: lec.mcqTextContent || "",
      writtenTextContent: lec.writtenTextContent || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSubject = subjects.find((s) => s.id === activeSubjectId) || subjects[0];
  const subjectLectures = lectures
    .filter((l) => l.subjectId === activeSubjectId)
    .sort((a, b) => a.lectureNo - b.lectureNo);

  const filteredQbankDocs = qbankDocs.filter(
    (doc) => selectedQbSubject === "ALL" || doc.subjectId === selectedQbSubject
  );

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Select subject and go directly to Subject Lecture page
  const handleSelectSubject = (subId) => {
    setActiveSubjectId(subId);
    const subLecs = lectures.filter((l) => l.subjectId === subId).sort((a, b) => a.lectureNo - b.lectureNo);
    if (subLecs.length > 0) {
      setActiveLecture(subLecs[0]);
      markLectureStep(subLecs[0]._id || subLecs[0].id, "lecture");
    } else {
      setActiveLecture(null);
    }
    setActivePdfStep("lecture");
    navigateTo("subject_lectures");
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 pb-20 ${activeTab !== "admin" ? "select-none" : ""}`}>
      {/* ================= TOP NAVBAR ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div onClick={() => navigateTo("dashboard")} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl">
              ব
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight">বিসিএস পাঠ</h1>
              <p className="text-xs text-emerald-600 font-bold">
                {dbLoading ? "ক্লাউড সিঙ্ক হচ্ছে..." : "● ক্লাউড ডাটাবেস সংযুক্ত"}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-base font-bold text-slate-600">
            <button onClick={() => navigateTo("dashboard")} className={`${activeTab === "dashboard" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>ড্যাশবোর্ড</button>
            <button onClick={() => navigateTo("syllabus")} className={`${activeTab === "syllabus" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>সিলেবাস (প্রিলি+রিটেন)</button>
            <button onClick={() => navigateTo("subject_lectures")} className={`${activeTab === "subject_lectures" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>লেকচার</button>
            <button onClick={() => startChapterExam("ALL", null, "৪৭তম বিসিএস পূর্ণাঙ্গ লাইভ মক টেস্ট")} className={`${activeTab === "exam" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>মক টেস্ট</button>
            <button onClick={() => navigateTo("qbank")} className={`${activeTab === "qbank" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>প্রশ্ন ব্যাংক</button>
            <button onClick={() => navigateTo("admin")} className={`${activeTab === "admin" ? "text-blue-600 border-b-2 border-blue-600" : "text-blue-600 hover:text-blue-800"} py-5 flex items-center gap-1.5`}>
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </nav>

          {/* 100% Free Open Access Badge */}
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>সবার জন্য ১০০% ফ্রি উন্মুক্ত</span>
          </div>
        </div>

        {/* Mobile Nav Bar (High Contrast & Large Font) */}
        <div className="flex md:hidden overflow-x-auto border-t border-slate-200 bg-white px-4 py-2.5 gap-5 text-sm font-bold whitespace-nowrap text-slate-700">
          <button onClick={() => navigateTo("dashboard")} className={activeTab === "dashboard" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>ড্যাশবোর্ড</button>
          <button onClick={() => navigateTo("syllabus")} className={activeTab === "syllabus" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>সিলেবাস</button>
          <button onClick={() => navigateTo("subject_lectures")} className={activeTab === "subject_lectures" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>লেকচার</button>
          <button onClick={() => startChapterExam("ALL", null, "লাইভ মক টেস্ট")} className={activeTab === "exam" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>মক টেস্ট</button>
          <button onClick={() => navigateTo("qbank")} className={activeTab === "qbank" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>প্রশ্ন ব্যাংক</button>
          <button onClick={() => navigateTo("admin")} className="text-blue-600 font-extrabold">অ্যাডমিন</button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* ================= GLOBAL PROFESSIONAL BACK ARROW BAR ================= */}
        {activeTab !== "dashboard" && (
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold shadow-2xs hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> আগের পেজে ফিরে যান
            </button>
            <div className="text-xs sm:text-sm font-semibold text-slate-500">
              বিসিএস পাঠ / <span className="text-slate-900 font-bold">{activeTab === "subject_lectures" ? "লেকচার হাব" : activeTab === "qbank" ? "প্রশ্ন ব্যাংক" : activeTab === "syllabus" ? "সিলেবাস" : activeTab === "exam" ? "অনলাইন পরীক্ষা" : "অ্যাডমিন"}</span>
            </div>
          </div>
        )}

        {/* ================= 1. DASHBOARD WITH DYNAMIC PROGRESS & LEFT PROFILE ================= */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR: STUDENT PROFILE SYSTEM (3 Cols) */}
            <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-slate-900">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-full bg-amber-300 border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-3">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Student Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-slate-900">{profile.name.charAt(0)}</span>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="প্রোফাইল ছবি পরিবর্তন করুন"
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow hover:bg-black transition"
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
                  className="font-extrabold text-lg text-slate-900 cursor-pointer hover:underline"
                >
                  {profile.name}
                </h3>
                <p className="text-sm text-slate-600 font-semibold">{profile.targetBcs}</p>

                {profile.institution && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    {profile.hideProfile ? (
                      <span className="text-slate-600 italic flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> অন্যদের কাছে লুকানো
                      </span>
                    ) : (
                      <span>{profile.institution}</span>
                    )}
                  </div>
                )}
              </div>

              {/* 100% Dynamic Overall Progress Bar */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm font-extrabold mb-2 text-slate-900">
                  <span>মোট অগ্রগতি</span>
                  <span className="text-blue-600">{overallProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallProgressPercent}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {totalCompletedLectures}/{totalUploadedLectures} টি লেকচার সম্পন্ন · {completedQuizzesCount} টি পরীক্ষা সম্পন্ন
                </p>
              </div>

              {/* Profile Action Cards */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">প্রোফাইল ছবি পরিবর্তন</div>
                      <div className="text-xs text-slate-500">JPG, PNG (সর্বোচ্চ 2MB)</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <button
                  onClick={() => setShowProfileEditModal(true)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">প্রতিষ্ঠান (ঐচ্ছিক)</div>
                      <div className="text-xs text-slate-600 truncate max-w-[140px]">
                        {profile.institution ? profile.institution : "আপনার প্রতিষ্ঠান যোগ করুন"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>

                <div className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                      {profile.hideProfile ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">প্রোফাইল লুকান</div>
                      <div className="text-xs text-slate-500 leading-tight">
                        প্রতিষ্ঠান অন্যদের জন্য লুকানো থাকবে
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateProfile({ hideProfile: !profile.hideProfile })}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                      profile.hideProfile ? "bg-slate-900" : "bg-slate-300"
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
              <div className="bg-gradient-to-r from-slate-900 to-black text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full font-bold">
                    ৪৭তম ও ৪৮তম বিসিএস স্পেশাল · ১০০% ফ্রি সংস্করণ
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                    ১০টি পূর্ণাঙ্গ সাবজেক্ট · লেকচার PDF ও মক টেস্ট
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mt-1">
                    প্রিলিমিনারি ২০০ নম্বর এবং লিখিত ৯০০ নম্বরের সম্পূর্ণ গোছানো প্রস্তুতি এক প্ল্যাটফর্মে।
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigateTo("syllabus")} className="px-5 py-3 bg-white text-slate-900 rounded-xl text-sm font-extrabold hover:bg-slate-100">
                    সিলেবাস ও মানবণ্টন
                  </button>
                  <button
                    onClick={() => startChapterExam("ALL", null, "৪৭তম বিসিএস স্পেশাল লাইভ মক টেস্ট")}
                    className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-sm font-extrabold hover:bg-emerald-600"
                  >
                    লাইভ মক টেস্ট দিন
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 10 BCS Subjects Grid (High Contrast & Dynamic Counts) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-extrabold text-xl text-slate-900">
                      বিসিএস-এর সকল সাবজেক্ট ({subjects.length}টি)
                    </h3>
                    <span className="text-sm text-blue-600 font-bold">
                      সাবজেক্টে ক্লিক করলেই লেকচার পেজ ওপেন হবে →
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subjects.map((sub) => {
                      const stats = getSubjectDynamicStats(sub.id);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleSelectSubject(sub.id)}
                          className="p-5 rounded-2xl border border-slate-200 bg-white text-slate-900 cursor-pointer transition hover:shadow-md hover:border-slate-900 group"
                        >
                          <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-3.5">
                              <div className={`w-12 h-12 rounded-xl ${sub.bg} ${sub.text} font-extrabold flex items-center justify-center text-base shrink-0`}>
                                {sub.initial}
                              </div>
                              <div>
                                {/* Strictly Dark Bold Text so Mobile never washes it out */}
                                <div className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition">
                                  {sub.title}
                                </div>
                                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                                  আপলোডকৃত লেকচার: {stats.totalCount}টি
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-extrabold bg-slate-100 px-2.5 py-1 rounded-md text-slate-900 block">
                                প্রিলি: {sub.preliMarks}
                              </span>
                              {sub.writtenMarks > 0 && (
                                <span className="text-xs text-blue-700 font-bold mt-0.5 block">
                                  লিখিত: {sub.writtenMarks}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${stats.percent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>সম্পন্ন {stats.completedCount}/{stats.totalCount}</span>
                            <span className="text-blue-700">{stats.percent}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Summary Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-slate-900">
                    <div className="font-extrabold text-base mb-1">আজকের লাইভ মক টেস্ট</div>
                    <p className="text-sm text-slate-600 mb-4">
                      প্রতি প্রশ্নের সময়: ৩০ সেকেন্ড · নেগেটিভ মার্কিং: ০.৫০
                    </p>
                    <button
                      onClick={() => startChapterExam("ALL", null, "আজকের লাইভ মক টেস্ট (৫০টি র‍্যান্ডম প্রশ্ন)")}
                      className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-black transition cursor-pointer"
                    >
                      মক টেস্ট শুরু করুন →
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-slate-900">
                    <div className="font-extrabold text-base mb-1">বিসিএস মানবণ্টন সামারি</div>
                    <p className="text-sm text-slate-600 mb-4">পিএসসি নির্ধারিত সর্বশেষ সিলেবাস</p>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between p-3 bg-blue-50 text-blue-950 rounded-xl font-bold">
                        <span>প্রিলিমিনারি পরীক্ষা (MCQ)</span>
                        <span>২০০ নম্বর</span>
                      </div>
                      <div className="flex justify-between p-3 bg-purple-50 text-purple-950 rounded-xl font-bold">
                        <span>লিখিত পরীক্ষা (আবশ্যিক)</span>
                        <span>৯০০ নম্বর</span>
                      </div>
                      <div className="flex justify-between p-3 bg-emerald-50 text-emerald-950 rounded-xl font-bold">
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

        {/* ================= 2. LECTURE HUB (WIDE PDF VIEWER + TEXT VIEW + 4-STEP DYNAMIC COMPLETION) ================= */}
        {activeTab === "subject_lectures" && (
          <div className="space-y-5">
            {/* Subject Switcher Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-slate-900">
              <div>
                <h2 className="font-extrabold text-lg sm:text-xl text-slate-900">
                  {currentSubject.title} — লেকচার নোট ও পিডিএফ হাব
                </h2>
                <p className="text-sm font-medium text-slate-600">
                  প্রিলিমিনারি: {currentSubject.preliMarks} নম্বর · লিখিত: {currentSubject.writtenMarks} নম্বর · মোট আপলোডকৃত লেকচার: {subjectLectures.length}টি
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                  {isSidebarCollapsed ? "লেকচার তালিকা দেখান" : "তালিকা লুকিয়ে বড় ভিউ দেখুন"}
                </button>

                <select
                  value={activeSubjectId}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-extrabold bg-slate-50 text-slate-900"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Clean Student Lecture List (NO "+ লেকচার যোগ" button for students!) */}
              {!isSidebarCollapsed && (
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-slate-900">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="font-extrabold text-base text-slate-900">
                      অধ্যায় / লেকচার তালিকা ({subjectLectures.length}টি)
                    </span>
                  </div>

                  {subjectLectures.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-sm font-bold text-slate-700 mb-1">
                        এই বিষয়ে এখনো কোনো লেকচার আপলোড করা হয়নি।
                      </p>
                      <p className="text-xs text-slate-500">
                        অ্যাডমিন নতুন লেকচার আপলোড করলে এখানে স্বয়ংক্রিয়ভাবে যুক্ত হবে।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                      {subjectLectures.map((lec) => {
                        const lecId = lec._id || lec.id;
                        const isSelected = (activeLecture?._id || activeLecture?.id) === lecId;
                        const isDone = progressMap[lecId]?.completed;
                        return (
                          <div
                            key={lecId}
                            onClick={() => {
                              setActiveLecture(lec);
                              setActivePdfStep("lecture");
                              markLectureStep(lecId, "lecture");
                            }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                : "bg-white text-slate-900 border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-8 h-8 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 ${
                                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-900"
                                }`}
                              >
                                {lec.lectureNo < 10 ? `0${lec.lectureNo}` : lec.lectureNo}
                              </span>
                              <div>
                                <div className="text-sm font-bold leading-snug">
                                  Lecture {lec.lectureNo < 10 ? `0${lec.lectureNo}` : lec.lectureNo}: {lec.title}
                                </div>
                                <div className={`text-xs mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                                  {isDone ? "✓ সম্পূর্ণ পঠিত" : "চলমান অধ্যায়"}
                                </div>
                              </div>
                            </div>
                            <CheckCircle2
                              className={`w-5 h-5 shrink-0 ${
                                isDone
                                  ? "text-emerald-500"
                                  : isSelected
                                  ? "text-slate-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Right Column: Expansive Wide Reader (9 Cols or 12 Cols when Sidebar Collapsed) */}
              <div className={`${isSidebarCollapsed ? "lg:col-span-12" : "lg:col-span-9"} space-y-6`}>
                {!activeLecture ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center text-slate-600 text-base font-semibold">
                    {subjectLectures.length === 0
                      ? "এই সাবজেক্টে এখনো কোনো লেকচার আপলোড করা হয়নি।"
                      : "বাম পাশের তালিকা থেকে একটি লেকচার নির্বাচন করুন।"}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6 text-slate-900">
                    {/* Top Title + PDF/Text View Switcher + Fullscreen Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-md bg-blue-50 text-blue-800">
                          {currentSubject.title} · Lecture {activeLecture.lectureNo < 10 ? `0${activeLecture.lectureNo}` : activeLecture.lectureNo}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5">
                          {activeLecture.title}
                        </h3>
                      </div>

                      {/* PDF View vs Text View Toggle */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                          <button
                            onClick={() => setContentViewMode("pdf")}
                            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${
                              contentViewMode === "pdf"
                                ? "bg-slate-900 text-white shadow-2xs"
                                : "text-slate-700 hover:text-slate-900"
                            }`}
                          >
                            📄 PDF View
                          </button>
                          <button
                            onClick={() => setContentViewMode("text")}
                            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${
                              contentViewMode === "text"
                                ? "bg-slate-900 text-white shadow-2xs"
                                : "text-slate-700 hover:text-slate-900"
                            }`}
                          >
                            📝 Text View
                          </button>
                        </div>

                        <button
                          onClick={() => setIsPdfFullscreen(true)}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-bold hover:bg-slate-100 flex items-center gap-1.5"
                        >
                          <Maximize2 className="w-4 h-4" /> ফুলস্ক্রিন ভিউ
                        </button>
                      </div>
                    </div>

                    {/* 3-Tier Step Selector (Tracks Completion Dynamically) */}
                    {(() => {
                      const lecId = activeLecture._id || activeLecture.id;
                      const stepsDone = progressMap[lecId] || { lecture: true };
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <button
                            onClick={() => {
                              setActivePdfStep("lecture");
                              markLectureStep(lecId, "lecture");
                            }}
                            className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                              activePdfStep === "lecture"
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 shrink-0" />
                              <div>
                                <div className="text-sm font-extrabold">১. মূল লেকচার নোট</div>
                                <div className={`text-xs ${activePdfStep === "lecture" ? "text-blue-100" : "text-slate-600"}`}>
                                  PDF ও রঙিন টেক্সট ভিউ
                                </div>
                              </div>
                            </div>
                            {stepsDone.lecture && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          </button>

                          <button
                            onClick={() => {
                              setActivePdfStep("mcq_pdf");
                              markLectureStep(lecId, "mcq");
                            }}
                            className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                              activePdfStep === "mcq_pdf"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <HelpCircle className="w-5 h-5 shrink-0" />
                              <div>
                                <div className="text-sm font-extrabold">২. এই Chapter-এর সকল MCQ</div>
                                <div className={`text-xs ${activePdfStep === "mcq_pdf" ? "text-emerald-100" : "text-slate-600"}`}>
                                  অধ্যায়ভিত্তিক MCQ শিট
                                </div>
                              </div>
                            </div>
                            {stepsDone.mcq && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          </button>

                          <button
                            onClick={() => {
                              setActivePdfStep("written_pdf");
                              markLectureStep(lecId, "written");
                            }}
                            className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                              activePdfStep === "written_pdf"
                                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <PenTool className="w-5 h-5 shrink-0" />
                              <div>
                                <div className="text-sm font-extrabold">৩. লিখিত প্রশ্ন ও উত্তর</div>
                                <div className={`text-xs ${activePdfStep === "written_pdf" ? "text-purple-100" : "text-slate-600"}`}>
                                  Written Q&A গাইডলাইন
                                </div>
                              </div>
                            </div>
                            {stepsDone.written && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          </button>
                        </div>
                      );
                    })()}

                    {/* ================= WIDE READER AREA ================= */}
                    <div className={`space-y-6 ${screenshotGuard ? "filter blur-lg select-none" : ""}`}>
                      
                      {/* STEP 1: LECTURE (PDF OR TEXT VIEW) */}
                      {activePdfStep === "lecture" && (
                        <div className="space-y-6">
                          {contentViewMode === "pdf" && activeLecture.lecturePdfUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-lg relative">
                              <div className="bg-slate-900 text-white px-5 py-3 text-sm font-bold flex flex-wrap justify-between items-center gap-2">
                                <span>📄 Lecture {activeLecture.lectureNo}: {activeLecture.title} (PDF View)</span>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-700">
                                    🔒 Anti-Download সুরক্ষিত
                                  </span>
                                  <button
                                    onClick={() => setIsPdfFullscreen(true)}
                                    className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold hover:bg-slate-200"
                                  >
                                    ⛶ বড় পর্দায় দেখুন
                                  </button>
                                </div>
                              </div>
                              {/* Protective Overlay over top-right popout/download button */}
                              <div className="relative w-full h-[760px] bg-white">
                                <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" title="Download Disabled" />
                                <iframe
                                  src={formatSecurePdfUrl(activeLecture.lecturePdfUrl)}
                                  className="w-full h-full border-0"
                                  title="Lecture PDF Viewer"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {contentViewMode === "pdf" && !activeLecture.lecturePdfUrl && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-950">
                                  এই লেকচারে কোনো PDF ফাইল দেওয়া হয়নি, নিচে <strong>Text View</strong> দেখানো হচ্ছে:
                                </div>
                              )}
                              {activeLecture.mainContent ? (
                                <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200">
                                  <div className="font-extrabold text-blue-950 text-base mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-700" /> মূল লেকচার নোট (Text View)
                                  </div>
                                  <div className="text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium">
                                    {activeLecture.mainContent}
                                  </div>
                                </div>
                              ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border text-slate-600 text-sm font-semibold">
                                  এই লেকচারের টেক্সট ভার্সন এখনো যুক্ত করা হয়নি। উপরে PDF View বাটনে ক্লিক করে PDF পড়ুন।
                                </div>
                              )}

                              {activeLecture.mnemonic && (
                                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                                  <div className="font-extrabold text-emerald-900 text-base mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-emerald-700" /> মনে রাখার সুপার টেকনিক (Mnemonics)
                                  </div>
                                  <p className="text-base text-emerald-950 leading-relaxed whitespace-pre-line font-medium">
                                    {activeLecture.mnemonic}
                                  </p>
                                </div>
                              )}

                              {activeLecture.confusionBox && (
                                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                                  <div className="font-extrabold text-amber-900 text-base mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-700" /> কনফিউশন ক্লিয়ার বক্স
                                  </div>
                                  <div className="text-base text-amber-950 leading-relaxed whitespace-pre-line font-medium">
                                    {activeLecture.confusionBox}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* STEP 2: CHAPTER MCQ (PDF OR TEXT VIEW) */}
                      {activePdfStep === "mcq_pdf" && (
                        <div className="space-y-5">
                          {contentViewMode === "pdf" && activeLecture.mcqPdfUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-emerald-900 bg-slate-900 shadow-lg">
                              <div className="bg-emerald-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                                <span>📑 এই Chapter-এর সকল MCQ PDF (Lecture {activeLecture.lectureNo})</span>
                                <button
                                  onClick={() => setIsPdfFullscreen(true)}
                                  className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold"
                                >
                                  ⛶ ফুলস্ক্রিন ভিউ
                                </button>
                              </div>
                              <div className="relative w-full h-[760px] bg-white">
                                <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                                <iframe
                                  src={formatSecurePdfUrl(activeLecture.mcqPdfUrl)}
                                  className="w-full h-full border-0"
                                  title="Chapter MCQ PDF Viewer"
                                />
                              </div>
                            </div>
                          ) : activeLecture.mcqTextContent ? (
                            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                              <h4 className="font-extrabold text-base text-emerald-950 mb-3">
                                📝 এই Chapter-এর সকল MCQ (Text View)
                              </h4>
                              <div className="text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium">
                                {activeLecture.mcqTextContent}
                              </div>
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed border-slate-300 text-center bg-slate-50">
                              <p className="text-base font-bold text-slate-800 mb-1">
                                এই অধ্যায়ের MCQ PDF / Text এখনো আপলোড করা হয়নি
                              </p>
                              <p className="text-sm text-slate-600">
                                অ্যাডমিন প্যানেল থেকে এই লেকচারের জন্য MCQ PDF বা Text যুক্ত করুন।
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* STEP 3: WRITTEN Q&A (PDF OR TEXT VIEW) */}
                      {activePdfStep === "written_pdf" && (
                        <div className="space-y-5">
                          {contentViewMode === "pdf" && activeLecture.writtenPdfUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-purple-900 bg-slate-900 shadow-lg">
                              <div className="bg-purple-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                                <span>✍️ লিখিত প্রশ্ন ও উত্তর PDF (Lecture {activeLecture.lectureNo})</span>
                                <button
                                  onClick={() => setIsPdfFullscreen(true)}
                                  className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold"
                                >
                                  ⛶ ফুলস্ক্রিন ভিউ
                                </button>
                              </div>
                              <div className="relative w-full h-[760px] bg-white">
                                <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                                <iframe
                                  src={formatSecurePdfUrl(activeLecture.writtenPdfUrl)}
                                  className="w-full h-full border-0"
                                  title="Written Q&A PDF Viewer"
                                />
                              </div>
                            </div>
                          ) : activeLecture.writtenTextContent ? (
                            <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200">
                              <h4 className="font-extrabold text-base text-purple-950 mb-3">
                                ✍️ লিখিত প্রশ্ন ও উত্তর (Text View)
                              </h4>
                              <div className="text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium">
                                {activeLecture.writtenTextContent}
                              </div>
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed border-slate-300 text-center bg-slate-50">
                              <p className="text-base font-bold text-slate-800 mb-1">
                                এই অধ্যায়ের লিখিত প্রশ্নোত্তর PDF / Text এখনো আপলোড করা হয়নি
                              </p>
                              <p className="text-sm text-slate-600">
                                অ্যাডমিন প্যানেল থেকে Written Question with Answer যুক্ত করুন।
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* STEP 4 & COMPLETION BAR: ONLINE EXAM + COMPLETE & GO TO NEXT LECTURE */}
                      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
                          <div>
                            <span className="text-xs uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
                              ধাপ ৪ · অনলাইন অ্যাসেসমেন্ট
                            </span>
                            <h4 className="font-extrabold text-lg mt-2">
                              এই অধ্যায়ের অনলাইন MCQ পরীক্ষায় অংশ নিন
                            </h4>
                            <p className="text-sm text-slate-300 mt-0.5">
                              এলোমেলোভাবে ৫০টি প্রশ্ন · প্রতি প্রশ্নের সময় ৩০ সেকেন্ড · ভুল উত্তরের বিস্তারিত ব্যাখ্যা
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              startChapterExam(
                                activeLecture.subjectId,
                                activeLecture.lectureNo,
                                `Lecture ${activeLecture.lectureNo}: ${activeLecture.title}`,
                                activeLecture._id || activeLecture.id
                              )
                            }
                            className="px-6 py-3.5 bg-emerald-500 text-white rounded-xl text-sm font-black hover:bg-emerald-600 whitespace-nowrap shadow-lg cursor-pointer"
                          >
                            পরীক্ষা দিন →
                          </button>
                        </div>

                        {/* Dynamic Lecture Completion Button */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="text-xs sm:text-sm text-slate-300">
                            লেকচারের সবগুলো অংশ (PDF + MCQ + Written + Exam) দেখা শেষ হলে নিচের বাটনে ক্লিক করে লেকচারটি সম্পন্ন করুন:
                          </div>
                          <button
                            onClick={() => completeAndGoToNextLecture(activeLecture, subjectLectures)}
                            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-extrabold hover:bg-blue-500 whitespace-nowrap flex items-center gap-2 cursor-pointer"
                          >
                            <CheckSquare className="w-4 h-4" />
                            ✓ লেকচার সম্পন্ন করে পরবর্তী লেকচারে যান →
                          </button>
                        </div>
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
          <div className="space-y-6 text-slate-900">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">বিসিএস পূর্ণাঙ্গ সিলেবাস ও নম্বর বণ্টন (প্রিলি + রিটেন)</h2>
                <p className="text-sm text-slate-600 mt-1">কোন সাবজেক্টের কোন টপিক থেকে কত নম্বর আসে তার নিখুঁত গাইডলাইন</p>
              </div>
              <div className="flex gap-2.5 text-sm font-extrabold">
                <span className="px-3.5 py-2 bg-blue-50 text-blue-800 rounded-xl">প্রিলি মোট: ২০০</span>
                <span className="px-3.5 py-2 bg-purple-50 text-purple-800 rounded-xl">রিটেন মোট: ৯০০</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {subjects.map((sub, idx) => {
                const stats = getSubjectDynamicStats(sub.id);
                return (
                  <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <span className={`w-10 h-10 rounded-xl ${sub.bg} ${sub.text} font-extrabold flex items-center justify-center text-base`}>
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-lg text-slate-900">{sub.title}</h3>
                          <p className="text-xs font-semibold text-slate-600">আপলোডকৃত লেকচার: {stats.totalCount}টি</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleSelectSubject(sub.id)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-extrabold hover:bg-black"
                        >
                          লেকচার ও PDF দেখুন →
                        </button>
                        <span className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold">
                          প্রিলিমিনারি: {sub.preliMarks}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sub.syllabusBreakdown.map((item, i) => (
                          <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-extrabold text-base text-slate-900">{item.topic}</span>
                              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
                                {item.marks} নম্বর
                              </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{item.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. QUESTION BANK HUB (SUBJECT-WISE PDF VIEW + TEXT VIEW + MCQ PRACTICE) ================= */}
        {activeTab === "qbank" && (
          <div className="space-y-6 text-slate-900">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  বিসিএস বিষয়ভিত্তিক প্রশ্নব্যাংক (PDF View ও Text View)
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  ১০ম - ৪৬তম বিসিএস ও বিষয়ভিত্তিক প্রশ্নব্যাংক সরাসরি PDF অথবা রঙিন Text ভার্সনে পড়ুন
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedQbSubject}
                  onChange={(e) => setSelectedQbSubject(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-extrabold bg-slate-50 text-slate-900"
                >
                  <option value="ALL">সকল বিষয় ({qbankDocs.length}টি ফাইল)</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>

                {/* Switch between PDF View, Text View & Interactive MCQ */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    onClick={() => setQbankViewMode("pdf")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${
                      qbankViewMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-700"
                    }`}
                  >
                    📄 PDF View
                  </button>
                  <button
                    onClick={() => setQbankViewMode("text")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${
                      qbankViewMode === "text" ? "bg-slate-900 text-white" : "text-slate-700"
                    }`}
                  >
                    📝 Text View
                  </button>
                  <button
                    onClick={() => setQbankViewMode("mcq_practice")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${
                      qbankViewMode === "mcq_practice" ? "bg-slate-900 text-white" : "text-slate-700"
                    }`}
                  >
                    🎯 MCQ অনুশীলন
                  </button>
                </div>
              </div>
            </div>

            {qbankViewMode === "mcq_practice" ? (
              <div className="space-y-4">
                {questionBank.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border text-center text-slate-600 font-bold">
                    এখনো কোনো MCQ প্রশ্ন আপলোড করা হয়নি।
                  </div>
                ) : (
                  questionBank
                    .filter((q) => selectedQbSubject === "ALL" || q.subjectId === selectedQbSubject)
                    .map((q, idx) => {
                      const qKey = q._id || q.id;
                      const isRevealed = revealedAnswers[qKey];
                      return (
                        <div key={qKey} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                              {idx + 1}. {q.question}
                            </h3>
                            <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-extrabold whitespace-nowrap">
                              {q.bcsBatch}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = optIdx === q.correctAnswer;
                              return (
                                <div
                                  key={optIdx}
                                  onClick={() => setRevealedAnswers({ ...revealedAnswers, [qKey]: true })}
                                  className={`p-3.5 rounded-xl border text-sm font-bold cursor-pointer transition ${
                                    isRevealed
                                      ? isCorrect
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-950"
                                        : "bg-slate-50 text-slate-600 border-slate-200"
                                      : "bg-white text-slate-900 border-slate-300 hover:border-slate-900"
                                  }`}
                                >
                                  {String.fromCharCode(2453 + optIdx)}. {opt}
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => setRevealedAnswers({ ...revealedAnswers, [qKey]: !isRevealed })}
                            className="text-sm font-extrabold text-blue-600 hover:underline"
                          >
                            {isRevealed ? "ব্যাখ্যা লুকান ▲" : "সঠিক উত্তর ও বিস্তারিত ব্যাখ্যা দেখুন ▼"}
                          </button>
                          {isRevealed && (
                            <div className="mt-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950 leading-relaxed font-medium">
                              <strong>সঠিক উত্তর:</strong> {q.options[q.correctAnswer]} <br />
                              <strong>ব্যাখ্যা:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left List of Uploaded Question Bank Files */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="font-extrabold text-base border-b border-slate-200 pb-3">
                    প্রশ্নব্যাংক তালিকা ({filteredQbankDocs.length}টি)
                  </div>
                  {filteredQbankDocs.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-sm text-slate-600 font-semibold">
                      এই বিষয়ে এখনো কোনো প্রশ্নব্যাংক PDF বা Text আপলোড করা হয়নি। অ্যাডমিন প্যানেল থেকে আপলোড করুন।
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredQbankDocs.map((doc) => {
                        const dId = doc._id || doc.id;
                        const isSelected = (activeQbankDoc?._id || activeQbankDoc?.id) === dId;
                        const subTitle = subjects.find((s) => s.id === doc.subjectId)?.title;
                        return (
                          <div
                            key={dId}
                            onClick={() => setActiveQbankDoc(doc)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition ${
                              isSelected
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-900 border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-800"}`}>
                              {subTitle} · {doc.bcsBatch}
                            </span>
                            <div className="font-extrabold text-sm mt-1.5">{doc.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Wide Viewer for Question Bank PDF / Text */}
                <div className="lg:col-span-9">
                  {!activeQbankDoc ? (
                    <div className="bg-white rounded-2xl border p-12 text-center text-slate-600 font-bold">
                      বাম পাশ থেকে একটি প্রশ্নব্যাংক নির্বাচন করুন অথবা অ্যাডমিন প্যানেল থেকে নতুন প্রশ্নব্যাংক PDF/Text আপলোড করুন।
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                      <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                        <div>
                          <span className="text-xs font-extrabold bg-blue-50 text-blue-800 px-3 py-1 rounded-md">
                            {activeQbankDoc.bcsBatch}
                          </span>
                          <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeQbankDoc.title}</h3>
                        </div>
                        <button
                          onClick={() => setIsPdfFullscreen(true)}
                          className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-extrabold hover:bg-slate-100 flex items-center gap-1.5"
                        >
                          <Maximize2 className="w-4 h-4" /> ফুলস্ক্রিন ভিউ
                        </button>
                      </div>

                      {qbankViewMode === "pdf" && activeQbankDoc.pdfUrl ? (
                        <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900">
                          <div className="bg-slate-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                            <span>📄 {activeQbankDoc.title} (PDF View)</span>
                            <span className="text-xs text-emerald-400">🔒 Anti-Download সক্রিয়</span>
                          </div>
                          <div className="relative w-full h-[760px] bg-white">
                            <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                            <iframe
                              src={formatSecurePdfUrl(activeQbankDoc.pdfUrl)}
                              className="w-full h-full border-0"
                              title="Question Bank PDF"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {activeQbankDoc.textContent ? (
                            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium">
                              {activeQbankDoc.textContent}
                            </div>
                          ) : (
                            <div className="p-10 text-center bg-slate-50 rounded-xl border text-slate-600 font-semibold">
                              এই প্রশ্নব্যাংকের Text View এখনো যোগ করা হয়নি। উপরে PDF View সিলেক্ট করুন।
                            </div>
                          )}
                          {activeQbankDoc.highlightBox && (
                            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-base text-emerald-950 leading-relaxed whitespace-pre-line font-medium">
                              {activeQbankDoc.highlightBox}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 5. CHAPTER-WISE RANDOM 50 MCQ EXAM SYSTEM ================= */}
        {activeTab === "exam" && (
          <div className="space-y-6 text-slate-900">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4 sticky top-16 z-30">
              <div>
                <span className="text-xs font-extrabold text-blue-600 uppercase">অনলাইন এমসিকিউ পরীক্ষা · ৩০ সেকেন্ড/প্রশ্ন</span>
                <h2 className="text-xl font-extrabold text-slate-900">{examTitle || "বিসিএস অধ্যায়ভিত্তিক পরীক্ষা"}</h2>
                <p className="text-sm text-slate-600">
                  মোট প্রশ্ন: {examQuestions.length}টি · সঠিক উত্তরে +১ · ভুল উত্তরে -০.৫০
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-extrabold text-base">
                  <Clock className="w-5 h-5" /> সময় বাকি: {formatTime(timeLeft)}
                </div>
                {!examSubmitted && (
                  <button
                    onClick={handleFinishExam}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold hover:bg-black cursor-pointer"
                  >
                    খাতা জমা দিন
                  </button>
                )}
              </div>
            </div>

            {examSubmitted && (
              <div className="bg-white border-2 border-emerald-500 p-6 rounded-2xl shadow-sm space-y-6">
                {(() => {
                  const res = calculateExamResult();
                  return (
                    <>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                        <div>
                          <h3 className="text-xl font-black text-slate-900">📊 আপনার পরীক্ষার ফলাফল কার্ড</h3>
                          <p className="text-sm text-slate-600">নিচে প্রতিটি ভুল উত্তরের বিস্তারিত ব্যাখ্যা দেওয়া হয়েছে</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={retakeSameQuestionSet}
                            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-black flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-4 h-4" /> একই প্রশ্নসেটে আবার পরীক্ষা দিন
                          </button>
                          <button
                            onClick={startNewRandomSetFromSameChapter}
                            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                          >
                            <Shuffle className="w-4 h-4" /> নতুন প্রশ্নসেটে আরেকটি পরীক্ষা দিন (Random 50)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                        <div className="bg-slate-50 p-4 rounded-xl border">
                          <div className="text-xs font-bold text-slate-600">মোট প্রশ্ন</div>
                          <div className="text-2xl font-black">{examQuestions.length}</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                          <div className="text-xs font-bold text-emerald-800">সঠিক উত্তর (+১)</div>
                          <div className="text-2xl font-black text-emerald-700">{res.correct}</div>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                          <div className="text-xs font-bold text-rose-800">ভুল উত্তর</div>
                          <div className="text-2xl font-black text-rose-700">{res.wrong}</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                          <div className="text-xs font-bold text-amber-800">নেগেটিভ (-০.৫)</div>
                          <div className="text-2xl font-black text-amber-700">-{res.negativePenalty}</div>
                        </div>
                        <div className="bg-slate-900 text-white p-4 rounded-xl">
                          <div className="text-xs font-bold text-slate-300">চূড়ান্ত নম্বর</div>
                          <div className="text-2xl font-black text-emerald-400">{res.finalScore}</div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const qKey = q._id || q.id;
                const selectedOpt = examAnswers[qKey];
                const isWrongAnswer = examSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctAnswer;

                return (
                  <div
                    key={qKey}
                    className={`bg-white p-6 rounded-2xl border shadow-xs ${
                      isWrongAnswer ? "ring-2 ring-rose-400 bg-rose-50/10" : "border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                        {idx + 1}. {q.question}
                      </h3>
                      {isWrongAnswer && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-extrabold shrink-0">
                          ✗ ভুল উত্তর
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        let style = "bg-white text-slate-900 border-slate-300 hover:border-slate-900";
                        if (!examSubmitted && selectedOpt === optIdx) {
                          style = "bg-slate-900 text-white border-slate-900 font-extrabold";
                        } else if (examSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            style = "bg-emerald-50 border-emerald-500 text-emerald-950 font-extrabold";
                          } else if (selectedOpt === optIdx) {
                            style = "bg-rose-50 border-rose-500 text-rose-950 font-extrabold";
                          }
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={examSubmitted}
                            onClick={() => setExamAnswers({ ...examAnswers, [qKey]: optIdx })}
                            className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition ${style}`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {examSubmitted && (
                      <div
                        className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${
                          isWrongAnswer
                            ? "bg-rose-50 border-rose-200 text-rose-950"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="font-extrabold mb-1">✓ সঠিক উত্তর: {q.options[q.correctAnswer]}</div>
                        <div>
                          <strong>ব্যাখ্যা:</strong> {q.explanation || "সিলেবাস ও প্রামাণ্য তথ্যের ভিত্তিতে যাচাইকৃত।"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 6. ADMIN CMS (LECTURES + QUESTION BANK PDF/TEXT + EXAM MCQ) ================= */}
        {activeTab === "admin" && (
          <div className="text-slate-900">
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center my-12">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold mb-1">অ্যাডমিন সিকিউরিটি লক</h2>
                <p className="text-sm text-slate-600 mb-5">লেকচার, প্রশ্নব্যাংক ও প্রশ্ন আপলোড করতে পিন দিন (`bcs2026`)</p>
                <input
                  type="password"
                  placeholder="অ্যাডমিন পিন লিখুন (bcs2026)"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="w-full p-3.5 border border-slate-300 rounded-xl text-sm mb-4 text-center outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  onClick={() => {
                    if (adminPinInput === "bcs2026") setIsAdminUnlocked(true);
                    else alert("❌ ভুল পিন! সঠিক পিন দিন: bcs2026");
                  }}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-extrabold hover:bg-black"
                >
                  অ্যাডমিন প্যানেল আনলক করুন
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Admin Sub-Navigation Tabs */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-3">
                  <button
                    onClick={() => setAdminSection("lectures")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${
                      adminSection === "lectures" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    ১. লেকচার আপলোড (PDF + Text View)
                  </button>
                  <button
                    onClick={() => setAdminSection("qbank")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${
                      adminSection === "qbank" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    ২. বিষয়ভিত্তিক প্রশ্নব্যাংক আপলোড (PDF + Text View)
                  </button>
                  <button
                    onClick={() => setAdminSection("mcq")}
                    className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${
                      adminSection === "mcq" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    ৩. অনলাইন পরীক্ষার MCQ প্রশ্ন সেটআপ
                  </button>
                </div>

                {/* ADMIN TAB 1: LECTURE (PDF + TEXT) UPLOADER */}
                {adminSection === "lectures" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h2 className="text-xl font-extrabold mb-1">
                        {editingId ? "✏️ লেকচার আপডেট করুন (সাবজেক্ট পরিবর্তনসহ)" : "➕ নির্দিষ্ট সাবজেক্টে নতুন লেকচার আপলোড করুন"}
                      </h2>
                      <p className="text-sm text-slate-600 mb-5">
                        যে সাবজেক্ট সিলেক্ট করবেন, লেকচারের PDF ও Text ঠিক সেই সাবজেক্টের ভেতরেই জমা হবে।
                      </p>

                      <form onSubmit={handleSaveLecture} className="space-y-4 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                          <div>
                            <label className="font-extrabold block mb-1 text-blue-950">১. কোন সাবজেক্টে আপলোড করবেন? *</label>
                            <select
                              value={formData.subjectId}
                              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                              className="w-full p-3 border border-blue-300 rounded-xl bg-white font-extrabold text-slate-900"
                            >
                              {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1 text-blue-950">২. লেকচার নম্বর (যেমন: 1, 2, 3) *</label>
                            <input
                              type="number"
                              placeholder="যেমন: 1"
                              value={formData.lectureNo}
                              onChange={(e) => setFormData({ ...formData, lectureNo: e.target.value })}
                              className="w-full p-3 border border-blue-300 rounded-xl bg-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">লেকচারের শিরোনাম (Title) *</label>
                          <input
                            type="text"
                            placeholder="যেমন: প্রাচীন যুগ থেকে মুঘল আমল পর্যন্ত"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border border-slate-300 rounded-xl font-semibold"
                          />
                        </div>

                        {/* 3 PDF Upload Fields */}
                        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="font-extrabold text-base">📄 PDF View ফাইলসমূহ (ফাইল সিলেক্ট করুন বা Google Drive লিংক দিন):</div>

                          <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-2">
                            <label className="font-extrabold text-blue-800 block">১. মূল লেকচার নোট PDF</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="Google Drive বা PDF লিংক..."
                                value={formData.lecturePdfUrl}
                                onChange={(e) => setFormData({ ...formData, lecturePdfUrl: e.target.value })}
                                className="flex-1 p-2.5 border rounded-lg"
                              />
                              <label className="px-4 py-2.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                                <Upload className="w-4 h-4" /> PDF ফাইল নিন
                                <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "lecturePdfUrl")} className="hidden" />
                              </label>
                            </div>
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-2">
                            <label className="font-extrabold text-emerald-800 block">২. “এই Chapter-এর সকল MCQ” PDF</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="অধ্যায়ভিত্তিক সকল MCQ PDF লিংক..."
                                value={formData.mcqPdfUrl}
                                onChange={(e) => setFormData({ ...formData, mcqPdfUrl: e.target.value })}
                                className="flex-1 p-2.5 border rounded-lg"
                              />
                              <label className="px-4 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                                <Upload className="w-4 h-4" /> PDF ফাইল নিন
                                <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "mcqPdfUrl")} className="hidden" />
                              </label>
                            </div>
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-2">
                            <label className="font-extrabold text-purple-800 block">৩. লিখিত প্রশ্ন ও উত্তর PDF (Written Q&A)</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="লিখিত প্রশ্ন ও উত্তরের PDF লিংক..."
                                value={formData.writtenPdfUrl}
                                onChange={(e) => setFormData({ ...formData, writtenPdfUrl: e.target.value })}
                                className="flex-1 p-2.5 border rounded-lg"
                              />
                              <label className="px-4 py-2.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                                <Upload className="w-4 h-4" /> PDF ফাইল নিন
                                <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "writtenPdfUrl")} className="hidden" />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Rich Text View Fields */}
                        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="font-extrabold text-base">📝 Text View নোটসমূহ (PDF-এর পাশাপাশি টেক্সট ভার্সনে পড়ার জন্য):</div>
                          <textarea
                            rows={4}
                            placeholder="🔵 মূল লেকচার নোট (Text View)..."
                            value={formData.mainContent}
                            onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })}
                            className="w-full p-3 border border-blue-200 bg-white rounded-xl"
                          />
                          <textarea
                            rows={2}
                            placeholder="🟢 মনে রাখার শর্টকাট ছন্দ (Mnemonics)..."
                            value={formData.mnemonic}
                            onChange={(e) => setFormData({ ...formData, mnemonic: e.target.value })}
                            className="w-full p-3 border border-emerald-200 bg-white rounded-xl"
                          />
                          <textarea
                            rows={3}
                            placeholder="📑 এই অধ্যায়ের সকল MCQ (Text View)..."
                            value={formData.mcqTextContent}
                            onChange={(e) => setFormData({ ...formData, mcqTextContent: e.target.value })}
                            className="w-full p-3 border border-slate-300 bg-white rounded-xl"
                          />
                          <textarea
                            rows={3}
                            placeholder="✍️ লিখিত প্রশ্ন ও উত্তর (Text View)..."
                            value={formData.writtenTextContent}
                            onChange={(e) => setFormData({ ...formData, writtenTextContent: e.target.value })}
                            className="w-full p-3 border border-purple-200 bg-white rounded-xl"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button type="submit" className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-extrabold hover:bg-black cursor-pointer">
                            {editingId ? "✓ লেকচার আপডেট সেভ করুন" : "🚀 লেকচার পাবলিশ করুন"}
                          </button>
                          {editingId && (
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-5 py-3.5 border rounded-xl font-bold"
                            >
                              বাতিল
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Uploaded Lectures List (With Subject Re-assign / Edit option) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                      <h3 className="font-extrabold text-lg mb-2">আপলোডকৃত সকল লেকচার ({lectures.length}টি)</h3>
                      <p className="text-xs text-slate-600 mb-4">
                        কোনো লেকচার ভুল সাবজেক্টে চলে গেলে "এডিট" বাটনে ক্লিক করে সাবজেক্ট পরিবর্তন করে দিন।
                      </p>
                      <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
                        {lectures.map((lec) => {
                          const subName = subjects.find((s) => s.id === lec.subjectId)?.title;
                          const lKey = lec._id || lec.id;
                          return (
                            <div key={lKey} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
                              <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-md w-fit">
                                {subName} · Lec {lec.lectureNo}
                              </span>
                              <div className="font-extrabold text-sm text-slate-900">{lec.title}</div>
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={() => {
                                    setActiveSubjectId(lec.subjectId);
                                    setActiveLecture(lec);
                                    navigateTo("subject_lectures");
                                  }}
                                  className="flex-1 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                                >
                                  দেখুন
                                </button>
                                <button
                                  onClick={() => handleEditLectureClick(lec)}
                                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> এডিট/সাবজেক্ট বদলান
                                </button>
                                <button
                                  onClick={() => handleDeleteLecture(lKey)}
                                  className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ADMIN TAB 2: QUESTION BANK (PDF + TEXT VIEW) UPLOADER */}
                {adminSection === "qbank" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h2 className="text-xl font-extrabold">
                        {editingQbId ? "✏️ প্রশ্নব্যাংক আপডেট করুন" : "➕ বিষয়ভিত্তিক প্রশ্নব্যাংক আপলোড করুন (PDF + Text View)"}
                      </h2>
                      <form onSubmit={handleSaveQbankDoc} className="space-y-4 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-extrabold block mb-1">বিষয় নির্বাচন করুন</label>
                            <select
                              value={qbFormData.subjectId}
                              onChange={(e) => setQbFormData({ ...qbFormData, subjectId: e.target.value })}
                              className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-bold"
                            >
                              {subjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1">বিসিএস ব্যাচ / ট্যাগ</label>
                            <input
                              type="text"
                              placeholder="যেমন: ১০ম - ৪৬তম বিসিএস প্রশ্নব্যাংক"
                              value={qbFormData.bcsBatch}
                              onChange={(e) => setQbFormData({ ...qbFormData, bcsBatch: e.target.value })}
                              className="w-full p-3 border border-slate-300 rounded-xl"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">প্রশ্নব্যাংকের শিরোনাম *</label>
                          <input
                            type="text"
                            placeholder="যেমন: বাংলাদেশ বিষয়াবলি — বিগত ১০ম থেকে ৪৬তম বিসিএসের ব্যাখ্যাসহ প্রশ্নব্যাংক"
                            value={qbFormData.title}
                            onChange={(e) => setQbFormData({ ...qbFormData, title: e.target.value })}
                            className="w-full p-3 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                          <label className="font-extrabold text-blue-900 block">📄 প্রশ্নব্যাংক PDF ফাইল বা Google Drive লিংক</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="প্রশ্নব্যাংক PDF-এর লিংক পেস্ট করুন..."
                              value={qbFormData.pdfUrl}
                              onChange={(e) => setQbFormData({ ...qbFormData, pdfUrl: e.target.value })}
                              className="flex-1 p-2.5 border rounded-lg bg-white"
                            />
                            <label className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> PDF সিলেক্ট করুন
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "pdfUrl", true)} className="hidden" />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">📝 প্রশ্নব্যাংক Text View (রঙিন টেক্সট ডিজাইনে পড়ার জন্য)</label>
                          <textarea
                            rows={6}
                            placeholder="প্রশ্নব্যাংকের টেক্সট ভার্সন এখানে পেস্ট করুন..."
                            value={qbFormData.textContent}
                            onChange={(e) => setQbFormData({ ...qbFormData, textContent: e.target.value })}
                            className="w-full p-3 border border-slate-300 rounded-xl"
                          />
                        </div>

                        <button type="submit" className="px-6 py-3.5 bg-slate-900 text-white rounded-xl font-extrabold hover:bg-black">
                          {editingQbId ? "প্রশ্নব্যাংক আপডেট করুন" : "🚀 প্রশ্নব্যাংক পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h3 className="font-extrabold text-lg">আপলোডকৃত প্রশ্নব্যাংক ({qbankDocs.length}টি)</h3>
                      {qbankDocs.map((doc) => {
                        const dId = doc._id || doc.id;
                        const subName = subjects.find((s) => s.id === doc.subjectId)?.title;
                        return (
                          <div key={dId} className="p-3.5 rounded-xl border bg-slate-50 space-y-2">
                            <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                              {subName} · {doc.bcsBatch}
                            </span>
                            <div className="font-bold text-sm">{doc.title}</div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingQbId(dId);
                                  setQbFormData({
                                    subjectId: doc.subjectId,
                                    bcsBatch: doc.bcsBatch,
                                    title: doc.title,
                                    pdfUrl: doc.pdfUrl || "",
                                    textContent: doc.textContent || "",
                                    highlightBox: doc.highlightBox || "",
                                  });
                                }}
                                className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold"
                              >
                                এডিট
                              </button>
                              <button
                                onClick={() => handleDeleteQbankDoc(dId)}
                                className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ADMIN TAB 3: CHAPTER EXAM MCQ SETTER */}
                {adminSection === "mcq" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                    <h3 className="font-extrabold text-xl">🎯 অধ্যায়ভিত্তিক অনলাইন পরীক্ষার MCQ প্রশ্ন সেট করুন</h3>
                    <form onSubmit={handleAddQuestion} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="font-extrabold block mb-1">সাবজেক্ট</label>
                        <select value={newQuestion.subjectId} onChange={(e) => setNewQuestion({ ...newQuestion, subjectId: e.target.value })} className="w-full p-3 border rounded-xl bg-slate-50 font-bold">
                          {subjects.map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">লেকচার / অধ্যায় নম্বর</label>
                        <input type="number" value={newQuestion.lectureNo} onChange={(e) => setNewQuestion({ ...newQuestion, lectureNo: e.target.value })} className="w-full p-3 border rounded-xl font-bold" />
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">বিসিএস ব্যাচ</label>
                        <input type="text" value={newQuestion.bcsBatch} onChange={(e) => setNewQuestion({ ...newQuestion, bcsBatch: e.target.value })} className="w-full p-3 border rounded-xl" />
                      </div>

                      <input type="text" placeholder="প্রশ্নটি লিখুন..." value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className="sm:col-span-3 p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন ক" value={newQuestion.opt0} onChange={(e) => setNewQuestion({ ...newQuestion, opt0: e.target.value })} className="p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন খ" value={newQuestion.opt1} onChange={(e) => setNewQuestion({ ...newQuestion, opt1: e.target.value })} className="p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন গ" value={newQuestion.opt2} onChange={(e) => setNewQuestion({ ...newQuestion, opt2: e.target.value })} className="p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন ঘ" value={newQuestion.opt3} onChange={(e) => setNewQuestion({ ...newQuestion, opt3: e.target.value })} className="p-3 border rounded-xl" />
                      <select value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} className="p-3 border rounded-xl bg-slate-50 font-extrabold">
                        <option value={0}>সঠিক উত্তর: ক</option>
                        <option value={1}>সঠিক উত্তর: খ</option>
                        <option value={2}>সঠিক উত্তর: গ</option>
                        <option value={3}>সঠিক উত্তর: ঘ</option>
                      </select>
                      <textarea rows={2} placeholder="ভুল উত্তরের জন্য বিস্তারিত ব্যাখ্যা লিখুন..." value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} className="sm:col-span-3 p-3 border rounded-xl" />
                      <button type="submit" className="sm:col-span-3 py-3.5 bg-blue-600 text-white rounded-xl font-extrabold hover:bg-blue-700">
                        + প্রশ্ন যুক্ত করুন
                      </button>
                    </form>

                    <div className="border-t pt-5">
                      <h4 className="font-extrabold text-sm mb-2">⚡ এক ক্লিকে ৫০-৫০০টি MCQ বাল্ক আপলোড (JSON Format)</h4>
                      <textarea
                        rows={3}
                        placeholder='[{"subjectId":"bangladesh","lectureNo":1,"bcsBatch":"অধ্যায় ১","question":"প্রাচীন বাংলার জনপদ কোনটি?","options":["পুণ্ড্র","মগধ","কান্যকুব্জ","মিথিলা"],"correctAnswer":0,"explanation":"পুণ্ড্র হলো প্রাচীন বাংলার সর্বপ্রাচীন জনপদ।"}]'
                        value={bulkJsonInput}
                        onChange={(e) => setBulkJsonInput(e.target.value)}
                        className="w-full p-3 border rounded-xl text-xs font-mono bg-slate-50 mb-2"
                      />
                      <button onClick={handleBulkQuestionUpload} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold">
                        সবগুলো প্রশ্ন একসাথে আপলোড করুন
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= FULLSCREEN SECURE PDF VIEWER MODAL ================= */}
      {isPdfFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="h-14 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="font-extrabold text-sm sm:text-base truncate">
              📄 {activeTab === "qbank" ? activeQbankDoc?.title : `Lecture ${activeLecture?.lectureNo}: ${activeLecture?.title}`} — ফুলস্ক্রিন রিডার মোড
            </div>
            <button
              onClick={() => setIsPdfFullscreen(false)}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 hover:bg-rose-700 cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" /> ফুলস্ক্রিন বন্ধ করুন (ESC)
            </button>
          </div>
          <div className="flex-1 relative bg-white">
            <div className="absolute top-0 right-4 w-40 h-14 z-20 bg-transparent" title="Protected Content" />
            <iframe
              src={formatSecurePdfUrl(
                activeTab === "qbank"
                  ? activeQbankDoc?.pdfUrl
                  : activePdfStep === "lecture"
                  ? activeLecture?.lecturePdfUrl
                  : activePdfStep === "mcq_pdf"
                  ? activeLecture?.mcqPdfUrl
                  : activeLecture?.writtenPdfUrl
              )}
              className="w-full h-full border-0"
              title="Fullscreen PDF Reader"
            />
          </div>
        </div>
      )}

      {/* ================= STUDENT PROFILE EDIT MODAL ================= */}
      {showProfileEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-slate-900">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold">শিক্ষার্থী প্রোফাইল ও শিক্ষাপ্রতিষ্ঠান</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-bold block mb-1">আপনার নাম</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">আপনার লক্ষ্য (Target BCS)</label>
                <input
                  type="text"
                  value={profile.targetBcs}
                  onChange={(e) => setProfile({ ...profile, targetBcs: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">শিক্ষাপ্রতিষ্ঠানের নাম</label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় / মেট্রোপলিটন ইউনিভার্সিটি"
                  value={profile.institution}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl font-semibold"
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={profile.hideProfile}
                  onChange={(e) => setProfile({ ...profile, hideProfile: e.target.checked })}
                />
                <span className="font-bold text-xs">অন্যদের কাছ থেকে আমার শিক্ষাপ্রতিষ্ঠানের তথ্য লুকিয়ে রাখুন</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowProfileEditModal(false)} className="flex-1 py-3 border rounded-xl text-sm font-bold">
                বাতিল
              </button>
              <button
                onClick={() => {
                  updateProfile(profile);
                  setShowProfileEditModal(false);
                }}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}