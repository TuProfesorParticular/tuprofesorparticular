import { AVAILABILITY_HOURS, WEEKDAY_ORDER, WEEKDAY_SHORT_LABELS } from "@/lib/constants";
import type { Weekday } from "@prisma/client";

export default function AvailabilityView({
  slots,
}: {
  slots: { weekday: Weekday; hour: number }[];
}) {
  if (slots.length === 0) return null;

  const activeSlots = new Set(slots.map((s) => `${s.weekday}-${s.hour}`));

  return (
    <div>
      <h2 className="text-sm font-semibold text-stone-900">Disponibilidad</h2>
      <div className="mt-2 overflow-x-auto rounded-lg border border-stone-200">
        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 bg-stone-50 px-2 py-1.5" />
              {WEEKDAY_ORDER.map((day) => (
                <th
                  key={day}
                  className="min-w-[2.75rem] bg-stone-50 px-1 py-1.5 font-medium text-stone-600"
                >
                  {WEEKDAY_SHORT_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AVAILABILITY_HOURS.map((hour) => (
              <tr key={hour} className="border-t border-stone-100">
                <th className="sticky left-0 bg-white px-2 py-1 text-right font-normal text-stone-400">
                  {hour}:00
                </th>
                {WEEKDAY_ORDER.map((day) => {
                  const isActive = activeSlots.has(`${day}-${hour}`);
                  return (
                    <td key={day} className="p-0.5">
                      <div
                        className={`h-6 w-full rounded ${isActive ? "bg-teal-600" : "bg-stone-100"}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
