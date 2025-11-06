export type IRole = "admin" | "seller" | "moderator" | null;

export interface IProfile {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  telegramId: string;
  role: IRole;
}
