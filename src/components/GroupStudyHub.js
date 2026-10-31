"use client";

/**
 * ============================================================================
 * FILE: src/components/GroupStudyHub.js
 * PURPOSE: All-in-One Independent Group Study & Solo Study Hub
 *          (Dashboard Entry Card + Modal Overlay + Live Sync Room + Solo Timer
 *          + Cascading Topic Selector + Post-Study MCQ Exam + Progress Tracker)
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Plus,
  Lock,
  Unlock,
  Sparkles,
  BarChart3,
  User,
  BookOpen,
  FileText,
  Tag,
  Play,
  Pause,
  Square,
  LogOut,
  Copy,
  Check,
  RotateCcw,
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
  X,
  RefreshCw,
} from "lucide-react";

const STORAGE_KEYS = {
  UI_STATE: "bcs_gs_modal_ui_state_v1",
  SOLO_TIMER: "bcs_gs_solo_active_timer_v1",
  RECORDS_CACHE: "bcs_gs_activity_records_v1",
  DAILY_RESET_STAMP: "bcs_gs_today_reset_offset_v1",
};

let serverClockOffsetMs = 0;

function getSynchronizedServerNowMs() {
  return Date.now() + serverClockOffsetMs;
}

function updateClockOffset(serverNowMs) {
  if (serverNowMs && typeof serverNowMs === "number") {
    serverClockOffsetMs = serverNowMs - Date.now();
  }
}

function getTodayDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatDurationBangla(totalSeconds = 0) {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} ঘণ্টা ${m} মিনিট`;
  if (m > 0) return `${m} মিনিট ${s > 0 ? `${s} সে.` : ""}`.trim();
  return `${s} সেকেন্ড`;
}

function formatDigitalClock(totalSeconds = 0) {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function deriveTopicsForSubjectAndLecture({
  subjectObj,
  lectureObj,
  syllabusItems = [],
  selectedCourse = "bcs",
}) {
  const topics = [];

  if (lectureObj) {
    const rawTitle = lectureObj.title || lectureObj.chapterName || "";
    const parts = rawTitle
      .split(/[,،•|—\-:]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && !/^লেকচার|^Lecture/i.test(s));

    if (parts.length > 1) {
      parts.forEach((p, idx) => {
        topics.push({
          id: `lec_${lectureObj.lectureNo}_top_${idx + 1}`,
          title: p,
          lectureNo: lectureObj.lectureNo,
        });
      });
    } else {
      topics.push({
        id: `lec_${lectureObj.lectureNo}_main`,
        title: rawTitle || `লেকচার ${lectureObj.lectureNo} মূল টপিক`,
        lectureNo: lectureObj.lectureNo,
      });
    }
  }

  const customSyllabus = syllabusItems.filter(
    (s) => s.courseType === selectedCourse && s.subjectId === subjectObj?.id
  );
  customSyllabus.forEach((cs, idx) => {
    if (cs.topicTitle && !topics.some((t) => t.title === cs.topicTitle)) {
      topics.push({
        id: `syl_custom_${cs._id || idx}`,
        title: cs.topicTitle,
        lectureNo: lectureObj?.lectureNo || idx + 1,
      });
    }
  });

  (subjectObj?.syllabusBreakdown || []).forEach((sb, idx) => {
    const subParts = (sb.topic || "")
      .split(/[,ও•]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 2);

    if (subParts.length > 1) {
      subParts.forEach((sp, sIdx) => {
        if (!topics.some((t) => t.title === sp)) {
          topics.push({
            id: `syl_${subjectObj.id}_${idx}_${sIdx}`,
            title: sp,
            lectureNo: lectureObj?.lectureNo || 1,
          });
        }
      });
    } else if (sb.topic && !topics.some((t) => t.title === sb.topic)) {
      topics.push({
        id: `syl_${subjectObj.id}_${idx}`,
        title: sb.topic,
        lectureNo: lectureObj?.lectureNo || 1,
      });
    }
  });

  if (topics.length === 0) {
    topics.push({
      id: `default_${subjectObj?.id || "gen"}_1`,
      title: subjectObj?.title || "মূল অধ্যায় ও অনুশীলন",
      lectureNo: lectureObj?.lectureNo || 1,
    });
  }

  return topics;
}

function computeStudyStatistics(records = []) {
  const todayKey = getTodayDateKey();
  let resetAfterMs = 0;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DAILY_RESET_STAMP);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.dateKey === todayKey) {
          resetAfterMs = Number(parsed.resetAtMs || 0);
        }
      }
    } catch (e) {}
  }

  const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessions = records.filter((r) => r.recordType === "session");
  const completions = records.filter(
    (r) => r.recordType === "topic_completion"
  );
  const mcqResults = records.filter((r) => r.recordType === "mcq_result");

  let totalStudySec = 0;
  let todayStudySec = 0;
  let todaySessionsCount = 0;
  let weeklyStudySec = 0;
  const subjectSecondsMap = {};

  sessions.forEach((s) => {
    const dur = Math.max(0, Number(s.durationSec || 0));
    const createdMs = s.createdAt
      ? new Date(s.createdAt).getTime()
      : Date.now();
    const sDateKey = s.dateKey || todayKey;

    totalStudySec += dur;
    if (sDateKey === todayKey && createdMs >= resetAfterMs) {
      todayStudySec += dur;
      todaySessionsCount += 1;
    }
    if (createdMs >= sevenDaysAgoMs) {
      weeklyStudySec += dur;
    }
    const subKey = s.subjectTitle || s.subjectId || "অন্যান্য";
    subjectSecondsMap[subKey] = (subjectSecondsMap[subKey] || 0) + dur;
  });

  const todaySessionsList = sessions.filter((s) => {
    const createdMs = s.createdAt
      ? new Date(s.createdAt).getTime()
      : Date.now();
    return (s.dateKey || todayKey) === todayKey && createdMs >= resetAfterMs;
  });

  let totalMcqAttempted = 0;
  let totalMcqCorrect = 0;
  mcqResults.forEach((m) => {
    totalMcqAttempted += Number(m.mcqTotal || 0);
    totalMcqCorrect += Number(m.mcqCorrect || 0);
  });

  const mcqAccuracyPercent =
    totalMcqAttempted > 0
      ? Math.round((totalMcqCorrect / totalMcqAttempted) * 100)
      : 0;

  return {
    totalStudySec,
    todayStudySec,
    todaySessionsCount,
    weeklyStudySec,
    totalSessionsCount: sessions.length,
    todaySessionsList,
    completions,
    mcqResults,
    mcqAccuracyPercent,
    subjectBreakdown: Object.entries(subjectSecondsMap).map(([title, sec]) => ({
      title,
      seconds: sec,
    })),
  };
}

/**
 * Cascading Subject → Lecture → Topic Selector Sub-Component
 */
function CascadingTopicSelector({
  subjects = [],
  lectures = [],
  syllabusItems = [],
  selectedCourse = "bcs",
  selection,
  onChangeSelection,
}) {
  const currentSubject =
    subjects.find((s) => s.id === selection.subjectId) || subjects[0];

  const subjectLectures = useMemo(() => {
    const filtered = lectures
      .filter((l) => l.subjectId === currentSubject?.id)
      .sort((a, b) => Number(a.lectureNo) - Number(b.lectureNo));

    if (filtered.length > 0) return filtered;
    return (currentSubject?.syllabusBreakdown || []).map((sb, idx) => ({
      _id: `virtual_lec_${currentSubject?.id}_${idx + 1}`,
      subjectId: currentSubject?.id,
      lectureNo: idx + 1,
      title: sb.topic || `লেকচার ${idx + 1}`,
    }));
  }, [lectures, currentSubject]);

  const currentLecture =
    subjectLectures.find(
      (l) => Number(l.lectureNo) === Number(selection.lectureNo)
    ) || subjectLectures[0];

  const availableTopics = useMemo(
    () =>
      deriveTopicsForSubjectAndLecture({
        subjectObj: currentSubject,
        lectureObj: currentLecture,
        syllabusItems,
        selectedCourse,
      }),
    [currentSubject, currentLecture, syllabusItems, selectedCourse]
  );

  const currentTopic =
    availableTopics.find((t) => t.id === selection.topicId) ||
    availableTopics[0];

  const handleSubjectChange = (newSubId) => {
    const nextSub = subjects.find((s) => s.id === newSubId) || subjects[0];
    const nextSubLecs = lectures
      .filter((l) => l.subjectId === newSubId)
      .sort((a, b) => Number(a.lectureNo) - Number(b.lectureNo));

    const firstLec = nextSubLecs[0] || {
      _id: `virtual_lec_${newSubId}_1`,
      lectureNo: 1,
      title:
        nextSub?.syllabusBreakdown?.[0]?.topic || nextSub?.title || "লেকচার ১",
    };

    const nextTopics = deriveTopicsForSubjectAndLecture({
      subjectObj: nextSub,
      lectureObj: firstLec,
      syllabusItems,
      selectedCourse,
    });

    onChangeSelection({
      subjectId: nextSub.id,
      subjectTitle: nextSub.title,
      lectureId: String(firstLec._id || firstLec.id || ""),
      lectureNo: Number(firstLec.lectureNo || 1),
      lectureTitle: firstLec.title,
      topicId: nextTopics[0]?.id || "top_1",
      topicTitle: nextTopics[0]?.title || nextSub.title,
    });
  };

  const handleLectureChange = (newLecNo) => {
    const foundLec =
      subjectLectures.find((l) => Number(l.lectureNo) === Number(newLecNo)) ||
      subjectLectures[0];

    const nextTopics = deriveTopicsForSubjectAndLecture({
      subjectObj: currentSubject,
      lectureObj: foundLec,
      syllabusItems,
      selectedCourse,
    });

    onChangeSelection({
      subjectId: currentSubject.id,
      subjectTitle: currentSubject.title,
      lectureId: String(foundLec?._id || foundLec?.id || ""),
      lectureNo: Number(foundLec?.lectureNo || 1),
      lectureTitle: foundLec?.title || `লেকচার ${newLecNo}`,
      topicId: nextTopics[0]?.id || "top_1",
      topicTitle: nextTopics[0]?.title || currentSubject.title,
    });
  };

  const handleTopicChange = (newTopicId) => {
    const foundTop =
      availableTopics.find((t) => t.id === newTopicId) || availableTopics[0];
    onChangeSelection({
      subjectId: currentSubject.id,
      subjectTitle: currentSubject.title,
      lectureId: String(currentLecture?._id || currentLecture?.id || ""),
      lectureNo: Number(currentLecture?.lectureNo || 1),
      lectureTitle: currentLecture?.title || "লেকচার ১",
      topicId: foundTop.id,
      topicTitle: foundTop.title,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div>
        <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#4c1d95]" />
          <span>বিষয় নির্বাচন করুন</span>
        </label>
        <select
          value={currentSubject?.id || ""}
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50/80 text-xs sm:text-sm font-extrabold text-slate-900 outline-none focus:border-[#4c1d95]"
        >
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-[#4c1d95]" />
          <span>লেকচার নির্বাচন করুন</span>
        </label>
        <select
          value={currentLecture?.lectureNo || 1}
          onChange={(e) => handleLectureChange(Number(e.target.value))}
          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50/80 text-xs sm:text-sm font-extrabold text-slate-900 outline-none focus:border-[#4c1d95]"
        >
          {subjectLectures.map((lec) => (
            <option key={lec.lectureNo} value={lec.lectureNo}>
              লেকচার {lec.lectureNo}: {lec.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 mb-1.5">
          <Tag className="w-3.5 h-3.5 text-[#4c1d95]" />
          <span>টপিক নির্বাচন করুন</span>
        </label>
        <select
          value={currentTopic?.id || ""}
          onChange={(e) => handleTopicChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50/80 text-xs sm:text-sm font-extrabold text-slate-900 outline-none focus:border-[#4c1d95]"
        >
          {availableTopics.map((top) => (
            <option key={top.id} value={top.id}>
              {top.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Main Exported Component: GroupStudyEntryCard
 */
export function GroupStudyEntryCard({
  selectedCourse = "bcs",
  subjects = [],
  lectures = [],
  syllabusItems = [],
  examSets = [],
  studentKey = "student_default",
  profile = {},
  progressMap = {},
  onUpdateLectureProgress,
  onIncrementQuizCount,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("group_lobby"); // "group_lobby" | "active_room" | "solo_study" | "mcq_exam" | "progress"
  const [roomSubTab, setRoomSubTab] = useState("create");

  const defaultSelection = useMemo(() => {
    const firstSub = subjects[0] || { id: "bangla", title: "বাংলা" };
    const firstLec = lectures
      .filter((l) => l.subjectId === firstSub.id)
      .sort((a, b) => Number(a.lectureNo) - Number(b.lectureNo))[0] || {
      _id: `virtual_${firstSub.id}_1`,
      lectureNo: 1,
      title: firstSub.syllabusBreakdown?.[0]?.topic || firstSub.title,
    };
    const derivedTopics = deriveTopicsForSubjectAndLecture({
      subjectObj: firstSub,
      lectureObj: firstLec,
      syllabusItems,
      selectedCourse,
    });
    return {
      subjectId: firstSub.id,
      subjectTitle: firstSub.title,
      lectureId: String(firstLec._id || firstLec.id || ""),
      lectureNo: Number(firstLec.lectureNo || 1),
      lectureTitle: firstLec.title,
      topicId: derivedTopics[0]?.id || "top_1",
      topicTitle: derivedTopics[0]?.title || firstSub.title,
    };
  }, [subjects, lectures, syllabusItems, selectedCourse]);

  const [selection, setSelection] = useState(defaultSelection);

  // Room Form State
  const [customRoomName, setCustomRoomName] = useState("");
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [scheduledMinutes, setScheduledMinutes] = useState(45);
  const [maxMembers, setMaxMembers] = useState(10);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  // Cloud State
  const [publicRooms, setPublicRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [liveRoomRemainingSec, setLiveRoomRemainingSec] = useState(2700);
  const [activityRecords, setActivityRecords] = useState([]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [statusBanner, setStatusBanner] = useState("");

  // Solo Study Timer State
  const [soloTimer, setSoloTimer] = useState({
    isRunning: false,
    startedAtMs: 0,
    accumulatedSec: 0,
    dailyGoalHours: 4,
  });
  const [soloDisplaySec, setSoloDisplaySec] = useState(0);

  // Topic MCQ Exam State
  const [questionCountLimit, setQuestionCountLimit] = useState(10);
  const [examCurrentIdx, setExamCurrentIdx] = useState(0);
  const [examAnswersMap, setExamAnswersMap] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examTimeLeftSec, setExamTimeLeftSec] = useState(360);

  // Load saved local state on mount / course switch
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedUiRaw = localStorage.getItem(
        `${STORAGE_KEYS.UI_STATE}_${selectedCourse}`
      );
      if (savedUiRaw) {
        const parsed = JSON.parse(savedUiRaw);
        if (parsed.selection) setSelection(parsed.selection);
        if (parsed.modalTab && parsed.modalTab !== "mcq_exam") {
          setModalTab(parsed.modalTab);
        }
      } else {
        setSelection(defaultSelection);
      }

      const cachedRecs = localStorage.getItem(
        `${STORAGE_KEYS.RECORDS_CACHE}_${selectedCourse}`
      );
      if (cachedRecs) setActivityRecords(JSON.parse(cachedRecs));

      const savedSolo = localStorage.getItem(STORAGE_KEYS.SOLO_TIMER);
      if (savedSolo) setSoloTimer(JSON.parse(savedSolo));
    } catch (e) {}
  }, [selectedCourse, defaultSelection]);

  // Save UI state when changed
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.UI_STATE}_${selectedCourse}`,
        JSON.stringify({
          modalTab,
          selection,
          activeRoomCode: activeRoom?.roomCode || "",
        })
      );
    } catch (e) {}
  }, [selectedCourse, modalTab, selection, activeRoom?.roomCode]);

  // Sync with Backend API
  const syncWithBackend = async (overrideRoomCode = "") => {
    setLoadingSync(true);
    try {
      let savedCode = "";
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(
          `${STORAGE_KEYS.UI_STATE}_${selectedCourse}`
        );
        if (raw) savedCode = JSON.parse(raw)?.activeRoomCode || "";
      }
      const codeToCheck =
        overrideRoomCode || activeRoom?.roomCode || savedCode || "";

      const params = new URLSearchParams({
        courseType: selectedCourse,
        studentKey,
        ...(codeToCheck ? { roomCode: codeToCheck } : {}),
      });

      const res = await fetch(`/api/group-study?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        if (data.serverNowMs) updateClockOffset(data.serverNowMs);
        setPublicRooms(data.publicRooms || []);
        if (data.activeRoom && data.activeRoom.status !== "ended") {
          setActiveRoom(data.activeRoom);
        } else if (activeRoom && data.activeRoom?.status === "ended") {
          setActiveRoom(data.activeRoom);
        }
        if (Array.isArray(data.records)) {
          setActivityRecords(data.records);
          localStorage.setItem(
            `${STORAGE_KEYS.RECORDS_CACHE}_${selectedCourse}`,
            JSON.stringify(data.records)
          );
        }
      }
    } catch (e) {}
    setLoadingSync(false);
  };

  useEffect(() => {
    syncWithBackend();
  }, [selectedCourse, studentKey]);

  useEffect(() => {
    if (!isModalOpen && !activeRoom) return;
    const poll = setInterval(() => syncWithBackend(), 4000);
    return () => clearInterval(poll);
  }, [isModalOpen, activeRoom?.roomCode, selectedCourse, studentKey]);

  // Live Synchronized Group Room Timer Effect
  useEffect(() => {
    if (!activeRoom) return;
    const tick = () => {
      const ts = activeRoom.timerState;
      if (!ts) {
        setLiveRoomRemainingSec(activeRoom.scheduledDurationSec || 2700);
        return;
      }
      if (!ts.isRunning || !ts.startedAtServerMs) {
        setLiveRoomRemainingSec(
          Math.max(0, Number(ts.remainingSecAtPause ?? ts.durationSec ?? 0))
        );
        return;
      }
      const elapsed = Math.floor(
        (getSynchronizedServerNowMs() - ts.startedAtServerMs) / 1000
      );
      setLiveRoomRemainingSec(
        Math.max(0, Number(ts.remainingSecAtPause || ts.durationSec) - elapsed)
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeRoom]);

  // Solo Study Timer Tick Effect
  useEffect(() => {
    const tick = () => {
      if (!soloTimer.isRunning || !soloTimer.startedAtMs) {
        setSoloDisplaySec(soloTimer.accumulatedSec || 0);
        return;
      }
      const delta = Math.floor((Date.now() - soloTimer.startedAtMs) / 1000);
      setSoloDisplaySec((soloTimer.accumulatedSec || 0) + Math.max(0, delta));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [soloTimer]);

  const updateSoloTimerState = (nextObj) => {
    setSoloTimer(nextObj);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SOLO_TIMER, JSON.stringify(nextObj));
    }
  };

  const stats = useMemo(
    () => computeStudyStatistics(activityRecords),
    [activityRecords]
  );

  const isTopicCompletedFn = (subId, lecNo, topId) =>
    activityRecords.some(
      (r) =>
        r.recordType === "topic_completion" &&
        r.subjectId === subId &&
        Number(r.lectureNo) === Number(lecNo) &&
        r.topicId === topId
    );

  // API Helper
  const postAction = async (action, payload) => {
    try {
      const res = await fetch("/api/group-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (data.serverNowMs) updateClockOffset(data.serverNowMs);
      return data;
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Room Handlers
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const res = await postAction("CREATE_ROOM", {
      roomName:
        customRoomName.trim() ||
        `${selection.subjectTitle} - ${selection.topicTitle}`,
      courseType: selectedCourse,
      ...selection,
      hostKey: studentKey,
      hostName: profile.name || "শিক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      institution: profile.institution || "",
      isPrivate: isPrivateRoom,
      maxParticipants: Number(maxMembers || 10),
      scheduledDurationSec: Number(scheduledMinutes || 45) * 60,
    });
    if (res.success && res.room) {
      setActiveRoom(res.room);
      setCustomRoomName("");
      setModalTab("active_room");
      syncWithBackend(res.room.roomCode);
    } else {
      alert(res.error || "রুম তৈরি করতে সমস্যা হয়েছে!");
    }
  };

  const handleJoinRoom = async (codeToJoin) => {
    if (!codeToJoin || !codeToJoin.trim()) {
      alert("অনুগ্রহ করে রুমের কোড লিখুন!");
      return;
    }
    const res = await postAction("JOIN_ROOM", {
      roomCode: codeToJoin.trim().toUpperCase(),
      studentKey,
      name: profile.name || "শিক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      institution: profile.institution || "",
    });
    if (res.success && res.room) {
      setActiveRoom(res.room);
      setInviteCodeInput("");
      setModalTab("active_room");
      syncWithBackend(res.room.roomCode);
    } else {
      alert(res.error || "রুমে যোগ দেওয়া যায়নি!");
    }
  };

  const handleControlRoomTimer = async (command) => {
    if (!activeRoom) return;
    const res = await postAction("CONTROL_ROOM_TIMER", {
      roomCode: activeRoom.roomCode,
      command,
    });
    if (res.success && res.room) setActiveRoom(res.room);
  };

  const handleLeaveRoom = async () => {
    if (!activeRoom) return;
    await postAction("LEAVE_ROOM", {
      roomCode: activeRoom.roomCode,
      studentKey,
    });
    setActiveRoom(null);
    setModalTab("group_lobby");
    syncWithBackend("");
  };

  const handleCompleteRoomSession = async (studiedSeconds) => {
    if (!activeRoom) return;
    await handleControlRoomTimer("END");
    const res = await postAction("SAVE_ACTIVITY_RECORD", {
      studentKey,
      courseType: selectedCourse,
      recordType: "session",
      mode: "group",
      roomCode: activeRoom.roomCode,
      subjectId: activeRoom.subjectId,
      subjectTitle: activeRoom.subjectTitle,
      lectureId: activeRoom.lectureId,
      lectureNo: activeRoom.lectureNo,
      lectureTitle: activeRoom.lectureTitle,
      topicId: activeRoom.topicId,
      topicTitle: activeRoom.topicTitle,
      durationSec: studiedSeconds,
      dateKey: getTodayDateKey(),
    });
    if (res.success && res.record) {
      const next = [res.record, ...activityRecords];
      setActivityRecords(next);
      setStatusBanner("🎉 গ্রুপ স্টাডি সেশন সংরক্ষিত হয়েছে!");
      setTimeout(() => setStatusBanner(""), 3500);
    }
  };

  const handleSaveSoloSession = async (durationSec) => {
    const res = await postAction("SAVE_ACTIVITY_RECORD", {
      studentKey,
      courseType: selectedCourse,
      recordType: "session",
      mode: "solo",
      ...selection,
      durationSec,
      dateKey: getTodayDateKey(),
    });
    if (res.success && res.record) {
      const next = [res.record, ...activityRecords];
      setActivityRecords(next);
      setStatusBanner("✅ আপনার আজকের স্টাডি সেশন সংরক্ষিত হয়েছে!");
      setTimeout(() => setStatusBanner(""), 3500);
    }
  };

  const handleMarkTopicCompleted = async (topicMeta) => {
    const payload = {
      studentKey,
      courseType: selectedCourse,
      recordType: "topic_completion",
      mode: activeRoom ? "group" : "solo",
      subjectId: topicMeta.subjectId,
      subjectTitle: topicMeta.subjectTitle,
      lectureId: topicMeta.lectureId || "",
      lectureNo: Number(topicMeta.lectureNo || 1),
      lectureTitle: topicMeta.lectureTitle || "",
      topicId: topicMeta.topicId,
      topicTitle: topicMeta.topicTitle,
      durationSec: Number(topicMeta.durationSec || 60),
      dateKey: getTodayDateKey(),
    };

    const res = await postAction("SAVE_ACTIVITY_RECORD", payload);
    const updatedRecords = res.record
      ? [
          res.record,
          ...activityRecords.filter(
            (r) =>
              !(
                r.recordType === "topic_completion" &&
                r.subjectId === payload.subjectId &&
                Number(r.lectureNo) === payload.lectureNo &&
                r.topicId === payload.topicId
              )
          ),
        ]
      : activityRecords;

    setActivityRecords(updatedRecords);

    // Sync with existing platform lecture progress rules
    const targetSubObj = subjects.find((s) => s.id === payload.subjectId);
    const targetLecObj = lectures.find(
      (l) =>
        l.subjectId === payload.subjectId &&
        Number(l.lectureNo) === payload.lectureNo
    );

    if (targetLecObj && onUpdateLectureProgress) {
      const allTopicsForLec = deriveTopicsForSubjectAndLecture({
        subjectObj: targetSubObj,
        lectureObj: targetLecObj,
        syllabusItems,
        selectedCourse,
      });
      const completedInLec = allTopicsForLec.filter((t) =>
        updatedRecords.some(
          (r) =>
            r.recordType === "topic_completion" &&
            r.subjectId === payload.subjectId &&
            Number(r.lectureNo) === payload.lectureNo &&
            r.topicId === t.id
        )
      );
      const lecKey = targetLecObj._id || targetLecObj.id;
      const allDone =
        allTopicsForLec.length > 0 &&
        completedInLec.length >= allTopicsForLec.length;

      onUpdateLectureProgress({
        ...progressMap,
        [lecKey]: {
          ...(progressMap[lecKey] || {}),
          completed: allDone ? true : Boolean(progressMap[lecKey]?.completed),
          completedTopicsCount: completedInLec.length,
          totalTopicsCount: allTopicsForLec.length,
        },
      });
    }

    setStatusBanner(`✓ "${topicMeta.topicTitle}" টপিকটি সম্পন্ন তালিকাভুক্ত হয়েছে!`);
    setTimeout(() => setStatusBanner(""), 3500);
  };

  // Topic-Wise MCQ Questions Pool from existing examSets
  const topicQuestions = useMemo(() => {
    const subId = selection?.subjectId || "bangla";
    const lecNo = Number(selection?.lectureNo || 1);

    let pool = [];
    examSets
      .filter(
        (s) =>
          (s.courseType || "bcs") === selectedCourse &&
          s.subjectId === subId &&
          Number(s.lectureNo) === lecNo
      )
      .forEach((setDoc) => {
        if (Array.isArray(setDoc.questions)) pool.push(...setDoc.questions);
      });

    if (pool.length === 0) {
      examSets
        .filter(
          (s) =>
            (s.courseType || "bcs") === selectedCourse && s.subjectId === subId
        )
        .forEach((setDoc) => {
          if (Array.isArray(setDoc.questions)) pool.push(...setDoc.questions);
        });
    }

    if (pool.length === 0) {
      pool = [
        {
          qNo: 1,
          question: `${selection?.topicTitle || "নির্বাচিত টপিক"} — এই টপিকের মূল ভিত্তি কোনটি?`,
          options: [
            "নিয়মিত অনুশীলন ও মূল নিয়ম বিশ্লেষণ",
            "শুধুমাত্র অনুমান নির্ভর উত্তর",
            "সিলেবাস বহির্ভূত অধ্যায়",
            "কোনোটিই নয়",
          ],
          correctAnswer: 0,
          explanation:
            "অ্যাডমিন প্যানেল থেকে এই লেকচারের Test 1 / Test 2-এ প্রশ্ন যুক্ত করলে সেগুলো স্বয়ংক্রিয়ভাবে এখানে চলে আসবে।",
        },
      ];
    }

    return pool.slice(0, questionCountLimit);
  }, [selection, examSets, selectedCourse, questionCountLimit]);

  useEffect(() => {
    if (modalTab === "mcq_exam") {
      setExamTimeLeftSec(topicQuestions.length * 36);
      setExamCurrentIdx(0);
      setExamAnswersMap({});
      setExamSubmitted(false);
    }
  }, [modalTab, questionCountLimit, topicQuestions.length]);

  useEffect(() => {
    if (modalTab !== "mcq_exam" || examSubmitted || topicQuestions.length === 0)
      return;
    const t = setInterval(() => {
      setExamTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleFinishTopicExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [modalTab, examSubmitted, topicQuestions.length, examAnswersMap]);

  const calculateTopicExamScore = () => {
    let correct = 0;
    let wrong = 0;
    topicQuestions.forEach((q, idx) => {
      const choice = examAnswersMap[idx];
      if (choice !== undefined) {
        if (Number(choice) === Number(q.correctAnswer)) correct += 1;
        else wrong += 1;
      }
    });
    const score = Math.max(0, +(correct - wrong * 0.5).toFixed(2));
    const percent =
      topicQuestions.length > 0
        ? Math.round((correct / topicQuestions.length) * 100)
        : 0;
    return { total: topicQuestions.length, correct, wrong, score, percent };
  };

  const handleFinishTopicExam = async (auto = false) => {
    if (!auto && !window.confirm("আপনি কি নিশ্চিতভাবে উত্তরপত্র জমা দিতে চান?"))
      return;
    setExamSubmitted(true);
    const res = calculateTopicExamScore();
    const saved = await postAction("SAVE_ACTIVITY_RECORD", {
      studentKey,
      courseType: selectedCourse,
      recordType: "mcq_result",
      mode: activeRoom ? "group" : "solo",
      ...selection,
      mcqScore: res.score,
      mcqTotal: res.total,
      mcqCorrect: res.correct,
      mcqWrong: res.wrong,
      dateKey: getTodayDateKey(),
    });
    if (saved.success && saved.record) {
      setActivityRecords((prev) => [saved.record, ...prev]);
    }
    if (onIncrementQuizCount) onIncrementQuizCount();
  };

  const completedLecturesCount = lectures.filter(
    (l) => progressMap[l._id || l.id]?.completed
  ).length;
  const lectureCompletionPercent = Math.round(
    (completedLecturesCount / Math.max(1, lectures.length)) * 100
  );

  return (
    <>
      {/* 1. DASHBOARD SIDEBAR ENTRY CARD (Below Profile Card) */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="neon-border-card rounded-3xl bg-gradient-to-br from-[#f5f3ff] via-white to-[#fdf4ff] p-5 border border-purple-200 shadow-xs cursor-pointer space-y-3.5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-[#4c1d95] text-[11px] font-black">
              <Users className="w-3.5 h-3.5" /> Group & Solo Study
            </span>
            <h3 className="text-xl font-black text-slate-900">Group Study</h3>
            <p className="text-xs font-extrabold text-[#4c1d95]">
              একসাথে পড়ি, একসাথে এগিয়ে যাই।
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-300/90 border-2 border-white shadow flex items-center justify-center text-[#2e1065] shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-1 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#4c1d95] shrink-0" />
            <span>সিঙ্কড টাইমার, একাকী স্টাডি ও টপিক MCQ</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>আজকের স্টাডি: {formatDurationBangla(stats.todayStudySec)}</span>
          </div>
        </div>

        <button
          type="button"
          className="premium-btn w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#3b0764] via-[#4c1d95] to-[#5b21b6] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <span>
            {activeRoom && activeRoom.status !== "ended"
              ? `🟢 চলমান রুমে ফিরুন (${activeRoom.roomCode})`
              : "নতুন গ্রুপ স্টাডি রুম তৈরি করুন →"}
          </span>
        </button>
      </div>

      {/* 2. RESPONSIVE MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-2.5 sm:p-5">
          <div className="bg-[#f4f6fb] max-w-5xl w-full max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#2e1065] flex flex-col">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#090d24] via-[#2e1065] to-[#4c1d95] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base sm:text-lg leading-tight">
                    Group Study & Personal Study Hub
                  </h2>
                  <p className="text-[11px] sm:text-xs text-purple-200 font-bold">
                    একসাথে পড়ি, একসাথে এগিয়ে যাই • সকল অগ্রগতি স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => syncWithBackend()}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingSync ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-black text-sm shadow cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODAL NAVIGATION TABS */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setModalTab(
                    activeRoom && activeRoom.status !== "ended"
                      ? "active_room"
                      : "group_lobby"
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  modalTab === "group_lobby" || modalTab === "active_room"
                    ? "bg-[#2e1065] text-amber-300"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>
                  A. Group Study{" "}
                  {activeRoom && activeRoom.status !== "ended" ? "(Live)" : ""}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("solo_study")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  modalTab === "solo_study"
                    ? "bg-[#2e1065] text-amber-300"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span>B. Solo Study (একাকী স্টাডি)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("mcq_exam")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  modalTab === "mcq_exam"
                    ? "bg-[#2e1065] text-amber-300"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>টপিক MCQ পরীক্ষা</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("progress")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  modalTab === "progress"
                    ? "bg-[#2e1065] text-amber-300"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>আপনার অগ্রগতি ({stats.completions.length})</span>
              </button>
            </div>

            {statusBanner && (
              <div className="bg-emerald-600 text-white px-4 py-2 text-xs sm:text-sm font-black text-center shrink-0">
                {statusBanner}
              </div>
            )}

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* TAB A1: GROUP LOBBY */}
              {modalTab === "group_lobby" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
                    <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 border">
                      <button
                        type="button"
                        onClick={() => setRoomSubTab("create")}
                        className={`py-2.5 rounded-xl text-xs sm:text-sm font-black cursor-pointer ${
                          roomSubTab === "create"
                            ? "bg-[#4c1d95] text-white"
                            : "text-slate-700"
                        }`}
                      >
                        + রুম তৈরি করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoomSubTab("join")}
                        className={`py-2.5 rounded-xl text-xs sm:text-sm font-black cursor-pointer ${
                          roomSubTab === "join"
                            ? "bg-[#4c1d95] text-white"
                            : "text-slate-700"
                        }`}
                      >
                        🔑 কোড দিয়ে যোগ দিন
                      </button>
                    </div>

                    {roomSubTab === "create" ? (
                      <form onSubmit={handleCreateRoom} className="space-y-4">
                        <CascadingTopicSelector
                          subjects={subjects}
                          lectures={lectures}
                          syllabusItems={syllabusItems}
                          selectedCourse={selectedCourse}
                          selection={selection}
                          onChangeSelection={setSelection}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="text-xs font-extrabold text-slate-700 block mb-1">
                              রুমের নাম (ঐচ্ছিক)
                            </label>
                            <input
                              type="text"
                              value={customRoomName}
                              onChange={(e) =>
                                setCustomRoomName(e.target.value)
                              }
                              placeholder={`${selection.subjectTitle} - ${selection.topicTitle}`}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-extrabold text-slate-700 block mb-1">
                              স্টাডি সময়
                            </label>
                            <select
                              value={scheduledMinutes}
                              onChange={(e) =>
                                setScheduledMinutes(Number(e.target.value))
                              }
                              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-extrabold"
                            >
                              <option value={25}>২৫ মিনিট</option>
                              <option value={45}>৪৫ মিনিট</option>
                              <option value={60}>১ ঘণ্টা</option>
                              <option value={90}>১ ঘণ্টা ৩০ মিনিট</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
                          <label className="flex items-center gap-2 text-xs font-extrabold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isPrivateRoom}
                              onChange={(e) =>
                                setIsPrivateRoom(e.target.checked)
                              }
                              className="w-4 h-4 accent-[#4c1d95]"
                            />
                            {isPrivateRoom ? (
                              <Lock className="w-4 h-4 text-rose-600" />
                            ) : (
                              <Unlock className="w-4 h-4 text-emerald-600" />
                            )}
                            <span>Private Room (শুধু আমন্ত্রণে)</span>
                          </label>

                          <div className="flex items-center gap-2 text-xs font-extrabold">
                            <span>সর্বোচ্চ সদস্য:</span>
                            <select
                              value={maxMembers}
                              onChange={(e) =>
                                setMaxMembers(Number(e.target.value))
                              }
                              className="px-2 py-1 rounded-lg border bg-white font-black text-[#4c1d95]"
                            >
                              <option value={5}>৫ জন</option>
                              <option value={10}>১০ জন</option>
                              <option value={20}>২০ জন</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="premium-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3b0764] to-[#4c1d95] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> রুম তৈরি করুন
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-4 py-2">
                        <label className="text-xs font-extrabold text-slate-700 block">
                          রুমের আমন্ত্রণ কোড (Invitation Code) লিখুন
                        </label>
                        <input
                          type="text"
                          value={inviteCodeInput}
                          onChange={(e) =>
                            setInviteCodeInput(e.target.value.toUpperCase())
                          }
                          placeholder="যেমন: GS8K42"
                          className="w-full p-3.5 rounded-2xl border-2 border-purple-200 text-center text-lg font-black tracking-widest uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => handleJoinRoom(inviteCodeInput)}
                          className="premium-btn w-full py-3.5 rounded-2xl bg-[#2e1065] text-amber-300 font-black text-sm cursor-pointer"
                        >
                          রুমে যোগ দিন →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* PUBLIC ROOMS LIST */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 space-y-3.5">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-black text-sm sm:text-base text-slate-900">
                        জনপ্রিয় গ্রুপ স্টাডি রুম ({publicRooms.length})
                      </h3>
                      <span className="text-[11px] font-extrabold text-emerald-600">
                        ● Live
                      </span>
                    </div>

                    {publicRooms.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-slate-50 border border-dashed text-center text-xs font-bold text-slate-500">
                        এই মুহূর্তে কোনো পাবলিক রুম চালু নেই। বাম পাশ থেকে নতুন রুম তৈরি করুন!
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {publicRooms.map((r) => (
                          <div
                            key={r.roomCode}
                            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                                {r.subjectTitle} - {r.topicTitle}
                              </h4>
                              <p className="text-[11px] font-bold text-slate-500">
                                Host: {r.hostName} • 👥{" "}
                                {r.participants?.length || 1}/
                                {r.maxParticipants}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleJoinRoom(r.roomCode)}
                              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-black shrink-0 cursor-pointer"
                            >
                              Join
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB A2: ACTIVE GROUP STUDY ROOM */}
              {modalTab === "active_room" && activeRoom && (
                <div className="rounded-3xl bg-gradient-to-br from-[#16113a] via-[#1f164d] to-[#2e1065] text-white p-5 sm:p-6 shadow-xl space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-base sm:text-xl">
                          {activeRoom.roomName}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(activeRoom.roomCode);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-0.5 rounded-full bg-white/10 border border-amber-300/40 text-amber-300 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                        >
                          <span>কোড: {activeRoom.roomCode}</span>
                          {copiedCode ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-purple-200 font-bold mt-0.5">
                        Host: {activeRoom.hostName} • 👥{" "}
                        {activeRoom.participants?.length || 1}/
                        {activeRoom.maxParticipants} সদস্য
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLeaveRoom}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Leave
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-center gap-3 overflow-x-auto py-1">
                        {(activeRoom.participants || []).map((p, idx) => (
                          <div
                            key={p.studentKey || idx}
                            className="flex flex-col items-center shrink-0 min-w-[58px]"
                          >
                            <div className="w-11 h-11 rounded-full border-2 border-amber-400 bg-purple-800 flex items-center justify-center font-black text-xs overflow-hidden">
                              {p.avatarUrl ? (
                                <img
                                  src={p.avatarUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>{(p.name || "S").slice(0, 2)}</span>
                              )}
                            </div>
                            <span className="text-[11px] font-extrabold mt-1 truncate max-w-[64px]">
                              {p.name?.split(" ")[0]}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-3xl bg-white text-slate-900 p-6 text-center space-y-4">
                        <div className="text-4xl sm:text-5xl font-black text-[#1e1b4b] font-mono">
                          {formatDigitalClock(liveRoomRemainingSec)}
                        </div>
                        <div className="text-xs font-extrabold text-purple-800">
                          {activeRoom.status === "running"
                            ? "🟢 স্টাডি সেশন চলছে"
                            : "⏸ স্টাডি সেশন বিরতিতে বা অপেক্ষায়"}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          {!activeRoom.timerState?.isRunning ? (
                            <button
                              type="button"
                              onClick={() => handleControlRoomTimer("START")}
                              className="px-6 py-3 rounded-2xl bg-[#4c1d95] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-current" /> Start /
                              Resume
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleControlRoomTimer("PAUSE")}
                              className="px-6 py-3 rounded-2xl bg-purple-100 text-[#2e1065] font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                            >
                              <Pause className="w-4 h-4" /> Pause
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleCompleteRoomSession(
                                Math.max(
                                  60,
                                  (activeRoom.scheduledDurationSec || 2700) -
                                    liveRoomRemainingSec
                                )
                              )
                            }
                            className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <Square className="w-4 h-4 fill-current" /> End
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 rounded-2xl bg-white/10 border border-white/15 p-4 flex flex-col justify-between space-y-4">
                      <div className="space-y-2 text-xs">
                        <div className="font-black text-amber-300 text-sm border-b border-white/10 pb-2">
                          সেশন ডিটেইলস
                        </div>
                        <div>
                          বিষয়: <strong>{activeRoom.subjectTitle}</strong>
                        </div>
                        <div>
                          লেকচার:{" "}
                          <strong>
                            লেকচার {activeRoom.lectureNo}:{" "}
                            {activeRoom.lectureTitle}
                          </strong>
                        </div>
                        <div>
                          টপিক:{" "}
                          <strong className="text-amber-300">
                            {activeRoom.topicTitle}
                          </strong>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkTopicCompleted({
                              ...activeRoom,
                              durationSec: 1800,
                            })
                          }
                          className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelection((prev) => ({
                              ...prev,
                              subjectId: activeRoom.subjectId,
                              subjectTitle: activeRoom.subjectTitle,
                              lectureNo: activeRoom.lectureNo,
                              lectureTitle: activeRoom.lectureTitle,
                              topicId: activeRoom.topicId,
                              topicTitle: activeRoom.topicTitle,
                            }));
                            setModalTab("mcq_exam");
                          }}
                          className="w-full py-2.5 rounded-xl bg-white/15 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-amber-300" /> MCQ
                          পরীক্ষা দিন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB B: SOLO STUDY TIMER */}
              {modalTab === "solo_study" && (
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                    <span className="text-xs font-black text-[#4c1d95] uppercase">
                      🎯 একাকী পড়াশোনার বিষয় ও টপিক নির্বাচন
                    </span>
                    <CascadingTopicSelector
                      subjects={subjects}
                      lectures={lectures}
                      syllabusItems={syllabusItems}
                      selectedCourse={selectedCourse}
                      selection={selection}
                      onChangeSelection={setSelection}
                    />
                  </div>

                  <div className="bg-gradient-to-b from-purple-50/90 to-white p-6 rounded-3xl border-2 border-purple-200 space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border">
                      <div>
                        <span className="text-xs font-extrabold text-purple-800">
                          {soloTimer.isRunning
                            ? "🟢 পড়াশোনা চলছে..."
                            : "⏱ সোলো স্টাডি টাইমার"}
                        </span>
                        <div className="text-4xl sm:text-5xl font-black text-[#1e1b4b] font-mono mt-1">
                          {formatDigitalClock(soloDisplaySec)}
                        </div>
                        <p className="text-xs font-bold text-slate-600 mt-1">
                          {selection.subjectTitle} • {selection.topicTitle}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {!soloTimer.isRunning ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateSoloTimerState({
                                ...soloTimer,
                                isRunning: true,
                                startedAtMs: Date.now(),
                              })
                            }
                            className="px-6 py-3.5 rounded-2xl bg-[#4c1d95] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current" /> নতুন সেশন
                            শুরু করুন
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const delta = Math.floor(
                                (Date.now() - soloTimer.startedAtMs) / 1000
                              );
                              updateSoloTimerState({
                                ...soloTimer,
                                isRunning: false,
                                startedAtMs: 0,
                                accumulatedSec:
                                  (soloTimer.accumulatedSec || 0) +
                                  Math.max(0, delta),
                              });
                            }}
                            className="px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <Pause className="w-4 h-4" /> Pause
                          </button>
                        )}

                        {(soloDisplaySec > 0 || soloTimer.isRunning) && (
                          <button
                            type="button"
                            onClick={async () => {
                              const finalSec = Math.max(soloDisplaySec, 60);
                              updateSoloTimerState({
                                ...soloTimer,
                                isRunning: false,
                                startedAtMs: 0,
                                accumulatedSec: 0,
                              });
                              setSoloDisplaySec(0);
                              await handleSaveSoloSession(finalSec);
                            }}
                            className="px-5 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Finish & Save
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkTopicCompleted({
                              ...selection,
                              durationSec: Math.max(soloDisplaySec, 60),
                            })
                          }
                          className="px-4 py-2.5 rounded-xl bg-[#2e1065] text-amber-300 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {isTopicCompletedFn(
                              selection.subjectId,
                              selection.lectureNo,
                              selection.topicId
                            )
                              ? "✓ টপিক সম্পন্ন হয়েছে"
                              : "Mark as Completed"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab("mcq_exam")}
                          className="px-4 py-2.5 rounded-xl bg-purple-100 text-[#2e1065] text-xs font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4" /> এই টপিকের MCQ দিন
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "আজকের ভিউ রিসেট করতে চান? (পূর্ববর্তী ইতিহাস সংরক্ষিত থাকবে)"
                            )
                          ) {
                            localStorage.setItem(
                              STORAGE_KEYS.DAILY_RESET_STAMP,
                              JSON.stringify({
                                dateKey: getTodayDateKey(),
                                resetAtMs: Date.now(),
                              })
                            );
                            updateSoloTimerState({
                              ...soloTimer,
                              isRunning: false,
                              startedAtMs: 0,
                              accumulatedSec: 0,
                            });
                            setSoloDisplaySec(0);
                            syncWithBackend();
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Today
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-2xl bg-white border flex items-center gap-3">
                        <Clock className="w-5 h-5 text-[#4c1d95]" />
                        <div>
                          <div className="text-xs text-slate-500 font-bold">
                            আজকের মোট সময়
                          </div>
                          <div className="font-black text-slate-900">
                            {formatDurationBangla(stats.todayStudySec)}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-slate-500 font-bold">
                            আজকের সেশন সংখ্যা
                          </div>
                          <div className="font-black text-slate-900">
                            {stats.todaySessionsCount} টি
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border flex items-center gap-3">
                        <Target className="w-5 h-5 text-amber-600" />
                        <div>
                          <div className="text-xs text-slate-500 font-bold">
                            আজকের লক্ষ্য
                          </div>
                          <div className="font-black text-slate-900">
                            ৪ ঘণ্টা
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB C: TOPIC-WISE MCQ EXAM */}
              {modalTab === "mcq_exam" && (
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  {examSubmitted ? (
                    (() => {
                      const res = calculateTopicExamScore();
                      return (
                        <div className="text-center space-y-4">
                          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                          <h3 className="text-2xl font-black">
                            অভিনন্দন! আপনার স্কোর: {res.percent}% ({res.correct}/
                            {res.total})
                          </h3>
                          <p className="text-xs font-bold text-slate-600">
                            বিষয়: {selection.subjectTitle} • টপিক:{" "}
                            {selection.topicTitle}
                          </p>
                          <div className="flex justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => setExamSubmitted(false)}
                              className="px-5 py-2.5 rounded-xl bg-slate-100 text-xs font-black cursor-pointer"
                            >
                              আবার পরীক্ষা দিন
                            </button>
                            <button
                              type="button"
                              onClick={() => setModalTab("progress")}
                              className="px-5 py-2.5 rounded-xl bg-[#4c1d95] text-white text-xs font-black cursor-pointer"
                            >
                              অগ্রগতি দেখুন →
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-black text-[#4c1d95]">
                          প্রশ্ন {examCurrentIdx + 1} / {topicQuestions.length}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-[#4c1d95] font-black text-xs">
                          ⏱ {formatDigitalClock(examTimeLeftSec)}
                        </span>
                      </div>

                      {topicQuestions[examCurrentIdx] && (
                        <div className="space-y-3">
                          <h3 className="text-base sm:text-lg font-black">
                            {topicQuestions[examCurrentIdx].question}
                          </h3>
                          <div className="space-y-2">
                            {(
                              topicQuestions[examCurrentIdx].options || []
                            ).map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setExamAnswersMap({
                                    ...examAnswersMap,
                                    [examCurrentIdx]: oIdx,
                                  })
                                }
                                className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-extrabold cursor-pointer ${
                                  examAnswersMap[examCurrentIdx] === oIdx
                                    ? "bg-purple-50 border-[#4c1d95] text-[#2e1065]"
                                    : "bg-white border-slate-200"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-3 border-t">
                        <button
                          type="button"
                          disabled={examCurrentIdx === 0}
                          onClick={() =>
                            setExamCurrentIdx((p) => Math.max(0, p - 1))
                          }
                          className="px-4 py-2 rounded-xl border text-xs font-black disabled:opacity-40 cursor-pointer"
                        >
                          পূর্ববর্তী
                        </button>
                        {examCurrentIdx < topicQuestions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExamCurrentIdx((p) =>
                                Math.min(topicQuestions.length - 1, p + 1)
                              )
                            }
                            className="px-5 py-2 rounded-xl bg-[#4c1d95] text-white text-xs font-black cursor-pointer"
                          >
                            পরবর্তী →
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFinishTopicExam(false)}
                            className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer"
                          >
                            জমা দিন
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB D: PROGRESS DASHBOARD */}
              {modalTab === "progress" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="bg-white p-4 rounded-2xl border">
                      <div className="text-xs text-slate-500 font-bold">
                        আজকের স্টাডি
                      </div>
                      <div className="text-lg font-black text-slate-900 mt-1">
                        {formatDurationBangla(stats.todayStudySec)}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border">
                      <div className="text-xs text-slate-500 font-bold">
                        সাপ্তাহিক স্টাডি
                      </div>
                      <div className="text-lg font-black text-slate-900 mt-1">
                        {formatDurationBangla(stats.weeklyStudySec)}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border">
                      <div className="text-xs text-slate-500 font-bold">
                        সম্পন্ন টপিক
                      </div>
                      <div className="text-lg font-black text-emerald-700 mt-1">
                        {stats.completions.length} টি
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border">
                      <div className="text-xs text-slate-500 font-bold">
                        সম্পন্ন লেকচার ({lectureCompletionPercent}%)
                      </div>
                      <div className="text-lg font-black text-[#4c1d95] mt-1">
                        {completedLecturesCount} / {lectures.length}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border space-y-3">
                    <h4 className="font-black text-sm text-slate-900">
                      সাম্প্রতিক সম্পন্ন টপিক
                    </h4>
                    {stats.completions.length === 0 ? (
                      <p className="text-xs text-slate-500 font-bold">
                        এখনো কোনো টপিক সম্পন্ন করা হয়নি।
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {stats.completions.slice(0, 8).map((c, i) => (
                          <div
                            key={c._id || i}
                            className="p-3 rounded-xl bg-slate-50 border flex justify-between text-xs font-extrabold"
                          >
                            <span>
                              ✓ {c.topicTitle} ({c.subjectTitle})
                            </span>
                            <span className="text-slate-500">{c.dateKey}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupStudyEntryCard;