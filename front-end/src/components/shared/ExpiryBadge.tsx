import { differenceInDays } from "date-fns";

interface ExpiryBadgeProps {
  date: Date;
}

export default function ExpiryBadge({ date }: ExpiryBadgeProps) {
  const days = differenceInDays(date, new Date());

  if (days < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-destructive/10 text-destructive">
        Vencido
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-expiry-near text-warning-foreground border border-expiry-near-border">
        <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
        {days}d
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-secondary text-muted-foreground">
      {days}d
    </span>
  );
}
