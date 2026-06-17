export interface User {
  id: number;
  role: "patient" | "therapist";
  name: string;
  phone: string;
  therapist_id: number | null;
  created_at: string;
  updated_at: string;
}
