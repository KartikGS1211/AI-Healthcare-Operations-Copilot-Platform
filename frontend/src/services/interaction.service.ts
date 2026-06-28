import { api } from "./api";
import type { ApiInteraction } from "@/types";

export const interactionService = {
  async analyzePatient(patientId: number): Promise<ApiInteraction[]> {
    const { data } = await api.post<{ interactions: ApiInteraction[] }>(
      `/interactions/patient/${patientId}`
    );
    return data.interactions;
  },

  async getByPatient(patientId: number): Promise<ApiInteraction[]> {
    const { data } = await api.get<ApiInteraction[]>(
      `/interactions/patient/${patientId}`
    );
    return data;
  },
};

