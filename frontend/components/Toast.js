import { MdCheckCircle, MdError, MdClose } from "react-icons/md";

export default function Toast({ message, type = "success", onClose }) {
  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
          isSuccess
            ? "bg-slate-900 border-green-500/30 text-green-400"
            : "bg-slate-900 border-red-500/30 text-red-400"
        }`}
      >
        {isSuccess ? <MdCheckCircle className="text-xl" /> : <MdError className="text-xl" />}
        <span className="text-sm font-medium text-slate-200">{message}</span>
        <button onClick={onClose} className="ml-2 hover:text-white transition-colors">
          <MdClose />
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}