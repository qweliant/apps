"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────
   PLAYLIST — drop your audio files in  public/audio/  with these names
   (or edit the list below to match your own filenames / titles).
   Files served from public/audio/x.mp3 are reachable at  /audio/x.mp3
   .mp3, .ogg, .m4a, .webm all work. Keep them reasonably sized.
   ──────────────────────────────────────────────────────────────────── */
const TRACKS: { title: string; src: string }[] = [
  {
    title: "Frieren — Best OST Compilation",
    src: "/audio/Frieren%20Best%20OST%20Compilation%20%20Frieren%20Music%20Mix.mp3",
  },
];

const STORE_KEY = "of_player_v1";
const fmt = (s: number) =>
  isFinite(s) && s > 0
    ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
    : "0:00";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.6);
  const [minimized, setMinimized] = useState(false);
  const [errored, setErrored] = useState(false);
  const [mounted, setMounted] = useState(false);
  const restorePos = useRef(0);

  // Restore persisted state on first mount (playback still needs a click).
  useEffect(() => {
    setMounted(true);
    let hadMinPref = false;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.idx === "number" && s.idx < TRACKS.length) setIdx(s.idx);
        if (typeof s.vol === "number") setVol(s.vol);
        if (typeof s.min === "boolean") {
          setMinimized(s.min);
          hadMinPref = true;
        }
        if (typeof s.pos === "number") restorePos.current = s.pos;
      }
    } catch {
      /* ignore corrupt state */
    }
    // On phones, start as the small pill so the dock doesn't cover content —
    // unless the user has already picked a state.
    if (!hadMinPref && typeof window !== "undefined" && window.innerWidth < 640) {
      setMinimized(true);
    }
  }, []);

  const persist = useCallback(
    (patch: Record<string, unknown>) => {
      try {
        const raw = localStorage.getItem(STORE_KEY);
        const prev = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORE_KEY, JSON.stringify({ ...prev, ...patch }));
      } catch {
        /* storage unavailable */
      }
    },
    []
  );

  // Keep the <audio> volume in sync.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol;
  }, [vol]);

  const play = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      await a.play();
      setPlaying(true);
      setErrored(false);
    } catch {
      // autoplay blocked or file missing — stay paused, let the user retry
      setPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const go = useCallback(
    (next: number, autoplay: boolean) => {
      const n = (next + TRACKS.length) % TRACKS.length;
      restorePos.current = 0;
      setIdx(n);
      setCur(0);
      persist({ idx: n, pos: 0 });
      // load new src, then optionally play
      requestAnimationFrame(() => {
        const a = audioRef.current;
        if (!a) return;
        a.load();
        if (autoplay) play();
      });
    },
    [persist, play]
  );

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * dur;
    setCur(a.currentTime);
  };

  if (!TRACKS.length) return null;

  const track = TRACKS[idx];
  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          setDur(a.duration);
          if (restorePos.current && restorePos.current < a.duration) {
            a.currentTime = restorePos.current;
            restorePos.current = 0;
          }
        }}
        onTimeUpdate={(e) => {
          const t = e.currentTarget.currentTime;
          setCur(t);
          if (Math.floor(t) % 5 === 0) persist({ pos: t });
        }}
        onEnded={() => go(idx + 1, true)}
        onError={() => {
          setErrored(true);
          setPlaying(false);
        }}
      />
      {/* UI renders only after mount (avoids hydration mismatch); the <audio>
          above stays mounted in BOTH states so minimizing never stops playback. */}
      {mounted && minimized && (
        <button
          type="button"
          className="lb-player-mini"
          onClick={() => {
            setMinimized(false);
            persist({ min: false });
          }}
          aria-label="open music player"
        >
          {playing ? (
            <span className="lb-eq" aria-hidden>
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            <span aria-hidden>♫</span>
          )}
          {playing ? "now playing" : "music"}
        </button>
      )}
      {mounted && !minimized && (
        <div className="lb-player win">
          <div className="win-bar">
            <span className="win-title">♫ now playing</span>
            <span className="win-btns">
              <button
                type="button"
                aria-label="minimize player"
                onClick={() => {
                  setMinimized(true);
                  persist({ min: true });
                }}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  width: 15,
                  height: 14,
                  border: "1px solid var(--panel-brd)",
                  borderRadius: 3,
                  fontSize: "0.58rem",
                  color: "var(--bar-ink)",
                  background: "rgba(255,255,255,0.28)",
                }}
              >
                _
              </button>
            </span>
          </div>
          <div className="win-body">
            {errored ? (
              <p className="lb-player-sub" style={{ margin: 0 }}>
                ♪ no audio yet — drop tracks in{" "}
                <code style={{ color: "var(--sakura)" }}>public/audio/</code> (see{" "}
                <code>MusicPlayer.tsx</code>).
              </p>
            ) : (
              <>
                <div className="lb-player-song">{track.title}</div>
                <div className="lb-player-sub">
                  frieren ost · track {idx + 1}/{TRACKS.length}
                </div>
                <div
                  className="lb-seek"
                  onClick={onSeek}
                  role="slider"
                  aria-label="seek"
                  aria-valuemin={0}
                  aria-valuemax={Math.floor(dur)}
                  aria-valuenow={Math.floor(cur)}
                  tabIndex={0}
                >
                  <i style={{ width: `${pct}%` }} />
                </div>
                <div className="lb-time">
                  <span>{fmt(cur)}</span>
                  <span>{fmt(dur)}</span>
                </div>
              </>
            )}
            <div className="lb-controls">
              <button type="button" onClick={() => go(idx - 1, playing)} aria-label="previous track">
                ⏮
              </button>
              <button
                type="button"
                className="play"
                onClick={() => (playing ? pause() : play())}
                aria-label={playing ? "pause" : "play"}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button type="button" onClick={() => go(idx + 1, playing)} aria-label="next track">
                ⏭
              </button>
              <input
                className="lb-vol"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vol}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVol(v);
                  persist({ vol: v });
                }}
                aria-label="volume"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
