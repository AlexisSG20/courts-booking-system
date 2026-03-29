function getRoleLabel(role) {
  if (role === "ADMIN") return "Admin";
  if (role === "STAFF") return "Staff";
  return role ?? "Sin rol";
}

export default function SessionPill({ me, loading = false, onLogout }) {
  if (loading) {
    return (
      <div className="rounded-lg sm:rounded-2xl border border-slate-200/80 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-600 w-full lg:w-auto">
        {"Cargando..."}
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3 w-full lg:w-auto">
      <div className="rounded-lg sm:rounded-2xl border border-slate-200/80 bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 flex-1 lg:flex-none">
        <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">
          {me.email}
        </p>
        <p className="mt-0.5 text-[10px] sm:text-xs text-slate-500">{getRoleLabel(me.role)}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-9 sm:h-10 lg:h-11 cursor-pointer items-center justify-center rounded-lg lg:rounded-full border border-slate-300 bg-white px-3 sm:px-5 text-xs sm:text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 w-full lg:w-auto"
      >
        Salir
      </button>
    </div>
  );
}