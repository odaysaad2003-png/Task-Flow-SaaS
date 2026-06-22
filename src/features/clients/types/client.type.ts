export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  createdAt: string;
}
