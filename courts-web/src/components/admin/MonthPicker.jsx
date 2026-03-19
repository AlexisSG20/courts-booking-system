import { useEffect, useRef, useState } from "react";

const MONTHS = [
  { value: "01", label: "Ene", full: "Enero" },
  { value: "02", label: "Feb", full: "Febrero" },
  { value: "03", label: "Mar", full: "Marzo" },
  { value: "04", label: "Abr", full: "Abril" },
  { value: "05", label: "May", full: "Mayo" },
  { value: "06", label: "Jun", full: "Junio" },
  { value: "07", label: "Jul", full: "Julio" },
  { value: "08", label: "Ago", full: "Agosto" },
  { value: "09", label: "Sep", full: "Septiembre" },
  { value: "10", label: "Oct", full: "Octubre" },
  { value: "11", label: "Nov", full: "Noviembre" },
  { value: "12", label: "Dic", full: "Diciembre" },
];

export default function MonthPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (value) {
      const [y] = value.split("-");
      return parseInt(y, 10);
    }
    return new Date().getFullYear();
  });

  const containerRef = useRef(null);

  const selectedYear = value ? parseInt(value.split("-")[0], 10) : null;
  const selectedMonth = value ? value.split("-")[1] : null;

  const displayText = value
    ? `${MONTHS.find((m) => m.value === selectedMonth)?.full || ""} ${selectedYear}`
    : "Seleccionar mes";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (value) {
      const [y] = value.split("-");
      setViewYear(parseInt(y, 10));
    }
  }, [value]);

  const handleMonthSelect = (monthValue) => {
    const newValue = `${viewYear}-${monthValue}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const prevYear = () => setViewYear((y) => y - 1);
  const nextYear = () => setViewYear((y) => y + 1);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-full cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-[15px] text-white outline-none transition hover:border-white/20 focus:border-cyan-400/40"
      >
        <span className={value ? "text-white" : "text-slate-400"}>
          {displayText}
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-[100] mt-2 w-64 rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={prevYear}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/[0.09] hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-white">{viewYear}</span>
            <button
              type="button"
              onClick={nextYear}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/[0.09] hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month) => {
              const isSelected =
                selectedYear === viewYear && selectedMonth === month.value;

              return (
                <button
                  key={month.value}
                  type="button"
                  onClick={() => handleMonthSelect(month.value)}
                  className={`cursor-pointer rounded-xl py-2.5 text-center text-sm font-medium transition ${
                    isSelected
                      ? "border border-cyan-400/30 bg-cyan-500/20 text-cyan-100"
                      : "text-slate-300 hover:bg-white/[0.09] hover:text-white"
                  }`}
                >
                  {month.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
