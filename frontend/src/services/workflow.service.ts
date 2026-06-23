import { api } from "./api";
import type { WorkflowResult } from "@/types";

export const workflowService = {
  async analyze(reportId: number): Promise<WorkflowResult> {
    const { data } = await api.post<any>(
      `/workflow/analyze/${reportId}`
    );
    return {
      summary: data.summary,
      medicines: data.medicines,
      interactions: data.interactions,
      evidence: data.rag_context
        ? [{ content: data.rag_context, source: "RAG Retrieval", confidence: 0.95 }]
        : [],
    };
  },
};
