import { useEffect, useRef, useState } from "react";

const sidePanelBase =
  "pointer-events-none absolute inset-y-0 z-0 hidden overflow-hidden xl:block";
const sidePanelWidth = "clamp(9rem, calc((100vw - 80rem) / 2 + 1.5rem), 20rem)";

const leftSideVisual = {
  backgroundImage:
    "linear-gradient(90deg, rgba(2, 6, 23, 0.38) 0%, rgba(2, 6, 23, 0.14) 42%, rgba(2, 6, 23, 0.03) 68%, transparent 100%), radial-gradient(circle at 34% 24%, rgba(255,255,255,0.18), transparent 18%), radial-gradient(circle at 48% 72%, rgba(255,255,255,0.08), transparent 22%), repeating-linear-gradient(180deg, rgba(21,128,61,0.96) 0 90px, rgba(22,101,52,0.96) 90px 180px), linear-gradient(90deg, transparent 0 12%, rgba(255,255,255,0.16) 12% 13%, transparent 13% 87%, rgba(255,255,255,0.16) 87% 88%, transparent 88% 100%), linear-gradient(180deg, transparent 0 10%, rgba(255,255,255,0.14) 10% 11%, transparent 11% 89%, rgba(255,255,255,0.14) 89% 90%, transparent 90% 100%)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  filter: "saturate(1.04) contrast(1.02) brightness(0.94)",
  WebkitMaskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
};

const rightSideVisual = {
  backgroundImage:
    "linear-gradient(270deg, rgba(2, 6, 23, 0.4) 0%, rgba(2, 6, 23, 0.16) 42%, rgba(2, 6, 23, 0.03) 68%, transparent 100%), radial-gradient(circle at 64% 22%, rgba(255,255,255,0.18), transparent 18%), radial-gradient(circle at 54% 76%, rgba(255,255,255,0.08), transparent 22%), repeating-linear-gradient(180deg, rgba(22,101,52,0.96) 0 90px, rgba(21,128,61,0.96) 90px 180px), linear-gradient(90deg, transparent 0 18%, rgba(255,255,255,0.16) 18% 19%, transparent 19% 81%, rgba(255,255,255,0.16) 81% 82%, transparent 82% 100%), radial-gradient(circle at center, transparent 0 17%, rgba(255,255,255,0.15) 17% 18%, transparent 18% 100%)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  filter: "saturate(1.04) contrast(1.03) brightness(0.94)",
  WebkitMaskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
};

const heroVisual = {
  backgroundImage:
    "linear-gradient(135deg, rgba(8, 15, 31, 0.9), rgba(15, 23, 42, 0.78) 42%, rgba(16, 185, 129, 0.22)), radial-gradient(circle at 18% 14%, rgba(255,255,255,0.2), transparent 16%), radial-gradient(circle at 84% 18%, rgba(255,255,255,0.14), transparent 14%), repeating-linear-gradient(90deg, rgba(21,128,61,0.62) 0 80px, rgba(22,101,52,0.62) 80px 160px), linear-gradient(90deg, transparent 0 49.4%, rgba(255,255,255,0.16) 49.4% 50.6%, transparent 50.6% 100%), radial-gradient(circle at center, transparent 0 10.5%, rgba(255,255,255,0.15) 10.5% 11.3%, transparent 11.3% 100%)",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const INITIAL_MESSAGE = {
  id: crypto.randomUUID(),
  role: "assistant",
  text: "Hola. Soy la demo conversacional de Lozas Deportivas. Puedo ayudarte con consultas operativas sobre reservas, usuarios y canchas.",
};

const SUGGESTED_PROMPTS = [
  "¿Cuántas reservas hay?",
  "¿Cuántas reservas pendientes hay?",
  "¿Cuántas reservas ya registraron ingreso?",
  "¿Cuántos usuarios hay registrados?",
  "¿Cuántos usuarios activos hay?",
  "Lista las reservas recientes",
  "¿Hay reservas para hoy?",
  "¿Qué cancha tiene más reservas?",
  "¿Qué es una reserva?",
  "¿Qué puedes responder?",
];

export default function AIDemo() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-demo/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text:
          data?.answer ??
          "No se pudo obtener una respuesta válida desde el servidor.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Ocurrió un error al consultar la demo IA. Verifica que el backend esté encendido.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function fillPrompt(text) {
    if (loading) return;
    setInput(text);
  }

  function handleClearChat() {
    if (loading) return;
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Chat reiniciado. Puedes volver a consultar reservas, usuarios y canchas.",
      },
    ]);
    setInput("");
  }

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-x-hidden bg-transparent text-white">
      <div
        aria-hidden="true"
        className={`${sidePanelBase} left-0 opacity-64`}
        style={{ ...leftSideVisual, width: sidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(90deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <div
        aria-hidden="true"
        className={`${sidePanelBase} right-0 opacity-68`}
        style={{ ...rightSideVisual, width: sidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(270deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative isolate grid gap-6 overflow-hidden rounded-[2rem] border border-white/16 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.24)] lg:grid-cols-[1.5fr_0.9fr] lg:p-10">
          <div
            className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
            style={heroVisual}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.14),transparent_22%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-900/64 to-slate-900/44" />

          <div className="relative space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
                Demo IA
              </span>
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-sky-100">
                Chat + DB
              </span>
              <span className="rounded-full border border-white/12 bg-white/6 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                Consulta relacional
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.32em] text-white/56">
                Lozas Deportivas
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Consulta la base de datos con una interfaz tipo chat.
              </h1>

              <p className="max-w-3xl text-base leading-8 text-slate-200/82 sm:text-lg">
                Esta demo interpreta preguntas simples sobre reservas, usuarios y
                canchas, y responde con datos reales obtenidos desde PostgreSQL
                usando NestJS y Prisma.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4">
            <article className="rounded-[24px] border border-white/12 bg-slate-950/34 p-5 backdrop-blur-sm">
              <p className="text-sm text-emerald-200">Tecnología</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                React + NestJS
              </p>
            </article>

            <article className="rounded-[24px] border border-white/12 bg-slate-950/34 p-5 backdrop-blur-sm">
              <p className="text-sm text-sky-200">Origen de datos</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                PostgreSQL + Prisma
              </p>
            </article>

            <article className="rounded-[24px] border border-white/12 bg-slate-950/34 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/56">Uso</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                Preguntas operativas
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.45fr]">
          <aside className="rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.32em] text-white/52">
              Ejemplos
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Consultas sugeridas
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-200/74">
              Haz clic en una sugerencia para rellenar el input y probar la demo.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => fillPrompt(prompt)}
                  className="cursor-pointer rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-left text-sm text-slate-100/84 transition hover:border-emerald-400/24 hover:bg-emerald-400/10 hover:text-emerald-100"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <article className="mt-6 rounded-[24px] border border-emerald-400/24 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-100">
                Alcance actual
              </p>
              <p className="mt-3 text-sm leading-7 text-emerald-50/90">
                Esta demo responde consultas operativas sobre reservas, usuarios y
                canchas. No está diseñada para conversación abierta general.
              </p>
            </article>
          </aside>

          <section className="flex h-[680px] min-h-0 flex-col rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md lg:sticky lg:top-24">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/52">
                  Conversación
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Chat de consulta
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                disabled={loading}
                className="h-11 cursor-pointer rounded-2xl border border-white/12 bg-white/6 px-4 text-sm font-medium text-white/82 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpiar chat
              </button>
            </div>

            <div className="mt-4 rounded-[22px] border border-emerald-400/24 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-100">
                Qué puedes preguntar
              </p>
              <p className="mt-3 text-sm leading-7 text-emerald-50/90">
                Total de reservas, reservas pendientes, ingresos registrados,
                usuarios, usuarios activos, reservas recientes, reservas de hoy y
                cancha con más reservas.
              </p>
            </div>

            <div
              ref={messagesContainerRef}
              className="mt-6 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2"
            >
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={[
                    "max-w-[88%] whitespace-pre-line rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm",
                    message.role === "user"
                      ? "ml-auto border border-emerald-400/24 bg-emerald-400/10 text-emerald-50"
                      : "border border-white/10 bg-white/6 text-slate-100/84",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "mb-2 text-[11px] uppercase tracking-[0.28em]",
                      message.role === "user"
                        ? "text-emerald-200"
                        : "text-white/45",
                    ].join(" ")}
                  >
                    {message.role === "user" ? "Tú" : "Sistema"}
                  </p>
                  <p>{message.text}</p>
                </article>
              ))}

              {loading && (
                <article className="max-w-[88%] rounded-3xl border border-white/10 bg-white/6 px-5 py-4 text-sm text-slate-100/78">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Sistema
                  </p>
                  <p>Consultando base de datos...</p>
                </article>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="mt-4 flex shrink-0 flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe una pregunta sobre reservas, usuarios o canchas..."
                className="h-14 flex-1 rounded-2xl border border-white/12 bg-white/8 px-4 text-white outline-none transition placeholder:text-slate-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-14 cursor-pointer rounded-2xl bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Consultando..." : "Enviar"}
              </button>
            </form>
          </section>
        </section>
      </section>
    </main>
  );
}
