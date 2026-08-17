import http from "./http";

export type RoleLevel = "ADMIN" | "USER" | "EDITOR";
export type AccountStatus = "ON" | "OFF";

export interface CreateAccountRequest {
  name: string;
  email: string;
  roleLevel: RoleLevel;
  status: AccountStatus;
}

// 新增帳號
export const createAccount = async (data: CreateAccountRequest) => {
  const response = await http.post("/create-account", data);

  return response.data;
};

// 取得帳號列表
export const getAccounts = async (params?: {
  name?: string;
  email?: string;
}) => {
  const response = await http.get("/accounts", {
    params,
  });

  return response.data;
};
