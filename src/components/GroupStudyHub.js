"use client";

/**
 * ============================================================================
 * FILE: src/components/GroupStudyHub.js
 * PURPOSE: High-Speed, Zero-Latency Group Study & Solo Study Hub
 * KEY UPGRADES:
 * 1. Instant 0ms Optimistic UI for Pause/Resume/Start (No API lag).
 * 2. Independent User-Specific Timer & Pause/Resume System per device.
 * 3. "চলমান Group গুলো" (Running Groups) Drawer & Tab next to "আপনার অগ্রগতি"
 *    with Member details, Slot check, Auto-Leave on switch, and Auto-Cleanup.
 * 4. Custom Topic Input field for Host & Solo Study (with quick suggestions).
 * 5. Automatic "Study Session শেষ। নতুন Session শুরু করুন।" notification banner.
 * 6. Topic MCQ removed cleanly.
 * 7. Dashboard Entry Card updated to show only "Group Study" & "Solo Study"
 *    plus "আজকের স্টাডি".
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  Plus,
  Lock,
  Unlock,
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
  X,
  RefreshCw,
  Sparkles,
  BellRing,
  ArrowRightLeft,
} from "lucide-react";

const STORAGE_KEYS = {
  UI_STATE: "bcs_gs_modal_ui_state_v2",
  SOLO_TIMER: "bcs_gs_solo_active_timer_v2",
  USER_ROOM_TIMERS: "bcs_gs_user_room_timers_v2",
  RECORDS_CACHE: "bcs_gs_activity_records_v2",
  DAILY_RESET_STAMP: "bcs_gs_today_reset_offset_v2",
};

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

function deriveSuggestedTopics({
  subjectObj,
  lectureObj,
  syllabusItems = [],
  selectedCourse = "bcs",
}) {
  const suggestions = [];

  if (lectureObj?.title) {
    const cleanTitle = lectureObj.title
      .replace(/^লেকচার\s*\d*[:.\-]?\s*/i, "")
      .replace(/^Lecture\s*\d*[:.\-]?\s*/i, "")
      .trim();
    if (cleanTitle) suggestions.push(cleanTitle);
  }

  const customSyllabus = syllabusItems.filter(
    (s) => s.courseType === selectedCourse && s.subjectId === subjectObj?.id
  );
  customSyllabus.forEach((cs) => {
    if (cs.topicTitle && !suggestions.includes(cs.topicTitle)) {
      suggestions.push(cs.topicTitle);
    }
  });

  (subjectObj?.syllabusBreakdown || []).forEach((sb) => {
    if (sb.topic && !suggestions.includes(sb.topic)) {
      suggestions.push(sb.topic);
    }
  });

  return suggestions.slice(0, 6);
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

  let totalStudySec = 0;
  let todayStudySec = 0;
  let todaySessionsCount = 0;
  let weeklyStudySec = 0;

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
  });

  return {
    totalStudySec,
    todayStudySec,
    todaySessionsCount,
    weeklyStudySec,
    totalSessionsCount: sessions.length,
    completions,
  };
}

/**
 * Subject -> Lecture -> Custom Topic Input Component (Requirement 4)
 */
function SubjectLectureCustomTopicSelector({
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

  const suggestedTopics = useMemo(
    () =>
      deriveSuggestedTopics({
        subjectObj: currentSubject,
        lectureObj: currentLecture,
        syllabusItems,
        selectedCourse,
      }),
    [currentSubject, currentLecture, syllabusItems, selectedCourse]
  );

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

    onChangeSelection({
      subjectId: nextSub.id,
      subjectTitle: nextSub.title,
      lectureId: String(firstLec._id || firstLec.id || ""),
      lectureNo: Number(firstLec.lectureNo || 1),
      lectureTitle: firstLec.title,
      topicId: `custom_${Date.now()}`,
      topicTitle: selection.topicTitle || "",
    });
  };

  const handleLectureChange = (newLecNo) => {
    const foundLec =
      subjectLectures.find((l) => Number(l.lectureNo) === Number(newLecNo)) ||
      subjectLectures[0];

    onChangeSelection({
      ...selection,
      subjectId: currentSubject.id,
      subjectTitle: currentSubject.title,
      lectureId: String(foundLec?._id || foundLec?.id || ""),
      lectureNo: Number(foundLec?.lectureNo || 1),
      lectureTitle: foundLec?.title || `লেকচার ${newLecNo}`,
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#4c1d95]" />
            <span>১. বিষয় নির্বাচন করুন</span>
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
            <span>২. লেকচার নির্বাচন করুন</span>
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
            <span>৩. লেকচারের টপিক লিখুন *</span>
          </label>
          <input
            type="text"
            value={selection.topicTitle || ""}
            onChange={(e) =>
              onChangeSelection({
                ...selection,
                topicId: `custom_${selection.subjectId}_${selection.lectureNo}`,
                topicTitle: e.target.value,
              })
            }
            placeholder="যেমন: ধ্বনি ও বর্ণ প্রকরণ / শতকরা..."
            className="w-full p-2.5 rounded-xl border-2 border-purple-300 bg-white text-xs sm:text-sm font-extrabold text-slate-900 outline-none focus:border-[#4c1d95]"
          />
        </div>
      </div>

      {suggestedTopics.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> টপিক সাজেশন (ক্লিক
            করে বসান বা উপরে নিজে লিখুন):
          </span>
          {suggestedTopics.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() =>
                onChangeSelection({
                  ...selection,
                  topicId: `custom_${selection.subjectId}_${selection.lectureNo}_${i}`,
                  topicTitle: sug,
                })
              }
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition cursor-pointer ${
                selection.topicTitle === sug
                  ? "bg-[#4c1d95] text-white"
                  : "bg-purple-50 hover:bg-purple-100 text-[#4c1d95] border border-purple-200"
              }`}
            >
              {sug}
            </button>
          ))}
        </div>
      )}
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
  studentKey = "student_default",
  profile = {},
  progressMap = {},
  onUpdateLectureProgress,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState("group_lobby"); // "group_lobby" | "active_room" | "solo_study" | "progress" | "running_groups"
  const [roomSubTab, setRoomSubTab] = useState("create");
  const [showRunningGroupsDrawer, setShowRunningGroupsDrawer] = useState(false);

  const defaultSelection = useMemo(() => {
    const firstSub = subjects[0] || { id: "bangla", title: "বাংলা" };
    const firstLec = lectures
      .filter((l) => l.subjectId === firstSub.id)
      .sort((a, b) => Number(a.lectureNo) - Number(b.lectureNo))[0] || {
      _id: `virtual_${firstSub.id}_1`,
      lectureNo: 1,
      title: firstSub.syllabusBreakdown?.[0]?.topic || firstSub.title,
    };
    return {
      subjectId: firstSub.id,
      subjectTitle: firstSub.title,
      lectureId: String(firstLec._id || firstLec.id || ""),
      lectureNo: Number(firstLec.lectureNo || 1),
      lectureTitle: firstLec.title,
      topicId: `custom_${firstSub.id}_1`,
      topicTitle: firstLec.title || "",
    };
  }, [subjects, lectures]);

  const [selection, setSelection] = useState(defaultSelection);

  // Room Form State
  const [customRoomName, setCustomRoomName] = useState("");
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [scheduledMinutes, setScheduledMinutes] = useState(45);
  const [maxMembers, setMaxMembers] = useState(10);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Cloud State
  const [publicRooms, setPublicRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [activityRecords, setActivityRecords] = useState([]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [statusBanner, setStatusBanner] = useState("");

  // Independent User-Specific Group Room Timer State (Requirement 1, 2 & 5)
  const [myRoomTimer, setMyRoomTimer] = useState({
    roomCode: "",
    durationSec: 2700,
    remainingSecAtAnchor: 2700,
    anchorClientMs: 0,
    isRunning: true,
    isEnded: false,
  });
  const [myRoomDisplaySec, setMyRoomDisplaySec] = useState(2700);
  const [sessionEndedNotice, setSessionEndedNotice] = useState(false);
  const myRoomTimerRef = useRef(myRoomTimer);
  useEffect(() => {
    myRoomTimerRef.current = myRoomTimer;
  }, [myRoomTimer]);

  // Solo Study Timer State
  const [soloTimer, setSoloTimer] = useState({
    isRunning: false,
    startedAtMs: 0,
    accumulatedSec: 0,
    targetDurationSec: 45 * 60,
    isEnded: false,
  });
  const [soloDisplaySec, setSoloDisplaySec] = useState(0);

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
        if (parsed.modalTab) setModalTab(parsed.modalTab);
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

  // Helper to persist user-specific room timer in localStorage
  const saveUserRoomTimerToLocal = (roomCode, timerObj) => {
    setMyRoomTimer(timerObj);
    if (typeof window === "undefined" || !roomCode) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_ROOM_TIMERS);
      const map = raw ? JSON.parse(raw) : {};
      map[`${roomCode}_${studentKey}`] = timerObj;
      localStorage.setItem(STORAGE_KEYS.USER_ROOM_TIMERS, JSON.stringify(map));
    } catch (e) {}
  };

  const initializeOrRestoreUserRoomTimer = (roomDoc) => {
    if (!roomDoc || typeof window === "undefined") return;
    const code = roomDoc.roomCode;
    const totalDur = Number(roomDoc.scheduledDurationSec || 2700);

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_ROOM_TIMERS);
      const map = raw ? JSON.parse(raw) : {};
      const existing = map[`${code}_${studentKey}`];

      if (existing && existing.roomCode === code) {
        setMyRoomTimer(existing);
        setSessionEndedNotice(Boolean(existing.isEnded));
        return;
      }
    } catch (e) {}

    // Fresh independent timer for this student in this room
    const freshTimer = {
      roomCode: code,
      durationSec: totalDur,
      remainingSecAtAnchor: totalDur,
      anchorClientMs: Date.now(),
      isRunning: true,
      isEnded: false,
    };
    setSessionEndedNotice(false);
    saveUserRoomTimerToLocal(code, freshTimer);
  };

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

  // API Helper
  const postAction = async (action, payload) => {
    try {
      const res = await fetch("/api/group-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // High-speed background sync
  const syncWithBackend = async (
    overrideRoomCode = "",
    fetchRecords = false
  ) => {
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
        overrideRoomCode !== undefined
          ? overrideRoomCode
          : activeRoom?.roomCode || savedCode || "";

      const params = new URLSearchParams({
        courseType: selectedCourse,
        studentKey,
        includeRecords: fetchRecords ? "1" : "0",
        ...(codeToCheck ? { roomCode: codeToCheck } : {}),
      });

      const res = await fetch(`/api/group-study?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPublicRooms(data.publicRooms || []);
        if (data.activeRoom && data.activeRoom.status !== "ended") {
          setActiveRoom(data.activeRoom);
          if (myRoomTimerRef.current.roomCode !== data.activeRoom.roomCode) {
            initializeOrRestoreUserRoomTimer(data.activeRoom);
          }
        } else if (!codeToCheck) {
          setActiveRoom(null);
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
    syncWithBackend(undefined, true);
  }, [selectedCourse, studentKey]);

  // Lightweight polling while modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const poll = setInterval(() => {
      syncWithBackend(activeRoom?.roomCode || "", false);
    }, 6000);
    return () => clearInterval(poll);
  }, [isModalOpen, activeRoom?.roomCode, selectedCourse, studentKey]);

  // Independent User-Specific Group Room Timer Tick Effect (Requirement 2 & 5)
  useEffect(() => {
    if (!activeRoom || myRoomTimer.roomCode !== activeRoom.roomCode) return;

    const tick = () => {
      const current = myRoomTimerRef.current;
      if (current.isEnded) {
        setMyRoomDisplaySec(0);
        return;
      }
      if (!current.isRunning || !current.anchorClientMs) {
        setMyRoomDisplaySec(Math.max(0, current.remainingSecAtAnchor));
        return;
      }
      const elapsed = Math.floor((Date.now() - current.anchorClientMs) / 1000);
      const nextRem = Math.max(0, current.remainingSecAtAnchor - elapsed);
      setMyRoomDisplaySec(nextRem);

      // Requirement 5: When user's session timer reaches 00:00
      if (nextRem <= 0 && !current.isEnded) {
        const endedState = {
          ...current,
          remainingSecAtAnchor: 0,
          anchorClientMs: 0,
          isRunning: false,
          isEnded: true,
        };
        saveUserRoomTimerToLocal(activeRoom.roomCode, endedState);
        setSessionEndedNotice(true);
        setStatusBanner("🔔 Study Session শেষ। নতুন Session শুরু করুন।");

        // Automatically save the completed study session & remove user from active room if all done
        postAction("SAVE_ACTIVITY_RECORD", {
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
          durationSec: current.durationSec || 2700,
          dateKey: getTodayDateKey(),
        }).then((saved) => {
          if (saved?.record) {
            setActivityRecords((prev) => [saved.record, ...prev]);
          }
        });

        // Remove from running group automatically once session expires
        postAction("LEAVE_ROOM", {
          roomCode: activeRoom.roomCode,
          studentKey,
        }).then(() => {
          syncWithBackend("", false);
        });
      }
    };

    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [activeRoom, myRoomTimer]);

  // Solo Study Timer Tick Effect (with Session End Notification)
  useEffect(() => {
    const tick = () => {
      if (!soloTimer.isRunning || !soloTimer.startedAtMs) {
        setSoloDisplaySec(soloTimer.accumulatedSec || 0);
        return;
      }
      const delta = Math.floor((Date.now() - soloTimer.startedAtMs) / 1000);
      const totalElapsed =
        (soloTimer.accumulatedSec || 0) + Math.max(0, delta);
      setSoloDisplaySec(totalElapsed);

      const targetSec = Number(soloTimer.targetDurationSec || 2700);
      if (targetSec > 0 && totalElapsed >= targetSec && !soloTimer.isEnded) {
        const finishedSolo = {
          ...soloTimer,
          isRunning: false,
          startedAtMs: 0,
          accumulatedSec: targetSec,
          isEnded: true,
        };
        setSoloTimer(finishedSolo);
        localStorage.setItem(
          STORAGE_KEYS.SOLO_TIMER,
          JSON.stringify(finishedSolo)
        );
        setStatusBanner("🔔 Study Session শেষ। নতুন Session শুরু করুন।");
      }
    };
    tick();
    const interval = setInterval(tick, 500);
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

  const isTopicCompletedFn = (subId, lecNo, topTitle) =>
    activityRecords.some(
      (r) =>
        r.recordType === "topic_completion" &&
        r.subjectId === subId &&
        Number(r.lectureNo) === Number(lecNo) &&
        r.topicTitle === (topTitle || "").trim()
    );

  // Instant 0ms User-Specific Pause / Resume Handler (Requirement 1 & 2)
  const handleToggleMyRoomTimerPause = () => {
    if (!activeRoom) return;
    const current = myRoomTimerRef.current;

    if (current.isRunning) {
      // Instant Pause on this device only
      const elapsed = current.anchorClientMs
        ? Math.floor((Date.now() - current.anchorClientMs) / 1000)
        : 0;
      const remNow = Math.max(0, current.remainingSecAtAnchor - elapsed);
      const pausedState = {
        ...current,
        remainingSecAtAnchor: remNow,
        anchorClientMs: 0,
        isRunning: false,
      };
      setMyRoomDisplaySec(remNow);
      saveUserRoomTimerToLocal(activeRoom.roomCode, pausedState);

      // Optimistically update participant badge in UI
      setActiveRoom((prev) =>
        prev
          ? {
              ...prev,
              participants: (prev.participants || []).map((p) =>
                p.studentKey === studentKey
                  ? { ...p, isPaused: true, remainingSec: remNow }
                  : p
              ),
            }
          : prev
      );

      // Non-blocking background sync
      postAction("SYNC_USER_TIMER", {
        roomCode: activeRoom.roomCode,
        studentKey,
        isPaused: true,
        remainingSec: remNow,
      });
    } else {
      // Instant Resume on this device only
      const baseRem =
        current.remainingSecAtAnchor > 0
          ? current.remainingSecAtAnchor
          : activeRoom.scheduledDurationSec || 2700;
      const resumedState = {
        ...current,
        remainingSecAtAnchor: baseRem,
        anchorClientMs: Date.now(),
        isRunning: true,
        isEnded: false,
      };
      setSessionEndedNotice(false);
      setMyRoomDisplaySec(baseRem);
      saveUserRoomTimerToLocal(activeRoom.roomCode, resumedState);

      setActiveRoom((prev) =>
        prev
          ? {
              ...prev,
              participants: (prev.participants || []).map((p) =>
                p.studentKey === studentKey
                  ? { ...p, isPaused: false, remainingSec: baseRem }
                  : p
              ),
            }
          : prev
      );

      postAction("SYNC_USER_TIMER", {
        roomCode: activeRoom.roomCode,
        studentKey,
        isPaused: false,
        remainingSec: baseRem,
      });
    }
  };

  // Room Creation Handler (Requirement 4: Custom Topic validation)
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const cleanTopic = (selection.topicTitle || "").trim();
    if (!cleanTopic) {
      alert("⚠️ অনুগ্রহ করে লেকচারের টপিক লিখে নির্বাচন করুন!");
      return;
    }

    setIsActionLoading(true);
    const durationSec = Number(scheduledMinutes || 45) * 60;
    const res = await postAction("CREATE_ROOM", {
      roomName:
        customRoomName.trim() || `${selection.subjectTitle} — ${cleanTopic}`,
      courseType: selectedCourse,
      ...selection,
      topicTitle: cleanTopic,
      hostKey: studentKey,
      hostName: profile.name || "শিক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      institution: profile.institution || "",
      isPrivate: isPrivateRoom,
      maxParticipants: Number(maxMembers || 10),
      scheduledDurationSec: durationSec,
    });
    setIsActionLoading(false);

    if (res.success && res.room) {
      setActiveRoom(res.room);
      initializeOrRestoreUserRoomTimer(res.room);
      setCustomRoomName("");
      setSessionEndedNotice(false);
      setModalTab("active_room");
      syncWithBackend(res.room.roomCode, false);
    } else {
      alert(res.error || "রুম তৈরি করতে সমস্যা হয়েছে!");
    }
  };

  // Join Room Handler (Requirement 3: Auto-leave previous group if switching)
  const handleJoinRoom = async (codeToJoin) => {
    const cleanCode = (codeToJoin || "").trim().toUpperCase();
    if (!cleanCode) {
      alert("অনুগ্রহ করে রুমের কোড লিখুন!");
      return;
    }

    if (activeRoom && activeRoom.roomCode === cleanCode) {
      setModalTab("active_room");
      setShowRunningGroupsDrawer(false);
      return;
    }

    if (
      activeRoom &&
      activeRoom.status !== "ended" &&
      activeRoom.roomCode !== cleanCode
    ) {
      const ok = window.confirm(
        `আপনি বর্তমানে "${activeRoom.roomName}" রুমে যুক্ত আছেন। নতুন গ্রুপে যোগ দিতে আগের রুম থেকে Leave নিতে চান?`
      );
      if (!ok) return;
    }

    setIsActionLoading(true);
    const res = await postAction("JOIN_ROOM", {
      roomCode: cleanCode,
      previousRoomCode: activeRoom?.roomCode || "",
      studentKey,
      name: profile.name || "শিক্ষার্থী",
      avatarUrl: profile.avatarUrl || "",
      institution: profile.institution || "",
    });
    setIsActionLoading(false);

    if (res.success && res.room) {
      setActiveRoom(res.room);
      initializeOrRestoreUserRoomTimer(res.room);
      setInviteCodeInput("");
      setSessionEndedNotice(false);
      setShowRunningGroupsDrawer(false);
      setModalTab("active_room");
      syncWithBackend(res.room.roomCode, false);
    } else {
      alert(res.error || "রুমে যোগ দেওয়া যায়নি!");
    }
  };

  const handleLeaveRoom = async () => {
    if (!activeRoom) return;
    const leavingCode = activeRoom.roomCode;
    // Instant UI transition
    setActiveRoom(null);
    setSessionEndedNotice(false);
    setModalTab("group_lobby");

    await postAction("LEAVE_ROOM", {
      roomCode: leavingCode,
      studentKey,
    });
    syncWithBackend("", false);
  };

  const handleCompleteMyRoomSession = async () => {
    if (!activeRoom) return;
    const totalDur = Number(activeRoom.scheduledDurationSec || 2700);
    const studiedSeconds = Math.max(60, totalDur - myRoomDisplaySec);

    // Instant UI update
    const endedState = {
      ...myRoomTimerRef.current,
      remainingSecAtAnchor: 0,
      anchorClientMs: 0,
      isRunning: false,
      isEnded: true,
    };
    saveUserRoomTimerToLocal(activeRoom.roomCode, endedState);
    setMyRoomDisplaySec(0);
    setSessionEndedNotice(true);
    setStatusBanner(
      "🎉 Study Session শেষ। নতুন Session শুরু করুন। (অগ্রগতি সংরক্ষিত হয়েছে)"
    );

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
      setActivityRecords((prev) => [res.record, ...prev]);
    }
  };

  const handleSaveSoloSession = async (durationSec) => {
    const cleanTopic =
      (selection.topicTitle || "").trim() || selection.lectureTitle || "স্টাডি";
    const res = await postAction("SAVE_ACTIVITY_RECORD", {
      studentKey,
      courseType: selectedCourse,
      recordType: "session",
      mode: "solo",
      ...selection,
      topicTitle: cleanTopic,
      durationSec,
      dateKey: getTodayDateKey(),
    });
    if (res.success && res.record) {
      setActivityRecords((prev) => [res.record, ...prev]);
      setStatusBanner("✅ আপনার স্টাডি সেশন সফলভাবে সংরক্ষিত হয়েছে!");
      setTimeout(() => setStatusBanner(""), 4000);
    }
  };

  const handleMarkTopicCompleted = async (topicMeta) => {
    const cleanTopic =
      (topicMeta.topicTitle || "").trim() ||
      topicMeta.lectureTitle ||
      "নির্বাচিত টপিক";
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
      topicId: topicMeta.topicId || `top_${Date.now()}`,
      topicTitle: cleanTopic,
      durationSec: Number(topicMeta.durationSec || 60),
      dateKey: getTodayDateKey(),
    };

    // Optimistic UI feedback
    setStatusBanner(`✓ "${cleanTopic}" টপিকটি সম্পন্ন তালিকাভুক্ত হয়েছে!`);
    setTimeout(() => setStatusBanner(""), 3500);

    const res = await postAction("SAVE_ACTIVITY_RECORD", payload);
    if (res.record) {
      setActivityRecords((prev) => [
        res.record,
        ...prev.filter(
          (r) =>
            !(
              r.recordType === "topic_completion" &&
              r.subjectId === payload.subjectId &&
              Number(r.lectureNo) === payload.lectureNo &&
              r.topicTitle === cleanTopic
            )
        ),
      ]);
    }

    const targetLecObj = lectures.find(
      (l) =>
        l.subjectId === payload.subjectId &&
        Number(l.lectureNo) === payload.lectureNo
    );
    if (targetLecObj && onUpdateLectureProgress) {
      const lecKey = targetLecObj._id || targetLecObj.id;
      onUpdateLectureProgress({
        ...progressMap,
        [lecKey]: {
          ...(progressMap[lecKey] || {}),
          completed: true,
        },
      });
    }
  };

  const completedLecturesCount = lectures.filter(
    (l) => progressMap[l._id || l.id]?.completed
  ).length;
  const lectureCompletionPercent = Math.round(
    (completedLecturesCount / Math.max(1, lectures.length)) * 100
  );

  // Reusable Running Groups List Renderer (Requirement 3)
  const renderRunningGroupsList = () => (
    <div className="space-y-3">
      {publicRooms.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed text-center text-xs font-bold text-slate-500">
          এই মুহূর্তে কোনো চলমান গ্রুপ স্টাডি রুম নেই। আপনি নতুন একটি রুম তৈরি
          করুন!
        </div>
      ) : (
        publicRooms.map((r) => {
          const isMyCurrentRoom = activeRoom?.roomCode === r.roomCode;
          const memberCount = r.participants?.length || 0;
          const maxCap = r.maxParticipants || 10;
          const isFull = memberCount >= maxCap && !isMyCurrentRoom;

          return (
            <div
              key={r.roomCode}
              className={`p-4 rounded-2xl border-2 transition space-y-3 ${
                isMyCurrentRoom
                  ? "bg-purple-50/90 border-[#4c1d95]"
                  : "bg-white border-slate-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#4c1d95] text-[10px] font-black">
                      {r.subjectTitle} • লেকচার {r.lectureNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      👥 {memberCount}/{maxCap} সদস্য
                    </span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 mt-1">
                    টপিক: {r.topicTitle}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500">
                    রুম কোড: <strong className="text-slate-800">{r.roomCode}</strong>{" "}
                    • Host: {r.hostName}
                  </p>
                </div>

                {isMyCurrentRoom ? (
                  <button
                    type="button"
                    onClick={() => {
                      setModalTab("active_room");
                      setShowRunningGroupsDrawer(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#2e1065] text-amber-300 text-xs font-black shrink-0 cursor-pointer"
                  >
                    আপনার রুম →
                  </button>
                ) : isFull ? (
                  <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-black shrink-0">
                    Slot পূর্ণ
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleJoinRoom(r.roomCode)}
                    className="premium-btn px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shrink-0 flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    {activeRoom && activeRoom.status !== "ended" ? (
                      <>
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Switch & Join</span>
                      </>
                    ) : (
                      <span>Join করুন</span>
                    )}
                  </button>
                )}
              </div>

              {/* Members Avatar & Name Pills */}
              {memberCount > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500 mr-1">
                    সদস্যবৃন্দ:
                  </span>
                  {(r.participants || []).map((m, idx) => (
                    <span
                      key={m.studentKey || idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-extrabold text-slate-800"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          m.isPaused ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                      <span>{m.name}</span>
                      {m.isHost && (
                        <span className="text-[9px] text-purple-700 font-black">
                          (Host)
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <>
      {/* 1. DASHBOARD SIDEBAR ENTRY CARD (Requirement 7: Only Group Study & Solo Study + আজকের স্টাডি) */}
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

        {/* Requirement 7: Only Group Study and Solo Study badges + Today's Study */}
        <div className="space-y-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-purple-100 text-[#2e1065] font-black text-xs flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#4c1d95]" /> Group Study
            </span>
            <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-950 border border-indigo-200 font-black text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-700" /> Solo Study
            </span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
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
          <div className="bg-[#f4f6fb] max-w-5xl w-full max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#2e1065] flex flex-col relative">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-[#090d24] via-[#2e1065] to-[#4c1d95] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base sm:text-lg leading-tight">
                    Group Study & Solo Study Hub
                  </h2>
                  <p className="text-[11px] sm:text-xs text-purple-200 font-bold">
                    একসাথে পড়ি, একসাথে এগিয়ে যাই • প্রত্যেকের টাইমার নিজ ডিভাইসে স্বাধীনভাবে নিয়ন্ত্রিত
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => syncWithBackend(activeRoom?.roomCode || "", true)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                  title="রিফ্রেশ করুন"
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

            {/* MODAL NAVIGATION BAR (Requirement 3 & 6: Removed Topic MCQ, Added "চলমান Group গুলো" on top right next to "আপনার অগ্রগতি") */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 py-2.5 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowRunningGroupsDrawer(false);
                    setModalTab(
                      activeRoom && activeRoom.status !== "ended"
                        ? "active_room"
                        : "group_lobby"
                    );
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    modalTab === "group_lobby" || modalTab === "active_room"
                      ? "bg-[#2e1065] text-amber-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>
                    Group Study{" "}
                    {activeRoom && activeRoom.status !== "ended" ? "(Live)" : ""}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRunningGroupsDrawer(false);
                    setModalTab("solo_study");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    modalTab === "solo_study"
                      ? "bg-[#2e1065] text-amber-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Solo Study</span>
                </button>
              </div>

              {/* Top-Right Section: "আপনার অগ্রগতি" + "চলমান Group গুলো" (Requirement 3) */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setShowRunningGroupsDrawer(false);
                    setModalTab("progress");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    modalTab === "progress" && !showRunningGroupsDrawer
                      ? "bg-[#2e1065] text-amber-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>আপনার অগ্রগতি ({stats.completions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    syncWithBackend(activeRoom?.roomCode || "", false);
                    setShowRunningGroupsDrawer((prev) => !prev);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 shrink-0 cursor-pointer border transition ${
                    showRunningGroupsDrawer
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>চলমান Group গুলো ({publicRooms.length})</span>
                </button>
              </div>
            </div>

            {statusBanner && (
              <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs sm:text-sm font-black text-center shrink-0 flex items-center justify-center gap-2">
                <BellRing className="w-4 h-4 shrink-0" />
                <span>{statusBanner}</span>
              </div>
            )}

            {/* SLIDE-OVER RIGHT DRAWER FOR "চলমান Group গুলো" (Requirement 3) */}
            {showRunningGroupsDrawer && (
              <div className="absolute right-0 top-[112px] bottom-0 w-full sm:w-[420px] bg-white border-l-2 border-[#2e1065] shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-black text-sm">
                      চলমান Group গুলো ({publicRooms.length}টি সক্রিয়)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRunningGroupsDrawer(false)}
                    className="w-7 h-7 rounded-full bg-white/15 text-xs font-black flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                  {renderRunningGroupsList()}
                </div>
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
                        🔑 কোড দিয়ে যোগ দিন
                      </button>
                    </div>

                    {roomSubTab === "create" ? (
                      <form onSubmit={handleCreateRoom} className="space-y-4">
                        <SubjectLectureCustomTopicSelector
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
                              placeholder={`${selection.subjectTitle} — ${
                                selection.topicTitle || "স্টাডি রুম"
                              }`}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-extrabold text-slate-700 block mb-1">
                              স্টাডি সেশনের সময়
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
                              <option value={120}>২ ঘণ্টা</option>
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
                            <span>Private Room (শুধু কোড দিয়ে যোগ দেওয়া যাবে)</span>
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
                          disabled={isActionLoading}
                          className="premium-btn w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3b0764] to-[#4c1d95] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {isActionLoading
                              ? "রুম তৈরি হচ্ছে..."
                              : "রুম তৈরি করুন ও স্টাডি শুরু করুন"}
                          </span>
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-4 py-2">
                        <label className="text-xs font-extrabold text-slate-700 block">
                          রুমের আমন্ত্রণ কোড (Study Code) লিখুন
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
                          disabled={isActionLoading}
                          onClick={() => handleJoinRoom(inviteCodeInput)}
                          className="premium-btn w-full py-3.5 rounded-2xl bg-[#2e1065] text-amber-300 font-black text-sm cursor-pointer disabled:opacity-60"
                        >
                          {isActionLoading ? "যুক্ত হচ্ছে..." : "রুমে যোগ দিন →"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* RUNNING PUBLIC ROOMS LIST */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 space-y-3.5">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="font-black text-sm sm:text-base text-slate-900">
                        চলমান Group গুলো ({publicRooms.length})
                      </h3>
                      <span className="text-[11px] font-extrabold text-emerald-600">
                        ● Live Running
                      </span>
                    </div>
                    <div className="max-h-[420px] overflow-y-auto pr-1">
                      {renderRunningGroupsList()}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB A2: ACTIVE GROUP STUDY ROOM (With Independent Device Timer & Session End Notice) */}
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
                          className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <span>Study Code: {activeRoom.roomCode}</span>
                          {copiedCode ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-purple-200 font-bold mt-1">
                        Host: {activeRoom.hostName} • 👥{" "}
                        {activeRoom.participants?.length || 1}/
                        {activeRoom.maxParticipants} সদস্য যুক্ত আছেন
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLeaveRoom}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Leave Room
                    </button>
                  </div>

                  {/* Requirement 5: Session End Notification Banner */}
                  {sessionEndedNotice && (
                    <div className="p-5 rounded-2xl bg-amber-400 text-slate-950 font-black flex flex-wrap items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center gap-2.5 text-sm sm:text-base">
                        <BellRing className="w-6 h-6 text-rose-700 animate-bounce shrink-0" />
                        <span>Study Session শেষ। নতুন Session শুরু করুন।</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const dur = Number(
                              activeRoom.scheduledDurationSec || 2700
                            );
                            const restarted = {
                              roomCode: activeRoom.roomCode,
                              durationSec: dur,
                              remainingSecAtAnchor: dur,
                              anchorClientMs: Date.now(),
                              isRunning: true,
                              isEnded: false,
                            };
                            setSessionEndedNotice(false);
                            setMyRoomDisplaySec(dur);
                            saveUserRoomTimerToLocal(
                              activeRoom.roomCode,
                              restarted
                            );
                          }}
                          className="px-4 py-2 rounded-xl bg-[#2e1065] text-white text-xs font-black cursor-pointer"
                        >
                          🔄 একই রুমে নতুন সেশন শুরু করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRoom(null);
                            setSessionEndedNotice(false);
                            setModalTab("group_lobby");
                          }}
                          className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-black cursor-pointer"
                        >
                          + নতুন রুম তৈরি করুন
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 space-y-4">
                      {/* Participants Bar with Individual Studying/Paused Status */}
                      <div className="flex items-center gap-3 overflow-x-auto py-1">
                        {(activeRoom.participants || []).map((p, idx) => {
                          const isMe = p.studentKey === studentKey;
                          const pausedStatus = isMe
                            ? !myRoomTimer.isRunning
                            : p.isPaused;
                          return (
                            <div
                              key={p.studentKey || idx}
                              className="flex flex-col items-center shrink-0 min-w-[72px] p-2 rounded-2xl bg-white/5 border border-white/10"
                            >
                              <div className="relative w-11 h-11 rounded-full border-2 border-amber-400 bg-purple-800 flex items-center justify-center font-black text-xs overflow-hidden">
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
                              <span className="text-[11px] font-extrabold mt-1 truncate max-w-[74px]">
                                {p.name?.split(" ")[0]} {isMe ? "(আপনি)" : ""}
                              </span>
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.2 rounded-full mt-0.5 ${
                                  pausedStatus
                                    ? "bg-amber-400/20 text-amber-300"
                                    : "bg-emerald-400/20 text-emerald-300"
                                }`}
                              >
                                {pausedStatus ? "⏸ বিরতিতে" : "🟢 পড়ছেন"}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Independent Device Timer Card (Requirement 1 & 2) */}
                      <div className="rounded-3xl bg-white text-slate-900 p-6 text-center space-y-4 shadow-md">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#4c1d95] text-xs font-black">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            আপনার ব্যক্তিগত স্টাডি টাইমার (অন্যদের টাইমার প্রভাবিত হবে না)
                          </span>
                        </div>

                        <div className="text-4xl sm:text-6xl font-black text-[#1e1b4b] font-mono tracking-tight">
                          {formatDigitalClock(myRoomDisplaySec)}
                        </div>

                        <div className="text-xs font-extrabold text-purple-800">
                          {sessionEndedNotice
                            ? "🔔 Study Session শেষ। নতুন Session শুরু করুন।"
                            : myRoomTimer.isRunning
                            ? "🟢 আপনার স্টাডি সেশন চলছে..."
                            : "⏸ আপনার টাইমার বিরতিতে (Paused) আছে"}
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={handleToggleMyRoomTimerPause}
                            className={`premium-btn px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md ${
                              !myRoomTimer.isRunning
                                ? "bg-[#4c1d95] text-white"
                                : "bg-amber-400 text-slate-950"
                            }`}
                          >
                            {!myRoomTimer.isRunning ? (
                              <>
                                <Play className="w-4 h-4 fill-current" />
                                <span>Resume (পড়া চালিয়ে যান)</span>
                              </>
                            ) : (
                              <>
                                <Pause className="w-4 h-4" />
                                <span>Pause (বিরতি নিন)</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleCompleteMyRoomSession}
                            className="premium-btn px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
                          >
                            <Square className="w-4 h-4 fill-current" />
                            <span>সেশন শেষ ও সেভ করুন</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 rounded-2xl bg-white/10 border border-white/15 p-4 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5 text-xs">
                        <div className="font-black text-amber-300 text-sm border-b border-white/10 pb-2">
                          📌 স্টাডি রুমের টপিক ও তথ্য
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
                        <div className="p-2.5 rounded-xl bg-white/10 border border-amber-300/30">
                          নির্ধারিত টপিক:{" "}
                          <strong className="text-amber-300 block text-sm mt-0.5">
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
                              durationSec:
                                (activeRoom.scheduledDurationSec || 2700) -
                                myRoomDisplaySec,
                            })
                          }
                          className="premium-btn w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {isTopicCompletedFn(
                              activeRoom.subjectId,
                              activeRoom.lectureNo,
                              activeRoom.topicTitle
                            )
                              ? "✓ টপিকটি সম্পন্ন হয়েছে"
                              : "টপিকটি সম্পন্ন হিসেবে চিহ্নিত করুন"}
                          </span>
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
                      🎯 একাকী পড়াশোনার বিষয়, লেকচার ও কাস্টম টপিক নির্বাচন
                    </span>
                    <SubjectLectureCustomTopicSelector
                      subjects={subjects}
                      lectures={lectures}
                      syllabusItems={syllabusItems}
                      selectedCourse={selectedCourse}
                      selection={selection}
                      onChangeSelection={setSelection}
                    />
                  </div>

                  <div className="bg-gradient-to-b from-purple-50/90 to-white p-6 rounded-3xl border-2 border-purple-200 space-y-5">
                    {soloTimer.isEnded && (
                      <div className="p-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <BellRing className="w-5 h-5 text-rose-700" />
                          <span>Study Session শেষ। নতুন Session শুরু করুন।</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            updateSoloTimerState({
                              ...soloTimer,
                              isRunning: true,
                              startedAtMs: Date.now(),
                              accumulatedSec: 0,
                              isEnded: false,
                            });
                            setSoloDisplaySec(0);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-[#2e1065] text-white text-xs font-black cursor-pointer"
                        >
                          নতুন সেশন শুরু করুন
                        </button>
                      </div>
                    )}

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
                          {selection.subjectTitle} • লেকচার {selection.lectureNo}{" "}
                          • {selection.topicTitle || "কাস্টম টপিক"}
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
                                isEnded: false,
                                startedAtMs: Date.now(),
                              })
                            }
                            className="premium-btn px-6 py-3.5 rounded-2xl bg-[#4c1d95] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>
                              {soloDisplaySec > 0
                                ? "Resume করুন"
                                : "নতুন সেশন শুরু করুন"}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const delta = Math.floor(
                                (Date.now() - soloTimer.startedAtMs) / 1000
                              );
                              const nextAcc =
                                (soloTimer.accumulatedSec || 0) +
                                Math.max(0, delta);
                              setSoloDisplaySec(nextAcc);
                              updateSoloTimerState({
                                ...soloTimer,
                                isRunning: false,
                                startedAtMs: 0,
                                accumulatedSec: nextAcc,
                              });
                            }}
                            className="premium-btn px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
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
                                isEnded: true,
                              });
                              setSoloDisplaySec(0);
                              await handleSaveSoloSession(finalSec);
                            }}
                            className="premium-btn px-5 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Finish & Save
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
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
                            selection.topicTitle
                          )
                            ? "✓ টপিক সম্পন্ন হয়েছে"
                            : "Mark as Completed"}
                        </span>
                      </button>

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
                              isEnded: false,
                            });
                            setSoloDisplaySec(0);
                            syncWithBackend(activeRoom?.roomCode || "", true);
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

              {/* TAB C: PROGRESS DASHBOARD */}
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
                        {stats.completions.slice(0, 10).map((c, i) => (
                          <div
                            key={c._id || i}
                            className="p-3 rounded-xl bg-slate-50 border flex justify-between text-xs font-extrabold"
                          >
                            <span>
                              ✓ {c.topicTitle} ({c.subjectTitle} • লেকচার{" "}
                              {c.lectureNo || 1})
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