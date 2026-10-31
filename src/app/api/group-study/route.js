/**
 * ============================================================================
 * FILE: src/app/api/group-study/route.js
 * PURPOSE: All-in-One MongoDB Schemas & REST API for Group Study & Solo Study
 * ============================================================================
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

const ParticipantSchema = new mongoose.Schema(
  {
    studentKey: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    institution: { type: String, default: "" },
    isHost: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const GroupStudyRoomSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true, index: true },
    roomName: { type: String, required: true },
    courseType: { type: String, default: "bcs", index: true },
    subjectId: { type: String, required: true },
    subjectTitle: { type: String, required: true },
    lectureId: { type: String, default: "" },
    lectureNo: { type: Number, default: 1 },
    lectureTitle: { type: String, default: "" },
    topicId: { type: String, required: true },
    topicTitle: { type: String, required: true },
    hostKey: { type: String, required: true },
    hostName: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    maxParticipants: { type: Number, default: 10 },
    scheduledDurationSec: { type: Number, default: 2700 },
    status: {
      type: String,
      enum: ["waiting", "running", "paused", "ended"],
      default: "waiting",
    },
    timerState: {
      durationSec: { type: Number, default: 2700 },
      remainingSecAtPause: { type: Number, default: 2700 },
      startedAtServerMs: { type: Number, default: 0 },
      isRunning: { type: Boolean, default: false },
    },
    participants: [ParticipantSchema],
  },
  { timestamps: true }
);

const StudyActivityRecordSchema = new mongoose.Schema(
  {
    studentKey: { type: String, required: true, index: true },
    courseType: { type: String, default: "bcs", index: true },
    recordType: {
      type: String,
      enum: ["session", "topic_completion", "mcq_result"],
      required: true,
    },
    mode: { type: String, enum: ["group", "solo"], default: "solo" },
    roomCode: { type: String, default: "" },
    subjectId: { type: String, required: true },
    subjectTitle: { type: String, default: "" },
    lectureId: { type: String, default: "" },
    lectureNo: { type: Number, default: 1 },
    lectureTitle: { type: String, default: "" },
    topicId: { type: String, required: true },
    topicTitle: { type: String, default: "" },
    durationSec: { type: Number, default: 0 },
    dateKey: { type: String, index: true },
    mcqScore: { type: Number, default: 0 },
    mcqTotal: { type: Number, default: 0 },
    mcqCorrect: { type: Number, default: 0 },
    mcqWrong: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GroupStudyRoom =
  mongoose.models.GroupStudyRoom ||
  mongoose.model("GroupStudyRoom", GroupStudyRoomSchema);

const StudyActivityRecord =
  mongoose.models.StudyActivityRecord ||
  mongoose.model("StudyActivityRecord", StudyActivityRecordSchema);

function computeLiveRemainingSeconds(roomDoc) {
  if (!roomDoc || !roomDoc.timerState) return 0;
  const ts = roomDoc.timerState;
  if (!ts.isRunning || !ts.startedAtServerMs) {
    return Math.max(0, Number(ts.remainingSecAtPause ?? ts.durationSec ?? 0));
  }
  const elapsedSec = Math.floor((Date.now() - ts.startedAtServerMs) / 1000);
  return Math.max(
    0,
    Number(ts.remainingSecAtPause || ts.durationSec) - elapsedSec
  );
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseType = searchParams.get("courseType") || "bcs";
    const studentKey = searchParams.get("studentKey") || "";
    const roomCode = searchParams.get("roomCode") || "";

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    await GroupStudyRoom.deleteMany({ updatedAt: { $lt: twelveHoursAgo } });

    const publicRooms = await GroupStudyRoom.find({
      courseType,
      status: { $ne: "ended" },
      isPrivate: false,
    })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    let activeRoom = null;
    if (roomCode) {
      activeRoom = await GroupStudyRoom.findOne({
        roomCode: roomCode.toUpperCase(),
      }).lean();
    } else if (studentKey) {
      activeRoom = await GroupStudyRoom.findOne({
        status: { $ne: "ended" },
        "participants.studentKey": studentKey,
      }).lean();
    }

    let records = [];
    if (studentKey) {
      records = await StudyActivityRecord.find({ studentKey, courseType })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();
    }

    return NextResponse.json({
      success: true,
      serverNowMs: Date.now(),
      publicRooms: publicRooms.map((r) => ({
        ...r,
        computedRemainingSec: computeLiveRemainingSeconds(r),
      })),
      activeRoom: activeRoom
        ? {
            ...activeRoom,
            computedRemainingSec: computeLiveRemainingSeconds(activeRoom),
          }
        : null,
      records,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { action, payload } = await req.json();

    if (action === "CREATE_ROOM") {
      const {
        roomName,
        courseType = "bcs",
        subjectId,
        subjectTitle,
        lectureId = "",
        lectureNo = 1,
        lectureTitle = "",
        topicId,
        topicTitle,
        hostKey,
        hostName,
        avatarUrl = "",
        institution = "",
        isPrivate = false,
        maxParticipants = 10,
        scheduledDurationSec = 2700,
      } = payload;

      const randomCode =
        "GS" +
        Math.random().toString(36).substring(2, 6).toUpperCase() +
        String(Date.now()).slice(-2);

      const duration = Math.max(300, Number(scheduledDurationSec) || 2700);

      const newRoom = await GroupStudyRoom.create({
        roomCode: randomCode,
        roomName: roomName?.trim() || `${subjectTitle} — ${topicTitle}`,
        courseType,
        subjectId,
        subjectTitle,
        lectureId,
        lectureNo: Number(lectureNo || 1),
        lectureTitle,
        topicId,
        topicTitle,
        hostKey,
        hostName: hostName || "শিক্ষার্থী",
        isPrivate: Boolean(isPrivate),
        maxParticipants: Number(maxParticipants || 10),
        scheduledDurationSec: duration,
        status: "waiting",
        timerState: {
          durationSec: duration,
          remainingSecAtPause: duration,
          startedAtServerMs: 0,
          isRunning: false,
        },
        participants: [
          {
            studentKey: hostKey,
            name: hostName || "শিক্ষার্থী",
            avatarUrl,
            institution,
            isHost: true,
          },
        ],
      });

      const plain = newRoom.toObject();
      return NextResponse.json({
        success: true,
        serverNowMs: Date.now(),
        room: {
          ...plain,
          computedRemainingSec: computeLiveRemainingSeconds(plain),
        },
      });
    }

    if (action === "JOIN_ROOM") {
      const { roomCode, studentKey, name, avatarUrl = "", institution = "" } =
        payload;
      const room = await GroupStudyRoom.findOne({
        roomCode: (roomCode || "").trim().toUpperCase(),
      });

      if (!room || room.status === "ended") {
        return NextResponse.json(
          {
            success: false,
            error: "রুমটি খুঁজে পাওয়া যায়নি অথবা সেশনটি সমাপ্ত হয়েছে!",
          },
          { status: 404 }
        );
      }

      const existingIdx = room.participants.findIndex(
        (p) => p.studentKey === studentKey
      );

      if (existingIdx === -1) {
        if (room.participants.length >= room.maxParticipants) {
          return NextResponse.json(
            { success: false, error: "এই রুমের আসন সংখ্যা পূর্ণ হয়ে গেছে!" },
            { status: 400 }
          );
        }
        room.participants.push({
          studentKey,
          name: name || "শিক্ষার্থী",
          avatarUrl,
          institution,
          isHost: room.hostKey === studentKey,
        });
      } else {
        room.participants[existingIdx].name =
          name || room.participants[existingIdx].name;
        room.participants[existingIdx].avatarUrl =
          avatarUrl || room.participants[existingIdx].avatarUrl;
      }

      await room.save();
      const plain = room.toObject();
      return NextResponse.json({
        success: true,
        serverNowMs: Date.now(),
        room: {
          ...plain,
          computedRemainingSec: computeLiveRemainingSeconds(plain),
        },
      });
    }

    if (action === "CONTROL_ROOM_TIMER") {
      const { roomCode, command } = payload;
      const room = await GroupStudyRoom.findOne({
        roomCode: (roomCode || "").toUpperCase(),
      });
      if (!room) {
        return NextResponse.json(
          { success: false, error: "রুম পাওয়া যায়নি!" },
          { status: 404 }
        );
      }

      const nowMs = Date.now();
      const currentRem = computeLiveRemainingSeconds(room);

      if (command === "START" || command === "RESUME") {
        const baseRem =
          currentRem > 0 ? currentRem : room.scheduledDurationSec || 2700;
        room.status = "running";
        room.timerState = {
          durationSec: room.scheduledDurationSec || 2700,
          remainingSecAtPause: baseRem,
          startedAtServerMs: nowMs,
          isRunning: true,
        };
      } else if (command === "PAUSE") {
        room.status = "paused";
        room.timerState = {
          durationSec: room.scheduledDurationSec || 2700,
          remainingSecAtPause: currentRem,
          startedAtServerMs: 0,
          isRunning: false,
        };
      } else if (command === "END") {
        room.status = "ended";
        room.timerState = {
          durationSec: room.scheduledDurationSec || 2700,
          remainingSecAtPause: 0,
          startedAtServerMs: 0,
          isRunning: false,
        };
      }

      await room.save();
      const plain = room.toObject();
      return NextResponse.json({
        success: true,
        serverNowMs: Date.now(),
        room: {
          ...plain,
          computedRemainingSec: computeLiveRemainingSeconds(plain),
        },
      });
    }

    if (action === "LEAVE_ROOM") {
      const { roomCode, studentKey } = payload;
      const room = await GroupStudyRoom.findOne({
        roomCode: (roomCode || "").toUpperCase(),
      });
      if (!room) return NextResponse.json({ success: true });

      room.participants = room.participants.filter(
        (p) => p.studentKey !== studentKey
      );

      if (room.participants.length === 0) {
        await GroupStudyRoom.deleteOne({ _id: room._id });
        return NextResponse.json({ success: true, roomDeleted: true });
      }

      if (room.hostKey === studentKey) {
        room.participants[0].isHost = true;
        room.hostKey = room.participants[0].studentKey;
        room.hostName = room.participants[0].name;
      }

      await room.save();
      return NextResponse.json({ success: true });
    }

    if (action === "SAVE_ACTIVITY_RECORD") {
      const {
        studentKey,
        courseType = "bcs",
        recordType,
        mode = "solo",
        roomCode = "",
        subjectId,
        subjectTitle = "",
        lectureId = "",
        lectureNo = 1,
        lectureTitle = "",
        topicId,
        topicTitle = "",
        durationSec = 0,
        dateKey,
        mcqScore = 0,
        mcqTotal = 0,
        mcqCorrect = 0,
        mcqWrong = 0,
      } = payload;

      const todayKey = dateKey || new Date().toISOString().split("T")[0];

      if (recordType === "topic_completion") {
        const existing = await StudyActivityRecord.findOne({
          studentKey,
          courseType,
          recordType: "topic_completion",
          subjectId,
          lectureNo: Number(lectureNo || 1),
          topicId,
        });

        if (existing) {
          existing.durationSec = Math.max(
            existing.durationSec || 0,
            Number(durationSec || 0)
          );
          await existing.save();
          return NextResponse.json({ success: true, record: existing });
        }
      }

      const created = await StudyActivityRecord.create({
        studentKey,
        courseType,
        recordType,
        mode,
        roomCode,
        subjectId,
        subjectTitle,
        lectureId,
        lectureNo: Number(lectureNo || 1),
        lectureTitle,
        topicId,
        topicTitle,
        durationSec: Number(durationSec || 0),
        dateKey: todayKey,
        mcqScore: Number(mcqScore || 0),
        mcqTotal: Number(mcqTotal || 0),
        mcqCorrect: Number(mcqCorrect || 0),
        mcqWrong: Number(mcqWrong || 0),
      });

      return NextResponse.json({ success: true, record: created });
    }

    return NextResponse.json(
      { success: false, error: "Invalid Action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}