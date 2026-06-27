import { useState, useCallback, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export interface AgentStep {
  step: string;
  status: "running" | "done";
}

export function useAgentStream() {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const runAnalysis = useCallback((reportId: number) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setSteps([]);
    setResult(null);
    setIsLoading(true);

    const token = useAuthStore.getState().token;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    const url = `${backendUrl}/api/workflow/analyze/${reportId}?token=${encodeURIComponent(token ?? "")}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.result) {
          setResult(data.result);
          setIsLoading(false);
          eventSource.close();
          eventSourceRef.current = null;
        } else if (data.step && data.status) {
          setSteps((prevSteps) => {
            const index = prevSteps.findIndex((s) => s.step === data.step);
            if (index !== -1) {
              const nextSteps = [...prevSteps];
              nextSteps[index] = { step: data.step, status: data.status };
              return nextSteps;
            } else {
              return [...prevSteps, { step: data.step, status: data.status }];
            }
          });
        }
      } catch (err) {
        console.error("Failed to parse SSE event", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error", err);
      setIsLoading(false);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return { steps, result, isLoading, runAnalysis };
}
