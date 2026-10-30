"use client";

/**
 * ============================================================================
 * FILE: src/app/page.js
 * PROJECT: BCS Path & Defense/Police Foundation — Complete Upgraded Platform
 * KEY UPGRADES IMPLEMENTED:
 * 1. Weekly Live Exam Persistent Registration & "পূর্ববর্তী ফলাফল" (Top 100 Leaderboard)
 *    + Subtle Zoom-In/Zoom-Out Pulse Animation on Countdown Card.
 * 2. Fully Dynamic Notification Bell Dropdown + Optional Admin Notification Sender
 *    + Click-to-Navigate & Read/Unread Persistence.
 * 3. Defense & Police Foundation Sub-Course Selection Portal (Matches Image 4)
 *    with 2-cards-per-row on Mobile (`grid-cols-2`) and Official Marks & Syllabus
 *    for Police TRC, Army Sainik, Navy Sailor, Airman, Navy Cadet & BAFA.
 * 4. Subtle Neon Border Animation on Dashboard Subject Cards + Marks Badge ("৩৫ নম্বর").
 * 5. Subtle Neon Border & Hover Animation on Syllabus Cards + Interactive Medium
 *    Popup Modal (with ✕ close button) + Admin Syllabus CMS.
 * 6. Automatic Smooth Scrolling to target sections across the platform.
 * 7. Dynamic Course-Based Profile Target ("লক্ষ্য: বিসিএস", "লক্ষ্য: বাংলাদেশ সেনাবাহিনী", etc.)
 *    & Course-Based Access Control.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Trash2,
  Clock,
  ShieldCheck,
  KeyRound,
  Camera,
  Building2,
  FileText,
  HelpCircle,
  PenTool,
  Upload,
  ChevronRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Edit3,
  PlayCircle,
  Shield,
  Award,
  LayoutGrid,
  Type,
  Plus,
  Minus,
  Image as ImageIcon,
  Trophy,
  Calendar,
  FileSpreadsheet,
  AlertCircle,
  Filter,
  Lock,
  Home,
  User,
  Lightbulb,
  Star,
  Bell,
  Newspaper,
  Gift,
  CreditCard,
  XCircle,
  X,
  Check,
  Target,
  Send,
  History,
} from "lucide-react";
import { initialSubjects } from "../data/bcsData";

/**
 * ============================================================================
 * 1. BCS & MULTI-TRACK DEFENSE COURSE CONFIGURATIONS & OFFICIAL SYLLABUS
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
      {
        topic: "ধ্বনি, বর্ণ, সন্ধি, উপসর্গ ও প্রত্যয়",
        marks: "৫ নম্বর",
        details: "বিসিএস প্রিলিমিনারি ও লিখিত ব্যাকরণের মূল ভিত্তি।",
      },
      {
        topic: "সমাস, কারক-বিভক্তি ও বাক্য প্রকরণ",
        marks: "৫ নম্বর",
        details: "উদাহরণ ও শর্টকাট টেকনিকসহ বিস্তারিত আলোচনা।",
      },
      {
        topic: "বানান শুদ্ধিকরণ, প্রবাদ-প্রবচন ও পারিভাষিক শব্দ",
        marks: "৫ নম্বর",
        details: "প্রিলিমিনারি ও লিখিত উভয় পরীক্ষার জন্য অপরিহার্য।",
      },
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
      {
        topic: "Parts of Speech, Clauses, Phrases & Idioms",
        marks: "৮ নম্বর",
        details: "BCS Preliminary & Written Grammar Rules.",
      },
      {
        topic: "Right Form of Verbs, Prepositions & Voice/Narration",
        marks: "৬ নম্বর",
        details: "High-yield grammar transformations and corrections.",
      },
      {
        topic: "গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি (Story Vocabulary)",
        marks: "৬ নম্বর",
        details: "চিত্র ও গল্পের মাধ্যমে সিনোনিম, অ্যান্টোনিম ও ভোকাবুলারি আয়ত্ত।",
      },
    ],
  },
];

const FULL_BCS_SUBJECTS = [
  ...initialSubjects.slice(0, 2),
  ...EXTRA_GRAMMAR_SUBJECTS,
  ...initialSubjects.slice(2),
];

/**
 * ALL DEFENSE & POLICE SUB-COURSES WITH OFFICIAL MARKS & SYLLABUS
 */
const DEFENSE_COURSES_CATALOG = {
  def_police_trc: {
    id: "def_police_trc",
    title: "পুলিশ কনস্টেবল",
    fullTitle: "বাংলাদেশ পুলিশ — ট্রেইনি রিক্রুট কনস্টেবল (TRC)",
    shortDesc: "বাংলাদেশ পুলিশে কনস্টেবল পদে নিয়োগ পরীক্ষার সম্পূর্ণ প্রস্তুতি কোর্স।",
    badgeText: "🔥 জনপ্রিয়",
    badgeColor: "bg-gradient-to-r from-rose-600 to-red-500 text-white",
    cardTheme: "from-[#071636] via-[#0c2454] to-[#061029] border-blue-500/50",
    btnColor: "bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white",
    targetLabel: "লক্ষ্য: বাংলাদেশ পুলিশ",
    examSummary: "লিখিত পরীক্ষা: ৪০ নম্বর • ভাইভা ও মনস্তত্ত্ব: ২০ নম্বর",
    officialNote:
      "বিশেষ দ্রষ্টব্য: লিখিত পরীক্ষার ৪০ নম্বরের বিষয়ভিত্তিক সুনির্দিষ্ট নম্বরবণ্টন অফিসিয়াল বিজ্ঞপ্তিতে উল্লেখ না থাকায় সামগ্রিক ৪০ নম্বরের সমন্বিত প্রস্তুতি অন্তর্ভুক্ত করা হয়েছে।",
    vivaGuide:
      "নিজের নাম ও অর্থ, নিজ জেলার ইতিহাস ও বিখ্যাত ব্যক্তিত্ব, মুক্তিযুদ্ধে বাংলাদেশ পুলিশের প্রথম সশস্ত্র প্রতিরোধ (রাজারবাগ পুলিশ লাইন্স), পুলিশের র‍্যাংক ও দায়িত্ব এবং সাধারণ উপস্থিত বুদ্ধিমত্তা।",
    subjects: [
      {
        id: "trc_bangla",
        title: "বাংলা ভাষা ও সাহিত্য",
        initial: "বাং",
        bg: "bg-emerald-100",
        text: "text-emerald-900",
        marksLabel: "লিখিত (৪০ নম্বরের অন্তর্ভুক্ত)",
        syllabusBreakdown: [
          {
            topic: "বাংলা ব্যাকরণ (বানান, সন্ধি, সমাস, কারক ও বাগধারা)",
            marks: "লিখিত অংশ",
            details: "কনস্টেবল লিখিত পরীক্ষার জন্য এক কথায় প্রকাশ, বাগধারা, সন্ধি বিচ্ছেদ, কারক-বিভক্তি ও বানান শুদ্ধিকরণ।",
          },
          {
            topic: "বাংলা সাহিত্য ও রচনামূলক অংশ",
            marks: "লিখিত অংশ",
            details: "জাতীয় কবি, রবীন্দ্রনাথ ঠাকুর, মুক্তিযুদ্ধভিত্তিক সাহিত্য এবং সংক্ষিপ্ত অনুচ্ছেদ/দরখাস্ত লিখন।",
          },
        ],
      },
      {
        id: "trc_english",
        title: "ইংরেজি (English)",
        initial: "ইং",
        bg: "bg-blue-100",
        text: "text-blue-900",
        marksLabel: "লিখিত (৪০ নম্বরের অন্তর্ভুক্ত)",
        syllabusBreakdown: [
          {
            topic: "Grammar, Tense, Voice, Narration & Preposition",
            marks: "লিখিত অংশ",
            details: "Parts of Speech, Right form of verbs, Appropriate Preposition, Voice Change এবং Narration-এর মৌলিক নিয়ম।",
          },
          {
            topic: "Vocabulary, Translation & Short Paragraph",
            marks: "লিখিত অংশ",
            details: "প্রতিদিনের ব্যবহৃত ইংরেজি শব্দের অর্থ, Synonym/Antonym এবং বাংলা থেকে ইংরেজি অনুবাদ।",
          },
        ],
      },
      {
        id: "trc_math",
        title: "সাধারণ গণিত",
        initial: "গ",
        bg: "bg-purple-100",
        text: "text-purple-900",
        marksLabel: "লিখিত (৪০ নম্বরের অন্তর্ভুক্ত)",
        syllabusBreakdown: [
          {
            topic: "পাটিগণিত (শতকরা, অনুপাত, লাভ-ক্ষতি, গড়, সুদ ও সময়-কাজ)",
            marks: "লিখিত অংশ",
            details: "শতকরা, লাভ-ক্ষতি, ঐকিক নিয়ম, অনুপাত-সমানুপাত, গড় এবং সরল সুদের অংক সমাধানের সহজ নিয়ম।",
          },
          {
            topic: "বীজগণিত ও মৌলিক জ্যামিতি",
            marks: "লিখিত অংশ",
            details: "বীজগণিতীয় সূত্রের মান নির্ণয়, উৎপাদকে বিশ্লেষণ এবং ত্রিভুজ ও চতুর্ভুজের ক্ষেত্রফল।",
          },
        ],
      },
      {
        id: "trc_gk",
        title: "সাধারণ জ্ঞান",
        initial: "সা",
        bg: "bg-amber-100",
        text: "text-amber-900",
        marksLabel: "লিখিত (৪০ নম্বরের অন্তর্ভুক্ত)",
        syllabusBreakdown: [
          {
            topic: "বাংলাদেশ, মুক্তিযুদ্ধ, সংবিধান ও ভৌগোলিক পরিচিতি",
            marks: "লিখিত অংশ",
            details: "১৯৭১ সালের মহান মুক্তিযুদ্ধ, বীরশ্রেষ্ঠ, সংবিধানের মৌলিক ধারা, নদ-নদী ও বাংলাদেশের প্রশাসনিক কাঠামো।",
          },
          {
            topic: "আন্তর্জাতিক বিষয়াবলি ও বাংলাদেশ পুলিশ পরিচিতি",
            marks: "লিখিত অংশ",
            details: "জাতিসংঘ, সার্ক, বিভিন্ন দেশের রাজধানী-মুদ্রা এবং বাংলাদেশ পুলিশের ইতিহাস ও পদমর্যাদা।",
          },
        ],
      },
      {
        id: "trc_viva",
        title: "ভাইভা ও মনস্তত্ত্ব প্রস্তুতি",
        initial: "ভা",
        bg: "bg-rose-100",
        text: "text-rose-900",
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "মৌখিক পরীক্ষা (Viva) ও মনস্তাত্ত্বিক মূল্যায়ন",
            marks: "২০ নম্বর",
            details: "ভাইভা বোর্ডে প্রবেশের আদবকেতা, নিজ জেলা, শিক্ষাগত যোগ্যতা, পুলিশে যোগদানের কারণ ও মনস্তাত্ত্বিক প্রশ্নোত্তর।",
          },
        ],
      },
    ],
  },

  def_police_army_joint: {
    id: "def_police_army_joint",
    title: "পুলিশ + সেনাবাহিনী (যৌথ কোর্স)",
    fullTitle: "পুলিশ কনস্টেবল (TRC) + সেনাবাহিনী (সৈনিক) যৌথ প্রস্তুতি কোর্স",
    shortDesc: "পুলিশ কনস্টেবল ও সেনাবাহিনীতে (সৈনিক) পদে নিয়োগ পরীক্ষার যৌথ প্রস্তুতি কোর্স।",
    badgeText: "🛡️ সকলের জন্য",
    badgeColor: "bg-gradient-to-r from-emerald-600 to-green-500 text-white",
    cardTheme: "from-[#0a2117] via-[#123826] to-[#071710] border-emerald-500/50",
    btnColor: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white",
    targetLabel: "লক্ষ্য: বাংলাদেশ পুলিশ ও সেনাবাহিনী",
    examSummary: "পুলিশ TRC (লিখিত ৪০ + ভাইভা ২০) এবং সৈনিক (১০০ নম্বর) সমন্বিত সিলেবাস",
    vivaGuide: "পুলিশ কনস্টেবল ও সেনাবাহিনী সৈনিক পদের যৌথ মাঠ পরীক্ষা ও ভাইভা গাইডলাইন।",
    subjects: [
      {
        id: "joint_pa_math",
        title: "গণিত (পাটিগণিত, বীজগণিত ও জ্যামিতি)",
        initial: "গ",
        bg: "bg-purple-100",
        text: "text-purple-900",
        examMarks: 25,
        marksLabel: "২৫ নম্বর",
        syllabusBreakdown: [
          {
            topic: "শতকরা, অনুপাত, লাভ-ক্ষতি, গড়, সুদ ও বীজগণিত",
            marks: "২৫ নম্বর",
            details: "পুলিশ কনস্টেবল ও সৈনিক উভয় পরীক্ষার কমন গণিত টপিক।",
          },
        ],
      },
      {
        id: "joint_pa_bangla",
        title: "বাংলা ভাষা, ব্যাকরণ ও রচনা",
        initial: "বাং",
        bg: "bg-emerald-100",
        text: "text-emerald-900",
        examMarks: 20,
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "ব্যাকরণ, বানান, সন্ধি, সমাস, বাগধারা ও সাহিত্য",
            marks: "২০ নম্বর",
            details: "লিখিত ও এমসিকিউ উভয় পরীক্ষার জন্য বাংলা প্রস্তুতি।",
          },
        ],
      },
      {
        id: "joint_pa_english",
        title: "ইংরেজি (Grammar & Vocabulary)",
        initial: "ইং",
        bg: "bg-blue-100",
        text: "text-blue-900",
        examMarks: 20,
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "Grammar, Tense, Voice, Narration, Preposition & Vocabulary",
            marks: "২০ নম্বর",
            details: "বেসিক গ্রামার রুলস, ট্রান্সলেশন ও প্যারাগ্রাফ রাইটিং।",
          },
        ],
      },
      {
        id: "joint_pa_gk",
        title: "সাধারণ জ্ঞান ও আইকিউ (IQ)",
        initial: "সা",
        bg: "bg-amber-100",
        text: "text-amber-900",
        examMarks: 35,
        marksLabel: "৩৫ নম্বর",
        syllabusBreakdown: [
          {
            topic: "বাংলাদেশ, মুক্তিযুদ্ধ, সশস্ত্র বাহিনী, পুলিশ ও আইকিউ",
            marks: "৩৫ নম্বর",
            details: "সাধারণ জ্ঞান ২০ নম্বর + আইকিউ ১৫ নম্বর ও ভাইভা প্রস্তুতি।",
          },
        ],
      },
    ],
  },

  def_joint_3forces: {
    id: "def_joint_3forces",
    title: "ডিফেন্স জয়েন্ট কোর্স (আর্মি + এয়ার ফোর্স + নেভি)",
    fullTitle: "ডিফেন্স জয়েন্ট কোর্স (সেনা + নৌ + বিমান বাহিনী)",
    shortDesc: "তিন বাহিনীর জন্য একসাথে প্রস্তুতি নিন। এক কোর্সেই পূর্ণাঙ্গ গাইডলাইন।",
    badgeText: "☆ হাই ডিমান্ড",
    badgeColor: "bg-gradient-to-r from-violet-600 to-purple-500 text-white",
    cardTheme: "from-[#0c163b] via-[#152766] to-[#08102b] border-blue-400/50",
    btnColor: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white",
    targetLabel: "লক্ষ্য: সশস্ত্র বাহিনী (Army, Navy & Air Force)",
    examSummary: "সৈনিক, নাবিক ও বিমানসেনা পদের ১০০ নম্বরের সমন্বিত অল-ইন-ওয়ান প্রস্তুতি",
    vivaGuide: "সেনা, নৌ ও বিমান বাহিনীর র‍্যাংক, দায়িত্ব, শারীরিক যোগ্যতা ও চূড়ান্ত ভাইভা প্রস্তুতি।",
    subjects: [
      {
        id: "j3_english",
        title: "ইংরেজি (Grammar & Vocabulary)",
        initial: "ইং",
        bg: "bg-blue-100",
        text: "text-blue-900",
        examMarks: 25,
        marksLabel: "২৫ নম্বর",
        syllabusBreakdown: [
          {
            topic: "তিন বাহিনীর সমন্বিত ইংরেজি গ্রামার ও ভোকাবুলারি",
            marks: "২৫ নম্বর",
            details: "Parts of Speech, Tense, Voice, Preposition ও Vocabulary.",
          },
        ],
      },
      {
        id: "j3_math",
        title: "গণিত (পাটিগণিত ও বীজগণিত)",
        initial: "গ",
        bg: "bg-purple-100",
        text: "text-purple-900",
        examMarks: 25,
        marksLabel: "২৫ নম্বর",
        syllabusBreakdown: [
          {
            topic: "পাটিগণিত, বীজগণিত ও জ্যামিতি",
            marks: "২৫ নম্বর",
            details: "শতকরা, অনুপাত, লাভ-ক্ষতি ও বীজগণিতীয় সূত্রের প্রয়োগ।",
          },
        ],
      },
      {
        id: "j3_science",
        title: "সাধারণ বিজ্ঞান ও পদার্থবিজ্ঞান",
        initial: "বি",
        bg: "bg-teal-100",
        text: "text-teal-900",
        examMarks: 20,
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "পদার্থবিজ্ঞান, রসায়ন ও সাধারণ বিজ্ঞান",
            marks: "২০ নম্বর",
            details: "নাবিক ও বিমানসেনা টেকনিক্যাল ট্রেডের জন্য অপরিহার্য বিজ্ঞান।",
          },
        ],
      },
      {
        id: "j3_bangla_gk_iq",
        title: "বাংলা, সাধারণ জ্ঞান ও আইকিউ (IQ)",
        initial: "IQ",
        bg: "bg-amber-100",
        text: "text-amber-900",
        examMarks: 30,
        marksLabel: "৩০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "বাংলা ব্যাকরণ, মুক্তিযুদ্ধ, সশস্ত্র বাহিনী ও আইকিউ",
            marks: "৩০ নম্বর",
            details: "তিন বাহিনীর সাধারণ জ্ঞান, বাংলা ও ভার্বাল/নন-ভার্বাল আইকিউ।",
          },
        ],
      },
    ],
  },

  def_army_sainik: {
    id: "def_army_sainik",
    title: "সেনাবাহিনী (সৈনিক)",
    fullTitle: "বাংলাদেশ সেনাবাহিনী — সৈনিক পদে নিয়োগ প্রস্তুতি",
    shortDesc: "বাংলাদেশ সেনাবাহিনীতে সৈনিক পদে নিয়োগ পরীক্ষার সম্পূর্ণ প্রস্তুতি কোর্স।",
    badgeText: "🔥 জনপ্রিয়",
    badgeColor: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white",
    cardTheme: "from-[#0a2115] via-[#123822] to-[#07170e] border-emerald-500/50",
    btnColor: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white",
    targetLabel: "লক্ষ্য: বাংলাদেশ সেনাবাহিনী",
    examSummary: "প্রস্তাবিত মডেল টেস্ট: ১০০ নম্বর (গণিত ২৫, বাংলা ২০, ইংরেজি ২০, সা.জ্ঞান ২০, IQ ১৫)",
    vivaGuide:
      "নিজের পরিচয়, পরিবার, শিক্ষাগত যোগ্যতা, সেনাবাহিনীতে যোগদানের কারণ, বাংলাদেশের ইতিহাস এবং সেনাবাহিনীর দায়িত্ব।",
    subjects: [
      {
        id: "army_math",
        title: "গণিত (Mathematics)",
        initial: "গ",
        bg: "bg-purple-100",
        text: "text-purple-900",
        examMarks: 25,
        marksLabel: "২৫ নম্বর",
        syllabusBreakdown: [
          {
            topic: "পাটিগণিত, শতকরা, অনুপাত, লাভ-ক্ষতি ও লসাগু-গসাগু",
            marks: "১৫ নম্বর",
            details: "সৈনিক লিখিত ও এমসিকিউ পরীক্ষায় পাটিগণিতের সর্বাধিক গুরুত্বপূর্ণ অংক ও শর্টকাট।",
          },
          {
            topic: "বীজগণিত ও পরিমিতি",
            marks: "১০ নম্বর",
            details: "মান নির্ণয়, সরল সমীকরণ, সূচক এবং জ্যামিতিক ক্ষেত্রফল নির্ণয়।",
          },
        ],
      },
      {
        id: "army_bangla",
        title: "বাংলা ব্যাকরণ ও সাহিত্য",
        initial: "বাং",
        bg: "bg-emerald-100",
        text: "text-emerald-900",
        examMarks: 20,
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "বাংলা ব্যাকরণ (সন্ধি, সমাস, কারক, বাগধারা ও বানান)",
            marks: "১২ নম্বর",
            details: "ধ্বনি, বর্ণ, সন্ধি বিচ্ছেদ, সমাস, কারক-বিভক্তি এবং বিপরীত শব্দ।",
          },
          {
            topic: "বাংলা সাহিত্য ও অনুচ্ছেদ রচনা",
            marks: "৮ নম্বর",
            details: "প্রখ্যাত কবি-সাহিত্যিকদের ছদ্মনাম, গ্রন্থ ও মুক্তিযুদ্ধভিত্তিক রচনা।",
          },
        ],
      },
      {
        id: "army_english",
        title: "ইংরেজি (Grammar & Vocabulary)",
        initial: "ইং",
        bg: "bg-blue-100",
        text: "text-blue-900",
        examMarks: 20,
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "English Grammar (Parts of Speech, Tense, Preposition, Voice)",
            marks: "১২ নম্বর",
            details: "শূন্যস্থান পূরণ, বাক্য শুদ্ধিকরণ, ট্রান্সফরমেশন ও আর্টিকেল।",
          },
          {
            topic: "Vocabulary & Translation",
            marks: "৮ নম্বর",
            details: "Synonym, Antonym, Correct Spelling এবং বাংলা থেকে ইংরেজি অনুবাদ।",
          },
        ],
      },
      {
        id: "army_gk",
        title: "সাধারণ জ্ঞান",
        initial: "সা",
        bg: "bg-amber-100",
        text: "text-amber-900",
        examMarks: 20,
        marksLabel: "২০ নম্বর",
        syllabusBreakdown: [
          {
            topic: "বাংলাদেশ ও মুক্তিযুদ্ধ এবং সশস্ত্র বাহিনী পরিচিতি",
            marks: "১২ নম্বর",
            details: "মুক্তিযুদ্ধের ১১টি সেক্টর, ৭ জন বীরশ্রেষ্ঠ, সেনাবাহিনীর র‍্যাংক ও ক্যান্টনমেন্ট পরিচিতি।",
          },
          {
            topic: "আন্তর্জাতিক বিষয়াবলি ও সাম্প্রতিক বিশ্ব",
            marks: "৮ নম্বর",
            details: "জাতিসংঘে বাংলাদেশ সেনাবাহিনীর শান্তিরক্ষা মিশন, ভৌগোলিক সীমারেখা ও সংস্থা।",
          },
        ],
      },
      {
        id: "army_iq",
        title: "আইকিউ (IQ) ও ভাইভা প্রস্তুতি",
        initial: "IQ",
        bg: "bg-fuchsia-100",
        text: "text-fuchsia-900",
        examMarks: 15,
        marksLabel: "১৫ নম্বর",
        syllabusBreakdown: [
          {
            topic: "সংখ্যার ধারা, যুক্তি ও বুদ্ধিমত্তা (IQ)",
            marks: "১৫ নম্বর",
            details: "সংখ্যার সিরিজ পূরণ, কোডিং-ডিকোডিং, দিক নির্ণয় ও রক্তের সম্পর্ক।",
          },
          {
            topic: "ভাইভা প্রস্তুতি (মৌখিক পরীক্ষা)",
            marks: "ভাইভা",
            details: "নিজের পরিচয়, পরিবার, শিক্ষাগত যোগ্যতা, সেনাবাহিনীতে যোগদানের কারণ ও সেনাবাহিনীর দায়িত্ব।",
          },
        ],
      },
    ],
  },
};
const ALL_COURSE_KEYS = ["bcs", ...Object.keys(DEFENSE_COURSES_CATALOG)];

function getCourseTargetLabel(courseKey) {
  if (courseKey === "bcs") return "লক্ষ্য: বিসিএস";
  return (
    DEFENSE_COURSES_CATALOG[courseKey]?.targetLabel ||
    "লক্ষ্য: ডিফেন্স ও পুলিশ ফাউন্ডেশন"
  );
}

function getCourseTitleLabel(courseKey) {
  if (courseKey === "bcs") return "বিসিএস পাঠ (BCS)";
  return (
    DEFENSE_COURSES_CATALOG[courseKey]?.title || "Defense & Police Foundation"
  );
}

function getSubjectsForCourse(courseKey) {
  if (courseKey === "bcs") return FULL_BCS_SUBJECTS;
  if (DEFENSE_COURSES_CATALOG[courseKey]) {
    return DEFENSE_COURSES_CATALOG[courseKey].subjects;
  }
  return DEFENSE_COURSES_CATALOG.def_army_sainik.subjects;
}

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
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return url;
}

function renderRichTextWithShortImageTokens(htmlText, embeddedImages = {}) {
  if (!htmlText) return "";
  return htmlText.replace(
    /\{\{(IMG_\d+):(left|right|top|bottom)\}\}/g,
    (match, imgKey, align) => {
      const src = embeddedImages?.[imgKey];
      if (!src) return "";
      let styleStr =
        "max-width:260px;width:100%;border-radius:12px;border:2px solid #cbd5e1;margin:10px auto;display:block;";
      if (align === "left") {
        styleStr =
          "float:left;max-width:240px;width:100%;margin:6px 16px 12px 0;border-radius:12px;border:2px solid #cbd5e1;";
      } else if (align === "right") {
        styleStr =
          "float:right;max-width:240px;width:100%;margin:6px 0 12px 16px;border-radius:12px;border:2px solid #cbd5e1;";
      } else if (align === "top" || align === "bottom") {
        styleStr =
          "display:block;max-width:440px;width:100%;margin:14px auto;border-radius:14px;border:2px solid #cbd5e1;clear:both;";
      }
      return `<img src="${src}" alt="Visual Illustration" style="${styleStr}" />`;
    }
  );
}

function getWeeklyFriday8PMExamStatus(hasSubmittedCurrentExam = false) {
  const now = new Date();
  const day = now.getDay(); // 5 = Friday
  const daysUntilFriday = (5 - day + 7) % 7;

  const target = new Date(now);
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(20, 0, 0, 0); // 8:00:00 PM

  const examEndWindow = new Date(target.getTime() + 2 * 60 * 60 * 1000); // 10:00 PM Friday

  // যদি আজ শুক্রবার রাত ৮:০০টা থেকে ১০:০০টার মধ্যে হয় এবং শিক্ষার্থী এখনো খাতা জমা না দিয়ে থাকে:
  if (
    daysUntilFriday === 0 &&
    now >= target &&
    now <= examEndWindow &&
    !hasSubmittedCurrentExam
  ) {
    return {
      targetDate: target,
      isExamLiveNow: true, // কাউন্টডাউন শেষ, এখন লাইভ পরীক্ষা চলছে!
      registrationOpen: false,
      scheduleLabel:
        "শুক্রবার রাত ৮:০০টার লাইভ পরীক্ষা এখন চলছে! (রেজিস্ট্রেশন সমাপ্ত)",
    };
  }

  // যদি পরীক্ষা শেষ হয়ে যায় (রাত ১০টার পরে অথবা শিক্ষার্থী ২০০ MCQ পরীক্ষা সম্পন্ন করে ফেলে),
  // তাহলে তাৎক্ষণিকভাবে পরবর্তী শুক্রবারের (৭ দিন পরের) কাউন্টডাউন শুরু হবে:
  if (
    daysUntilFriday === 0 &&
    (now > examEndWindow || (now >= target && hasSubmittedCurrentExam))
  ) {
    target.setDate(target.getDate() + 7);
  }

  return {
    targetDate: target,
    isExamLiveNow: false,
    registrationOpen: true,
    scheduleLabel:
      "প্রতি শুক্রবার রাত ৮:০০টায় সাপ্তাহিক লাইভ পরীক্ষা (মাসে ৪টি পরীক্ষা)",
  };
}

function parseBulkQuestionsTextOrJson(rawText, maxSlots = 200) {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

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
              : [
                  item.opt0 || "",
                  item.opt1 || "",
                  item.opt2 || "",
                  item.opt3 || "",
                ],
          correctAnswer: Number(item.correctAnswer || 0),
          explanation: item.explanation || "",
        }));
      }
    } catch (e) {}
  }

  const blocks = trimmed.split(/\n\s*\n/).filter((b) => b.trim().length > 5);
  const parsedList = [];

  blocks.forEach((block, idx) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return;

    let questionText = lines[0]
      .replace(/^(Q\d*[:.)]|প্রশ্ন\s*\d*[:.)]|\d+[.)])\s*/i, "")
      .trim();
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
        const val = line
          .replace(/^(Ans|Answer|সঠিক|উত্তর)[:\s]+/i, "")
          .trim()
          .toUpperCase();
        if (val.startsWith("A") || val.startsWith("ক") || val === "0")
          correctIdx = 0;
        else if (val.startsWith("B") || val.startsWith("খ") || val === "1")
          correctIdx = 1;
        else if (val.startsWith("C") || val.startsWith("গ") || val === "2")
          correctIdx = 2;
        else if (val.startsWith("D") || val.startsWith("ঘ") || val === "3")
          correctIdx = 3;
      } else if (/^(Exp|Explanation|ব্যাখ্যা)[:\s]/i.test(line)) {
        explanation = line
          .replace(/^(Exp|Explanation|ব্যাখ্যা)[:\s]+/i, "")
          .trim();
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
    { id: "bangladesh", title: "বাংলাদেশ বিষয়াবলি", cat: "general" },
    { id: "international", title: "আন্তর্জাতিক বিষয়াবলি", cat: "general" },
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
 * COMPONENT: RICH TEXT & SHORT-TOKEN IMAGE EDITOR
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

  const applyFormattingWithoutScrollJump = (openTag, closeTag) => {
    const el = textareaRef.current;
    if (!el) return;
    const savedScrollTop = el.scrollTop;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end) || "এখানে লিখুন";
    const updated =
      value.substring(0, start) +
      openTag +
      selectedText +
      closeTag +
      value.substring(end);

    onChange(updated);

    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      el.scrollTop = savedScrollTop;
      el.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length
      );
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
      const nextText =
        value.substring(0, pos) + tokenString + value.substring(pos);
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
          <span className="font-extrabold text-xs sm:text-sm text-slate-900">
            {label}
          </span>

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
              <Upload className="w-3.5 h-3.5" /> ইমেজ নিন
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAddShortTokenImage(e.target.files?.[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

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
              applyFormattingWithoutScrollJump(
                '<span style="color:#dc2626;font-weight:700;">',
                "</span>"
              )
            }
            className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🔴 লাল
          </button>
          <button
            type="button"
            onClick={() =>
              applyFormattingWithoutScrollJump(
                '<span style="color:#2563eb;font-weight:700;">',
                "</span>"
              )
            }
            className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🔵 নীল
          </button>
          <button
            type="button"
            onClick={() =>
              applyFormattingWithoutScrollJump(
                '<span style="color:#059669;font-weight:700;">',
                "</span>"
              )
            }
            className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-extrabold cursor-pointer"
          >
            🟢 সবুজ
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
        </div>
      </div>

      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${placeholder}`}
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
function MiniExecutive2DAvatar({ size = "w-14 h-14" }) {
  return (
    <div
      className={`${size} rounded-full bg-amber-300 border-2 border-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path
          d="M18 95 C20 65, 35 58, 50 58 C65 58, 80 65, 82 95 Z"
          fill="#2e1065"
        />
        <polygon points="38,58 62,58 50,86" fill="#ffffff" />
        <polygon points="47,64 53,64 55,84 50,90 45,84" fill="#5b21b6" />
        <ellipse cx="50" cy="36" rx="16" ry="18" fill="#fed7aa" />
        <path
          d="M33 32 C32 16, 48 12, 60 16 C68 18, 70 28, 66 34 C62 24, 52 22, 42 24 Z"
          fill="#1e1b4b"
        />
      </svg>
    </div>
  );
}

/**
 * ============================================================================
 * COMPONENT: 3D NEON HERO ILLUSTRATION
 * ============================================================================
 */
function GatewayBooksExamTargetIllustration() {
  return (
    <div className="relative w-full max-w-[330px] mx-auto select-none flex items-center justify-center">
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-fuchsia-600/35 via-purple-500/25 to-pink-500/30 blur-2xl" />
      <svg
        viewBox="0 0 340 250"
        className="relative z-10 w-full h-auto drop-shadow-2xl"
      >
        <ellipse
          cx="165"
          cy="215"
          rx="135"
          ry="22"
          fill="none"
          stroke="#ec4899"
          strokeWidth="2"
          strokeOpacity="0.45"
        />
        <ellipse
          cx="165"
          cy="215"
          rx="105"
          ry="15"
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />

        <g transform="translate(22, 136)">
          <path
            d="M10 20 L145 5 L175 26 L175 62 L140 78 L10 60 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="2"
          />
          <path d="M12 24 L138 10 L138 46 L12 56 Z" fill="#b91c1c" />
          <path d="M140 10 L172 28 L172 58 L140 74 Z" fill="#fef2f2" />
          <text
            x="26"
            y="45"
            fill="#ffffff"
            fontSize="21"
            fontWeight="900"
            letterSpacing="1"
            transform="rotate(-4 60 40)"
          >
            DEFENSE
          </text>
        </g>

        <g transform="translate(28, 86)">
          <path
            d="M10 22 L138 6 L168 25 L168 58 L135 72 L10 56 Z"
            fill="#1d4ed8"
            stroke="#1e3a8a"
            strokeWidth="2"
          />
          <path d="M12 25 L134 11 L134 45 L12 53 Z" fill="#1e40af" />
          <path d="M135 11 L164 26 L164 54 L135 68 Z" fill="#eff6ff" />
          <text
            x="38"
            y="44"
            fill="#ffffff"
            fontSize="24"
            fontWeight="900"
            letterSpacing="1.5"
            transform="rotate(-4 60 40)"
          >
            BCS
          </text>
        </g>

        <g transform="translate(36, 26)">
          <polygon
            points="65,8 130,30 65,52 0,30"
            fill="#1e1b4b"
            stroke="#6366f1"
            strokeWidth="2"
          />
          <path
            d="M28 40 L28 64 C28 74, 102 74, 102 64 L102 40"
            fill="#312e81"
            stroke="#4f46e5"
            strokeWidth="1.5"
          />
          <path
            d="M112 35 L120 68"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="120" cy="70" r="4.5" fill="#f59e0b" />
        </g>

        <g transform="translate(158, 56) rotate(4)">
          <rect
            x="0"
            y="0"
            width="98"
            height="132"
            rx="10"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="3"
          />
          <text x="20" y="28" fill="#0f172a" fontSize="19" fontWeight="900">
            EXAM
          </text>
          <rect
            x="14"
            y="42"
            width="14"
            height="14"
            rx="3"
            fill="#fff1f2"
            stroke="#e11d48"
            strokeWidth="2"
          />
          <path
            d="M17 49 L21 53 L27 44"
            stroke="#e11d48"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="36" y="46" width="46" height="6" rx="3" fill="#cbd5e1" />

          <rect
            x="14"
            y="68"
            width="14"
            height="14"
            rx="3"
            fill="#fff1f2"
            stroke="#e11d48"
            strokeWidth="2"
          />
          <path
            d="M17 75 L21 79 L27 70"
            stroke="#e11d48"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="36" y="72" width="46" height="6" rx="3" fill="#cbd5e1" />

          <rect
            x="14"
            y="94"
            width="14"
            height="14"
            rx="3"
            fill="#fff1f2"
            stroke="#e11d48"
            strokeWidth="2"
          />
          <path
            d="M17 101 L21 105 L27 96"
            stroke="#e11d48"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="36" y="98" width="40" height="6" rx="3" fill="#cbd5e1" />
        </g>

        <g transform="translate(262, 52) rotate(22)">
          <rect
            x="0"
            y="0"
            width="14"
            height="95"
            rx="3"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="1.5"
          />
          <polygon points="0,0 7,-16 14,0" fill="#fde68a" />
          <polygon points="4,-10 7,-16 10,-10" fill="#0f172a" />
          <rect x="0" y="88" width="14" height="10" rx="2" fill="#f43f5e" />
        </g>

        <g transform="translate(238, 162)">
          <circle
            cx="0"
            cy="0"
            r="38"
            fill="#e11d48"
            stroke="#fecdd3"
            strokeWidth="3"
          />
          <circle cx="0" cy="0" r="26" fill="#ffffff" />
          <circle cx="0" cy="0" r="15" fill="#e11d48" />
          <circle cx="0" cy="0" r="6" fill="#fbbf24" />
          <line
            x1="28"
            y1="-26"
            x2="2"
            y2="-2"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="0,0 10,-3 4,-10" fill="#0f172a" />
        </g>
      </svg>
    </div>
  );
}

/**
 * ============================================================================
 * COMPONENT: POST-EXAM SUBJECT-WISE WRONG ANSWERS REVIEWER
 * ============================================================================
 */
function WrongAnswersSubjectReviewPanel({
  questions = [],
  answersMap = {},
  isCombinedExam = false,
}) {
  const [showWrongPanel, setShowWrongPanel] = useState(false);
  const [selectedWrongSubject, setSelectedWrongSubject] = useState("ALL");
  const wrongListRef = useRef(null);

  const wrongQuestionsList = questions
    .map((q, idx) => {
      const qKey = isCombinedExam ? q.qNo || idx + 1 : q._id || q.qNo || idx;
      const studentChoice = answersMap?.[qKey];
      const isAnsweredWrong =
        studentChoice !== undefined &&
        Number(studentChoice) !== Number(q.correctAnswer);
      return {
        ...q,
        displayQNo: q.qNo || idx + 1,
        studentChoice: Number(studentChoice),
        subjectId: q.subjectId || "general",
        subjectTitle: q.subjectTitle || "সাধারণ বিষয়",
        isAnsweredWrong,
      };
    })
    .filter((item) => item.isAnsweredWrong);

  if (wrongQuestionsList.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-sm flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          অভিনন্দন! আপনার প্রদত্ত উত্তরগুলোর মধ্যে কোনো ভুল উত্তর নেই।
        </span>
      </div>
    );
  }

  const subjectGroups = wrongQuestionsList.reduce((acc, item) => {
    const key = item.subjectTitle;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const visibleWrongQuestions =
    selectedWrongSubject === "ALL"
      ? wrongQuestionsList
      : wrongQuestionsList.filter(
          (q) => q.subjectTitle === selectedWrongSubject
        );

  return (
    <div
      ref={wrongListRef}
      className="bg-white rounded-3xl border-2 border-rose-200 p-5 sm:p-6 shadow-xs space-y-5 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black">
            <XCircle className="w-4 h-4" /> ভুল উত্তর বিশ্লেষণ (মোট ভুল:{" "}
            {wrongQuestionsList.length}টি প্রশ্ন)
          </span>
          <h4 className="text-lg sm:text-xl font-black text-slate-900">
            যে প্রশ্নগুলোর উত্তর ভুল হয়েছে সেগুলো বিষয়ভিত্তিক দেখুন
          </h4>
        </div>

        <button
          type="button"
          onClick={() => {
            const nextState = !showWrongPanel;
            setShowWrongPanel(nextState);
            if (nextState) {
              setTimeout(() => {
                wrongListRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);
            }
          }}
          className="premium-btn px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
        >
          <AlertCircle className="w-4 h-4" />
          <span>
            {showWrongPanel
              ? "ভুল প্রশ্নগুলো লুকান"
              : `ভুল উত্তর দেওয়া ${wrongQuestionsList.length}টি প্রশ্ন দেখুন →`}
          </span>
        </button>
      </div>

      {showWrongPanel && (
        <div className="space-y-5 pt-3 border-t border-rose-100">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedWrongSubject("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                selectedWrongSubject === "ALL"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-900 border border-rose-200"
              }`}
            >
              সকল বিষয় ({wrongQuestionsList.length}টি ভুল)
            </button>
            {Object.entries(subjectGroups).map(([subTitle, count]) => (
              <button
                key={subTitle}
                type="button"
                onClick={() => setSelectedWrongSubject(subTitle)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                  selectedWrongSubject === subTitle
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-800 hover:bg-rose-50"
                }`}
              >
                {subTitle} ({count}টি ভুল)
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {visibleWrongQuestions.map((q) => (
              <div
                key={q.displayQNo}
                className="p-5 rounded-2xl border-2 border-rose-200 bg-rose-50/20 space-y-3.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h5 className="font-black text-base sm:text-lg text-slate-900">
                    প্রশ্ন #{q.displayQNo}: {q.question}
                  </h5>
                  <span className="px-3 py-1 rounded-lg bg-purple-100 text-[#2e1065] text-xs font-extrabold shrink-0">
                    {q.subjectTitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(q.options || []).map((opt, optIdx) => {
                    const isStudentWrongPick = q.studentChoice === optIdx;
                    const isCorrectOpt = Number(q.correctAnswer) === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl border text-sm font-bold flex items-center justify-between gap-2 ${
                          isCorrectOpt
                            ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-black"
                            : isStudentWrongPick
                            ? "bg-rose-100 border-2 border-rose-500 text-rose-950 font-black"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <span>
                          {String.fromCharCode(2453 + optIdx)}. {opt}
                        </span>
                        {isCorrectOpt && (
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-black shrink-0">
                            ✓ সঠিক উত্তর
                          </span>
                        )}
                        {isStudentWrongPick && !isCorrectOpt && (
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-black shrink-0">
                            ✗ আপনার ভুল উত্তর
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong className="text-amber-950">💡 ব্যাখ্যা:</strong>{" "}
                    {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * MAIN PLATFORM APPLICATION COMPONENT
 * ============================================================================
 */
export default function BCSPathPlatform() {
  const studyResourceRef = useRef(null);
  const vocabReaderRef = useRef(null);
  const qbankReaderRef = useRef(null);
  const bonusReaderRef = useRef(null);
  const mockCardsSectionRef = useRef(null);
  const leaderboardSectionRef = useRef(null);

  const smoothScrollToRef = (refObj) => {
    setTimeout(() => {
      if (refObj?.current) {
        refObj.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  };

  // Portal State: "gateway" | "defense_hub" | "course_app"
  const [activePortal, setActivePortal] = useState("gateway");
  const [selectedCourse, setSelectedCourse] = useState("bcs");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [navHistory, setNavHistory] = useState([]);

  // Core Database Collections
  const [lectures, setLectures] = useState([]);
  const [vocabStories, setVocabStories] = useState([]);
  const [qbankDocs, setQbankDocs] = useState([]);
  const [examSets, setExamSets] = useState([]);
  const [contests, setContests] = useState([]);
  const [jobUpdates, setJobUpdates] = useState([]);
  const [bonusItems, setBonusItems] = useState([]);
  const [syllabusItems, setSyllabusItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [studentsCount, setStudentsCount] = useState(1);
  const [dbLoading, setDbLoading] = useState(true);

  const [progressMap, setProgressMap] = useState({});
  const [completedQuizzesCount, setCompletedQuizzesCount] = useState(0);

  // Student Identity, Profile & Enrolled Courses
  const fileInputRef = useRef(null);
  const [studentUniqueKey, setStudentUniqueKey] = useState("student_default");
  const [profile, setProfile] = useState({
    name: "Amir Hamza",
    phone: "",
    targetBcs: "লক্ষ্য: বিসিএস",
    institution: "Metropolitan University, Sylhet",
    hideProfile: false,
    avatarUrl: "",
    enrolledCourses: ALL_COURSE_KEYS,
  });
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Course-Based Access Verification Modal
  const [courseToUnlock, setCourseToUnlock] = useState(null);

  // Notification Dropdown State
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Syllabus Popup Modal State (Requirement 5)
  const [activeSyllabusModalData, setActiveSyllabusModalData] = useState(null);

  // Previous Exam Result & Top 100 Leaderboard Modal (Requirement 1.গ)
  const [showPreviousResultModal, setShowPreviousResultModal] = useState(false);

  // Job Updates Modal
  const [showJobNewsModal, setShowJobNewsModal] = useState(false);
  const [activeJobArticle, setActiveJobArticle] = useState(null);

  // Bonus Content State
  const [selectedBonusSubject, setSelectedBonusSubject] = useState("ALL");
  const [activeBonusItem, setActiveBonusItem] = useState(null);

  // Current Course Subjects
  const currentCourseSubjects = getSubjectsForCourse(selectedCourse);

  // Lecture & Story Vocabulary State
  const [activeSubjectId, setActiveSubjectId] = useState("bangla");
  const [activeLecture, setActiveLecture] = useState(null);
  const [activePdfStep, setActivePdfStep] = useState("lecture");
  const [activeVocabStory, setActiveVocabStory] = useState(null);
  const [contentViewMode, setContentViewMode] = useState("pdf");
  const [studentTwoColumnOverride, setStudentTwoColumnOverride] =
    useState(null);
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

  // Weekly Live Exam State
  const [countdownParts, setCountdownParts] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    label: "",
    isExamLiveNow: false,
    registrationOpen: true,
  });
  const [showContestRegModal, setShowContestRegModal] = useState(false);
  const [contestRegForm, setContestRegForm] = useState({
    name: "",
    phone: "",
    institution: "",
    paymentMethod: "bkash",
  });
  const [registeredCycleInLocal, setRegisteredCycleInLocal] = useState(0);
  const [isContestRoomActive, setIsContestRoomActive] = useState(false);
  const [contestAnswers, setContestAnswers] = useState({});
  const [contestTimeLeft, setContestTimeLeft] = useState(0);
  const [contestSubmitting, setContestSubmitting] = useState(false);

const hasCompletedCurrentWeeklyExam = Boolean(
    contests[0]?.submissions?.some(
      (sub) =>
        sub.studentKey === studentUniqueKey ||
        (profile.phone && sub.phone === profile.phone)
    )
  );

  useEffect(() => {
    const updateCountdown = () => {
      const { targetDate, isExamLiveNow, registrationOpen, scheduleLabel } =
        getWeeklyFriday8PMExamStatus(hasCompletedCurrentWeeklyExam);
      const diffMs = Math.max(0, targetDate.getTime() - Date.now());
      const totalSec = Math.floor(diffMs / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setCountdownParts({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        label: scheduleLabel,
        isExamLiveNow,
        registrationOpen,
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [hasCompletedCurrentWeeklyExam]);

  // Admin CMS State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminCourseTrack, setAdminCourseTrack] = useState("bcs");
  const [adminSection, setAdminSection] = useState("lectures");
  const [adminLectureFilterSubject, setAdminLectureFilterSubject] =
    useState("ALL");
  const [editingId, setEditingId] = useState(null);

  // Optional Notification Controls in Admin Forms
  const [sendAdminNotification, setSendAdminNotification] = useState(true);
  const [customAdminNotifText, setCustomAdminNotifText] = useState("");

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

  const [jobNewsForm, setJobNewsForm] = useState({
    title: "",
    categoryBadge: "নিয়োগ বিজ্ঞপ্তি ও আপডেট",
    publishDateText: "",
    coverImageUrl: "",
    articleContent: "",
    twoColumnDesktop: true,
    embeddedImages: {},
  });
  const [editingJobNewsId, setEditingJobNewsId] = useState(null);

  const [bonusForm, setBonusForm] = useState({
    courseType: "bcs",
    subjectId: "ALL",
    subjectTitle: "সকল বিষয় (স্পেশাল গাইডলাইন)",
    title: "",
    videoUrl: "",
    pdfUrl: "",
    content: "",
    twoColumnDesktop: false,
    embeddedImages: {},
  });
  const [editingBonusId, setEditingBonusId] = useState(null);

  // Admin Syllabus Builder Form (For Popup Syllabus)
  const [syllabusForm, setSyllabusForm] = useState({
    courseType: "bcs",
    subjectId: "bangla",
    topicIndex: 1,
    topicTitle: "",
    marksText: "১৫ নম্বর",
    shortSummary: "",
    detailedPopupContent: "",
    vivaGuidelines: "",
    embeddedImages: {},
  });
  const [editingSyllabusId, setEditingSyllabusId] = useState(null);

  // Admin Direct Announcement Notification Form
  const [customNoticeForm, setCustomNoticeForm] = useState({
    courseType: "ALL",
    title: "",
    message: "",
    targetTab: "dashboard",
  });

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

  const [contestBuilderMeta, setContestBuilderMeta] = useState({
    contestId: "bcs-biweekly-main",
    title:
      "৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)",
    examWindowText: "এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড",
    resetSubmissions: false,
  });
  const [template200Questions, setTemplate200Questions] = useState(() =>
    createEmpty200QuestionsTemplate()
  );
  const [active200Range, setActive200Range] = useState("1-25");
  const [bulk200TextInput, setBulk200TextInput] = useState("");

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
    } else if (selectedCourse !== "bcs") {
      setActivePortal("defense_hub");
    } else {
      setActivePortal("gateway");
    }
  };

  /**
   * Enter a specific course dashboard with Course-Based Access Control
   * & Automatic Profile Target Alignment (Requirement 6)
   */
  const enterCourseDashboard = (courseKey, targetTab = "dashboard") => {
    const enrolledList = profile.enrolledCourses || ALL_COURSE_KEYS;
    if (!enrolledList.includes(courseKey)) {
      setCourseToUnlock(courseKey);
      return;
    }

    setSelectedCourse(courseKey);
    setActivePortal("course_app");
    setActiveTab(targetTab);
    setNavHistory([]);

    const subs = getSubjectsForCourse(courseKey);
    const defaultSub = subs[0]?.id || "bangla";
    setActiveSubjectId(defaultSub);
    setMockFilterSubject(defaultSub);
    setSelectedQbSubject("ALL");
    setSelectedBonusSubject("ALL");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch Cloud Data
  const fetchCloudData = async (uKeyOverride = "", phoneOverride = "") => {
    setDbLoading(true);
    try {
      const qKey = uKeyOverride || studentUniqueKey || "";
      const qPhone = phoneOverride || profile.phone || "";
      const res = await fetch(
        `/api/platform?studentKey=${encodeURIComponent(
          qKey
        )}&phone=${encodeURIComponent(qPhone)}`
      );
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
        setJobUpdates(data.jobUpdates || []);
        if (data.jobUpdates?.length > 0 && !activeJobArticle) {
          setActiveJobArticle(data.jobUpdates[0]);
        }
        setBonusItems(data.bonusItems || []);
        if (data.bonusItems?.length > 0 && !activeBonusItem) {
          setActiveBonusItem(data.bonusItems[0]);
        }
        setSyllabusItems(data.syllabusItems || []);
        setNotifications(data.notifications || []);
        setStudentsCount(data.studentsCount || 1);

        if (data.studentProfileDoc) {
          setProfile((prev) => ({
            ...prev,
            name: data.studentProfileDoc.name || prev.name,
            phone: data.studentProfileDoc.phone || prev.phone,
            institution: data.studentProfileDoc.institution || prev.institution,
            avatarUrl: data.studentProfileDoc.avatarUrl || prev.avatarUrl,
            enrolledCourses:
              data.studentProfileDoc.enrolledCourses?.length > 0
                ? data.studentProfileDoc.enrolledCourses
                : prev.enrolledCourses,
          }));
        }

        if (data.contests?.length > 0) {
          const activeC = data.contests[0];
          setContestBuilderMeta((prev) => ({
            ...prev,
            contestId: activeC.contestId,
            title: activeC.title,
            examWindowText: activeC.examWindowText,
          }));
          const merged200 = createEmpty200QuestionsTemplate().map((slot) => {
            const found = activeC.questions?.find(
              (q) => Number(q.qNo) === slot.qNo
            );
            return found
              ? {
                  qNo: slot.qNo,
                  subjectId: found.subjectId || slot.subjectId,
                  subjectTitle: found.subjectTitle || slot.subjectTitle,
                  category: found.category || slot.category,
                  question: found.question || "",
                  options:
                    found.options?.length === 4
                      ? [...found.options]
                      : ["", "", "", ""],
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
    let uKey = localStorage.getItem("bcs_student_unique_key");
    if (!uKey) {
      uKey =
        "stu_" +
        Math.random().toString(36).substring(2, 10) +
        "_" +
        Date.now();
      localStorage.setItem("bcs_student_unique_key", uKey);
    }
    setStudentUniqueKey(uKey);

    let savedPhone = "";
    const savedProf = localStorage.getItem("bcs_student_profile");
    if (savedProf) {
      try {
        const parsed = JSON.parse(savedProf);
        savedPhone = parsed.phone || "";
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          enrolledCourses:
            parsed.enrolledCourses?.length > 0
              ? parsed.enrolledCourses
              : ALL_COURSE_KEYS,
        }));
        setContestRegForm((prev) => ({
          ...prev,
          name: parsed.name || "",
          phone: parsed.phone || "",
          institution: parsed.institution || "",
        }));
      } catch (e) {}
    }

    const savedCycle = Number(
      localStorage.getItem("bcs_contest_registered_cycle") || 0
    );
    setRegisteredCycleInLocal(savedCycle);

    const savedProg = localStorage.getItem("bcs_lecture_progress_v2");
    if (savedProg) {
      try {
        setProgressMap(JSON.parse(savedProg));
      } catch (e) {}
    }
    const savedQuizzes = localStorage.getItem("bcs_completed_quizzes_count");
    if (savedQuizzes) setCompletedQuizzesCount(Number(savedQuizzes) || 0);

    fetchCloudData(uKey, savedPhone);
  }, []);

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
        const found = existingSet.questions?.find(
          (q) => Number(q.qNo) === emptySlot.qNo
        );
        return found
          ? {
              qNo: emptySlot.qNo,
              question: found.question || "",
              options:
                found.options?.length === 4
                  ? [...found.options]
                  : ["", "", "", ""],
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
        setExamBuilderMeta((prev) => ({
          ...prev,
          chapterName: matchedLec.title,
        }));
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
    const subs = getSubjectsForCourse(track);
    const defaultSub = subs[0]?.id || "bangla";
    setFormData((prev) => ({
      ...prev,
      courseType: track,
      subjectId: defaultSub,
    }));
    setQbFormData((prev) => ({
      ...prev,
      courseType: track,
      subjectId: defaultSub,
    }));
    setBonusForm((prev) => ({ ...prev, courseType: track, subjectId: "ALL" }));
    setSyllabusForm((prev) => ({
      ...prev,
      courseType: track,
      subjectId: defaultSub,
    }));
    setExamBuilderMeta((prev) => ({
      ...prev,
      courseType: track,
      subjectId: defaultSub,
      lectureNo: 1,
      chapterName: "Lecture 01",
    }));
    if (
      track !== "bcs" &&
      (adminSection === "biweekly_200" || adminSection === "vocab_stories")
    ) {
      setAdminSection("lectures");
    }
  };

  const courseFilteredLectures = lectures.filter(
    (l) => (l.courseType || "bcs") === selectedCourse
  );

  const getSubjectDynamicStats = (subId) => {
    const subLecs = courseFilteredLectures.filter((l) => l.subjectId === subId);
    const totalCount = subLecs.length;
    const completedCount = subLecs.filter(
      (l) => progressMap[l._id || l.id]?.completed
    ).length;
    const percent =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { totalCount, completedCount, percent };
  };

  const totalUploadedLectures = courseFilteredLectures.length;
  const totalCompletedLectures = courseFilteredLectures.filter(
    (l) => progressMap[l._id || l.id]?.completed
  ).length;
  const overallProgressPercent =
    totalUploadedLectures > 0
      ? Math.round((totalCompletedLectures / totalUploadedLectures) * 100)
      : 0;

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
          payload: {
            ...newProf,
            studentKey: studentUniqueKey,
            phone: newProf.phone || studentUniqueKey,
          },
        }),
      });
    } catch (e) {}
  };

  const handleUnlockCourseAccess = async (courseKey) => {
    const nextCourses = Array.from(
      new Set([...(profile.enrolledCourses || []), courseKey])
    );
    await updateProfile({ enrolledCourses: nextCourses });
    try {
      await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ENROLL_COURSE",
          payload: {
            studentKey: studentUniqueKey,
            phone: profile.phone || studentUniqueKey,
            name: profile.name,
            courseKey,
          },
        }),
      });
    } catch (e) {}
    setCourseToUnlock(null);
    enterCourseDashboard(courseKey);
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

  const handleAdminPdfFileSelect = (e, fieldName, targetType = "lecture") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4.5 * 1024 * 1024) {
      alert(
        "⚠️ ৪.৫ মেগাবাইটের চেয়ে বড় PDF হলে Google Drive-এ আপলোড করে লিংকটি পেস্ট করুন!"
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (targetType === "qbank")
        setQbFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      else if (targetType === "bonus")
        setBonusForm((prev) => ({ ...prev, [fieldName]: reader.result }));
      else setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleVocabStoryImageUpload = (e, imgField, targetType = "vocab") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert("⚠️ ইমেজের সাইজ সর্বোচ্চ ২.৫ মেগাবাইট হতে পারবে!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (targetType === "job_news") {
        setJobNewsForm((prev) => ({ ...prev, [imgField]: reader.result }));
      } else {
        setVocabFormData((prev) => ({ ...prev, [imgField]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const launchSpecificExamSet = (examSetDoc) => {
    if (
      !examSetDoc ||
      !examSetDoc.questions ||
      examSetDoc.questions.length === 0
    ) {
      alert("⚠️ এই টেস্টে এখনো কোনো প্রশ্ন সেট করা হয়নি!");
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
      else if (Number(examAnswers[qKey]) === Number(q.correctAnswer))
        correct += 1;
      else wrong += 1;
    });

    const negativePenalty = wrong * 0.5;
    const finalScore = Math.max(0, correct - negativePenalty);
    const passMarkRequired = +(totalQ * 0.6).toFixed(2);
    const scorePercentage =
      totalQ > 0 ? Math.round((finalScore / totalQ) * 100) : 0;
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
   * WEEKLY LIVE EXAM STATUS, PERSISTENT REGISTRATION & PREVIOUS RESULTS LOGIC
   * Requirement 1: Never show "ফলাফল দেখুন" on refresh if not registered!
   * ==========================================================================
   */
  const currentActiveContest = contests[0] || null;
  const currentContestCycle = Number(currentActiveContest?.cycleNumber || 1);

  // 1. Check if student is registered for the CURRENT upcoming weekly exam cycle
  const isRegisteredInCurrentCycleCloud =
    currentActiveContest?.registrations?.some(
      (r) =>
        (r.studentKey === studentUniqueKey ||
          (profile.phone && r.phone === profile.phone)) &&
        Number(r.cycleNumber || 1) === currentContestCycle
    ) || false;

  const isRegisteredForCurrentCycle =
    isRegisteredInCurrentCycleCloud ||
    registeredCycleInLocal === currentContestCycle;

  // 2. Check if student has submitted the CURRENT exam cycle
  const myCurrentCycleSubmission =
    currentActiveContest?.submissions?.find(
      (sub) =>
        sub.studentKey === studentUniqueKey ||
        (profile.phone && sub.phone === profile.phone)
    ) || null;

  // 3. Check if student participated in the PREVIOUS exam (Archive or Completed Current)
  const archivedPreviousContest =
    currentActiveContest?.previousContestArchive?.submissions?.length > 0
      ? currentActiveContest.previousContestArchive
      : null;

  const myArchivedSubmission =
    archivedPreviousContest?.submissions?.find(
      (sub) =>
        sub.studentKey === studentUniqueKey ||
        (profile.phone && sub.phone === profile.phone)
    ) || null;

  // A student has a previous exam participation record ONLY if they actually submitted an exam
  const myLatestParticipatedSubmission =
    myCurrentCycleSubmission || myArchivedSubmission || null;

  const activeLeaderboardSource = myCurrentCycleSubmission
    ? currentActiveContest?.submissions || []
    : archivedPreviousContest?.submissions ||
      currentActiveContest?.submissions ||
      [];

  const sortedLeaderboard = [...activeLeaderboardSource].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if ((b.englishScore || 0) !== (a.englishScore || 0))
      return (b.englishScore || 0) - (a.englishScore || 0);
    if ((b.mathScore || 0) !== (a.mathScore || 0))
      return (b.mathScore || 0) - (a.mathScore || 0);
    return new Date(a.submittedAt) - new Date(b.submittedAt);
  });

  // Top 100 Leaderboard (Requirement 1.গ)
  const top100Leaderboard = sortedLeaderboard.slice(0, 100);

  const myLeaderboardRank = myLatestParticipatedSubmission
    ? sortedLeaderboard.findIndex(
        (s) =>
          s.studentKey === myLatestParticipatedSubmission.studentKey ||
          (profile.phone && s.phone === profile.phone)
      ) + 1
    : null;

  const handleContestRegistrationSubmit = async (e) => {
    e.preventDefault();

    if (!countdownParts.registrationOpen && !isRegisteredForCurrentCycle) {
      alert(
        "⛔ শুক্রবার রাত ৮:০০টার পরীক্ষা শুরু হয়ে গেছে! পরীক্ষা শুরু হওয়ার পর নতুন রেজিস্ট্রেশন গ্রহণ করা হয় না।"
      );
      return;
    }

    if (
      !contestRegForm.name.trim() ||
      !contestRegForm.phone.trim() ||
      !contestRegForm.institution.trim()
    ) {
      alert(
        "⚠️ পরীক্ষায় অংশগ্রহণের জন্য আপনার নাম, মোবাইল নম্বর এবং শিক্ষাপ্রতিষ্ঠানের নাম পূরণ করুন!"
      );
      return;
    }

    await updateProfile({
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
            paymentMethod: contestRegForm.paymentMethod || "bkash",
          },
        }),
      });
    } catch (err) {}

    localStorage.setItem(
      "bcs_contest_registered_cycle",
      String(currentContestCycle)
    );
    setRegisteredCycleInLocal(currentContestCycle);
    setShowContestRegModal(false);

    await fetchCloudData(studentUniqueKey, contestRegForm.phone.trim());
  };

  const handleOpenRegistrationModal = () => {
    if (!countdownParts.registrationOpen && !isRegisteredForCurrentCycle) {
      alert(
        "⛔ পরীক্ষা শুরু হয়ে গেছে! পরীক্ষা শুরু হওয়ার ঠিক আগের মুহূর্ত পর্যন্ত রেজিস্ট্রেশন করার সুযোগ ছিল।"
      );
      return;
    }
    setContestRegForm({
      name: profile.name || "",
      phone: profile.phone || "",
      institution: profile.institution || "",
      paymentMethod: "bkash",
    });
    setShowContestRegModal(true);
  };

const handleLaunchWeeklyLiveExamRoom = () => {
    setSelectedCourse("bcs");
    setActivePortal("course_app");
    setActiveTab("biweekly_contest");

    if (myCurrentCycleSubmission) {
      smoothScrollToRef(leaderboardSectionRef);
      return;
    }

    if (!isRegisteredForCurrentCycle) {
      handleOpenRegistrationModal();
      return;
    }

    // কঠোর নিরাপত্তা: কাউন্টডাউন শেষ না হলে কখনোই প্রশ্ন ওপেন হবে না!
    if (!countdownParts.isExamLiveNow) {
      alert(
        "⏳ এখনো পরীক্ষার সময় হয়নি! নির্ধারিত কাউন্টডাউন শেষ হলে ঠিক শুক্রবার রাত ৮:০০টায় প্রশ্ন ওপেন হবে।"
      );
      return;
    }

    if (!currentActiveContest || !currentActiveContest.questions?.length) {
      alert(
        "⚠️ অ্যাডমিন প্যানেল থেকে এখনো এই পর্বের প্রশ্ন প্রকাশ করা হয়নি!"
      );
      return;
    }

    setContestAnswers({});
    setContestTimeLeft(currentActiveContest.questions.length * 36);
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
    const subMap = {};

    currentActiveContest.questions.forEach((q, idx) => {
      const qKey = q.qNo || idx + 1;
      const ans = contestAnswers[qKey];
      const subId = q.subjectId || "general";
      const subTitle =
        q.subjectTitle ||
        FULL_BCS_SUBJECTS.find((s) => s.id === subId)?.title ||
        "সাধারণ বিষয়";

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

    const weakSubjects = subjectBreakdown
      .filter((s) => s.wrong > 0 && (s.marks / s.total < 0.5 || s.wrong >= 2))
      .map((s) => `${s.subjectTitle} (ভুল: ${s.wrong}টি)`);

    const negativePenalty = wrong * 0.5;
    const totalScore = Math.max(0, +(correct - negativePenalty).toFixed(2));

    const submissionPayload = {
      studentKey: studentUniqueKey,
      phone: profile.phone || contestRegForm.phone || "",
      name: profile.name || "বিসিএস পরীক্ষার্থী",
      institution: profile.hideProfile
        ? ""
        : profile.institution || "স্বতন্ত্র পরীক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      paymentMethod: contestRegForm.paymentMethod || "bkash",
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
      alert("সাবমিট করতে সমস্যা হয়েছে!");
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
   * DYNAMIC NOTIFICATIONS FILTERING & CLICK NAVIGATION (Requirement 2)
   * ==========================================================================
   */
  const myRelevantNotifications = notifications.filter((n) => {
    const isRecipientMatch =
      n.recipientKey === "ALL" || n.recipientKey === studentUniqueKey;
    const isCourseMatch =
      n.courseType === "ALL" ||
      (profile.enrolledCourses || ALL_COURSE_KEYS).includes(n.courseType);
    return isRecipientMatch && isCourseMatch;
  });

  const unreadNotificationsCount = myRelevantNotifications.filter(
    (n) => !(n.readByKeys || []).includes(studentUniqueKey)
  ).length;

  const handleNotificationClick = async (notif) => {
    setShowNotificationMenu(false);

    // Mark as read in DB & State
    const nId = notif._id || notif.id;
    setNotifications((prev) =>
      prev.map((item) =>
        (item._id || item.id) === nId
          ? {
              ...item,
              readByKeys: Array.from(
                new Set([...(item.readByKeys || []), studentUniqueKey])
              ),
            }
          : item
      )
    );

    try {
      await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "MARK_NOTIFICATION_READ",
          payload: { notificationId: nId, studentKey: studentUniqueKey },
        }),
      });
    } catch (e) {}

    // Navigate directly to the relevant page/resource
    if (notif.targetTab === "job_news_modal") {
      if (notif.targetContentId) {
        const foundNews = jobUpdates.find(
          (j) => String(j._id || j.id) === String(notif.targetContentId)
        );
        if (foundNews) setActiveJobArticle(foundNews);
      }
      setShowJobNewsModal(true);
      return;
    }

    const targetCourse =
      notif.courseType && notif.courseType !== "ALL"
        ? notif.courseType
        : selectedCourse || "bcs";

    setSelectedCourse(targetCourse);
    setActivePortal("course_app");
    setActiveTab(notif.targetTab || "dashboard");

    if (notif.targetTab === "subject_lectures") {
      const subId =
        notif.targetSubjectId ||
        getSubjectsForCourse(targetCourse)[0]?.id ||
        "bangla";
      setActiveSubjectId(subId);
      if (notif.targetContentId) {
        const foundLec = lectures.find(
          (l) => String(l._id || l.id) === String(notif.targetContentId)
        );
        if (foundLec) {
          setActiveLecture(foundLec);
          setActivePdfStep(
            notif.category === "video" && foundLec.videoUrl
              ? "video"
              : "lecture"
          );
          smoothScrollToRef(studyResourceRef);
        }
      }
    } else if (notif.targetTab === "bonus_hub") {
      if (notif.targetContentId) {
        const foundBonus = bonusItems.find(
          (b) => String(b._id || b.id) === String(notif.targetContentId)
        );
        if (foundBonus) setActiveBonusItem(foundBonus);
      }
      smoothScrollToRef(bonusReaderRef);
    } else if (notif.targetTab === "qbank") {
      if (notif.targetSubjectId) setSelectedQbSubject(notif.targetSubjectId);
      smoothScrollToRef(qbankReaderRef);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        readByKeys: Array.from(
          new Set([...(item.readByKeys || []), studentUniqueKey])
        ),
      }))
    );
    try {
      await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "MARK_ALL_NOTIFICATIONS_READ",
          payload: { studentKey: studentUniqueKey },
        }),
      });
    } catch (e) {}
  };

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
      sendNotification: sendAdminNotification,
      customNotificationText: customAdminNotifText,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_LECTURE",
        adminPin: adminPinInput,
        payload,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        editingId
          ? "✅ লেকচার সফলভাবে আপডেট হয়েছে!"
          : "🎉 নতুন লেকচার পাবলিশ হয়েছে!"
      );
      setEditingId(null);
      setCustomAdminNotifText("");
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
      body: JSON.stringify({
        action: "DELETE_LECTURE",
        adminPin: adminPinInput,
        payload: { id },
      }),
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
      sendNotification: sendAdminNotification,
      customNotificationText: customAdminNotifText,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_VOCAB_STORY",
        adminPin: adminPinInput,
        payload,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        editingVocabId
          ? "✅ ভোকাবুলারি স্টোরি আপডেট হয়েছে!"
          : "🎉 নতুন ভোকাবুলারি স্টোরি পাবলিশ হয়েছে!"
      );
      setEditingVocabId(null);
      setCustomAdminNotifText("");
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
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ভোকাবুলারি স্টোরিটি ডিলিট করতে চান?"))
      return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "DELETE_VOCAB_STORY",
        adminPin: adminPinInput,
        payload: { id },
      }),
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
      sendNotification: sendAdminNotification,
      customNotificationText: customAdminNotifText,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_QBANK_DOC",
        adminPin: adminPinInput,
        payload,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ প্রশ্নব্যাংক পাবলিশ হয়েছে!");
      setEditingQbId(null);
      setCustomAdminNotifText("");
      setQbFormData((prev) => ({
        ...prev,
        title: "",
        pdfUrl: "",
        textContent: "",
        highlightBox: "",
        embeddedImages: {},
      }));
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleSaveJobNews = async (e) => {
    e.preventDefault();
    if (!jobNewsForm.title || !jobNewsForm.articleContent) {
      alert("অনুগ্রহ করে খবরের শিরোনাম ও বিস্তারিত আর্টিকেল লিখুন!");
      return;
    }
    const payload = {
      ...(editingJobNewsId ? { _id: editingJobNewsId } : {}),
      ...jobNewsForm,
      publishDateText:
        jobNewsForm.publishDateText || new Date().toLocaleDateString("bn-BD"),
      sendNotification: sendAdminNotification,
      customNotificationText: customAdminNotifText,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_JOB_NEWS",
        adminPin: adminPinInput,
        payload,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        editingJobNewsId
          ? "✅ চাকরির খবর আপডেট হয়েছে!"
          : "🎉 নতুন চাকরির আপডেট খবর প্রকাশিত হয়েছে!"
      );
      setEditingJobNewsId(null);
      setCustomAdminNotifText("");
      setJobNewsForm({
        title: "",
        categoryBadge: "নিয়োগ বিজ্ঞপ্তি ও আপডেট",
        publishDateText: "",
        coverImageUrl: "",
        articleContent: "",
        twoColumnDesktop: true,
        embeddedImages: {},
      });
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteJobNews = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই খবরটি ডিলিট করতে চান?")) return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "DELETE_JOB_NEWS",
        adminPin: adminPinInput,
        payload: { id },
      }),
    });
    const data = await res.json();
    if (data.success) fetchCloudData();
  };

  const handleSaveBonusItem = async (e) => {
    e.preventDefault();
    if (!bonusForm.title) {
      alert("অনুগ্রহ করে বোনাস টপিকের শিরোনাম দিন!");
      return;
    }
    const subList = getSubjectsForCourse(adminCourseTrack);
    const foundSub = subList.find((s) => s.id === bonusForm.subjectId);
    const payload = {
      ...(editingBonusId ? { _id: editingBonusId } : {}),
      ...bonusForm,
      courseType: adminCourseTrack,
      subjectTitle: foundSub
        ? foundSub.title
        : "সকল বিষয় (স্পেশাল গাইডলাইন)",
      sendNotification: sendAdminNotification,
      customNotificationText: customAdminNotifText,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_BONUS_ITEM",
        adminPin: adminPinInput,
        payload,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        editingBonusId
          ? "✅ Bonus কনটেন্ট আপডেট হয়েছে!"
          : "🎉 নতুন Bonus কনটেন্ট প্রকাশিত হয়েছে!"
      );
      setEditingBonusId(null);
      setCustomAdminNotifText("");
      setBonusForm((prev) => ({
        ...prev,
        title: "",
        videoUrl: "",
        pdfUrl: "",
        content: "",
        embeddedImages: {},
      }));
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteBonusItem = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই বোনাস আইটেমটি ডিলিট করতে চান?"))
      return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "DELETE_BONUS_ITEM",
        adminPin: adminPinInput,
        payload: { id },
      }),
    });
    const data = await res.json();
    if (data.success) fetchCloudData();
  };

  // Admin Syllabus Save Handler (For Popup Syllabus Window - Requirement 5)
  const handleSaveSyllabusItem = async (e) => {
    e.preventDefault();
    if (!syllabusForm.topicTitle) {
      alert("অনুগ্রহ করে সিলেবাস টপিকের শিরোনাম লিখুন!");
      return;
    }
    const subList = getSubjectsForCourse(adminCourseTrack);
    const foundSub = subList.find((s) => s.id === syllabusForm.subjectId);
    const payload = {
      ...(editingSyllabusId ? { _id: editingSyllabusId } : {}),
      ...syllabusForm,
      courseType: adminCourseTrack,
      subjectTitle: foundSub ? foundSub.title : syllabusForm.subjectId,
      sendNotification: sendAdminNotification,
      customNotificationText: customAdminNotifText,
    };
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SAVE_SYLLABUS_ITEM",
        adminPin: adminPinInput,
        payload,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        editingSyllabusId
          ? "✅ সিলেবাস টপিক আপডেট হয়েছে!"
          : "🎉 নতুন সিলেবাস পপ-আপ কনটেন্ট প্রকাশিত হয়েছে!"
      );
      setEditingSyllabusId(null);
      setCustomAdminNotifText("");
      setSyllabusForm((prev) => ({
        ...prev,
        topicIndex: Number(prev.topicIndex || 1) + 1,
        topicTitle: "",
        shortSummary: "",
        detailedPopupContent: "",
        vivaGuidelines: "",
        embeddedImages: {},
      }));
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

  const handleDeleteSyllabusItem = async (id) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই সিলেবাস টপিকটি ডিলিট করতে চান?"))
      return;
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "DELETE_SYLLABUS_ITEM",
        adminPin: adminPinInput,
        payload: { id },
      }),
    });
    const data = await res.json();
    if (data.success) fetchCloudData();
  };

  const handleSendDirectNotification = async (e) => {
    e.preventDefault();
    if (!customNoticeForm.title.trim()) {
      alert("নোটিফিকেশনের শিরোনাম লিখুন!");
      return;
    }
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SEND_CUSTOM_NOTIFICATION",
        adminPin: adminPinInput,
        payload: customNoticeForm,
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert("🔔 শিক্ষার্থীদের কাছে নোটিফিকেশন পাঠানো হয়েছে!");
      setCustomNoticeForm({
        courseType: "ALL",
        title: "",
        message: "",
        targetTab: "dashboard",
      });
      fetchCloudData();
    } else {
      alert(data.error);
    }
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

  const handleBulkFill50Slots = (rawString) => {
    const parsed = parseBulkQuestionsTextOrJson(rawString, 50);
    if (parsed.length === 0) {
      alert(
        "⚠️ কোনো প্রশ্ন শনাক্ত করা যায়নি! নমুনা ফরম্যাট অনুযায়ী প্রশ্ন দিন।"
      );
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
    alert(
      `🎉 এক ক্লিকে ${parsed.length}টি প্রশ্ন স্বয়ংক্রিয়ভাবে ১ থেকে ${parsed.length} নম্বর ঘরে বসে গেছে!`
    );
  };

  const handlePublishExamSet = async (e) => {
    e.preventDefault();
    const filledCount = template50Questions.filter(
      (q) => q.question.trim() !== ""
    ).length;
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
          sendNotification: sendAdminNotification,
          customNotificationText: customAdminNotifText,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        `🎉 Test ${examBuilderMeta.testNumber} (${filledCount}টি প্রশ্নসহ) প্রকাশিত হয়েছে!`
      );
      setCustomAdminNotifText("");
      fetchCloudData();
    } else {
      alert(data.error);
    }
  };

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

  const assignSubjectTo25Block = (rangeStr, newSubjectId) => {
    const [min, max] = rangeStr.split("-").map(Number);
    const subObj = FULL_BCS_SUBJECTS.find((s) => s.id === newSubjectId);
    const subTitle = subObj ? subObj.title : "সাধারণ বিষয়";
    const tieCat =
      newSubjectId === "english" || newSubjectId === "english_grammar"
        ? "english"
        : newSubjectId === "math"
        ? "math"
        : "general";

    setTemplate200Questions((prev) =>
      prev.map((item) =>
        item.qNo >= min && item.qNo <= max
          ? {
              ...item,
              subjectId: newSubjectId,
              subjectTitle: subTitle,
              category: tieCat,
            }
          : item
      )
    );
  };

  const handleBulkFill200Slots = (rawString, fillMode = "ALL") => {
    const parsed = parseBulkQuestionsTextOrJson(rawString, 200);
    if (parsed.length === 0) {
      alert("⚠️ ফাইল বা টেক্সটে কোনো প্রশ্ন পাওয়া যায়নি!");
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
      alert(
        `🎉 "${active200Range}" ব্লকে ${Math.min(
          25,
          parsed.length
        )}টি প্রশ্ন স্বয়ংক্রিয়ভাবে বসে গেছে!`
      );
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
      alert(
        `🎉 এক ক্লিকে ১ থেকে ${parsed.length} নম্বর স্লটে সবগুলো প্রশ্ন বসে গেছে!`
      );
    }
    setBulk200TextInput("");
  };

  const handleBulkFileUploadForQuestions = (e, targetType = "200_ALL") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      if (targetType === "50_SET") handleBulkFill50Slots(text);
      else if (targetType === "200_BLOCK")
        handleBulkFill200Slots(text, "CURRENT_25_BLOCK");
      else handleBulkFill200Slots(text, "ALL");
    };
    reader.readAsText(file);
  };

  const handlePublish200Contest = async (e) => {
    e.preventDefault();
    const filledCount = template200Questions.filter(
      (q) => q.question.trim() !== ""
    ).length;
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
          sendNotification: sendAdminNotification,
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert(
        `🎉 সাপ্তাহিক লাইভ পরীক্ষা (${filledCount}টি প্রশ্নসহ) সফলভাবে প্রকাশিত হয়েছে!`
      );
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
    currentCourseSubjects.find((s) => s.id === activeSubjectId) ||
    currentCourseSubjects[0];
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
      if (!subLecs[0].lecturePdfUrl && subLecs[0].mainContent)
        setContentViewMode("text");
      else setContentViewMode("pdf");
      setActivePdfStep(subLecs[0].videoUrl ? "video" : "lecture");
    } else {
      setActiveLecture(null);
      setActivePdfStep("lecture");
    }
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
    if (activePdfStep === "written_pdf")
      return !!activeLecture.writtenTwoColumn;
    return !!activeLecture.lectureTwoColumn;
  };

  /**
   * Helper to render the Dynamic Notification Bell & Dropdown Menu
   */
  const renderNotificationBellDropdown = (isDarkHeader = false) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotificationMenu((prev) => !prev)}
        className={`w-10 h-10 rounded-full flex items-center justify-center relative transition cursor-pointer ${
          isDarkHeader
            ? "bg-white/10 border border-purple-400/30 hover:bg-white/20 text-white"
            : "bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[#2e1065]"
        }`}
        title="নোটিফিকেশন"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-fuchsia-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#090d24]">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {showNotificationMenu && (
        <div className="
          fixed sm:absolute right-3 sm:right-0 top-16 sm:top-12
          w-[calc(100vw-24px)] sm:w-96 max-h-[78vh]
          bg-white text-slate-900 rounded-3xl shadow-2xl border-2 border-[#2e1065]
          z-50 overflow-hidden flex flex-col
        ">
          <div className="bg-gradient-to-r from-[#090d24] via-[#2e1065] to-[#4c1d95] text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-300" />
              <span className="font-black text-sm">
                নোটিফিকেশন ও আপডেট ({unreadNotificationsCount}টি নতুন)
              </span>
            </div>
            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllNotificationsRead}
                  className="text-[11px] font-extrabold text-amber-300 hover:underline cursor-pointer"
                >
                  সব পঠিত করুন
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowNotificationMenu(false)}
                className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 max-h-96">
            {myRelevantNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-slate-500">
                এই মুহূর্তে নতুন কোনো নোটিফিকেশন নেই।
              </div>
            ) : (
              myRelevantNotifications.map((item) => {
                const nId = item._id || item.id;
                const isRead = (item.readByKeys || []).includes(
                  studentUniqueKey
                );
                return (
                  <div
                    key={nId}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 hover:bg-purple-50/80 transition cursor-pointer flex items-start gap-3 ${
                      !isRead ? "bg-fuchsia-50/50" : "bg-white"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        !isRead ? "bg-fuchsia-600" : "bg-slate-300"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs sm:text-sm text-slate-900 leading-snug">
                        {item.title}
                      </div>
                      {item.message && (
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {item.message}
                        </p>
                      )}
                      <div className="text-[10px] font-bold text-purple-700 mt-1 flex items-center gap-2">
                        <span>ক্লিক করে সরাসরি দেখুন →</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Reusable Admin Optional Notification Toggle Box
   */
  const renderAdminOptionalNotificationBox = () => (
    <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2.5">
      <label className="flex items-center gap-2.5 font-extrabold text-xs sm:text-sm text-amber-950 cursor-pointer">
        <input
          type="checkbox"
          checked={sendAdminNotification}
          onChange={(e) => setSendAdminNotification(e.target.checked)}
          className="w-4 h-4 accent-[#2e1065]"
        />
        <Bell className="w-4 h-4 text-amber-700" />
        <span>
          🔔 এই আপডেটটি প্রকাশের সাথে সাথে শিক্ষার্থীদের নোটিফিকেশন পাঠান (ঐচ্ছিক)
        </span>
      </label>
      {sendAdminNotification && (
        <input
          type="text"
          value={customAdminNotifText}
          onChange={(e) => setCustomAdminNotifText(e.target.value)}
          placeholder="কাস্টম নোটিফিকেশন বার্তা (খালি রাখলে স্বয়ংক্রিয়ভাবে শিরোনাম যাবে)..."
          className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs font-bold text-slate-900"
        />
      )}
    </div>
  );

  /**
   * Reusable Shared Modals (Syllabus Popup, Previous Results Top 100, Contest Reg, Job News, Course Unlock)
   */
  const renderSharedPlatformModals = () => (
    <>
      {/* 1. SYLLABUS TOPIC POPUP MODAL WITH (✕) BUTTON (Requirement 5) */}
      {activeSyllabusModalData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white max-w-2xl w-full max-h-[86vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#090d24] via-[#2e1065] to-[#4c1d95] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black">
                  {activeSyllabusModalData.subjectTitle} •{" "}
                  {activeSyllabusModalData.marksText}
                </span>
                <h3 className="font-black text-base sm:text-xl mt-1 leading-snug">
                  {activeSyllabusModalData.topicTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSyllabusModalData(null)}
                aria-label="Close syllabus popup"
                className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-black text-base shrink-0 shadow cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-900">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="text-xs font-black text-[#2e1065] uppercase mb-1">
                  📌 সিলেবাসের মূল বিষয়বস্তু ও নম্বরবণ্টন
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                  {activeSyllabusModalData.shortSummary}
                </p>
              </div>

              {activeSyllabusModalData.detailedPopupContent && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-slate-600 uppercase">
                    📖 বিস্তারিত সিলেবাস ও প্রস্তুতির নির্দেশনা
                  </div>
                  <div
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium clearfix"
                    dangerouslySetInnerHTML={{
                      __html: renderRichTextWithShortImageTokens(
                        activeSyllabusModalData.detailedPopupContent,
                        activeSyllabusModalData.embeddedImages
                      ),
                    }}
                  />
                </div>
              )}

              {activeSyllabusModalData.vivaGuidelines && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-1">
                  <div className="text-xs font-black text-amber-950">
                    🎙️ ভাইভা ও মৌখিক পরীক্ষার প্রস্তুতি নির্দেশনা:
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed whitespace-pre-line">
                    {activeSyllabusModalData.vivaGuidelines}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const targetSubId = activeSyllabusModalData.subjectId;
                  setActiveSyllabusModalData(null);
                  handleSelectSubject(targetSubId);
                }}
                className="px-4 py-2 rounded-xl bg-[#2e1065] text-white text-xs font-black cursor-pointer"
              >
                এই বিষয়ের লেকচার দেখুন →
              </button>
              <button
                type="button"
                onClick={() => setActiveSyllabusModalData(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-black cursor-pointer"
              >
                ✕ বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PREVIOUS EXAM RESULTS & TOP 100 LEADERBOARD MODAL (Requirement 1.গ) */}
      {showPreviousResultModal && myLatestParticipatedSubmission && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#2e1065] flex flex-col">
            <div className="bg-gradient-to-r from-[#090d24] via-[#2e1065] to-[#4c1d95] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-black text-base sm:text-xl">
                    পূর্ববর্তী সাপ্তাহিক পরীক্ষার ফলাফল ও শীর্ষ ১০০ মেধাতালিকা
                  </h3>
                  <p className="text-xs text-purple-200">
                    সর্বশেষ অনুষ্ঠিত পরীক্ষার ব্যক্তিগত ফলাফল ও জাতীয় র‍্যাঙ্কিং (Top 100)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviousResultModal(false)}
                className="w-9 h-9 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Personal Score Summary Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-2 border-[#2e1065] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {profile.avatarUrl ||
                    myLatestParticipatedSubmission.avatarUrl ? (
                      <img
                        src={
                          profile.avatarUrl ||
                          myLatestParticipatedSubmission.avatarUrl
                        }
                        alt={myLatestParticipatedSubmission.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-amber-400 shadow"
                      />
                    ) : (
                      <MiniExecutive2DAvatar size="w-16 h-16" />
                    )}
                    <div>
                      <span className="px-3 py-1 rounded-full bg-[#2e1065] text-amber-300 text-xs font-black">
                        আপনার মেধাক্রম (Rank): #{myLeaderboardRank}
                      </span>
                      <h4 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                        {myLatestParticipatedSubmission.name} — প্রাপ্ত নম্বর:{" "}
                        {myLatestParticipatedSubmission.totalScore}
                      </h4>
                      <p className="text-xs font-bold text-slate-600">
                        সঠিক: {myLatestParticipatedSubmission.correctCount}টি •
                        ভুল: {myLatestParticipatedSubmission.wrongCount}টি •
                        নেগেটিভ কর্তন: -
                        {myLatestParticipatedSubmission.negativePenalty}
                      </p>
                    </div>
                  </div>
                </div>

                {myLatestParticipatedSubmission.subjectBreakdown?.length >
                  0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-purple-200">
                    {myLatestParticipatedSubmission.subjectBreakdown.map(
                      (sb, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-purple-200 flex items-center justify-between text-xs font-extrabold"
                        >
                          <span className="truncate">{sb.subjectTitle}</span>
                          <span className="text-[#2e1065] font-black ml-2">
                            {sb.marks}/{sb.total}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Top 100 Leaderboard List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base sm:text-lg text-slate-900">
                    🏆 শীর্ষ ১০০ জনের মেধাতালিকা (Top 100 Leaderboard)
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                    মোট প্রদর্শিত: {top100Leaderboard.length} জন
                  </span>
                </div>

                <div className="space-y-2.5">
                  {top100Leaderboard.map((sub, idx) => {
                    const isMe =
                      sub.studentKey === studentUniqueKey ||
                      (profile.phone && sub.phone === profile.phone);
                    const displayAvatar =
                      isMe && profile.avatarUrl
                        ? profile.avatarUrl
                        : sub.avatarUrl;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                          isMe
                            ? "bg-purple-50 border-2 border-[#4c1d95]"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${
                              idx === 0
                                ? "bg-amber-400 text-slate-950"
                                : idx === 1
                                ? "bg-slate-300 text-slate-900"
                                : idx === 2
                                ? "bg-amber-700 text-white"
                                : "bg-[#2e1065] text-white"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          {displayAvatar ? (
                            <img
                              src={displayAvatar}
                              alt={sub.name}
                              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
                            />
                          ) : (
                            <MiniExecutive2DAvatar size="w-11 h-11" />
                          )}
                          <div>
                            <div className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                              <span>{sub.name}</span>
                              {isMe && (
                                <span className="px-2 py-0.5 rounded-full bg-[#4c1d95] text-white text-[10px]">
                                  আপনি
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-500">
                              {sub.institution || "স্বতন্ত্র পরীক্ষার্থী"}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-base sm:text-lg text-[#2e1065]">
                            {sub.totalScore} নম্বর
                          </div>
                          <div className="text-[11px] font-bold text-slate-500">
                            সঠিক: {sub.correctCount || 0} • ভুল:{" "}
                            {sub.wrongCount || 0}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WEEKLY LIVE EXAM REGISTRATION MODAL */}
      {showContestRegModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border-2 border-[#2e1065]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black">
                  Weekly Live Exam (২০০ নম্বর · প্রতি শুক্রবার রাত ৮:০০টা)
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  📝 সাপ্তাহিক পরীক্ষার রেজিস্ট্রেশন সম্পন্ন করুন
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowContestRegModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleContestRegistrationSubmit}
              className="space-y-3.5 text-sm"
            >
              <div>
                <label className="font-extrabold block mb-1 text-slate-800">
                  ১. আপনার পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Amir Hamza"
                  value={contestRegForm.name}
                  onChange={(e) =>
                    setContestRegForm({
                      ...contestRegForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-extrabold block mb-1 text-slate-800">
                  ২. মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 017XXXXXXXX"
                  value={contestRegForm.phone}
                  onChange={(e) =>
                    setContestRegForm({
                      ...contestRegForm,
                      phone: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-extrabold block mb-1 text-slate-800">
                  ৩. শিক্ষাপ্রতিষ্ঠান (বিশ্ববিদ্যালয় / কলেজ) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Metropolitan University, Sylhet"
                  value={contestRegForm.institution}
                  onChange={(e) =>
                    setContestRegForm({
                      ...contestRegForm,
                      institution: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="pt-1">
                <label className="font-extrabold block mb-2 text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-pink-600" /> ৪. মোবাইল
                    ব্যাংকিং মাধ্যম (মাত্র ৩০ টাকা) *
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-black">
                    এখন ফ্রি!
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "bkash",
                      name: "বিকাশ",
                      sub: "bKash",
                      activeBg:
                        "border-[#e2136e] bg-pink-50 text-[#e2136e]",
                    },
                    {
                      id: "nagad",
                      name: "নগদ",
                      sub: "Nagad",
                      activeBg:
                        "border-[#f7941d] bg-orange-50 text-[#c25b00]",
                    },
                    {
                      id: "rocket",
                      name: "রকেট",
                      sub: "Rocket",
                      activeBg:
                        "border-[#8c3494] bg-purple-50 text-[#8c3494]",
                    },
                  ].map((pm) => {
                    const isSelected =
                      contestRegForm.paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() =>
                          setContestRegForm({
                            ...contestRegForm,
                            paymentMethod: pm.id,
                          })
                        }
                        className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer ${
                          isSelected
                            ? `${pm.activeBg} shadow-xs font-black`
                            : "border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        <div className="text-sm font-black">{pm.name}</div>
                        <div className="text-[10px] font-bold opacity-80">
                          {pm.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
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
                  ✓ রেজিস্ট্রেশন নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. COURSE-BASED ACCESS UNLOCK MODAL (Requirement 6) */}
      {courseToUnlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 border-2 border-[#2e1065]">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2e1065] text-xs font-black">
                কোর্স অ্যাক্সেস ভেরিফিকেশন
              </span>
              <button
                onClick={() => setCourseToUnlock(null)}
                className="w-8 h-8 rounded-full bg-slate-100 font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {getCourseTitleLabel(courseToUnlock)} — কোর্সে প্রবেশাধিকার সক্রিয় করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              আপনার প্রোফাইলের লক্ষ্য স্বয়ংক্রিয়ভাবে{" "}
              <strong className="text-[#2e1065]">
                “{getCourseTargetLabel(courseToUnlock)}”
              </strong>{" "}
              হিসেবে সেট হবে এবং এই কোর্সের ড্যাশবোর্ড, সিলেবাস, লেকচার ও মক টেস্ট আনলক হবে।
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCourseToUnlock(null)}
                className="flex-1 py-3 border rounded-xl font-bold text-sm cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleUnlockCourseAccess(courseToUnlock)}
                className="flex-1 py-3 bg-[#2e1065] text-amber-300 rounded-xl font-black text-sm cursor-pointer"
              >
                ✓ কোর্স অ্যাক্সেস চালু করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. JOB NEWS MODAL ("চাকরির আপডেট খবর") */}
      {showJobNewsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#2e1065] flex flex-col">
            <div className="bg-gradient-to-r from-[#090d24] via-[#2e1065] to-[#831843] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-6 h-6 text-amber-300" />
                <div>
                  <h3 className="font-black text-lg sm:text-xl">
                    চাকরির আপডেট খবর ও নিয়োগ বিজ্ঞপ্তি
                  </h3>
                  <p className="text-xs text-pink-200">
                    সর্বশেষ বিসিএস, সরকারি চাকরি ও প্রতিরক্ষা নিয়োগ আপডেট
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJobNewsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-black cursor-pointer"
              >
                ✕ বন্ধ করুন
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {jobUpdates.length === 0 ? (
                <div className="lg:col-span-12 p-12 text-center text-slate-500 font-bold">
                  এখনো কোনো চাকরির খবর পোস্ট করা হয়নি। অ্যাডমিন প্যানেল থেকে খবর যুক্ত করুন।
                </div>
              ) : (
                <>
                  <div className="lg:col-span-4 space-y-2.5 border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0 lg:pr-4">
                    <div className="text-xs font-black text-slate-500 uppercase">
                      সর্বশেষ প্রকাশিত খবর ({jobUpdates.length}টি)
                    </div>
                    {jobUpdates.map((item) => {
                      const jId = item._id || item.id;
                      const isSelected =
                        (activeJobArticle?._id || activeJobArticle?.id) === jId;
                      return (
                        <div
                          key={jId}
                          onClick={() => setActiveJobArticle(item)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            isSelected
                              ? "bg-[#2e1065] text-white border-[#2e1065]"
                              : "bg-slate-50 hover:bg-purple-50 border-slate-200"
                          }`}
                        >
                          <div
                            className={`text-[10px] font-extrabold ${
                              isSelected ? "text-amber-300" : "text-pink-700"
                            }`}
                          >
                            {item.categoryBadge} • {item.publishDateText}
                          </div>
                          <div className="font-black text-sm mt-1 leading-snug">
                            {item.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    {activeJobArticle && (
                      <>
                        <div className="space-y-1.5 border-b border-slate-200 pb-4">
                          <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-black">
                            {activeJobArticle.categoryBadge} •{" "}
                            {activeJobArticle.publishDateText}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                            {activeJobArticle.title}
                          </h2>
                        </div>

                        {activeJobArticle.coverImageUrl && (
                          <img
                            src={activeJobArticle.coverImageUrl}
                            alt={activeJobArticle.title}
                            className="w-full max-h-80 object-cover rounded-2xl border border-slate-200 shadow-xs"
                          />
                        )}

                        <div
                          className={`text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium clearfix ${
                            activeJobArticle.twoColumnDesktop
                              ? "md:columns-2 md:gap-8 [column-rule:1px_solid_#e2e8f0]"
                              : ""
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: renderRichTextWithShortImageTokens(
                              activeJobArticle.articleContent,
                              activeJobArticle.embeddedImages
                            ),
                          }}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  /**
   * ==========================================================================
   * VIEW 1: PORTAL GATEWAY LANDING PAGE
   * ==========================================================================
   */
  if (activePortal === "gateway") {
    return (
      <div className="min-h-screen bg-[#eef2f9] text-slate-900 pb-14">
        <header className="bg-[#090d24] text-white border-b border-purple-900/40 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3b1d82] to-[#1e1b4b] border border-fuchsia-400/40 text-amber-400 flex items-center justify-center font-black text-2xl shadow-md">
                ব
              </div>
              <div>
                <h1 className="font-black text-base sm:text-xl leading-tight text-white tracking-tight">
                  BCS Path & Defense Foundation
                </h1>
                <p className="text-xs text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  অনলাইন কার্যক্রম সক্রিয়
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dynamic Notification Bell Dropdown */}
              {renderNotificationBellDropdown(true)}

              <button
                onClick={() => {
                  setActivePortal("course_app");
                  setActiveTab("admin");
                }}
                className="px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/60 text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" /> অ্যাডমিন
              </button>
            </div>
          </div>
        </header>

        {/* NEON HERO SECTION WITH PERSISTENT WEEKLY REGISTRATION LOGIC */}
        <section className="relative bg-gradient-to-r from-[#090820] via-[#1b0b3b] to-[#12072b] text-white overflow-hidden border-b border-fuchsia-500/30">
          <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-fuchsia-600/25 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-1/3 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-11 grid grid-cols-1 lg:grid-cols-12 items-center gap-7 relative z-10">
            <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
              <h2 className="text-3xl sm:text-5xl font-black leading-[1.18] tracking-tight">
                স্বাগতম! <br />
                আপনার <span className="text-amber-400">কোর্স</span> <br />
                সিলেক্ট করুন
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                আপনার লক্ষ্য অনুযায়ী সঠিক কোর্স নির্বাচন করুন এবং শুরু করুন
                আপনার প্রস্তুতির যাত্রা।
              </p>
              <p className="text-[11px] sm:text-xs font-extrabold text-amber-300/95 tracking-wide">
                ✨ এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <GatewayBooksExamTargetIllustration />
            </div>

{/* RIGHT COLUMN: SUBTLE CONTINUOUS ZOOM-IN/ZOOM-OUT COUNTDOWN CARD */}
            <div className="lg:col-span-4">
              <div className="soft-zoom-pulse rounded-3xl bg-[#130929]/90 border-2 border-fuchsia-500/80 p-5 sm:p-6 space-y-4">
                {/* কাউন্টডাউন শুধু তখনই দেখাবে যখন পরীক্ষা লাইভ চলছে না */}
                {!countdownParts.isExamLiveNow ? (
                  <>
                    <div className="flex items-center justify-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-fuchsia-600/20 border border-fuchsia-500 flex items-center justify-center text-fuchsia-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="font-black text-base sm:text-lg text-white">
                        সাপ্তাহিক পরীক্ষার সময় বাকি
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 text-center">
                      {[
                        { val: countdownParts.days, lbl: "দিন" },
                        { val: countdownParts.hours, lbl: "ঘণ্টা" },
                        { val: countdownParts.minutes, lbl: "মিনিট" },
                        { val: countdownParts.seconds, lbl: "সেকেন্ড" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-[#1b0d38] border border-fuchsia-500/50 rounded-2xl py-2.5 px-2 shadow-inner"
                        >
                          <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-wider">
                            {item.val}
                          </div>
                          <div className="text-[11px] font-bold text-slate-200 mt-0.5">
                            {item.lbl}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center space-y-1">
                    <div className="text-base sm:text-lg font-black text-emerald-300 flex items-center justify-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>সাপ্তাহিক লাইভ পরীক্ষা এখন চলছে!</span>
                    </div>
                    <p className="text-xs text-slate-200 font-bold">
                      নিচের ‘পরীক্ষা শুরু করুন’ বাটনে ক্লিক করে প্রশ্ন ওপেন করুন
                    </p>
                  </div>
                )}

                <div className="space-y-2.5 pt-1">
                  {!isRegisteredForCurrentCycle ? (
                    <button
                      type="button"
                      onClick={handleOpenRegistrationModal}
                      className="premium-btn w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#db2777] text-white font-black text-xs sm:text-sm shadow-lg border border-pink-400/50 cursor-pointer"
                    >
                      রেজিস্ট্রেশন করুন এখনই, মাত্র ৩০ টাকায়
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-full py-2.5 px-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে</span>
                      </div>

                      {!myCurrentCycleSubmission && (
                        <button
                          type="button"
                          onClick={handleLaunchWeeklyLiveExamRoom}
                          className="premium-btn w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-lg"
                        >
                          🚀 পরীক্ষা শুরু করুন →
                        </button>
                      )}
                    </div>
                  )}

                  {myLatestParticipatedSubmission && (
                    <button
                      type="button"
                      onClick={() => setShowPreviousResultModal(true)}
                      className="premium-btn w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-amber-300/50 text-amber-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <History className="w-4 h-4" />
                      <span>
                        পূর্ববর্তী ফলাফল ও শীর্ষ ১০০ লিডারবোর্ড দেখুন
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN COURSES & JOB NEWS CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-7 space-y-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-amber-400 flex items-center justify-center shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div className="border-l-3 border-rose-500 pl-3.5">
                <h3 className="text-xl sm:text-2xl font-black text-[#0f172a]">
                  Available Courses
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  আপনার জন্য সেরা প্রস্তুতির পথ
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (jobUpdates.length > 0 && !activeJobArticle) {
                  setActiveJobArticle(jobUpdates[0]);
                }
                setShowJobNewsModal(true);
              }}
              className="premium-btn px-5 py-3 rounded-2xl bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#be185d] text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-md border border-pink-400/40 cursor-pointer"
            >
              <Newspaper className="w-5 h-5 text-amber-300" />
              <span>চাকরির আপডেট খবর</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black">
                {jobUpdates.length}টি আপডেট
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD 1: 52nd BCS COURSE */}
            <div
              onClick={() => enterCourseDashboard("bcs")}
              className="premium-card group relative rounded-3xl bg-gradient-to-br from-[#140d36] via-[#1f1147] to-[#2e1065] text-white p-6 sm:p-7 border-2 border-rose-500/80 shadow-xl overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                <div className="w-24 h-28 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 p-1 shrink-0 shadow-lg mx-auto sm:mx-0">
                  <div className="w-full h-full rounded-xl bg-[#0f172a] flex flex-col items-center justify-center p-2 text-center border border-amber-300/60">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 border-2 border-amber-400 flex items-center justify-center mb-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block" />
                    </div>
                    <span className="text-lg font-black text-white tracking-wider">
                      BCS
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-black shadow-xs">
                    <Building2 className="w-3.5 h-3.5" /> সরকারি চাকরির প্রস্তুতি
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black leading-snug text-white">
                    <span className="text-amber-400">৫২ তম</span> বিসিএস
                    স্ট্যান্ডার্ড অল সাবজেক্টস কোর্স
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    সুশৃঙ্খল ও পরিকল্পিত প্রস্তুতির মাধ্যমে ৫২ তম বিসিএস পরীক্ষার
                    জন্য সকল বিষয়ের উপর পূর্ণাঙ্গ প্রস্তুতি নিন।
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-pink-400/40 text-xs font-extrabold flex items-center gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5 text-amber-300" /> লেকচার
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-pink-400/40 text-xs font-extrabold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-300" /> MCQ
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-pink-400/40 text-xs font-extrabold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-300" /> মক টেস্ট
                  </span>
                </div>

                <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md">
                  <span>কোর্সে যান</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2: DEFENSE & POLICE FOUNDATION — OPENS THE NEW DEFENSE COURSE SELECTION PORTAL (Requirement 3) */}
            <div
              onClick={() => {
                setActivePortal("defense_hub");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="premium-card group relative rounded-3xl bg-gradient-to-br from-[#140d36] via-[#1f1147] to-[#2e1065] text-white p-6 sm:p-7 border-2 border-rose-500/80 shadow-xl overflow-hidden cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                <div className="w-24 h-28 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-yellow-600 p-1 shrink-0 shadow-lg mx-auto sm:mx-0">
                  <div className="w-full h-full rounded-xl bg-[#0f172a] flex flex-col items-center justify-center p-2 text-center border border-amber-300/60">
                    <Shield className="w-10 h-10 text-amber-400 mb-1" />
                    <span className="text-[10px] font-black text-amber-200 tracking-wider uppercase">
                      DEFENSE
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-black shadow-xs">
                    <Shield className="w-3.5 h-3.5" /> বাহিনী প্রস্তুতি
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black leading-snug text-white">
                    ডিফেন্স & পুলিশ ফাউন্ডেশন কোর্স
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    আর্মি (সৈনিক), নেভি (নাবিক ও ক্যাডেট), এয়ারফোর্স (বিমানসেনা ও BAFA) এবং পুলিশ কনস্টেবল (TRC) নিয়োগ পরীক্ষার বিশেষায়িত প্রস্তুতি।
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-pink-400/40 text-xs font-extrabold flex items-center gap-1.5">
                    <PlayCircle className="w-3.5 h-3.5 text-amber-300" /> লেকচার
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-pink-400/40 text-xs font-extrabold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-300" /> MCQ
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-pink-400/40 text-xs font-extrabold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-300" /> মক টেস্ট
                  </span>
                </div>

                <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md">
                  <span>কোর্সসমূহ দেখুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-[#090d24] via-[#1b0f3f] to-[#090d24] text-white p-5 sm:p-6 border border-purple-800/60 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-amber-300 shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="border-l-2 border-rose-500/60 pl-4">
                <div className="text-lg sm:text-2xl font-black tracking-wide">
                  মানুষ যা <span className="text-amber-400">চেষ্টা</span> করে,
                  তাই সে <span className="text-amber-400">পায়</span>{" "}
                  <span className="text-xs sm:text-sm font-semibold italic text-slate-300 ml-1">
                    - Al-Quran
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right hidden sm:block italic font-bold text-xs leading-snug">
              <span className="text-slate-200">Better Preparation —</span>{" "}
              <br />
              <span className="text-pink-400 underline">Brighter Future</span>
            </div>
          </div>
        </main>

        {renderSharedPlatformModals()}
      </div>
    );
  }

  /**
   * ==========================================================================
   * VIEW 2: DEFENSE & POLICE FOUNDATION COURSE SELECTION PORTAL
   * Requirement 3: Matches Modern Defence Course Dashboard (Image 4) +
   * 2 Cards per row on Mobile (`grid-cols-2`) + All 6 Official Courses
   * ==========================================================================
   */
  if (activePortal === "defense_hub") {
    const main4Cards = [
      DEFENSE_COURSES_CATALOG.def_police_trc,
      DEFENSE_COURSES_CATALOG.def_police_army_joint,
      DEFENSE_COURSES_CATALOG.def_joint_3forces,
      DEFENSE_COURSES_CATALOG.def_army_sainik,
    ];

    // Helper for force crest icons matching Image 2
    const renderForceCrestBadges = (courseId) => {
      if (courseId === "def_police_trc") {
        return (
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#102a63] border-2 border-blue-400 flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-sky-300" />
          </div>
        );
      }
      if (courseId === "def_police_army_joint") {
        return (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#102a63] border-2 border-blue-400 flex items-center justify-center shadow">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300" />
            </div>
            <span className="text-white font-black text-xs sm:text-sm">+</span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0d3b26] border-2 border-amber-400 flex items-center justify-center shadow">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
        );
      }
      if (courseId === "def_joint_3forces") {
        return (
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0d3b26] border-2 border-amber-400 flex items-center justify-center shadow">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <span className="text-white font-black text-[10px] sm:text-xs">+</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0c3b6e] border-2 border-sky-400 flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" />
            </div>
            <span className="text-white font-black text-[10px] sm:text-xs">+</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#172554] border-2 border-amber-400 flex items-center justify-center shadow">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
          </div>
        );
      }
      return (
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#0d3b26] border-2 border-amber-400 flex items-center justify-center shadow-md">
          <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-[#eef2f9] text-slate-900 pb-16">
        <header className="bg-[#090d24] text-white border-b border-purple-900/40 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => setActivePortal("gateway")}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3b1d82] to-[#1e1b4b] border border-fuchsia-400/40 text-amber-400 flex items-center justify-center font-black text-2xl shadow-md cursor-pointer"
              >
                ব
              </div>
              <div>
                <h1 className="font-black text-base sm:text-xl leading-tight text-white">
                  BCS Path & Defense Foundation
                </h1>
                <p className="text-xs text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  অনলাইন কার্যক্রম সক্রিয়
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {renderNotificationBellDropdown(true)}
              <button
                onClick={() => {
                  setActivePortal("course_app");
                  setActiveTab("admin");
                }}
                className="px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/60 text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" /> অ্যাডমিন
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-5 space-y-6">
          <div>
            <button
              onClick={() => setActivePortal("gateway")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs sm:text-sm font-black shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> মূল পোর্টালে ফিরুন
            </button>
          </div>

          {/* TOP HERO BANNER (Matches Image 2) */}
          <div className="rounded-3xl bg-gradient-to-r from-[#07112e] via-[#0e1e4d] to-[#081336] text-white p-5 sm:p-8 border-2 border-indigo-500/40 shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center gap-6 relative overflow-hidden">
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-[#0b1536] border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                <Shield className="w-11 h-11 text-amber-400" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-black">
                  <Shield className="w-3.5 h-3.5" /> বিশেষায়িত কোর্স
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  ডিফেন্স & পুলিশ ফাউন্ডেশন কোর্স
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                  বাংলাদেশের সশস্ত্র বাহিনীতে যোগদানের স্বপ্নকে বাস্তবে রূপ দিতে সঠিক প্রস্তুতি নিন। নির্বাচিত কোর্সে আপনার লক্ষ্য অনুযায়ী বিশেষায়িত কোচিং, ক্লাস ও অনুশীলন সুবিধা।
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-4 z-10">
              {[
                {
                  title: "বিশেষায়িত প্রস্তুতি",
                  sub: "প্রতিটি বাহিনীর জন্য আলাদা কৌশল",
                },
                {
                  title: "অভিজ্ঞ মেন্টর",
                  sub: "প্রাক্তন সদস্য ও বিশেষজ্ঞ শিক্ষকমণ্ডলী",
                },
                {
                  title: "অনলাইন + অফলাইন সুবিধা",
                  sub: "যেকোনো সময়, যেকোনো জায়গায়",
                },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-white">
                      {feat.title}
                    </div>
                    <div className="text-[11px] text-slate-300">{feat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION TITLE & TIP PILL */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-950 text-amber-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900">
                  আপনার লক্ষ্য অনুযায়ী কোর্স নির্বাচন করুন
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  আপনার পছন্দের কোর্সে ক্লিক করুন এবং বিস্তারিত তথ্য দেখুন
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-extrabold text-slate-700 flex items-center gap-2 shadow-2xs">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                পরামর্শ: আপনার লক্ষ্য অনুযায়ী সঠিক কোর্স নির্বাচন করুন, সফলতার পথে আমরা আছি আপনার সাথে।
              </span>
            </div>
          </div>

          {/* ONLY THE 4 COURSES FROM IMAGE 2 (2 PER ROW ON MOBILE `grid-cols-2`, 4 ON DESKTOP `lg:grid-cols-4`) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {main4Cards.map((course) => (
              <div
                key={course.id}
                onClick={() => enterCourseDashboard(course.id)}
                className={`premium-card rounded-2xl sm:rounded-3xl bg-gradient-to-b ${course.cardTheme} border-2 p-3.5 sm:p-5 text-white flex flex-col justify-between cursor-pointer shadow-lg`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-1">
                    {renderForceCrestBadges(course.id)}
                    <span
                      className={`px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-black shrink-0 ${course.badgeColor}`}
                    >
                      {course.badgeText}
                    </span>
                  </div>

                  <h4 className="font-black text-sm sm:text-lg leading-snug text-white pt-1">
                    {course.title}
                  </h4>

                  <p className="text-[11px] sm:text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {course.shortDesc}
                  </p>
                </div>

                {/* Bottom Bar: Pills + "কোর্সে যান >" Button matching Image 2 */}
                <div className="pt-3.5 mt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1 text-[10px] font-extrabold text-slate-100">
                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                      📖 লিখিত
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                      📄 MCQ
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                      ☆ মক টেস্ট
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`px-3 py-1.5 sm:py-2 rounded-full font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow shrink-0 cursor-pointer ${course.btnColor}`}
                  >
                    <span>কোর্সে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM WIDE BANNER: সমন্বিত ডিফেন্স প্রস্তুতি (অ্যাডভান্সড) (Matches Image 2) */}
          <div
            onClick={() => enterCourseDashboard("def_joint_3forces")}
            className="premium-card rounded-3xl bg-gradient-to-r from-[#071538] via-[#1a1c54] to-[#3b1261] text-white p-5 sm:p-7 border-2 border-indigo-400/40 shadow-xl flex flex-wrap items-center justify-between gap-4 cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {renderForceCrestBadges("def_joint_3forces")}
              <div className="space-y-1.5">
                <h4 className="text-lg sm:text-2xl font-black text-white">
                  সমন্বিত ডিফেন্স প্রস্তুতি (অ্যাডভান্সড)
                </h4>
                <p className="text-xs sm:text-sm text-purple-200 font-medium">
                  আর্মি + এয়ার ফোর্স + নেভি — সব বাহিনীর জন্য এক প্ল্যাটফর্মে সম্পূর্ণ প্রস্তুতি।
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs font-extrabold">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
                    📖 লেকচার
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
                    📄 MCQ
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
                    ☆ মক টেস্ট
                  </span>
                </div>
              </div>
            </div>

            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg cursor-pointer">
              <span>কোর্সে যান</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {renderSharedPlatformModals()}
      </div>
    );
  }

  /**
   * ==========================================================================
   * VIEW 3: COURSE APPLICATION (BCS & SPECIFIC DEFENSE SUB-COURSES)
   * ==========================================================================
   */
  const dynamicTargetGoalLabel = getCourseTargetLabel(selectedCourse);

  return (
    <div
      className={`min-h-screen bg-[#f4f6fb] text-slate-900 pb-24 ${
        activeTab !== "admin" ? "select-none" : ""
      }`}
    >
      {/* TOP HEADER & ICON NAVIGATION BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActivePortal("gateway")}
              className="w-11 h-11 bg-[#2e1065] text-amber-400 rounded-2xl flex items-center justify-center font-black text-2xl cursor-pointer shadow-xs"
            >
              ব
            </div>
            <div
              onClick={() => navigateTo("dashboard")}
              className="cursor-pointer"
            >
              <h1 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                {getCourseTitleLabel(selectedCourse)}
              </h1>
              <p className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {dbLoading ? "ক্লাউড সিঙ্ক হচ্ছে..." : dynamicTargetGoalLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Dynamic Notification Bell Dropdown */}
            {renderNotificationBellDropdown(false)}

            <button
              onClick={() => setShowJobNewsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <Newspaper className="w-4 h-4 text-pink-700" />
              <span className="hidden sm:inline">চাকরির আপডেট খবর</span>
            </button>

            <button
              onClick={() =>
                setActivePortal(
                  selectedCourse === "bcs" ? "gateway" : "defense_hub"
                )
              }
              className="premium-btn px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3b0764] to-[#4c1d95] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-amber-300" />
              <span>কোর্স পরিবর্তন</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex overflow-x-auto border-t border-slate-100 bg-white gap-5 sm:gap-7 text-xs sm:text-sm font-extrabold whitespace-nowrap text-slate-700">
          <button
            onClick={() => setActivePortal("gateway")}
            className="py-3 flex items-center gap-1.5 text-slate-700 hover:text-[#3b0764] cursor-pointer"
          >
            <Home className="w-4 h-4" /> পোর্টাল
          </button>
          {selectedCourse !== "bcs" && (
            <button
              onClick={() => setActivePortal("defense_hub")}
              className="py-3 flex items-center gap-1.5 text-indigo-700 hover:text-indigo-950 font-black cursor-pointer"
            >
              <Shield className="w-4 h-4" /> ডিফেন্স কোর্সসমূহ
            </button>
          )}
          <button
            onClick={() => navigateTo("dashboard")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "dashboard"
                ? "border-[#4c1d95] text-[#4c1d95] font-black"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> ড্যাশবোর্ড
          </button>
          <button
            onClick={() => navigateTo("syllabus")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "syllabus"
                ? "border-[#4c1d95] text-[#4c1d95] font-black"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" /> সিলেবাস
          </button>
          <button
            onClick={() => navigateTo("subject_lectures")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "subject_lectures"
                ? "border-[#4c1d95] text-[#4c1d95] font-black"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <PlayCircle className="w-4 h-4" /> লেকচার
          </button>
          <button
            onClick={() => navigateTo("mock_test_hub")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "mock_test_hub" || activeTab === "active_exam_room"
                ? "border-[#4c1d95] text-[#4c1d95] font-black"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" /> মক টেস্ট
          </button>
          <button
            onClick={() => navigateTo("qbank")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "qbank"
                ? "border-[#4c1d95] text-[#4c1d95] font-black"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-4 h-4" /> প্রশ্ন ব্যাংক
          </button>

          <button
            onClick={() => navigateTo("bonus_hub")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "bonus_hub"
                ? "border-pink-600 text-pink-700 font-black"
                : "border-transparent text-pink-700 hover:text-pink-900"
            }`}
          >
            <Gift className="w-4 h-4" /> Bonus
          </button>

          {selectedCourse === "bcs" && (
            <button
              onClick={() => navigateTo("biweekly_contest")}
              className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
                activeTab === "biweekly_contest"
                  ? "border-amber-600 text-amber-800 font-black"
                  : "border-transparent text-amber-700"
              }`}
            >
              <Trophy className="w-4 h-4" /> Weekly Live Exam
            </button>
          )}

          <button
            onClick={() => navigateTo("admin")}
            className={`py-3 flex items-center gap-1.5 border-b-3 transition cursor-pointer ${
              activeTab === "admin"
                ? "border-blue-600 text-blue-600 font-black"
                : "border-transparent text-blue-600"
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> অ্যাডমিন প্যানেল
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
        {activeTab !== "dashboard" && (
          <div className="mb-5">
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#eef0f8] hover:bg-[#e2e6f3] text-[#1e1b4b] text-sm font-black transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> আগের পেজে ফিরুন
            </button>
          </div>
        )}

        {/* ================= 1. DASHBOARD (DYNAMIC PROFILE TARGET + NEON SUBJECT CARDS) ================= */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-amber-300 border-4 border-amber-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MiniExecutive2DAvatar size="w-full h-full" />
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <h3 className="font-black text-xl text-slate-900">
                      {profile.name}
                    </h3>
                    {/* Requirement 6: Course-Aligned Target Identity ("লক্ষ্য: বিসিএস", "লক্ষ্য: বাংলাদেশ সেনাবাহিনী", etc.) */}
                    <p className="text-xs font-extrabold text-[#4c1d95] mt-0.5">
                      {dynamicTargetGoalLabel}
                    </p>
                    {profile.institution && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-900 text-[11px] font-extrabold">
                        <Building2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span>
                          {profile.hideProfile
                            ? "লুকানো আছে"
                            : profile.institution}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowProfileEditModal(true)}
                  className="px-3 py-2 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-[#3b0764] text-xs font-extrabold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="leading-tight text-left">
                    প্রোফাইল ও<br />
                    প্রতিষ্ঠান এডিট
                  </span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm font-black mb-2">
                  <span className="text-slate-900">মোট অগ্রগতি</span>
                  <span className="text-emerald-600">
                    {overallProgressPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(3, overallProgressPercent)}%`,
                    }}
                  />
                </div>
                <p className="text-xs font-bold text-slate-600">
                  {totalCompletedLectures}/{totalUploadedLectures} টি লেকচার
                  সম্পন্ন • {completedQuizzesCount} টি পরীক্ষা সম্পন্ন
                </p>
              </div>

              {selectedCourse !== "bcs" &&
                DEFENSE_COURSES_CATALOG[selectedCourse]?.officialNote && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 leading-relaxed">
                    ℹ️ {DEFENSE_COURSES_CATALOG[selectedCourse].officialNote}
                  </div>
                )}
            </aside>

            <div className="lg:col-span-8 space-y-6">
              <div className="relative rounded-3xl bg-gradient-to-br from-[#1e0b45] via-[#31105f] to-[#4c1d95] text-white p-6 sm:p-8 shadow-lg overflow-hidden">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-12 sm:col-span-8 space-y-4 z-10">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider">
                      {getCourseTitleLabel(selectedCourse)}
                    </span>

                    <h2 className="text-xl sm:text-3xl font-black leading-snug">
                      ভিডিও ক্লাস, লেকচার PDF, Text View ও অধ্যায়ভিত্তিক Test 1
                      / Test 2
                    </h2>

                    {selectedCourse !== "bcs" &&
                      DEFENSE_COURSES_CATALOG[selectedCourse]?.examSummary && (
                        <p className="text-xs sm:text-sm font-extrabold text-amber-300">
                          📌{" "}
                          {DEFENSE_COURSES_CATALOG[selectedCourse].examSummary}
                        </p>
                      )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs font-bold text-purple-100">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>প্রতি টেস্ট ২৫/৫০টি প্রশ্ন</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>৩৬ সেকেন্ড/প্রশ্ন</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>নেগেটিভ মার্কিং ০.৫০</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>পাস মার্ক ৬০%</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => navigateTo("mock_test_hub")}
                        className="premium-btn px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg cursor-pointer"
                      >
                        অধ্যায়ভিত্তিক মক টেস্ট দিন →
                      </button>

                      <button
                        onClick={() => navigateTo("syllabus")}
                        className="premium-btn px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 border border-amber-300/40 text-amber-300 font-black text-xs sm:text-sm cursor-pointer"
                      >
                        📋 পূর্ণাঙ্গ সিলেবাস দেখুন
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:flex sm:col-span-4 justify-end">
                    <svg
                      viewBox="0 0 180 160"
                      className="w-40 h-36 drop-shadow-xl"
                    >
                      <rect
                        x="20"
                        y="115"
                        width="130"
                        height="22"
                        rx="6"
                        fill="#2563eb"
                      />
                      <rect
                        x="25"
                        y="120"
                        width="120"
                        height="12"
                        rx="3"
                        fill="#fde047"
                      />
                      <rect
                        x="28"
                        y="95"
                        width="115"
                        height="22"
                        rx="6"
                        fill="#f59e0b"
                      />
                      <rect
                        x="33"
                        y="100"
                        width="105"
                        height="12"
                        rx="3"
                        fill="#fef3c7"
                      />
                      <path
                        d="M90 20 L135 38 L135 78 C135 108 90 128 90 128 C90 128 45 108 45 78 L45 38 Z"
                        fill="#a855f7"
                        stroke="#e9d5ff"
                        strokeWidth="4"
                      />
                      <path
                        d="M90 30 L125 44 L125 76 C125 98 90 115 90 115 C90 115 55 98 55 76 L55 44 Z"
                        fill="#6b21a8"
                      />
                      <polygon
                        points="90,48 96,62 111,64 100,74 103,89 90,81 77,89 80,74 69,64 84,62"
                        fill="#facc15"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* REQUIREMENT 4: "আপনার বিষয়সমূহ" CARDS WITH SUBTLE NEON BORDER ANIMATION & MARKS BADGE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#4c1d95]" /> আপনার
                    বিষয়সমূহ
                  </h3>
                  <span className="px-3.5 py-1 rounded-full bg-purple-100 text-[#3b0764] text-xs font-extrabold">
                    {currentCourseSubjects.length}টি বিষয়
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCourseSubjects.map((sub) => {
                    const stats = getSubjectDynamicStats(sub.id);
                    const isEngGrammar = sub.id === "english_grammar";
                    const displayMarksBadge = sub.marksLabel
                      ? sub.marksLabel
                      : `${sub.examMarks || sub.preliMarks} নম্বর`;

                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectSubject(sub.id)}
                        className="neon-border-card bg-white p-4 sm:p-5 rounded-2xl cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5 flex-1">
                          <div
                            className={`w-13 h-13 rounded-2xl ${sub.bg} ${sub.text} font-black flex items-center justify-center text-lg shrink-0`}
                          >
                            {sub.initial}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-black text-base text-slate-900 truncate">
                                {sub.title}
                              </h4>
                              {/* Requirement 4: Shows Subject Marks ("৩৫ নম্বর", "২০ নম্বর") instead of "মক টেস্ট: 35" */}
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-[11px] font-black shrink-0">
                                {displayMarksBadge}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-slate-500 mt-0.5">
                              আপলোডকৃত লেকচার: {stats.totalCount}টি
                            </p>

                            {isEngGrammar && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-violet-50 text-violet-800 text-[10px] font-extrabold">
                                📖 গল্পে গল্পে ভোকাবুলারি যুক্ত
                              </span>
                            )}

                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2.5 mb-1.5">
                              <div
                                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    stats.totalCount > 0
                                      ? Math.max(8, stats.percent)
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] font-extrabold text-slate-600">
                              <span>
                                সম্পন্ন {stats.completedCount}/
                                {stats.totalCount}
                              </span>
                              <span>{stats.percent}%</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MOCK TEST HUB ================= */}
        {activeTab === "mock_test_hub" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4c1d95] flex items-center justify-center shrink-0">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    অধ্যায়ভিত্তিক মক টেস্ট ({getCourseTitleLabel(selectedCourse)})
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    বিষয় ও অধ্যায় নির্বাচন করে পরীক্ষা দিন
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-xs sm:text-sm flex items-center gap-1.5 mb-2 text-slate-800">
                    <BookOpen className="w-4 h-4 text-[#4c1d95]" /> বিষয়
                    নির্বাচন করুন
                  </label>
                  <select
                    value={mockFilterSubject}
                    onChange={(e) => {
                      setMockFilterSubject(e.target.value);
                      setMockFilterLectureNo("ALL");
                      smoothScrollToRef(mockCardsSectionRef);
                    }}
                    className="w-full p-3.5 border border-slate-300 rounded-2xl bg-slate-50/70 font-extrabold text-sm text-slate-900 outline-none"
                  >
                    <option value="ALL">সকল বিষয়</option>
                    {currentCourseSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-black text-xs sm:text-sm flex items-center gap-1.5 mb-2 text-slate-800">
                    <FileText className="w-4 h-4 text-[#4c1d95]" /> Chapter /
                    Lecture নির্বাচন করুন
                  </label>
                  <select
                    value={mockFilterLectureNo}
                    onChange={(e) => {
                      setMockFilterLectureNo(e.target.value);
                      smoothScrollToRef(mockCardsSectionRef);
                    }}
                    className="w-full p-3.5 border border-slate-300 rounded-2xl bg-slate-50/70 font-extrabold text-sm text-slate-900 outline-none"
                  >
                    <option value="ALL">সকল Chapter / Lecture</option>
                    {Array.from(
                      new Set([
                        ...courseFilteredLectures
                          .filter(
                            (l) =>
                              mockFilterSubject === "ALL" ||
                              l.subjectId === mockFilterSubject
                          )
                          .map((l) => l.lectureNo),
                        ...examSets
                          .filter(
                            (s) =>
                              (s.courseType || "bcs") === selectedCourse &&
                              (mockFilterSubject === "ALL" ||
                                s.subjectId === mockFilterSubject)
                          )
                          .map((s) => s.lectureNo),
                      ])
                    )
                      .sort((a, b) => Number(a) - Number(b))
                      .map((lecNo) => (
                        <option key={lecNo} value={lecNo}>
                          Lecture {lecNo}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div ref={mockCardsSectionRef} className="scroll-mt-24">
              {(() => {
                const targetSubObj =
                  currentCourseSubjects.find(
                    (s) => s.id === mockFilterSubject
                  ) || currentCourseSubjects[0];

                const lectureNumbers = Array.from(
                  new Set([
                    ...courseFilteredLectures
                      .filter(
                        (l) =>
                          mockFilterSubject === "ALL" ||
                          l.subjectId === mockFilterSubject
                      )
                      .map((l) => Number(l.lectureNo)),
                    ...examSets
                      .filter(
                        (s) =>
                          (s.courseType || "bcs") === selectedCourse &&
                          (mockFilterSubject === "ALL" ||
                            s.subjectId === mockFilterSubject)
                      )
                      .map((s) => Number(s.lectureNo)),
                  ])
                )
                  .filter(
                    (n) =>
                      mockFilterLectureNo === "ALL" ||
                      n === Number(mockFilterLectureNo)
                  )
                  .sort((a, b) => a - b);

                const chaptersToRender =
                  lectureNumbers.length > 0 ? lectureNumbers : [1];

                return (
                  <div className="space-y-6">
                    {chaptersToRender.map((lecNo) => {
                      const matchedLec = courseFilteredLectures.find(
                        (l) =>
                          (mockFilterSubject === "ALL" ||
                            l.subjectId === mockFilterSubject) &&
                          Number(l.lectureNo) === lecNo
                      );
                      const t1 = examSets.find(
                        (s) =>
                          (s.courseType || "bcs") === selectedCourse &&
                          (mockFilterSubject === "ALL" ||
                            s.subjectId === mockFilterSubject) &&
                          Number(s.lectureNo) === lecNo &&
                          Number(s.testNumber) === 1
                      );
                      const t2 = examSets.find(
                        (s) =>
                          (s.courseType || "bcs") === selectedCourse &&
                          (mockFilterSubject === "ALL" ||
                            s.subjectId === mockFilterSubject) &&
                          Number(s.lectureNo) === lecNo &&
                          Number(s.testNumber) === 2
                      );

                      const chapterHeading =
                        t1?.chapterName ||
                        t2?.chapterName ||
                        matchedLec?.title ||
                        "অধ্যায়ভিত্তিক অনুশীলনী";

                      return (
                        <div
                          key={lecNo}
                          className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >
                          {[
                            { num: 1, doc: t1 },
                            { num: 2, doc: t2 },
                          ].map(({ num, doc }) => {
                            const isReady = doc && doc.questions?.length > 0;
                            const qCount = isReady ? doc.questions.length : 25;
                            const totalMin = Math.max(
                              1,
                              Math.round((qCount * 36) / 60)
                            );

                            return (
                              <div
                                key={num}
                                className={`neon-border-card bg-white p-6 rounded-3xl space-y-4 ${
                                  isReady ? "" : "opacity-90"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-3.5 py-1 rounded-full bg-purple-100 text-[#4c1d95] text-xs font-extrabold">
                                    {targetSubObj.title} • Lecture {lecNo}
                                  </span>
                                  <span
                                    className={`px-3.5 py-1 rounded-full text-xs font-black ${
                                      isReady
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-slate-200 text-slate-600"
                                    }`}
                                  >
                                    TEST {num}
                                  </span>
                                </div>

                                <h3
                                  className={`text-xl font-black ${
                                    isReady
                                      ? "text-slate-900"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {chapterHeading}
                                </h3>

                                <div className="flex flex-wrap gap-2 text-xs font-extrabold text-slate-700">
                                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-[#4c1d95]" />{" "}
                                    {qCount}টি প্রশ্ন
                                  </span>
                                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#4c1d95]" />{" "}
                                    {totalMin} মিনিট
                                  </span>
                                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-[#4c1d95]" />{" "}
                                    পাস মার্ক ৬০%
                                  </span>
                                  <span className="px-3 py-1.5 rounded-xl bg-slate-100 flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5 text-[#4c1d95]" />{" "}
                                    নেগেটিভ ০.৫০
                                  </span>
                                </div>

                                {isReady ? (
                                  <div className="space-y-3 pt-2 border-t border-slate-100">
                                    <div className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5">
                                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                      <span>প্রস্তুত হলে পরীক্ষা শুরু করুন</span>
                                    </div>
                                    <button
                                      onClick={() => launchSpecificExamSet(doc)}
                                      className="premium-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2e1065] to-[#3b0764] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                                    >
                                      <PlayCircle className="w-5 h-5" /> পরীক্ষা
                                      শুরু করুন →
                                    </button>
                                  </div>
                                ) : (
                                  <div className="pt-2 border-t border-slate-100">
                                    <button
                                      disabled
                                      className="w-full py-3.5 rounded-2xl bg-slate-200 text-slate-600 font-extrabold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                      <Lock className="w-4 h-4" /> শিগগির আসছে
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ================= 3. QUESTION BANK HUB ================= */}
        {activeTab === "qbank" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4c1d95] flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    বিষয়ভিত্তিক প্রশ্ন ব্যাংক ({getCourseTitleLabel(selectedCourse)})
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    PDF অথবা Text View-তে প্রশ্ন অনুশীলন করুন
                  </p>
                </div>
              </div>

              <div>
                <label className="font-black text-xs sm:text-sm flex items-center gap-1.5 mb-2 text-slate-800">
                  <BookOpen className="w-4 h-4 text-[#4c1d95]" /> বিষয় নির্বাচন
                  করুন
                </label>
                <select
                  value={selectedQbSubject}
                  onChange={(e) => setSelectedQbSubject(e.target.value)}
                  className="w-full p-3.5 border border-slate-300 rounded-2xl bg-slate-50/70 font-extrabold text-sm text-slate-900 outline-none"
                >
                  <option value="ALL">
                    সকল বিষয় ({currentCourseSubjects.length}টি)
                  </option>
                  {currentCourseSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
                <button
                  onClick={() => setQbankViewMode("pdf")}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                    qbankViewMode === "pdf"
                      ? "bg-gradient-to-r from-[#3b0764] to-[#4c1d95] text-white shadow-sm"
                      : "text-slate-700"
                  }`}
                >
                  <FileText className="w-4 h-4" /> PDF View
                </button>
                <button
                  onClick={() => setQbankViewMode("text")}
                  className={`py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
                    qbankViewMode === "text"
                      ? "bg-gradient-to-r from-[#3b0764] to-[#4c1d95] text-white shadow-sm"
                      : "text-slate-700"
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Text View
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(courseFilteredQbankDocs.length > 0
                ? courseFilteredQbankDocs
                : currentCourseSubjects
                    .filter(
                      (s) =>
                        selectedQbSubject === "ALL" ||
                        s.id === selectedQbSubject
                    )
                    .map((s) => ({
                      _id: s.id,
                      subjectId: s.id,
                      title: s.title,
                      bcsBatch: s.subtitle || "প্রশ্ন ব্যাংক ও সমাধান",
                      pdfUrl: "",
                      textContent: "",
                    }))
              ).map((doc) => {
                const dId = doc._id || doc.id;
                const isSelected =
                  (activeQbankDoc?._id || activeQbankDoc?.id) === dId;
                return (
                  <div
                    key={dId}
                    className={`neon-border-card bg-white p-5 rounded-3xl flex items-start justify-between gap-4 ${
                      isSelected ? "ring-2 ring-purple-300" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-200 text-[#4c1d95] flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <h4 className="font-black text-base sm:text-lg text-slate-900">
                            {doc.title}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500">
                            {doc.bcsBatch}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          <button
                            onClick={() => {
                              setActiveQbankDoc(doc);
                              setQbankViewMode("pdf");
                              smoothScrollToRef(qbankReaderRef);
                            }}
                            className="premium-btn px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b0764] to-[#4c1d95] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> PDF খুলুন
                          </button>
                          <button
                            onClick={() => {
                              setActiveQbankDoc(doc);
                              setQbankViewMode("text");
                              smoothScrollToRef(qbankReaderRef);
                            }}
                            className="premium-btn px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#3b0764] border border-purple-200 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Text View
                          </button>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-2" />
                  </div>
                );
              })}
            </div>

            {activeQbankDoc &&
              (activeQbankDoc.pdfUrl || activeQbankDoc.textContent) && (
                <div
                  ref={qbankReaderRef}
                  className="bg-white rounded-3xl border border-slate-200 p-6 scroll-mt-24 space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                    <h3 className="font-black text-lg text-slate-900">
                      {activeQbankDoc.title}
                    </h3>
                    <div className="flex gap-2">
                      {qbankViewMode === "text" && (
                        <button
                          onClick={() => setQbankTwoCol(!qbankTwoCol)}
                          className="hidden md:inline-flex px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer"
                        >
                          {qbankTwoCol ? "২-কলাম ভিউ (চালু)" : "২-কলামে দেখুন"}
                        </button>
                      )}
                      {qbankViewMode === "pdf" && activeQbankDoc.pdfUrl && (
                        <button
                          onClick={() => setIsPdfFullscreen(true)}
                          className="px-3.5 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" /> ফুলস্ক্রিন
                        </button>
                      )}
                    </div>
                  </div>

                  {qbankViewMode === "pdf" && activeQbankDoc.pdfUrl ? (
                    <iframe
                      src={formatSecurePdfUrl(activeQbankDoc.pdfUrl)}
                      className="w-full h-[760px] border-0 rounded-2xl"
                      title="QBank PDF"
                    />
                  ) : (
                    <div
                      className={`p-6 rounded-2xl bg-blue-50/40 border border-blue-200 text-base text-slate-900 leading-relaxed whitespace-pre-line font-medium clearfix ${
                        qbankTwoCol
                          ? "md:columns-2 md:gap-10 [column-rule:1px_solid_#bfdbfe]"
                          : ""
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: renderRichTextWithShortImageTokens(
                          activeQbankDoc.textContent ||
                            "এই ফাইলের টেক্সট নোট এখনো যুক্ত করা হয়নি।",
                          activeQbankDoc.embeddedImages
                        ),
                      }}
                    />
                  )}
                </div>
              )}
          </div>
        )}

        {/* ================= 4. LECTURE HUB ================= */}
        {activeTab === "subject_lectures" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#3b0764] text-white p-6 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">
                  {currentSubject.title} — লেকচার ও পিডিএফ হাব
                </h2>
                <p className="text-sm text-purple-200 mt-0.5">
                  মোট আপলোডকৃত লেকচার: {subjectLectures.length}টি
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
                    <Sparkles className="w-4 h-4" /> 📖 গল্পে গল্পে ভোকাবুলারি (
                    {vocabStories.length}টি গল্প)
                  </button>
                )}

                <select
                  value={activeSubjectId}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                  className="px-4 py-2.5 rounded-xl text-sm font-extrabold bg-white text-slate-900"
                >
                  {currentCourseSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeSubjectId === "english_grammar" &&
            activePdfStep === "vocab_story" ? (
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

                  <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
                    {vocabStories.map((st) => {
                      const stId = st._id || st.id;
                      const isSelected =
                        (activeVocabStory?._id || activeVocabStory?.id) ===
                        stId;
                      return (
                        <div
                          key={stId}
                          onClick={() => {
                            setActiveVocabStory(st);
                            smoothScrollToRef(vocabReaderRef);
                          }}
                          className={`premium-card p-3.5 rounded-xl border cursor-pointer ${
                            isSelected
                              ? "bg-[#2e1065] text-white border-[#2e1065]"
                              : "bg-white hover:border-violet-400"
                          }`}
                        >
                          <div
                            className={`text-[11px] font-extrabold ${
                              isSelected ? "text-amber-300" : "text-violet-700"
                            }`}
                          >
                            Story #
                            {st.storyNo < 10 ? `0${st.storyNo}` : st.storyNo}
                          </div>
                          <div className="font-extrabold text-sm mt-0.5">
                            {st.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  ref={vocabReaderRef}
                  className="lg:col-span-9 scroll-mt-24"
                >
                  {activeVocabStory && (
                    <div className="bg-white rounded-3xl border-2 border-violet-200 p-6 sm:p-9 shadow-sm space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {activeVocabStory.title}
                      </h3>
                      <div className="clearfix text-base sm:text-lg text-slate-900 leading-relaxed font-medium space-y-4">
                        {activeVocabStory.image1Url && (
                          <img
                            src={activeVocabStory.image1Url}
                            alt={activeVocabStory.title}
                            className="rounded-2xl border-4 border-amber-200 shadow-md object-cover md:float-right md:w-72 md:ml-6 mb-4"
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
                            alt="Story 2"
                            className="rounded-2xl border-4 border-violet-200 shadow-md object-cover md:float-left md:w-72 md:mr-6 mt-4 mb-4"
                          />
                        )}
                      </div>

                      {activeVocabStory.wordMeaningBox && (
                        <div
                          className="p-5 rounded-2xl bg-violet-50 border border-violet-200 text-sm sm:text-base leading-relaxed md:columns-2 md:gap-8"
                          dangerouslySetInnerHTML={{
                            __html: renderRichTextWithShortImageTokens(
                              activeVocabStory.wordMeaningBox,
                              activeVocabStory.embeddedImages
                            ),
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="font-extrabold text-base border-b pb-3">
                    লেকচার তালিকা ({subjectLectures.length}টি)
                  </div>
                  <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                    {subjectLectures.map((lec) => {
                      const lecId = lec._id || lec.id;
                      const isSelected =
                        (activeLecture?._id || activeLecture?.id) === lecId;
                      const isDone = progressMap[lecId]?.completed;
                      const num =
                        lec.lectureNo < 10
                          ? `0${lec.lectureNo}`
                          : lec.lectureNo;
                      return (
                        <div
                          key={lecId}
                          onClick={() => {
                            setActiveLecture(lec);
                            setActivePdfStep(
                              lec.videoUrl ? "video" : "lecture"
                            );
                            setStudentTwoColumnOverride(null);
                            smoothScrollToRef(studyResourceRef);
                          }}
                          className={`premium-card p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-8 h-8 rounded-lg text-xs font-extrabold flex items-center justify-center ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-slate-900"
                              }`}
                            >
                              {num}
                            </span>
                            <div>
                              <div className="text-sm font-bold leading-snug">
                                Lecture {num}: {lec.title}
                              </div>
                              <div
                                className={`text-xs ${
                                  isSelected
                                    ? "text-slate-300"
                                    : "text-slate-500"
                                }`}
                              >
                                {isDone ? "✓ সম্পন্ন" : "চলমান"}
                              </div>
                            </div>
                          </div>
                          <CheckCircle2
                            className={`w-5 h-5 shrink-0 ${
                              isDone ? "text-emerald-500" : "text-slate-300"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  ref={studyResourceRef}
                  className="lg:col-span-9 space-y-6 scroll-mt-24"
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
                            {currentSubject.title} • LECTURE 0
                            {activeLecture.lectureNo}
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
                                  contentViewMode === "pdf"
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-700"
                                }`}
                              >
                                📄 PDF View
                              </button>
                              <button
                                onClick={() => setContentViewMode("text")}
                                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer ${
                                  contentViewMode === "text"
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-700"
                                }`}
                              >
                                📝 Text View
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <button
                          onClick={() => setActivePdfStep("video")}
                          className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "video"
                              ? "bg-[#2e1065] text-white border-[#2e1065]"
                              : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <PlayCircle className="w-5 h-5 shrink-0 text-amber-400" />
                          <div>
                            <div className="text-sm font-extrabold">
                              ভিডিও লেকচার
                            </div>
                            <div className="text-xs opacity-80">
                              {activeLecture.videoDuration || "ক্লাস ভিডিও"}
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActivePdfStep("lecture")}
                          className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "lecture"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <FileText className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">
                              ১. মূল লেকচার নোট
                            </div>
                            <div className="text-xs opacity-80">
                              PDF ও রঙিন Text View
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActivePdfStep("mcq_pdf")}
                          className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "mcq_pdf"
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <HelpCircle className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">
                              ২. এই Chapter-এর সকল MCQ
                            </div>
                            <div className="text-xs opacity-80">
                              PDF ও Text View
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActivePdfStep("written_pdf")}
                          className={`premium-btn p-4 rounded-xl border text-left flex items-center gap-3 cursor-pointer ${
                            activePdfStep === "written_pdf"
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-slate-50 text-slate-900"
                          }`}
                        >
                          <PenTool className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="text-sm font-extrabold">
                              ৩. লিখিত প্রশ্ন ও উত্তর
                            </div>
                            <div className="text-xs opacity-80">
                              PDF ও রঙিন Text View
                            </div>
                          </div>
                        </button>
                      </div>

                      {activePdfStep === "video" && (
                        <div>
                          {activeLecture.videoUrl ? (
                            <div className="rounded-2xl overflow-hidden border-2 border-[#2e1065] bg-black aspect-video">
                              <iframe
                                src={getYoutubeEmbedUrl(activeLecture.videoUrl)}
                                className="w-full h-full border-0"
                                allowFullScreen
                                title="Video"
                              />
                            </div>
                          ) : (
                            <div className="p-10 rounded-2xl border border-dashed text-center bg-slate-50 font-bold text-slate-600">
                              এই লেকচারে কোনো ভিডিও যুক্ত করা হয়নি। পাশের মূল
                              লেকচার নোট (PDF বা Text View) দেখুন।
                            </div>
                          )}
                        </div>
                      )}

                      {activePdfStep === "lecture" && (
                        <div>
                          {contentViewMode === "pdf" &&
                          activeLecture.lecturePdfUrl ? (
                            <iframe
                              src={formatSecurePdfUrl(
                                activeLecture.lecturePdfUrl
                              )}
                              className="w-full h-[760px] rounded-2xl border"
                              title="Lecture PDF"
                            />
                          ) : (
                            <div
                              className={`p-6 rounded-2xl bg-white border text-base leading-relaxed whitespace-pre-line clearfix ${
                                isCurrentTextTwoColumn()
                                  ? "md:columns-2 md:gap-8 [column-rule:1px_solid_#e2e8f0]"
                                  : ""
                              }`}
                              dangerouslySetInnerHTML={{
                                __html: renderRichTextWithShortImageTokens(
                                  activeLecture.mainContent ||
                                    "এই লেকচারে এখনো কোনো নোট যুক্ত করা হয়নি।",
                                  activeLecture.embeddedImages
                                ),
                              }}
                            />
                          )}
                        </div>
                      )}

                      {activePdfStep === "mcq_pdf" && (
                        <div>
                          {contentViewMode === "pdf" &&
                          activeLecture.mcqPdfUrl ? (
                            <iframe
                              src={formatSecurePdfUrl(activeLecture.mcqPdfUrl)}
                              className="w-full h-[760px] rounded-2xl border"
                              title="MCQ PDF"
                            />
                          ) : (
                            <div
                              className="p-6 rounded-2xl bg-emerald-50/40 border text-base leading-relaxed whitespace-pre-line md:columns-2 md:gap-8 [column-rule:1px_solid_#a7f3d0] clearfix"
                              dangerouslySetInnerHTML={{
                                __html: renderRichTextWithShortImageTokens(
                                  activeLecture.mcqTextContent ||
                                    "এই অধ্যায়ের MCQ এখনো আপলোড করা হয়নি।",
                                  activeLecture.embeddedImages
                                ),
                              }}
                            />
                          )}
                        </div>
                      )}

                      {activePdfStep === "written_pdf" && (
                        <div>
                          {contentViewMode === "pdf" &&
                          activeLecture.writtenPdfUrl ? (
                            <iframe
                              src={formatSecurePdfUrl(
                                activeLecture.writtenPdfUrl
                              )}
                              className="w-full h-[760px] rounded-2xl border"
                              title="Written PDF"
                            />
                          ) : (
                            <div
                              className={`p-6 rounded-2xl bg-purple-50/40 border text-base leading-relaxed whitespace-pre-line clearfix ${
                                activeLecture.writtenTwoColumn
                                  ? "md:columns-2 md:gap-8"
                                  : ""
                              }`}
                              dangerouslySetInnerHTML={{
                                __html: renderRichTextWithShortImageTokens(
                                  activeLecture.writtenTextContent ||
                                    "লিখিত প্রশ্নোত্তর এখনো আপলোড করা হয়নি।",
                                  activeLecture.embeddedImages
                                ),
                              }}
                            />
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

        {/* ================= 5. "Bonus" HUB ================= */}
        {activeTab === "bonus_hub" && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#be185d] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  <Gift className="w-4 h-4" /> স্পেশাল বোনাস রিসোর্স ও শর্টকাট
                  টেকনিক
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Bonus — বিষয়ভিত্তিক টিপস, ভিডিও ও গাইডলাইন
                </h2>
                <p className="text-xs sm:text-sm text-pink-100">
                  {getCourseTitleLabel(selectedCourse)} — পরীক্ষায় এগিয়ে থাকার
                  জন্য স্পেশাল ভিডিও, নোটস এবং কৌশলসমূহ
                </p>
              </div>

              <select
                value={selectedBonusSubject}
                onChange={(e) => setSelectedBonusSubject(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm outline-none"
              >
                <option value="ALL">সকল বিষয়ের বোনাস কনটেন্ট</option>
                {currentCourseSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const filteredBonus = bonusItems.filter(
                (b) =>
                  (b.courseType || "bcs") === selectedCourse &&
                  (selectedBonusSubject === "ALL" ||
                    b.subjectId === selectedBonusSubject ||
                    b.subjectId === "ALL")
              );

              if (filteredBonus.length === 0) {
                return (
                  <div className="bg-white rounded-3xl border border-dashed p-14 text-center text-slate-500 font-bold">
                    এই কোর্সে এখনো কোনো বোনাস কনটেন্ট যুক্ত করা হয়নি।
                  </div>
                );
              }

              const currentBonus = activeBonusItem || filteredBonus[0];

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 space-y-2.5">
                    <div className="font-black text-base text-slate-900 border-b pb-2.5">
                      🎁 বোনাস টপিক তালিকা ({filteredBonus.length}টি)
                    </div>
                    {filteredBonus.map((item) => {
                      const bId = item._id || item.id;
                      const isSel =
                        (currentBonus?._id || currentBonus?.id) === bId;
                      return (
                        <div
                          key={bId}
                          onClick={() => {
                            setActiveBonusItem(item);
                            smoothScrollToRef(bonusReaderRef);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                            isSel
                              ? "bg-[#2e1065] text-white border-[#2e1065]"
                              : "bg-slate-50 hover:bg-pink-50/50"
                          }`}
                        >
                          <div
                            className={`text-[11px] font-extrabold ${
                              isSel ? "text-amber-300" : "text-pink-700"
                            }`}
                          >
                            {item.subjectTitle || "স্পেশাল বোনাস"}
                          </div>
                          <div className="font-black text-sm mt-0.5">
                            {item.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    ref={bonusReaderRef}
                    className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 scroll-mt-24"
                  >
                    {currentBonus && (
                      <>
                        <div className="border-b pb-4">
                          <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-black">
                            {currentBonus.subjectTitle}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                            {currentBonus.title}
                          </h3>
                        </div>

                        {currentBonus.videoUrl && (
                          <div className="rounded-2xl overflow-hidden border-2 border-[#2e1065] bg-black aspect-video">
                            <iframe
                              src={getYoutubeEmbedUrl(currentBonus.videoUrl)}
                              className="w-full h-full border-0"
                              allowFullScreen
                              title="Bonus Video"
                            />
                          </div>
                        )}

                        {currentBonus.pdfUrl && (
                          <iframe
                            src={formatSecurePdfUrl(currentBonus.pdfUrl)}
                            className="w-full h-[640px] rounded-2xl border"
                            title="Bonus PDF"
                          />
                        )}

                        {currentBonus.content && (
                          <div
                            className={`p-5 rounded-2xl bg-slate-50 border text-base leading-relaxed whitespace-pre-line font-medium clearfix ${
                              currentBonus.twoColumnDesktop
                                ? "md:columns-2 md:gap-8"
                                : ""
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: renderRichTextWithShortImageTokens(
                                currentBonus.content,
                                currentBonus.embeddedImages
                              ),
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================= 6. WEEKLY LIVE EXAM & TOP 100 LEADERBOARD ================= */}
        {activeTab === "biweekly_contest" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase">
                      <Calendar className="w-4 h-4" /> প্রতি শুক্রবার রাত
                      ৮:০০টায় (মাসে ৪টি সাপ্তাহিক লাইভ পরীক্ষা)
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-600 text-white text-xs font-black">
                      ✨ এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black">
                    {currentActiveContest?.title ||
                      "৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কম্বাইনড পরীক্ষা (২০০ এমসিকিউ)"}
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200">
                    মোট প্রশ্ন:{" "}
                    {currentActiveContest?.questions?.length || 200}টি · প্রতি
                    প্রশ্নে ৩৬ সেকেন্ড · পাস মার্ক: ৬০% · নেগেটিভ মার্কিং: ০.৫০
                    · পরীক্ষা শুরু হওয়ার ঠিক আগের মুহূর্ত পর্যন্ত রেজিস্ট্রেশন
                    খোলা থাকবে
                  </p>
                </div>

{!countdownParts.isExamLiveNow ? (
                  <div className="soft-zoom-pulse bg-white/10 backdrop-blur-md border border-fuchsia-400/40 p-4 rounded-2xl text-center shrink-0 w-full lg:w-auto">
                    <div className="text-[11px] font-extrabold text-amber-300 uppercase mb-2">
                      ⏳ {countdownParts.label}
                    </div>
                    <div className="grid grid-cols-4 gap-2.5 text-center">
                      <div className="bg-slate-950/80 px-3 py-2 rounded-xl">
                        <div className="text-xl font-black text-amber-400">
                          {countdownParts.days}
                        </div>
                        <div className="text-[10px] font-bold text-purple-200">
                          দিন
                        </div>
                      </div>
                      <div className="bg-slate-950/80 px-3 py-2 rounded-xl">
                        <div className="text-xl font-black text-amber-400">
                          {countdownParts.hours}
                        </div>
                        <div className="text-[10px] font-bold text-purple-200">
                          ঘণ্টা
                        </div>
                      </div>
                      <div className="bg-slate-950/80 px-3 py-2 rounded-xl">
                        <div className="text-xl font-black text-amber-400">
                          {countdownParts.minutes}
                        </div>
                        <div className="text-[10px] font-bold text-purple-200">
                          মিনিট
                        </div>
                      </div>
                      <div className="bg-slate-950/80 px-3 py-2 rounded-xl">
                        <div className="text-xl font-black text-emerald-400">
                          {countdownParts.seconds}
                        </div>
                        <div className="text-[10px] font-bold text-purple-200">
                          সেকেন্ড
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-500/20 border-2 border-emerald-400 px-5 py-4 rounded-2xl text-center shrink-0">
                    <div className="text-base font-black text-emerald-300">
                      🟢 লাইভ পরীক্ষা এখন চলছে!
                    </div>
                    <div className="text-xs text-purple-100 mt-0.5">
                      ‘পরীক্ষা শুরু করুন’ বাটনে ক্লিক করে অংশ নিন
                    </div>
                  </div>
                )}
              </div>

              {!isContestRoomActive && (
                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm font-bold text-emerald-300">
                    {myCurrentCycleSubmission
                      ? `✓ আপনি এই সপ্তাহের পরীক্ষায় অংশগ্রহণ করেছেন! আপনার বর্তমান মেধাক্রম: #${myLeaderboardRank} (প্রাপ্ত নম্বর: ${myCurrentCycleSubmission.totalScore})`
                      : isRegisteredForCurrentCycle
                      ? `✓ আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে (${profile.name})`
                      : countdownParts.registrationOpen
                      ? "পরীক্ষায় অংশ নিতে নাম, ফোন নম্বর, প্রতিষ্ঠান ও মোবাইল ব্যাংকিং সিলেক্ট করে রেজিস্টার করুন"
                      : "⛔ শুক্রবার রাত ৮:০০টার পরীক্ষা শুরু হয়ে গেছে — নতুন রেজিস্ট্রেশন বন্ধ রয়েছে"}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {myLatestParticipatedSubmission && (
                      <button
                        type="button"
                        onClick={() => setShowPreviousResultModal(true)}
                        className="premium-btn px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-amber-300/40 text-amber-300 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
                      >
                        <History className="w-4 h-4" /> পূর্ববর্তী ফলাফল (Top
                        100)
                      </button>
                    )}

                    {!myCurrentCycleSubmission && (
                      <button
                        onClick={
                          isRegisteredForCurrentCycle
                            ? handleLaunchWeeklyLiveExamRoom
                            : handleOpenRegistrationModal
                        }
                        className="premium-btn px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-xl cursor-pointer"
                      >
                        {isRegisteredForCurrentCycle
                          ? "🚀 লাইভ পরীক্ষা শুরু করুন →"
                          : countdownParts.registrationOpen
                          ? "রেজিস্ট্রেশন করুন এখনই, মাত্র ৩০ টাকায়"
                          : "🔒 রেজিস্ট্রেশন সমাপ্ত"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isContestRoomActive && myCurrentCycleSubmission && (
              <div className="space-y-5">
                <div className="bg-white rounded-3xl border-2 border-[#2e1065] p-6 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3.5">
                      {profile.avatarUrl ||
                      myCurrentCycleSubmission.avatarUrl ? (
                        <img
                          src={
                            profile.avatarUrl ||
                            myCurrentCycleSubmission.avatarUrl
                          }
                          alt={myCurrentCycleSubmission.name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-amber-400 shadow"
                        />
                      ) : (
                        <MiniExecutive2DAvatar size="w-16 h-16" />
                      )}
                      <div>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black">
                          আপনার মেধাক্রম: #{myLeaderboardRank} (সারা বাংলাদেশ)
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                          {myCurrentCycleSubmission.name} — মোট প্রাপ্ত নম্বর:{" "}
                          {myCurrentCycleSubmission.totalScore}
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-slate-600">
                          সঠিক: {myCurrentCycleSubmission.correctCount}টি • ভুল:{" "}
                          {myCurrentCycleSubmission.wrongCount}টি • নেগেটিভ
                          কর্তন: -{myCurrentCycleSubmission.negativePenalty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {myCurrentCycleSubmission.subjectBreakdown?.length > 0 && (
                    <div>
                      <h4 className="font-black text-sm text-slate-800 mb-2.5">
                        📊 আপনার বিষয়ভিত্তিক প্রাপ্ত নম্বর:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {myCurrentCycleSubmission.subjectBreakdown.map(
                          (sb, i) => (
                            <div
                              key={i}
                              className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between"
                            >
                              <div>
                                <div className="font-black text-xs sm:text-sm text-slate-900">
                                  {sb.subjectTitle}
                                </div>
                                <div className="text-[11px] font-bold text-slate-600">
                                  সঠিক: {sb.correct} • ভুল: {sb.wrong}
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-xl bg-[#2e1065] text-amber-300 font-black text-xs">
                                {sb.marks}/{sb.total}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <WrongAnswersSubjectReviewPanel
                  questions={currentActiveContest?.questions || []}
                  answersMap={myCurrentCycleSubmission.answersMap || {}}
                  isCombinedExam={true}
                />
              </div>
            )}

            {isContestRoomActive && currentActiveContest ? (
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-4 shadow-md">
                  <div className="font-extrabold text-base text-slate-900">
                    উত্তর দিয়েছেন: {Object.keys(contestAnswers).length} /{" "}
                    {currentActiveContest.questions.length}টি
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-black text-base">
                      ⏱ {formatTime(contestTimeLeft)}
                    </div>
                    <button
                      onClick={submitBiWeeklyContestExam}
                      disabled={contestSubmitting}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-black cursor-pointer"
                    >
                      খাতা জমা দিন
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentActiveContest.questions.map((q, idx) => {
                    const qKey = q.qNo || idx + 1;
                    const selectedOpt = contestAnswers[qKey];
                    return (
                      <div
                        key={qKey}
                        className="bg-white p-6 rounded-2xl border border-slate-200"
                      >
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <h3 className="font-extrabold text-base sm:text-lg">
                            {qKey}. {q.question}
                          </h3>
                          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-[#2e1065] text-xs font-extrabold shrink-0">
                            {q.subjectTitle || "সাধারণ বিষয়"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() =>
                                setContestAnswers({
                                  ...contestAnswers,
                                  [qKey]: optIdx,
                                })
                              }
                              className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer ${
                                selectedOpt === optIdx
                                  ? "bg-slate-900 text-white border-slate-900 font-extrabold"
                                  : "bg-white border-slate-300"
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
              /* NATIONAL TOP 100 LEADERBOARD */
              <div
                ref={leaderboardSectionRef}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-24"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                        জাতীয় মেধা তালিকা — শীর্ষ ১০০ (Top 100 Live Leaderboard)
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-slate-500">
                        এক পরীক্ষা, সারা বাংলাদেশ, এক লিডারবোর্ড • মোট
                        অংশগ্রহণকারী: {sortedLeaderboard.length} জন (প্রদর্শিত:
                        শীর্ষ {top100Leaderboard.length} জন)
                      </p>
                    </div>
                  </div>
                </div>

                {top100Leaderboard.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed text-slate-600 font-bold text-base">
                    এখনো কেউ খাতা জমা দেয়নি। রেজিস্টার করে প্রথম স্থান অর্জন
                    করুন!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {top100Leaderboard.map((sub, idx) => {
                      const isMe =
                        sub.studentKey === studentUniqueKey ||
                        (profile.phone && sub.phone === profile.phone);
                      const displayAvatar =
                        isMe && profile.avatarUrl
                          ? profile.avatarUrl
                          : sub.avatarUrl;

                      return (
                        <div
                          key={idx}
                          className={`p-5 sm:p-6 rounded-3xl border-2 transition space-y-4 ${
                            isMe
                              ? "bg-purple-50/70 border-[#4c1d95] shadow-md"
                              : idx === 0
                              ? "bg-amber-50/50 border-amber-300"
                              : "bg-slate-50/80 border-slate-200/90"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center shrink-0 shadow-xs ${
                                  idx === 0
                                    ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950"
                                    : idx === 1
                                    ? "bg-slate-300 text-slate-900"
                                    : idx === 2
                                    ? "bg-amber-700 text-white"
                                    : "bg-[#2e1065] text-white"
                                }`}
                              >
                                #{idx + 1}
                              </div>

                              {displayAvatar ? (
                                <img
                                  src={displayAvatar}
                                  alt={sub.name}
                                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-3 border-white shadow-md shrink-0"
                                />
                              ) : (
                                <MiniExecutive2DAvatar size="w-14 h-14 sm:w-16 sm:h-16" />
                              )}

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-black text-lg sm:text-xl text-slate-900">
                                    {sub.name}
                                  </h4>
                                  {isMe && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#4c1d95] text-white text-xs font-extrabold">
                                      আপনি
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-bold text-slate-600 flex items-center gap-1.5 mt-0.5">
                                  <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
                                  <span>
                                    {sub.institution || "স্বতন্ত্র পরীক্ষার্থী"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs">
                              <div className="font-black text-xl sm:text-2xl text-[#2e1065]">
                                {sub.totalScore}{" "}
                                <span className="text-xs font-extrabold text-slate-500">
                                  / ২০০
                                </span>
                              </div>
                              <div className="text-xs font-extrabold text-slate-600 mt-0.5">
                                সঠিক: {sub.correctCount || 0} • ভুল:{" "}
                                {sub.wrongCount || 0}
                              </div>
                            </div>
                          </div>

                          {sub.subjectBreakdown?.length > 0 && (
                            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                              <span className="text-xs font-black text-slate-700 mr-1">
                                বিষয়ভিত্তিক নম্বর:
                              </span>
                              {sub.subjectBreakdown.map((sb, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-extrabold text-slate-800 shadow-2xs"
                                >
                                  {sb.subjectTitle}:{" "}
                                  <strong className="text-[#4c1d95]">
                                    {sb.marks}
                                  </strong>
                                  /{sb.total}
                                </span>
                              ))}
                            </div>
                          )}

                          {sub.weakSubjects?.length > 0 && (
                            <div className="text-xs sm:text-sm font-extrabold text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200">
                              ⚠️ মনোযোগ প্রয়োজন: {sub.weakSubjects.join(", ")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= 7. ACTIVE CHAPTER EXAM ROOM ================= */}
        {activeTab === "active_exam_room" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap justify-between items-center gap-4 sticky top-16 z-30">
              <h2 className="text-xl font-extrabold text-slate-900">
                {examTitle}
              </h2>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl font-extrabold">
                  ⏱ {formatTime(timeLeft)}
                </div>
                {!examSubmitted && (
                  <button
                    onClick={handleFinishExam}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-extrabold cursor-pointer"
                  >
                    খাতা জমা দিন
                  </button>
                )}
              </div>
            </div>

            {examSubmitted ? (
              <div className="space-y-6">
                <div className="bg-white border-2 border-slate-900 p-6 rounded-3xl shadow-sm">
                  {(() => {
                    const res = calculateExamResult();
                    return (
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                            📊 প্রাপ্ত নম্বর: {res.finalScore} / {res.totalQ} (
                            {res.scorePercentage}%) —{" "}
                            {res.isPassed ? "🎉 উত্তীর্ণ" : "⚠️ অনুত্তীর্ণ"}
                          </h3>
                          <p className="text-xs sm:text-sm font-bold text-slate-600">
                            সঠিক উত্তর: {res.correct}টি • ভুল উত্তর: {res.wrong}
                            টি • উত্তর দেননি: {res.unanswered}টি • নেগেটিভ কর্তন:
                            -{res.negativePenalty}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setExamAnswers({});
                            setExamSubmitted(false);
                            setTimeLeft(examQuestions.length * 36);
                          }}
                          className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-extrabold cursor-pointer"
                        >
                          আবার পরীক্ষা দিন
                        </button>
                      </div>
                    );
                  })()}
                </div>

                <WrongAnswersSubjectReviewPanel
                  questions={examQuestions.map((q) => ({
                    ...q,
                    subjectTitle:
                      currentCourseSubjects.find(
                        (s) => s.id === activeExamSet?.subjectId
                      )?.title ||
                      activeExamSet?.chapterName ||
                      "অধ্যায়ভিত্তিক টেস্ট",
                  }))}
                  answersMap={examAnswers}
                  isCombinedExam={false}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {examQuestions.map((q, idx) => {
                  const qKey = q._id || q.qNo || idx;
                  const selectedOpt = examAnswers[qKey];

                  return (
                    <div
                      key={qKey}
                      className="bg-white p-6 rounded-2xl border border-slate-200"
                    >
                      <h3 className="font-extrabold text-base mb-4">
                        {idx + 1}. {q.question}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() =>
                              setExamAnswers({
                                ...examAnswers,
                                [qKey]: optIdx,
                              })
                            }
                            className={`p-3.5 rounded-xl border text-left text-sm font-semibold cursor-pointer ${
                              selectedOpt === optIdx
                                ? "bg-slate-900 text-white border-slate-900 font-extrabold"
                                : "bg-white border-slate-300"
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
            )}
          </div>
        )}

        {/* ================= 8. SYLLABUS TAB WITH NEON BORDER CARDS & CLICKABLE POPUP MODAL (Requirement 5) ================= */}
        {activeTab === "syllabus" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#2e1065] to-[#4c1d95] text-white p-6 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                  {dynamicTargetGoalLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1.5">
                  {getCourseTitleLabel(selectedCourse)} — বিষয়ভিত্তিক সিলেবাস ও
                  নম্বরবণ্টন
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 mt-0.5">
                  💡 যেকোনো সিলেবাস কার্ডে ক্লিক করলে বিস্তারিত সিলেবাস ও ভাইভা
                  গাইডলাইন পপ-আপ উইন্ডোতে দেখা যাবে।
                </p>
              </div>

              {selectedCourse !== "bcs" &&
                DEFENSE_COURSES_CATALOG[selectedCourse]?.vivaGuide && (
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-amber-300/40 max-w-md text-xs text-amber-200 leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5">
                      🎙️ মৌখিক ও ভাইভা প্রস্তুতি:
                    </strong>
                    {DEFENSE_COURSES_CATALOG[selectedCourse].vivaGuide}
                  </div>
                )}
            </div>

            {currentCourseSubjects.map((sub, idx) => {
              // Merge default syllabus topics with any Admin-uploaded custom syllabus items for this course & subject
              const customSubTopics = syllabusItems.filter(
                (item) =>
                  item.courseType === selectedCourse &&
                  item.subjectId === sub.id
              );

              const topicsToDisplay =
                customSubTopics.length > 0
                  ? customSubTopics.map((ct) => ({
                      topicTitle: ct.topicTitle,
                      marksText:
                        ct.marksText ||
                        sub.marksLabel ||
                        `${sub.examMarks || sub.preliMarks} নম্বর`,
                      shortSummary: ct.shortSummary || ct.detailedPopupContent,
                      detailedPopupContent:
                        ct.detailedPopupContent || ct.shortSummary,
                      vivaGuidelines:
                        ct.vivaGuidelines ||
                        DEFENSE_COURSES_CATALOG[selectedCourse]?.vivaGuide ||
                        "",
                      embeddedImages: ct.embeddedImages || {},
                    }))
                  : (sub.syllabusBreakdown || []).map((item) => ({
                      topicTitle: item.topic,
                      marksText:
                        typeof item.marks === "number"
                          ? `${item.marks} নম্বর`
                          : item.marks,
                      shortSummary: item.details,
                      detailedPopupContent: item.details,
                      vivaGuidelines:
                        DEFENSE_COURSES_CATALOG[selectedCourse]?.vivaGuide ||
                        "",
                      embeddedImages: {},
                    }));

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs"
                >
                  <div className="p-5 bg-slate-50 border-b flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-xl ${sub.bg} ${sub.text} font-black flex items-center justify-center text-sm`}
                      >
                        {sub.initial}
                      </span>
                      <div>
                        <h3 className="font-black text-base sm:text-lg text-slate-900">
                          {idx + 1}. {sub.title}
                        </h3>
                        <span className="text-xs font-extrabold text-purple-800">
                          মোট নম্বর:{" "}
                          {sub.marksLabel ||
                            `${sub.examMarks || sub.preliMarks} নম্বর`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectSubject(sub.id)}
                      className="premium-btn px-4 py-2 bg-[#2e1065] text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      লেকচার দেখুন →
                    </button>
                  </div>

                  {/* REQUIREMENT 5: SYLLABUS CARDS WITH NEON BORDER, HOVER EFFECT & CLICK POPUP */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topicsToDisplay.map((tItem, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          setActiveSyllabusModalData({
                            subjectId: sub.id,
                            subjectTitle: sub.title,
                            topicTitle: tItem.topicTitle,
                            marksText: tItem.marksText,
                            shortSummary: tItem.shortSummary,
                            detailedPopupContent: tItem.detailedPopupContent,
                            vivaGuidelines: tItem.vivaGuidelines,
                            embeddedImages: tItem.embeddedImages,
                          })
                        }
                        className="neon-border-card p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-purple-50/40 cursor-pointer flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2 font-black text-sm text-slate-900">
                            <span>{tItem.topicTitle}</span>
                            <span className="text-emerald-700 shrink-0 text-xs font-black bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              {tItem.marksText}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                            {tItem.shortSummary}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-extrabold text-[#4c1d95]">
                          <span>বিস্তারিত সিলেবাস পপ-আপে দেখুন</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= 9. CENTRAL ADMIN PANEL (SUPPORTS ALL COURSES, SYLLABUS CMS & NOTIFICATIONS) ================= */}
        {activeTab === "admin" && (
          <div>
            {!isAdminUnlocked ? (
              <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border shadow-sm text-center my-12">
                <KeyRound className="w-10 h-10 text-[#2e1065] mx-auto mb-3" />
                <h2 className="text-xl font-extrabold mb-1">
                  BCS Path & Defense — Admin Panel
                </h2>
                <p className="text-sm text-slate-600 mb-5">
                  পিন দিয়ে আনলক করুন (`bcs2026`)
                </p>
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
                {/* COURSE SELECTOR IN ADMIN PANEL (Supports BCS + Every Individual Defense/Police Sub-Course) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2e1065] text-xs font-black">
                        Multi-Course Admin CMS
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                        যে কোর্সের কনটেন্ট আপলোড বা আপডেট করতে চান সেটি নির্বাচন
                        করুন
                      </h3>
                    </div>

                    <select
                      value={adminCourseTrack}
                      onChange={(e) => handleAdminCourseSwitch(e.target.value)}
                      className="px-4 py-3 rounded-2xl border-2 border-[#2e1065] bg-purple-50 text-[#2e1065] font-black text-sm outline-none"
                    >
                      <option value="bcs">
                        📚 ৫২ তম বিসিএস স্ট্যান্ডার্ড অল সাবজেক্টস কোর্স (BCS)
                      </option>
                      {Object.values(DEFENSE_COURSES_CATALOG).map((c) => (
                        <option key={c.id} value={c.id}>
                          🛡️ {c.fullTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Course Pills */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdminCourseSwitch("bcs")}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
                        adminCourseTrack === "bcs"
                          ? "bg-[#2e1065] text-amber-300 shadow"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      📚 BCS Course
                    </button>
                    {Object.values(DEFENSE_COURSES_CATALOG).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleAdminCourseSwitch(c.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition ${
                          adminCourseTrack === c.id
                            ? "bg-[#2e1065] text-amber-300 shadow"
                            : "bg-slate-100 text-slate-700 hover:bg-purple-50"
                        }`}
                      >
                        🛡️ {c.title}
                      </button>
                    ))}
                  </div>

                  {/* Admin Module Tabs */}
                  <div className="flex flex-wrap gap-2.5 pt-3 border-t">
                    <button
                      onClick={() => setAdminSection("lectures")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "lectures"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      ১. লেকচার আপলোড (Video + PDF + Text)
                    </button>

                    <button
                      onClick={() => setAdminSection("syllabus_cms")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "syllabus_cms"
                          ? "bg-purple-700 text-white"
                          : "bg-purple-50 text-purple-900 border border-purple-200"
                      }`}
                    >
                      📋 সিলেবাস ও পপ-আপ কনটেন্ট আপলোড
                    </button>

                    {adminCourseTrack === "bcs" && (
                      <button
                        onClick={() => setAdminSection("vocab_stories")}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                          adminSection === "vocab_stories"
                            ? "bg-violet-700 text-white"
                            : "bg-violet-50 text-violet-900 border border-violet-200"
                        }`}
                      >
                        📖 গল্পে গল্পে ভোকাবুলারি স্টোরি
                      </button>
                    )}

                    <button
                      onClick={() => setAdminSection("exam_builder")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "exam_builder"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      }`}
                    >
                      🎯 অধ্যায়ভিত্তিক Test 1 ও Test 2
                    </button>

                    {adminCourseTrack === "bcs" && (
                      <button
                        onClick={() => setAdminSection("biweekly_200")}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                          adminSection === "biweekly_200"
                            ? "bg-amber-500 text-slate-950"
                            : "bg-amber-50 text-amber-950 border border-amber-300"
                        }`}
                      >
                        🏆 Weekly Live Exam (২০০ MCQ)
                      </button>
                    )}

                    <button
                      onClick={() => setAdminSection("qbank")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "qbank"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      প্রশ্ন ব্যাংক আপলোড
                    </button>

                    <button
                      onClick={() => setAdminSection("job_news")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "job_news"
                          ? "bg-pink-600 text-white"
                          : "bg-pink-50 text-pink-900 border border-pink-200"
                      }`}
                    >
                      📰 চাকরির আপডেট খবর
                    </button>

                    <button
                      onClick={() => setAdminSection("bonus_cms")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "bonus_cms"
                          ? "bg-indigo-700 text-white"
                          : "bg-indigo-50 text-indigo-900 border border-indigo-200"
                      }`}
                    >
                      🎁 Bonus (টিপস ও ভিডিও)
                    </button>

                    <button
                      onClick={() => setAdminSection("notifications_cms")}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer ${
                        adminSection === "notifications_cms"
                          ? "bg-rose-600 text-white"
                          : "bg-rose-50 text-rose-900 border border-rose-200"
                      }`}
                    >
                      🔔 নোটিফিকেশন পাঠান
                    </button>
                  </div>
                </div>

                {/* ADMIN SECTION 1: LECTURE UPLOADER */}
                {adminSection === "lectures" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
                      <h3 className="text-xl font-extrabold">
                        {editingId
                          ? "✏️ লেকচার আপডেট করুন"
                          : `➕ নতুন লেকচার আপলোড করুন (${getCourseTitleLabel(
                              adminCourseTrack
                            )})`}
                      </h3>
                      <form
                        onSubmit={handleSaveLecture}
                        className="space-y-5 text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border">
                          <div>
                            <label className="font-extrabold block mb-1">
                              বিষয় (Subject) নির্বাচন করুন *
                            </label>
                            <select
                              value={formData.subjectId}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  subjectId: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-xl bg-white font-bold"
                            >
                              {getSubjectsForCourse(adminCourseTrack).map(
                                (s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.title}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1">
                              লেকচার নম্বর (1, 2, 3...) *
                            </label>
                            <input
                              type="number"
                              value={formData.lectureNo}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  lectureNo: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-xl bg-white font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">
                            লেকচারের শিরোনাম (Title) *
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: লেকচার ১: ধ্বনি ও বর্ণ প্রকরণ"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="w-full p-3 border rounded-xl font-semibold"
                          />
                        </div>

                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                          <label className="font-extrabold text-[#2e1065] block">
                            🎬 YouTube Unlisted লেকচার ভিডিও লিংক
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="https://youtu.be/xxxx"
                              value={formData.videoUrl}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  videoUrl: e.target.value,
                                })
                              }
                              className="sm:col-span-2 p-2.5 border rounded-xl bg-white"
                            />
                            <input
                              type="text"
                              placeholder="১৫ মিনিট"
                              value={formData.videoDuration}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  videoDuration: e.target.value,
                                })
                              }
                              className="p-2.5 border rounded-xl bg-white"
                            />
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-blue-50/50 border-2 border-blue-200 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-extrabold text-base text-blue-950">
                              📘 ১. মূল লেকচার নোট (PDF + Text View)
                            </h4>
                            <label className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-900 bg-white px-3 py-1.5 rounded-lg border border-blue-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.lectureTwoColumn}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    lectureTwoColumn: e.target.checked,
                                  })
                                }
                              />
                              <span>ডেস্কটপ/ট্যাবলেটে ২-কলামে দেখান</span>
                            </label>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="লেকচার PDF লিংক অথবা ফাইল আপলোড করুন..."
                              value={formData.lecturePdfUrl}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  lecturePdfUrl: e.target.value,
                                })
                              }
                              className="flex-1 p-2.5 border rounded-xl bg-white"
                            />
                            <label className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> মূল লেকচার PDF আপলোড
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleAdminPdfFileSelect(e, "lecturePdfUrl")
                                }
                                className="hidden"
                              />
                            </label>
                          </div>
                          <RichTextColorEditor
                            label="📝 মূল লেকচার নোট — Text View"
                            value={formData.mainContent}
                            onChange={(val) =>
                              setFormData({ ...formData, mainContent: val })
                            }
                            embeddedImages={formData.embeddedImages}
                            onUpdateImages={(imgs) =>
                              setFormData({ ...formData, embeddedImages: imgs })
                            }
                            placeholder="মূল লেকচার নোটের টেক্সট এখানে লিখুন..."
                            rows={5}
                          />
                        </div>

                        <div className="p-5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-extrabold text-base text-emerald-950">
                              📗 ২. “এই Chapter-এর সকল MCQ” (PDF + Text View)
                            </h4>
                            <label className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.mcqTwoColumn}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    mcqTwoColumn: e.target.checked,
                                  })
                                }
                              />
                              <span>✓ ডেস্কটপে ২-কলামে MCQ দেখান</span>
                            </label>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="সকল MCQ PDF লিংক অথবা ফাইল আপলোড করুন..."
                              value={formData.mcqPdfUrl}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  mcqPdfUrl: e.target.value,
                                })
                              }
                              className="flex-1 p-2.5 border rounded-xl bg-white"
                            />
                            <label className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> সকল MCQ PDF আপলোড
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleAdminPdfFileSelect(e, "mcqPdfUrl")
                                }
                                className="hidden"
                              />
                            </label>
                          </div>
                          <RichTextColorEditor
                            label="📝 এই Chapter-এর সকল MCQ — Text View"
                            value={formData.mcqTextContent}
                            onChange={(val) =>
                              setFormData({ ...formData, mcqTextContent: val })
                            }
                            embeddedImages={formData.embeddedImages}
                            onUpdateImages={(imgs) =>
                              setFormData({ ...formData, embeddedImages: imgs })
                            }
                            placeholder="অধ্যায়ভিত্তিক সকল MCQ এখানে পেস্ট করুন..."
                            rows={5}
                          />
                        </div>

                        <div className="p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-200 space-y-4">
                          <h4 className="font-extrabold text-base text-purple-950">
                            📙 ৩. “লিখিত প্রশ্ন ও উত্তর” (PDF + Text View)
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="লিখিত PDF লিংক অথবা ফাইল আপলোড করুন..."
                              value={formData.writtenPdfUrl}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  writtenPdfUrl: e.target.value,
                                })
                              }
                              className="flex-1 p-2.5 border rounded-xl bg-white"
                            />
                            <label className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                              <Upload className="w-4 h-4" /> লিখিত PDF আপলোড
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                  handleAdminPdfFileSelect(e, "writtenPdfUrl")
                                }
                                className="hidden"
                              />
                            </label>
                          </div>
                          <RichTextColorEditor
                            label="📝 লিখিত প্রশ্ন ও উত্তর — Text View"
                            value={formData.writtenTextContent}
                            onChange={(val) =>
                              setFormData({
                                ...formData,
                                writtenTextContent: val,
                              })
                            }
                            embeddedImages={formData.embeddedImages}
                            onUpdateImages={(imgs) =>
                              setFormData({ ...formData, embeddedImages: imgs })
                            }
                            placeholder="লিখিত প্রশ্নোত্তর এখানে পেস্ট করুন..."
                            rows={4}
                          />
                        </div>

                        {renderAdminOptionalNotificationBox()}

                        <button
                          type="submit"
                          className="premium-btn w-full py-4 bg-slate-900 text-white rounded-2xl text-base font-black hover:bg-black cursor-pointer shadow-lg"
                        >
                          {editingId
                            ? "✓ আপডেট সেভ করুন"
                            : "🚀 লেকচার পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                        <Filter className="w-4 h-4 text-purple-700" /> সাবজেক্ট
                        অনুযায়ী আপলোডকৃত লেকচার দেখুন
                      </h4>

                      <select
                        value={adminLectureFilterSubject}
                        onChange={(e) =>
                          setAdminLectureFilterSubject(e.target.value)
                        }
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 font-extrabold text-sm text-slate-900"
                      >
                        <option value="ALL">
                          সকল সাবজেক্ট (
                          {
                            lectures.filter(
                              (l) => (l.courseType || "bcs") === adminCourseTrack
                            ).length
                          }
                          টি লেকচার)
                        </option>
                        {getSubjectsForCourse(adminCourseTrack).map((s) => {
                          const cnt = lectures.filter(
                            (l) =>
                              (l.courseType || "bcs") === adminCourseTrack &&
                              l.subjectId === s.id
                          ).length;
                          return (
                            <option key={s.id} value={s.id}>
                              {s.title} ({cnt}টি লেকচার)
                            </option>
                          );
                        })}
                      </select>

                      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                        {lectures
                          .filter(
                            (l) =>
                              (l.courseType || "bcs") === adminCourseTrack &&
                              (adminLectureFilterSubject === "ALL" ||
                                l.subjectId === adminLectureFilterSubject)
                          )
                          .map((lec) => {
                            const lKey = lec._id || lec.id;
                            const subObj = getSubjectsForCourse(
                              adminCourseTrack
                            ).find((s) => s.id === lec.subjectId);
                            return (
                              <div
                                key={lKey}
                                className="p-4 rounded-2xl border bg-slate-50 space-y-2.5"
                              >
                                <div className="text-xs font-extrabold text-purple-800">
                                  {subObj?.title || lec.subjectId} · Lec{" "}
                                  {lec.lectureNo}
                                </div>
                                <div className="font-extrabold text-sm text-slate-900">
                                  {lec.title}
                                </div>
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
                    </div>
                  </div>
                )}

                {/* ADMIN SECTION: SYLLABUS & POPUP MODAL CMS (Requirement 5) */}
                {adminSection === "syllabus_cms" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-purple-200 space-y-5">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-[#2e1065] text-xs font-black">
                          {getCourseTitleLabel(adminCourseTrack)} — সিলেবাস
                          পপ-আপ কনটেন্ট
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          📋 বিষয়ভিত্তিক সিলেবাস আপলোড ও সম্পাদনা করুন
                        </h3>
                      </div>

                      <form
                        onSubmit={handleSaveSyllabusItem}
                        className="space-y-4 text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="font-extrabold block mb-1">
                              বিষয় নির্বাচন করুন *
                            </label>
                            <select
                              value={syllabusForm.subjectId}
                              onChange={(e) =>
                                setSyllabusForm({
                                  ...syllabusForm,
                                  subjectId: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                            >
                              {getSubjectsForCourse(adminCourseTrack).map(
                                (s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.title}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1">
                              নম্বর (যেমন: ২০ নম্বর)
                            </label>
                            <input
                              type="text"
                              value={syllabusForm.marksText}
                              onChange={(e) =>
                                setSyllabusForm({
                                  ...syllabusForm,
                                  marksText: e.target.value,
                                })
                              }
                              placeholder="যেমন: ২০ নম্বর / লিখিত অংশ"
                              className="w-full p-3 border rounded-xl font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">
                            সিলেবাস কার্ডের শিরোনাম (Topic Title) *
                          </label>
                          <input
                            type="text"
                            value={syllabusForm.topicTitle}
                            onChange={(e) =>
                              setSyllabusForm({
                                ...syllabusForm,
                                topicTitle: e.target.value,
                              })
                            }
                            placeholder="যেমন: প্রাচীন ও মধ্যযুগ / পাটিগণিত ও বীজগণিত"
                            className="w-full p-3 border rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">
                            কার্ডের সংক্ষিপ্ত বিবরণ (Short Summary) *
                          </label>
                          <input
                            type="text"
                            value={syllabusForm.shortSummary}
                            onChange={(e) =>
                              setSyllabusForm({
                                ...syllabusForm,
                                shortSummary: e.target.value,
                              })
                            }
                            placeholder="সিলেবাস কার্ডের ভেতরে যে সংক্ষিপ্ত লেখাটি দেখাবে..."
                            className="w-full p-3 border rounded-xl font-medium"
                          />
                        </div>

                        <RichTextColorEditor
                          label="📖 পপ-আপ উইন্ডোর বিস্তারিত সিলেবাস (কার্ডে ক্লিক করলে পপ-আপে যা দেখাবে)"
                          value={syllabusForm.detailedPopupContent}
                          onChange={(val) =>
                            setSyllabusForm({
                              ...syllabusForm,
                              detailedPopupContent: val,
                            })
                          }
                          embeddedImages={syllabusForm.embeddedImages}
                          onUpdateImages={(imgs) =>
                            setSyllabusForm({
                              ...syllabusForm,
                              embeddedImages: imgs,
                            })
                          }
                          placeholder="এখানে পপ-আপ উইন্ডোর জন্য বিস্তারিত সিলেবাস, অধ্যায়সমূহ ও বুকলিস্ট লিখুন..."
                          rows={6}
                        />

                        <div>
                          <label className="font-extrabold block mb-1">
                            🎙️ ভাইভা / ISSB প্রস্তুতির নির্দেশনা (ঐচ্ছিক)
                          </label>
                          <textarea
                            rows={2}
                            value={syllabusForm.vivaGuidelines}
                            onChange={(e) =>
                              setSyllabusForm({
                                ...syllabusForm,
                                vivaGuidelines: e.target.value,
                              })
                            }
                            placeholder="ভাইভা প্রস্তুতির টিপস থাকলে লিখুন..."
                            className="w-full p-3 border rounded-xl text-xs font-medium"
                          />
                        </div>

                        {renderAdminOptionalNotificationBox()}

                        <button
                          type="submit"
                          className="premium-btn w-full py-4 bg-[#2e1065] text-white rounded-2xl text-base font-black cursor-pointer shadow-lg"
                        >
                          {editingSyllabusId
                            ? "✓ সিলেবাস আপডেট করুন"
                            : "🚀 সিলেবাস পপ-আপ কনটেন্ট পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">
                        কাস্টম আপলোডকৃত সিলেবাস (
                        {
                          syllabusItems.filter(
                            (s) => s.courseType === adminCourseTrack
                          ).length
                        }
                        টি)
                      </h4>
                      {syllabusItems
                        .filter((s) => s.courseType === adminCourseTrack)
                        .map((item) => {
                          const sId = item._id || item.id;
                          return (
                            <div
                              key={sId}
                              className="p-3.5 rounded-xl border bg-slate-50 space-y-2"
                            >
                              <div className="text-[11px] font-extrabold text-purple-700">
                                {item.subjectTitle} • {item.marksText}
                              </div>
                              <div className="font-black text-sm">
                                {item.topicTitle}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingSyllabusId(sId);
                                    setSyllabusForm({
                                      courseType:
                                        item.courseType || adminCourseTrack,
                                      subjectId: item.subjectId,
                                      topicIndex: item.topicIndex || 1,
                                      topicTitle: item.topicTitle,
                                      marksText: item.marksText || "",
                                      shortSummary: item.shortSummary || "",
                                      detailedPopupContent:
                                        item.detailedPopupContent || "",
                                      vivaGuidelines:
                                        item.vivaGuidelines || "",
                                      embeddedImages:
                                        item.embeddedImages || {},
                                    });
                                  }}
                                  className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  এডিট
                                </button>
                                <button
                                  onClick={() => handleDeleteSyllabusItem(sId)}
                                  className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg cursor-pointer"
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

                {/* ADMIN SECTION 2: STORY VOCABULARY BUILDER */}
                {adminCourseTrack === "bcs" &&
                  adminSection === "vocab_stories" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-violet-200 space-y-5">
                        <h3 className="text-xl font-extrabold text-slate-900">
                          📖 গল্পে গল্পে বিসিএস স্ট্যান্ডার্ড ভোকাবুলারি স্টোরি
                          আপলোড করুন
                        </h3>

                        <form
                          onSubmit={handleSaveVocabStory}
                          className="space-y-5 text-sm"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="font-extrabold block mb-1">
                                স্টোরি নম্বর *
                              </label>
                              <input
                                type="number"
                                value={vocabFormData.storyNo}
                                onChange={(e) =>
                                  setVocabFormData({
                                    ...vocabFormData,
                                    storyNo: e.target.value,
                                  })
                                }
                                className="w-full p-3 border rounded-xl font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="font-extrabold block mb-1">
                                গল্পের শিরোনাম (Story Title) *
                              </label>
                              <input
                                type="text"
                                placeholder="যেমন: Story 01: দ্য লস্ট কিংডম ও ৫০টি হাই-ফ্রিকোয়েন্সি বিসিএস ভোকাবুলারি"
                                value={vocabFormData.title}
                                onChange={(e) =>
                                  setVocabFormData({
                                    ...vocabFormData,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full p-3 border rounded-xl font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-violet-50/60 border border-violet-200">
                            <div className="p-3.5 bg-white rounded-xl border space-y-2.5">
                              <span className="font-extrabold text-xs text-violet-950 block">
                                🖼️ স্টোরি ইমেজ ১
                              </span>
                              <label className="w-full py-2 bg-violet-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" /> ইমেজ ১ আপলোড
                                করুন
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleVocabStoryImageUpload(e, "image1Url")
                                  }
                                  className="hidden"
                                />
                              </label>
                            </div>

                            <div className="p-3.5 bg-white rounded-xl border space-y-2.5">
                              <span className="font-extrabold text-xs text-violet-950 block">
                                🖼️ স্টোরি ইমেজ ২
                              </span>
                              <label className="w-full py-2 bg-violet-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" /> ইমেজ ২ আপলোড
                                করুন
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleVocabStoryImageUpload(e, "image2Url")
                                  }
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          <RichTextColorEditor
                            label="📖 মূল গল্পের টেক্সট"
                            value={vocabFormData.storyContent}
                            onChange={(val) =>
                              setVocabFormData({
                                ...vocabFormData,
                                storyContent: val,
                              })
                            }
                            embeddedImages={vocabFormData.embeddedImages}
                            onUpdateImages={(imgs) =>
                              setVocabFormData({
                                ...vocabFormData,
                                embeddedImages: imgs,
                              })
                            }
                            placeholder="এখানে গল্পটি লিখুন..."
                            rows={7}
                          />

                          <RichTextColorEditor
                            label="📝 শব্দের অর্থ ও Synonym/Antonym বক্স"
                            value={vocabFormData.wordMeaningBox}
                            onChange={(val) =>
                              setVocabFormData({
                                ...vocabFormData,
                                wordMeaningBox: val,
                              })
                            }
                            embeddedImages={vocabFormData.embeddedImages}
                            onUpdateImages={(imgs) =>
                              setVocabFormData({
                                ...vocabFormData,
                                embeddedImages: imgs,
                              })
                            }
                            placeholder="গল্পে ব্যবহৃত ভোকাবুলারিগুলোর বাংলা অর্থ ও সিনোনিম এখানে দিন..."
                            rows={4}
                          />

                          {renderAdminOptionalNotificationBox()}

                          <button
                            type="submit"
                            className="premium-btn w-full py-4 bg-violet-800 text-white rounded-2xl text-base font-black cursor-pointer shadow-lg"
                          >
                            {editingVocabId
                              ? "✓ স্টোরি আপডেট করুন"
                              : "🚀 ভোকাবুলারি স্টোরি পাবলিশ করুন"}
                          </button>
                        </form>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="font-extrabold text-base">
                          আপলোডকৃত স্টোরি ({vocabStories.length}টি)
                        </h4>
                        {vocabStories.map((st) => {
                          const sId = st._id || st.id;
                          return (
                            <div
                              key={sId}
                              className="p-3.5 rounded-xl border bg-slate-50 space-y-2"
                            >
                              <div className="text-xs font-extrabold text-violet-700">
                                Story #{st.storyNo}
                              </div>
                              <div className="font-extrabold text-sm">
                                {st.title}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingVocabId(sId);
                                    setVocabFormData({
                                      ...st,
                                      embeddedImages: st.embeddedImages || {},
                                    });
                                  }}
                                  className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  এডিট
                                </button>
                                <button
                                  onClick={() => handleDeleteVocabStory(sId)}
                                  className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg cursor-pointer"
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

                {/* ADMIN SECTION 3: CHAPTER TEST 1 & TEST 2 BUILDER */}
                {adminSection === "exam_builder" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
                    <h3 className="text-xl font-extrabold">
                      🎯 অধ্যায়ভিত্তিক MCQ পরীক্ষা সেট করুন (Test 1 ও Test 2 —{" "}
                      {getCourseTitleLabel(adminCourseTrack)})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">
                      <div>
                        <label className="font-extrabold block mb-1">
                          ১. Subject *
                        </label>
                        <select
                          value={examBuilderMeta.subjectId}
                          onChange={(e) =>
                            setExamBuilderMeta({
                              ...examBuilderMeta,
                              subjectId: e.target.value,
                            })
                          }
                          className="w-full p-3 border rounded-xl bg-white font-extrabold"
                        >
                          {getSubjectsForCourse(adminCourseTrack).map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">
                          ২. লেকচার নম্বর *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={examBuilderMeta.lectureNo}
                          onChange={(e) =>
                            setExamBuilderMeta({
                              ...examBuilderMeta,
                              lectureNo: Number(e.target.value),
                            })
                          }
                          className="w-full p-3 border rounded-xl bg-white font-extrabold"
                        />
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">
                          ৩. Chapter / Lecture Name *
                        </label>
                        <input
                          type="text"
                          value={examBuilderMeta.chapterName}
                          onChange={(e) =>
                            setExamBuilderMeta({
                              ...examBuilderMeta,
                              chapterName: e.target.value,
                            })
                          }
                          className="w-full p-3 border rounded-xl bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-extrabold block mb-1">
                          ৪. টেস্ট নম্বর *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExamBuilderMeta({
                                ...examBuilderMeta,
                                testNumber: 1,
                              })
                            }
                            className={`py-3 rounded-xl font-black text-xs cursor-pointer ${
                              examBuilderMeta.testNumber === 1
                                ? "bg-slate-900 text-white"
                                : "bg-white border"
                            }`}
                          >
                            Test 1
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExamBuilderMeta({
                                ...examBuilderMeta,
                                testNumber: 2,
                              })
                            }
                            className={`py-3 rounded-xl font-black text-xs cursor-pointer ${
                              examBuilderMeta.testNumber === 2
                                ? "bg-slate-900 text-white"
                                : "bg-white border"
                            }`}
                          >
                            Test 2
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                          ⚡ ১-ক্লিকে বাল্ক ফাইল (.txt / .json) বা ডক টেক্সট
                          থেকে প্রশ্ন অটো-ফিলআপ করুন:
                        </span>
                        <label className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-4 h-4" /> প্রশ্ন ফাইল (.txt /
                          .json) আপলোড করুন
                          <input
                            type="file"
                            accept=".txt,.json"
                            onChange={(e) =>
                              handleBulkFileUploadForQuestions(e, "50_SET")
                            }
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
                          ✓ টেক্সট থেকে ১-৫০ স্লটে প্রশ্নগুলো বসিয়ে দিন
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 bg-slate-100 p-3 rounded-xl">
                      {["1-10", "11-20", "21-30", "31-40", "41-50", "ALL"].map(
                        (rng) => (
                          <button
                            key={rng}
                            type="button"
                            onClick={() => setActiveSlotRange(rng)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer ${
                              activeSlotRange === rng
                                ? "bg-slate-900 text-white"
                                : "bg-white border"
                            }`}
                          >
                            প্রশ্ন {rng}
                          </button>
                        )
                      )}
                    </div>

                    <form onSubmit={handlePublishExamSet} className="space-y-4">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {template50Questions
                          .filter((item) => {
                            if (activeSlotRange === "ALL") return true;
                            const [min, max] = activeSlotRange
                              .split("-")
                              .map(Number);
                            return item.qNo >= min && item.qNo <= max;
                          })
                          .map((slot) => (
                            <div
                              key={slot.qNo}
                              className="p-4 rounded-2xl border bg-slate-50 space-y-2.5"
                            >
                              <span className="px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-black">
                                প্রশ্ন #{slot.qNo}
                              </span>
                              <input
                                type="text"
                                placeholder={`প্রশ্ন #${slot.qNo} লিখুন...`}
                                value={slot.question}
                                onChange={(e) =>
                                  updateTemplateSlot(
                                    slot.qNo,
                                    "question",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2.5 border rounded-xl bg-white text-sm font-bold"
                              />
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {["ক", "খ", "গ", "ঘ"].map((lbl, idx) => (
                                  <input
                                    key={idx}
                                    type="text"
                                    placeholder={`অপশন ${lbl}`}
                                    value={slot.options[idx]}
                                    onChange={(e) =>
                                      updateTemplateSlot(
                                        slot.qNo,
                                        "options",
                                        e.target.value,
                                        idx
                                      )
                                    }
                                    className="p-2 border rounded-xl bg-white text-xs font-semibold"
                                  />
                                ))}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <select
                                  value={slot.correctAnswer}
                                  onChange={(e) =>
                                    updateTemplateSlot(
                                      slot.qNo,
                                      "correctAnswer",
                                      Number(e.target.value)
                                    )
                                  }
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
                                  onChange={(e) =>
                                    updateTemplateSlot(
                                      slot.qNo,
                                      "explanation",
                                      e.target.value
                                    )
                                  }
                                  className="sm:col-span-2 p-2 border rounded-xl bg-white text-xs"
                                />
                              </div>
                            </div>
                          ))}
                      </div>

                      {renderAdminOptionalNotificationBox()}

                      <button
                        type="submit"
                        className="premium-btn w-full py-4 bg-emerald-600 text-white rounded-2xl text-base font-black cursor-pointer"
                      >
                        🚀 Publish Test {examBuilderMeta.testNumber}
                      </button>
                    </form>
                  </div>
                )}

                {/* ADMIN SECTION 4: WEEKLY LIVE EXAM (200 MCQs) */}
                {adminCourseTrack === "bcs" &&
                  adminSection === "biweekly_200" && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 space-y-6">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black">
                          প্রতি শুক্রবার রাত ৮:০০টায় · নতুন পর্ব শুরু করলে আগের
                          পরীক্ষার ফলাফল স্বয়ংক্রিয়ভাবে ‘পূর্ববর্তী ফলাফল’
                          আর্কাইভে সংরক্ষিত হবে
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          🏆 Weekly Live Exam সেটআপ (১ - ২০০ নম্বর প্রশ্ন)
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm">
                        <div className="sm:col-span-2">
                          <label className="font-extrabold block mb-1">
                            পরীক্ষার শিরোনাম *
                          </label>
                          <input
                            type="text"
                            value={contestBuilderMeta.title}
                            onChange={(e) =>
                              setContestBuilderMeta({
                                ...contestBuilderMeta,
                                title: e.target.value,
                              })
                            }
                            className="w-full p-3 border rounded-xl bg-white font-bold"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 p-3 rounded-xl bg-white border w-full cursor-pointer font-extrabold text-xs text-rose-700">
                            <input
                              type="checkbox"
                              checked={contestBuilderMeta.resetSubmissions}
                              onChange={(e) =>
                                setContestBuilderMeta({
                                  ...contestBuilderMeta,
                                  resetSubmissions: e.target.checked,
                                })
                              }
                            />
                            <span>
                              নতুন সপ্তাহের পর্ব শুরু করুন (আগের ফলাফল আর্কাইভ
                              করে নতুন রেজিস্ট্রেশন চালু)
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h4 className="font-extrabold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5" />⚡ বাল্ক
                            প্রশ্ন আপলোডার (১–২০০টি প্রশ্ন অথবা বর্তমান ২৫টি
                            প্রশ্নের ব্লক এক ক্লিকে বসান)
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <label className="px-4 py-2.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5">
                              <Upload className="w-4 h-4" /> ২০০ প্রশ্নের ফাইল
                              আপলোড
                              <input
                                type="file"
                                accept=".txt,.json"
                                onChange={(e) =>
                                  handleBulkFileUploadForQuestions(e, "200_ALL")
                                }
                                className="hidden"
                              />
                            </label>
                            <label className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5">
                              <Upload className="w-4 h-4" /> শুধু "
                              {active200Range}" ব্লকে ফাইল আপলোড
                              <input
                                type="file"
                                accept=".txt,.json"
                                onChange={(e) =>
                                  handleBulkFileUploadForQuestions(
                                    e,
                                    "200_BLOCK"
                                  )
                                }
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <textarea
                          rows={4}
                          value={bulk200TextInput}
                          onChange={(e) => setBulk200TextInput(e.target.value)}
                          placeholder={`ডক ফাইল থেকে প্রশ্ন কপি করে এখানে পেস্ট করুন (প্রতিটি প্রশ্নের মাঝে ১ লাইন ফাঁকা রাখুন)...`}
                          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 text-xs font-mono outline-none"
                        />

                        {bulk200TextInput.trim() && (
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleBulkFill200Slots(
                                  bulk200TextInput,
                                  "CURRENT_25_BLOCK"
                                )
                              }
                              className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black cursor-pointer"
                            >
                              ✓ বর্তমান "{active200Range}" ব্লকের ২৫টি স্লটে
                              বসান
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleBulkFill200Slots(bulk200TextInput, "ALL")
                              }
                              className="px-4 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-black cursor-pointer"
                            >
                              ✓ ১ থেকে ২০০ নম্বর স্লটে ধারাবাহিকভাবে বসান
                            </button>
                          </div>
                        )}
                      </div>

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
                            পূরণকৃত প্রশ্ন:{" "}
                            {
                              template200Questions.filter(
                                (q) => q.question.trim() !== ""
                              ).length
                            }{" "}
                            / ২০০টি
                          </span>
                        </div>

                        {(() => {
                          const [minQ] = active200Range.split("-").map(Number);
                          const currentBlockSample = template200Questions.find(
                            (q) => q.qNo === minQ
                          );
                          return (
                            <div className="p-3.5 rounded-xl bg-white border-2 border-purple-300 flex flex-wrap items-center justify-between gap-3">
                              <span className="text-xs font-black text-[#2e1065] uppercase">
                                📌 প্রশ্ন {active200Range} (এই ২৫টি প্রশ্নের
                                সাবজেক্ট নির্ধারণ করুন):
                              </span>
                              <select
                                value={currentBlockSample?.subjectId || "bangla"}
                                onChange={(e) =>
                                  assignSubjectTo25Block(
                                    active200Range,
                                    e.target.value
                                  )
                                }
                                className="px-4 py-2.5 rounded-xl border-2 border-[#2e1065] bg-purple-50 text-[#2e1065] font-black text-xs sm:text-sm"
                              >
                                {FULL_BCS_SUBJECTS.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.title} (প্রশ্ন {active200Range})
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })()}
                      </div>

                      <form
                        onSubmit={handlePublish200Contest}
                        className="space-y-4"
                      >
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                          {template200Questions
                            .filter((item) => {
                              const [min, max] = active200Range
                                .split("-")
                                .map(Number);
                              return item.qNo >= min && item.qNo <= max;
                            })
                            .map((slot) => (
                              <div
                                key={slot.qNo}
                                className="p-4 rounded-2xl border bg-slate-50 space-y-2.5"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-amber-300 text-xs font-black">
                                    Weekly Exam · প্রশ্ন #{slot.qNo}
                                  </span>
                                  <span className="px-3 py-1 rounded-lg bg-purple-100 text-[#2e1065] text-xs font-extrabold">
                                    সাবজেক্ট: {slot.subjectTitle}
                                  </span>
                                </div>

                                <input
                                  type="text"
                                  placeholder={`প্রশ্ন #${slot.qNo} এখানে লিখুন...`}
                                  value={slot.question}
                                  onChange={(e) =>
                                    update200TemplateSlot(
                                      slot.qNo,
                                      "question",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2.5 border rounded-xl bg-white text-sm font-bold"
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {["ক", "খ", "গ", "ঘ"].map((lbl, idx) => (
                                    <input
                                      key={idx}
                                      type="text"
                                      placeholder={`অপশন ${lbl}`}
                                      value={slot.options[idx]}
                                      onChange={(e) =>
                                        update200TemplateSlot(
                                          slot.qNo,
                                          "options",
                                          e.target.value,
                                          idx
                                        )
                                      }
                                      className="p-2 border rounded-xl bg-white text-xs font-semibold"
                                    />
                                  ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <select
                                    value={slot.correctAnswer}
                                    onChange={(e) =>
                                      update200TemplateSlot(
                                        slot.qNo,
                                        "correctAnswer",
                                        Number(e.target.value)
                                      )
                                    }
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
                                    onChange={(e) =>
                                      update200TemplateSlot(
                                        slot.qNo,
                                        "explanation",
                                        e.target.value
                                      )
                                    }
                                    className="sm:col-span-2 p-2 border rounded-xl bg-white text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>

                        {renderAdminOptionalNotificationBox()}

                        <button
                          type="submit"
                          className="premium-btn w-full py-4 bg-amber-400 text-slate-950 rounded-2xl text-base font-black hover:bg-amber-300 cursor-pointer shadow-lg"
                        >
                          🚀 Weekly Live Exam (২০০ MCQ) Publish করুন
                        </button>
                      </form>
                    </div>
                  )}

                {/* ADMIN SECTION 5: QUESTION BANK */}
                {adminSection === "qbank" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
                    <h3 className="text-xl font-extrabold">
                      প্রশ্ন ব্যাংক আপলোড ({getCourseTitleLabel(adminCourseTrack)}
                      )
                    </h3>
                    <form
                      onSubmit={handleSaveQbankDoc}
                      className="space-y-4 text-sm"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select
                          value={qbFormData.subjectId}
                          onChange={(e) =>
                            setQbFormData({
                              ...qbFormData,
                              subjectId: e.target.value,
                            })
                          }
                          className="p-3 border rounded-xl bg-slate-50 font-bold"
                        >
                          {getSubjectsForCourse(adminCourseTrack).map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="ব্যাচ বা উপ-শিরোনাম (যেমন: প্রশ্ন ব্যাংক ও সমাধান)"
                          value={qbFormData.bcsBatch}
                          onChange={(e) =>
                            setQbFormData({
                              ...qbFormData,
                              bcsBatch: e.target.value,
                            })
                          }
                          className="p-3 border rounded-xl font-semibold"
                        />
                      </div>

                      <input
                        type="text"
                        placeholder="প্রশ্ন ব্যাংকের শিরোনাম *"
                        value={qbFormData.title}
                        onChange={(e) =>
                          setQbFormData({
                            ...qbFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-xl font-bold"
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="PDF লিংক..."
                          value={qbFormData.pdfUrl}
                          onChange={(e) =>
                            setQbFormData({
                              ...qbFormData,
                              pdfUrl: e.target.value,
                            })
                          }
                          className="flex-1 p-2.5 border rounded-xl"
                        />
                        <label className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-extrabold cursor-pointer flex items-center gap-1.5">
                          <Upload className="w-4 h-4" /> PDF ফাইল নিন
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                              handleAdminPdfFileSelect(e, "pdfUrl", "qbank")
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                      <RichTextColorEditor
                        label="📝 প্রশ্ন ব্যাংক — Text View"
                        value={qbFormData.textContent}
                        onChange={(val) =>
                          setQbFormData({ ...qbFormData, textContent: val })
                        }
                        embeddedImages={qbFormData.embeddedImages}
                        onUpdateImages={(imgs) =>
                          setQbFormData({ ...qbFormData, embeddedImages: imgs })
                        }
                        placeholder="প্রশ্ন ব্যাংকের টেক্সট এখানে লিখুন..."
                        rows={5}
                      />

                      {renderAdminOptionalNotificationBox()}

                      <button
                        type="submit"
                        className="premium-btn w-full py-3.5 bg-slate-900 text-white rounded-xl font-extrabold cursor-pointer"
                      >
                        🚀 প্রশ্ন ব্যাংক পাবলিশ করুন
                      </button>
                    </form>
                  </div>
                )}

                {/* ADMIN SECTION 6: JOB UPDATE NEWS */}
                {adminSection === "job_news" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-pink-200 space-y-5">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-black">
                          ফ্রন্ট পেজ এবং ড্যাশবোর্ডে সরাসরি দেখা যাবে
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          📰 চাকরির আপডেট খবর ও নিয়োগ বিজ্ঞপ্তি প্রকাশ করুন
                        </h3>
                      </div>

                      <form
                        onSubmit={handleSaveJobNews}
                        className="space-y-4 text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-extrabold block mb-1">
                              ক্যাটাগরি ব্যাজ
                            </label>
                            <input
                              type="text"
                              value={jobNewsForm.categoryBadge}
                              onChange={(e) =>
                                setJobNewsForm({
                                  ...jobNewsForm,
                                  categoryBadge: e.target.value,
                                })
                              }
                              placeholder="যেমন: ৪৭তম বিসিএস আপডেট / সার্কুলার"
                              className="w-full p-3 border rounded-xl font-bold"
                            />
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1">
                              প্রকাশের তারিখ
                            </label>
                            <input
                              type="text"
                              value={jobNewsForm.publishDateText}
                              onChange={(e) =>
                                setJobNewsForm({
                                  ...jobNewsForm,
                                  publishDateText: e.target.value,
                                })
                              }
                              placeholder="যেমন: ২৯ অক্টোবর ২০২৬"
                              className="w-full p-3 border rounded-xl font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">
                            খবরের শিরোনাম (Headline) *
                          </label>
                          <input
                            type="text"
                            value={jobNewsForm.title}
                            onChange={(e) =>
                              setJobNewsForm({
                                ...jobNewsForm,
                                title: e.target.value,
                              })
                            }
                            placeholder="যেমন: পুলিশ কনস্টেবল ও বিসিএস প্রিলিমিনারি পরীক্ষার সময়সূচি প্রকাশ"
                            className="w-full p-3 border rounded-xl font-bold"
                          />
                        </div>

                        <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <label className="px-4 py-2.5 bg-pink-700 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5">
                              <Upload className="w-4 h-4" /> কভার ছবি আপলোড করুন
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleVocabStoryImageUpload(
                                    e,
                                    "coverImageUrl",
                                    "job_news"
                                  )
                                }
                                className="hidden"
                              />
                            </label>
                            {jobNewsForm.coverImageUrl && (
                              <span className="text-xs font-extrabold text-emerald-700">
                                ✓ কভার ছবি যুক্ত হয়েছে
                              </span>
                            )}
                          </div>

                          <label className="inline-flex items-center gap-2 text-xs font-extrabold text-pink-950 bg-white px-3.5 py-2 rounded-xl border border-pink-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={jobNewsForm.twoColumnDesktop}
                              onChange={(e) =>
                                setJobNewsForm({
                                  ...jobNewsForm,
                                  twoColumnDesktop: e.target.checked,
                                })
                              }
                            />
                            <span>
                              ডেস্কটপ ভার্সনে ২-কলামে দেখান (মোবাইলে ১-কলাম)
                            </span>
                          </label>
                        </div>

                        <RichTextColorEditor
                          label="📰 বিস্তারিত খবর / আর্টিকেল"
                          value={jobNewsForm.articleContent}
                          onChange={(val) =>
                            setJobNewsForm({
                              ...jobNewsForm,
                              articleContent: val,
                            })
                          }
                          embeddedImages={jobNewsForm.embeddedImages}
                          onUpdateImages={(imgs) =>
                            setJobNewsForm({
                              ...jobNewsForm,
                              embeddedImages: imgs,
                            })
                          }
                          placeholder="এখানে প্রতিদিনের চাকরির আপডেট খবর বিস্তারিত লিখুন..."
                          rows={7}
                        />

                        {renderAdminOptionalNotificationBox()}

                        <button
                          type="submit"
                          className="premium-btn w-full py-4 bg-pink-700 text-white rounded-2xl text-base font-black cursor-pointer shadow-lg"
                        >
                          {editingJobNewsId
                            ? "✓ চাকরির খবর আপডেট করুন"
                            : "🚀 চাকরির খবর পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">
                        প্রকাশিত চাকরির খবর ({jobUpdates.length}টি)
                      </h4>
                      {jobUpdates.map((jn) => {
                        const jId = jn._id || jn.id;
                        return (
                          <div
                            key={jId}
                            className="p-3.5 rounded-xl border bg-slate-50 space-y-2"
                          >
                            <div className="text-[11px] font-extrabold text-pink-700">
                              {jn.categoryBadge} • {jn.publishDateText}
                            </div>
                            <div className="font-black text-sm">{jn.title}</div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingJobNewsId(jId);
                                  setJobNewsForm({
                                    title: jn.title,
                                    categoryBadge:
                                      jn.categoryBadge ||
                                      "নিয়োগ বিজ্ঞপ্তি ও আপডেট",
                                    publishDateText: jn.publishDateText || "",
                                    coverImageUrl: jn.coverImageUrl || "",
                                    articleContent: jn.articleContent || "",
                                    twoColumnDesktop: !!jn.twoColumnDesktop,
                                    embeddedImages: jn.embeddedImages || {},
                                  });
                                }}
                                className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                এডিট
                              </button>
                              <button
                                onClick={() => handleDeleteJobNews(jId)}
                                className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg cursor-pointer"
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

                {/* ADMIN SECTION 7: BONUS CONTENT CMS */}
                {adminSection === "bonus_cms" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-indigo-200 space-y-5">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black">
                          {getCourseTitleLabel(adminCourseTrack)} — নেভবারের
                          "Bonus" ট্যাবে যুক্ত হবে
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          🎁 Bonus — বিষয়ভিত্তিক টিপস, শর্টকাট কৌশল ও ভিডিও
                          আপলোড করুন
                        </h3>
                      </div>

                      <form
                        onSubmit={handleSaveBonusItem}
                        className="space-y-4 text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-extrabold block mb-1">
                              বিষয় নির্বাচন করুন
                            </label>
                            <select
                              value={bonusForm.subjectId}
                              onChange={(e) =>
                                setBonusForm({
                                  ...bonusForm,
                                  subjectId: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                            >
                              <option value="ALL">
                                সকল বিষয় (স্পেশাল গাইডলাইন)
                              </option>
                              {getSubjectsForCourse(adminCourseTrack).map(
                                (s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.title}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1">
                              বোনাস টপিকের শিরোনাম *
                            </label>
                            <input
                              type="text"
                              value={bonusForm.title}
                              onChange={(e) =>
                                setBonusForm({
                                  ...bonusForm,
                                  title: e.target.value,
                                })
                              }
                              placeholder="যেমন: শেষ ৩০ দিনে পাস করার গোল্ডেন স্ট্র্যাটেজি"
                              className="w-full p-3 border rounded-xl font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                          <div>
                            <label className="font-extrabold block mb-1 text-indigo-950">
                              🎬 বোনাস ভিডিও লিংক (YouTube)
                            </label>
                            <input
                              type="text"
                              value={bonusForm.videoUrl}
                              onChange={(e) =>
                                setBonusForm({
                                  ...bonusForm,
                                  videoUrl: e.target.value,
                                })
                              }
                              placeholder="https://youtu.be/xxxx"
                              className="w-full p-2.5 border rounded-xl bg-white"
                            />
                          </div>
                          <div>
                            <label className="font-extrabold block mb-1 text-indigo-950">
                              📄 বোনাস PDF ফাইল বা লিংক
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={bonusForm.pdfUrl}
                                onChange={(e) =>
                                  setBonusForm({
                                    ...bonusForm,
                                    pdfUrl: e.target.value,
                                  })
                                }
                                placeholder="PDF লিংক..."
                                className="flex-1 p-2.5 border rounded-xl bg-white"
                              />
                              <label className="px-3 py-2.5 bg-indigo-700 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1 shrink-0">
                                <Upload className="w-3.5 h-3.5" /> PDF
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) =>
                                    handleAdminPdfFileSelect(
                                      e,
                                      "pdfUrl",
                                      "bonus"
                                    )
                                  }
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <RichTextColorEditor
                          label="📝 বোনাস টিপস ও নোটস"
                          value={bonusForm.content}
                          onChange={(val) =>
                            setBonusForm({ ...bonusForm, content: val })
                          }
                          embeddedImages={bonusForm.embeddedImages}
                          onUpdateImages={(imgs) =>
                            setBonusForm({ ...bonusForm, embeddedImages: imgs })
                          }
                          placeholder="এখানে বোনাস টিপস, শর্টকাট সূত্র বা নির্দেশনা লিখুন..."
                          rows={6}
                        />

                        {renderAdminOptionalNotificationBox()}

                        <button
                          type="submit"
                          className="premium-btn w-full py-4 bg-indigo-700 text-white rounded-2xl text-base font-black cursor-pointer shadow-lg"
                        >
                          {editingBonusId
                            ? "✓ বোনাস কনটেন্ট আপডেট করুন"
                            : "🚀 বোনাস কনটেন্ট পাবলিশ করুন"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">
                        আপলোডকৃত Bonus আইটেম (
                        {
                          bonusItems.filter(
                            (b) => (b.courseType || "bcs") === adminCourseTrack
                          ).length
                        }
                        টি)
                      </h4>
                      {bonusItems
                        .filter(
                          (b) => (b.courseType || "bcs") === adminCourseTrack
                        )
                        .map((bi) => {
                          const bId = bi._id || bi.id;
                          return (
                            <div
                              key={bId}
                              className="p-3.5 rounded-xl border bg-slate-50 space-y-2"
                            >
                              <div className="text-[11px] font-extrabold text-indigo-700">
                                {bi.subjectTitle}
                              </div>
                              <div className="font-black text-sm">
                                {bi.title}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingBonusId(bId);
                                    setBonusForm({
                                      courseType: bi.courseType || "bcs",
                                      subjectId: bi.subjectId || "ALL",
                                      subjectTitle: bi.subjectTitle || "",
                                      title: bi.title,
                                      videoUrl: bi.videoUrl || "",
                                      pdfUrl: bi.pdfUrl || "",
                                      content: bi.content || "",
                                      twoColumnDesktop: !!bi.twoColumnDesktop,
                                      embeddedImages: bi.embeddedImages || {},
                                    });
                                  }}
                                  className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  এডিট
                                </button>
                                <button
                                  onClick={() => handleDeleteBonusItem(bId)}
                                  className="p-1.5 bg-rose-50 text-rose-600 border rounded-lg cursor-pointer"
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

                {/* ADMIN SECTION 8: DIRECT CUSTOM ANNOUNCEMENT NOTIFICATION SENDER (Requirement 2) */}
                {adminSection === "notifications_cms" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border-2 border-rose-200 space-y-5">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-black">
                          ডাইনামিক নোটিফিকেশন ব্রডকাস্ট
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          🔔 শিক্ষার্থীদের কাছে গুরুত্বপূর্ণ ঘোষণা বা নোটিফিকেশন
                          পাঠান
                        </h3>
                      </div>

                      <form
                        onSubmit={handleSendDirectNotification}
                        className="space-y-4 text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="font-extrabold block mb-1">
                              কোন কোর্সের শিক্ষার্থীদের জন্য?
                            </label>
                            <select
                              value={customNoticeForm.courseType}
                              onChange={(e) =>
                                setCustomNoticeForm({
                                  ...customNoticeForm,
                                  courseType: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                            >
                              <option value="ALL">
                                সকল কোর্সের শিক্ষার্থী (All Courses)
                              </option>
                              <option value="bcs">BCS Course</option>
                              {Object.values(DEFENSE_COURSES_CATALOG).map(
                                (c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.title}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="font-extrabold block mb-1">
                              নোটিফিকেশনে ক্লিক করলে কোন পেজে যাবে?
                            </label>
                            <select
                              value={customNoticeForm.targetTab}
                              onChange={(e) =>
                                setCustomNoticeForm({
                                  ...customNoticeForm,
                                  targetTab: e.target.value,
                                })
                              }
                              className="w-full p-3 border rounded-xl bg-slate-50 font-bold"
                            >
                              <option value="dashboard">কোর্স ড্যাশবোর্ড</option>
                              <option value="subject_lectures">
                                লেকচার ও ভিডিও হাব
                              </option>
                              <option value="syllabus">সিলেবাস পেজ</option>
                              <option value="mock_test_hub">
                                অধ্যায়ভিত্তিক মক টেস্ট
                              </option>
                              <option value="bonus_hub">Bonus ট্যাব</option>
                              <option value="biweekly_contest">
                                Weekly Live Exam
                              </option>
                              <option value="job_news_modal">
                                চাকরির আপডেট খবর
                              </option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">
                            নোটিফিকেশনের শিরোনাম *
                          </label>
                          <input
                            type="text"
                            required
                            value={customNoticeForm.title}
                            onChange={(e) =>
                              setCustomNoticeForm({
                                ...customNoticeForm,
                                title: e.target.value,
                              })
                            }
                            placeholder="যেমন: আগামীকাল রাত ৮:০০টায় বিশেষ মক টেস্ট অনুষ্ঠিত হবে!"
                            className="w-full p-3 border rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-extrabold block mb-1">
                            বিস্তারিত বার্তা
                          </label>
                          <textarea
                            rows={3}
                            value={customNoticeForm.message}
                            onChange={(e) =>
                              setCustomNoticeForm({
                                ...customNoticeForm,
                                message: e.target.value,
                              })
                            }
                            placeholder="সংক্ষিপ্ত নির্দেশনা বা বার্তা লিখুন..."
                            className="w-full p-3 border rounded-xl"
                          />
                        </div>

                        <button
                          type="submit"
                          className="premium-btn w-full py-4 bg-rose-600 text-white rounded-2xl text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                        >
                          <Send className="w-4 h-4" /> নোটিফিকেশন পাঠান
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                      <h4 className="font-extrabold text-base">
                        প্রেরিত নোটিফিকেশন তালিকা ({notifications.length}টি)
                      </h4>
                      <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
                        {notifications.map((n) => {
                          const nId = n._id || n.id;
                          return (
                            <div
                              key={nId}
                              className="p-3 rounded-xl border bg-slate-50 flex items-start justify-between gap-2"
                            >
                              <div>
                                <div className="font-black text-xs text-slate-900">
                                  {n.title}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {n.message}
                                </div>
                              </div>
                              <button
                                onClick={async () => {
                                  await fetch("/api/platform", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      action: "DELETE_NOTIFICATION",
                                      adminPin: adminPinInput,
                                      payload: { id: nId },
                                    }),
                                  });
                                  fetchCloudData();
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= MOBILE STICKY BOTTOM NAVIGATION BAR ================= */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 h-16 px-4 flex md:hidden items-center justify-around z-40 shadow-lg">
        <button
          onClick={() => navigateTo("dashboard")}
          className={`flex flex-col items-center gap-1 text-xs font-extrabold cursor-pointer ${
            activeTab === "dashboard" ? "text-[#4c1d95]" : "text-slate-500"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>হোম</span>
        </button>

        <button
          onClick={() => navigateTo("syllabus")}
          className={`flex flex-col items-center gap-1 text-xs font-extrabold cursor-pointer ${
            activeTab === "syllabus" ? "text-[#4c1d95]" : "text-slate-500"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>সিলেবাস</span>
        </button>

        <button
          onClick={() => navigateTo("subject_lectures")}
          className={`flex flex-col items-center gap-1 text-xs font-extrabold cursor-pointer ${
            activeTab === "subject_lectures"
              ? "text-[#4c1d95]"
              : "text-slate-500"
          }`}
        >
          <PlayCircle className="w-5 h-5" />
          <span>লেকচার</span>
        </button>

        <button
          onClick={() => navigateTo("mock_test_hub")}
          className={`flex flex-col items-center gap-1 text-xs font-extrabold cursor-pointer ${
            activeTab === "mock_test_hub" || activeTab === "active_exam_room"
              ? "text-[#4c1d95]"
              : "text-slate-500"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>পরীক্ষা</span>
        </button>

        <button
          onClick={() => setShowProfileEditModal(true)}
          className="flex flex-col items-center gap-1 text-xs font-extrabold text-slate-500 cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span>প্রোফাইল</span>
        </button>
      </nav>

      {/* FULLSCREEN PDF VIEWER MODAL */}
      {isPdfFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="h-14 px-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="font-extrabold text-sm truncate">
              📄{" "}
              {activeTab === "qbank"
                ? activeQbankDoc?.title
                : activeLecture?.title}{" "}
              — ফুলস্ক্রিন ভিউ
            </div>
            <button
              onClick={() => setIsPdfFullscreen(false)}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-extrabold cursor-pointer"
            >
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

      {/* STUDENT PROFILE & COURSE ENROLLMENT MANAGER MODAL */}
      {showProfileEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold">
                শিক্ষার্থী প্রোফাইল ও কোর্স অ্যাক্সেস
              </h3>
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                />
              ) : (
                <MiniExecutive2DAvatar size="w-14 h-14" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-[#2e1065] text-white text-xs font-extrabold cursor-pointer"
              >
                📷 প্রোফাইল ছবি পরিবর্তন করুন
              </button>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-extrabold text-[#2e1065]">
              বর্তমান সক্রিয় কোর্সের লক্ষ্য: {dynamicTargetGoalLabel}
            </div>

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
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="মোবাইল নম্বর"
              className="w-full p-3 border rounded-xl font-bold"
            />
            <input
              type="text"
              value={profile.institution}
              onChange={(e) =>
                setProfile({ ...profile, institution: e.target.value })
              }
              placeholder="শিক্ষাপ্রতিষ্ঠানের নাম"
              className="w-full p-3 border rounded-xl"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="flex-1 py-3 border rounded-xl font-bold cursor-pointer"
              >
                বাতিল
              </button>
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

      {renderSharedPlatformModals()}
    </div>
  );
}