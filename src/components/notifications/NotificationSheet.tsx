import { FileText, AlertTriangle, Info, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { formatRelativeTime } from "@/lib/utils/timeUtils";

const typeStyles: Record<Notification["type"], { icon: React.ElementType; color: string; bg: string }> = {
  new: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  alert: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  info: { icon: Info, color: "text-muted-foreground", bg: "bg-muted" },
};

interface NotificationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationSheet({ open, onOpenChange }: NotificationSheetProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="h-auto max-h-[85vh] rounded-b-3xl px-0">
        <SheetHeader className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">
              Notifikationer
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold bg-destructive text-destructive-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Info className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Ingen notifikationer endnu</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const { icon: Icon, color, bg } = typeStyles[notification.type];
                return (
                  <button
                    key={notification.id}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    {/* Icon */}
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                      <Icon className={cn("h-5 w-5", color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm leading-tight",
                          !notification.read ? "font-semibold text-foreground" : "font-medium text-foreground"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-destructive shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <div className="px-4 py-3 border-t border-border">
            <button 
              onClick={markAllAsRead}
              className="w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Marker alle som læst
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
