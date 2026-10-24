"use client";

/**
 * ============================================================================
 * FILE: src/app/page.js
 * PROJECT: BCS Path — Full-Stack Multi-Course EdTech Platform
 * NEW FEATURES ADDED IN THIS RELEASE:
 * 1. Auto-Scroll Engine: Clicking any lecture, vocabulary story, or question bank
 *    file smoothly scrolls the user directly to the Study Resource Viewer.
 * 2. Added "বাংলা ব্যাকরণ" & "English Grammar" to BCS Dashboard.
 *    Inside "English Grammar", added 4th feature tab:
 *    "গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি শিখুন" with Left Story List &
 *    Right Storybook Reader supporting 2 Visual Images + Rich Colored Text.
 * 3. 15-Day National BCS 200-MCQ Combined Live Exam & Smart Tie-Breaking Leaderboard:
 *    - Open for all students (36 sec/question, 0.50 negative, 60% pass mark, Auto-submit).
 *    - Strict Single-Attempt Policy (No Re-Exam for 15-day live contest).
 *    - Leaderboard Tie-Breaker: Total Score -> English Score -> Math Score.
 *    - Displays Student Name, Institution, Avatar (or 2D Executive Default Avatar).
 * 4. Upgraded Admin Rich Text Toolbar:
 *    - Added Font Size Increment (+) and Decrement (-) buttons.
 *    - Added Visual Image Inserter (Drag/Upload or URL) with Left, Right, Top, Bottom placement.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, CheckCircle2, Sparkles, Trash2, Clock, ShieldCheck,
  KeyRound, Camera, Building2, EyeOff, Eye, FileText, HelpCircle,
  PenTool, RotateCcw, Upload, ChevronRight, ArrowLeft, Maximize2,
  Minimize2, PanelLeftClose, PanelLeftOpen, CheckSquare, Edit3,
  PlayCircle, Shield, Award, Users, LayoutGrid, Check, Columns,
  Type, Plus, Minus, Image as ImageIcon, Trophy, Medal, Flame
} from "lucide-react";
import { initialSubjects } from "../data/bcsData";

/**
 * ============================================================================
 * EXTENDED BCS SUBJECTS (INCLUDING "বাংলা ব্যাকরণ" AND "English Grammar")
 * ============================================================================
 */
const EXTRA_GRAMMAR_SUBJECTS = [
  {
    id: "bangla_grammar",
    title: "বাংলা ব্যাকরণ",
    initial: "ব্য",
    bg: "bg-teal-100",
    text: "text-teal-900",
    preliMarks: 15,
    writtenMarks: 30,
    syllabusBreakdown: [
      { topic: "ধ্বনি, বর্ণ, সন্ধি, উপসর্গ ও প্রত্যয়", marks: 5, details: "বিসিএস প্রিলিমিনারি ও লিখিত ব্যাকরণের মূল ভিত্তি।" },
      { topic: "সমাস, কারক-বিভক্তি ও বাক্য প্রকরণ", marks: 5, details: "উদাহরণ ও শর্টকাট টেকনিকসহ বিস্তারিত আলোচনা।" },
      { topic: "বানান শুদ্ধিকরণ, প্রবাদ-প্রবচন ও পারিভাষিক শব্দ", marks: 5, details: "প্রিলিমিনারি ও লিখিত উভয় পরীক্ষার জন্য অপরিহার্য।" },
    ],
  },
  {
    id: "english_grammar",
    title: "English Grammar & Vocabulary",
    initial: "Gr",
    bg: "bg-violet-100",
    text: "text-violet-900",
    preliMarks: 20,
    writtenMarks: 100,
    syllabusBreakdown: [
      { topic: "Parts of Speech, Clauses, Phrases & Idioms", marks: 8, details: "BCS Preliminary & Written Grammar Rules." },
      { topic: "Right Form of Verbs, Prepositions & Voice/Narration", marks: 6, details: "High-yield grammar transformations and corrections." },
      { topic: "গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি (Story Vocabulary)", marks: 6, details: "চিত্র ও গল্পের মাধ্যমে সিনোনিম, অ্যান্টোনিম ও ভোকাবুলারি আয়ত্ত।" },
    ],
  },
];

// Merge existing 10 subjects with Bangla Grammar & English Grammar
const FULL_BCS_SUBJECTS = [
  ...initialSubjects.slice(0, 2),
  ...EXTRA_GRAMMAR_SUBJECTS,
  ...initialSubjects.slice(2),
];

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
      { topic: "বাংলা ব্যাকরণ (সন্ধি, সমাস, কারক, বাগধারা)", marks: 15, details: "প্রতিরক্ষা ও পুলিশ নিয়োগে সর্বাধিক কমন ব্যাকরণ টপিক।" },
      { topic: "অনুচ্ছেদ, দরখাস্ত ও ভাবসম্প্রসারণ", marks: 15, details: "কনস্টেবল ও সৈনিক পদের লিখিত পরীক্ষার ফরম্যাট।" },
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
      { topic: "সেনা, নৌ, বিমান বাহিনী ও বাংলাদেশ পুলিশের র‍্যাংক", marks: 10, details: "ভাইভা ও লিখিত পরীক্ষার জন্য অপরিহার্য তথ্য।" },
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
      { topic: "ভার্বাল ও নন-ভার্বাল আইকিউ (সিরিজ, কোডিং)", marks: 10, details: "প্রতিরক্ষা বাহিনীর প্রাথমিক নির্বাচনী পরীক্ষার আইকিউ।" },
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
 * HELPER FUNCTIONS
 * ============================================================================
 */
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

function createEmpty50QuestionsTemplate() {
  return Array.from({ length: 50 }, (_, idx) => ({
    qNo: idx + 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  }));
}

function createEmpty200QuestionsTemplate() {
  return Array.from({ length: 200 }, (_, idx) => {
    const qNo = idx + 1;
    // Automatically tag English (Q 36-70) and Math (Q 161-190) by default, editable by Admin
    let defaultCat = "general";
    if (qNo >= 36 && qNo <= 70) defaultCat = "english";
    else if (qNo >= 161 && qNo <= 190) defaultCat = "math";

    return {
      qNo,
      category: defaultCat, // "english" | "math" | "general"
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
  });
}

/**
 * ============================================================================
 * COMPONENT: UPGRADED ADMIN RICH TEXT, FONT +/- & VISUAL IMAGE EDITOR
 * Features:
 * - Font Size "+" (Increase) and "-" (Decrease) buttons with live px indicator
 * - Drag & Drop / File Upload or URL Visual Image Inserter with Placement:
 *   Left (পাশে বামে), Right (পাশে ডানে), Top (উপরে), Bottom (নিচে)
 * - Color Grading Text & Highlight Callout Boxes
 * ============================================================================
 */
function RichTextColorEditor({ label, value, onChange, placeholder, rows = 6 }) {
  const textareaRef = useRef(null);
  const imgInputRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(18);
  const [imgAlign, setImgAlign] = useState("right"); // "left" | "right" | "top" | "bottom"

  const applyFormatting = (openTag, closeTag) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end) || "এখানে লিখুন";
    const updated =
      value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end);
    onChange(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 20);
  };

  // Apply dynamic font size when clicking '+' or '-'
  const handleFontSizeStep = (delta) => {
    const nextSize = Math.min(34, Math.max(13, fontSizePx + delta));
    setFontSizePx(nextSize);
    applyFormatting(
      `<span style="font-size:${nextSize}px;line-height:1.6;font-weight:700;">`,
      `</span>`
    );
  };

  // Insert Visual Image into Note at chosen position (Left, Right, Top, Bottom)
  const insertVisualImageHtml = (imgSrc) => {
    if (!imgSrc) return;
    let styleStr =
      "max-width:260px;width:100%;border-radius:12px;border:2px solid #cbd5e1;margin:8px 0;box-shadow:0 4px 10px rgba(0,0,0,0.06);";
    if (imgAlign === "left") {
      styleStr =
        "float:left;max-width:240px;width:45%;margin:4px 16px 10px 0;border-radius:12px;border:2px solid #cbd5e1;";
    } else if (imgAlign === "right") {
      styleStr =
        "float:right;max-width:240px;width:45%;margin:4px 0 10px 16px;border-radius:12px;border:2px solid #cbd5e1;";
    } else if (imgAlign === "top" || imgAlign === "bottom") {
      styleStr =
        "display:block;max-width:420px;width:100%;margin:14px auto;border-radius:14px;border:2px solid #cbd5e1;";
    }

    const imgTag = `\n<img src="${imgSrc}" alt="Visual Note Illustration" style="${styleStr}" />\n`;

    if (imgAlign === "top") {
      onChange(imgTag + value);
    } else if (imgAlign === "bottom") {
      onChange(value + imgTag);
    } else {
      const el = textareaRef.current;
      const pos = el ? el.selectionStart : value.length;
      onChange(value.substring(0, pos) + imgTag + value.substring(pos));
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert("⚠️ ছবির সাইজ ২.৫ মেগাবাইটের কম হতে হবে!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => insertVisualImageHtml(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-200 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold text-xs sm:text-sm text-slate-900">{label}</span>

          {/* Visual Image Inserter with Position Selector (Side Left/Right, Top, Bottom) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-300">
            <ImageIcon className="w-4 h-4 text-purple-700" />
            <span className="text-[11px] font-extrabold text-slate-700">ভিজ্যুয়াল ইমেজ পজিশন:</span>
            <select
              value={imgAlign}
              onChange={(e) => setImgAlign(e.target.value)}
              className="text-xs font-extrabold text-purple-900 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 outline-none"
            >
              <option value="right">তথ্যের ডানে (Side Right)</option>
              <option value="left">তথ্যের বামে (Side Left)</option>
              <option value="top">তথ্যের উপরে (Top)</option>
              <option value="bottom">তথ্যের নিচে (Bottom)</option>
            </select>

            <label className="px-2.5 py-1 bg-purple-700 text-white rounded-lg text-xs font-extrabold cursor-pointer hover:bg-purple-800 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> ইমেজ যোগ করুন
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Rich Formatting, Font '+' / '-' & Color Grading Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyFormatting("<b>", "</b>")}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black hover:bg-slate-200 cursor-pointer"
          >
            B (বোল্ড)
          </button>

          {/* Font Size '+' and '-' Controls */}
          <div className="inline-flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => handleFontSizeStep(-2)}
              title="ফন্ট ছোট করুন (-)"
              className="px-2.5 py-1 hover:bg-slate-200 text-slate-900 font-black text-xs flex items-center gap-0.5 border-r border-slate-200 cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" /> <Minus className="w-3 h-3" />
            </button>
            <span className="px-2 text-[11px] font-extrabold text-blue-700 bg-blue-50/50">
              {fontSizePx}px
            </span>
            <button
              type="button"
              onClick={() => handleFontSizeStep(2)}
              title="ফন্ট বড় করুন (+)"
              className="px-2.5 py-1 hover:bg-slate-200 text-slate-900 font-black text-xs flex items-center gap-0.5 border-l border-slate-200 cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" /> <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Color Grading Text Buttons */}
          <button
            type="button"
            onClick={() => applyFormatting('<span style="color:#dc2626;font-weight:700;">', "</span>")}
            className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🔴 লাল টেক্সট
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('<span style="color:#2563eb;font-weight:700;">', "</span>")}
            className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🔵 নীল টেক্সট
          </button>
          <button
            type="button"
            onClick={() => applyFormatting('<span style="color:#059669;font-weight:700;">', "</span>")}
            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟢 সবুজ টেক্সট
          </button>

          {/* Highlight Boxes */}
          <button
            type="button"
            onClick={() =>
              applyFormatting(
                '<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:10px 14px;border-radius:8px;margin:8px 0;color:#78350f;font-weight:600;clear:both;">',
                "</div>"
              )
            }
            className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟨 হলুদ বক্স
          </button>
          <button
            type="button"
            onClick={() =>
              applyFormatting(
                '<div style="background:#dcfce7;border-left:4px solid #10b981;padding:10px 14px;border-radius:8px;margin:8px 0;color:#064e3b;font-weight:600;clear:both;">',
                "</div>"
              )
            }
            className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟩 সবুজ বক্স
          </button>
          <button
            type="button"
            onClick={() =>
              applyFormatting(
                '<div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:10px 14px;border-radius:8px;margin:8px 0;color:#1e3a8a;font-weight:600;clear:both;">',
                "</div>"
              )
            }
            className="px-2.5 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟦 নীল বক্স
          </button>
        </div>
      </div>

      {/* Supports Drag & Drop Image directly onto Textarea */}
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDrop={(e) => {
          const file = e.dataTransfer?.files?.[0];
          if (file && file.type.startsWith("image/")) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = () => insertVisualImageHtml(reader.result);
            reader.readAsDataURL(file);
          }
        }}
        placeholder={`${placeholder} (চাইলে এখানে সরাসরি ইমেজ Drag & Drop করতেও পারেন)`}
        className="w-full p-3.5 text-sm text-slate-900 outline-none leading-relaxed font-medium"
      />
    </div>
  );
}

/**
 * ============================================================================
 * COMPONENT: MINI 2D EXECUTIVE AVATAR (FOR LEADERBOARD DEFAULT PHOTO)
 * ============================================================================
 */
function MiniExecutive2DAvatar({ size = "w-10 h-10" }) {
  return (
    <div className={`${size} rounded-full bg-amber-300 border-2 border-white shadow-xs overflow-hidden shrink-0 flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M18 95 C20 65, 35 58, 50 58 C65 58, 80 65, 82 95 Z" fill="#2e1065" />
        <polygon points="38,58 62,58 50,86" fill="#ffffff" />
        <polygon points="47,64 53,64 55,84 50,90 45,84" fill="#5b21b6" />
        <ellipse cx="50" cy="36" rx="16" ry="18" fill="#fed7aa" />
        <path d="M33 32 C32 16, 48 12, 60 16 C68 18, 70 28, 66 34 C62 24, 52 22, 42 24 Z" fill="#1e1b4b" />
      </svg>
    </div>
  );
}

/**
 * ============================================================================
 * COMPONENT: FULL 2D EXECUTIVE STUDENT AVATAR (FOR PORTAL LANDING PAGE)
 * ============================================================================
 */
function ExecutiveStudent2DAvatar() {
  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto select-none">
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 shadow-xl" />
      <div className="absolute top-9 left-8 w-10 h-10 rounded-full border-2 border-amber-700/40 bg-amber-100/60 flex items-center justify-center">
        <div className="w-0.5 h-3 bg-amber-800/60 origin-bottom -translate-y-1" />
        <div className="w-2.5 h-0.5 bg-amber-800/60 origin-left translate-x-1" />
      </div>
      <div className="absolute top-10 right-3 w-20 p-2 bg-yellow-200 border border-amber-500/40 shadow-sm rotate-[-8deg] rounded-xs text-[9px] font-extrabold text-slate-800 leading-tight text-center">
        Better Version of Yourself ✨
      </div>
      <svg viewBox="0 0 300 300" className="relative z-10 w-full h-full">
        <path d="M55 235 L70 150 L95 140" stroke="#312e81" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M85 130 L110 148 L90 158 Z" fill="#1e1b4b" />
        <ellipse cx="242" cy="185" rx="8" ry="22" fill="#16a34a" transform="rotate(-15 242 185)" />
        <ellipse cx="256" cy="190" rx="8" ry="20" fill="#15803d" transform="rotate(20 256 190)" />
        <ellipse cx="230" cy="195" rx="7" ry="16" fill="#22c55e" transform="rotate(-35 230 195)" />
        <path d="M88 242 C92 178, 120 165, 150 165 C180 165, 208 178, 212 242 Z" fill="#2e1065" />
        <path d="M124 166 L150 218 L135 225 L112 178 Z" fill="#1e1b4b" />
        <path d="M176 166 L150 218 L165 225 L188 178 Z" fill="#1e1b4b" />
        <polygon points="130,165 170,165 150,222" fill="#ffffff" />
        <polygon points="128,162 150,180 136,188" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <polygon points="172,162 150,180 164,188" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
        <polygon points="145,178 155,178 153,188 147,188" fill="#4c1d95" />
        <polygon points="147,188 153,188 157,218 150,225 143,218" fill="#5b21b6" />
        <line x1="146" y1="196" x2="154" y2="200" stroke="#fbbf24" strokeWidth="2" />
        <line x1="145" y1="206" x2="155" y2="210" stroke="#fbbf24" strokeWidth="2" />
        <rect x="139" y="142" width="22" height="26" rx="8" fill="#fDBA74" />
        <ellipse cx="150" cy="118" rx="30" ry="34" fill="#fed7aa" />
        <circle cx="120" cy="120" r="6" fill="#fdba74" />
        <circle cx="180" cy="120" r="6" fill="#fdba74" />
        <path d="M118 112 C115 80, 145 70, 168 78 C185 82, 188 100, 181 114 C176 98, 162 94, 145 96 C130 98, 124 105, 118 112 Z" fill="#1e1b4b" />
        <ellipse cx="139" cy="120" rx="3" ry="3.5" fill="#1e293b" />
        <ellipse cx="161" cy="120" rx="3" ry="3.5" fill="#1e293b" />
        <path d="M133 112 Q139 109 145 112" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M155 112 Q161 109 167 112" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M148 123 L146 131 L151 131" stroke="#ea580c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M142 138 Q150 144 158 138" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="42" y="212" width="65" height="12" rx="3" fill="#3b0764" />
        <text x="52" y="221" fill="#fde047" fontSize="7" fontWeight="bold">BCS & DEFENSE</text>
        <rect x="38" y="224" width="72" height="12" rx="3" fill="#1d4ed8" />
        <text x="46" y="233" fill="#ffffff" fontSize="6.5" fontWeight="bold">Bangladesh Affairs</text>
        <rect x="35" y="236" width="76" height="13" rx="3" fill="#1e1b4b" />
        <text x="43" y="245" fill="#fde047" fontSize="6.5" fontWeight="bold">General Knowledge</text>
        <rect x="135" y="190" width="90" height="58" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="180" cy="219" r="6" fill="#ffffff" />
        <rect x="115" y="245" width="115" height="6" rx="3" fill="#cbd5e1" />
        <rect x="234" y="216" width="28" height="33" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M262 222 C270 222, 270 240, 262 240" stroke="#ffffff" strokeWidth="3" fill="none" />
        <text x="238" y="229" fill="#1e1b4b" fontSize="5.5" fontWeight="bold">Dream</text>
        <text x="237" y="236" fill="#4c1d95" fontSize="5.5" fontWeight="bold">Prepare</text>
        <text x="237" y="243" fill="#15803d" fontSize="5.5" fontWeight="bold">Achieve</text>
        <rect x="20" y="249" width="260" height="6" rx="3" fill="#4c1d95" />
      </svg>
    </div>
  );
}

export default function BCSPathPlatform() {
  // Auto-Scroll Target Refs for Smooth UX
  const studyResourceRef = useRef(null);
  const vocabReaderRef = useRef(null);
  const qbankReaderRef = useRef(null);

  const smoothScrollToRef = (refObj) => {
    setTimeout(() => {
      if (refObj?.current) {
        refObj.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  // Navigation & Portal State
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

  const enterCourseDashboard = (courseKey) => {
    setSelectedCourse(courseKey);
    setActivePortal("course_app");
    setActiveTab("dashboard");
    setNavHistory([]);
    const defaultSub = courseKey === "bcs" ? "bangla" : "def_math";
    setActiveSubjectId(defaultSub);
    setMockFilterSubject(defaultSub);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Core Database Collections
  const [bcsSubjects] = useState(FULL_BCS_SUBJECTS);
  const [defenseSubjects] = useState(DEFENSE_SUBJECTS);
  const currentCourseSubjects = selectedCourse === "bcs" ? bcsSubjects : defenseSubjects;

  const [lectures, setLectures] = useState([]);
  const [vocabStories, setVocabStories] = useState([]);
  const [qbankDocs, setQbankDocs] = useState([]);
  const [examSets, setExamSets] = useState([]);
  const [contests, setContests] = useState([]);
  const [studentsCount, setStudentsCount] = useState(1);
  const [dbLoading, setDbLoading] = useState(true);

  const [progressMap, setProgressMap] = useState({});
  const [completedQuizzesCount, setCompletedQuizzesCount] = useState(0);

  // Student Profile & Unique Key for Contest Leaderboard
  const fileInputRef = useRef(null);
  const [studentUniqueKey, setStudentUniqueKey] = useState("student_default");
  const [profile, setProfile] = useState({
    name: "Hamza",
    targetBcs: "লক্ষ্য: ৪৭তম BCS",
    institution: "Metropolitan University, Sylhet",
    hideProfile: false,
    avatarUrl: "",
  });
  const [isEditingPortalName, setIsEditingPortalName] = useState(false);
  const [tempPortalName, setTempPortalName] = useState("Hamza");
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Lecture & Story Vocabulary State
  const [activeSubjectId, setActiveSubjectId] = useState("bangla");
  const [activeLecture, setActiveLecture] = useState(null);
  // 'video' | 'lecture' | 'mcq_pdf' | 'written_pdf' | 'vocab_story'
  const [activePdfStep, setActivePdfStep] = useState("lecture");
  const [activeVocabStory, setActiveVocabStory] = useState(null);
  const [contentViewMode, setContentViewMode] = useState("pdf");
  const [studentTwoColumnOverride, setStudentTwoColumnOverride] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);

  // Question Bank State
  const [selectedQbSubject, setSelectedQbSubject] = useState("ALL");
  const [activeQbankDoc, setActiveQbankDoc] = useState(null);
  const [qbankViewMode, setQbankViewMode] = useState("pdf");
  const [qbankTwoCol, setQbankTwoCol] = useState(true);

  // Chapter Test 1 & Test 2 State
  const [mockFilterSubject, setMockFilterSubject] = useState("ALL");
  const [mockFilterLectureNo, setMockFilterLectureNo] = useState("ALL");
  const [activeExamSet, setActiveExamSet] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [examAnswers, setExamAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // 15-Day 200-MCQ National BCS Live Contest & Leaderboard State
  const [isContestRoomActive, setIsContestRoomActive] = useState(false);
  const [contestAnswers, setContestAnswers] = useState({});
  const [contestTimeLeft, setContestTimeLeft] = useState(0);
  const [contestSubmitting, setContestSubmitting] = useState(false);

  // Admin CMS State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminCourseTrack, setAdminCourseTrack] = useState("bcs");
  // 'lectures' | 'vocab_stories' | 'exam_builder' | 'biweekly_200' | 'qbank'
  const [adminSection, setAdminSection] = useState("lectures");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    courseType: "bcs",
    subjectId: "bangla",
    lectureNo: 1,
    chapterName: "",
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
    mcqTwoColumn: true,
    lectureTwoColumn: false,
    writtenTwoColumn: false,
  });

  // Admin Form: Vocabulary Story ("গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি")
  const [vocabFormData, setVocabFormData] = useState({
    storyNo: 1,
    title: "",
    subtitle: "",
    storyContent: "",
    image1Url: "",
    image1Position: "right",
    image2Url: "",
    image2Position: "left",
    wordMeaningBox: "",
  });
  const [editingVocabId, setEditingVocabId] = useState(null);

  // Admin Form: Question Bank
  const [qbFormData, setQbFormData] = useState({
    courseType: "bcs",
    subjectId: "bangla",
    bcsBatch: "১০ম - ৪৬তম বিসিএস",
    title: "",
    pdfUrl: "",
    textContent: "",
    highlightBox: "",
    twoColumn: true,
  });
  const [editingQbId, setEditingQbId] = useState(null);

  // Admin Form: 50-Question Chapter Test 1 & Test 2
  const [examBuilderMeta, setExamBuilderMeta] = useState({
    courseType: "bcs",
    subjectId: "bangla",
    lectureNo: 1,
    chapterName: "Lecture 01",
    testNumber: 1,
  });
  const [template50Questions, setTemplate50Questions] = useState(() =>
    createEmpty50QuestionsTemplate()
  );
  const [activeSlotRange, setActiveSlotRange] = useState("1-10");

  // Admin Form: 15-Day 200-MCQ National Contest Builder
  const [contestBuilderMeta, setContestBuilderMeta] = useState({
    contestId: "bcs-biweekly-main",
    title: "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
    examWindowText: "প্রতি ১৫ দিনে ১টি জাতীয় মেধা যাচাই পরীক্ষা · পাস মার্ক ৬০%",
    resetSubmissions: false,
  });
  const [template200Questions, setTemplate200Questions] = useState(() =>
    createEmpty200QuestionsTemplate()
  );
  const [active200Range, setActive200Range] = useState("1-25");

  // Fetch Cloud Data
  const fetchCloudData = async () => {
    setDbLoading(true);
    try {
      const res = await fetch("/api/platform");
      const data = await res.json();
      if (data.success) {
        setLectures(data.lectures || []);
        setVocabStories(data.vocabStories || []);
        if (data.vocabStories?.length > 0 && !activeVocabStory) {
          setActiveVocabStory(data.vocabStories[0]);
        }
        setQbankDocs(data.qbankDocs || []);
        setExamSets(data.examSets || []);
        setContests(data.contests || []);
        setStudentsCount(data.studentsCount || 1);

        // Populate 200-Question Admin Template if contest already exists
        if (data.contests?.length > 0) {
          const activeC = data.contests[0];
          setContestBuilderMeta((prev) => ({
            ...prev,
            contestId: activeC.contestId,
            title: activeC.title,
            examWindowText: activeC.examWindowText,
          }));
          const merged200 = createEmpty200QuestionsTemplate().map((slot) => {
            const found = activeC.questions?.find((q) => Number(q.qNo) === slot.qNo);
            return found
              ? {
                  qNo: slot.qNo,
                  category: found.category || slot.category,
                  question: found.question || "",
                  options: found.options?.length === 4 ? [...found.options] : ["", "", "", ""],
                  correctAnswer: Number(found.correctAnswer || 0),
                  explanation: found.explanation || "",
                }
              : slot;
          });
          setTemplate200Questions(merged200);
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
    // Initialize unique student key for leaderboard & single-attempt verification
    let uKey = localStorage.getItem("bcs_student_unique_key");
    if (!uKey) {
      uKey = "stu_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now();
      localStorage.setItem("bcs_student_unique_key", uKey);
    }
    setStudentUniqueKey(uKey);

    const savedProf = localStorage.getItem("bcs_student_profile");
    if (savedProf) {
      try {
        const parsed = JSON.parse(savedProf);
        setProfile(parsed);
        setTempPortalName(parsed.name || "Hamza");
      } catch (e) {}
    }
    const savedProg = localStorage.getItem("bcs_lecture_progress_v2");
    if (savedProg) {
      try { setProgressMap(JSON.parse(savedProg)); } catch (e) {}
    }
    const savedQuizzes = localStorage.getItem("bcs_completed_quizzes_count");
    if (savedQuizzes) setCompletedQuizzesCount(Number(savedQuizzes) || 0);
  }, []);

  // Auto-select Question Bank Doc
  const courseFilteredQbankDocs = qbankDocs.filter(
    (d) =>
      (d.courseType || "bcs") === selectedCourse &&
      (selectedQbSubject === "ALL" || d.subjectId === selectedQbSubject)
  );

  useEffect(() => {
    if (courseFilteredQbankDocs.length > 0) {
      const exists = courseFilteredQbankDocs.some(
        (d) => (d._id || d.id) === (activeQbankDoc?._id || activeQbankDoc?.id)
      );
      if (!exists) setActiveQbankDoc(courseFilteredQbankDocs[0]);
    } else {
      setActiveQbankDoc(null);
    }
  }, [qbankDocs, selectedCourse, selectedQbSubject]);

  // Sync 50-Question Template in Admin
  useEffect(() => {
    const existingSet = examSets.find(
      (s) =>
        (s.courseType || "bcs") === examBuilderMeta.courseType &&
        s.subjectId === examBuilderMeta.subjectId &&
        Number(s.lectureNo) === Number(examBuilderMeta.lectureNo) &&
        Number(s.testNumber) === Number(examBuilderMeta.testNumber)
    );

    if (existingSet) {
      const merged50 = createEmpty50QuestionsTemplate().map((emptySlot) => {
        const found = existingSet.questions?.find((q) => Number(q.qNo) === emptySlot.qNo);
        return found
          ? {
              qNo: emptySlot.qNo,
              question: found.question || "",
              options: found.options?.length === 4 ? [...found.options] : ["", "", "", ""],
              correctAnswer: Number(found.correctAnswer || 0),
              explanation: found.explanation || "",
            }
          : emptySlot;
      });
      setTemplate50Questions(merged50);
      setExamBuilderMeta((prev) => ({
        ...prev,
        chapterName: existingSet.chapterName || prev.chapterName,
      }));
    } else {
      const matchedLec = lectures.find(
        (l) =>
          (l.courseType || "bcs") === examBuilderMeta.courseType &&
          l.subjectId === examBuilderMeta.subjectId &&
          Number(l.lectureNo) === Number(examBuilderMeta.lectureNo)
      );
      setTemplate50Questions(createEmpty50QuestionsTemplate());
      if (matchedLec) {
        setExamBuilderMeta((prev) => ({ ...prev, chapterName: matchedLec.title }));
      }
    }
  }, [
    examBuilderMeta.courseType,
    examBuilderMeta.subjectId,
    examBuilderMeta.lectureNo,
    examBuilderMeta.testNumber,
    examSets,
  ]);

  const handleAdminCourseSwitch = (track) => {
    setAdminCourseTrack(track);
    const defaultSub = track === "bcs" ? "bangla" : "def_math";
    setFormData((prev) => ({ ...prev, courseType: track, subjectId: defaultSub }));
    setQbFormData((prev) => ({ ...prev, courseType: track, subjectId: defaultSub }));
    setExamBuilderMeta((prev) => ({
      ...prev,
      courseType: track,
      subjectId: defaultSub,
      lectureNo: 1,
      chapterName: "Lecture 01",
    }));
  };

  // Complete Lecture & Smooth Scroll to Top of Next Lecture Resource
  const completeAndGoToNextLecture = (lec, subjectLecs) => {
    const lecId = lec._id || lec.id;
    setProgressMap((prev) => {
      const nextMap = {
        ...prev,
        [lecId]: { ...(prev[lecId] || {}), completed: true },
      };
      localStorage.setItem("bcs_lecture_progress_v2", JSON.stringify(nextMap));
      return nextMap;
    });

    const currentIndex = subjectLecs.findIndex((l) => (l._id || l.id) === lecId);
    if (currentIndex !== -1 && currentIndex + 1 < subjectLecs.length) {
      const nextLec = subjectLecs[currentIndex + 1];
      setActiveLecture(nextLec);
      setActivePdfStep(selectedCourse === "defense" ? "video" : "lecture");
      smoothScrollToRef(studyResourceRef);
    } else {
      alert(`🎉 অভিনন্দন! আপনি এই বিষয়ের লেকচার ${lec.lectureNo} সম্পন্ন করেছেন!`);
    }
  };

  // Dynamic Course Progress
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

  // Profile Save
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
          payload: { ...newProf, phone: studentUniqueKey },
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
      alert("⚠️ ৪.৫ মেগাবাইটের চেয়ে বড় PDF হলে Google Drive-এ আপলোড করে লিংকটি পেস্ট করুন!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (isQbank) setQbFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      else setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Upload Story Image 1 or Image 2 for Vocabulary Story
  const handleVocabStoryImageUpload = (e, imgField) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert("⚠️ স্টোরি ইমেজের সাইজ সর্বোচ্চ ২.৫ মেগাবাইট হতে পারবে!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setVocabFormData((prev) => ({ ...prev, [imgField]: reader.result }));
    reader.readAsDataURL(file);
  };

  /**
   * ==========================================================================
   * CHAPTER TEST 1 & TEST 2 ENGINE (50 Questions, 36s/Q, 60% Pass)
   * ==========================================================================
   */
  const launchSpecificExamSet = (examSetDoc) => {
    if (!examSetDoc || !examSetDoc.questions || examSetDoc.questions.length === 0) {
      alert("⚠️ এই টেস্টে এখনো কোনো প্রশ্ন সেট করা হয়নি!");
      return;
    }
    setActiveExamSet(examSetDoc);
    setExamQuestions(examSetDoc.questions);
    setExamTitle(
      `${examSetDoc.chapterName} — Test ${examSetDoc.testNumber} (${examSetDoc.questions.length}টি প্রশ্ন)`
    );
    setExamAnswers({});
    setExamSubmitted(false);
    setTimeLeft(examSetDoc.questions.length * 36);
    navigateTo("active_exam_room");
  };

  const handleFinishExam = () => {
    setExamSubmitted(true);
    const nextCount = completedQuizzesCount + 1;
    setCompletedQuizzesCount(nextCount);
    localStorage.setItem("bcs_completed_quizzes_count", String(nextCount));
  };

  useEffect(() => {
    if (activeTab !== "active_exam_room" || examSubmitted) return;
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
    const totalQ = examQuestions.length;

    examQuestions.forEach((q, idx) => {
      const qKey = q._id || q.qNo || idx;
      if (examAnswers[qKey] === undefined) unanswered += 1;
      else if (Number(examAnswers[qKey]) === Number(q.correctAnswer)) correct += 1;
      else wrong += 1;
    });

    const negativePenalty = wrong * 0.5;
    const finalScore = Math.max(0, correct - negativePenalty);
    const passMarkRequired = +(totalQ * 0.6).toFixed(2);
    const scorePercentage = totalQ > 0 ? Math.round((finalScore / totalQ) * 100) : 0;
    const isPassed = finalScore >= passMarkRequired;

    return {
      totalQ,
      correct,
      wrong,
      unanswered,
      negativePenalty,
      finalScore,
      passMarkRequired,
      scorePercentage,
      isPassed,
    };
  };

  /**
   * ==========================================================================
   * 15-DAY NATIONAL 200-MCQ COMBINED BCS EXAM & TIE-BREAKING LEADERBOARD
   * Rules:
   * - 200 MCQs (or whatever Admin has set in the contest)
   * - 36 Seconds per question
   * - 0.50 Negative Marking per wrong answer
   * - 60% Pass Mark
   * - Auto-Submit when timer hits 0
   * - NO RE-EXAM ALLOWED (One submission per student per 15-day contest)
   * - Tie-Breaker:
   *     1. Higher Total Score
   *     2. Higher English Score
   *     3. Higher Math Score
   * ==========================================================================
   */
  const currentActiveContest = contests[0] || null;
  const myContestSubmission = currentActiveContest?.submissions?.find(
    (sub) => sub.studentKey === studentUniqueKey || sub.name.toLowerCase() === profile.name.toLowerCase()
  );

  // Sort Leaderboard with Smart Tie-Breaking (Total Score -> English Score -> Math Score)
  const sortedLeaderboard = currentActiveContest?.submissions
    ? [...currentActiveContest.submissions].sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if ((b.englishScore || 0) !== (a.englishScore || 0))
          return (b.englishScore || 0) - (a.englishScore || 0);
        if ((b.mathScore || 0) !== (a.mathScore || 0))
          return (b.mathScore || 0) - (a.mathScore || 0);
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      })
    : [];

  const myLeaderboardRank = myContestSubmission
    ? sortedLeaderboard.findIndex((s) => s.studentKey === myContestSubmission.studentKey) + 1
    : null;

  const startBiWeekly200Contest = () => {
    if (!currentActiveContest || !currentActiveContest.questions?.length) {
      alert("⚠️ অ্যাডমিন প্যানেল থেকে এখনো ১৫ দিনের জাতীয় বিসিএস পরীক্ষাটির প্রশ্ন প্রকাশ করা হয়নি!");
      return;
    }
    if (myContestSubmission) {
      alert("ℹ️ আপনি ইতিমধ্যে এই ১৫ দিনের জাতীয় পরীক্ষায় অংশ নিয়েছেন! নিচে আপনার মেধা স্থান (Position) ও ভুল উত্তরের ব্যাখ্যা দেখুন।");
      return;
    }
    setContestAnswers({});
    setContestTimeLeft(currentActiveContest.questions.length * 36); // 36 sec per question
    setIsContestRoomActive(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitBiWeeklyContestExam = async () => {
    if (!currentActiveContest || contestSubmitting) return;
    setContestSubmitting(true);

    let correct = 0;
    let wrong = 0;
    let engScore = 0;
    let mathScore = 0;

    currentActiveContest.questions.forEach((q, idx) => {
      const qKey = q.qNo || idx + 1;
      const ans = contestAnswers[qKey];
      if (ans !== undefined) {
        if (Number(ans) === Number(q.correctAnswer)) {
          correct += 1;
          if (q.category === "english") engScore += 1;
          if (q.category === "math") mathScore += 1;
        } else {
          wrong += 1;
          if (q.category === "english") engScore -= 0.5;
          if (q.category === "math") mathScore -= 0.5;
        }
      }
    });

    const negativePenalty = wrong * 0.5;
    const totalScore = Math.max(0, +(correct - negativePenalty).toFixed(2));

    const submissionPayload = {
      studentKey: studentUniqueKey,
      name: profile.name || "বিসিএস পরীক্ষার্থী",
      institution: profile.hideProfile ? "" : profile.institution || "স্বতন্ত্র পরীক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      totalScore,
      englishScore: +engScore.toFixed(2),
      mathScore: +mathScore.toFixed(2),
      correctCount: correct,
      wrongCount: wrong,
      negativePenalty,
      answersMap: contestAnswers,
    };

    try {
      const res = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_CONTEST_EXAM",
          payload: {
            contestId: currentActiveContest.contestId,
            submission: submissionPayload,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsContestRoomActive(false);
        await fetchCloudData();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(data.error);
        setIsContestRoomActive(false);
      }
    } catch (e) {
      alert("সাবমিট করতে সমস্যা হয়েছে!");
    } finally {
      setContestSubmitting(false);
    }
  };

  // Auto-Submit Timer for 15-Day 200-MCQ Live Exam
  useEffect(() => {
    if (!isContestRoomActive) return;
    const timer = setInterval(() => {
      setContestTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitBiWeeklyContestExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isContestRoomActive, contestAnswers]);

  /**
   * ==========================================================================
   * ADMIN CRUD HANDLERS
   * ==========================================================================
   */
  const handleSaveLecture = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.lectureNo) {
      alert("অনুগ্রহ করে লেকচার নম্বর এবং শিরোনাম দিন!");
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
      alert(editingId ? "✅ লেকচার সফলভাবে আপডেট হয়েছে!" : "🎉 নতুন লেকচার পাবলিশ হয়েছে!");
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

  // Save Vocabulary Story ("গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি")
  const handleSaveVocabStory = async (e) => {
    e.preventDefault();
    if (!vocabFormData.title || !vocabFormData.storyContent) {
      alert("অনুগ্রহ করে স্টোরির শিরোনাম এবং গল্পের টেক্সট লিখুন!");
      return;
    }
    const payload = {
      ...(editingVocabId ? { _id: editingVocabId } : {}),
      ...vocabFormData,
      storyNo: Number(vocabFormData.storyNo || 1),
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SAVE_VOCAB_STORY", adminPin: adminPinInput, payload }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        editingVocabId
          ? "✅ ভোকাবুলারি স্টোরি আপডেট হয়েছে!"
          : "🎉 নতুন ভোকাবুলারি স্টোরি (ইমেজসহ) পাবলিশ হয়েছে!"
      );
      setEditingVocabId(null);
      setVocabFormData((prev) => ({
        storyNo: Number(prev.storyNo) + 1,
        title: "",
        subtitle: "",
        storyContent: "",
        image1Url: "",
        image1Position: "right",
        image2Url: "",
        image2Position: "left",
        wordMeaningBox: "",
      }));
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteVocabStory = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ভোকাবুলারি স্টোরিটি ডিলিট করতে চান?")) return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE_VOCAB_STORY", adminPin: adminPinInput, payload: { id } }),
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

  const updateTemplateSlot = (slotNumber, field, value, optIdx = null) => {
    setTemplate50Questions((prev) =>
      prev.map((item) => {
        if (item.qNo !== slotNumber) return item;
        if (optIdx !== null) {
          const updatedOpts = [...item.options];
          updatedOpts[optIdx] = value;
          return { ...item, options: updatedOpts };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const handlePublishExamSet = async (e) => {
    e.preventDefault();
    const filledCount = template50Questions.filter((q) => q.question.trim() !== "").length;
    if (filledCount === 0) {
      alert("⚠️ কমপক্ষে ১টি প্রশ্নের ঘর পূরণ করুন!");
      return;
    }
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_EXAM_SET",
        adminPin: adminPinInput,
        payload: {
          ...examBuilderMeta,
          courseType: adminCourseTrack,
          questions: template50Questions,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`🎉 Test ${examBuilderMeta.testNumber} (${filledCount}টি প্রশ্নসহ) প্রকাশিত হয়েছে!`);
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  // Update 200-Question National Contest Slot
  const update200TemplateSlot = (slotNumber, field, value, optIdx = null) => {
    setTemplate200Questions((prev) =>
      prev.map((item) => {
        if (item.qNo !== slotNumber) return item;
        if (optIdx !== null) {
          const updatedOpts = [...item.options];
          updatedOpts[optIdx] = value;
          return { ...item, options: updatedOpts };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const handlePublish200Contest = async (e) => {
    e.preventDefault();
    const filledCount = template200Questions.filter((q) => q.question.trim() !== "").length;
    if (filledCount === 0) {
      alert("⚠️ কমপক্ষে ১টি প্রশ্ন পূরণ করে Publish করুন!");
      return;
    }
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_BIWEEKLY_CONTEST",
        adminPin: adminPinInput,
        payload: {
          ...contestBuilderMeta,
          questions: template200Questions,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`🎉 ১৫ দিনের জাতীয় বিসিএস পরীক্ষা (${filledCount}টি প্রশ্নসহ) সফলভাবে প্রকাশিত হয়েছে!`);
      setContestBuilderMeta((prev) => ({ ...prev, resetSubmissions: false }));
      fetchCloudData();
    } else {
      alert(data.error);
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
      chapterName: lec.chapterName || "",
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
      mcqTwoColumn: lec.mcqTwoColumn !== undefined ? lec.mcqTwoColumn : true,
      lectureTwoColumn: lec.lectureTwoColumn || false,
      writtenTwoColumn: lec.writtenTwoColumn || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSubject =
    currentCourseSubjects.find((s) => s.id === activeSubjectId) || currentCourseSubjects[0];
  const subjectLectures = courseFilteredLectures
    .filter((l) => l.subjectId === activeSubjectId)
    .sort((a, b) => a.lectureNo - b.lectureNo);

  const currentLectureExamSets = activeLecture
    ? examSets.filter(
        (s) =>
          (s.courseType || "bcs") === selectedCourse &&
          s.subjectId === activeLecture.subjectId &&
          Number(s.lectureNo) === Number(activeLecture.lectureNo)
      )
    : [];
  const test1Set = currentLectureExamSets.find((s) => Number(s.testNumber) === 1);
  const test2Set = currentLectureExamSets.find((s) => Number(s.testNumber) === 2);

  const handleSelectSubject = (subId) => {
    setActiveSubjectId(subId);
    const subLecs = courseFilteredLectures
      .filter((l) => l.subjectId === subId)
      .sort((a, b) => a.lectureNo - b.lectureNo);
    if (subLecs.length > 0) {
      setActiveLecture(subLecs[0]);
      if (!subLecs[0].lecturePdfUrl && subLecs[0].mainContent) setContentViewMode("text");
      else setContentViewMode("pdf");
    } else {
      setActiveLecture(null);
    }
    setActivePdfStep(selectedCourse === "defense" ? "video" : "lecture");
    setStudentTwoColumnOverride(null);
    navigateTo("subject_lectures");
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isCurrentTextTwoColumn = () => {
    if (studentTwoColumnOverride !== null) return studentTwoColumnOverride;
    if (!activeLecture) return false;
    if (activePdfStep === "mcq_pdf") return activeLecture.mcqTwoColumn !== false;
    if (activePdfStep === "written_pdf") return !!activeLecture.writtenTwoColumn;
    return !!activeLecture.lectureTwoColumn;
  };

  /**
   * ==========================================================================
   * VIEW 1: PORTAL GATEWAY LANDING PAGE
   * ==========================================================================
   */
  if (activePortal === "gateway") {
    const bcsCount = lectures.filter((l) => (l.courseType || "bcs") === "bcs").length;
    const defCount = lectures.filter((l) => l.courseType === "defense").length;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f5f3ff] via-white to-[#faf5ff] text-slate-900 pb-20">
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
            <button
              onClick={() => {
                setSelectedCourse("bcs");
                setActivePortal("course_app");
                setActiveTab("biweekly_contest");
              }}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs sm:text-sm font-black items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Trophy className="w-4 h-4" /> ২০০ নম্বরের জাতীয় বিসিএস পরীক্ষা ও লিডারবোর্ড
            </button>
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
          <section className="text-center max-w-xl mx-auto mb-12">
            <ExecutiveStudent2DAvatar />
            <div className="mt-4">
              {!isEditingPortalName ? (
                <div className="inline-flex items-center gap-2.5 bg-white px-6 py-2.5 rounded-full shadow-sm border border-purple-200">
                  <span className="text-xl sm:text-2xl font-black text-[#2e1065]">{profile.name}</span>
                  <button
                    onClick={() => {
                      setTempPortalName(profile.name);
                      setIsEditingPortalName(true);
                    }}
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
                    className="px-3 py-1.5 text-base font-extrabold text-slate-900 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (tempPortalName.trim()) updateProfile({ name: tempPortalName.trim() });
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

          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1e1b4b]">Choose Your Preparation Path</h2>
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
                        ১২টি সাবজেক্ট (বাংলা ব্যাকরণ ও English Grammar সহ), গল্পে গল্পে ভোকাবুলারি এবং ২০০ নম্বরের জাতীয় লাইভ পরীক্ষা।
                      </p>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm inline-flex items-center gap-2 shadow-lg">
                      Go to Dashboard →
                    </button>
                  </div>

                  <div className="sm:col-span-5 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border-4 border-amber-400/80">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="text-[11px] font-black text-[#2e1065]">📚 BCS Path</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">12 Subjects</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Lectures</div>
                        <div className="text-sm font-black text-[#2e1065]">{bcsCount}টি</div>
                      </div>
                      <div className="bg-emerald-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">National Exam</div>
                        <div className="text-sm font-black text-emerald-700">২০০ MCQ</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border text-[11px]">
                      <div className="font-extrabold text-slate-800">English Grammar & Vocab</div>
                      <div className="text-[10px] text-purple-700 font-bold">📖 গল্পে গল্পে ভোকাবুলারি</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: DEFENSE & POLICE CONSTABLE FOUNDATION */}
              <div
                onClick={() => enterCourseDashboard("defense")}
                className="group relative rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#31105f] to-[#2e1065] text-white p-7 sm:p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-purple-700/40"
              >
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
                        টপিকভিত্তিক YouTube Unlisted ভিডিও লেকচার, নোট PDF, রঙিন Text View এবং ৫০ প্রশ্নের মক টেস্ট।
                      </p>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm inline-flex items-center gap-2 shadow-lg">
                      Go to Dashboard →
                    </button>
                  </div>

                  <div className="sm:col-span-5 bg-white text-slate-900 rounded-2xl p-4 shadow-2xl border-4 border-amber-400/80">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <span className="text-[11px] font-black text-[#1e1b4b]">🛡️ Defense & Police</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">Video + PDF</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Subjects</div>
                        <div className="text-sm font-black text-indigo-950">6টি বিষয়</div>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg">
                        <div className="text-[10px] text-slate-500 font-bold">Topics</div>
                        <div className="text-sm font-black text-amber-900">{defCount}টি টপিক</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border text-[11px]">
                      <div className="font-extrabold text-slate-800">গণিত — সংখ্যার ধারণা</div>
                      <div className="text-[10px] text-purple-700 font-bold">▶ ভিডিও · PDF · Test 1 & 2</div>
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
   * VIEW 2: COURSE APPLICATION
   * ==========================================================================
   */
  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 pb-20 ${activeTab !== "admin" ? "select-none" : ""}`}>
      {/* TOP NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActivePortal("gateway")}
              className="w-10 h-10 bg-[#2e1065] text-amber-300 rounded-xl flex items-center justify-center font-black text-xl cursor-pointer"
            >
              ব
            </div>
            <div onClick={() => navigateTo("dashboard")} className="cursor-pointer">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                {selectedCourse === "bcs" ? "বিসিএস পাঠ (BCS)" : "Defense & Police Foundation"}
              </h1>
              <p className="text-[11px] text-emerald-600 font-bold">
                {dbLoading ? "ক্লাউড সিঙ্ক হচ্ছে..." : "● ক্লাউড ডাটাবেস সংযুক্ত"}
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-bold text-slate-600">
            <button onClick={() => navigateTo("dashboard")} className={`${activeTab === "dashboard" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5 cursor-pointer`}>ড্যাশবোর্ড</button>
            <button onClick={() => navigateTo("syllabus")} className={`${activeTab === "syllabus" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5 cursor-pointer`}>সিলেবাস</button>
            <button onClick={() => navigateTo("subject_lectures")} className={`${activeTab === "subject_lectures" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5 cursor-pointer`}>লেকচার</button>
            <button onClick={() => navigateTo("mock_test_hub")} className={`${activeTab === "mock_test_hub" || activeTab === "active_exam_room" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5 cursor-pointer`}>মক টেস্ট (Test 1 & 2)</button>
            {selectedCourse === "bcs" && (
              <button
                onClick={() => navigateTo("biweekly_contest")}
                className={`${
                  activeTab === "biweekly_contest"
                    ? "text-amber-700 border-b-2 border-amber-600 font-black"
                    : "text-amber-700 hover:text-amber-900 font-extrabold"
                } py-5 flex items-center gap-1 cursor-pointer`}
              >
                <Trophy className="w-4 h-4 text-amber-600" /> জাতীয় বিসিএস পরীক্ষা (২০০ MCQ)
              </button>
            )}
            <button onClick={() => navigateTo("qbank")} className={`${activeTab === "qbank" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5 cursor-pointer`}>প্রশ্ন ব্যাংক</button>
            <button onClick={() => navigateTo("admin")} className={`${activeTab === "admin" ? "text-blue-600 border-b-2 border-blue-600" : "text-blue-600 hover:text-blue-800"} py-5 flex items-center gap-1 cursor-pointer`}>
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </nav>

          <button
            onClick={() => setActivePortal("gateway")}
            className="px-3.5 py-2 rounded-xl bg-[#2e1065] text-amber-300 hover:bg-[#3b0764] text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" /> কোর্স পরিবর্তন
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 bg-white px-4 py-2.5 gap-4 text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700">
          <button onClick={() => setActivePortal("gateway")} className="text-purple-700 font-extrabold">⌂ পোর্টাল</button>
          <button onClick={() => navigateTo("dashboard")} className={activeTab === "dashboard" ? "text-slate-900 underline" : ""}>ড্যাশবোর্ড</button>
          <button onClick={() => navigateTo("subject_lectures")} className={activeTab === "subject_lectures" ? "text-slate-900 underline" : ""}>লেকচার</button>
          <button onClick={() => navigateTo("mock_test_hub")} className={activeTab === "mock_test_hub" ? "text-slate-900 underline" : ""}>মক টেস্ট</button>
          {selectedCourse === "bcs" && (
            <button onClick={() => navigateTo("biweekly_contest")} className="text-amber-700 font-extrabold">
              🏆 জাতীয় পরীক্ষা (২০০)
            </button>
          )}
          <button onClick={() => navigateTo("qbank")} className={activeTab === "qbank" ? "text-slate-900 underline" : ""}>প্রশ্ন ব্যাংক</button>
          <button onClick={() => navigateTo("admin")} className="text-blue-600 font-extrabold">অ্যাডমিন</button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* GLOBAL BACK ARROW BAR */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold shadow-2xs hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {activeTab === "dashboard" ? "কোর্স পোর্টালে ফিরে যান" : "আগের পেজে ফিরে যান"}
          </button>
          <div className="text-xs sm:text-sm font-bold text-slate-600">
            {selectedCourse === "bcs" ? "📚 BCS Preparation" : "🛡️ Defense & Police Foundation"}
          </div>
        </div>

        {/* ================= 1. DASHBOARD (WITH BANGLA GRAMMAR, ENGLISH GRAMMAR & 15-DAY NATIONAL CONTEST BANNER) ================= */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-28 h-28 rounded-full bg-amber-300 border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-3">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <MiniExecutive2DAvatar size="w-full h-full" />
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </div>
                <h3 onClick={() => setShowProfileEditModal(true)} className="font-extrabold text-lg text-slate-900 cursor-pointer hover:underline">
                  {profile.name}
                </h3>
                <p className="text-xs font-bold text-purple-700 mt-0.5">{profile.targetBcs}</p>
                {profile.institution && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    {profile.hideProfile ? "লুকানো আছে" : profile.institution}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm font-extrabold mb-2">
                  <span>মোট অগ্রগতি</span>
                  <span className="text-blue-600">{overallProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgressPercent}%` }} />
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {totalCompletedLectures}/{totalUploadedLectures} টি লেকচার সম্পন্ন · {completedQuizzesCount} টি পরীক্ষা সম্পন্ন
                </p>
              </div>

              <button onClick={() => setShowProfileEditModal(true)} className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left cursor-pointer">
                <span className="text-sm font-bold">প্রোফাইল ও প্রতিষ্ঠান এডিট</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </aside>

            <div className="lg:col-span-9 space-y-6">
              {/* Top Hero Banner + 15-Day 200-MCQ Live Exam CTA */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full font-extrabold">
                    {selectedCourse === "defense" ? "DEFENSE & POLICE FOUNDATION" : "৪৭তম ও ৪৮তম বিসিএস স্পেশাল"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                    লেকচার PDF, ২-কলাম Text View ও অধ্যায়ভিত্তিক Test 1 / Test 2
                  </h2>
                  <p className="text-sm text-slate-200 mt-1">
                    প্রতিটি টেস্টে ৫০টি প্রশ্ন · ৩৬ সেকেন্ড/প্রশ্ন · নেগেটিভ মার্কিং ০.৫০ · পাস মার্ক ৬০%
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedCourse === "bcs" && (
                    <button
                      onClick={() => navigateTo("biweekly_contest")}
                      className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black hover:bg-emerald-600 flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Trophy className="w-4 h-4" /> ২০০ নম্বরের জাতীয় পরীক্ষা ও লিডারবোর্ড
                    </button>
                  )}
                  <button onClick={() => navigateTo("mock_test_hub")} className="px-5 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-300 cursor-pointer">
                    অধ্যায়ভিত্তিক মক টেস্ট দিন →
                  </button>
                </div>
              </div>

              {/* Subjects Grid (12 Subjects for BCS including Bangla Grammar & English Grammar) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCourseSubjects.map((sub) => {
                  const stats = getSubjectDynamicStats(sub.id);
                  const isEngGrammar = sub.id === "english_grammar";
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectSubject(sub.id)}
                      className={`p-5 rounded-2xl border bg-white cursor-pointer transition hover:shadow-md hover:border-[#2e1065] ${
                        isEngGrammar ? "border-violet-300 ring-1 ring-violet-200" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-xl ${sub.bg} ${sub.text} font-extrabold flex items-center justify-center text-base shrink-0`}>
                            {sub.initial}
                          </div>
                          <div>
                            <div className="font-extrabold text-base text-slate-900">{sub.title}</div>
                            <div className="text-xs font-semibold text-slate-600 mt-0.5">
                              আপলোডকৃত লেকচার: {stats.totalCount}টি
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-extrabold bg-slate-100 px-2 py-0.5 rounded text-slate-800 block">
                            প্রিলি: {sub.preliMarks || sub.examMarks}
                          </span>
                          {sub.writtenMarks > 0 && (
                            <span className="text-[11px] font-bold text-blue-700 block">
                              লিখিত: {sub.writtenMarks}
                            </span>
                          )}
                        </div>
                      </div>

                      {isEngGrammar && (
                        <div className="mb-2.5 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200 text-[11px] font-extrabold text-violet-900 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-violet-700" />
                          <span>+ গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি যুক্ত</span>
                        </div>
                      )}

                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-[#4c1d95] h-full rounded-full" style={{ width: `${stats.percent}%` }} />
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>সম্পন্ন {stats.completedCount}/{stats.totalCount}</span>
                        <span>{stats.percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. LECTURE HUB (WITH AUTO-SCROLL + ENGLISH GRAMMAR VOCABULARY STORIES) ================= */}
        {activeTab === "subject_lectures" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#3b0764] text-white p-6 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{currentSubject.title} — লেকচার ও পিডিএফ হাব</h2>
                <p className="text-sm text-purple-200 mt-0.5">
                  মোট আপলোডকৃত লেকচার: {subjectLectures.length}টি · লেকচারে ক্লিক করলেই অটো-স্ক্রল করে নিচে স্টাডি রিসোর্সে নিয়ে যাবে
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Special Button inside English Grammar to switch directly to Story Vocabulary */}
                {activeSubjectId === "english_grammar" && (
                  <button
                    onClick={() => {
                      setActivePdfStep("vocab_story");
                      if (vocabStories.length > 0 && !activeVocabStory) {
                        setActiveVocabStory(vocabStories[0]);
                      }
                      smoothScrollToRef(vocabReaderRef);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer transition ${
                      activePdfStep === "vocab_story"
                        ? "bg-amber-400 text-slate-950"
                        : "bg-white/15 text-amber-300 border border-amber-400/40 hover:bg-white/25"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" /> 📖 গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি শিখুন ({vocabStories.length}টি গল্প)
                  </button>
                )}

                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                  {isSidebarCollapsed ? "তালিকা দেখান" : "তালিকা লুকান"}
                </button>
                <select
                  value={activeSubjectId}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm font-extrabold bg-white text-slate-900"
                >
                  {currentCourseSubjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* IF USER IS IN "গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি শিখুন" MODE */}
            {activeSubjectId === "english_grammar" && activePdfStep === "vocab_story" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Vocabulary Story List */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-violet-200 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="font-extrabold text-base text-violet-950">
                      📖 ভোকাবুলারি স্টোরি লিস্ট ({vocabStories.length}টি)
                    </span>
                    <button
                      onClick={() => setActivePdfStep("lecture")}
                      className="text-xs font-extrabold text-blue-600 hover:underline cursor-pointer"
                    >
                      ← লেকচারে ফিরুন
                    </button>
                  </div>

                  {vocabStories.length === 0 ? (
                    <div className="p-8 text-center bg-violet-50/50 rounded-xl border border-dashed text-sm font-bold text-slate-600">
                      এখনো কোনো ভোকাবুলারি স্টোরি আপলোড করা হয়নি। অ্যাডমিন প্যানেল থেকে স্টোরি যুক্ত করুন।
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
                      {vocabStories.map((st) => {
                        const stId = st._id || st.id;
                        const isSelected = (activeVocabStory?._id || activeVocabStory?.id) === stId;
                        return (
                          <div
                            key={stId}
                            onClick={() => {
                              setActiveVocabStory(st);
                              // Auto-Scroll directly to Story Reader!
                              smoothScrollToRef(vocabReaderRef);
                            }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition ${
                              isSelected
                                ? "bg-[#2e1065] text-white border-[#2e1065] shadow-sm"
                                : "bg-white hover:border-violet-400"
                            }`}
                          >
                            <div className={`text-[11px] font-extrabold ${isSelected ? "text-amber-300" : "text-violet-700"}`}>
                              Story #{st.storyNo < 10 ? `0${st.storyNo}` : st.storyNo}
                            </div>
                            <div className="font-extrabold text-sm mt-0.5">{st.title}</div>
                            {st.subtitle && (
                              <div className={`text-xs mt-0.5 truncate ${isSelected ? "text-purple-200" : "text-slate-500"}`}>
                                {st.subtitle}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Visual Storybook Reader (Supports 2 Related Images + Colored Text) */}
                <div ref={vocabReaderRef} className="lg:col-span-9 scroll-mt-20">
                  {!activeVocabStory ? (
                    <div className="bg-white rounded-2xl border p-14 text-center text-slate-600 font-bold">
                      বাম পাশের তালিকা থেকে একটি ভোকাবুলারি স্টোরি নির্বাচন করুন।
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border-2 border-violet-200 p-6 sm:p-9 shadow-sm space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-violet-100 pb-4">
                        <div>
                          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-900 text-xs font-extrabold">
                            📖 গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি · Story #{activeVocabStory.storyNo}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            {activeVocabStory.title}
                          </h3>
                          {activeVocabStory.subtitle && (
                            <p className="text-sm font-semibold text-slate-600 mt-1">{activeVocabStory.subtitle}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setActivePdfStep("lecture")}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-extrabold hover:bg-slate-200 cursor-pointer"
                        >
                          ← গ্রামার লেকচারে ফিরে যান
                        </button>
                      </div>

                      {/* Storybook Body with Visual Image 1 & Image 2 */}
                      <div className="clearfix text-base sm:text-lg text-slate-900 leading-relaxed font-medium space-y-4">
                        {/* Story Image 1 */}
                        {activeVocabStory.image1Url && (
                          <img
                            src={activeVocabStory.image1Url}
                            alt={activeVocabStory.title}
                            className={`rounded-2xl border-4 border-amber-200 shadow-md object-cover ${
                              activeVocabStory.image1Position === "left"
                                ? "sm:float-left sm:w-72 sm:mr-6 mb-4"
                                : activeVocabStory.image1Position === "right"
                                ? "sm:float-right sm:w-72 sm:ml-6 mb-4"
                                : "w-full max-w-xl mx-auto mb-6 block"
                            }`}
                          />
                        )}

                        <div
                          className="whitespace-pre-line leading-loose"
                          dangerouslySetInnerHTML={{ __html: activeVocabStory.storyContent }}
                        />

                        {/* Story Image 2 */}
                        {activeVocabStory.image2Url && (
                          <img
                            src={activeVocabStory.image2Url}
                            alt={`${activeVocabStory.title} illustration 2`}
                            className={`rounded-2xl border-4 border-violet-200 shadow-md object-cover ${
                              activeVocabStory.image2Position === "left"
                                ? "sm:float-left sm:w-72 sm:mr-6 mt-4 mb-4"
                                : activeVocabStory.image2Position === "right"
                                ? "sm:float-right sm:w-72 sm:ml-6 mt-4 mb-4"
                                : "w-full max-w-xl mx-auto mt-6 block clear-both"
                            }`}
                          />
                        )}
                      </div>

                      {/* Word Meaning Summary Box */}
                      {activeVocabStory.wordMeaningBox && (
                        <div className="clear-both p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-200 space-y-2 mt-6">
                          <h4 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-600" /> এই গল্পের গুরুত্বপূর্ণ Vocabulary ও শব্দের অর্থ:
                          </h4>
                          <div
                            className="text-sm sm:text-base text-slate-900 whitespace-pre-line font-semibold md:columns-2 md:gap-8"
                            dangerouslySetInnerHTML={{ __html: activeVocabStory.wordMeaningBox }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* STANDARD LECTURE HUB (WITH AUTO-SCROLL TO STUDY RESOURCE) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {!isSidebarCollapsed && (
                  <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                    <div className="font-extrabold text-base border-b pb-3">
                      লেকচার তালিকা ({subjectLectures.length}টি)
                    </div>
                    {subjectLectures.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-sm font-bold text-slate-600">
                        এই বিষয়ে এখনো কোনো লেকচার আপলোড করা হয়নি।
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                        {subjectLectures.map((lec) => {
                          const lecId = lec._id || lec.id;
                          const isSelected = (activeLecture?._id || activeLecture?.id) === lecId;
                          const isDone = progressMap[lecId]?.completed;
                          const num = lec.lectureNo < 10 ? `0${lec.lectureNo}` : lec.lectureNo;
                          return (
                            <div
                              key={lecId}
                              onClick={() => {
                                setActiveLecture(lec);
                                setActivePdfStep(selectedCourse === "defense" ? "video" : "lecture");
                                setStudentTwoColumnOverride(null);
                                // Auto-Scroll directly to the Study Resource section!
                                smoothScrollToRef(studyResourceRef);
                              }}
                              className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                                isSelected ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:border-slate-400"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-lg text-xs font-extrabold flex items-center justify-center ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-900"}`}>
                                  {num}
                                </span>
                                <div>
                                  <div className="text-sm font-bold leading-snug">Lecture {num}: {lec.title}</div>
                                  <div className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                                    {isDone ? "✓ সম্পন্ন" : "চলমান"}
                                  </div>
                                </div>
                              </div>
                              <CheckCircle2 className={`w-5 h-5 shrink-0 ${isDone ? "text-emerald-500" : "text-slate-300"}`} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* RIGHT STUDY RESOURCE VIEWER (TARGET OF AUTO-SCROLL) */}
                <div
                  ref={studyResourceRef}
                  className={`${isSidebarCollapsed ? "lg:col-span-12" : "lg:col-span-9"} space-y-6 scroll-mt-20`}
                >
                  {!activeLecture ? (
                    <div className="bg-white rounded-2xl border p-14 text-center text-slate-600 font-bold">
                      বাম পাশের তালিকা থেকে একটি লেকচার নির্বাচন করুন।
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                        <div>
                          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-md bg-blue-50 text-blue-800">
                            {currentSubject.title} · Lecture 0{activeLecture.lectureNo}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                            {activeLecture.title}
                          </h3>
                        </div>

                        {activePdfStep !== "video" && (
                          <div className="flex flex-wrap items-center gap-2.5">
                            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                              <button
                                onClick={() => setContentViewMode("pdf")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer ${
                                  contentViewMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-700"
                                }`}
                              >
                                📄 PDF View
                              </button>
                              <button
                                onClick={() => setContentViewMode("text")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer ${
                                  contentViewMode === "text" ? "bg-slate-900 text-white" : "text-slate-700"
                                }`}
                              >
                                📝 Text View
                              </button>
                            </div>

                            {contentViewMode === "text" && (
                              <button
                                onClick={() => setStudentTwoColumnOverride(!isCurrentTextTwoColumn())}
                                className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer ${
                                  isCurrentTextTwoColumn()
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-white text-slate-800 border-slate-300"
                                }`}
                              >
                                <Columns className="w-4 h-4" />
                                {isCurrentTextTwoColumn() ? "২-কলাম ভিউ (চালু)" : "২-কলামে দেখুন"}
                              </button>
                            )}

                            {contentViewMode === "pdf" && (
                              <button
                                onClick={() => setIsPdfFullscreen(true)}
                                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-bold hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Maximize2 className="w-4 h-4" /> ফুলস্ক্রিন ভিউ
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Resource Tabs (Includes 4th Tab for English Grammar: Story Vocabulary) */}
                      <div
                        className={`grid grid-cols-1 ${
                          activeSubjectId === "english_grammar" ? "sm:grid-cols-4" : "sm:grid-cols-3"
                        } gap-3.5`}
                      >
                        {selectedCourse === "defense" && (
                          <button
                            onClick={() => setActivePdfStep("video")}
                            className={`p-4 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                              activePdfStep === "video" ? "bg-[#2e1065] text-white border-[#2e1065]" : "bg-slate-50 text-slate-900"
                            }`}
                          >
                            <PlayCircle className="w-5 h-5 shrink-0 text-amber-400" />
                            <div>
                              <div className="text-sm font-extrabold">ভিডিও লেকচার</div>
                              <div className="text-xs opacity-80">YouTube Unlisted</div>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setActivePdfStep("lecture");
                            setStudentTwoColumnOverride(null);
                          }}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "lecture" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <FileText className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">১. মূল লেকচার নোট</div>
                            <div className="text-xs opacity-80">PDF ও রঙিন Text View</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActivePdfStep("mcq_pdf");
                            setStudentTwoColumnOverride(null);
                          }}
                          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "mcq_pdf" ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <HelpCircle className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">২. এই Chapter-এর সকল MCQ</div>
                            <div className="text-xs opacity-80">PDF ও ২-কলাম Text View</div>
                          </div>
                        </button>

                        {selectedCourse === "bcs" && (
                          <button
                            onClick={() => {
                              setActivePdfStep("written_pdf");
                              setStudentTwoColumnOverride(null);
                            }}
                            className={`p-4 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                              activePdfStep === "written_pdf" ? "bg-purple-600 text-white border-purple-600" : "bg-slate-50 text-slate-900"
                            }`}
                          >
                            <PenTool className="w-5 h-5 shrink-0" />
                            <div>
                              <div className="text-sm font-extrabold">৩. লিখিত প্রশ্ন ও উত্তর</div>
                              <div className="text-xs opacity-80">PDF ও রঙিন Text View</div>
                            </div>
                          </button>
                        )}

                        {/* 4th Tab exclusively inside English Grammar */}
                        {activeSubjectId === "english_grammar" && (
                          <button
                            onClick={() => {
                              setActivePdfStep("vocab_story");
                              if (vocabStories.length > 0 && !activeVocabStory) {
                                setActiveVocabStory(vocabStories[0]);
                              }
                            }}
                            className="p-4 rounded-xl border-2 border-violet-400 bg-violet-50 hover:bg-violet-100 text-violet-950 text-left transition flex items-center gap-3 cursor-pointer"
                          >
                            <Sparkles className="w-5 h-5 shrink-0 text-violet-700" />
                            <div>
                              <div className="text-sm font-extrabold">৪. গল্পে গল্পে ভোকাবুলারি</div>
                              <div className="text-xs text-violet-700 font-semibold">চিত্রসহ স্টোরিবুক</div>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* CONTENT VIEWPORT */}
                      {activePdfStep === "video" && (
                        <div>
                          {activeLecture.videoUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-[#2e1065] bg-black aspect-video">
                              <iframe src={getYoutubeEmbedUrl(activeLecture.videoUrl)} className="w-full h-full border-0" allowFullScreen title="Video" />
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed text-center bg-slate-50 font-bold text-slate-600">
                              ভিডিও লিংক দেওয়া হয়নি। পাশের PDF বা Text View দেখুন।
                            </div>
                          )}
                        </div>
                      )}

                      {activePdfStep === "lecture" && (
                        <div>
                          {contentViewMode === "pdf" && activeLecture.lecturePdfUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900">
                              <div className="bg-slate-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                                <span>📄 মূল লেকচার PDF — {activeLecture.title}</span>
                                <button onClick={() => setIsPdfFullscreen(true)} className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold">
                                  ⛶ ফুলস্ক্রিন
                                </button>
                              </div>
                              <div className="relative w-full h-[760px] bg-white">
                                <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                                <iframe src={formatSecurePdfUrl(activeLecture.lecturePdfUrl)} className="w-full h-full border-0" title="Lecture PDF" />
                              </div>
                            </div>
                          ) : activeLecture.mainContent ? (
                            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-blue-200 shadow-2xs space-y-5 clearfix">
                              <div
                                className={`text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium ${
                                  isCurrentTextTwoColumn() ? "md:columns-2 md:gap-8 [column-rule:1px_solid_#e2e8f0]" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: activeLecture.mainContent }}
                              />
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed text-center bg-slate-50 font-bold text-slate-600">
                              এই লেকচারে এখনো কোনো PDF বা Text View আপলোড করা হয়নি।
                            </div>
                          )}
                        </div>
                      )}

                      {activePdfStep === "mcq_pdf" && (
                        <div>
                          {contentViewMode === "pdf" && activeLecture.mcqPdfUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-emerald-900 bg-slate-900">
                              <div className="bg-emerald-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                                <span>📑 এই Chapter-এর সকল MCQ (PDF View)</span>
                                <button onClick={() => setIsPdfFullscreen(true)} className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold">
                                  ⛶ ফুলস্ক্রিন
                                </button>
                              </div>
                              <div className="relative w-full h-[760px] bg-white">
                                <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                                <iframe src={formatSecurePdfUrl(activeLecture.mcqPdfUrl)} className="w-full h-full border-0" title="MCQ PDF" />
                              </div>
                            </div>
                          ) : activeLecture.mcqTextContent ? (
                            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4 clearfix">
                              <div
                                className={`text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium ${
                                  isCurrentTextTwoColumn() ? "md:columns-2 md:gap-10 [column-rule:1px_solid_#a7f3d0]" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: activeLecture.mcqTextContent }}
                              />
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed text-center bg-slate-50 font-bold text-slate-600">
                              এই অধ্যায়ের MCQ PDF বা Text View এখনো আপলোড করা হয়নি।
                            </div>
                          )}
                        </div>
                      )}

                      {activePdfStep === "written_pdf" && (
                        <div>
                          {contentViewMode === "pdf" && activeLecture.writtenPdfUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-purple-900 bg-slate-900">
                              <div className="bg-purple-900 text-white px-5 py-3 text-sm font-bold flex justify-between items-center">
                                <span>✍️ লিখিত প্রশ্ন ও উত্তর (PDF View)</span>
                                <button onClick={() => setIsPdfFullscreen(true)} className="px-3 py-1 bg-white text-slate-900 rounded-lg text-xs font-extrabold">
                                  ⛶ ফুলস্ক্রিন
                                </button>
                              </div>
                              <div className="relative w-full h-[760px] bg-white">
                                <div className="absolute top-0 right-4 w-36 h-12 z-20 bg-transparent" />
                                <iframe src={formatSecurePdfUrl(activeLecture.writtenPdfUrl)} className="w-full h-full border-0" title="Written PDF" />
                              </div>
                            </div>
                          ) : activeLecture.writtenTextContent ? (
                            <div className="p-6 sm:p-8 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-4 clearfix">
                              <div
                                className={`text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium ${
                                  isCurrentTextTwoColumn() ? "md:columns-2 md:gap-10 [column-rule:1px_solid_#ddd6fe]" : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: activeLecture.writtenTextContent }}
                              />
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed text-center bg-slate-50 font-bold text-slate-600">
                              এই অধ্যায়ের লিখিত প্রশ্নোত্তর PDF বা Text View এখনো আপলোড করা হয়নি।
                            </div>
                          )}
                        </div>
                      )}

                      {/* BOTTOM EXAM BAR */}
                      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700 pb-5">
                          <div>
                            <span className="text-xs uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full font-extrabold">
                              অনলাইন পরীক্ষা · ৩৬ সেকেন্ড/প্রশ্ন · পাস মার্ক ৬০% · নেগেটিভ ০.৫০
                            </span>
                            <h4 className="font-extrabold text-lg mt-2">
                              এই অধ্যায়ের অনলাইন MCQ পরীক্ষায় অংশ নিন (Test 1 ও Test 2)
                            </h4>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {test1Set ? (
                              <button
                                onClick={() => launchSpecificExamSet(test1Set)}
                                className="px-5 py-3 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black hover:bg-emerald-600 cursor-pointer shadow-lg"
                              >
                                🎯 পরীক্ষা দিন: Test 1 ({test1Set.questions.length}টি প্রশ্ন) →
                              </button>
                            ) : (
                              <span className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-700">
                                Test 1 (প্রশ্ন সেট করা হয়নি)
                              </span>
                            )}

                            {test2Set ? (
                              <button
                                onClick={() => launchSpecificExamSet(test2Set)}
                                className="px-5 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-300 cursor-pointer shadow-lg"
                              >
                                🎯 পরীক্ষা দিন: Test 2 ({test2Set.questions.length}টি প্রশ্ন) →
                              </button>
                            ) : (
                              <span className="px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold border border-slate-700">
                                Test 2 (প্রশ্ন সেট করা হয়নি)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="text-xs sm:text-sm text-slate-300">
                            পরীক্ষা দিয়ে অথবা পরীক্ষা না দিয়েও আপনি সরাসরি পরবর্তী লেকচারে যেতে পারবেন:
                          </div>
                          <button
                            onClick={() => completeAndGoToNextLecture(activeLecture, subjectLectures)}
                            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-extrabold hover:bg-blue-500 flex items-center gap-2 cursor-pointer"
                          >
                            <CheckSquare className="w-4 h-4" /> পরবর্তী লেকচারে যান (Next Lecture) →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. 15-DAY NATIONAL 200-MCQ COMBINED BCS LIVE EXAM & LEADERBOARD ================= */}
        {activeTab === "biweekly_contest" && (
          <div className="space-y-6">
            {/* Contest Hero Banner */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                  <Flame className="w-4 h-4" /> প্রতি ১৫ দিনে ১টি জাতীয় বিসিএস লাইভ পরীক্ষা · সবার জন্য উন্মুক্ত
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {currentActiveContest?.title || "বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড প্রিলিমিনারি পরীক্ষা (২০০ এমসিকিউ)"}
                </h2>
                <p className="text-xs sm:text-sm text-purple-200">
                  মোট প্রশ্ন: {currentActiveContest?.questions?.length || 200}টি · প্রতি প্রশ্নে ৩৬ সেকেন্ড · পাস মার্ক: ৬০% · নেগেটিভ মার্কিং: ০.৫০ · ১ বারই অংশ নেওয়া যাবে (No Re-Exam)
                </p>
              </div>

              {!isContestRoomActive && (
                <div>
                  {myContestSubmission ? (
                    <div className="bg-emerald-500/20 border border-emerald-400/40 px-5 py-3 rounded-2xl text-center">
                      <div className="text-xs font-bold text-emerald-300">আপনি পরীক্ষায় অংশ নিয়েছেন</div>
                      <div className="text-xl font-black text-white mt-0.5">
                        মেরিট পজিশন: #{myLeaderboardRank} / {sortedLeaderboard.length}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={startBiWeekly200Contest}
                      className="px-7 py-4 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-2xl text-sm sm:text-base font-black hover:scale-105 transition shadow-xl cursor-pointer whitespace-nowrap"
                    >
                      🚀 এখনই পরীক্ষায় অংশ নিন →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* IF STUDENT IS CURRENTLY TAKING THE 200-MCQ LIVE CONTEST */}
            {isContestRoomActive && currentActiveContest ? (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div>
                    <div className="text-xs font-extrabold text-rose-600 uppercase">
                      ⚠️ সতর্কতা: সময় শেষ হলে অটো-সাবমিট হয়ে যাবে · পুনরায় পরীক্ষা দেওয়া যাবে না
                    </div>
                    <div className="font-extrabold text-lg text-slate-900">
                      উত্তর দিয়েছেন: {Object.keys(contestAnswers).length} / {currentActiveContest.questions.length}টি
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-black text-base flex items-center gap-1.5">
                      <Clock className="w-5 h-5" /> সময় বাকি: {formatTime(contestTimeLeft)}
                    </div>
                    <button
                      onClick={submitBiWeeklyContestExam}
                      disabled={contestSubmitting}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black cursor-pointer"
                    >
                      {contestSubmitting ? "সাবমিট হচ্ছে..." : "খাতা জমা দিন"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentActiveContest.questions.map((q, idx) => {
                    const qKey = q.qNo || idx + 1;
                    const selectedOpt = contestAnswers[qKey];
                    return (
                      <div key={qKey} className="bg-white p-6 rounded-2xl border border-slate-200">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="font-extrabold text-base sm:text-lg">
                            {qKey}. {q.question}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0">
                            {q.category === "english" ? "English" : q.category === "math" ? "Math" : "General"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setContestAnswers({ ...contestAnswers, [qKey]: optIdx })}
                              className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer ${
                                selectedOpt === optIdx
                                  ? "bg-slate-900 text-white border-slate-900 font-extrabold"
                                  : "bg-white border-slate-300 hover:border-slate-900"
                              }`}
                            >
                              {String.fromCharCode(2453 + optIdx)}. {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* LEADERBOARD & PERSONAL RESULT + WRONG ANSWER EXPLANATIONS */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Center: National Merit Leaderboard (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-500" /> জাতীয় মেধা তালিকা (Live Leaderboard)
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        টাই-ব্রেকার নিয়ম: সমান নম্বর পেলে প্রথমে English-এ এগিয়ে থাকা শিক্ষার্থী, তাও সমান হলে Math-এ এগিয়ে থাকা শিক্ষার্থী আগে স্থান পাবে।
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2e1065] text-xs font-extrabold">
                      মোট পরীক্ষার্থী: {sortedLeaderboard.length} জন
                    </span>
                  </div>

                  {sortedLeaderboard.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-600 font-bold">
                      এখনো কেউ এই পর্বের পরীক্ষায় খাতা জমা দেয়নি। প্রথম স্থান অর্জন করতে এখনই পরীক্ষায় অংশ নিন!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                      {sortedLeaderboard.map((sub, index) => {
                        const rank = index + 1;
                        const isMe = sub.studentKey === studentUniqueKey;
                        const totalQ = currentActiveContest?.questions?.length || 200;
                        const passMark = +(totalQ * 0.6).toFixed(1);
                        const passed = sub.totalScore >= passMark;

                        return (
                          <div
                            key={ index }
                            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                              isMe
                                ? "bg-amber-50/80 border-2 border-amber-400 shadow-xs"
                                : rank <= 3
                                ? "bg-purple-50/40 border-purple-200"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Position / Rank Badge */}
                              <div
                                className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                                  rank === 1
                                    ? "bg-amber-400 text-slate-950"
                                    : rank === 2
                                    ? "bg-slate-300 text-slate-900"
                                    : rank === 3
                                    ? "bg-amber-700 text-white"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                #{rank}
                              </div>

                              {/* Student Photo or Default 2D Executive Avatar */}
                              {sub.avatarUrl ? (
                                <img
                                  src={sub.avatarUrl}
                                  alt={sub.name}
                                  className="w-11 h-11 rounded-full object-cover border-2 border-purple-300 shrink-0"
                                />
                              ) : (
                                <MiniExecutive2DAvatar size="w-11 h-11" />
                              )}

                              <div>
                                <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                                  <span>{sub.name}</span>
                                  {isMe && (
                                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-black">
                                      আপনি
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>{sub.institution || "বিসিএস পরীক্ষার্থী"}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-lg font-black text-[#2e1065]">
                                {sub.totalScore} <span className="text-xs font-bold text-slate-400">/ {totalQ}</span>
                              </div>
                              <div className="text-[10px] font-bold text-slate-500">
                                Eng: {sub.englishScore || 0} · Math: {sub.mathScore || 0}
                              </div>
                              <span
                                className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                  passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {passed ? "PASSED (60%+)" : "BELOW 60%"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Student's Own Answer Sheet & Wrong Answer Explanations (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <h3 className="text-lg font-black text-slate-900 border-b pb-3">
                    📋 আপনার ফলাফল ও ভুল উত্তরের ব্যাখ্যা
                  </h3>

                  {!myContestSubmission ? (
                    <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed space-y-3">
                      <p className="text-sm font-bold text-slate-700">
                        আপনি এখনো এই পর্বের পরীক্ষায় অংশগ্রহণ করেননি।
                      </p>
                      <button
                        onClick={startBiWeekly200Contest}
                        className="px-5 py-2.5 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        পরীক্ষা শুরু করুন →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2.5 text-center">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                          <div className="text-[11px] font-bold text-emerald-800">সঠিক উত্তর</div>
                          <div className="text-xl font-black text-emerald-700">{myContestSubmission.correctCount}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                          <div className="text-[11px] font-bold text-rose-800">ভুল (-০.৫০)</div>
                          <div className="text-xl font-black text-rose-700">{myContestSubmission.wrongCount}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 text-white">
                          <div className="text-[11px] font-bold text-amber-300">মেধা স্থান</div>
                          <div className="text-xl font-black">#{myLeaderboardRank}</div>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                        {currentActiveContest?.questions?.map((q, i) => {
                          const qKey = q.qNo || i + 1;
                          const myAns = myContestSubmission.answersMap?.[qKey];
                          const isWrong = myAns !== undefined && Number(myAns) !== Number(q.correctAnswer);
                          return (
                            <div
                              key={qKey}
                              className={`p-4 rounded-xl border text-xs sm:text-sm space-y-1.5 ${
                                isWrong ? "bg-rose-50/60 border-rose-300" : "bg-slate-50 border-slate-200"
                              }`}
                            >
                              <div className="font-extrabold text-slate-900">
                                {qKey}. {q.question}
                              </div>
                              <div className="text-xs font-bold text-emerald-800">
                                ✓ সঠিক উত্তর: {q.options[q.correctAnswer]}
                              </div>
                              {isWrong && (
                                <div className="text-xs font-bold text-rose-700">
                                  ✗ আপনার উত্তর: {q.options[myAns]}
                                </div>
                              )}
                              {q.explanation && (
                                <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border mt-1">
                                  <strong>ব্যাখ্যা:</strong> {q.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. MOCK TEST HUB (CHAPTER TEST 1 & TEST 2) ================= */}
        {activeTab === "mock_test_hub" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  🎯 অধ্যায়ভিত্তিক মক টেস্ট হাব (Test 1 ও Test 2 · প্রতিটি টেস্টে ৫০টি প্রশ্ন)
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Subject এবং Chapter / Lecture নির্বাচন করে পরীক্ষায় অংশ নিন · প্রতি প্রশ্ন ৩৬ সেকেন্ড · পাস মার্ক ৬০% · নেগেটিভ মার্কিং ০.৫০
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-extrabold text-xs sm:text-sm block mb-1.5 text-slate-700">
                    ১. বিষয় (Subject) নির্বাচন করুন:
                  </label>
                  <select
                    value={mockFilterSubject}
                    onChange={(e) => {
                      setMockFilterSubject(e.target.value);
                      setMockFilterLectureNo("ALL");
                    }}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-extrabold text-slate-900"
                  >
                    <option value="ALL">সকল বিষয়</option>
                    {currentCourseSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-xs sm:text-sm block mb-1.5 text-slate-700">
                    ২. Chapter / Lecture নির্বাচন করুন:
                  </label>
                  <select
                    value={mockFilterLectureNo}
                    onChange={(e) => setMockFilterLectureNo(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-extrabold text-slate-900"
                  >
                    <option value="ALL">সকল Chapter / Lecture</option>
                    {Array.from(
                      new Set(
                        examSets
                          .filter(
                            (s) =>
                              (s.courseType || "bcs") === selectedCourse &&
                              (mockFilterSubject === "ALL" || s.subjectId === mockFilterSubject)
                          )
                          .map((s) => s.lectureNo)
                      )
                    ).map((lecNo) => {
                      const matchingSet = examSets.find(
                        (s) =>
                          (s.courseType || "bcs") === selectedCourse &&
                          (mockFilterSubject === "ALL" || s.subjectId === mockFilterSubject) &&
                          Number(s.lectureNo) === Number(lecNo)
                      );
                      return (
                        <option key={lecNo} value={lecNo}>
                          Lecture {lecNo}: {matchingSet?.chapterName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {(() => {
              const availableSets = examSets.filter(
                (s) =>
                  (s.courseType || "bcs") === selectedCourse &&
                  (mockFilterSubject === "ALL" || s.subjectId === mockFilterSubject) &&
                  (mockFilterLectureNo === "ALL" || Number(s.lectureNo) === Number(mockFilterLectureNo))
              );

              if (availableSets.length === 0) {
                return (
                  <div className="bg-white p-14 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                    <div className="text-lg font-extrabold text-slate-800">
                      এই বিষয়ে বা অধ্যায়ে এখনো কোনো মক টেস্ট (Test 1 / Test 2) প্রকাশ করা হয়নি
                    </div>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {availableSets.map((setDoc) => {
                    const subName = currentCourseSubjects.find((s) => s.id === setDoc.subjectId)?.title;
                    const qCount = setDoc.questions?.length || 0;
                    const totalMinutes = Math.round((qCount * 36) / 60);
                    return (
                      <div key={setDoc._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2e1065] text-xs font-extrabold">
                              {subName} · Lecture {setDoc.lectureNo}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900">
                              Test {setDoc.testNumber}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-slate-900">
                            {setDoc.chapterName} — Test {setDoc.testNumber}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                            মোট প্রশ্ন: {qCount}টি · সময়: {totalMinutes} মিনিট · পাস মার্ক: ৬০% · নেগেটিভ: ০.৫০
                          </p>
                        </div>

                        <button
                          onClick={() => launchSpecificExamSet(setDoc)}
                          className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold hover:bg-black cursor-pointer"
                        >
                          পরীক্ষা শুরু করুন (Test {setDoc.testNumber}) →
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ================= 5. ACTIVE CHAPTER EXAM ROOM ================= */}
        {activeTab === "active_exam_room" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4 sticky top-16 z-30">
              <div>
                <span className="text-xs font-extrabold text-purple-700 uppercase">
                  ৩৬ সেকেন্ড/প্রশ্ন · নেগেটিভ মার্কিং ০.৫০ · পাস মার্ক ৬০%
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">{examTitle}</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-extrabold text-base flex items-center gap-1.5">
                  <Clock className="w-5 h-5" /> সময় বাকি: {formatTime(timeLeft)}
                </div>
                {!examSubmitted && (
                  <button onClick={handleFinishExam} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold hover:bg-black cursor-pointer">
                    খাতা জমা দিন
                  </button>
                )}
              </div>
            </div>

            {examSubmitted && (
              <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl space-y-5">
                {(() => {
                  const res = calculateExamResult();
                  return (
                    <>
                      <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                            📊 প্রাপ্ত নম্বর: {res.finalScore} / {res.totalQ} ({res.scorePercentage}%)
                          </h3>
                          <span className={`px-3.5 py-1 rounded-full text-xs font-black ${res.isPassed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {res.isPassed ? "🎉 উত্তীর্ণ (PASSED · ৬০%+)" : `⚠️ অনুত্তীর্ণ (পাস মার্ক ৬০% = ${res.passMarkRequired})`}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setExamAnswers({});
                            setExamSubmitted(false);
                            setTimeLeft(examQuestions.length * 36);
                          }}
                          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" /> আবার পরীক্ষা দিন
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const qKey = q._id || q.qNo || idx;
                const selectedOpt = examAnswers[qKey];
                const isWrong = examSubmitted && selectedOpt !== undefined && Number(selectedOpt) !== Number(q.correctAnswer);

                return (
                  <div key={qKey} className={`bg-white p-6 rounded-2xl border ${isWrong ? "border-2 border-rose-500" : "border-slate-200"}`}>
                    <h3 className="font-extrabold text-base sm:text-lg mb-4">{idx + 1}. {q.question}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        let style = "bg-white border-slate-300";
                        if (!examSubmitted && selectedOpt === optIdx) style = "bg-slate-900 text-white border-slate-900 font-extrabold";
                        else if (examSubmitted) {
                          if (Number(optIdx) === Number(q.correctAnswer)) style = "bg-emerald-50 border-emerald-500 text-emerald-950 font-extrabold";
                          else if (selectedOpt === optIdx) style = "bg-rose-50 border-rose-500 text-rose-950 font-extrabold";
                        }
                        return (
                          <button
                            key={optIdx}
                            disabled={examSubmitted}
                            onClick={() => setExamAnswers({ ...examAnswers, [qKey]: optIdx })}
                            className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer ${style}`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                    {examSubmitted && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 border text-sm">
                        <div className="font-extrabold">✓ সঠিক উত্তর: {q.options[q.correctAnswer]}</div>
                        {q.explanation && <div className="mt-1"><strong>ব্যাখ্যা:</strong> {q.explanation}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 6. QUESTION BANK HUB (WITH AUTO-SCROLL) ================= */}
        {activeTab === "qbank" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  বিষয়ভিত্তিক প্রশ্ন ব্যাংক (PDF View ও ২-কলাম Text View)
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedQbSubject}
                  onChange={(e) => setSelectedQbSubject(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-extrabold bg-slate-50"
                >
                  <option value="ALL">সকল বিষয় ({courseFilteredQbankDocs.length}টি)</option>
                  {currentCourseSubjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border">
                  <button onClick={() => setQbankViewMode("pdf")} className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold ${qbankViewMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-700"}`}>📄 PDF View</button>
                  <button onClick={() => setQbankViewMode("text")} className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold ${qbankViewMode === "text" ? "bg-slate-900 text-white" : "text-slate-700"}`}>📝 Text View</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="font-extrabold text-base border-b pb-2.5">
                  প্রশ্ন ব্যাংক তালিকা ({courseFilteredQbankDocs.length}টি)
                </div>
                {courseFilteredQbankDocs.map((doc) => {
                  const dId = doc._id || doc.id;
                  const isSelected = (activeQbankDoc?._id || activeQbankDoc?.id) === dId;
                  return (
                    <div
                      key={dId}
                      onClick={() => {
                        setActiveQbankDoc(doc);
                        smoothScrollToRef(qbankReaderRef);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        isSelected ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:border-slate-400"
                      }`}
                    >
                      <div className={`text-[11px] font-bold ${isSelected ? "text-amber-300" : "text-purple-700"}`}>
                        {doc.bcsBatch}
                      </div>
                      <div className="font-extrabold text-sm mt-1">{doc.title}</div>
                    </div>
                  );
                })}
              </div>

              <div ref={qbankReaderRef} className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 p-6 scroll-mt-20">
                {!activeQbankDoc ? (
                  <div className="p-12 text-center text-slate-500 font-bold">
                    কোনো প্রশ্ন ব্যাংক ফাইল পাওয়া যায়নি।
                  </div>
                ) : qbankViewMode === "pdf" && activeQbankDoc.pdfUrl ? (
                  <iframe src={formatSecurePdfUrl(activeQbankDoc.pdfUrl)} className="w-full h-[760px] border-0 rounded-xl" title="QBank PDF" />
                ) : (
                  <div
                    className={`p-6 rounded-2xl bg-blue-50/40 border border-blue-200 text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium clearfix ${
                      qbankTwoCol ? "md:columns-2 md:gap-10" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: activeQbankDoc.textContent || "টেক্সট নোট নেই।" }}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. SYLLABUS TAB ================= */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
            {currentCourseSubjects.map((sub, idx) => (
              <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
                  <h3 className="font-extrabold text-lg">{idx + 1}. {sub.title}</h3>
                  <button onClick={() => handleSelectSubject(sub.id)} className="px-4 py-2 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold cursor-pointer">
                    লেকচার দেখুন →
                  </button>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sub.syllabusBreakdown.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border bg-slate-50/60">
                      <div className="flex justify-between font-extrabold text-sm mb-1">
                        <span>{item.topic}</span>
                        <span className="text-emerald-700">{item.marks} নম্বর</span>
                      </div>
                      <p className="text-xs text-slate-600">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= 8. CENTRAL ADMIN PANEL ================= */}
        {activeTab === "admin" && (
          <div>
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm text-center my-12">
                <KeyRound className="w-10 h-10 text-[#2e1065] mx-auto mb-3" />
                <h2 className="text-xl font-extrabold mb-1">BCS Path — Admin Panel</h2>
                <p className="text-sm text-slate-600 mb-5">পিন দিয়ে আনলক করুন (`bcs2026`)</p>
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
                  className="w-full py-3.5 bg-[#1e1b4b] text-white rounded-xl text-sm font-extrabold cursor-pointer"
                >
                  অ্যাডমিন প্যানেল আনলক করুন
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => handleAdminCourseSwitch("bcs")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between ${
                        adminCourseTrack === "bcs" ? "bg-purple-50 border-[#4c1d95]" : "bg-slate-50 border-transparent"
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-lg text-[#2e1065]">📚 Course 01: BCS Preparation</div>
                        <p className="text-xs text-slate-600">১২টি বিষয় · ভোকাবুলারি স্টোরি · ২০০ MCQ জাতীয় পরীক্ষা · Test 1 & 2</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-purple-200 text-[#2e1065] text-xs font-extrabold">Course 01</span>
                    </div>

                    <div
                      onClick={() => handleAdminCourseSwitch("defense")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center justify-between ${
                        adminCourseTrack === "defense" ? "bg-amber-50 border-amber-500" : "bg-slate-50 border-transparent"
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-lg text-amber-950">🛡️ Course 02: Defense & Police</div>
                        <p className="text-xs text-amber-900">Unlisted Video · Lecture PDF + Text · Test 1 & Test 2</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-extrabold">Course 02</span>
                    </div>
                  </div>

                  {/* Admin Module Navigation Tabs */}
                  <div className="flex flex-wrap gap-2.5 pt-2 border-t">
                    <button
                      onClick={() => setAdminSection("lectures")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "lectures" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ১. লেকচার আপলোড (PDF + Font +/- & Image Text)
                    </button>
                    <button
                      onClick={() => setAdminSection("vocab_stories")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "vocab_stories"
                          ? "bg-violet-700 text-white"
                          : "bg-violet-50 text-violet-900 border border-violet-200"
                      }`}
                    >
                      ২. 📖 গল্পে গল্পে ভোকাবুলারি স্টোরি (২টি ইমেজসহ)
                    </button>
                    <button
                      onClick={() => setAdminSection("exam_builder")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "exam_builder"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      }`}
                    >
                      ৩. 🎯 অধ্যায়ভিত্তিক Test 1 ও Test 2 (৫০টি প্রশ্ন)
                    </button>
                    <button
                      onClick={() => setAdminSection("biweekly_200")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "biweekly_200"
                          ? "bg-amber-500 text-slate-950"
                          : "bg-amber-50 text-amber-950 border border-amber-300"
                      }`}
                    >
                      ৪. 🏆 ১৫ দিনের জাতীয় বিসিএস পরীক্ষা সেটআপ (২০০ MCQ)
                    </button>
                    <button
                      onClick={() => setAdminSection("qbank")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "qbank" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ৫. প্রশ্ন ব্যাংক আপলোড
                    </button>
                  </div>
                </div>

                {/* ADMIN SECTION 1: LECTURE UPLOADER */}
                {adminSection === "lectures" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                      <h3 className="text-xl font-extrabold">
                        {editingId ? "✏️ লেকচার আপডেট করুন" : "➕ নতুন লেকচার আপলোড করুন (ফন্ট +/- এবং ভিজ্যুয়াল ইমেজসহ)"}
                      </h3>

                      <form onSubmit={handleSaveLecture} className="space-y-6 text-sm">
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
                            <label className="font-extrabold block mb-1">লেকচার নম্বর (1, 2, 3...) *</label>
                            <input
                              type="number"
                              value={formData.lectureNo}
                              onChange={(e) => setFormData({ ...formData, lectureNo: e.target.value })}
                              className="w-full p-3 border rounded-xl bg-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">লেকচারের শিরোনাম (Title) *</label>
                          <input
                            type="text"
                            placeholder="যেমন: লেকচার ১: ধ্বনি ও বর্ণ প্রকরণ"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-xl font-semibold"
                          />
                        </div>

                        {/* 1. Main Lecture */}
                        <div className="p-5 rounded-2xl bg-blue-50/50 border-2 border-blue-200 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-extrabold text-base text-blue-950">📘 ১. মূল লেকচার নোট (PDF + Text View)</h4>
                            <label className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-blue-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.lectureTwoColumn}
                                onChange={(e) => setFormData({ ...formData, lectureTwoColumn: e.target.checked })}
                              />
                              <span>Text View ২-কলামে দেখান</span>
                            </label>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="লেকচার PDF-এর Google Drive লিংক অথবা ফাইল আপলোড করুন..."
                              value={formData.lecturePdfUrl}
                              onChange={(e) => setFormData({ ...formData, lecturePdfUrl: e.target.value })}
                              className="flex-1 p-2.5 border rounded-xl bg-white"
                            />
                            <label className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> মূল লেকচার PDF আপলোড
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "lecturePdfUrl")} className="hidden" />
                            </label>
                          </div>
                          <RichTextColorEditor
                            label="📝 মূল লেকচার নোট — Text View (+ / - ফন্ট সাইজ, কালার গ্রেডিং ও ভিজ্যুয়াল ইমেজ যুক্ত করুন)"
                            value={formData.mainContent}
                            onChange={(val) => setFormData({ ...formData, mainContent: val })}
                            placeholder="মূল লেকচার নোটের টেক্সট এখানে লিখুন..."
                            rows={5}
                          />
                        </div>

                        {/* 2. Chapter All MCQs */}
                        <div className="p-5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-extrabold text-base text-emerald-950">📗 ২. “এই Chapter-এর সকল MCQ” (PDF + ২-কলাম Text View)</h4>
                            <label className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.mcqTwoColumn}
                                onChange={(e) => setFormData({ ...formData, mcqTwoColumn: e.target.checked })}
                              />
                              <span>✓ ২-কলামে MCQ দেখান</span>
                            </label>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="সকল MCQ PDF লিংক অথবা ফাইল আপলোড করুন..."
                              value={formData.mcqPdfUrl}
                              onChange={(e) => setFormData({ ...formData, mcqPdfUrl: e.target.value })}
                              className="flex-1 p-2.5 border rounded-xl bg-white"
                            />
                            <label className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> সকল MCQ PDF আপলোড
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "mcqPdfUrl")} className="hidden" />
                            </label>
                          </div>
                          <RichTextColorEditor
                            label="📝 এই Chapter-এর সকল MCQ — Text View"
                            value={formData.mcqTextContent}
                            onChange={(val) => setFormData({ ...formData, mcqTextContent: val })}
                            placeholder="অধ্যায়ভিত্তিক সকল MCQ এখানে পেস্ট করুন..."
                            rows={5}
                          />
                        </div>

                        {/* 3. Written Q&A */}
                        <div className="p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-200 space-y-4">
                          <h4 className="font-extrabold text-base text-purple-950">📙 ৩. “লিখিত প্রশ্ন ও উত্তর” (PDF + Text View)</h4>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="লিখিত PDF লিংক অথবা ফাইল আপলোড করুন..."
                              value={formData.writtenPdfUrl}
                              onChange={(e) => setFormData({ ...formData, writtenPdfUrl: e.target.value })}
                              className="flex-1 p-2.5 border rounded-xl bg-white"
                            />
                            <label className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> লিখিত PDF আপলোড
                              <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "writtenPdfUrl")} className="hidden" />
                            </label>
                          </div>
                          <RichTextColorEditor
                            label="📝 লিখিত প্রশ্ন ও উত্তর — Text View"
                            value={formData.writtenTextContent}
                            onChange={(val) => setFormData({ ...formData, writtenTextContent: val })}
                            placeholder="লিখিত প্রশ্নোত্তর এখানে পেস্ট করুন..."
                            rows={4}
                          />
                        </div>

                        <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-base font-black hover:bg-black cursor-pointer shadow-lg">
                          {editingId ? "✓ আপডেট সেভ করুন" : "🚀 লেকচার পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">আপলোডকৃত লেকচার ({lectures.length}টি)</h4>
                      <div className="space-y-3 max-h-[800px] overflow-y-auto">
                        {lectures.map((lec) => {
                          const lKey = lec._id || lec.id;
                          return (
                            <div key={lKey} className="p-3.5 rounded-xl border bg-slate-50 space-y-2">
                              <div className="text-xs font-extrabold text-purple-800">
                                {lec.subjectId} · Lec {lec.lectureNo}
                              </div>
                              <div className="font-bold text-sm">{lec.title}</div>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditLectureClick(lec)} className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer">
                                  এডিট
                                </button>
                                <button onClick={() => handleDeleteLecture(lKey)} className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg cursor-pointer">
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

                {/* ================= ADMIN SECTION 2: STORY VOCABULARY BUILDER (WITH 2 VISUAL STORYBOOK IMAGES) ================= */}
                {adminSection === "vocab_stories" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-violet-200 space-y-5">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-900 text-xs font-extrabold">
                          English Grammar Special Feature
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          📖 গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি স্টোরি আপলোড করুন (২টি ভিজ্যুয়াল ইমেজসহ)
                        </h3>
                      </div>

                      <form onSubmit={handleSaveVocabStory} className="space-y-5 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="font-extrabold block mb-1">স্টোরি নম্বর *</label>
                            <input
                              type="number"
                              value={vocabFormData.storyNo}
                              onChange={(e) => setVocabFormData({ ...vocabFormData, storyNo: e.target.value })}
                              className="w-full p-3 border rounded-xl font-bold"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="font-extrabold block mb-1">গল্পের শিরোনাম (Story Title) *</label>
                            <input
                              type="text"
                              placeholder="যেমন: Story 01: দ্য লস্ট কিংডম ও ৫০টি হাই-ফ্রিকোয়েন্সি বিসিএস ভোকাবুলারি"
                              value={vocabFormData.title}
                              onChange={(e) => setVocabFormData({ ...vocabFormData, title: e.target.value })}
                              className="w-full p-3 border rounded-xl font-bold"
                            />
                          </div>
                        </div>

                        {/* 2 Storybook Visual Images Uploaders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-violet-50/60 border border-violet-200">
                          {/* Image 1 */}
                          <div className="p-3.5 bg-white rounded-xl border space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-xs text-violet-950">🖼️ স্টোরি ইমেজ ১ (Story Image 1)</span>
                              <select
                                value={vocabFormData.image1Position}
                                onChange={(e) => setVocabFormData({ ...vocabFormData, image1Position: e.target.value })}
                                className="text-xs font-bold border rounded px-2 py-1 bg-slate-50"
                              >
                                <option value="right">ডান পাশে (Right)</option>
                                <option value="left">বাম পাশে (Left)</option>
                                <option value="top">উপরে বড় (Top)</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              placeholder="ইমেজ ১-এর লিংক অথবা নিচে ফাইল নিন..."
                              value={vocabFormData.image1Url}
                              onChange={(e) => setVocabFormData({ ...vocabFormData, image1Url: e.target.value })}
                              className="w-full p-2 border rounded-lg text-xs"
                            />
                            <label className="w-full py-2 bg-violet-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" /> ইমেজ ১ আপলোড করুন
                              <input type="file" accept="image/*" onChange={(e) => handleVocabStoryImageUpload(e, "image1Url")} className="hidden" />
                            </label>
                          </div>

                          {/* Image 2 */}
                          <div className="p-3.5 bg-white rounded-xl border space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-xs text-violet-950">🖼️ স্টোরি ইমেজ ২ (Story Image 2)</span>
                              <select
                                value={vocabFormData.image2Position}
                                onChange={(e) => setVocabFormData({ ...vocabFormData, image2Position: e.target.value })}
                                className="text-xs font-bold border rounded px-2 py-1 bg-slate-50"
                              >
                                <option value="left">বাম পাশে (Left)</option>
                                <option value="right">ডান পাশে (Right)</option>
                                <option value="bottom">নিচে বড় (Bottom)</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              placeholder="ইমেজ ২-এর লিংক অথবা নিচে ফাইল নিন..."
                              value={vocabFormData.image2Url}
                              onChange={(e) => setVocabFormData({ ...vocabFormData, image2Url: e.target.value })}
                              className="w-full p-2 border rounded-lg text-xs"
                            />
                            <label className="w-full py-2 bg-violet-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" /> ইমেজ ২ আপলোড করুন
                              <input type="file" accept="image/*" onChange={(e) => handleVocabStoryImageUpload(e, "image2Url")} className="hidden" />
                            </label>
                          </div>
                        </div>

                        <RichTextColorEditor
                          label="📖 মূল গল্পের টেক্সট (ভোকাবুলারি শব্দগুলো সিলেক্ট করে কালার গ্রেডিং, বোল্ড ও ফন্ট +/- করুন)"
                          value={vocabFormData.storyContent}
                          onChange={(val) => setVocabFormData({ ...vocabFormData, storyContent: val })}
                          placeholder="এখানে গল্পটি লিখুন..."
                          rows={7}
                        />

                        <RichTextColorEditor
                          label="📝 শব্দের অর্থ ও Synonym/Antonym বক্স (গল্পের নিচে ২-কলামে দেখাবে)"
                          value={vocabFormData.wordMeaningBox}
                          onChange={(val) => setVocabFormData({ ...vocabFormData, wordMeaningBox: val })}
                          placeholder="গল্পে ব্যবহৃত ভোকাবুলারিগুলোর বাংলা অর্থ ও সিনোনিম এখানে দিন..."
                          rows={4}
                        />

                        <button type="submit" className="w-full py-4 bg-violet-800 text-white rounded-2xl text-base font-black hover:bg-violet-950 cursor-pointer shadow-lg">
                          {editingVocabId ? "✓ স্টোরি আপডেট করুন" : "🚀 ভোকাবুলারি স্টোরি পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">আপলোডকৃত ভোকাবুলারি স্টোরি ({vocabStories.length}টি)</h4>
                      {vocabStories.map((st) => {
                        const sId = st._id || st.id;
                        return (
                          <div key={sId} className="p-3.5 rounded-xl border bg-slate-50 space-y-2">
                            <div className="text-xs font-extrabold text-violet-700">Story #{st.storyNo}</div>
                            <div className="font-extrabold text-sm">{st.title}</div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingVocabId(sId);
                                  setVocabFormData({
                                    storyNo: st.storyNo,
                                    title: st.title,
                                    subtitle: st.subtitle || "",
                                    storyContent: st.storyContent || "",
                                    image1Url: st.image1Url || "",
                                    image1Position: st.image1Position || "right",
                                    image2Url: st.image2Url || "",
                                    image2Position: st.image2Position || "left",
                                    wordMeaningBox: st.wordMeaningBox || "",
                                  });
                                }}
                                className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                এডিট
                              </button>
                              <button onClick={() => handleDeleteVocabStory(sId)} className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ================= ADMIN SECTION 3: CHAPTER TEST 1 & TEST 2 (50 QUESTIONS) ================= */}
                {adminSection === "exam_builder" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
                    <h3 className="text-xl font-extrabold">
                      🎯 অধ্যায়ভিত্তিক MCQ পরীক্ষা সেট করুন (Test 1 = ৫০টি প্রশ্ন · Test 2 = ৫০টি প্রশ্ন)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">
                      <div>
                        <label className="font-extrabold block mb-1">১. Subject *</label>
                        <select
                          value={examBuilderMeta.subjectId}
                          onChange={(e) => setExamBuilderMeta({ ...examBuilderMeta, subjectId: e.target.value })}
                          className="w-full p-3 border rounded-xl bg-white font-extrabold"
                        >
                          {(adminCourseTrack === "bcs" ? bcsSubjects : defenseSubjects).map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">২. লেকচার নম্বর *</label>
                        <input
                          type="number"
                          min={1}
                          value={examBuilderMeta.lectureNo}
                          onChange={(e) => setExamBuilderMeta({ ...examBuilderMeta, lectureNo: Number(e.target.value) })}
                          className="w-full p-3 border rounded-xl bg-white font-extrabold"
                        />
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">৩. Chapter / Lecture Name *</label>
                        <input
                          type="text"
                          value={examBuilderMeta.chapterName}
                          onChange={(e) => setExamBuilderMeta({ ...examBuilderMeta, chapterName: e.target.value })}
                          className="w-full p-3 border rounded-xl bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">৪. টেস্ট নম্বর *</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setExamBuilderMeta({ ...examBuilderMeta, testNumber: 1 })}
                            className={`py-3 rounded-xl font-black text-xs cursor-pointer ${
                              examBuilderMeta.testNumber === 1 ? "bg-slate-900 text-white" : "bg-white border"
                            }`}
                          >
                            Test 1 (৫০টি)
                          </button>
                          <button
                            type="button"
                            onClick={() => setExamBuilderMeta({ ...examBuilderMeta, testNumber: 2 })}
                            className={`py-3 rounded-xl font-black text-xs cursor-pointer ${
                              examBuilderMeta.testNumber === 2 ? "bg-slate-900 text-white" : "bg-white border"
                            }`}
                          >
                            Test 2 (৫০টি)
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 bg-slate-100 p-3 rounded-xl">
                      {["1-10", "11-20", "21-30", "31-40", "41-50", "ALL"].map((rng) => (
                        <button
                          key={rng}
                          type="button"
                          onClick={() => setActiveSlotRange(rng)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer ${
                            activeSlotRange === rng ? "bg-slate-900 text-white" : "bg-white border"
                          }`}
                        >
                          প্রশ্ন {rng}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handlePublishExamSet} className="space-y-4">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {template50Questions
                          .filter((item) => {
                            if (activeSlotRange === "ALL") return true;
                            const [min, max] = activeSlotRange.split("-").map(Number);
                            return item.qNo >= min && item.qNo <= max;
                          })
                          .map((slot) => (
                            <div key={slot.qNo} className="p-4 rounded-2xl border bg-slate-50 space-y-2.5">
                              <span className="px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-black">
                                প্রশ্ন #{slot.qNo}
                              </span>
                              <input
                                type="text"
                                placeholder={`প্রশ্ন #${slot.qNo} লিখুন...`}
                                value={slot.question}
                                onChange={(e) => updateTemplateSlot(slot.qNo, "question", e.target.value)}
                                className="w-full p-2.5 border rounded-xl bg-white text-sm font-bold"
                              />
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {["ক", "খ", "গ", "ঘ"].map((lbl, idx) => (
                                  <input
                                    key={idx}
                                    type="text"
                                    placeholder={`অপশন ${lbl}`}
                                    value={slot.options[idx]}
                                    onChange={(e) => updateTemplateSlot(slot.qNo, "options", e.target.value, idx)}
                                    className="p-2 border rounded-xl bg-white text-xs font-semibold"
                                  />
                                ))}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <select
                                  value={slot.correctAnswer}
                                  onChange={(e) => updateTemplateSlot(slot.qNo, "correctAnswer", Number(e.target.value))}
                                  className="p-2 border rounded-xl bg-white text-xs font-extrabold"
                                >
                                  <option value={0}>সঠিক: ক</option>
                                  <option value={1}>সঠিক: খ</option>
                                  <option value={2}>সঠিক: গ</option>
                                  <option value={3}>সঠিক: ঘ</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="ভুল উত্তরের ব্যাখ্যা..."
                                  value={slot.explanation}
                                  onChange={(e) => updateTemplateSlot(slot.qNo, "explanation", e.target.value)}
                                  className="sm:col-span-2 p-2 border rounded-xl bg-white text-xs"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                      <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-base font-black cursor-pointer">
                        🚀 Publish Test {examBuilderMeta.testNumber}
                      </button>
                    </form>
                  </div>
                )}

                {/* ================= ADMIN SECTION 4: 15-DAY 200-MCQ NATIONAL BCS CONTEST BUILDER ================= */}
                {adminSection === "biweekly_200" && (
                  <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 space-y-5">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black">
                        প্রতি ১৫ দিনে ১টি জাতীয় পরীক্ষা · ২০০টি MCQ প্রশ্ন
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                        🏆 বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড প্রিলিমিনারি পরীক্ষা সেটআপ (১ - ২০০ নম্বর প্রশ্ন)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        প্রতিটি প্রশ্নের পাশে ক্যাটাগরি (<strong>General / English / Math</strong>) সিলেক্ট করতে পারবেন, যা লিডারবোর্ডে সমান নম্বর পাওয়া স্টুডেন্টদের টাই-ব্রেকিং করতে ব্যবহৃত হবে।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm">
                      <div className="sm:col-span-2">
                        <label className="font-extrabold block mb-1">পরীক্ষার শিরোনাম *</label>
                        <input
                          type="text"
                          value={contestBuilderMeta.title}
                          onChange={(e) => setContestBuilderMeta({ ...contestBuilderMeta, title: e.target.value })}
                          className="w-full p-3 border rounded-xl bg-white font-bold"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 p-3 rounded-xl bg-white border w-full cursor-pointer font-extrabold text-xs text-rose-700">
                          <input
                            type="checkbox"
                            checked={contestBuilderMeta.resetSubmissions}
                            onChange={(e) =>
                              setContestBuilderMeta({ ...contestBuilderMeta, resetSubmissions: e.target.checked })
                            }
                          />
                          <span>নতুন ১৫ দিনের পর্ব শুরু করুন (আগের লিডারবোর্ড রিসেট)</span>
                        </label>
                      </div>
                    </div>

                    {/* Range Filter for 200 Questions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-3 rounded-xl">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "1-25",
                          "26-50",
                          "51-75",
                          "76-100",
                          "101-125",
                          "126-150",
                          "151-175",
                          "176-200",
                        ].map((rng) => (
                          <button
                            key={rng}
                            type="button"
                            onClick={() => setActive200Range(rng)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                              active200Range === rng ? "bg-slate-900 text-white" : "bg-white border"
                            }`}
                          >
                            প্রশ্ন {rng}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-900">
                        পূরণকৃত প্রশ্ন: {template200Questions.filter((q) => q.question.trim() !== "").length} / ২০০টি
                      </span>
                    </div>

                    <form onSubmit={handlePublish200Contest} className="space-y-4">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {template200Questions
                          .filter((item) => {
                            const [min, max] = active200Range.split("-").map(Number);
                            return item.qNo >= min && item.qNo <= max;
                          })
                          .map((slot) => (
                            <div key={slot.qNo} className="p-4 rounded-2xl border bg-slate-50 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="px-3 py-1 rounded-lg bg-slate-900 text-amber-300 text-xs font-black">
                                  জাতীয় পরীক্ষা · প্রশ্ন #{slot.qNo}
                                </span>
                                <select
                                  value={slot.category}
                                  onChange={(e) => update200TemplateSlot(slot.qNo, "category", e.target.value)}
                                  className="px-3 py-1 rounded-lg border bg-white text-xs font-extrabold text-purple-900"
                                >
                                  <option value="general">সাধারণ বিষয় (General)</option>
                                  <option value="english">ইংরেজি (English — Tie-Breaker 1)</option>
                                  <option value="math">গণিত (Math — Tie-Breaker 2)</option>
                                </select>
                              </div>

                              <input
                                type="text"
                                placeholder={`প্রশ্ন #${slot.qNo} এখানে লিখুন...`}
                                value={slot.question}
                                onChange={(e) => update200TemplateSlot(slot.qNo, "question", e.target.value)}
                                className="w-full p-2.5 border rounded-xl bg-white text-sm font-bold"
                              />

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {["ক", "খ", "গ", "ঘ"].map((lbl, idx) => (
                                  <input
                                    key={idx}
                                    type="text"
                                    placeholder={`অপশন ${lbl}`}
                                    value={slot.options[idx]}
                                    onChange={(e) => update200TemplateSlot(slot.qNo, "options", e.target.value, idx)}
                                    className="p-2 border rounded-xl bg-white text-xs font-semibold"
                                  />
                                ))}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <select
                                  value={slot.correctAnswer}
                                  onChange={(e) => update200TemplateSlot(slot.qNo, "correctAnswer", Number(e.target.value))}
                                  className="p-2 border rounded-xl bg-white text-xs font-extrabold text-emerald-800"
                                >
                                  <option value={0}>সঠিক উত্তর: ক</option>
                                  <option value={1}>সঠিক উত্তর: খ</option>
                                  <option value={2}>সঠিক উত্তর: গ</option>
                                  <option value={3}>সঠিক উত্তর: ঘ</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="ভুল উত্তরের ব্যাখ্যা লিখুন..."
                                  value={slot.explanation}
                                  onChange={(e) => update200TemplateSlot(slot.qNo, "explanation", e.target.value)}
                                  className="sm:col-span-2 p-2 border rounded-xl bg-white text-xs"
                                />
                              </div>
                            </div>
                          ))}
                      </div>

                      <button type="submit" className="w-full py-4 bg-amber-400 text-slate-950 rounded-2xl text-base font-black hover:bg-amber-300 cursor-pointer shadow-lg">
                        🚀 ১৫ দিনের জাতীয় বিসিএস পরীক্ষা (২০০ MCQ) Publish করুন
                      </button>
                    </form>
                  </div>
                )}

                {/* ADMIN SECTION 5: QUESTION BANK */}
                {adminSection === "qbank" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
                    <h3 className="text-xl font-extrabold">প্রশ্ন ব্যাংক আপলোড (PDF + Color Text View)</h3>
                    <form onSubmit={handleSaveQbankDoc} className="space-y-4 text-sm">
                      <input
                        type="text"
                        placeholder="প্রশ্ন ব্যাংকের শিরোনাম *"
                        value={qbFormData.title}
                        onChange={(e) => setQbFormData({ ...qbFormData, title: e.target.value })}
                        className="w-full p-3 border rounded-xl font-bold"
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="PDF লিংক..."
                          value={qbFormData.pdfUrl}
                          onChange={(e) => setQbFormData({ ...qbFormData, pdfUrl: e.target.value })}
                          className="flex-1 p-2.5 border rounded-xl"
                        />
                        <label className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-4 h-4" /> PDF ফাইল নিন
                          <input type="file" accept="application/pdf" onChange={(e) => handleAdminPdfFileSelect(e, "pdfUrl", true)} className="hidden" />
                        </label>
                      </div>
                      <RichTextColorEditor
                        label="📝 প্রশ্ন ব্যাংক — Text View"
                        value={qbFormData.textContent}
                        onChange={(val) => setQbFormData({ ...qbFormData, textContent: val })}
                        placeholder="প্রশ্ন ব্যাংকের টেক্সট এখানে লিখুন..."
                        rows={5}
                      />
                      <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-extrabold cursor-pointer">
                        🚀 প্রশ্ন ব্যাংক পাবলিশ করুন
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FULLSCREEN PDF VIEWER MODAL */}
      {isPdfFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="h-14 px-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="font-extrabold text-sm truncate">
              📄 {activeTab === "qbank" ? activeQbankDoc?.title : activeLecture?.title} — ফুলস্ক্রিন ভিউ
            </div>
            <button onClick={() => setIsPdfFullscreen(false)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-extrabold cursor-pointer">
              <Minimize2 className="w-4 h-4 inline mr-1" /> বন্ধ করুন
            </button>
          </div>
          <div className="flex-1 bg-white">
            <iframe
              src={formatSecurePdfUrl(
                activeTab === "qbank"
                  ? activeQbankDoc?.pdfUrl
                  : activePdfStep === "mcq_pdf"
                  ? activeLecture?.mcqPdfUrl
                  : activePdfStep === "written_pdf"
                  ? activeLecture?.writtenPdfUrl
                  : activeLecture?.lecturePdfUrl
              )}
              className="w-full h-full border-0"
              title="Fullscreen PDF"
            />
          </div>
        </div>
      )}

      {/* STUDENT PROFILE MODAL */}
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