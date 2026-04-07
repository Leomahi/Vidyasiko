import { WifiOff, RefreshCw } from "lucide-react";
import { getPendingActions } from "@/lib/offlineCache";

interface Props {
  pendingCount?: number;
}

export default function OfflineBanner({ pendingCount }: Props) {
  const count = pendingCount ?? getPendingActions().length;

  return (
    <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
      <WifiOff className="w-5 h-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">You're offline</p>
        <p className="text-xs opacity-80">
          You can still play games! Progress will sync when you reconnect.
          {count > 0 && ` (${count} pending)`}
        </p>
      </div>
      <RefreshCw
        className="w-4 h-4 shrink-0 cursor-pointer hover:opacity-70"
        onClick={() => window.location.reload()}
      />
    </div>
  );
}
