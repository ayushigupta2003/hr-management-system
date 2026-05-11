import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { markRead, markAllRead, removeNotification, clearAll } from '../../features/notifications/notificationsSlice';
import clsx from 'clsx';

const TYPE_STYLES = {
  success: { icon: CheckCircle2, cls: 'text-emerald-500 bg-emerald-50' },
  warning: { icon: AlertTriangle, cls: 'text-amber-500 bg-amber-50'   },
  error:   { icon: XCircle,       cls: 'text-red-500 bg-red-50'       },
  info:    { icon: Info,           cls: 'text-brand-500 bg-brand-50'   },
};

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NotificationBell() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unread = items.filter((i) => !i.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-ink transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-soft z-50 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-ink">
              Notifications {unread > 0 && <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">{unread}</span>}
            </h3>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button onClick={() => dispatch(markAllRead())} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 transition-colors" title="Mark all read">
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              {items.length > 0 && (
                <button onClick={() => dispatch(clearAll())} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Clear all">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="h-8 w-8 text-slate-200 mb-2" />
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              items.map((n) => {
                const { icon: Icon, cls } = TYPE_STYLES[n.type] ?? TYPE_STYLES.info;
                return (
                  <div
                    key={n.id}
                    onClick={() => dispatch(markRead(n.id))}
                    className={clsx(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50',
                      !n.read && 'bg-brand-50/40'
                    )}
                  >
                    <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${cls}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold ${n.read ? 'text-slate-600' : 'text-ink'}`}>{n.title}</p>
                      {n.message && <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{n.message}</p>}
                      <p className="mt-1 text-[10px] text-slate-300">{timeAgo(n.time)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); dispatch(removeNotification(n.id)); }}
                      className="shrink-0 rounded p-0.5 text-slate-300 hover:text-slate-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
