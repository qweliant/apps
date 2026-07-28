import type { ReactNode } from "react";

/**
 * Windowed panel — a fake OS window with a titlebar and _ □ × controls.
 * The controls are decorative chrome (the old-web look); the window itself
 * is a plain container. For a genuinely collapsible window use <details>.
 */
export default function Win({
  title,
  children,
  className = "",
  bodyClassName = "win-body",
  id,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`win ${className}`}>
      <div className="win-bar">
        <span className="win-title">{title}</span>
        <span className="win-btns" aria-hidden>
          <i>_</i>
          <i>□</i>
          <i>×</i>
        </span>
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
