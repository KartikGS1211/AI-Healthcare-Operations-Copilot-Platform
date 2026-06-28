import { api } from "./api";
import type { WorkflowResult } from "@/types";

export const workflowService = {
  async analyze(reportId: number): Promise<WorkflowResult> {
    const { data } = await api.post<any>(
      `/workflow/analyze/${reportId}`,
      {},
      { responseType: "text" }
    );

    let resultPayload: any = null;

    if (typeof data === "string") {
      if (data.includes("data:")) {
        const lines = data.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.result) {
                resultPayload = parsed.result;
                break;
              }
            } catch (e) {
              // ignore partial line parsing errors
            }
          }
        }
      } else {
        try {
          resultPayload = JSON.parse(data);
        } catch (e) {
          // ignore
        }
      }
    } else if (typeof data === "object" && data !== null) {
      resultPayload = data.result || data;
    }

    if (!resultPayload) {
      throw new Error("Workflow result payload could not be parsed.");
    }

    return {
      summary: resultPayload.summary,
      medicines: resultPayload.medicines,
      interactions: resultPayload.interactions,
      evidence: resultPayload.rag_context
        ? [{ content: resultPayload.rag_context, source: "RAG Retrieval", confidence: 0.95 }]
        : [],
    };
  },
};

