export default function DiceArea({
  die,
  message,
  bust,
  shieldConsumed = false,
  doubleApplied = false,
  pointsAdded = null,
}) {
  let dieStyle = "border-[#FFFF8F] bg-[#ffffff20]";
  if (bust) dieStyle = "border-red-400 bg-[#ef444440]";
  else if (shieldConsumed) dieStyle = "border-blue-300 bg-[#3b82f640]";

  return (
    <section
      aria-label="Dice"
      className="flex flex-col items-center gap-3 rounded-lg border border-[#FFFFFF40] bg-[#ffffff10] p-4 text-white"
    >
      <div
        className={`grid h-20 w-20 place-content-center rounded-lg border-2 text-4xl font-bold duration-300 ${dieStyle}`}
        aria-label={die ? `Die shows ${die}` : "Die not rolled yet"}
      >
        {die ?? "?"}
      </div>

      <div className="flex min-h-6 flex-wrap items-center justify-center gap-2 text-xs font-semibold">
        {shieldConsumed && (
          <span className="rounded-full bg-[#3b82f650] px-2 py-0.5">
            Shield saved you! (no score)
          </span>
        )}
        {doubleApplied && (
          <span className="rounded-full bg-[#a00f9660] px-2 py-0.5">x2</span>
        )}
        {pointsAdded > 0 && (
          <span className="rounded-full bg-[#ffffff30] px-2 py-0.5">
            +{pointsAdded}
          </span>
        )}
      </div>

      <p role="status" aria-live="polite" className="text-center text-sm lg:text-base">
        {message || "Roll the die to start."}
      </p>
    </section>
  );
}