# التیام (Eltiam)

اپ موبایل Expo/React Native برای **بیمار**: سنجش روزانه ریسک خودکشی، مداخله CBT، و برنامه ایمنی.

بک‌اند فعلی: `https://soheil.ebrazclinic.ir/api` — احراز هویت با Laravel Sanctum (`access_token` + Bearer).

**نکته:** در این ریپو UI برای تراپیست وجود ندارد. تراپیست باید از **داشبورد Laravel** (وب) داده‌های sync شده را ببیند.

---

## نمای کلی جریان داده

```
ثبت‌نام / ورود → توکن در SecureStore → فرم‌ها در SQLite محلی → همگام‌سازی POST (batch) → Laravel API → داشبورد تراپیست
```

اپ **offline-first** است: داده‌ها ابتدا در SQLite ذخیره می‌شوند و بعد به سرور ارسال می‌شوند.

---

## احراز هویت (Auth)

### `POST /api/login` — ورود

**Request:**

```json
{
  "phone": "09123456789",
  "password": "password123"
}
```

**Response موفق (200):**

```json
{
  "access_token": "1|xxxxxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "phone": "09123456789",
    "name": "علی رضایی",
    "national_code": "1234567890",
    "created_at": "2025-06-01T10:00:00.000000Z"
  }
}
```

**خطا:** `401` — نام کاربری یا رمز اشتباه

---

### `POST /api/register` — ثبت‌نام

**Request:**

```json
{
  "phone": "09123456789",
  "password": "password123",
  "national_code": "1234567890",
  "name": "علی رضایی"
}
```

**Response موفق (201):** همان ساختار login (`access_token` + `user`)

فیلد `pass_confirm` فقط در اپ برای اعتبارسنجی است و **به سرور ارسال نمی‌شود**.

---

### `GET /api/me` — اطلاعات کاربر فعلی

**Headers:**

```
Authorization: Bearer {access_token}
Accept: application/json
```

**Response:**

```json
{
  "id": 1,
  "phone": "09123456789",
  "name": "علی رضایی",
  "national_code": "1234567890",
  "created_at": "2025-06-01T10:00:00.000000Z"
}
```

---

## سوالات مشترک (سنجش و مداخله)

هر دو تب **۳ سوال یکسان** با **۵ گزینه Likert** دارند:

| `q_number` | سوال |
|---|---|
| `0` | آیا احساس می‌کردید باری بر دوش دیگرانید؟ |
| `1` | آیا احساس می‌کردید به هیچ چیز تعلق ندارید؟ |
| `2` | آیا می‌خواستید خودکشی کنید؟ |

| `a_number` | معنی |
|---|---|
| `0` | اصلا |
| `1` | خیلی کم |
| `2` | تا حدی |
| `3` | زیاد |
| `4` | خیلی زیاد |

**زمان فعال بودن فرم:** 08–10، 11–12، 12–13، 14–15

**پاسخ ۳ یا ۴:**

- در **سنجش** → مودال تماس اضطراری (123، 1480)
- در **مداخله** → فرم‌های جانبی (بخش مداخله‌های جانبی)

هر پاسخ **یک رکورد جدا** در SQLite ذخیره می‌شود (نه یک فرم واحد).

---

## همگام‌سازی با سرور (Sync)

همه endpointها **POST** با body `{ "data": [ ... ] }` — آرایه رکوردهای `synced = 0`.

**همگام‌سازی:** هنگام باز شدن اپ (اگر token در state باشد) + دستی از تنظیمات.

**⚠️ مشکل فعلی:** sync **بدون** `Authorization` header ارسال می‌شود — در Laravel باید اضافه شود.

**Response موفق:** `200 OK` → اپ همه رکوردهای آن جدول را `synced = 1` می‌کند.

---

### `POST /api/measurements` — سنجش روزانه

**Request:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "علی رضایی",
      "date": "2025-06-16",
      "time": "9:30",
      "q_number": 0,
      "a_number": 2,
      "synced": 0
    },
    {
      "id": 2,
      "user_id": 1,
      "user_name": "علی رضایی",
      "date": "2025-06-16",
      "time": "9:31",
      "q_number": 2,
      "a_number": 4,
      "synced": 0
    }
  ]
}
```

**معنی برای تراپیست:** روند روزانه ریسک؛ `q_number = 2` و `a_number ≥ 3` = هشدار خودکشی.

---

### `POST /api/interventions` — مداخله

ساختار JSON عین `measurements` — تفاوت در منبع (تب مداخله) و triggerهای بعدی.

```json
{
  "data": [
    {
      "id": 5,
      "user_id": 1,
      "user_name": "علی رضایی",
      "date": "2025-06-16",
      "time": "11:15",
      "q_number": 0,
      "a_number": 4,
      "synced": 0
    }
  ]
}
```

| پاسخ بالا روی سوال | مداخله بعدی |
|---|---|
| `q_number = 0` و `a_number ≥ 3` | فرم حل مسئله اجتماعی |
| `q_number = 1` و `a_number ≥ 3` | بازی کلمات مثبت |
| `q_number = 2` و `a_number ≥ 3` | برنامه ایمنی (ThirdForm) |

---

### `POST /api/socialproblems` — حل مسئله اجتماعی

**Request:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "علی رضایی",
      "problem": "فکر می‌کنم برای خانواده‌ام سربار هستم",
      "reason": "نمی‌توانم کار پیدا کنم و هزینه‌ها زیاد است",
      "solutions": "جستجوی کار موقت, صحبت با دوست, مراجعه به مشاور",
      "evaluations": "نقاط قوت راه حل 1 : سریع - نقاط ضعف راه حل 1 : موقت, نقاط قوت راه حل 2 : رایگان - نقاط ضعف راه حل 2 : دوست ممکن است ناراحت شود",
      "bestindex": "مراجعه به مشاور",
      "plan": "هفته آینده با کلینیک تماس می‌گیرم و وقت می‌گیرم",
      "date": "2025-06-16",
      "time": "11:20",
      "synced": 0
    }
  ]
}
```

| فیلد | توضیح |
|---|---|
| `solutions` | راه‌حل‌ها با `, ` جدا شده |
| `evaluations` | نقاط قوت/ضعف هر راه‌حل، با `, ` جدا |
| `bestindex` | **متن** راه‌حل انتخابی (نه index عددی) |

---

### `POST /api/wordgames` — بازی کلمات مثبت

**Request:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "علی رضایی",
      "point": "85",
      "date": "2025-06-16",
      "time": "12:5",
      "synced": 0
    }
  ]
}
```

**محاسبه امتیاز:** `+10` کلمه مثبت، `-5` کلمه منفی، در پایان `+ timeLeft` (ثانیه باقی‌مانده از 59). فیلد `point` در DB به صورت TEXT ذخیره می‌شود.

---

### `POST /api/safetyplans` — برنامه ایمنی (بحران)

**Request:**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "علی رضایی",
      "question_one": 1,
      "question_tow": 1,
      "thinking_feelings": "احساس خستگی، افکار مداوم خودکشی، بی‌خوابی",
      "self_help": "پیاده‌روی، موسیقی آرام، تنفس عمیق",
      "others_help": "مادرم، دوستم سارا، پارک نزد خانه",
      "close_people_list": "مادر - 0912xxx, سارا - 0935xxx",
      "close_friends_thoughts": "به دوستم می‌گویم که نگرانم و کمک می‌خواهم",
      "phone_calls": "اورژانس 115، خط ملی 1480",
      "protected_places": "خانه مادر، بیمارستان نزدیک",
      "date": "2025-06-16",
      "time": "14:30",
      "synced": 0
    }
  ]
}
```

| فیلد | معنی |
|---|---|
| `question_one` | `1` = لوازم خطرناک دور هستند |
| `question_tow` | `1` = بعد از بحران به روانشناس مراجعه می‌کنم |
| `thinking_feelings` | علائم هشداردهنده |
| `self_help` | راهکارهای خودیاری |
| `others_help` | افراد/مکان‌های حمایتی |
| `close_people_list` | افراد معتمد (با شماره) |
| `close_friends_thoughts` | آنچه به دوست می‌گوید |
| `phone_calls` | تماس‌های اضطراری |
| `protected_places` | مکان‌های امن |

---

## فرم اولیه (SecureForm) — فعلاً به سرور نمی‌رود

فرم ۷ مرحله‌ای «برنامه ایمنی» در **اولین ورود** یا از **تنظیمات** پر می‌شود و فقط در **SecureStore** ذخیره می‌شود:

```json
{
  "thinking_feelings": "...",
  "self_help": "...",
  "others_help": "...",
  "close_people_list": "...",
  "close_friends_thoughts": "...",
  "phone_calls": "...",
  "protected_places": "..."
}
```

**تا وقتی بیمار در مداخله سوال ۲ را بالا جواب دهد و ThirdForm ثبت کند، تراپیست این داده را نمی‌بیند.**

برای Laravel پیشنهاد: endpoint جدا مثل `POST /api/user-setup` یا sync همین فیلدها هنگام تکمیل SecureForm.

---

## آنچه تراپیست باید ببیند (در Laravel — هنوز در اپ نیست)

اپ فقط **POST** می‌زند؛ برای داشبورد تراپیست باید **GET** بسازید:

| Endpoint پیشنهادی | محتوا |
|---|---|
| `GET /api/therapist/patients` | لیست بیماران |
| `GET /api/patients/{id}/measurements` | تاریخچه سنجش |
| `GET /api/patients/{id}/interventions` | تاریخچه مداخله |
| `GET /api/patients/{id}/safetyplans` | برنامه‌های ایمنی |
| `GET /api/patients/{id}/socialproblems` | حل مسئله اجتماعی |
| `GET /api/patients/{id}/wordgames` | امتیاز بازی |
| `GET /api/alerts` | رکوردهای `q_number = 2` و `a_number ≥ 3` |

فیلد `role` (`patient` / `therapist`) و ارتباط بیمار–تراپیست در اپ فعلی وجود ندارد و باید در Laravel تعریف شود.

---

## خلاصه Routeها

| Method | Route | Body | Auth |
|---|---|---|---|
| POST | `/api/login` | `phone`, `password` | نه |
| POST | `/api/register` | `phone`, `password`, `national_code`, `name` | نه |
| GET | `/api/me` | — | Bearer |
| POST | `/api/measurements` | `{ data: [...] }` | **باید اضافه شود** |
| POST | `/api/interventions` | `{ data: [...] }` | **باید اضافه شود** |
| POST | `/api/socialproblems` | `{ data: [...] }` | **باید اضافه شود** |
| POST | `/api/wordgames` | `{ data: [...] }` | **باید اضافه شود** |
| POST | `/api/safetyplans` | `{ data: [...] }` | **باید اضافه شود** |

---

## ساختار SQLite محلی

### `measurements` / `interventions`

```
id, user_id, user_name, date, time, q_number, a_number, synced
```

### `social_problem`

```
id, user_id, user_name, problem, reason, solutions, evaluations, bestindex, plan, date, time, synced
```

### `word_game`

```
id, user_id, user_name, point, date, time, synced
```

### `safety_plan`

```
id, user_id, user_name, question_one, question_tow,
thinking_feelings, self_help, others_help, close_people_list,
close_friends_thoughts, phone_calls, protected_places, date, time, synced
```

---

## صفحات اپ

| Route | توضیح |
|---|---|
| `/auth` | ورود / ثبت‌نام |
| `/(tabs)/measurement` | سنجش روزانه + فرم اولیه |
| `/(tabs)/intervention` | مداخله |
| `/(tabs)/settings` | ویرایش فرم اولیه + sync دستی |
| `/(tabs)/profile` | پروفایل + خروج |

---

## نکات مهم برای پیاده‌سازی Laravel

1. **Sanctum** برای `access_token` و middleware `auth:sanctum` روی sync و GETها.
2. **فرم اولیه** الان sync نمی‌شود — یا endpoint جدید یا تغییر اپ.
3. **Auth guard** در اپ comment شده — برای production فعال شود.
4. **`user_id` در sync** از state اپ می‌آید؛ بهتر است در Laravel از `auth()->id()` استفاده شود و `user_id` از client نادیده گرفته شود.
5. **`id` محلی SQLite** با id سرور متفاوت است — در Laravel `id` خودتان بدهید یا `local_id` نگه دارید.
6. **تاریخ** به صورت `YYYY-MM-DD` (میلادی ISO) و **time** به صورت `H:MM` ذخیره می‌شود.

---

## فایل‌های کلیدی

| فایل | نقش |
|---|---|
| `stores/useAuthStore.ts` | احراز هویت و API login/register/me |
| `utils/db.ts` | SQLite + sync با سرور |
| `stores/formStore.ts` | فرم اولیه (SecureStore) |
| `utils/constants.ts` | سوالات و تاریخ‌های جلالی |
| `components/Form.tsx` | فرم سنجش |
| `components/InterventionForm.tsx` | فرم مداخله |
| `components/SecureForm.tsx` | فرم اولیه ۷ مرحله‌ای |
| `components/StepperForm.tsx` | حل مسئله اجتماعی |
| `components/ThirdForm.tsx` | برنامه ایمنی بحران |
| `components/WordGame.tsx` | بازی کلمات مثبت |

---

## Stack

Expo 56, React Native, Expo Router, Zustand, Axios, SQLite, SecureStore, NativeWind/Tailwind, Jalali dates (`jalaali-js`), Persian Vazir fonts.
