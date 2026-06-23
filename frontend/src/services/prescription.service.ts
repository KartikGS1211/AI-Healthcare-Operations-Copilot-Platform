import { api } from "./api";
import type { ApiPrescription } from "@/types";

export const prescriptionService = {
  async extract(reportId: number): Promise<ApiPrescription[]> {
    const { data } = await api.post<{ medicines: ApiPrescription[] }>(
      `/prescriptions/extract/${reportId}`
    );
    return data.medicines;
  },
};
