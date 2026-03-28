function getRoleLabel(role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "STAFF") return "Staff";
  return role ?? "Sin rol";
}

export default function SessionPill({ me, loading = false, onLogout }) {
  if (loading) {
    return (
      <div className="hidden rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-600 lg:block">
        {"Cargando sesión..."}
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5">
        <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
          {me.email}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{getRoleLabel(me.role)}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
      >
        Salir
      </button>
    </div>
  );
}