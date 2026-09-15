import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/auth-helpers";
import { getConversationsForUser } from "@/lib/messages";

export const metadata: Metadata = {
  title: "Mensajes · TuProfesorParticular",
};

export default async function MensajesPage() {
  const session = await requireSession();
  const conversations = await getConversationsForUser(session.user.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900">Mensajes</h1>

      {conversations.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-400">
          Todavía no tienes conversaciones.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white shadow-sm">
          {conversations.map((conversation) => {
            const isStudent = conversation.studentId === session.user.id;
            const otherParty = isStudent
              ? conversation.teacher
              : conversation.student;
            const lastMessage = conversation.messages[0];

            return (
              <li key={conversation.id}>
                <Link
                  href={`/panel/mensajes/${conversation.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-stone-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900">
                      {otherParty.name}
                    </p>
                    <p className="truncate text-sm text-stone-500">
                      {lastMessage ? lastMessage.body : "Sin mensajes todavía"}
                    </p>
                  </div>
                  {lastMessage && (
                    <span className="flex-shrink-0 text-xs text-stone-400">
                      {new Intl.DateTimeFormat("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                      }).format(lastMessage.createdAt)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
