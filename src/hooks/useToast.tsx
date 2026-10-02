/* ─────────────────────────────────────────────────────────────────────────
   VeriDeck – Toast notification system
   ───────────────────────────────────────────────────────────────────────── */
import React, { createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  exiting?: boolean;
}

interface ToastCtx {
  toast: (kind: ToastKind, message: string) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  }, []);

  const toast = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const iconMap: Record<ToastKind, React.ReactNode> = {
    success: <CheckCircle size={16} className="text-pass shrink-0" />,
    error:   <XCircle size={16} className="text-fail shrink-0" />,
    warning: <AlertTriangle size={16} className="text-warn shrink-0" />,
    info:    <Info size={16} className="text-info shrink-0" />,
  };

  const borderMap: Record<ToastKind, string> = {
    success: 'border-pass/40',
    error:   'border-fail/40',
    warning: 'border-warn/40',
    info:    'border-info/40',
  };

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      {/* Toast stack */}
      <div className="fixed top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded border
              bg-bg-elevated ${borderMap[t.kind]}
              text-sm text-text-primary shadow-lg shadow-black/40
              ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
          >
            {iconMap[t.kind]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-text-muted hover:text-text-primary ml-2">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
