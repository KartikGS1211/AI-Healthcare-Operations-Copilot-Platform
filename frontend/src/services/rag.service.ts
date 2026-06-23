import { api } from "./api";
import type { RagSearchResult } from "@/types";

export const ragService = {
  async search(query: string): Promise<RagSearchResult[]> {
    const { data } = await api.post<{ query: string; retrieved_context: string }>(
      `/rag/search?query=${encodeURIComponent(query)}`
    );
    if (!data.retrieved_context) return [];
    return data.retrieved_context
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => ({
        content: line,
        source: "ChromaDB Knowledge Base",
        confidence: 0.95,
      }));
  },
};
