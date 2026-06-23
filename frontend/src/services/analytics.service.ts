import { api } from "./api";
import type { AnalyticsOverview, ApiReport, TopMedicine } from "@/types";

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const { data } = await api.get<AnalyticsOverview>("/analytics/overview");
    return data;
  },

  async getTopMedicines(): Promise<TopMedicine[]> {
    const { data } = await api.get<TopMedicine[]>("/analytics/top-medicines");
    return data;
  },

  async getRecentReports(): Promise<ApiReport[]> {
    const { data } = await api.get<ApiReport[]>("/analytics/recent-reports");
    return data;
  },
};
