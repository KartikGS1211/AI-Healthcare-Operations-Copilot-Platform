import { api } from "./api";
import type { ApiReport } from "@/types";

export const reportService = {
  async getAll(): Promise<ApiReport[]> {
    const { data } = await api.get<ApiReport[]>("/reports/");
    return data;
  },

  async getById(reportId: number): Promise<ApiReport> {
    const { data } = await api.get<ApiReport>(`/reports/${reportId}`);
    return data;
  },

  async getByPatient(patientId: number): Promise<ApiReport[]> {
    const { data } = await api.get<ApiReport[]>(
      `/reports/patient/${patientId}`,
    );
    return data;
  },

  async upload(payload: {
    patient_id: number;
    report_type: string;
    file: File;
  }): Promise<ApiReport> {
    const formData = new FormData();
    formData.append("patient_id", String(payload.patient_id));
    formData.append("report_type", payload.report_type);
    formData.append("file", payload.file);

    const { data } = await api.post<ApiReport>("/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async summarize(reportId: number): Promise<{ summary: string }> {
    const { data } = await api.post<{ summary: string }>(
      `/reports/${reportId}/summarize`,
    );
    return data;
  },
};
