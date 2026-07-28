/** Scrolling marquee of ✦-separated items. Pauses for reduced-motion. */
export default function Marquee({ items }: { items: string[] }) {
  const track = items.map((t) => `✦ ${t}`).join("    ");
  return (
    <div className="lb-marquee" aria-hidden>
      <div className="lb-marquee-track">
        <span>{track} &nbsp;</span>
        <span>{track} &nbsp;</span>
      </div>
    </div>
  );
}
