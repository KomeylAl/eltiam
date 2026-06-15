// database.ts
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";

const dbPromise = SQLite.openDatabaseAsync("eltiam.db");
const BASE_URL = "https://soheil.ebrazclinic.ir/api";

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
      bestindex TEXT,
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

  await db.execAsync("DROP TABLE IF EXISTS safety_plan;");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS safety_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      question_one INTEGER,
      question_tow INTEGER,
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

// export async function getMeasurements(): Promise<any[]> {
//   const db = await dbPromise;
//   const result = await db.getAllAsync("SELECT * FROM safety_plan;");
//   return result;
// }

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
  bestindex: string,
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
  qOne: number,
  qTow: number,
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
    "INSERT INTO safety_plan (user_id, user_name, question_one, question_tow, thinking_feelings, self_help, others_help, close_people_list, close_friends_thoughts, phone_calls, protected_places, date, time, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      userId,
      userName,
      qOne,
      qTow,
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

const syncTables = [
  { table: "measurements", endpoint: "/measurements" },
  { table: "word_game", endpoint: "/wordgames" },
  { table: "interventions", endpoint: "/interventions" },
  { table: "social_problem", endpoint: "/socialproblems" },
  { table: "safety_plan", endpoint: "/safetyplans" },
];

export async function syncWithServer() {
  const db = await dbPromise;
  let allSynced = true;

  for (const { table, endpoint } of syncTables) {
    const unsynced = await db.getAllAsync(
      `SELECT * FROM ${table} WHERE synced = 0;`
    );

    if (unsynced.length === 0) continue;

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: unsynced }),
      });

      if (response.ok) {
        await db.runAsync(`UPDATE ${table} SET synced = 1 WHERE synced = 0;`);
      } else {
        allSynced = false;
        console.error(`Sync failed for ${table}:`, await response.json());
      }
    } catch (error) {
      allSynced = false;
      console.error(`Sync error for ${table}:`, error);
    }
  }

  Toast.show({
    type: allSynced ? "success" : "error",
    text1: allSynced ? "همگام‌سازی موفق" : "خطا در همگام‌سازی",
    text2: allSynced
      ? "همه جدول‌ها با موفقیت سینک شدند."
      : "برخی از اطلاعات سینک نشدند.",
  });
}
