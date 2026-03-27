function getRoleLabel(role) {
  if (role === "ADMIN") return "Administrador";
  if (role === "STAFF") return "Staff";
  return role ?? "Sin rol";
}

export default function SessionPill({ me, loading = false, onLogout }) {
  if (loading) {
    return (
      <div className="hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 backdrop-blur lg:block">
        Cargando sesión...
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div className="hidden items-center gap-3 lg:flex">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur">
        <p className="max-w-[180px] truncate text-sm font-medium text-white">
          {me.email}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{getRoleLabel(me.role)}</p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        Salir
      </button>
    </div>
  );
}