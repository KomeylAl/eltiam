import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";
import { api, getStoredToken } from "@/lib/api";

const dbPromise = SQLite.openDatabaseAsync("eltiam.db");

type SyncRow = Record<string, unknown>;

type SyncPayload = Record<string, string | number>;

const syncTables: {
  table: string;
  endpoint: string;
  mapRow: (row: SyncRow) => SyncPayload;
}[] = [
  {
    table: "measurements",
    endpoint: "/measurements/sync",
    mapRow: (row: SyncRow): SyncPayload => ({
      date: String(row.date),
      time: String(row.time),
      q_number: Number(row.q_number),
      a_number: Number(row.a_number),
    }),
  },
  {
    table: "interventions",
    endpoint: "/interventions/sync",
    mapRow: (row: SyncRow): SyncPayload => ({
      date: String(row.date),
      time: String(row.time),
      q_number: Number(row.q_number),
      a_number: Number(row.a_number),
    }),
  },
  {
    table: "social_problem",
    endpoint: "/social-problems/sync",
    mapRow: (row: SyncRow): SyncPayload => ({
      problem: String(row.problem),
      reason: String(row.reason ?? ""),
      solutions: String(row.solutions ?? ""),
      evaluations: String(row.evaluations ?? ""),
      bestindex: parseBestIndex(row.bestindex),
      plan: String(row.plan ?? ""),
      date: String(row.date),
      time: String(row.time),
    }),
  },
  {
    table: "word_game",
    endpoint: "/word-games/sync",
    mapRow: (row: SyncRow): SyncPayload => ({
      point: parseInt(String(row.point), 10) || 0,
      date: String(row.date),
      time: String(row.time),
    }),
  },
  {
    table: "safety_plan",
    endpoint: "/safety-plans/sync",
    mapRow: (row: SyncRow): SyncPayload => ({
      question_one: String(row.question_one ?? ""),
      question_two: String(row.question_two ?? row.question_tow ?? ""),
      thinking_feelings: String(row.thinking_feelings ?? ""),
      self_help: String(row.self_help ?? ""),
      others_help: String(row.others_help ?? ""),
      close_people_list: String(row.close_people_list ?? ""),
      close_friends_thoughts: String(row.close_friends_thoughts ?? ""),
      phone_calls: String(row.phone_calls ?? ""),
      protected_places: String(row.protected_places ?? ""),
      date: String(row.date),
      time: String(row.time),
    }),
  },
];

function parseBestIndex(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function initializeDatabase() {
  const db = await dbPromise;
  await db.execAsync(`
     CREATE TABLE IF NOT EXISTS measurements (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       user_id INTEGER,
       user_name TEXT,
       date TEXT,
       time TEXT,
       q_number INTEGER,
       a_number INTEGER,
       synced INTEGER
     );
   `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS interventions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
       user_id INTEGER,
       user_name TEXT,
       date TEXT,
       time TEXT,
       q_number INTEGER,
       a_number INTEGER,
       synced INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS social_problem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      problem TEXT,
      reason TEXT,
      solutions TEXT,
      evaluations TEXT,
      bestindex INTEGER,
      plan TEXT,
      date TEXT,
      time TEXT,
      synced INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS word_game (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      point TEXT,
      date TEXT,
      time TEXT,
      synced INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS safety_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      question_one TEXT,
      question_two TEXT,
      thinking_feelings TEXT,
      self_help TEXT,
      others_help TEXT,
      close_people_list TEXT,
      close_friends_thoughts TEXT,
      phone_calls TEXT,
      protected_places TEXT,
      date TEXT,
      time TEXT,
      synced INTEGER
    );
  `);
}

export async function insertMeasurement(
  date: string,
  time: string,
  userId: number,
  userName: string,
  qNumber: number,
  aNumber: number
) {
  const db = await dbPromise;
  await db.runAsync(
    "INSERT INTO measurements (user_id, user_name, q_number, a_number, date, time, synced) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [userId, userName, qNumber, aNumber, date, time, 0]
  );
}

export async function insertIntervention(
  date: string,
  time: string,
  userId: number,
  userName: string,
  qNumber: number,
  aNumber: number
) {
  const db = await dbPromise;
  await db.runAsync(
    "INSERT INTO interventions (user_id, user_name, q_number, a_number, date, time, synced) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [userId, userName, qNumber, aNumber, date, time, 0]
  );
}

export async function insertSocialProblem(
  date: string,
  time: string,
  userId: number,
  userName: string,
  problem: string,
  reason: string,
  solutions: string,
  evaluations: string,
  bestindex: number,
  plan: string
) {
  const db = await dbPromise;
  await db.runAsync(
    "INSERT INTO social_problem (user_id, user_name, problem, reason, solutions, evaluations, bestindex, plan, date, time, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      userId,
      userName,
      problem,
      reason,
      solutions,
      evaluations,
      bestindex,
      plan,
      date,
      time,
      0,
    ]
  );
}

export async function insertWordGame(
  date: string,
  time: string,
  userId: number,
  userName: string,
  point: number
) {
  const db = await dbPromise;
  await db.runAsync(
    "INSERT INTO word_game (user_id, user_name, date, time, point, synced) VALUES (?, ?, ?, ?, ?, ?);",
    [userId, userName, date, time, point, 0]
  );
}

export async function insertSafteyPlan(
  date: string,
  time: string,
  userId: number,
  userName: string,
  questionOne: string,
  questionTwo: string,
  thinkingFeelings: string,
  selfHelp: string,
  othersHelp: string,
  closePeopleList: string,
  friendThoughts: string,
  phoneCalls: string,
  protectedPlaces: string
) {
  const db = await dbPromise;
  await db.runAsync(
    "INSERT INTO safety_plan (user_id, user_name, question_one, question_two, thinking_feelings, self_help, others_help, close_people_list, close_friends_thoughts, phone_calls, protected_places, date, time, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      userId,
      userName,
      questionOne,
      questionTwo,
      thinkingFeelings,
      selfHelp,
      othersHelp,
      closePeopleList,
      friendThoughts,
      phoneCalls,
      protectedPlaces,
      date,
      time,
      0,
    ]
  );
}

export async function syncWithServer(options?: { showToast?: boolean }): Promise<boolean> {
  const showToast = options?.showToast ?? false;
  const token = await getStoredToken();

  if (!token) {
    if (showToast) {
      Toast.show({
        type: "error",
        text1: "خطا در همگام‌سازی",
        text2: "لطفاً ابتدا وارد حساب کاربری شوید.",
      });
    }
    return false;
  }

  const db = await dbPromise;
  let allSynced = true;
  let hadRecords = false;

  for (const { table, endpoint, mapRow } of syncTables) {
    const unsynced = (await db.getAllAsync(
      `SELECT * FROM ${table} WHERE synced = 0;`
    )) as SyncRow[];

    if (unsynced.length === 0) continue;

    hadRecords = true;
    const payload = unsynced.map(mapRow);
    const ids = unsynced.map((row) => row.id as number);

    try {
      const response = await api.post(endpoint, { data: payload });

      if (response.data?.success) {
        const placeholders = ids.map(() => "?").join(",");
        await db.runAsync(
          `UPDATE ${table} SET synced = 1 WHERE id IN (${placeholders});`,
          ids
        );
      } else {
        allSynced = false;
        console.error(`Sync failed for ${table}:`, response.data);
      }
    } catch (error) {
      allSynced = false;
      console.error(`Sync error for ${table}:`, error);
    }
  }

  if (showToast && hadRecords) {
    Toast.show({
      type: allSynced ? "success" : "error",
      text1: allSynced ? "همگام‌سازی موفق" : "خطا در همگام‌سازی",
      text2: allSynced
        ? "همه اطلاعات با موفقیت به سرور ارسال شدند."
        : "برخی از اطلاعات ارسال نشدند. دوباره تلاش کنید.",
    });
  }

  return allSynced;
}
