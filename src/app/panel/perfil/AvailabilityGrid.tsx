import { AVAILABILITY_HOURS, WEEKDAY_ORDER, WEEKDAY_SHORT_LABELS } from "@/lib/constants";

export default function AvailabilityGrid({
  selectedSlots,
}: {
  selectedSlots: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs text-stone-400">
        Marca los días y horas en los que sueles dar clase. Es orientativo
        para que el alumno sepa cuándo contactarte, no bloquea reservas.
      </p>
      <div className="overflow-x-auto rounded-lg border border-stone-200">
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
                  const slot = `${day}-${hour}`;
                  return (
                    <td key={slot} className="p-0.5">
                      <label className="block h-6 w-full cursor-pointer rounded bg-stone-100 has-[:checked]:bg-teal-600">
                        <input
                          type="checkbox"
                          name="slots"
                          value={slot}
                          defaultChecked={selectedSlots.includes(slot)}
                          className="sr-only"
                        />
                      </label>
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
