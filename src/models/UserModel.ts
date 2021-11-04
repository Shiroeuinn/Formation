export interface UserModel {
  login: string;
  password: string;
  birthYear: number;
  money?: number;
  token?: string;
}
