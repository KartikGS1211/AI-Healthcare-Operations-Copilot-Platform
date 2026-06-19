import { Building2, Stethoscope, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types";

const categoryConfig = {
  diagnosis: { icon: Stethoscope, color: "bg-primary" },
  treatment: { icon: Syringe, color: "bg-accent" },
  visit: { icon: Building2, color: "bg-[var(--warning)]" },
};

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative space-y-0">
      {events.map((event, index) => {
        const config = categoryConfig[event.category];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4 pb-8">
            {!isLast && (
              <div className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-px bg-border" />
            )}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
                config.color
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-medium text-muted-foreground">{event.date}</p>
              <h4 className="mt-0.5 font-semibold">{event.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
