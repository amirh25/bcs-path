/**
 * ============================================================================
 * FILE: src/app/api/group-study/route.js
 * PURPOSE: High-Speed MongoDB REST API for Group Study & Solo Study
 *          Supports User-Specific Independent Timer Pause/Resume & Auto-Cleanup
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
    isPaused: { type: Boolean, default: false },
    remainingSec: { type: Number, default: 2700 },
    lastUpdatedAtMs: { type: Number, default: Date.now },
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
    expiresAtMs: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: ["waiting", "running", "paused", "ended"],
      default: "running",
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
      enum: ["session", "topic_completion"],
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
  },
  { timestamps: true }
);

const GroupStudyRoom =
  mongoose.models.GroupStudyRoom ||
  mongoose.model("GroupStudyRoom", GroupStudyRoomSchema);

const StudyActivityRecord =
  mongoose.models.StudyActivityRecord ||
  mongoose.model("StudyActivityRecord", StudyActivityRecordSchema);

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseType = searchParams.get("courseType") || "bcs";
    const studentKey = searchParams.get("studentKey") || "";
    const roomCode = searchParams.get("roomCode") || "";
    const includeRecords = searchParams.get("includeRecords") !== "0";

    const nowMs = Date.now();

    // Fast parallel queries
    const publicRoomsPromise = GroupStudyRoom.find({
      courseType,
      status: { $ne: "ended" },
      isPrivate: false,
      $or: [
        { expiresAtMs: { $gt: nowMs } },
        { expiresAtMs: { $exists: false } },
        { expiresAtMs: 0 },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(25)
      .lean();

    let activeRoomPromise = Promise.resolve(null);
    if (roomCode) {
      activeRoomPromise = GroupStudyRoom.findOne({
        roomCode: roomCode.toUpperCase(),
        status: { $ne: "ended" },
      }).lean();
    } else if (studentKey) {
      activeRoomPromise = GroupStudyRoom.findOne({
        status: { $ne: "ended" },
        "participants.studentKey": studentKey,
      }).lean();
    }

    const recordsPromise =
      studentKey && includeRecords
        ? StudyActivityRecord.find({ studentKey, courseType })
            .sort({ createdAt: -1 })
            .limit(120)
            .lean()
        : Promise.resolve(null);

    const [publicRooms, activeRoom, records] = await Promise.all([
      publicRoomsPromise,
      activeRoomPromise,
      recordsPromise,
    ]);

    // Non-blocking cleanup of expired rooms in background
    GroupStudyRoom.deleteMany({
      $or: [
        { status: "ended" },
        { expiresAtMs: { $gt: 0, $lt: nowMs - 30 * 60 * 1000 } },
        { updatedAt: { $lt: new Date(nowMs - 8 * 60 * 60 * 1000) } },
      ],
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      serverNowMs: nowMs,
      publicRooms: publicRooms.filter((r) => (r.participants?.length || 0) > 0),
      activeRoom: activeRoom || null,
      ...(records !== null ? { records } : {}),
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
    const nowMs = Date.now();

    // 1. CREATE A NEW STUDY ROOM
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

      // Remove host from any previous room automatically
      if (hostKey) {
        await GroupStudyRoom.updateMany(
          { "participants.studentKey": hostKey },
          { $pull: { participants: { studentKey: hostKey } } }
        );
        await GroupStudyRoom.deleteMany({ participants: { $size: 0 } });
      }

      const randomCode =
        "GS" +
        Math.random().toString(36).substring(2, 6).toUpperCase() +
        String(nowMs).slice(-2);

      const duration = Math.max(300, Number(scheduledDurationSec) || 2700);
      const cleanTopic = (topicTitle || "").trim() || subjectTitle || "সাধারণ অধ্যায়";

      const newRoom = await GroupStudyRoom.create({
        roomCode: randomCode,
        roomName: roomName?.trim() || `${subjectTitle} — ${cleanTopic}`,
        courseType,
        subjectId,
        subjectTitle,
        lectureId,
        lectureNo: Number(lectureNo || 1),
        lectureTitle,
        topicId: topicId || `custom_${nowMs}`,
        topicTitle: cleanTopic,
        hostKey,
        hostName: hostName || "শিক্ষার্থী",
        isPrivate: Boolean(isPrivate),
        maxParticipants: Number(maxParticipants || 10),
        scheduledDurationSec: duration,
        expiresAtMs: nowMs + duration * 1000 + 2 * 60 * 60 * 1000,
        status: "running",
        participants: [
          {
            studentKey: hostKey,
            name: hostName || "শিক্ষার্থী",
            avatarUrl,
            institution,
            isHost: true,
            isPaused: false,
            remainingSec: duration,
            lastUpdatedAtMs: nowMs,
          },
        ],
      });

      return NextResponse.json({
        success: true,
        serverNowMs: nowMs,
        room: newRoom.toObject(),
      });
    }

    // 2. JOIN A STUDY ROOM (Auto-leaves previous room if any)
    if (action === "JOIN_ROOM") {
      const {
        roomCode,
        studentKey,
        name,
        avatarUrl = "",
        institution = "",
        previousRoomCode = "",
      } = payload;

      const targetCode = (roomCode || "").trim().toUpperCase();

      // Leave previous room if switching rooms
      if (previousRoomCode && previousRoomCode.toUpperCase() !== targetCode) {
        await GroupStudyRoom.updateOne(
          { roomCode: previousRoomCode.toUpperCase() },
          { $pull: { participants: { studentKey } } }
        );
        await GroupStudyRoom.deleteMany({ participants: { $size: 0 } });
      }

      const room = await GroupStudyRoom.findOne({
        roomCode: targetCode,
        status: { $ne: "ended" },
      });

      if (!room) {
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
          isPaused: false,
          remainingSec: room.scheduledDurationSec || 2700,
          lastUpdatedAtMs: nowMs,
        });
      } else {
        room.participants[existingIdx].name =
          name || room.participants[existingIdx].name;
        room.participants[existingIdx].avatarUrl =
          avatarUrl || room.participants[existingIdx].avatarUrl;
      }

      await room.save();
      return NextResponse.json({
        success: true,
        serverNowMs: nowMs,
        room: room.toObject(),
      });
    }

    // 3. USER-SPECIFIC INDEPENDENT PAUSE / RESUME / SYNC
    if (action === "SYNC_USER_TIMER") {
      const { roomCode, studentKey, isPaused, remainingSec } = payload;
      const room = await GroupStudyRoom.findOneAndUpdate(
        {
          roomCode: (roomCode || "").toUpperCase(),
          "participants.studentKey": studentKey,
        },
        {
          $set: {
            "participants.$.isPaused": Boolean(isPaused),
            "participants.$.remainingSec": Math.max(0, Number(remainingSec || 0)),
            "participants.$.lastUpdatedAtMs": nowMs,
          },
        },
        { new: true }
      ).lean();

      return NextResponse.json({
        success: true,
        serverNowMs: nowMs,
        room: room || null,
      });
    }

    // 4. LEAVE ROOM OR END SESSION FOR USER
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

    // 5. SAVE STUDY ACTIVITY RECORD
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
      } = payload;

      const todayKey = dateKey || new Date().toISOString().split("T")[0];

      if (recordType === "topic_completion") {
        const existing = await StudyActivityRecord.findOne({
          studentKey,
          courseType,
          recordType: "topic_completion",
          subjectId,
          lectureNo: Number(lectureNo || 1),
          topicTitle: topicTitle.trim(),
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
        topicId: topicId || `top_${nowMs}`,
        topicTitle: topicTitle.trim(),
        durationSec: Number(durationSec || 0),
        dateKey: todayKey,
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