"use client";

import { useEffect, useState } from "react";

/**
 * A genuinely functional visit counter — counts how many times *this browser*
 * has visited, stored in localStorage. Increments once per browser session
 * (a sessionStorage guard stops refreshes from inflating it). Honest, no
 * backend, no fake random number.
 *
 * Want a real GLOBAL "you are visitor #N" across all visitors? That needs
 * shared server state — see the note in the home page furniture. This can be
 * swapped for an API-backed count later without touching the markup.
 */
const KEY = "of_visits";
const SESSION_KEY = "of_visit_counted";
const PAD = 5;

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let n = 0;
    try {
      n = parseInt(localStorage.getItem(KEY) || "0", 10) || 0;
      if (!sessionStorage.getItem(SESSION_KEY)) {
        n += 1;
        localStorage.setItem(KEY, String(n));
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch {
      n = 1; // storage blocked — still show something truthful-ish
    }
    setCount(n);
  }, []);

  const digits = String(count ?? 0).padStart(PAD, "0").split("");

  return (
    <div className="lb-counter">
      <span className="lb-lab" style={{ display: "block", marginBottom: 6 }}>
        your visits ♥
      </span>
      <span className="odo" aria-label={`you have visited ${count ?? 0} times`}>
        {digits.map((d, i) => (
          <b key={i}>{d}</b>
        ))}
      </span>
    </div>
  );
}
