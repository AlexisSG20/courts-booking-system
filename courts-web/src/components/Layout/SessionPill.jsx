function getRoleLabel(role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "STAFF") return "Staff";
  return role ?? "Sin rol";
}

export default function SessionPill({ me, loading = false, onLogout }) {
  if (loading) {
    return (
      <div className="inline-flex h-10 items-center rounded-2xl border border-slate-200/80 bg-white px-4 text-sm text-slate-600">
        {"Cargando sesi\u00f3n..."}
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 min-w-[180px] flex-col justify-center rounded-2xl border border-slate-200/80 bg-white px-4">
        <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
          {me.email}
        </p>
        <p className="truncate text-xs leading-tight text-slate-500">
          {getRoleLabel(me.role)}
        </p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-[18px] text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
      >
        Salir
      </button>
    </div>
  );
}
