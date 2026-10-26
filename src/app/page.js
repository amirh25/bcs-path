"use client";

/**
 * ============================================================================
 * FILE: src/app/page.js
 * PROJECT: BCS Path — Full-Stack Multi-Course EdTech Platform
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, CheckCircle2, Sparkles, Trash2, Clock, ShieldCheck,
  KeyRound, Camera, Building2, FileText, HelpCircle, PenTool,
  RotateCcw, Upload, ChevronRight, ArrowLeft, Maximize2, Minimize2,
  PanelLeftClose, PanelLeftOpen, CheckSquare, Edit3, PlayCircle,
  Shield, Award, LayoutGrid, Check, Columns, Type, Plus, Minus,
  Image as ImageIcon, Trophy, Flame, Calendar, Phone, UserCheck,
  FileSpreadsheet, AlertCircle, Filter
} from "lucide-react";
import { initialSubjects } from "../data/bcsData";

/**
 * ============================================================================
 * EXTENDED BCS SUBJECTS (12 SUBJECTS INCLUDING BANGLA & ENGLISH GRAMMAR)
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
 * HELPER UTILITIES
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

/**
 * Renders Clean Short Image Tokens like {{IMG_1:right}} into real <img> tags
 * so the Admin editor never gets cluttered with huge Base64 strings!
 */
function renderRichTextWithShortImageTokens(htmlText, embeddedImages = {}) {
  if (!htmlText) return "";
  return htmlText.replace(/\{\{(IMG_\d+):(left|right|top|bottom)\}\}/g, (match, imgKey, align) => {
    const src = embeddedImages?.[imgKey];
    if (!src) return "";
    let styleStr =
      "max-width:260px;width:100%;border-radius:12px;border:2px solid #cbd5e1;margin:8px 0;";
    if (align === "left") {
      styleStr =
        "float:left;max-width:240px;width:45%;margin:4px 16px 10px 0;border-radius:12px;border:2px solid #cbd5e1;";
    } else if (align === "right") {
      styleStr =
        "float:right;max-width:240px;width:45%;margin:4px 0 10px 16px;border-radius:12px;border:2px solid #cbd5e1;";
    } else if (align === "top" || align === "bottom") {
      styleStr =
        "display:block;max-width:440px;width:100%;margin:14px auto;border-radius:14px;border:2px solid #cbd5e1;clear:both;";
    }
    return `<img src="${src}" alt="Visual Illustration" style="${styleStr}" />`;
  });
}

/**
 * ============================================================================
 * 10-DAY EXAM SCHEDULE CALCULATOR (10th, 20th, and 28th/29th/30th of every month)
 * ============================================================================
 */
function getNext10DayExamTargetDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // If month has 28 days -> 28th; 29 days -> 29th; 30 or 31 days -> 30th
  const thirdExamDay = daysInMonth < 30 ? daysInMonth : 30;

  const candidateDays = [10, 20, thirdExamDay];
  for (const d of candidateDays) {
    // Exam scheduled at 8:00 PM (20:00) on the target date
    const target = new Date(year, month, d, 23, 59, 59);
    if (now < target) {
      return {
        targetDate: target,
        scheduleLabel: `চলমান মাসের ${d} তারিখের পরীক্ষা (মাসে ৩টি: ১০, ২০ এবং ${thirdExamDay} তারিখ)`,
      };
    }
  }
  // Otherwise next exam is the 10th of next month
  const nextMonth10 = new Date(year, month + 1, 10, 23, 59, 59);
  return {
    targetDate: nextMonth10,
    scheduleLabel: `আগামী মাসের ১০ তারিখের পরীক্ষা (প্রতি মাসের ১০, ২০ ও শেষ তারিখ)`,
  };
}

/**
 * ============================================================================
 * SMART BULK QUESTION PARSER (Supports JSON or Plain Text / Doc Copy-Paste!)
 * Automatically fills slots 1 to 200 (or 1 to 50) from structured text or JSON.
 * Supported Plain Text Format per question block:
 *   Q: প্রশ্নটি এখানে?
 *   A: অপশন ক
 *   B: অপশন খ
 *   C: অপশন গ
 *   D: অপশন ঘ
 *   Ans: A (or ক / 1 / 0)
 *   Exp: ভুল উত্তরের ব্যাখ্যা এখানে
 * ============================================================================
 */
function parseBulkQuestionsTextOrJson(rawText, maxSlots = 200) {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  // 1. Try JSON Array first
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      if (Array.isArray(arr)) {
        return arr.slice(0, maxSlots).map((item, idx) => ({
          qNo: Number(item.qNo || idx + 1),
          question: item.question || "",
          options:
            item.options?.length === 4
              ? item.options
              : [item.opt0 || "", item.opt1 || "", item.opt2 || "", item.opt3 || ""],
          correctAnswer: Number(item.correctAnswer || 0),
          explanation: item.explanation || "",
        }));
      }
    } catch (e) {}
  }

  // 2. Smart Text / Docx Copy-Paste Parser (Blocks separated by blank lines)
  const blocks = trimmed.split(/\n\s*\n/).filter((b) => b.trim().length > 5);
  const parsedList = [];

  blocks.forEach((block, idx) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return;

    let questionText = lines[0].replace(/^(Q\d*[:.)]|প্রশ্ন\s*\d*[:.)]|\d+[.)])\s*/i, "").trim();
    let opts = ["", "", "", ""];
    let correctIdx = 0;
    let explanation = "";

    lines.slice(1).forEach((line) => {
      if (/^(A|ক|1)[.):\s]/i.test(line)) {
        opts[0] = line.replace(/^(A|ক|1)[.):\s]+/i, "").trim();
      } else if (/^(B|খ|2)[.):\s]/i.test(line)) {
        opts[1] = line.replace(/^(B|খ|2)[.):\s]+/i, "").trim();
      } else if (/^(C|গ|3)[.):\s]/i.test(line)) {
        opts[2] = line.replace(/^(C|গ|3)[.):\s]+/i, "").trim();
      } else if (/^(D|ঘ|4)[.):\s]/i.test(line)) {
        opts[3] = line.replace(/^(D|ঘ|4)[.):\s]+/i, "").trim();
      } else if (/^(Ans|Answer|সঠিক|উত্তর)[:\s]/i.test(line)) {
        const val = line.replace(/^(Ans|Answer|সঠিক|উত্তর)[:\s]+/i, "").trim().toUpperCase();
        if (val.startsWith("B") || val.startsWith("খ") || val === "2" || val === "1") {
          correctIdx = val === "1" ? 1 : 1;
        }
        if (val.startsWith("A") || val.startsWith("ক") || val === "0") correctIdx = 0;
        else if (val.startsWith("B") || val.startsWith("খ")) correctIdx = 1;
        else if (val.startsWith("C") || val.startsWith("গ")) correctIdx = 2;
        else if (val.startsWith("D") || val.startsWith("ঘ")) correctIdx = 3;
      } else if (/^(Exp|Explanation|ব্যাখ্যা)[:\s]/i.test(line)) {
        explanation = line.replace(/^(Exp|Explanation|ব্যাখ্যা)[:\s]+/i, "").trim();
      }
    });

    if (questionText) {
      parsedList.push({
        qNo: idx + 1,
        question: questionText,
        options: opts,
        correctAnswer: correctIdx,
        explanation,
      });
    }
  });

  return parsedList.slice(0, maxSlots);
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
  const defaultBlockSubjects = [
    { id: "bangla", title: "বাংলা ভাষা ও সাহিত্য", cat: "general" },
    { id: "english", title: "ইংরেজি ভাষা ও সাহিত্য", cat: "english" },
    { id: "bangladesh", title: "বাংলাদেশ বিষয়াবলি", cat: "general" },
    { id: "international", title: "আন্তর্জাতিক বিষয়াবলি", cat: "general" },
    { id: "science", title: "সাধারণ বিজ্ঞান", cat: "general" },
    { id: "ict", title: "কম্পিউটার ও তথ্য প্রযুক্তি", cat: "general" },
    { id: "math", title: "গাণিতিক যুক্তি", cat: "math" },
    { id: "mental", title: "মানসিক দক্ষতা ও নৈতিকতা", cat: "general" },
  ];

  return Array.from({ length: 200 }, (_, idx) => {
    const qNo = idx + 1;
    const blockIdx = Math.min(7, Math.floor((qNo - 1) / 25));
    const subInfo = defaultBlockSubjects[blockIdx];
    return {
      qNo,
      subjectId: subInfo.id,
      subjectTitle: subInfo.title,
      category: subInfo.cat,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
  });
}

/**
 * ============================================================================
 * COMPONENT: UPGRADED ADMIN RICH TEXT EDITOR
 * Fixes:
 * 1. Preserves exact scroll position (scrollTop) & selection when applying color/font!
 * 2. Uses Clean Short Image Tokens {{IMG_1:right}} instead of huge Base64 strings!
 * 3. Includes visible Drag & Drop Image Zone + Thumbnail Strip!
 * ============================================================================
 */
function RichTextColorEditor({
  label,
  value,
  onChange,
  embeddedImages = {},
  onUpdateImages,
  placeholder,
  rows = 6,
}) {
  const textareaRef = useRef(null);
  const [fontSizePx, setFontSizePx] = useState(18);
  const [imgAlign, setImgAlign] = useState("right");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Preserves scrollTop and selection range so textarea NEVER jumps to the bottom!
  const applyFormattingWithoutScrollJump = (openTag, closeTag) => {
    const el = textareaRef.current;
    if (!el) return;
    const savedScrollTop = el.scrollTop;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end) || "এখানে লিখুন";
    const updated =
      value.substring(0, start) + openTag + selectedText + closeTag + value.substring(end);

    onChange(updated);

    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      el.scrollTop = savedScrollTop;
      el.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    });
  };

  const handleFontSizeStep = (delta) => {
    const nextSize = Math.min(34, Math.max(13, fontSizePx + delta));
    setFontSizePx(nextSize);
    applyFormattingWithoutScrollJump(
      `<span style="font-size:${nextSize}px;line-height:1.6;font-weight:700;">`,
      `</span>`
    );
  };

  // Stores Base64 inside embeddedImages dictionary and only inserts short {{IMG_1:right}} tag!
  const handleAddShortTokenImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("⚠️ শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WEBP) গ্রহণযোগ্য!");
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      alert("⚠️ ছবির সাইজ ২.৫ মেগাবাইটের কম হতে হবে!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const nextIndex = Object.keys(embeddedImages || {}).length + 1;
      const tokenKey = `IMG_${nextIndex}`;
      const tokenString = `\n{{${tokenKey}:${imgAlign}}}\n`;

      if (onUpdateImages) {
        onUpdateImages({ ...(embeddedImages || {}), [tokenKey]: reader.result });
      }

      const el = textareaRef.current;
      const savedScrollTop = el ? el.scrollTop : 0;
      const pos = el ? el.selectionStart : value.length;
      const nextText = value.substring(0, pos) + tokenString + value.substring(pos);
      onChange(nextText);

      if (el) {
        requestAnimationFrame(() => {
          el.focus({ preventScroll: true });
          el.scrollTop = savedScrollTop;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-2xs">
      <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-200 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-extrabold text-xs sm:text-sm text-slate-900">{label}</span>

          {/* Visual Image Dropzone & Position Controls */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              const file = e.dataTransfer?.files?.[0];
              if (file) handleAddShortTokenImage(file);
            }}
            className={`flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-dashed transition ${
              isDraggingOver
                ? "border-purple-600 bg-purple-100"
                : "border-purple-300 bg-white"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-700" />
            <span className="text-[11px] font-extrabold text-slate-700">
              ইমেজ পজিশন:
            </span>
            <select
              value={imgAlign}
              onChange={(e) => setImgAlign(e.target.value)}
              className="text-xs font-extrabold text-purple-900 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200 outline-none"
            >
              <option value="right">ডানে (Side Right)</option>
              <option value="left">বামে (Side Left)</option>
              <option value="top">উপরে (Top)</option>
              <option value="bottom">নিচে (Bottom)</option>
            </select>

            <label className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-extrabold cursor-pointer hover:bg-purple-800 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> ইমেজ নিন বা এখানে Drag করুন
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAddShortTokenImage(e.target.files?.[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyFormattingWithoutScrollJump("<b>", "</b>")}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-black hover:bg-slate-200 cursor-pointer"
          >
            B (বোল্ড)
          </button>

          <div className="inline-flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => handleFontSizeStep(-2)}
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
              className="px-2.5 py-1 hover:bg-slate-200 text-slate-900 font-black text-xs flex items-center gap-0.5 border-l border-slate-200 cursor-pointer"
            >
              <Type className="w-3.5 h-3.5" /> <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              applyFormattingWithoutScrollJump('<span style="color:#dc2626;font-weight:700;">', "</span>")
            }
            className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🔴 লাল টেক্সট
          </button>
          <button
            type="button"
            onClick={() =>
              applyFormattingWithoutScrollJump('<span style="color:#2563eb;font-weight:700;">', "</span>")
            }
            className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🔵 নীল টেক্সট
          </button>
          <button
            type="button"
            onClick={() =>
              applyFormattingWithoutScrollJump('<span style="color:#059669;font-weight:700;">', "</span>")
            }
            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟢 সবুজ টেক্সট
          </button>

          <button
            type="button"
            onClick={() =>
              applyFormattingWithoutScrollJump(
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
              applyFormattingWithoutScrollJump(
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
              applyFormattingWithoutScrollJump(
                '<div style="background:#dbeafe;border-left:4px solid #3b82f6;padding:10px 14px;border-radius:8px;margin:8px 0;color:#1e3a8a;font-weight:600;clear:both;">',
                "</div>"
              )
            }
            className="px-2.5 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟦 নীল বক্স
          </button>
        </div>

        {/* Clean Thumbnail Preview Strip for Uploaded Short-Token Images */}
        {Object.keys(embeddedImages || {}).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-extrabold text-purple-800">যুক্তকৃত শর্ট-ট্যাগ ইমেজ:</span>
            {Object.entries(embeddedImages).map(([key, src]) => (
              <div
                key={key}
                className="inline-flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-purple-200 text-[11px] font-bold"
              >
                <img src={src} alt={key} className="w-6 h-6 rounded object-cover" />
                <span className="text-purple-900">{`{{${key}}}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const file = e.dataTransfer?.files?.[0];
          if (file && file.type.startsWith("image/")) {
            e.preventDefault();
            handleAddShortTokenImage(file);
          }
        }}
        placeholder={`${placeholder} (ইমেজ যুক্ত করলে {{IMG_1:right}} এরকম ছোট ট্যাগ বসবে, ফলে লেখা হিজিবিজি হবে না)`}
        className="w-full p-3.5 text-sm text-slate-900 outline-none leading-relaxed font-medium"
      />
    </div>
  );
}

/**
 * ============================================================================
 * COMPONENT: MINI 2D EXECUTIVE AVATAR
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
 * COMPONENT: FULL 2D EXECUTIVE STUDENT AVATAR
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

  // Student Profile State
  const fileInputRef = useRef(null);
  const [studentUniqueKey, setStudentUniqueKey] = useState("student_default");
  const [profile, setProfile] = useState({
    name: "Hamza",
    phone: "",
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

  // ================= 10-DAY NATIONAL BCS 200-MCQ EXAM, COUNTDOWN & REGISTRATION STATE =================
  const [countdownParts, setCountdownParts] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    label: "",
  });
  const [showContestRegModal, setShowContestRegModal] = useState(false);
  const [contestRegForm, setContestRegForm] = useState({
    name: "",
    phone: "",
    institution: "",
  });
  const [isRegisteredForContest, setIsRegisteredForContest] = useState(false);
  const [isContestRoomActive, setIsContestRoomActive] = useState(false);
  const [contestAnswers, setContestAnswers] = useState({});
  const [contestTimeLeft, setContestTimeLeft] = useState(0);
  const [contestSubmitting, setContestSubmitting] = useState(false);

  // Live 10-Day Countdown Timer (10th, 20th, and 28th/29th/30th of every month)
  useEffect(() => {
    const updateCountdown = () => {
      const { targetDate, scheduleLabel } = getNext10DayExamTargetDate();
      const diffMs = Math.max(0, targetDate.getTime() - Date.now());
      const totalSec = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      setCountdownParts({ days, hours, minutes, seconds, label: scheduleLabel });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Admin CMS State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminCourseTrack, setAdminCourseTrack] = useState("bcs");
  const [adminSection, setAdminSection] = useState("lectures");
  const [adminLectureFilterSubject, setAdminLectureFilterSubject] = useState("ALL"); // Filter uploaded lectures by Subject!
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
    embeddedImages: {},
    mcqTwoColumn: true,
    lectureTwoColumn: false,
    writtenTwoColumn: false,
  });

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
    embeddedImages: {},
  });
  const [editingVocabId, setEditingVocabId] = useState(null);

  const [qbFormData, setQbFormData] = useState({
    courseType: "bcs",
    subjectId: "bangla",
    bcsBatch: "১০ম - ৪৬তম বিসিএস",
    title: "",
    pdfUrl: "",
    textContent: "",
    highlightBox: "",
    twoColumn: true,
    embeddedImages: {},
  });
  const [editingQbId, setEditingQbId] = useState(null);

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
  const [bulk50TextInput, setBulk50TextInput] = useState("");

  // Admin 200-Question National Contest Builder + Bulk Parser + 25-Question Subject Selector
  const [contestBuilderMeta, setContestBuilderMeta] = useState({
    contestId: "bcs-biweekly-main",
    title: "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
    examWindowText: "প্রতি ১০ দিনে ১টি জাতীয় মেধা যাচাই পরীক্ষা (১০, ২০ ও মাসের শেষ তারিখ) · পাস মার্ক ৬০%",
    resetSubmissions: false,
  });
  const [template200Questions, setTemplate200Questions] = useState(() =>
    createEmpty200QuestionsTemplate()
  );
  const [active200Range, setActive200Range] = useState("1-25");
  const [bulk200TextInput, setBulk200TextInput] = useState("");

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
                  subjectId: found.subjectId || slot.subjectId,
                  subjectTitle: found.subjectTitle || slot.subjectTitle,
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
        setContestRegForm({
          name: parsed.name || "",
          phone: parsed.phone || "",
          institution: parsed.institution || "",
        });
      } catch (e) {}
    }

    const savedReg = localStorage.getItem("bcs_10day_contest_registered");
    if (savedReg === "true") setIsRegisteredForContest(true);

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
          payload: { ...newProf, phone: newProf.phone || studentUniqueKey },
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
   * CHAPTER TEST 1 & TEST 2 ENGINE
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
   * 10-DAY NATIONAL 200-MCQ COMBINED BCS EXAM, REGISTRATION & SUBJECT WEAKNESS
   * ==========================================================================
   */
  const currentActiveContest = contests[0] || null;
  const myContestSubmission = currentActiveContest?.submissions?.find(
    (sub) =>
      sub.studentKey === studentUniqueKey ||
      (profile.phone && sub.phone === profile.phone)
  );

  // Tie-Breaking Leaderboard Sort: Total Score -> English Score -> Math Score
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

  // Step 1: Student Clicks "Register & Start Exam"
  const handleContestRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!contestRegForm.name.trim() || !contestRegForm.phone.trim() || !contestRegForm.institution.trim()) {
      alert("⚠️ পরীক্ষায় অংশগ্রহণের জন্য আপনার নাম, মোবাইল নম্বর এবং শিক্ষাপ্রতিষ্ঠানের নাম পূরণ করুন!");
      return;
    }

    updateProfile({
      name: contestRegForm.name.trim(),
      phone: contestRegForm.phone.trim(),
      institution: contestRegForm.institution.trim(),
    });

    try {
      await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REGISTER_CONTEST_EXAM",
          payload: {
            contestId: currentActiveContest?.contestId || "bcs-biweekly-main",
            studentKey: studentUniqueKey,
            phone: contestRegForm.phone.trim(),
            name: contestRegForm.name.trim(),
            institution: contestRegForm.institution.trim(),
          },
        }),
      });
    } catch (err) {}

    localStorage.setItem("bcs_10day_contest_registered", "true");
    setIsRegisteredForContest(true);
    setShowContestRegModal(false);

    // Immediately open the Exam UI after registration if questions are published!
    if (currentActiveContest && currentActiveContest.questions?.length > 0 && !myContestSubmission) {
      setContestAnswers({});
      setContestTimeLeft(currentActiveContest.questions.length * 36);
      setIsContestRoomActive(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!currentActiveContest?.questions?.length) {
      alert("✅ আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে! অ্যাডমিন প্রশ্ন পাবলিশ করলেই পরীক্ষা শুরু হবে।");
    }
  };

  const handleOpenOrStart10DayContest = () => {
    if (myContestSubmission) {
      alert("ℹ️ আপনি ইতিমধ্যে এই ১০ দিনের জাতীয় পরীক্ষায় অংশ নিয়েছেন! নিচে আপনার স্থায়ী মেরিট পজিশন, বিষয়ভিত্তিক নম্বর ও ভুল উত্তরের ব্যাখ্যা দেখুন।");
      return;
    }
    if (!isRegisteredForContest || !profile.phone) {
      setContestRegForm({
        name: profile.name || "",
        phone: profile.phone || "",
        institution: profile.institution || "",
      });
      setShowContestRegModal(true);
      return;
    }
    if (!currentActiveContest || !currentActiveContest.questions?.length) {
      alert("⚠️ অ্যাডমিন প্যানেল থেকে এখনো এই পর্বের ২০০টি প্রশ্ন প্রকাশ করা হয়নি!");
      return;
    }
    setContestAnswers({});
    setContestTimeLeft(currentActiveContest.questions.length * 36);
    setIsContestRoomActive(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit 200-MCQ Contest with Subject-wise Breakdown & Weakness Detection!
  const submitBiWeeklyContestExam = async () => {
    if (!currentActiveContest || contestSubmitting) return;
    setContestSubmitting(true);

    let correct = 0;
    let wrong = 0;
    let engScore = 0;
    let mathScore = 0;
    const subMap = {};

    currentActiveContest.questions.forEach((q, idx) => {
      const qKey = q.qNo || idx + 1;
      const ans = contestAnswers[qKey];
      const subId = q.subjectId || "general";
      const subTitle =
        q.subjectTitle ||
        bcsSubjects.find((s) => s.id === subId)?.title ||
        "সাধারণ বিষয়";

      if (!subMap[subId]) {
        subMap[subId] = {
          subjectId: subId,
          subjectTitle: subTitle,
          total: 0,
          correct: 0,
          wrong: 0,
          marks: 0,
        };
      }
      subMap[subId].total += 1;

      const isEng =
        q.category === "english" ||
        subId === "english" ||
        subId === "english_grammar";
      const isMath = q.category === "math" || subId === "math";

      if (ans !== undefined) {
        if (Number(ans) === Number(q.correctAnswer)) {
          correct += 1;
          subMap[subId].correct += 1;
          subMap[subId].marks += 1;
          if (isEng) engScore += 1;
          if (isMath) mathScore += 1;
        } else {
          wrong += 1;
          subMap[subId].wrong += 1;
          subMap[subId].marks -= 0.5;
          if (isEng) engScore -= 0.5;
          if (isMath) mathScore -= 0.5;
        }
      }
    });

    const subjectBreakdown = Object.values(subMap).map((s) => ({
      ...s,
      marks: +Math.max(0, s.marks).toFixed(2),
    }));

    // Identify Weak Subjects (where student got < 50% marks or made >= 2 wrong answers)
    const weakSubjects = subjectBreakdown
      .filter((s) => s.wrong > 0 && (s.marks / s.total < 0.5 || s.wrong >= 2))
      .map((s) => `${s.subjectTitle} (ভুল: ${s.wrong}টি)`);

    const negativePenalty = wrong * 0.5;
    const totalScore = Math.max(0, +(correct - negativePenalty).toFixed(2));

    const submissionPayload = {
      studentKey: studentUniqueKey,
      phone: profile.phone || contestRegForm.phone || "",
      name: profile.name || "বিসিএস পরীক্ষার্থী",
      institution: profile.hideProfile ? "" : profile.institution || "স্বতন্ত্র পরীক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      totalScore,
      englishScore: +engScore.toFixed(2),
      mathScore: +mathScore.toFixed(2),
      correctCount: correct,
      wrongCount: wrong,
      negativePenalty,
      subjectBreakdown,
      weakSubjects,
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
   * ADMIN CRUD HANDLERS & BULK 200-QUESTION IMPORTER
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
        embeddedImages: {},
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
      alert(editingVocabId ? "✅ ভোকাবুলারি স্টোরি আপডেট হয়েছে!" : "🎉 নতুন ভোকাবুলারি স্টোরি পাবলিশ হয়েছে!");
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
        embeddedImages: {},
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
      setQbFormData((prev) => ({ ...prev, title: "", pdfUrl: "", textContent: "", highlightBox: "", embeddedImages: {} }));
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

  // Bulk Auto-Fill for 50-Question Chapter Test 1 / Test 2
  const handleBulkFill50Slots = (rawString) => {
    const parsed = parseBulkQuestionsTextOrJson(rawString, 50);
    if (parsed.length === 0) {
      alert("⚠️ কোনো প্রশ্ন শনাক্ত করা যায়নি! নমুনা ফরম্যাট অনুযায়ী প্রশ্ন দিন।");
      return;
    }
    setTemplate50Questions((prev) =>
      prev.map((slot, idx) => {
        const match = parsed[idx];
        return match
          ? {
              qNo: slot.qNo,
              question: match.question,
              options: match.options,
              correctAnswer: match.correctAnswer,
              explanation: match.explanation,
            }
          : slot;
      })
    );
    setBulk50TextInput("");
    alert(`🎉 এক ক্লিকে ${parsed.length}টি প্রশ্ন স্বয়ংক্রিয়ভাবে ১ থেকে ${parsed.length} নম্বর ঘরে বসে গেছে!`);
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

  // Assign a Subject to an entire 25-Question Block (e.g., 1-25, 26-50, ..., 176-200)
  const assignSubjectTo25Block = (rangeStr, newSubjectId) => {
    const [min, max] = rangeStr.split("-").map(Number);
    const subObj = bcsSubjects.find((s) => s.id === newSubjectId);
    const subTitle = subObj ? subObj.title : "সাধারণ বিষয়";
    const tieCat =
      newSubjectId === "english" || newSubjectId === "english_grammar"
        ? "english"
        : newSubjectId === "math"
        ? "math"
        : "general";

    setTemplate200Questions((prev) =>
      prev.map((item) =>
        item.qNo >= min && item.qNo <= max
          ? { ...item, subjectId: newSubjectId, subjectTitle: subTitle, category: tieCat }
          : item
      )
    );
  };

  // Bulk Auto-Fill for 200-Question National Contest (into active 25-block OR all 1-200)
  const handleBulkFill200Slots = (rawString, fillMode = "ALL") => {
    const parsed = parseBulkQuestionsTextOrJson(rawString, 200);
    if (parsed.length === 0) {
      alert("⚠️ ফাইল বা টেক্সটে কোনো প্রশ্ন পাওয়া যায়নি! অনুগ্রহ করে নমুনা ফরম্যাট দেখুন।");
      return;
    }

    if (fillMode === "CURRENT_25_BLOCK") {
      const [min, max] = active200Range.split("-").map(Number);
      setTemplate200Questions((prev) =>
        prev.map((slot) => {
          if (slot.qNo < min || slot.qNo > max) return slot;
          const localIdx = slot.qNo - min;
          const match = parsed[localIdx];
          return match
            ? {
                ...slot,
                question: match.question,
                options: match.options,
                correctAnswer: match.correctAnswer,
                explanation: match.explanation,
              }
            : slot;
        })
      );
      alert(`🎉 "${active200Range}" ব্লকে ${Math.min(25, parsed.length)}টি প্রশ্ন স্বয়ংক্রিয়ভাবে বসে গেছে!`);
    } else {
      setTemplate200Questions((prev) =>
        prev.map((slot, idx) => {
          const match = parsed[idx];
          return match
            ? {
                ...slot,
                question: match.question,
                options: match.options,
                correctAnswer: match.correctAnswer,
                explanation: match.explanation,
              }
            : slot;
        })
      );
      alert(`🎉 এক ক্লিকে ১ থেকে ${parsed.length} নম্বর স্লটে সবগুলো প্রশ্ন, অপশন, সঠিক উত্তর ও ব্যাখ্যা বসে গেছে!`);
    }
    setBulk200TextInput("");
  };

  const handleBulkFileUploadForQuestions = (e, targetType = "200_ALL") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      if (targetType === "50_SET") {
        handleBulkFill50Slots(text);
      } else if (targetType === "200_BLOCK") {
        handleBulkFill200Slots(text, "CURRENT_25_BLOCK");
      } else {
        handleBulkFill200Slots(text, "ALL");
      }
    };
    reader.readAsText(file);
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
      alert(`🎉 ১০ দিনের জাতীয় বিসিএস পরীক্ষা (${filledCount}টি প্রশ্নসহ) সফলভাবে প্রকাশিত হয়েছে!`);
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
      embeddedImages: lec.embeddedImages || {},
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedCourse("bcs");
                setActivePortal("course_app");
                setActiveTab("biweekly_contest");
              }}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs sm:text-sm font-black items-center gap-1.5 shadow-xs premium-btn cursor-pointer"
            >
              <Trophy className="w-4 h-4" /> ১০ দিনের জাতীয় পরীক্ষা (২০০ MCQ)
            </button>
            <button
              onClick={() => {
                setActivePortal("course_app");
                setActiveTab("admin");
              }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-[#3b0764] hover:bg-purple-200 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 premium-btn cursor-pointer"
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
              <div
                onClick={() => enterCourseDashboard("bcs")}
                className="group premium-card relative rounded-3xl bg-gradient-to-br from-[#2e1065] via-[#3b0764] to-[#1e1b4b] text-white p-7 sm:p-8 shadow-xl cursor-pointer overflow-hidden border border-purple-700/40"
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
                        ১২টি সাবজেক্ট, গল্পে গল্পে ভোকাবুলারি এবং প্রতি ১০ দিনে ২০০ নম্বরের জাতীয় লাইভ পরীক্ষা ও লিডারবোর্ড।
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
                        <div className="text-[10px] text-slate-500 font-bold">10-Day Exam</div>
                        <div className="text-sm font-black text-emerald-700">২০০ MCQ</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border text-[11px]">
                      <div className="font-extrabold text-slate-800">১০, ২০ ও ৩০ তারিখের পরীক্ষা</div>
                      <div className="text-[10px] text-purple-700 font-bold">🏆 বিষয়ভিত্তিক দুর্বলতা বিশ্লেষণ</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => enterCourseDashboard("defense")}
                className="group premium-card relative rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#31105f] to-[#2e1065] text-white p-7 sm:p-8 shadow-xl cursor-pointer overflow-hidden border border-purple-700/40"
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
              className="w-10 h-10 bg-[#2e1065] text-amber-300 rounded-xl flex items-center justify-center font-black text-xl cursor-pointer premium-btn"
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
                <Trophy className="w-4 h-4 text-amber-600" /> ১০ দিনের জাতীয় পরীক্ষা (২০০ MCQ)
              </button>
            )}
            <button onClick={() => navigateTo("qbank")} className={`${activeTab === "qbank" ? "text-slate-900 border-b-2 border-slate-900" : "hover:text-slate-900"} py-5 cursor-pointer`}>প্রশ্ন ব্যাংক</button>
            <button onClick={() => navigateTo("admin")} className={`${activeTab === "admin" ? "text-blue-600 border-b-2 border-blue-600" : "text-blue-600 hover:text-blue-800"} py-5 flex items-center gap-1 cursor-pointer`}>
              <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
            </button>
          </nav>

          <button
            onClick={() => setActivePortal("gateway")}
            className="px-3.5 py-2 rounded-xl bg-[#2e1065] text-amber-300 hover:bg-[#3b0764] text-xs sm:text-sm font-extrabold flex items-center gap-1.5 premium-btn cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" /> কোর্স পরিবর্তন
          </button>
        </div>

        {/* MOBILE NAVBAR (Fixed: Includes "সিলেবাস" right after "ড্যাশবোর্ড"!) */}
        <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 bg-white px-4 py-2.5 gap-4 text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700">
          <button onClick={() => setActivePortal("gateway")} className="text-purple-700 font-extrabold">⌂ পোর্টাল</button>
          <button onClick={() => navigateTo("dashboard")} className={activeTab === "dashboard" ? "text-slate-900 underline decoration-2 font-black" : ""}>ড্যাশবোর্ড</button>
          <button onClick={() => navigateTo("syllabus")} className={activeTab === "syllabus" ? "text-slate-900 underline decoration-2 font-black" : ""}>সিলেবাস</button>
          <button onClick={() => navigateTo("subject_lectures")} className={activeTab === "subject_lectures" ? "text-slate-900 underline decoration-2 font-black" : ""}>লেকচার</button>
          <button onClick={() => navigateTo("mock_test_hub")} className={activeTab === "mock_test_hub" ? "text-slate-900 underline decoration-2 font-black" : ""}>মক টেস্ট</button>
          {selectedCourse === "bcs" && (
            <button onClick={() => navigateTo("biweekly_contest")} className={activeTab === "biweekly_contest" ? "text-amber-800 underline decoration-2 font-black" : "text-amber-700 font-extrabold"}>
              🏆 জাতীয় পরীক্ষা (২০০)
            </button>
          )}
          <button onClick={() => navigateTo("qbank")} className={activeTab === "qbank" ? "text-slate-900 underline decoration-2 font-black" : ""}>প্রশ্ন ব্যাংক</button>
          <button onClick={() => navigateTo("admin")} className="text-blue-600 font-extrabold">অ্যাডমিন</button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {/* GLOBAL BACK ARROW BAR */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="premium-btn inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold shadow-2xs hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> {activeTab === "dashboard" ? "কোর্স পোর্টালে ফিরে যান" : "আগের পেজে ফিরে যান"}
          </button>
          <div className="text-xs sm:text-sm font-bold text-slate-600">
            {selectedCourse === "bcs" ? "📚 BCS Preparation" : "🛡️ Defense & Police Foundation"}
          </div>
        </div>

        {/* ================= 1. DASHBOARD ================= */}
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

              <button onClick={() => setShowProfileEditModal(true)} className="premium-btn w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left cursor-pointer">
                <span className="text-sm font-bold">প্রোফাইল ও প্রতিষ্ঠান এডিট</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </aside>

            <div className="lg:col-span-9 space-y-6">
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-xs uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full font-extrabold">
                    {selectedCourse === "defense" ? "DEFENSE & POLICE FOUNDATION" : "প্রতি ১০ দিনে জাতীয় পরীক্ষা (১০, ২০ ও মাসের শেষ তারিখ)"}
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
                      className="premium-btn px-5 py-3 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black hover:bg-emerald-600 flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Trophy className="w-4 h-4" /> ১০ দিনের জাতীয় পরীক্ষা (২০০ MCQ)
                    </button>
                  )}
                  <button onClick={() => navigateTo("mock_test_hub")} className="premium-btn px-5 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-300 cursor-pointer">
                    অধ্যায়ভিত্তিক মক টেস্ট দিন →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCourseSubjects.map((sub) => {
                  const stats = getSubjectDynamicStats(sub.id);
                  const isEngGrammar = sub.id === "english_grammar";
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectSubject(sub.id)}
                      className={`premium-card p-5 rounded-2xl border bg-white cursor-pointer ${
                        isEngGrammar ? "border-violet-300 ring-1 ring-violet-200" : "border-slate-200 hover:border-[#2e1065]"
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

        {/* ================= 2. LECTURE HUB (WITH CLEAN SHORT-TOKEN IMAGE RENDERING) ================= */}
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
                {activeSubjectId === "english_grammar" && (
                  <button
                    onClick={() => {
                      setActivePdfStep("vocab_story");
                      if (vocabStories.length > 0 && !activeVocabStory) {
                        setActiveVocabStory(vocabStories[0]);
                      }
                      smoothScrollToRef(vocabReaderRef);
                    }}
                    className={`premium-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer ${
                      activePdfStep === "vocab_story"
                        ? "bg-amber-400 text-slate-950"
                        : "bg-white/15 text-amber-300 border border-amber-400/40"
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

            {activeSubjectId === "english_grammar" && activePdfStep === "vocab_story" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-3 bg-white rounded-2xl border border-violet-200 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="font-extrabold text-base text-violet-950">
                      📖 ভোকাবুলারি স্টোরি ({vocabStories.length}টি)
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
                      এখনো কোনো ভোকাবুলারি স্টোরি আপলোড করা হয়নি।
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
                              smoothScrollToRef(vocabReaderRef);
                            }}
                            className={`premium-card p-3.5 rounded-xl border cursor-pointer ${
                              isSelected ? "bg-[#2e1065] text-white border-[#2e1065]" : "bg-white hover:border-violet-400"
                            }`}
                          >
                            <div className={`text-[11px] font-extrabold ${isSelected ? "text-amber-300" : "text-violet-700"}`}>
                              Story #{st.storyNo < 10 ? `0${st.storyNo}` : st.storyNo}
                            </div>
                            <div className="font-extrabold text-sm mt-0.5">{st.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

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
                        </div>
                        <button
                          onClick={() => setActivePdfStep("lecture")}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-extrabold hover:bg-slate-200 cursor-pointer"
                        >
                          ← গ্রামার লেকচারে ফিরে যান
                        </button>
                      </div>

                      <div className="clearfix text-base sm:text-lg text-slate-900 leading-relaxed font-medium space-y-4">
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
                          dangerouslySetInnerHTML={{
                            __html: renderRichTextWithShortImageTokens(
                              activeVocabStory.storyContent,
                              activeVocabStory.embeddedImages
                            ),
                          }}
                        />

                        {activeVocabStory.image2Url && (
                          <img
                            src={activeVocabStory.image2Url}
                            alt={`${activeVocabStory.title} 2`}
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

                      {activeVocabStory.wordMeaningBox && (
                        <div className="clear-both p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-200 space-y-2 mt-6">
                          <h4 className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-600" /> এই গল্পের গুরুত্বপূর্ণ Vocabulary ও শব্দের অর্থ:
                          </h4>
                          <div
                            className="text-sm sm:text-base text-slate-900 whitespace-pre-line font-semibold md:columns-2 md:gap-8"
                            dangerouslySetInnerHTML={{
                              __html: renderRichTextWithShortImageTokens(
                                activeVocabStory.wordMeaningBox,
                                activeVocabStory.embeddedImages
                              ),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
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
                                smoothScrollToRef(studyResourceRef);
                              }}
                              className={`premium-card p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
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

                      <div
                        className={`grid grid-cols-1 ${
                          activeSubjectId === "english_grammar" ? "sm:grid-cols-4" : "sm:grid-cols-3"
                        } gap-3.5`}
                      >
                        {selectedCourse === "defense" && (
                          <button
                            onClick={() => setActivePdfStep("video")}
                            className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
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
                          className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
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
                          className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
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
                            className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
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

                        {activeSubjectId === "english_grammar" && (
                          <button
                            onClick={() => {
                              setActivePdfStep("vocab_story");
                              if (vocabStories.length > 0 && !activeVocabStory) {
                                setActiveVocabStory(vocabStories[0]);
                              }
                            }}
                            className="premium-btn p-4 rounded-xl border-2 border-violet-400 bg-violet-50 hover:bg-violet-100 text-violet-950 text-left flex items-center gap-3 cursor-pointer"
                          >
                            <Sparkles className="w-5 h-5 shrink-0 text-violet-700" />
                            <div>
                              <div className="text-sm font-extrabold">৪. গল্পে গল্পে ভোকাবুলারি</div>
                              <div className="text-xs text-violet-700 font-semibold">চিত্রসহ স্টোরিবুক</div>
                            </div>
                          </button>
                        )}
                      </div>

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
                                dangerouslySetInnerHTML={{
                                  __html: renderRichTextWithShortImageTokens(
                                    activeLecture.mainContent,
                                    activeLecture.embeddedImages
                                  ),
                                }}
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
                                dangerouslySetInnerHTML={{
                                  __html: renderRichTextWithShortImageTokens(
                                    activeLecture.mcqTextContent,
                                    activeLecture.embeddedImages
                                  ),
                                }}
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
                                dangerouslySetInnerHTML={{
                                  __html: renderRichTextWithShortImageTokens(
                                    activeLecture.writtenTextContent,
                                    activeLecture.embeddedImages
                                  ),
                                }}
                              />
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed text-center bg-slate-50 font-bold text-slate-600">
                              এই অধ্যায়ের লিখিত প্রশ্নোত্তর PDF বা Text View এখনো আপলোড করা হয়নি।
                            </div>
                          )}
                        </div>
                      )}

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
                                className="premium-btn px-5 py-3 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-black hover:bg-emerald-600 cursor-pointer shadow-lg"
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
                                className="premium-btn px-5 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black hover:bg-amber-300 cursor-pointer shadow-lg"
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
                            className="premium-btn px-5 py-3 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-extrabold hover:bg-blue-500 flex items-center gap-2 cursor-pointer"
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

        {/* ================= 3. 10-DAY NATIONAL 200-MCQ COMBINED BCS LIVE EXAM, COUNTDOWN, REGISTRATION & SUBJECT WEAKNESS LEADERBOARD ================= */}
        {activeTab === "biweekly_contest" && (
          <div className="space-y-6">
            {/* Hero Banner with Live 10-Day Countdown (10th, 20th, 28th/29th/30th) & Registration Button */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                    <Calendar className="w-4 h-4" /> প্রতি ১০ দিনে ১টি জাতীয় পরীক্ষা (১০, ২০ এবং মাসের শেষ তারিখ ২৮/২৯/৩০)
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black">
                    {currentActiveContest?.title || "৪৭তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড প্রিলিমিনারি পরীক্ষা (২০০ এমসিকিউ)"}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200">
                    মোট প্রশ্ন: {currentActiveContest?.questions?.length || 200}টি · প্রতি প্রশ্নে ৩৬ সেকেন্ড · পাস মার্ক: ৬০% · নেগেটিভ মার্কিং: ০.৫০ · পরবর্তী নতুন পরীক্ষা সাবমিট না হওয়া পর্যন্ত আপনার পজিশন স্থায়ী থাকবে
                  </p>
                </div>

                {/* Live Ticking Countdown Clock */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0 w-full lg:w-auto">
                  <div className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider mb-2">
                    ⏳ {countdownParts.label} — সময় বাকি:
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 text-center">
                    <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-purple-500/30">
                      <div className="text-xl sm:text-2xl font-black text-amber-400">{countdownParts.days}</div>
                      <div className="text-[10px] font-bold text-purple-200">দিন</div>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-purple-500/30">
                      <div className="text-xl sm:text-2xl font-black text-amber-400">{countdownParts.hours}</div>
                      <div className="text-[10px] font-bold text-purple-200">ঘণ্টা</div>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-purple-500/30">
                      <div className="text-xl sm:text-2xl font-black text-amber-400">{countdownParts.minutes}</div>
                      <div className="text-[10px] font-bold text-purple-200">মিনিট</div>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-purple-500/30">
                      <div className="text-xl sm:text-2xl font-black text-emerald-400">{countdownParts.seconds}</div>
                      <div className="text-[10px] font-bold text-purple-200">সেকেন্ড</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration & Start Exam Action Bar */}
              {!isContestRoomActive && (
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300">
                    <UserCheck className="w-5 h-5" />
                    {isRegisteredForContest ? (
                      <span>
                        ✓ রেজিস্টার্ড পরীক্ষার্থী: <strong>{profile.name}</strong> ({profile.institution})
                      </span>
                    ) : (
                      <span>পরীক্ষায় অংশ নিতে প্রথমে আপনার নাম, ফোন নম্বর ও প্রতিষ্ঠান দিয়ে রেজিস্টার করুন</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!myContestSubmission && (
                      <button
                        onClick={() => {
                          setContestRegForm({
                            name: profile.name || "",
                            phone: profile.phone || "",
                            institution: profile.institution || "",
                          });
                          setShowContestRegModal(true);
                        }}
                        className="premium-btn px-5 py-3 bg-white text-[#2e1065] rounded-xl text-xs sm:text-sm font-black cursor-pointer shadow"
                      >
                        📝 {isRegisteredForContest ? "রেজিস্ট্রেশন তথ্য আপডেট" : "পরীক্ষার জন্য রেজিস্ট্রেশন করুন"}
                      </button>
                    )}

                    {myContestSubmission ? (
                      <div className="bg-emerald-500/20 border border-emerald-400/40 px-5 py-2.5 rounded-xl text-center">
                        <span className="text-sm font-black text-white">
                          ✓ আপনার স্থায়ী মেধা স্থান (Position): #{myLeaderboardRank} / {sortedLeaderboard.length}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleOpenOrStart10DayContest}
                        className="premium-btn px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-xl cursor-pointer"
                      >
                        🚀 রেজিস্টার করে পরীক্ষা শুরু করুন →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVE 200-MCQ EXAM ROOM */}
            {isContestRoomActive && currentActiveContest ? (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div>
                    <div className="text-xs font-extrabold text-rose-600 uppercase">
                      ⚠️ সতর্কতা: সময় শেষ হলে অটো-সাবমিট হয়ে যাবে · পুনরায় পরীক্ষা দেওয়া যাবে না
                    </div>
                    <div className="font-extrabold text-lg text-slate-900">
                      পরীক্ষার্থী: {profile.name} · উত্তর দিয়েছেন: {Object.keys(contestAnswers).length} / {currentActiveContest.questions.length}টি
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-black text-base flex items-center gap-1.5">
                      <Clock className="w-5 h-5" /> সময় বাকি: {formatTime(contestTimeLeft)}
                    </div>
                    <button
                      onClick={submitBiWeeklyContestExam}
                      disabled={contestSubmitting}
                      className="premium-btn px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-black cursor-pointer"
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
                          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-[#2e1065] text-xs font-extrabold shrink-0">
                            {q.subjectTitle || "সাধারণ বিষয়"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => setContestAnswers({ ...contestAnswers, [qKey]: optIdx })}
                              className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer transition ${
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
              /* LEADERBOARD (WITH SUBJECT MARKS & WEAKNESS) + STUDENT DETAILED REPORT */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left/Center: National Merit Leaderboard (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-amber-500" /> জাতীয় মেধা তালিকা (Live Leaderboard)
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        পরবর্তী ১০ দিনের পরীক্ষা সাবমিট না হওয়া পর্যন্ত সকল স্টুডেন্টের মধ্যে আপনার পজিশন এখানে স্থায়ীভাবে থাকবে।
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2e1065] text-xs font-extrabold">
                      মোট পরীক্ষার্থী: {sortedLeaderboard.length} জন
                    </span>
                  </div>

                  {sortedLeaderboard.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-600 font-bold">
                      এখনো কেউ এই পর্বের পরীক্ষায় খাতা জমা দেয়নি। রেজিস্টার করে প্রথম স্থান অর্জন করুন!
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[750px] overflow-y-auto pr-1">
                      {sortedLeaderboard.map((sub, index) => {
                        const rank = index + 1;
                        const isMe = sub.studentKey === studentUniqueKey;
                        const totalQ = currentActiveContest?.questions?.length || 200;
                        const passMark = +(totalQ * 0.6).toFixed(1);
                        const passed = sub.totalScore >= passMark;

                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-2xl border space-y-3 transition ${
                              isMe
                                ? "bg-amber-50/80 border-2 border-amber-400 shadow-xs"
                                : rank <= 3
                                ? "bg-purple-50/40 border-purple-200"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3.5">
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
                                        আপনার পজিশন #{rank}
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

                            {/* Subject-wise Score Pills & Weakness Indicator on Leaderboard */}
                            {sub.subjectBreakdown?.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                                <div className="flex flex-wrap gap-1.5">
                                  {sub.subjectBreakdown.map((sb, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold"
                                    >
                                      {sb.subjectTitle}: <strong className="text-blue-700">{sb.marks}</strong> (✓{sb.correct} ✗{sb.wrong})
                                    </span>
                                  ))}
                                </div>
                                {sub.weakSubjects?.length > 0 && (
                                  <div className="text-[11px] font-extrabold text-rose-700 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>দুর্বল বিষয়: {sub.weakSubjects.join(", ")}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Student's Subject-wise Weakness Card & Wrong Answer Explanations (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <h3 className="text-lg font-black text-slate-900 border-b pb-3">
                    📊 আপনার বিষয়ভিত্তিক বিশ্লেষণ ও ভুল উত্তরের ব্যাখ্যা
                  </h3>

                  {!myContestSubmission ? (
                    <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed space-y-3">
                      <p className="text-sm font-bold text-slate-700">
                        আপনি এখনো এই ১০ দিনের পরীক্ষায় অংশগ্রহণ করেননি।
                      </p>
                      <button
                        onClick={handleOpenOrStart10DayContest}
                        className="premium-btn px-5 py-2.5 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold cursor-pointer"
                      >
                        রেজিস্টার করে পরীক্ষা শুরু করুন →
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

                      {/* Subject-by-Subject Score & Weakness Table for the Student */}
                      {myContestSubmission.subjectBreakdown?.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="font-extrabold text-xs text-slate-900 uppercase">
                            বিষয়ভিত্তিক প্রাপ্ত নম্বর ও দুর্বলতা নির্ণয়:
                          </div>
                          {myContestSubmission.subjectBreakdown.map((sb, idx) => {
                            const isWeak = sb.wrong > 0 && (sb.marks / sb.total < 0.5 || sb.wrong >= 2);
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white border text-xs"
                              >
                                <div>
                                  <div className="font-extrabold text-slate-900">{sb.subjectTitle}</div>
                                  <div className="text-[11px] text-slate-500">
                                    সঠিক: {sb.correct}টি · ভুল: <span className="text-rose-600 font-bold">{sb.wrong}টি</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-black text-sm text-[#2e1065]">
                                    {sb.marks} / {sb.total}
                                  </div>
                                  {isWeak ? (
                                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                                      ⚠️ দুর্বলতা
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                      ✓ ভালো প্রস্তুতি
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Detailed Answer Sheet */}
                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
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
                              <div className="flex justify-between gap-2">
                                <span className="font-extrabold text-slate-900">
                                  {qKey}. {q.question}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border shrink-0">
                                  {q.subjectTitle}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-emerald-800">
                                ✓ সঠিক উত্তর: {q.options[q.correctAnswer]}
                              </div>
                              {isWrong && (
                                <div className="text-xs font-bold text-rose-700">
                                  ✗ আপনার ভুল উত্তর: {q.options[myAns]}
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

        {/* ================= 4. MOCK TEST HUB ================= */}
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
                      <div key={setDoc._id} className="premium-card bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
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
                          className="premium-btn w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold hover:bg-black cursor-pointer"
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
                    <div className="flex flex-wrap justify-between items-center gap-4">
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
                  );
                })()}
              </div>
            )}

            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const qKey = q._id || q.qNo || idx;
                const selectedOpt = examAnswers[qKey];
                const isWrong =
                  examSubmitted &&
                  selectedOpt !== undefined &&
                  Number(selectedOpt) !== Number(q.correctAnswer);

                return (
                  <div
                    key={qKey}
                    className={`bg-white p-6 rounded-2xl border ${
                      isWrong ? "border-2 border-rose-500 bg-rose-50/10" : "border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <h3 className="font-extrabold text-base sm:text-lg">
                        {idx + 1}. {q.question}
                      </h3>
                      {isWrong && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-extrabold shrink-0">
                          ✗ ভুল উত্তর (-০.৫০)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        let style = "bg-white border-slate-300 hover:border-slate-900";
                        if (!examSubmitted && selectedOpt === optIdx) {
                          style = "bg-slate-900 text-white border-slate-900 font-extrabold";
                        } else if (examSubmitted) {
                          if (Number(optIdx) === Number(q.correctAnswer)) {
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
                            className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer ${style}`}
                          >
                            {String.fromCharCode(2453 + optIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>

                    {examSubmitted && (
                      <div
                        className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${
                          isWrong
                            ? "bg-rose-50 border-rose-200 text-rose-950"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="font-extrabold">✓ সঠিক উত্তর: {q.options[q.correctAnswer]}</div>
                        {q.explanation && (
                          <div className="mt-1">
                            <strong>ভুল উত্তরের ব্যাখ্যা:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 6. QUESTION BANK HUB (WITH AUTO-SCROLL & SHORT-TOKEN IMAGES) ================= */}
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
                  <button
                    onClick={() => setQbankViewMode("pdf")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                      qbankViewMode === "pdf" ? "bg-slate-900 text-white" : "text-slate-700"
                    }`}
                  >
                    📄 PDF View
                  </button>
                  <button
                    onClick={() => setQbankViewMode("text")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                      qbankViewMode === "text" ? "bg-slate-900 text-white" : "text-slate-700"
                    }`}
                  >
                    📝 Text View
                  </button>
                </div>
                {qbankViewMode === "text" && (
                  <button
                    onClick={() => setQbankTwoCol(!qbankTwoCol)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Columns className="w-4 h-4" />
                    {qbankTwoCol ? "২-কলাম ভিউ (চালু)" : "২-কলামে দেখুন"}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="font-extrabold text-base border-b pb-2.5">
                  প্রশ্ন ব্যাংক তালিকা ({courseFilteredQbankDocs.length}টি)
                </div>
                {courseFilteredQbankDocs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-sm font-bold text-slate-600">
                    এখনো কোনো প্রশ্ন ব্যাংক আপলোড করা হয়নি।
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
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
                          className={`premium-card p-3.5 rounded-xl border cursor-pointer ${
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
                )}
              </div>

              <div ref={qbankReaderRef} className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 p-6 scroll-mt-20">
                {!activeQbankDoc ? (
                  <div className="p-12 text-center text-slate-500 font-bold">
                    কোনো প্রশ্ন ব্যাংক ফাইল পাওয়া যায়নি।
                  </div>
                ) : qbankViewMode === "pdf" && activeQbankDoc.pdfUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h3 className="font-extrabold text-lg">{activeQbankDoc.title}</h3>
                      <button
                        onClick={() => setIsPdfFullscreen(true)}
                        className="px-4 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" /> ফুলস্ক্রিন ভিউ
                      </button>
                    </div>
                    <iframe src={formatSecurePdfUrl(activeQbankDoc.pdfUrl)} className="w-full h-[760px] border-0 rounded-xl" title="QBank PDF" />
                  </div>
                ) : (
                  <div
                    className={`p-6 rounded-2xl bg-blue-50/40 border border-blue-200 text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium clearfix ${
                      qbankTwoCol ? "md:columns-2 md:gap-10 [column-rule:1px_solid_#bfdbfe]" : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: renderRichTextWithShortImageTokens(
                        activeQbankDoc.textContent || "টেক্সট নোট নেই।",
                        activeQbankDoc.embeddedImages
                      ),
                    }}
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
              <div key={sub.id} className="premium-card bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
                  <h3 className="font-extrabold text-lg">{idx + 1}. {sub.title}</h3>
                  <button onClick={() => handleSelectSubject(sub.id)} className="premium-btn px-4 py-2 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold cursor-pointer">
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
                        <p className="text-xs text-slate-600">১২টি বিষয় · ভোকাবুলারি স্টোরি · ১০ দিনের ২০০ MCQ জাতীয় পরীক্ষা · Test 1 & 2</p>
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

                  <div className="flex flex-wrap gap-2.5 pt-2 border-t">
                    <button
                      onClick={() => setAdminSection("lectures")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "lectures" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ১. লেকচার আপলোড (PDF + শর্ট-টোকেন ইমেজ টেক্সট)
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
                      ৩. 🎯 অধ্যায়ভিত্তিক Test 1 ও Test 2 (৫০টি প্রশ্ন + বাল্ক আপলোড)
                    </button>
                    <button
                      onClick={() => setAdminSection("biweekly_200")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "biweekly_200"
                          ? "bg-amber-500 text-slate-950"
                          : "bg-amber-50 text-amber-950 border border-amber-300"
                      }`}
                    >
                      ৪. 🏆 ১০ দিনের জাতীয় বিসিএস পরীক্ষা (২০০ MCQ + বাল্ক ডক আপলোড)
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

                {/* ================= ADMIN SECTION 1: LECTURE UPLOADER + SUBJECT-WISE FILTERED LECTURE LIST ================= */}
                {adminSection === "lectures" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                      <h3 className="text-xl font-extrabold">
                        {editingId ? "✏️ লেকচার আপডেট করুন" : "➕ নতুন লেকচার আপলোড করুন (শর্ট-ট্যাগ ইমেজ ও ফন্ট +/- সহ)"}
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

                        {adminCourseTrack === "defense" && (
                          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                            <label className="font-extrabold text-[#2e1065] block">🎬 YouTube Unlisted লেকচার ভিডিও লিংক</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="https://youtu.be/xxxx"
                                value={formData.videoUrl}
                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                className="sm:col-span-2 p-2.5 border rounded-xl bg-white"
                              />
                              <input
                                type="text"
                                placeholder="১৫ মিনিট"
                                value={formData.videoDuration}
                                onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                                className="p-2.5 border rounded-xl bg-white"
                              />
                            </div>
                          </div>
                        )}

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
                              placeholder="লেকচার PDF লিংক অথবা ফাইল আপলোড করুন..."
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
                            label="📝 মূল লেকচার নোট — Text View (ইমেজ যুক্ত করলে শুধু ছোট {{IMG_1:right}} ট্যাগ বসবে)"
                            value={formData.mainContent}
                            onChange={(val) => setFormData({ ...formData, mainContent: val })}
                            embeddedImages={formData.embeddedImages}
                            onUpdateImages={(imgs) => setFormData({ ...formData, embeddedImages: imgs })}
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
                            embeddedImages={formData.embeddedImages}
                            onUpdateImages={(imgs) => setFormData({ ...formData, embeddedImages: imgs })}
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
                            embeddedImages={formData.embeddedImages}
                            onUpdateImages={(imgs) => setFormData({ ...formData, embeddedImages: imgs })}
                            placeholder="লিখিত প্রশ্নোত্তর এখানে পেস্ট করুন..."
                            rows={4}
                          />
                        </div>

                        <button type="submit" className="premium-btn w-full py-4 bg-slate-900 text-white rounded-2xl text-base font-black hover:bg-black cursor-pointer shadow-lg">
                          {editingId ? "✓ আপডেট সেভ করুন" : "🚀 লেকচার পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    {/* RIGHT SIDEBAR: SUBJECT-FILTERED UPLOADED LECTURES LIST (Solves Point 4!) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                          <Filter className="w-4 h-4 text-purple-700" /> সাবজেক্ট অনুযায়ী আপলোডকৃত লেকচার দেখুন
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          সাবজেক্ট সিলেক্ট করলেই সেই সাবজেক্টের অধীনে কয়টি লেকচার আছে তা দেখাবে
                        </p>
                      </div>

                      <select
                        value={adminLectureFilterSubject}
                        onChange={(e) => setAdminLectureFilterSubject(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-extrabold text-sm text-slate-900"
                      >
                        <option value="ALL">সকল সাবজেক্ট ({lectures.length}টি লেকচার)</option>
                        {[...bcsSubjects, ...defenseSubjects].map((s) => {
                          const cnt = lectures.filter((l) => l.subjectId === s.id).length;
                          return (
                            <option key={s.id} value={s.id}>
                              {s.title} ({cnt}টি লেকচার)
                            </option>
                          );
                        })}
                      </select>

                      {(() => {
                        const filteredAdminLecs = lectures.filter(
                          (l) =>
                            adminLectureFilterSubject === "ALL" ||
                            l.subjectId === adminLectureFilterSubject
                        );

                        return (
                          <>
                            <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-extrabold text-[#2e1065] flex justify-between">
                              <span>নির্বাচিত সাবজেক্টের লেকচার সংখ্যা:</span>
                              <span>{filteredAdminLecs.length}টি</span>
                            </div>

                            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                              {filteredAdminLecs.map((lec) => {
                                const lKey = lec._id || lec.id;
                                const subObj = [...bcsSubjects, ...defenseSubjects].find(
                                  (s) => s.id === lec.subjectId
                                );
                                return (
                                  <div key={lKey} className="p-4 rounded-2xl border bg-slate-50 space-y-2.5">
                                    <div className="text-xs font-extrabold text-purple-800">
                                      {subObj?.title || lec.subjectId} · Lec {lec.lectureNo}
                                    </div>
                                    <div className="font-extrabold text-sm text-slate-900">{lec.title}</div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleEditLectureClick(lec)}
                                        className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold cursor-pointer hover:bg-blue-700"
                                      >
                                        এডিট
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLecture(lKey)}
                                        className="p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl cursor-pointer hover:bg-rose-100"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ================= ADMIN SECTION 2: STORY VOCABULARY BUILDER ================= */}
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-violet-50/60 border border-violet-200">
                          <div className="p-3.5 bg-white rounded-xl border space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-xs text-violet-950">🖼️ স্টোরি ইমেজ ১</span>
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
                            <label className="w-full py-2 bg-violet-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" /> ইমেজ ১ আপলোড করুন
                              <input type="file" accept="image/*" onChange={(e) => handleVocabStoryImageUpload(e, "image1Url")} className="hidden" />
                            </label>
                            {vocabFormData.image1Url && (
                              <div className="text-[11px] font-bold text-emerald-700">✓ ইমেজ ১ যুক্ত হয়েছে</div>
                            )}
                          </div>

                          <div className="p-3.5 bg-white rounded-xl border space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-xs text-violet-950">🖼️ স্টোরি ইমেজ ২</span>
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
                            <label className="w-full py-2 bg-violet-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" /> ইমেজ ২ আপলোড করুন
                              <input type="file" accept="image/*" onChange={(e) => handleVocabStoryImageUpload(e, "image2Url")} className="hidden" />
                            </label>
                            {vocabFormData.image2Url && (
                              <div className="text-[11px] font-bold text-emerald-700">✓ ইমেজ ২ যুক্ত হয়েছে</div>
                            )}
                          </div>
                        </div>

                        <RichTextColorEditor
                          label="📖 মূল গল্পের টেক্সট (কালার গ্রেডিং, বোল্ড ও ফন্ট +/- করুন)"
                          value={vocabFormData.storyContent}
                          onChange={(val) => setVocabFormData({ ...vocabFormData, storyContent: val })}
                          embeddedImages={vocabFormData.embeddedImages}
                          onUpdateImages={(imgs) => setVocabFormData({ ...vocabFormData, embeddedImages: imgs })}
                          placeholder="এখানে গল্পটি লিখুন..."
                          rows={7}
                        />

                        <RichTextColorEditor
                          label="📝 শব্দের অর্থ ও Synonym/Antonym বক্স (গল্পের নিচে ২-কলামে দেখাবে)"
                          value={vocabFormData.wordMeaningBox}
                          onChange={(val) => setVocabFormData({ ...vocabFormData, wordMeaningBox: val })}
                          embeddedImages={vocabFormData.embeddedImages}
                          onUpdateImages={(imgs) => setVocabFormData({ ...vocabFormData, embeddedImages: imgs })}
                          placeholder="গল্পে ব্যবহৃত ভোকাবুলারিগুলোর বাংলা অর্থ ও সিনোনিম এখানে দিন..."
                          rows={4}
                        />

                        <button type="submit" className="premium-btn w-full py-4 bg-violet-800 text-white rounded-2xl text-base font-black hover:bg-violet-950 cursor-pointer shadow-lg">
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
                                    embeddedImages: st.embeddedImages || {},
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

                {/* ================= ADMIN SECTION 3: CHAPTER TEST 1 & TEST 2 (50 QUESTIONS + BULK IMPORTER) ================= */}
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

                    {/* 1-Click Bulk File / Text Importer for 50 Questions */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                          ⚡ ১-ক্লিকে ৫০টি প্রশ্ন বাল্ক ফাইল (.txt / .json) বা ডক টেক্সট থেকে অটো-ফিলআপ করুন:
                        </span>
                        <label className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-4 h-4" /> প্রশ্ন ফাইল (.txt / .json) আপলোড করুন
                          <input
                            type="file"
                            accept=".txt,.json"
                            onChange={(e) => handleBulkFileUploadForQuestions(e, "50_SET")}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <textarea
                        rows={3}
                        value={bulk50TextInput}
                        onChange={(e) => setBulk50TextInput(e.target.value)}
                        placeholder={`অথবা ডক ফাইল থেকে কপি করে এখানে পেস্ট করুন:\nQ: বাংলাদেশের প্রাচীনতম জনপদ কোনটি?\nA: পুণ্ড্র\nB: হরিকেল\nC: সমতট\nD: বঙ্গ\nAns: A\nExp: পুণ্ড্র হলো প্রাচীনতম জনপদ।`}
                        className="w-full p-3 border rounded-xl bg-white text-xs font-mono"
                      />
                      {bulk50TextInput.trim() && (
                        <button
                          type="button"
                          onClick={() => handleBulkFill50Slots(bulk50TextInput)}
                          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                        >
                          ✓ টেক্সট থেকে ১-৫০ স্লটে প্রশ্নগুলো বসিয়ে দিন
                        </button>
                      )}
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
                      <button type="submit" className="premium-btn w-full py-4 bg-emerald-600 text-white rounded-2xl text-base font-black cursor-pointer">
                        🚀 Publish Test {examBuilderMeta.testNumber}
                      </button>
                    </form>
                  </div>
                )}

                {/* ================= ADMIN SECTION 4: 10-DAY 200-MCQ NATIONAL CONTEST BUILDER (WITH BULK UPLOAD + 25-QUESTION SUBJECT SELECTOR!) ================= */}
                {adminSection === "biweekly_200" && (
                  <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 space-y-6">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black">
                        প্রতি ১০ দিনে ১টি জাতীয় পরীক্ষা (১০, ২০ এবং মাসের শেষ তারিখ ২৮/২৯/৩০) · ২০০টি MCQ প্রশ্ন
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                        🏆 বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা সেটআপ (১ - ২০০ নম্বর প্রশ্ন)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">
                        বাল্ক ফাইল বা ডক টেক্সট আপলোড করলেই ১–২৫, ২৬–৫০... ২০০ পর্যন্ত স্বয়ংক্রিয়ভাবে বসে যাবে এবং প্রতি ২৫টি প্রশ্নের জন্য সাবজেক্ট নির্ধারণ করে দিতে পারবেন।
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
                          <span>নতুন ১০ দিনের পর্ব শুরু করুন (আগের লিডারবোর্ড রিসেট)</span>
                        </label>
                      </div>
                    </div>

                    {/* BULK 200-QUESTION DOC/TEXT/JSON AUTO-IMPORTER (Solves Point 5!) */}
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="font-extrabold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5" />
                            ⚡ বাল্ক প্রশ্ন আপলোডার (১–২০০টি প্রশ্ন অথবা বর্তমান ২৫টি প্রশ্নের ব্লক এক ক্লিকে বসান)
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5">
                            ডক বা নোটপ্যাড ফাইল (.txt / .json) আপলোড করুন অথবা নিচে কপি-পেস্ট করুন—প্রশ্ন, অপশন, সঠিক উত্তর ও ব্যাখ্যা সঠিক পজিশনে বসে যাবে!
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <label className="px-4 py-2.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5">
                            <Upload className="w-4 h-4" /> ২০০ প্রশ্নের ফাইল আপলোড
                            <input
                              type="file"
                              accept=".txt,.json"
                              onChange={(e) => handleBulkFileUploadForQuestions(e, "200_ALL")}
                              className="hidden"
                            />
                          </label>
                          <label className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5">
                            <Upload className="w-4 h-4" /> শুধু "{active200Range}" ব্লকে ফাইল আপলোড
                            <input
                              type="file"
                              accept=".txt,.json"
                              onChange={(e) => handleBulkFileUploadForQuestions(e, "200_BLOCK")}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <textarea
                        rows={4}
                        value={bulk200TextInput}
                        onChange={(e) => setBulk200TextInput(e.target.value)}
                        placeholder={`ডক ফাইল থেকে প্রশ্ন কপি করে এখানে পেস্ট করুন (প্রতিটি প্রশ্নের মাঝে ১ লাইন ফাঁকা রাখুন):\n\nQ: চর্যাপদ কোন ছন্দে রচিত?\nA: মাত্রাবৃত্ত\nB: অক্ষরবৃত্ত\nC: স্বরবৃত্ত\nD: গদ্যছন্দ\nAns: A\nExp: আধুনিক ছন্দের বিচারে চর্যাপদ মাত্রাবৃত্ত ছন্দে রচিত।`}
                        className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-xs font-mono outline-none"
                      />

                      {bulk200TextInput.trim() && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleBulkFill200Slots(bulk200TextInput, "CURRENT_25_BLOCK")}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black cursor-pointer"
                          >
                            ✓ বর্তমান "{active200Range}" ব্লকের ২৫টি স্লটে বসান
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBulkFill200Slots(bulk200TextInput, "ALL")}
                            className="px-4 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer"
                          >
                            ✓ ১ থেকে ২০০ নম্বর স্লটে ধারাবাহিকভাবে বসান
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 25-Question Block Tabs + Subject Selector for Each 25-Question Block (Solves Point 6!) */}
                    <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
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
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                                active200Range === rng
                                  ? "bg-slate-900 text-amber-300 shadow-xs"
                                  : "bg-white text-slate-800 border"
                              }`}
                            >
                              প্রশ্ন {rng}
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-black text-amber-950">
                          পূরণকৃত প্রশ্ন: {template200Questions.filter((q) => q.question.trim() !== "").length} / ২০০টি
                        </span>
                      </div>

                      {/* Subject Assignment Bar for the currently selected 25-Question Block */}
                      {(() => {
                        const [minQ] = active200Range.split("-").map(Number);
                        const currentBlockSample = template200Questions.find((q) => q.qNo === minQ);
                        return (
                          <div className="p-3.5 rounded-xl bg-white border-2 border-purple-300 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <span className="text-xs font-black text-[#2e1065] uppercase">
                                📌 প্রশ্ন {active200Range} (এই ২৫টি প্রশ্নের সাবজেক্ট নির্ধারণ করুন):
                              </span>
                              <p className="text-[11px] text-slate-500">
                                এখানে সাবজেক্ট সিলেক্ট করলে লিডারবোর্ডে স্টুডেন্ট এই সাবজেক্টে কত পেল এবং তার দুর্বলতা কোথায় তা অটোমেটিক দেখাবে।
                              </p>
                            </div>
                            <select
                              value={currentBlockSample?.subjectId || "bangla"}
                              onChange={(e) => assignSubjectTo25Block(active200Range, e.target.value)}
                              className="px-4 py-2.5 rounded-xl border-2 border-[#2e1065] bg-purple-50 text-[#2e1065] font-black text-xs sm:text-sm"
                            >
                              {bcsSubjects.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.title} (প্রশ্ন {active200Range})
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 200-Question Numbered Slots */}
                    <form onSubmit={handlePublish200Contest} className="space-y-4">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {template200Questions
                          .filter((item) => {
                            const [min, max] = active200Range.split("-").map(Number);
                            return item.qNo >= min && item.qNo <= max;
                          })
                          .map((slot) => (
                            <div key={slot.qNo} className="p-4 rounded-2xl border bg-slate-50 space-y-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="px-3 py-1 rounded-lg bg-slate-900 text-amber-300 text-xs font-black">
                                  জাতীয় পরীক্ষা · প্রশ্ন #{slot.qNo}
                                </span>
                                <span className="px-3 py-1 rounded-lg bg-purple-100 text-[#2e1065] text-xs font-extrabold">
                                  সাবজেক্ট: {slot.subjectTitle}
                                </span>
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

                      <button type="submit" className="premium-btn w-full py-4 bg-amber-400 text-slate-950 rounded-2xl text-base font-black hover:bg-amber-300 cursor-pointer shadow-lg">
                        🚀 ১০ দিনের জাতীয় বিসিএস পরীক্ষা (২০০ MCQ) Publish করুন
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
                        embeddedImages={qbFormData.embeddedImages}
                        onUpdateImages={(imgs) => setQbFormData({ ...qbFormData, embeddedImages: imgs })}
                        placeholder="প্রশ্ন ব্যাংকের টেক্সট এখানে লিখুন..."
                        rows={5}
                      />
                      <button type="submit" className="premium-btn w-full py-3.5 bg-slate-900 text-white rounded-xl font-extrabold cursor-pointer">
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

      {/* ================= 10-DAY NATIONAL EXAM REGISTRATION MODAL (PHONE, NAME, INSTITUTION) ================= */}
      {showContestRegModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border-2 border-[#2e1065]">
            <div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black">
                ১০ দিনের জাতীয় বিসিএস প্রিলি পরীক্ষা (২০০ নম্বর)
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                📝 পরীক্ষার রেজিস্ট্রেশন সম্পন্ন করুন
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                রেজিস্টার করলেই আপনার সামনে ২০০ প্রশ্নের এক্সাম পেপার ওপেন হবে এবং লিডারবোর্ডে আপনার নাম ও প্রতিষ্ঠান যুক্ত হবে।
              </p>
            </div>

            <form onSubmit={handleContestRegistrationSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="font-extrabold block mb-1 text-slate-800">১. আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Amir Hamza"
                  value={contestRegForm.name}
                  onChange={(e) => setContestRegForm({ ...contestRegForm, name: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-extrabold block mb-1 text-slate-800">২. মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 017XXXXXXXX"
                  value={contestRegForm.phone}
                  onChange={(e) => setContestRegForm({ ...contestRegForm, phone: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-extrabold block mb-1 text-slate-800">৩. শিক্ষাপ্রতিষ্ঠান (বিশ্ববিদ্যালয় / কলেজ) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Metropolitan University, Sylhet"
                  value={contestRegForm.institution}
                  onChange={(e) => setContestRegForm({ ...contestRegForm, institution: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContestRegModal(false)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="premium-btn flex-1 py-3 bg-[#2e1065] text-amber-300 rounded-xl font-black cursor-pointer shadow-lg"
                >
                  ✓ রেজিস্টার ও পরীক্ষা শুরু
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="মোবাইল নম্বর"
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
              <button onClick={() => setShowProfileEditModal(false)} className="flex-1 py-3 border rounded-xl font-bold cursor-pointer">বাতিল</button>
              <button
                onClick={() => {
                  updateProfile(profile);
                  setShowProfileEditModal(false);
                }}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-extrabold cursor-pointer"
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