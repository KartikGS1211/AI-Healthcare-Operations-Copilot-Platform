import { api } from "./api";
import type { ApiPatient } from "@/types";

export const patientService = {
  async getAll(): Promise<ApiPatient[]> {
    const { data } = await api.get<ApiPatient[]>("/patients/");
    return data;
  },

  async getById(id: number): Promise<ApiPatient> {
    const { data } = await api.get<ApiPatient>(`/patients/${id}`);
    return data;
  },

  async create(payload: {
    full_name: string;
    age: number;
    gender: string;
    phone: string;
  }): Promise<ApiPatient> {
    const { data } = await api.post<ApiPatient>("/patients/", payload);
    return data;
  },

  async getMe(): Promise<ApiPatient> {
    const { data } = await api.get<ApiPatient>("/patients/me");
    return data;
  },

  async getDashboard(): Promise<any> {
    const { data } = await api.get<any>("/patients/me/dashboard");
    return data;
  },
};

