import { useEffect, useRef, useState } from "react";

const INITIAL_MESSAGE = {
  id: crypto.randomUUID(),
  role: "assistant",
  text: "Hola. Soy la demo conversacional del Courts Booking System. Puedo ayudarte con consultas operativas sobre reservas, usuarios y canchas.",
};

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
    <main className="min-h-[calc(100vh-81px)] bg-transparent">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 rounded-[32px] border border-gray-200 bg-white p-6 shadow-lg lg:grid-cols-[1.5fr_0.9fr] lg:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-700">
                Demo IA
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-violet-700">
                Chat + DB
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-xs font-medium uppercase tracking-[0.24em] text-gray-600">
                Consulta relacional
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.32em] text-gray-500">
                Courts Booking System
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Consulta la base de datos con una interfaz tipo chat.
              </h1>

              <p className="max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                Esta demo interpreta preguntas simples sobre reservas, usuarios y
                canchas, y responde con datos reales obtenidos desde PostgreSQL
                usando NestJS y Prisma.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[24px] border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Tecnología</p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                React + NestJS
              </p>
            </article>

            <article className="rounded-[24px] border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Origen de datos</p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                PostgreSQL + Prisma
              </p>
            </article>

            <article className="rounded-[24px] border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Uso</p>
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                Preguntas operativas
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.45fr]">
          <aside className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg">
            <p className="text-xs uppercase tracking-[0.32em] text-gray-500">
              Ejemplos
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
              Consultas sugeridas
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Haz clic en una sugerencia para rellenar el input y probar la demo.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
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
                ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => fillPrompt(prompt)}
                  className="cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-left text-sm text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <article className="mt-6 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">
                Alcance actual
              </p>
              <p className="mt-3 text-sm leading-7 text-emerald-800">
                Esta demo responde consultas operativas sobre reservas, usuarios y
                canchas. No está diseñada para conversación abierta general.
              </p>
            </article>
          </aside>

          <section className="flex h-[680px] min-h-0 flex-col rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg lg:sticky lg:top-24">
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-gray-500">
                  Conversación
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                  Chat de consulta
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                disabled={loading}
                className="h-11 cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpiar chat
              </button>
            </div>

            <div className="mt-4 rounded-[22px] border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">
                Qué puedes preguntar
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                 Total de reservas, reservas pendientes, ingresos registrados,
                 usuarios, usuarios activos, reservas recientes, reservas de hoy
                 y cancha con más reservas.
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
                    "max-w-[88%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm whitespace-pre-line",
                    message.role === "user"
                      ? "ml-auto border border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border border-gray-200 bg-gray-50 text-gray-700",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "mb-2 text-[11px] uppercase tracking-[0.28em]",
                      message.role === "user"
                        ? "text-emerald-600"
                        : "text-gray-500",
                    ].join(" ")}
                  >
                    {message.role === "user" ? "Tú" : "Sistema"}
                  </p>
                  <p>{message.text}</p>
                </article>
              ))}

              {loading && (
                <article className="max-w-[88%] rounded-3xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-gray-500">
                    Sistema
                  </p>
                  <p>Consultando base de datos...</p>
                </article>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="mt-4 flex shrink-0 flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe una pregunta sobre reservas, usuarios o canchas..."
                className="h-14 flex-1 rounded-2xl border border-gray-200 bg-white px-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-14 cursor-pointer rounded-2xl bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
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