import { MdWarning } from "react-icons/md";

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  isLoading, 
  confirmText = "Confirm",
  danger = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isLoading && onClose()}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-full ${danger ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
            <MdWarning className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <div className="text-slate-400 text-sm mt-1 leading-relaxed">
              {children}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="hover:cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`hover:cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
              danger 
                ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                : "bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
            }`}
          >
            {isLoading && (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}