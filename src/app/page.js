"use client";

/**
 * ============================================================================
 * FILE: src/app/page.js
 * PROJECT: BCS Path — Multi-Track EdTech Platform (BCS + Defense & Police)
 * ARCHITECTURE OVERVIEW FOR FUTURE DEVELOPERS:
 * ----------------------------------------------------------------------------
 * 1. PORTAL GATEWAY (activePortal === "gateway"):
 *    - Displays centered 2D Executive Student Avatar (White shirt, blazer, tie, laptop).
 *    - Allows instant inline Student Name editing below the avatar.
 *    - Renders 2 Main Course Cards:
 *        a) BCS Preparation (Course 01) -> Opens BCS Dashboard
 *        b) Defense & Police Constable Job Foundation (Course 02) -> Opens Defense Dashboard
 *
 * 2. BCS PREPARATION MODULE (selectedCourse === "bcs"):
 *    - 10 PSC Subjects, Syllabus, 3-Tier Lecture Hub (Lecture PDF, MCQ PDF, Written PDF + Text View),
 *      Subject-wise Question Bank, and Random 50 MCQ Exam Engine.
 *
 * 3. DEFENSE & POLICE MODULE (selectedCourse === "defense"):
 *    - 6 Specialized Defense/Police Subjects (Math, Bangla, English, GK & Armed Forces, IQ, Physical).
 *    - Topic-wise Interactive Accordion/Cards featuring:
 *        a) YouTube Unlisted Video Lecture Player (Embeds unlisted links securely)
 *        b) Lecture Note PDF & Text View (Anti-download + Fullscreen)
 *        c) Topic Test (Timed MCQ Exam per topic)
 *
 * 4. CENTRAL ADMIN PANEL (activeTab === "admin"):
 *    - Course Management Switcher (Course 01: BCS | Course 02: Defense & Police).
 *    - Supports YouTube Unlisted URLs, PDF uploads/Google Drive links, Text Notes, and MCQs.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, CheckCircle2, Sparkles, AlertTriangle, Trash2, Clock,
  ShieldCheck, KeyRound, Camera, Building2, EyeOff, Eye, FileText,
  HelpCircle, PenTool, RotateCcw, Shuffle, Upload, ChevronRight,
  ArrowLeft, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen,
  CheckSquare, Edit3, PlayCircle, Shield, Award, Users, LayoutGrid, Check
} from "lucide-react";
import { initialSubjects } from "../data/bcsData";

/**
 * ============================================================================
 * STATIC CONFIGURATION: DEFENSE & POLICE CONSTABLE SUBJECTS & SYLLABUS
 * ============================================================================
 */
const DEFENSE_SUBJECTS = [
  {
    id: "def_math",
    title: "গণিত — বিষয়ভিত্তিক প্রস্তুতি",
    initial: "গ",
    bg: "bg-indigo-100",
    text: "text-indigo-900",
    examMarks: 30,
    writtenMarks: 40,
    syllabusBreakdown: [
      { topic: "পাটিগণিত (সংখ্যার ধারণা, লসাগু-গসাগু, শতকরা, লাভ-ক্ষতি)", marks: 15, details: "সৈনিক ও পুলিশ কনস্টেবল লিখিত ও এমসিকিউ পরীক্ষার মূল ভিত্তি।" },
      { topic: "বীজগণিত (মান নির্ণয়, উৎপাদক, সরল সমীকরণ)", marks: 10, details: "সূত্রের প্রয়োগ ও দ্রুত সমাধানের শর্টকাট ট্রিকস।" },
      { topic: "জ্যামিতি ও পরিমিতি (ত্রিভুজ, বৃত্ত, ক্ষেত্রফল)", marks: 5, details: "মৌলিক জ্যামিতিক ধারণা ও কোণের পরিমাপ।" },
    ],
  },
  {
    id: "def_bangla",
    title: "বাংলা ব্যাকরণ ও রচনা",
    initial: "বাং",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    examMarks: 25,
    writtenMarks: 30,
    syllabusBreakdown: [
      { topic: "বাংলা ব্যাকরণ (সন্ধি, সমাস, কারক, বাগধারা, এক কথায় প্রকাশ)", marks: 15, details: "প্রতিরক্ষা ও পুলিশ নিয়োগে সর্বাধিক কমন ব্যাকরণ টপিক।" },
      { topic: "অনুচ্ছেদ, দরখাস্ত ও ভাবসম্প্রসারণ (লিখিত)", marks: 15, details: "কনস্টেবল ও সৈনিক পদের লিখিত পরীক্ষার স্ট্যান্ডার্ড ফরম্যাট।" },
    ],
  },
  {
    id: "def_english",
    title: "ইংরেজি (English Foundation)",
    initial: "ইং",
    bg: "bg-blue-100",
    text: "text-blue-900",
    examMarks: 25,
    writtenMarks: 30,
    syllabusBreakdown: [
      { topic: "Grammar (Parts of Speech, Tense, Preposition, Voice)", marks: 15, details: "বেসিক গ্রামার রুলস ও শূন্যস্থান পূরণ।" },
      { topic: "Vocabulary, Translation & Paragraph Writing", marks: 15, details: "বাংলা থেকে ইংরেজি অনুবাদ ও শর্ট প্যারাগ্রাফ।" },
    ],
  },
  {
    id: "def_gk",
    title: "সাধারণ জ্ঞান ও সশস্ত্র বাহিনী",
    initial: "সা",
    bg: "bg-amber-100",
    text: "text-amber-900",
    examMarks: 20,
    writtenMarks: 20,
    syllabusBreakdown: [
      { topic: "মুক্তিযুদ্ধ, বাংলাদেশের ইতিহাস ও ভৌগোলিক পরিচিতি", marks: 10, details: "বীরশ্রেষ্ঠ, সেক্টর ও সাম্প্রতিক বাংলাদেশ।" },
      { topic: "সেনা, নৌ, বিমান বাহিনী ও বাংলাদেশ পুলিশের র‍্যাংক ও সদর দপ্তর", marks: 10, details: "ভাইভা ও লিখিত পরীক্ষার জন্য অপরিহার্য তথ্য।" },
    ],
  },
  {
    id: "def_iq",
    title: "আইকিউ ও মনস্তত্ত্ব (IQ & Viva)",
    initial: "IQ",
    bg: "bg-purple-100",
    text: "text-purple-900",
    examMarks: 20,
    writtenMarks: 0,
    syllabusBreakdown: [
      { topic: "ভার্বাল ও নন-ভার্বাল আইকিউ (সিরিজ, কোডিং, দিক নির্ণয়)", marks: 10, details: "প্রতিরক্ষা বাহিনীর প্রাথমিক নির্বাচনী পরীক্ষার স্পেশাল আইকিউ।" },
      { topic: "চূড়ান্ত ভাইভা ও মনস্তাত্ত্বিক প্রশ্নোত্তর", marks: 10, details: "বোর্ড ভাইভায় নিজেকে স্মার্টভাবে উপস্থাপনের কৌশল।" },
    ],
  },
  {
    id: "def_fitness",
    title: "শারীরিক যোগ্যতা ও মেডিকেল গাইড",
    initial: "ফি",
    bg: "bg-rose-100",
    text: "text-rose-900",
    examMarks: 20,
    writtenMarks: 0,
    syllabusBreakdown: [
      { topic: "উচ্চতা, বুকের মাপ, দৌড়, পুশ-আপ ও লং জাম্প প্রস্তুতি", marks: 10, details: "মাঠ পরীক্ষায় ১০০% উত্তীর্ণ হওয়ার প্র্যাকটিক্যাল রুটিন।" },
      { topic: "চোখের দৃষ্টি, শ্রবণশক্তি ও প্রাথমিক মেডিকেল চেকআপ", marks: 10, details: "মেডিকেল টেস্টের পূর্বপ্রস্তুতি ও সতর্কতা।" },
    ],
  },
];

/**
 * ============================================================================
 * HELPER UTILITIES (PDF SECURITY & YOUTUBE UNLISTED EMBED PARSER)
 * ============================================================================
 */

// 1. Converts standard or Base64 PDF URL into Anti-Download Embed URL
function formatSecurePdfUrl(url) {
  if (!url) return "";
  if (url.startsWith("data:application/pdf")) {
    return `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
  }
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;
}

// 2. Converts any YouTube Unlisted link (youtu.be, watch?v=, shorts, embed) into privacy-enhanced Embed URL
function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return url;
}

/**
 * ============================================================================
 * COMPONENT: 2D EXECUTIVE STUDENT AVATAR (WHITE SHIRT, BLAZER, TIE & LAPTOP)
 * Matches the user's landing page reference illustration with yellow aura
 * ============================================================================
 */
function ExecutiveStudent2DAvatar() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto select-none">
      {/* Golden Yellow Circular Backdrop Aura */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 shadow-xl" />

      {/* Wall Clock Decoration (Left) */}
      <div className="absolute top-9 left-8 w-10 h-10 rounded-full border-2 border-amber-700/40 bg-amber-100/60 flex items-center justify-center">
        <div className="w-0.5 h-3 bg-amber-800/60 origin-bottom -translate-y-1" />
        <div className="w-2.5 h-0.5 bg-amber-800/60 origin-left translate-x-1" />
      </div>

      {/* Motivational Sticky Note (Right - "Better Version of Yourself") */}
      <div className="absolute top-10 right-3 w-20 p-2 bg-yellow-200 border border-amber-500/40 shadow-sm rotate-[-8deg] rounded-xs text-[9px] font-extrabold text-slate-800 leading-tight text-center">
        Better Version of Yourself ✨
      </div>

      {/* Main 2D Vector Illustration (Student in White Shirt, Blazer, Tie Studying on Laptop) */}
      <svg viewBox="0 0 300 300" className="relative z-10 w-full h-full">
        {/* Desk Lamp (Left) */}
        <path d="M55 235 L70 150 L95 140" stroke="#312e81" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M85 130 L110 148 L90 158 Z" fill="#1e1b4b" />

        {/* Indoor Plant (Right) */}
        <ellipse cx="242" cy="185" rx="8" ry="22" fill="#16a34a" transform="rotate(-15 242 185)" />
        <ellipse cx="256" cy="190" rx="8" ry="20" fill="#15803d" transform="rotate(20 256 190)" />
        <ellipse cx="230" cy="195" rx="7" ry="16" fill="#22c55e" transform="rotate(-35 230 195)" />

        {/* Student Torso: Navy Blue Executive Blazer */}
        <path d="M88 242 C92 178, 120 165, 150 165 C180 165, 208 178, 212 242 Z" fill="#2e1065" />
        {/* Blazer Lapels */}
        <path d="M124 166 L150 218 L135 225 L112 178 Z" fill="#1e1b4b" />
        <path d="M176 166 L150 218 L165 225 L188 178 Z" fill="#1e1b4b" />

        {/* Crisp White Dress Shirt */}
        <polygon points="130,165 170,165 150,222" fill="#ffffff" />
        {/* Shirt Collar */}
        <polygon points="128,162 150,180 136,188" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <polygon points="172,162 150,180 164,188" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

        {/* Royal Executive Tie */}
        <polygon points="145,178 155,178 153,188 147,188" fill="#4c1d95" />
        <polygon points="147,188 153,188 157,218 150,225 143,218" fill="#5b21b6" />
        {/* Tie Stripes */}
        <line x1="146" y1="196" x2="154" y2="200" stroke="#fbbf24" strokeWidth="2" />
        <line x1="145" y1="206" x2="155" y2="210" stroke="#fbbf24" strokeWidth="2" />

        {/* Neck & Head */}
        <rect x="139" y="142" width="22" height="26" rx="8" fill="#fDBA74" />
        <ellipse cx="150" cy="118" rx="30" ry="34" fill="#fed7aa" />
        {/* Ears */}
        <circle cx="120" cy="120" r="6" fill="#fdba74" />
        <circle cx="180" cy="120" r="6" fill="#fdba74" />

        {/* Smart Styled Hair */}
        <path
          d="M118 112 C115 80, 145 70, 168 78 C185 82, 188 100, 181 114 C176 98, 162 94, 145 96 C130 98, 124 105, 118 112 Z"
          fill="#1e1b4b"
        />

        {/* Focused Eyes & Gentle Smile (Looking at Laptop) */}
        <ellipse cx="139" cy="120" rx="3" ry="3.5" fill="#1e293b" />
        <ellipse cx="161" cy="120" rx="3" ry="3.5" fill="#1e293b" />
        <path d="M133 112 Q139 109 145 112" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M155 112 Q161 109 167 112" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M148 123 L146 131 L151 131" stroke="#ea580c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M142 138 Q150 144 158 138" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Stack of BCS & Defense Books on Left */}
        <rect x="42" y="212" width="65" height="12" rx="3" fill="#3b0764" />
        <text x="52" y="221" fill="#fde047" fontSize="7" fontWeight="bold">BCS & DEFENSE</text>
        <rect x="38" y="224" width="72" height="12" rx="3" fill="#1d4ed8" />
        <text x="46" y="233" fill="#ffffff" fontSize="6.5" fontWeight="bold">Bangladesh Affairs</text>
        <rect x="35" y="236" width="76" height="13" rx="3" fill="#1e1b4b" />
        <text x="43" y="245" fill="#fde047" fontSize="6.5" fontWeight="bold">General Knowledge</text>

        {/* Silver Laptop in Front */}
        <rect x="135" y="190" width="90" height="58" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        {/* Apple/Emblem Glow on Laptop */}
        <circle cx="180" cy="219" r="6" fill="#ffffff" />
        <rect x="115" y="245" width="115" height="6" rx="3" fill="#cbd5e1" />

        {/* Coffee Mug ("Dream Prepare Achieve") */}
        <rect x="234" y="216" width="28" height="33" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M262 222 C270 222, 270 240, 262 240" stroke="#ffffff" strokeWidth="3" fill="none" />
        <text x="238" y="229" fill="#1e1b4b" fontSize="5.5" fontWeight="bold">Dream</text>
        <text x="237" y="236" fill="#4c1d95" fontSize="5.5" fontWeight="bold">Prepare</text>
        <text x="237" y="243" fill="#15803d" fontSize="5.5" fontWeight="bold">Achieve</text>

        {/* Desk Surface Line */}
        <rect x="20" y="249" width="260" height="6" rx="3" fill="#4c1d95" />
      </svg>
    </div>
  );
}

export default function BCSPathPlatform() {
  /**
   * ==========================================================================
   * 1. NAVIGATION & COURSE PORTAL STATE
   *    - activePortal: "gateway" (Landing Portal) | "course_app" (Inside a Course)
   *    - selectedCourse: "bcs" | "defense"
   * ==========================================================================
   */
  const [activePortal, setActivePortal] = useState("gateway");
  const [selectedCourse, setSelectedCourse] = useState("bcs");
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
    } else if (activeTab !== "dashboard") {
      setActiveTab("dashboard");
    } else {
      setActivePortal("gateway");
    }
  };

  // Switch between BCS Preparation and Defense & Police Foundation
  const enterCourseDashboard = (courseKey) => {
    setSelectedCourse(courseKey);
    setActivePortal("course_app");
    setActiveTab("dashboard");
    setNavHistory([]);
    if (courseKey === "bcs") {
      setActiveSubjectId("bangladesh");
    } else {
      setActiveSubjectId("def_math");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * ==========================================================================
   * 2. DATABASE & DYNAMIC PROGRESS STATES
   * ==========================================================================
   */
  const [bcsSubjects] = useState(initialSubjects);
  const [defenseSubjects] = useState(DEFENSE_SUBJECTS);
  const currentCourseSubjects = selectedCourse === "bcs" ? bcsSubjects : defenseSubjects;

  const [lectures, setLectures] = useState([]);
  const [qbankDocs, setQbankDocs] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [studentsCount, setStudentsCount] = useState(1);
  const [dbLoading, setDbLoading] = useState(true);

  const [progressMap, setProgressMap] = useState({});
  const [completedQuizzesCount, setCompletedQuizzesCount] = useState(0);

  /**
   * ==========================================================================
   * 3. STUDENT PROFILE & INLINE NAME SETTER STATE
   * ==========================================================================
   */
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "রাফিউল ইসলাম",
    targetBcs: "লক্ষ্য: ৪৭তম BCS ও ডিফেন্স ক্যাডার",
    institution: "",
    hideProfile: false,
    avatarUrl: "",
  });
  const [isEditingPortalName, setIsEditingPortalName] = useState(false);
  const [tempPortalName, setTempPortalName] = useState("রাফিউল ইসলাম");
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  /**
   * ==========================================================================
   * 4. LECTURE, VIDEO & WIDE PDF VIEWER STATE
   * ==========================================================================
   */
  const [activeSubjectId, setActiveSubjectId] = useState("bangladesh");
  const [activeLecture, setActiveLecture] = useState(null);
  // For BCS: 'lecture' | 'mcq_pdf' | 'written_pdf'
  // For Defense: 'video' | 'lecture_pdf'
  const [activePdfStep, setActivePdfStep] = useState("lecture");
  const [contentViewMode, setContentViewMode] = useState("pdf"); // 'pdf' | 'text'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);

  /**
   * ==========================================================================
   * 5. QUESTION BANK & EXAM ENGINE STATE
   * ==========================================================================
   */
  const [selectedQbSubject, setSelectedQbSubject] = useState("ALL");
  const [activeQbankDoc, setActiveQbankDoc] = useState(null);
  const [qbankViewMode, setQbankViewMode] = useState("pdf");
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const [examQuestions, setExamQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSourceMeta, setExamSourceMeta] = useState({ subjectId: "ALL", lectureNo: null, lectureId: null });

  /**
   * ==========================================================================
   * 6. CENTRAL ADMIN PANEL STATE (SUPPORTS BOTH COURSES)
   * ==========================================================================
   */
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminCourseTrack, setAdminCourseTrack] = useState("bcs"); // 'bcs' | 'defense'
  const [adminSection, setAdminSection] = useState("lectures"); // 'lectures' | 'qbank' | 'mcq'
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    courseType: "bcs",
    subjectId: "bangladesh",
    lectureNo: 1,
    title: "",
    videoUrl: "",
    videoDuration: "১৫ মিনিট",
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
    courseType: "bcs",
    subjectId: "bangladesh",
    bcsBatch: "১০ম - ৪৬তম বিসিএস",
    title: "",
    pdfUrl: "",
    textContent: "",
    highlightBox: "",
  });
  const [editingQbId, setEditingQbId] = useState(null);

  const [newQuestion, setNewQuestion] = useState({
    courseType: "bcs",
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

  // Sync Admin Course Switcher with default Subject IDs
  const handleAdminCourseSwitch = (track) => {
    setAdminCourseTrack(track);
    const defaultSub = track === "bcs" ? "bangladesh" : "def_math";
    setFormData((prev) => ({ ...prev, courseType: track, subjectId: defaultSub }));
    setQbFormData((prev) => ({ ...prev, courseType: track, subjectId: defaultSub }));
    setNewQuestion((prev) => ({ ...prev, courseType: track, subjectId: defaultSub }));
  };

  // Load Data from MongoDB Cloud
  const fetchCloudData = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("/api/platform");
      const data = await res.json();
      if (data.success) {
        setLectures(data.lectures || []);
        setQbankDocs(data.qbankDocs || []);
        setQuestionBank(data.questions || []);
        setStudentsCount(data.studentsCount || 1);
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
      try {
        const parsed = JSON.parse(savedProf);
        setProfile(parsed);
        setTempPortalName(parsed.name || "রাফিউল ইসলাম");
      } catch (e) {}
    }
    const savedProg = localStorage.getItem("bcs_lecture_progress_v2");
    if (savedProg) {
      try { setProgressMap(JSON.parse(savedProg)); } catch (e) {}
    }
    const savedQuizzes = localStorage.getItem("bcs_completed_quizzes_count");
    if (savedQuizzes) setCompletedQuizzesCount(Number(savedQuizzes) || 0);
  }, []);

  // Track Lecture Step Completion
  const markLectureStep = (lectureId, stepKey) => {
    if (!lectureId) return;
    setProgressMap((prev) => {
      const current = prev[lectureId] || {
        lecture: true,
        video: false,
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

  // Complete Current Lecture & Advance to Next Lecture
  const completeAndGoToNextLecture = (lec, subjectLecs) => {
    const lecId = lec._id || lec.id;
    setProgressMap((prev) => {
      const nextMap = {
        ...prev,
        [lecId]: { lecture: true, video: true, mcq: true, written: true, exam: true, completed: true },
      };
      localStorage.setItem("bcs_lecture_progress_v2", JSON.stringify(nextMap));
      return nextMap;
    });

    const currentIndex = subjectLecs.findIndex((l) => (l._id || l.id) === lecId);
    if (currentIndex !== -1 && currentIndex + 1 < subjectLecs.length) {
      const nextLec = subjectLecs[currentIndex + 1];
      setActiveLecture(nextLec);
      setActivePdfStep(selectedCourse === "defense" ? "video" : "lecture");
      window.scrollTo({ top: 0, behavior: "smooth" });
      alert(`🎉 অভিনন্দন! Topic/Lecture ${lec.lectureNo} সম্পন্ন হয়েছে। এখন পরবর্তী লেকচার শুরু হলো!`);
    } else {
      alert(`🎉 অভিনন্দন! আপনি এই অধ্যায়টি সফলভাবে সম্পন্ন করেছেন!`);
    }
  };

  // Dynamic Subject & Course Progress Calculator
  const courseFilteredLectures = lectures.filter(
    (l) => (l.courseType || "bcs") === selectedCourse
  );

  const getSubjectDynamicStats = (subId) => {
    const subLecs = courseFilteredLectures.filter((l) => l.subjectId === subId);
    const totalCount = subLecs.length;
    const completedCount = subLecs.filter((l) => progressMap[l._id || l.id]?.completed).length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { totalCount, completedCount, percent };
  };

  const totalUploadedLectures = courseFilteredLectures.length;
  const totalCompletedLectures = courseFilteredLectures.filter(
    (l) => progressMap[l._id || l.id]?.completed
  ).length;
  const overallProgressPercent =
    totalUploadedLectures > 0 ? Math.round((totalCompletedLectures / totalUploadedLectures) * 100) : 0;

  // Profile Save Handler
  const updateProfile = async (updatedFields) => {
    const newProf = { ...profile, ...updatedFields };
    setProfile(newProf);
    setTempPortalName(newProf.name);
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
      alert("⚠️ ৪.৫ মেগাবাইটের চেয়ে বড় PDF হলে Google Drive-এ আপলোড করে লিংকটি (Anyone with link) পেস্ট করুন!");
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

  /**
   * ==========================================================================
   * ONLINE EXAM & TOPIC TEST ENGINE (30 SEC PER QUESTION, RANDOM 50 SHUFFLE)
   * ==========================================================================
   */
  const startChapterExam = (subjectId = "ALL", lectureNo = null, titleText = "লাইভ মক টেস্ট", lectureId = null) => {
    const courseQuestions = questionBank.filter(
      (q) => (q.courseType || "bcs") === selectedCourse
    );
    let pool = courseQuestions.length > 0 ? courseQuestions : questionBank;

    if (subjectId !== "ALL") {
      const subMatched = pool.filter((q) => q.subjectId === subjectId);
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

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected50 = shuffled.slice(0, 50);

    if (lectureId) markLectureStep(lectureId, "exam");

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
    if (examSourceMeta.lectureId) markLectureStep(examSourceMeta.lectureId, "exam");
    const nextCount = completedQuizzesCount + 1;
    setCompletedQuizzesCount(nextCount);
    localStorage.setItem("bcs_completed_quizzes_count", String(nextCount));
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

  /**
   * ==========================================================================
   * ADMIN CMS CRUD HANDLERS
   * ==========================================================================
   */
  const handleSaveLecture = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.lectureNo) {
      alert("অনুগ্রহ করে লেকচার/টপিক নম্বর এবং শিরোনাম দিন!");
      return;
    }
    const payload = {
      ...(editingId ? { _id: editingId } : {}),
      ...formData,
      courseType: adminCourseTrack,
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
      alert(editingId ? "✅ লেকচার সফলভাবে আপডেট হয়েছে!" : "🎉 নতুন লেকচার ক্লাউডে পাবলিশ হয়েছে!");
      setEditingId(null);
      setFormData((prev) => ({
        ...prev,
        lectureNo: Number(prev.lectureNo) + 1,
        title: "",
        videoUrl: "",
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

  const handleSaveQbankDoc = async (e) => {
    e.preventDefault();
    if (!qbFormData.title) {
      alert("অনুগ্রহ করে প্রশ্নব্যাংকের শিরোনাম দিন!");
      return;
    }
    const payload = {
      ...(editingQbId ? { _id: editingQbId } : {}),
      ...qbFormData,
      courseType: adminCourseTrack,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SAVE_QBANK_DOC", adminPin: adminPinInput, payload }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ প্রশ্নব্যাংক পাবলিশ হয়েছে!");
      setEditingQbId(null);
      setQbFormData((prev) => ({ ...prev, title: "", pdfUrl: "", textContent: "", highlightBox: "" }));
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.opt0 || !newQuestion.opt1) {
      alert("প্রশ্ন এবং অপশনগুলো সঠিকভাবে পূরণ করুন!");
      return;
    }
    const payload = {
      courseType: adminCourseTrack,
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
      alert("✅ অনলাইন পরীক্ষায় নতুন MCQ প্রশ্ন যুক্ত হয়েছে!");
    }
  };

  const handleBulkQuestionUpload = async () => {
    try {
      const parsed = JSON.parse(bulkJsonInput).map((q) => ({
        ...q,
        courseType: q.courseType || adminCourseTrack,
      }));
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
    setAdminCourseTrack(lec.courseType || "bcs");
    setAdminSection("lectures");
    setFormData({
      courseType: lec.courseType || "bcs",
      subjectId: lec.subjectId,
      lectureNo: lec.lectureNo,
      title: lec.title,
      videoUrl: lec.videoUrl || "",
      videoDuration: lec.videoDuration || "১৫ মিনিট",
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

  const currentSubject =
    currentCourseSubjects.find((s) => s.id === activeSubjectId) || currentCourseSubjects[0];
  const subjectLectures = courseFilteredLectures
    .filter((l) => l.subjectId === activeSubjectId)
    .sort((a, b) => a.lectureNo - b.lectureNo);

  const handleSelectSubject = (subId) => {
    setActiveSubjectId(subId);
    const subLecs = courseFilteredLectures
      .filter((l) => l.subjectId === subId)
      .sort((a, b) => a.lectureNo - b.lectureNo);
    if (subLecs.length > 0) {
      setActiveLecture(subLecs[0]);
      markLectureStep(subLecs[0]._id || subLecs[0].id, selectedCourse === "defense" ? "video" : "lecture");
    } else {
      setActiveLecture(null);
    }
    setActivePdfStep(selectedCourse === "defense" ? "video" : "lecture");
    navigateTo("subject_lectures");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /**
   * ==========================================================================
   * VIEW 1: PORTAL GATEWAY LANDING PAGE (WHEN activePortal === "gateway")
   * Features:
   *   1. Top Center 2D Executive Avatar (White Shirt, Blazer, Tie, Studying on Laptop)
   *   2. Editable Student Name right below Avatar
   *   3. Two Royal Purple & Gold Course Selection Cards (BCS + Defense/Police)
   * ==========================================================================
   */
  if (activePortal === "gateway") {
    const bcsCount = lectures.filter((l) => (l.courseType || "bcs") === "bcs").length;
    const defCount = lectures.filter((l) => l.courseType === "defense").length;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f3ff] via-white to-[#faf5ff] text-slate-900 pb-20">
        {/* Top Portal Header */}
        <header className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between border-b border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2e1065] to-[#4c1d95] text-amber-300 flex items-center justify-center font-black text-2xl shadow-md">
              ব
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight text-[#2e1065]">BCS Path</span>
              <span className="hidden sm:inline-block ml-4 text-sm font-semibold text-slate-500 border-l pl-4 border-slate-300">
                Your Dream &nbsp;|&nbsp; Our Mission
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-sm font-extrabold text-[#3b0764]">
              Learn &nbsp;•&nbsp; Prepare &nbsp;•&nbsp; Succeed
            </span>
            <button
              onClick={() => {
                setActivePortal("course_app");
                setActiveTab("admin");
              }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-[#3b0764] hover:bg-purple-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          {/* 1. CENTERED 2D EXECUTIVE STUDENT AVATAR & EDITABLE STUDENT NAME */}
          <section className="text-center max-w-xl mx-auto mb-12">
            <ExecutiveStudent2DAvatar />

            {/* Student Name Display & Instant Inline Editor */}
            <div className="mt-4">
              {!isEditingPortalName ? (
                <div className="inline-flex items-center gap-2.5 bg-white px-6 py-2.5 rounded-full shadow-sm border border-purple-200">
                  <span className="text-xl sm:text-2xl font-black text-[#2e1065]">
                    {profile.name}
                  </span>
                  <button
                    onClick={() => {
                      setTempPortalName(profile.name);
                      setIsEditingPortalName(true);
                    }}
                    title="আপনার নাম পরিবর্তন করুন"
                    className="p-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-white p-2 rounded-2xl shadow-md border-2 border-[#4c1d95]">
                  <input
                    type="text"
                    value={tempPortalName}
                    onChange={(e) => setTempPortalName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="px-3 py-1.5 text-base font-extrabold text-slate-900 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (tempPortalName.trim()) {
                        updateProfile({ name: tempPortalName.trim() });
                      }
                      setIsEditingPortalName(false);
                    }}
                    className="px-4 py-1.5 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> সেভ করুন
                  </button>
                </div>
              )}
              <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2">
                স্বাগতম! আপনার কাঙ্ক্ষিত ক্যারিয়ার প্রস্তুতির ট্র্যাক নির্বাচন করুন
              </p>
            </div>
          </section>

          {/* 2. CHOOSE YOUR PREPARATION PATH (2 ROYAL PURPLE-GOLD COURSE CARDS) */}
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">
                Choose Your Preparation Path
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                Select your desired course and start your journey towards a better future.
              </p>
              <div className="w-16 h-1.5 bg-amber-400 rounded-full mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CARD 1: BCS PREPARATION */}
              <div
                onClick={() => enterCourseDashboard("bcs")}
                className="group relative rounded-3xl bg-gradient-to-br from-[#2e1065] via-[#3b0764] to-[#1e1b4b] text-white p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-purple-700/40"
              >
                {/* Golden Corner Wave */}
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/20 blur-xl group-hover:bg-amber-400/30 transition" />

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Course 01 · Civil Service
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">
                        BCS <span className="text-amber-400">Preparation</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-200 mt-2 leading-relaxed">
                        Comprehensive preparation for Bangladesh Civil Service (BCS). ১০টি সাবজেক্ট, রঙিন লেকচার PDF, প্রশ্নব্যাংক ও লাইভ মক টেস্ট।
                      </p>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm inline-flex items-center gap-2 shadow-lg group-hover:scale-105 transition">
                      Go to Dashboard →
                    </button>
                  </div>

                  {/* Mini Dashboard Preview Graphic */}
                  <div className="sm:col-span-5 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border-4 border-amber-400/80 transform sm:rotate-[-2deg] group-hover:rotate-0 transition">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="text-[11px] font-black text-[#2e1065]">📚 BCS Path</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        10 Subjects
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Lectures</div>
                        <div className="text-sm font-black text-[#2e1065]">{bcsCount}টি</div>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Preli+Written</div>
                        <div className="text-sm font-black text-emerald-700">১১০০ নম্বর</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border text-[11px]">
                      <div className="font-extrabold text-slate-800">বাংলাদেশ বিষয়াবলি</div>
                      <div className="text-[10px] text-slate-500">Lecture PDF · MCQ · Written</div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-[#4c1d95] h-full w-3/4 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: DEFENSE & POLICE CONSTABLE JOB FOUNDATION */}
              <div
                onClick={() => enterCourseDashboard("defense")}
                className="group relative rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#31105f] to-[#2e1065] text-white p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-purple-700/40"
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/20 blur-xl group-hover:bg-amber-400/30 transition" />

                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        Course 02 · Forces & Police
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                        Defense & Police <br />
                        <span className="text-amber-400">Constable Job Foundation</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-purple-200 mt-2 leading-relaxed">
                        Build your foundation for a secure career in Defense & Police. টপিকভিত্তিক ভিডিও লেকচার, নোট PDF ও অনুশীলন পরীক্ষা।
                      </p>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm inline-flex items-center gap-2 shadow-lg group-hover:scale-105 transition">
                      Go to Dashboard →
                    </button>
                  </div>

                  {/* Mini Defense Dashboard Preview Graphic */}
                  <div className="sm:col-span-5 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border-4 border-amber-400/80 transform sm:rotate-[2deg] group-hover:rotate-0 transition">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="text-[11px] font-black text-[#1e1b4b]">🛡️ Defense & Police</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        Video + PDF
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Subjects</div>
                        <div className="text-sm font-black text-indigo-950">6টি কোর বিষয়</div>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Topics</div>
                        <div className="text-sm font-black text-amber-900">{defCount}টি টপিক</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border text-[11px]">
                      <div className="font-extrabold text-slate-800">গণিত — সংখ্যার ধারণা</div>
                      <div className="text-[10px] text-purple-700 font-bold">▶ ভিডিও লেকচার · নোট PDF</div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full w-2/3 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  /**
   * ==========================================================================
   * VIEW 2: COURSE APPLICATION (BCS DASHBOARD OR DEFENSE & POLICE DASHBOARD)
   * ==========================================================================
   */
  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 pb-20 ${activeTab !== "admin" ? "select-none" : ""}`}>
      {/* ================= TOP NAVBAR ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActivePortal("gateway")}
              className="w-10 h-10 bg-[#2e1065] text-amber-300 rounded-xl flex items-center justify-center font-black text-xl cursor-pointer"
              title="পোর্টাল হোমে ফিরে যান"
            >
              ব
            </div>
            <div onClick={() => navigateTo("dashboard")} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  {selectedCourse === "bcs" ? "বিসিএস পাঠ (BCS)" : "Defense & Police Foundation"}
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-[#2e1065]">
                  {selectedCourse === "bcs" ? "Course 01" : "Course 02"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-bold">
                {dbLoading ? "ক্লাউড সিঙ্ক হচ্ছে..." : "● ক্লাউড ডাটাবেস সংযুক্ত"}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <button onClick={() => navigateTo("dashboard")} className={`${activeTab === "dashboard" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>ড্যাশবোর্ড</button>
            <button onClick={() => navigateTo("syllabus")} className={`${activeTab === "syllabus" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>সিলেবাস</button>
            <button onClick={() => navigateTo("subject_lectures")} className={`${activeTab === "subject_lectures" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>
              {selectedCourse === "defense" ? "ভিডিও ও লেকচার" : "লেকচার"}
            </button>
            <button onClick={() => startChapterExam("ALL", null, selectedCourse === "defense" ? "ডিফেন্স ও পুলিশ পূর্ণাঙ্গ মক টেস্ট" : "বিসিএস পূর্ণাঙ্গ লাইভ মক টেস্ট")} className={`${activeTab === "exam" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>মক টেস্ট</button>
            <button onClick={() => navigateTo("qbank")} className={`${activeTab === "qbank" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5`}>প্রশ্ন ব্যাংক</button>
            <button onClick={() => navigateTo("admin")} className={`${activeTab === "admin" ? "text-blue-600 border-b-2 border-blue-600" : "text-blue-600 hover:text-blue-800"} py-5 flex items-center gap-1`}>
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </nav>

          {/* Switch Course Portal Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePortal("gateway")}
              className="px-3.5 py-2 rounded-xl bg-[#2e1065] text-amber-300 hover:bg-[#3b0764] text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" /> কোর্স পরিবর্তন
            </button>
          </div>
        </div>

        {/* Mobile Nav Bar */}
        <div className="flex md:hidden overflow-x-auto border-t border-slate-200 bg-white px-4 py-2.5 gap-5 text-sm font-bold whitespace-nowrap text-slate-700">
          <button onClick={() => setActivePortal("gateway")} className="text-purple-700 font-extrabold">⌂ পোর্টাল</button>
          <button onClick={() => navigateTo("dashboard")} className={activeTab === "dashboard" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>ড্যাশবোর্ড</button>
          <button onClick={() => navigateTo("syllabus")} className={activeTab === "syllabus" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>সিলেবাস</button>
          <button onClick={() => navigateTo("subject_lectures")} className={activeTab === "subject_lectures" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>লেকচার</button>
          <button onClick={() => startChapterExam("ALL", null, "লাইভ মক টেস্ট")} className={activeTab === "exam" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>মক টেস্ট</button>
          <button onClick={() => navigateTo("qbank")} className={activeTab === "qbank" ? "text-slate-900 underline decoration-2" : "text-slate-600"}>প্রশ্ন ব্যাংক</button>
          <button onClick={() => navigateTo("admin")} className="text-blue-600 font-extrabold">অ্যাডমিন</button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* ================= GLOBAL BACK BUTTON BAR ================= */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold shadow-2xs hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {activeTab === "dashboard" ? "কোর্স সিলেকশন পোর্টালে ফিরে যান" : "আগের পেজে ফিরে যান"}
          </button>
          <div className="text-xs sm:text-sm font-bold text-slate-600">
            {selectedCourse === "bcs" ? "📚 BCS Preparation" : "🛡️ Defense & Police Foundation"}
          </div>
        </div>

        {/* ================= 1. COURSE DASHBOARD (BCS OR DEFENSE) ================= */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SIDEBAR: STUDENT PROFILE */}
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
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow hover:bg-black transition"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </div>

                <h3 onClick={() => setShowProfileEditModal(true)} className="font-extrabold text-lg text-slate-900 cursor-pointer hover:underline">
                  {profile.name}
                </h3>
                <p className="text-xs font-bold text-purple-700 mt-0.5">
                  {selectedCourse === "bcs" ? "বিসিএস ক্যাডার প্রত্যাশী" : "ডিফেন্স ও পুলিশ ফাউন্ডেশন"}
                </p>

                {profile.institution && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    {profile.hideProfile ? (
                      <span className="text-slate-600 italic flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> লুকানো আছে
                      </span>
                    ) : (
                      <span>{profile.institution}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic Progress */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm font-extrabold mb-2 text-slate-900">
                  <span>কোর্স অগ্রগতি</span>
                  <span className="text-blue-600">{overallProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2.5">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgressPercent}%` }} />
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {totalCompletedLectures}/{totalUploadedLectures} টি লেকচার সম্পন্ন · {completedQuizzesCount} টি পরীক্ষা সম্পন্ন
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button onClick={() => setShowProfileEditModal(true)} className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">নাম ও প্রতিষ্ঠান</div>
                      <div className="text-xs text-slate-600 truncate max-w-[140px]">
                        {profile.institution || "প্রোফাইল এডিট করুন"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </aside>

            {/* RIGHT MAIN DASHBOARD CONTENT (9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Course-Specific Hero Banner */}
              <div
                className={`p-6 sm:p-8 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  selectedCourse === "defense"
                    ? "bg-gradient-to-r from-[#1e1b4b] via-[#31105f] to-[#2e1065]"
                    : "bg-gradient-to-r from-slate-900 to-black"
                }`}
              >
                <div>
                  <span className="text-xs uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full font-extrabold">
                    {selectedCourse === "defense"
                      ? "DEFENSE & POLICE CONSTABLE JOB FOUNDATION"
                      : "৪৭তম ও ৪৮তম বিসিএস স্পেশাল"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                    {selectedCourse === "defense"
                      ? "টপিকভিত্তিক ভিডিও লেকচার, নোট PDF ও অনুশীলন পরীক্ষা"
                      : "১০টি পূর্ণাঙ্গ সাবজেক্ট · লেকচার PDF ও মক টেস্ট"}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-200 mt-1">
                    {selectedCourse === "defense"
                      ? "সেনা, নৌ, বিমান বাহিনী এবং বাংলাদেশ পুলিশ নিয়োগের শতভাগ গোছানো প্রস্তুতি।"
                      : "প্রিলিমিনারি ২০০ নম্বর এবং লিখিত ৯০০ নম্বরের সম্পূর্ণ গোছানো প্রস্তুতি এক প্ল্যাটফর্মে।"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigateTo("syllabus")} className="px-5 py-3 bg-white text-slate-900 rounded-xl text-sm font-extrabold hover:bg-slate-100">
                    সিলেবাস দেখুন
                  </button>
                  <button
                    onClick={() =>
                      startChapterExam(
                        "ALL",
                        null,
                        selectedCourse === "defense" ? "ডিফেন্স ও পুলিশ ফাউন্ডেশন মক টেস্ট" : "৪৭তম বিসিএস লাইভ মক টেস্ট"
                      )
                    }
                    className="px-5 py-3 bg-amber-400 text-slate-950 rounded-xl text-sm font-black hover:bg-amber-300"
                  >
                    মক টেস্ট দিন →
                  </button>
                </div>
              </div>

              {/* Subjects Grid */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-extrabold text-xl text-slate-900">
                    {selectedCourse === "defense"
                      ? `ডিফেন্স ও পুলিশ নিয়োগের সকল বিষয় (${currentCourseSubjects.length}টি)`
                      : `বিসিএস-এর সকল সাবজেক্ট (${currentCourseSubjects.length}টি)`}
                  </h3>
                  <span className="text-sm text-purple-700 font-extrabold">
                    বিষয়ে ক্লিক করলেই {selectedCourse === "defense" ? "ভিডিও ও PDF লেকচার" : "লেকচার পেজ"} ওপেন হবে →
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentCourseSubjects.map((sub) => {
                    const stats = getSubjectDynamicStats(sub.id);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectSubject(sub.id)}
                        className="p-5 rounded-2xl border border-slate-200 bg-white text-slate-900 cursor-pointer transition hover:shadow-md hover:border-[#2e1065] group"
                      >
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-12 h-12 rounded-xl ${sub.bg} ${sub.text} font-extrabold flex items-center justify-center text-base shrink-0`}>
                              {sub.initial}
                            </div>
                            <div>
                              <div className="font-extrabold text-base text-slate-900 group-hover:text-[#2e1065] transition">
                                {sub.title}
                              </div>
                              <div className="text-xs font-semibold text-slate-600 mt-0.5">
                                {selectedCourse === "defense" ? `টপিক: ${stats.totalCount}টি (ভিডিও + PDF)` : `লেকচার: ${stats.totalCount}টি`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                          <div className="bg-[#4c1d95] h-full rounded-full transition-all duration-500" style={{ width: `${stats.percent}%` }} />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>সম্পন্ন {stats.completedCount}/{stats.totalCount}</span>
                          <span className="text-[#4c1d95]">{stats.percent}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. LECTURE & VIDEO HUB (SUPPORTS BOTH DEFENSE & BCS FLOWS) ================= */}
        {activeTab === "subject_lectures" && (
          <div className="space-y-6">
            {/* Dark Purple Banner (Matches User's Image 2 for Defense & Police) */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#3b0764] text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  {selectedCourse === "defense" ? "DEFENSE & POLICE FOUNDATION" : "BCS PREPARATION HUB"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {currentSubject.title}
                </h2>
                <p className="text-sm text-purple-200 mt-1">
                  {selectedCourse === "defense"
                    ? "ভিডিও লেকচার (YouTube Unlisted), নোট PDF ও টপিকভিত্তিক অনুশীলন পরীক্ষা"
                    : "মূল লেকচার PDF, অধ্যায়ভিত্তিক MCQ PDF, লিখিত প্রশ্নোত্তর ও অনলাইন পরীক্ষা"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/20"
                >
                  {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                  {isSidebarCollapsed ? "টপিক তালিকা দেখান" : "তালিকা লুকিয়ে বড় ভিউ"}
                </button>
                <select
                  value={activeSubjectId}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm font-extrabold bg-white text-slate-900 border-0"
                >
                  {currentCourseSubjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT SIDEBAR: TOPIC / LECTURE LIST (Matches Image 2 Topic Structure for Defense) */}
              {!isSidebarCollapsed && (
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="font-extrabold text-base text-slate-900 border-b pb-3">
                    {selectedCourse === "defense"
                      ? `টপিক তালিকা (${subjectLectures.length}টি)`
                      : `অধ্যায় / লেকচার তালিকা (${subjectLectures.length}টি)`}
                  </div>

                  {subjectLectures.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-sm font-bold text-slate-700 mb-1">
                        এই বিষয়ে এখনো কোনো টপিক/লেকচার আপলোড করা হয়নি।
                      </p>
                      <p className="text-xs text-slate-500">
                        অ্যাডমিন প্যানেল থেকে ভিডিও ও PDF যুক্ত করলে এখানে দেখাবে।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                      {subjectLectures.map((lec) => {
                        const lecId = lec._id || lec.id;
                        const isSelected = (activeLecture?._id || activeLecture?.id) === lecId;
                        const isDone = progressMap[lecId]?.completed;
                        const topicNum = lec.lectureNo < 10 ? `0${lec.lectureNo}` : lec.lectureNo;

                        return (
                          <div
                            key={lecId}
                            className={`rounded-2xl border transition overflow-hidden ${
                              isSelected ? "border-[#2e1065] ring-2 ring-purple-200 bg-purple-50/30" : "border-slate-200 bg-white"
                            }`}
                          >
                            {/* Topic Header */}
                            <div
                              onClick={() => {
                                setActiveLecture(lec);
                                setActivePdfStep(selectedCourse === "defense" ? "video" : "lecture");
                              }}
                              className="p-4 cursor-pointer flex items-center justify-between border-b border-slate-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-purple-100 text-[#2e1065] flex items-center justify-center font-black text-xs shrink-0">
                                  {topicNum}
                                </div>
                                <div>
                                  <div className="font-extrabold text-base text-slate-900">
                                    {selectedCourse === "defense" ? `Topic ${topicNum} — ${lec.title}` : `Lecture ${topicNum}: ${lec.title}`}
                                  </div>
                                  <div className="text-xs text-slate-500 font-semibold">
                                    {selectedCourse === "defense"
                                      ? `ভিডিও লেকচার · ${lec.videoDuration || "১৫ মিনিট"}`
                                      : "রঙিন লেকচার PDF · MCQ · লিখিত"}
                                  </div>
                                </div>
                              </div>
                              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isDone ? "text-emerald-600" : "text-slate-300"}`} />
                            </div>

                            {/* Quick Sub-item Actions inside each Topic Card (Matches Image 2 Layout!) */}
                            <div className="p-3 bg-white space-y-2 text-xs font-bold">
                              {selectedCourse === "defense" && (
                                <button
                                  onClick={() => {
                                    setActiveLecture(lec);
                                    setActivePdfStep("video");
                                    markLectureStep(lecId, "video");
                                  }}
                                  className={`w-full p-2.5 rounded-xl flex items-center justify-between transition cursor-pointer ${
                                    isSelected && activePdfStep === "video"
                                      ? "bg-[#2e1065] text-white"
                                      : "hover:bg-slate-100 text-slate-800"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>ভিডিও লেকচার দেখুন ({lec.videoDuration || "১৫ মিনিট"})</span>
                                  </span>
                                  <span>▶</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActiveLecture(lec);
                                  setActivePdfStep("lecture");
                                  markLectureStep(lecId, "lecture");
                                }}
                                className={`w-full p-2.5 rounded-xl flex items-center justify-between transition cursor-pointer ${
                                  isSelected && activePdfStep === "lecture"
                                    ? "bg-[#2e1065] text-white"
                                    : "hover:bg-slate-100 text-slate-800"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                  <span>Lecture Note PDF (নোট পড়ুন)</span>
                                </span>
                                <span>📄</span>
                              </button>

                              <button
                                onClick={() =>
                                  startChapterExam(
                                    lec.subjectId,
                                    lec.lectureNo,
                                    `Topic ${topicNum}: ${lec.title} — Topic Test`,
                                    lecId
                                  )
                                }
                                className="w-full p-2.5 rounded-xl flex items-center justify-between hover:bg-emerald-50 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                              >
                                <span className="flex items-center gap-2">
                                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Topic Test (অনলাইন এমসিকিউ পরীক্ষা দিন)</span>
                                </span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* RIGHT VIEWER: YOUTUBE UNLISTED VIDEO PLAYER + WIDE PDF VIEWER + TEXT VIEW */}
              <div className={`${isSidebarCollapsed ? "lg:col-span-12" : "lg:col-span-8"} space-y-6`}>
                {!activeLecture ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center text-slate-600 text-base font-bold">
                    বাম পাশের তালিকা থেকে একটি টপিক বা লেকচার নির্বাচন করুন।
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
                    {/* Top Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-md bg-purple-100 text-[#2e1065]">
                          {currentSubject.title} · {selectedCourse === "defense" ? `Topic 0${activeLecture.lectureNo}` : `Lecture 0${activeLecture.lectureNo}`}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                          {activeLecture.title}
                        </h3>
                      </div>

                      {/* Switchers for PDF View / Text View / Fullscreen */}
                      {activePdfStep !== "video" && (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                            <button
                              onClick={() => setContentViewMode("pdf")}
                              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold ${
                                contentViewMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-700"
                              }`}
                            >
                              📄 PDF View
                            </button>
                            <button
                              onClick={() => setContentViewMode("text")}
                              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold ${
                                contentViewMode === "text" ? "bg-slate-900 text-white" : "text-slate-700"
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
                      )}
                    </div>

                    {/* Mode Tabs for Current Lecture */}
                    {selectedCourse === "defense" ? (
                      /* DEFENSE & POLICE TABS: 1. Video Lecture, 2. Lecture Note PDF, 3. Topic Test */
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <button
                          onClick={() => setActivePdfStep("video")}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "video"
                              ? "bg-[#2e1065] text-white border-[#2e1065] shadow-sm"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200"
                          }`}
                        >
                          <PlayCircle className="w-6 h-6 shrink-0 text-amber-400" />
                          <div>
                            <div className="text-sm font-extrabold">১. লেকচার ভিডিও</div>
                            <div className={`text-xs ${activePdfStep === "video" ? "text-purple-200" : "text-slate-500"}`}>
                              YouTube Unlisted ক্লাস
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActivePdfStep("lecture")}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "lecture"
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200"
                          }`}
                        >
                          <FileText className="w-6 h-6 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">২. লেকচার নোট PDF</div>
                            <div className={`text-xs ${activePdfStep === "lecture" ? "text-blue-100" : "text-slate-500"}`}>
                              PDF ও রঙিন Text নোট
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            startChapterExam(
                              activeLecture.subjectId,
                              activeLecture.lectureNo,
                              `Topic ${activeLecture.lectureNo}: ${activeLecture.title}`,
                              activeLecture._id || activeLecture.id
                            )
                          }
                          className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-left transition flex items-center gap-3 cursor-pointer"
                        >
                          <CheckSquare className="w-6 h-6 shrink-0 text-emerald-600" />
                          <div>
                            <div className="text-sm font-extrabold">৩. Topic Test দিন</div>
                            <div className="text-xs text-emerald-700">সময় নির্ধারিত MCQ পরীক্ষা</div>
                          </div>
                        </button>
                      </div>
                    ) : (
                      /* BCS TABS: 1. Lecture PDF, 2. All MCQ PDF, 3. Written Q&A PDF */
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <button
                          onClick={() => setActivePdfStep("lecture")}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                            activePdfStep === "lecture" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <FileText className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">১. মূল লেকচার নোট</div>
                            <div className="text-xs opacity-80">PDF ও Text View</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActivePdfStep("mcq_pdf")}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                            activePdfStep === "mcq_pdf" ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <HelpCircle className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">২. এই Chapter-এর সকল MCQ</div>
                            <div className="text-xs opacity-80">অধ্যায়ভিত্তিক MCQ শিট</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setActivePdfStep("written_pdf")}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
                            activePdfStep === "written_pdf" ? "bg-purple-600 text-white border-purple-600" : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <PenTool className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">৩. লিখিত প্রশ্ন ও উত্তর</div>
                            <div className="text-xs opacity-80">Written Q&A গাইডলাইন</div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* ================= CONTENT VIEWPORT ================= */}
                    {/* 1. YOUTUBE UNLISTED VIDEO PLAYER (FOR DEFENSE & POLICE) */}
                    {activePdfStep === "video" && (
                      <div className="space-y-5">
                        {activeLecture.videoUrl ? (
                          <div className="rounded-2xl overflow-hidden border-2 border-[#2e1065] bg-slate-950 shadow-xl">
                            <div className="bg-[#2e1065] text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                              <span>🎬 {activeLecture.title} — ভিডিও লেকচার ({activeLecture.videoDuration || "১৫ মিনিট"})</span>
                              <span className="text-xs bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black">
                                Unlisted HD Class
                              </span>
                            </div>
                            <div className="aspect-video w-full bg-black">
                              <iframe
                                src={getYoutubeEmbedUrl(activeLecture.videoUrl)}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Defense Unlisted Video Lecture"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-10 rounded-2xl border border-dashed border-purple-300 bg-purple-50/40 text-center space-y-2">
                            <PlayCircle className="w-12 h-12 text-[#2e1065] mx-auto" />
                            <div className="text-base font-extrabold text-slate-900">
                              এই টপিকে এখনো কোনো YouTube Unlisted ভিডিও লিংক যুক্ত করা হয়নি
                            </div>
                            <p className="text-sm text-slate-600">
                              অ্যাডমিন প্যানেল থেকে YouTube Unlisted ভিডিওর লিংক পেস্ট করলেই এখানে সরাসরি ভিডিও ক্লাসটি চালু হবে। পাশের <strong>"২. লেকচার নোট PDF"</strong> বাটনে ক্লিক করে নোটটি পড়ে নিন।
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. LECTURE NOTE PDF / TEXT VIEW */}
                    {activePdfStep === "lecture" && (
                      <div className="space-y-5">
                        {contentViewMode === "pdf" && activeLecture.lecturePdfUrl ? (
                          <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-lg">
                            <div className="bg-slate-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                              <span>📄 {activeLecture.title} — Lecture Note PDF</span>
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
                                src={formatSecurePdfUrl(activeLecture.lecturePdfUrl)}
                                className="w-full h-full border-0"
                                title="Lecture Note PDF"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {activeLecture.mainContent ? (
                              <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium">
                                {activeLecture.mainContent}
                              </div>
                            ) : (
                              <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-600 font-bold">
                                এই লেকচারে এখনো PDF বা Text নোট যুক্ত করা হয়নি। অ্যাডমিন প্যানেল থেকে আপলোড করুন।
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. CHAPTER MCQ PDF / TEXT VIEW */}
                    {activePdfStep === "mcq_pdf" && (
                      <div className="space-y-5">
                        {contentViewMode === "pdf" && activeLecture.mcqPdfUrl ? (
                          <div className="rounded-2xl overflow-hidden border-2 border-emerald-900 bg-slate-900 shadow-lg">
                            <div className="bg-emerald-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                              <span>📑 অধ্যায়ভিত্তিক সকল MCQ PDF</span>
                              <button onClick={() => setIsPdfFullscreen(true)} className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold">
                                ⛶ ফুলস্ক্রিন
                              </button>
                            </div>
                            <div className="relative w-full h-[760px] bg-white">
                              <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                              <iframe src={formatSecurePdfUrl(activeLecture.mcqPdfUrl)} className="w-full h-full border-0" title="MCQ PDF" />
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 rounded-2xl bg-slate-50 border text-center text-slate-700 font-bold">
                            {activeLecture.mcqTextContent || "এই অধ্যায়ের MCQ PDF এখনো আপলোড করা হয়নি।"}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. WRITTEN Q&A PDF / TEXT VIEW */}
                    {activePdfStep === "written_pdf" && (
                      <div className="space-y-5">
                        {contentViewMode === "pdf" && activeLecture.writtenPdfUrl ? (
                          <div className="rounded-2xl overflow-hidden border-2 border-purple-900 bg-slate-900 shadow-lg">
                            <div className="bg-purple-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                              <span>✍️ লিখিত প্রশ্ন ও উত্তর PDF</span>
                              <button onClick={() => setIsPdfFullscreen(true)} className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold">
                                ⛶ ফুলস্ক্রিন
                              </button>
                            </div>
                            <div className="relative w-full h-[760px] bg-white">
                              <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                              <iframe src={formatSecurePdfUrl(activeLecture.writtenPdfUrl)} className="w-full h-full border-0" title="Written PDF" />
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 rounded-2xl bg-slate-50 border text-center text-slate-700 font-bold">
                            {activeLecture.writtenTextContent || "এই অধ্যায়ের লিখিত প্রশ্নোত্তর PDF এখনো আপলোড করা হয়নি।"}
                          </div>
                        )}
                      </div>
                    )}

                    {/* BOTTOM COMPLETION & EXAM CTA */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1e1b4b] to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-extrabold text-lg">
                          টপিকটি পড়া শেষ হয়েছে? এখনই অনলাইন পরীক্ষা দিন!
                        </h4>
                        <p className="text-xs sm:text-sm text-purple-200">
                          পরীক্ষা দিয়ে নিজের প্রস্তুতি যাচাই করুন এবং পরবর্তী লেকচারে এগিয়ে যান।
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            startChapterExam(
                              activeLecture.subjectId,
                              activeLecture.lectureNo,
                              `${activeLecture.title} — Topic Test`,
                              activeLecture._id || activeLecture.id
                            )
                          }
                          className="px-5 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-300 cursor-pointer"
                        >
                          পরীক্ষা দিন (Topic Test) →
                        </button>
                        <button
                          onClick={() => completeAndGoToNextLecture(activeLecture, subjectLectures)}
                          className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-extrabold hover:bg-emerald-600 cursor-pointer"
                        >
                          ✓ সম্পন্ন ও পরবর্তী টপিক
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. SYLLABUS TAB (DYNAMIC FOR BCS OR DEFENSE) ================= */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  {selectedCourse === "defense"
                    ? "Defense & Police Constable Job Foundation — পূর্ণাঙ্গ সিলেবাস"
                    : "বিসিএস পূর্ণাঙ্গ সিলেবাস ও নম্বর বণ্টন (প্রিলি + রিটেন)"}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  বিষয়ভিত্তিক নম্বর বণ্টন ও গুরুত্বপূর্ণ টপিকসমূহ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {currentCourseSubjects.map((sub, idx) => (
                <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-5 bg-slate-50 border-b flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <span className={`w-10 h-10 rounded-xl ${sub.bg} ${sub.text} font-extrabold flex items-center justify-center`}>
                        {idx + 1}
                      </span>
                      <h3 className="font-extrabold text-lg text-slate-900">{sub.title}</h3>
                    </div>
                    <button
                      onClick={() => handleSelectSubject(sub.id)}
                      className="px-4 py-2 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold"
                    >
                      লেকচার দেখুন →
                    </button>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sub.syllabusBreakdown.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-extrabold text-sm text-slate-900">{item.topic}</span>
                          <span className="text-xs font-extrabold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded">
                            {item.marks} নম্বর
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700">{item.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. QUESTION BANK TAB ================= */}
        {activeTab === "qbank" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  {selectedCourse === "defense"
                    ? "ডিফেন্স ও পুলিশ বিগত সালের প্রশ্নব্যাংক (PDF ও Text View)"
                    : "বিসিএস বিষয়ভিত্তিক প্রশ্নব্যাংক (PDF ও Text View)"}
                </h2>
              </div>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border">
                <button onClick={() => setQbankViewMode("pdf")} className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold ${qbankViewMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-700"}`}>📄 PDF View</button>
                <button onClick={() => setQbankViewMode("text")} className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold ${qbankViewMode === "text" ? "bg-slate-900 text-white" : "text-slate-700"}`}>📝 Text View</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 bg-white rounded-2xl border p-4 space-y-2.5">
                <div className="font-extrabold text-base border-b pb-2">প্রশ্নব্যাংক তালিকা</div>
                {qbankDocs.filter((d) => (d.courseType || "bcs") === selectedCourse).map((doc) => (
                  <div
                    key={doc._id || doc.id}
                    onClick={() => setActiveQbankDoc(doc)}
                    className="p-3.5 rounded-xl border cursor-pointer hover:border-slate-900"
                  >
                    <div className="text-xs font-bold text-purple-700">{doc.bcsBatch}</div>
                    <div className="font-extrabold text-sm mt-1">{doc.title}</div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-9 bg-white rounded-2xl border p-6">
                {!activeQbankDoc ? (
                  <div className="p-12 text-center text-slate-500 font-bold">
                    বাম পাশ থেকে একটি প্রশ্নব্যাংক ফাইল সিলেক্ট করুন।
                  </div>
                ) : qbankViewMode === "pdf" && activeQbankDoc.pdfUrl ? (
                  <iframe src={formatSecurePdfUrl(activeQbankDoc.pdfUrl)} className="w-full h-[750px] border rounded-xl" title="QBank PDF" />
                ) : (
                  <div className="whitespace-pre-line text-base leading-relaxed">{activeQbankDoc.textContent || "টেক্সট নোট নেই।"}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. ONLINE EXAM ENGINE ================= */}
        {activeTab === "exam" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-4 sticky top-16 z-30">
              <div>
                <h2 className="text-xl font-extrabold">{examTitle}</h2>
                <p className="text-sm text-slate-600">মোট প্রশ্ন: {examQuestions.length}টি · সময়: ৩০ সেকেন্ড/প্রশ্ন</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-extrabold">
                  ⏱ সময় বাকি: {formatTime(timeLeft)}
                </div>
                {!examSubmitted && (
                  <button onClick={handleFinishExam} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold">
                    খাতা জমা দিন
                  </button>
                )}
              </div>
            </div>

            {examSubmitted && (
              <div className="bg-white border-2 border-emerald-500 p-6 rounded-2xl space-y-5">
                {(() => {
                  const res = calculateExamResult();
                  return (
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="text-xl font-black">📊 প্রাপ্ত নম্বর: {res.finalScore} / {examQuestions.length}</h3>
                        <p className="text-sm text-slate-600">সঠিক: {res.correct} · ভুল: {res.wrong} · নেগেটিভ: -{res.negativePenalty}</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setExamAnswers({});
                            setExamSubmitted(false);
                            setTimeLeft(examQuestions.length * 30);
                          }}
                          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-4 h-4" /> একই প্রশ্নসেটে আবার পরীক্ষা দিন
                        </button>
                        <button
                          onClick={() => startChapterExam(examSourceMeta.subjectId, examSourceMeta.lectureNo, examTitle, examSourceMeta.lectureId)}
                          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                        >
                          <Shuffle className="w-4 h-4" /> নতুন প্রশ্নসেটে পরীক্ষা দিন
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const qKey = q._id || q.id;
                const selectedOpt = examAnswers[qKey];
                return (
                  <div key={qKey} className="bg-white p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-extrabold text-base mb-4">{idx + 1}. {q.question}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        let style = "bg-white border-slate-300";
                        if (!examSubmitted && selectedOpt === optIdx) style = "bg-slate-900 text-white border-slate-900";
                        else if (examSubmitted) {
                          if (optIdx === q.correctAnswer) style = "bg-emerald-50 border-emerald-500 text-emerald-950 font-extrabold";
                          else if (selectedOpt === optIdx) style = "bg-rose-50 border-rose-500 text-rose-950 font-extrabold";
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={examSubmitted}
                            onClick={() => setExamAnswers({ ...examAnswers, [qKey]: optIdx })}
                            className={`p-3.5 rounded-xl border text-left text-sm font-semibold ${style}`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {examSubmitted && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border text-xs sm:text-sm">
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

        {/* ================= 6. CENTRAL ADMIN PANEL (MATCHES IMAGE 3 DESIGN) ================= */}
        {activeTab === "admin" && (
          <div>
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm text-center my-12">
                <KeyRound className="w-10 h-10 text-[#2e1065] mx-auto mb-3" />
                <h2 className="text-xl font-extrabold mb-1">BCS Path — Admin Panel</h2>
                <p className="text-sm text-slate-600 mb-5">কেন্দ্রীয় কন্ট্রোল প্যানেল আনলক করতে পিন দিন (`bcs2026`)</p>
                <input
                  type="password"
                  placeholder="অ্যাডমিন পিন লিখুন (bcs2026)"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className="w-full p-3.5 border rounded-xl text-sm mb-4 text-center"
                />
                <button
                  onClick={() => {
                    if (adminPinInput === "bcs2026") setIsAdminUnlocked(true);
                    else alert("❌ ভুল পিন! সঠিক পিন: bcs2026");
                  }}
                  className="w-full py-3.5 bg-[#1e1b4b] text-white rounded-xl text-sm font-extrabold"
                >
                  অ্যাডমিন প্যানেল আনলক করুন
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Admin Header Banner & Course Management Cards (Matches User's Image 3) */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                  <div className="bg-[#111827] text-white p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-amber-400 font-extrabold text-lg">
                        <ShieldCheck className="w-6 h-6" /> BCS Path — Admin Panel
                      </div>
                      <p className="text-sm text-slate-300 mt-0.5">একটি কেন্দ্রীয় কন্ট্রোল প্যানেল (BCS ও Defense/Police উভয় কোর্সের জন্য)</p>
                    </div>
                  </div>

                  {/* Overview & Students Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                      <LayoutGrid className="w-6 h-6 text-purple-700 mb-2" />
                      <div className="font-extrabold text-lg">Overview</div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        মোট লেকচার: {lectures.length}টি · প্রশ্নব্যাংক: {qbankDocs.length}টি · MCQ প্রশ্ন: {questionBank.length}টি
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                      <Users className="w-6 h-6 text-blue-600 mb-2" />
                      <div className="font-extrabold text-lg">Students</div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        শিক্ষার্থী ও প্রোফাইল পরিচালনা · সক্রিয় শিক্ষার্থী: {studentsCount}+
                      </p>
                    </div>
                  </div>

                  {/* Course Management Switcher (Course 01 vs Course 02) */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="font-extrabold text-base text-slate-900">
                      Course Management (যে কোর্সে লেকচার বা প্রশ্ন আপলোড করতে চান সেটি সিলেক্ট করুন):
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Course 01 Selector */}
                      <div
                        onClick={() => handleAdminCourseSwitch("bcs")}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                          adminCourseTrack === "bcs"
                            ? "bg-purple-50 border-[#4c1d95] shadow-sm"
                            : "bg-purple-50/40 border-transparent hover:border-purple-200"
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-lg text-[#2e1065] flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> BCS Preparation
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Syllabus · Subjects · Lectures · PDF Notes · Question Bank · Mock Tests
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-200 text-[#2e1065] text-xs font-extrabold">
                          Course 01
                        </span>
                      </div>

                      {/* Course 02 Selector */}
                      <div
                        onClick={() => handleAdminCourseSwitch("defense")}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                          adminCourseTrack === "defense"
                            ? "bg-amber-50 border-amber-500 shadow-sm"
                            : "bg-amber-50/40 border-transparent hover:border-amber-200"
                        }`}
                      >
                        <div>
                          <div className="font-extrabold text-lg text-amber-950 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-700" /> Defense & Police
                          </div>
                          <p className="text-xs text-amber-900/80 mt-1">
                            Syllabus · Unlisted Video Lectures · PDF Notes · Topic Tests · Mock Tests
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-extrabold">
                          Course 02
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Action Tabs */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setAdminSection("lectures")}
                      className={`px-5 py-2.5 rounded-xl text-sm font-extrabold ${
                        adminSection === "lectures" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ১. {adminCourseTrack === "defense" ? "Defense ভিডিও ও PDF লেকচার আপলোড" : "BCS লেকচার ও PDF আপলোড"}
                    </button>
                    <button
                      onClick={() => setAdminSection("mcq")}
                      className={`px-5 py-2.5 rounded-xl text-sm font-extrabold ${
                        adminSection === "mcq" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ২. অনলাইন পরীক্ষার MCQ প্রশ্ন সেটআপ
                    </button>
                    <button
                      onClick={() => setAdminSection("qbank")}
                      className={`px-5 py-2.5 rounded-xl text-sm font-extrabold ${
                        adminSection === "qbank" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ৩. প্রশ্নব্যাংক আপলোড
                    </button>
                  </div>
                </div>

                {/* ADMIN SECTION 1: LECTURE & UNLISTED VIDEO UPLOADER */}
                {adminSection === "lectures" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
                      <h3 className="text-xl font-extrabold mb-4">
                        {adminCourseTrack === "defense"
                          ? "🛡️ Defense & Police — নতুন টপিক (YouTube Unlisted ভিডিও + নোট PDF) যুক্ত করুন"
                          : "📚 BCS Preparation — নতুন লেকচার নোট (PDF + Text) যুক্ত করুন"}
                      </h3>

                      <form onSubmit={handleSaveLecture} className="space-y-4 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border">
                          <div>
                            <label className="font-extrabold block mb-1">বিষয় (Subject) নির্বাচন করুন *</label>
                            <select
                              value={formData.subjectId}
                              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                              className="w-full p-3 border rounded-xl bg-white font-bold"
                            >
                              {(adminCourseTrack === "bcs" ? bcsSubjects : defenseSubjects).map((s) => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1">টপিক / লেকচার নম্বর (যেমন: 1, 2) *</label>
                            <input
                              type="number"
                              value={formData.lectureNo}
                              onChange={(e) => setFormData({ ...formData, lectureNo: e.target.value })}
                              className="w-full p-3 border rounded-xl bg-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">টপিক বা লেকচারের শিরোনাম (Title) *</label>
                          <input
                            type="text"
                            placeholder={adminCourseTrack === "defense" ? "যেমন: সংখ্যার ধারণা" : "যেমন: প্রাচীন যুগ থেকে মুঘল আমল"}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-xl font-semibold"
                          />
                        </div>

                        {/* YOUTUBE UNLISTED VIDEO FIELD (HIGHLIGHTED FOR DEFENSE & ALSO AVAILABLE FOR BCS) */}
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                          <div className="font-extrabold text-[#2e1065] flex items-center gap-2">
                            <PlayCircle className="w-5 h-5" /> YouTube Unlisted লেকচার ভিডিও লিংক:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="https://youtu.be/xxxxxx বা Unlisted Video লিংক দিন..."
                              value={formData.videoUrl}
                              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                              className="sm:col-span-2 p-3 border rounded-xl bg-white"
                            />
                            <input
                              type="text"
                              placeholder="সময় (যেমন: ১৫ মিনিট)"
                              value={formData.videoDuration}
                              onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                              className="p-3 border rounded-xl bg-white"
                            />
                          </div>
                        </div>

                        {/* LECTURE NOTE PDF UPLOAD */}
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                          <label className="font-extrabold text-blue-950 block">📄 Lecture Note PDF (ফাইল সিলেক্ট করুন বা Google Drive লিংক দিন)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="PDF লিংক পেস্ট করুন..."
                              value={formData.lecturePdfUrl}
                              onChange={(e) => setFormData({ ...formData, lecturePdfUrl: e.target.value })}
                              className="flex-1 p-2.5 border rounded-lg bg-white"
                            />
                            <label className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> PDF সিলেক্ট করুন
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "lecturePdfUrl")} className="hidden" />
                            </label>
                          </div>
                        </div>

                        {adminCourseTrack === "bcs" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="অধ্যায়ভিত্তিক সকল MCQ PDF লিংক..."
                              value={formData.mcqPdfUrl}
                              onChange={(e) => setFormData({ ...formData, mcqPdfUrl: e.target.value })}
                              className="p-3 border rounded-xl"
                            />
                            <input
                              type="text"
                              placeholder="লিখিত প্রশ্নোত্তর (Written) PDF লিংক..."
                              value={formData.writtenPdfUrl}
                              onChange={(e) => setFormData({ ...formData, writtenPdfUrl: e.target.value })}
                              className="p-3 border rounded-xl"
                            />
                          </div>
                        )}

                        <textarea
                          rows={3}
                          placeholder="📝 Text View নোট (PDF-এর পাশাপাশি টেক্সট আকারে দেখানোর জন্য)..."
                          value={formData.mainContent}
                          onChange={(e) => setFormData({ ...formData, mainContent: e.target.value })}
                          className="w-full p-3 border rounded-xl"
                        />

                        <button type="submit" className="px-6 py-3.5 bg-[#2e1065] text-white rounded-xl font-extrabold hover:bg-black cursor-pointer">
                          {editingId ? "✓ আপডেট সেভ করুন" : "🚀 টপিক / লেকচার পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    {/* Uploaded List for Current Track */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">
                        আপলোডকৃত তালিকা ({lectures.filter((l) => (l.courseType || "bcs") === adminCourseTrack).length}টি)
                      </h4>
                      <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
                        {lectures
                          .filter((l) => (l.courseType || "bcs") === adminCourseTrack)
                          .map((lec) => {
                            const lKey = lec._id || lec.id;
                            return (
                              <div key={lKey} className="p-3.5 rounded-xl border bg-slate-50 space-y-2">
                                <div className="text-xs font-extrabold text-purple-800">
                                  Topic/Lec {lec.lectureNo} · {lec.subjectId}
                                </div>
                                <div className="font-bold text-sm">{lec.title}</div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditLectureClick(lec)} className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">
                                    এডিট
                                  </button>
                                  <button onClick={() => handleDeleteLecture(lKey)} className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg">
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

                {/* ADMIN SECTION 2: TOPIC TEST / MCQ SETTER */}
                {adminSection === "mcq" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
                    <h3 className="font-extrabold text-xl">
                      🎯 {adminCourseTrack === "defense" ? "Defense & Police Topic Test MCQ সেট করুন" : "BCS অধ্যায়ভিত্তিক MCQ সেট করুন"}
                    </h3>
                    <form onSubmit={handleAddQuestion} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <select
                        value={newQuestion.subjectId}
                        onChange={(e) => setNewQuestion({ ...newQuestion, subjectId: e.target.value })}
                        className="p-3 border rounded-xl bg-slate-50 font-bold"
                      >
                        {(adminCourseTrack === "bcs" ? bcsSubjects : defenseSubjects).map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="টপিক / লেকচার নম্বর (1, 2...)"
                        value={newQuestion.lectureNo}
                        onChange={(e) => setNewQuestion({ ...newQuestion, lectureNo: e.target.value })}
                        className="p-3 border rounded-xl font-bold"
                      />
                      <input
                        type="text"
                        placeholder="ব্যাচ / ট্যাগ"
                        value={newQuestion.bcsBatch}
                        onChange={(e) => setNewQuestion({ ...newQuestion, bcsBatch: e.target.value })}
                        className="p-3 border rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="প্রশ্নটি লিখুন..."
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        className="sm:col-span-3 p-3 border rounded-xl"
                      />
                      <input type="text" placeholder="অপশন ক" value={newQuestion.opt0} onChange={(e) => setNewQuestion({ ...newQuestion, opt0: e.target.value })} className="p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন খ" value={newQuestion.opt1} onChange={(e) => setNewQuestion({ ...newQuestion, opt1: e.target.value })} className="p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন গ" value={newQuestion.opt2} onChange={(e) => setNewQuestion({ ...newQuestion, opt2: e.target.value })} className="p-3 border rounded-xl" />
                      <input type="text" placeholder="অপশন ঘ" value={newQuestion.opt3} onChange={(e) => setNewQuestion({ ...newQuestion, opt3: e.target.value })} className="p-3 border rounded-xl" />
                      <select
                        value={newQuestion.correctAnswer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        className="p-3 border rounded-xl bg-slate-50 font-extrabold"
                      >
                        <option value={0}>সঠিক উত্তর: ক</option>
                        <option value={1}>সঠিক উত্তর: খ</option>
                        <option value={2}>সঠিক উত্তর: গ</option>
                        <option value={3}>সঠিক উত্তর: ঘ</option>
                      </select>
                      <textarea
                        rows={2}
                        placeholder="ভুল উত্তরের ব্যাখ্যা লিখুন..."
                        value={newQuestion.explanation}
                        onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                        className="sm:col-span-3 p-3 border rounded-xl"
                      />
                      <button type="submit" className="sm:col-span-3 py-3.5 bg-[#2e1065] text-white rounded-xl font-extrabold">
                        + প্রশ্ন যুক্ত করুন
                      </button>
                    </form>
                  </div>
                )}

                {/* ADMIN SECTION 3: QUESTION BANK UPLOADER */}
                {adminSection === "qbank" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-extrabold text-xl">প্রশ্নব্যাংক (PDF ও Text) আপলোড করুন</h3>
                    <form onSubmit={handleSaveQbankDoc} className="space-y-4 text-sm">
                      <input
                        type="text"
                        placeholder="প্রশ্নব্যাংকের শিরোনাম..."
                        value={qbFormData.title}
                        onChange={(e) => setQbFormData({ ...qbFormData, title: e.target.value })}
                        className="w-full p-3 border rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="PDF Google Drive লিংক..."
                        value={qbFormData.pdfUrl}
                        onChange={(e) => setQbFormData({ ...qbFormData, pdfUrl: e.target.value })}
                        className="w-full p-3 border rounded-xl"
                      />
                      <textarea
                        rows={4}
                        placeholder="Text View কন্টেন্ট..."
                        value={qbFormData.textContent}
                        onChange={(e) => setQbFormData({ ...qbFormData, textContent: e.target.value })}
                        className="w-full p-3 border rounded-xl"
                      />
                      <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-extrabold">
                        প্রশ্নব্যাংক পাবলিশ করুন
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= FULLSCREEN PDF MODAL ================= */}
      {isPdfFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="h-14 px-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="font-extrabold text-sm truncate">📄 {activeLecture?.title} — ফুলস্ক্রিন ভিউ</div>
            <button onClick={() => setIsPdfFullscreen(false)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-extrabold">
              <Minimize2 className="w-4 h-4 inline mr-1" /> বন্ধ করুন
            </button>
          </div>
          <div className="flex-1 bg-white">
            <iframe src={formatSecurePdfUrl(activeLecture?.lecturePdfUrl)} className="w-full h-full border-0" title="Fullscreen PDF" />
          </div>
        </div>
      )}

      {/* ================= STUDENT PROFILE MODAL ================= */}
      {showProfileEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-extrabold">শিক্ষার্থী প্রোফাইল আপডেট</h3>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="আপনার নাম"
              className="w-full p-3 border rounded-xl font-bold"
            />
            <input
              type="text"
              value={profile.institution}
              onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
              placeholder="শিক্ষাপ্রতিষ্ঠানের নাম"
              className="w-full p-3 border rounded-xl"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowProfileEditModal(false)} className="flex-1 py-3 border rounded-xl font-bold">বাতিল</button>
              <button
                onClick={() => {
                  updateProfile(profile);
                  setShowProfileEditModal(false);
                }}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-extrabold"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}