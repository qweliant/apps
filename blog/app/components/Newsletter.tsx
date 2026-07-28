/**
 * Buttondown newsletter signup — a plain HTML form (no third-party JS, no
 * tracking pixels), on-ethos with the no-surveillance model. It POSTs straight
 * to Buttondown; the reader lands on Buttondown's confirm page.
 *
 * Set your Buttondown username below (or via NEXT_PUBLIC_BUTTONDOWN_USERNAME).
 * It's not a secret — it's the same handle as your public page buttondown.com/<username>.
 */
const BUTTONDOWN_USERNAME =
  process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME || "qwelian";

export default function Newsletter() {
  const action = `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`;
  const hosted = `https://buttondown.com/${BUTTONDOWN_USERNAME}`;

  return (
    <div className="lb-sub">
      <p className="text-sm text-[var(--foreground)] m-0">
        plaintext posts in your inbox — full-text, ad-free, no tracking pixels. ♥
      </p>
      <form action={action} method="post" target="_blank">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="your email"
          autoComplete="email"
        />
        <input type="hidden" name="embed" value="1" />
        <button type="submit">subscribe →</button>
      </form>
      <p className="win-note m-0">
        prefer a reader?{" "}
        <a href="/posts/rss.xml">RSS</a> · <a href="/posts/atom.xml">Atom</a> ·{" "}
        <a href={hosted} target="_blank" rel="noopener noreferrer">
          subscribe page ↗
        </a>
      </p>
    </div>
  );
}
