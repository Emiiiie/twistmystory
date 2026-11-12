"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, BulbIcon, ShuffleIcon, SmallClose } from "./icons";

type Props = {
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onPick: (text: string) => void;
};

/** Carousel of story opening ideas. */
export default function SuggestDialog({ index, onIndex, onClose, onPick }: Props) {
  const { L } = useLang();
  const ops = L.openings;
  const n = ops.length;
  const i = ((index % n) + n) % n;
  const text = ops[i];

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex(i + 1);
      else if (e.key === "ArrowLeft") onIndex(i - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [i, onClose, onIndex]);

  return (
    <div className="dialog-backdrop" onClick={onClose} style={{ zIndex: 50 }}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={L.suggestBrowse}
        onClick={(e) => e.stopPropagation()}
        style={{ gap: 16, width: "100%", maxWidth: 520, maxHeight: "calc(100dvh - 32px)", overflowY: "auto", margin: "auto", boxSizing: "border-box" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BulbIcon size={14} color="var(--color-accent-300)" />
          <span style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--color-accent-300)" }}>{L.suggestKicker}</span>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label={L.suggestClose}
            title={L.suggestClose}
            style={{ margin: "-6px -8px -6px auto", color: "var(--color-neutral-500)" }}
          >
            <SmallClose />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => onIndex(i - 1)}
            aria-label={L.suggestPrev}
            title={L.suggestPrev}
            style={{ flex: "none", color: "var(--color-neutral-400)" }}
          >
            <ArrowLeft />
          </button>
          <p
            key={text}
            className="f-garamond"
            aria-live="polite"
            style={{
              flex: 1,
              minWidth: 0,
              margin: 0,
              minHeight: "7.5em",
              display: "flex",
              alignItems: "center",
              fontSize: 19,
              lineHeight: 1.5,
              color: "var(--color-text)",
              textWrap: "pretty",
              animation: "tms-rise .25s ease both",
            }}
          >
            {text}
          </p>
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={() => onIndex(i + 1)}
            aria-label={L.suggestNext}
            title={L.suggestNext}
            style={{ flex: "none", color: "var(--color-neutral-400)" }}
          >
            <ArrowRight />
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <button type="button" className="btn btn-ghost" onClick={() => onIndex(i + 1)} style={{ whiteSpace: "nowrap" }}>
            <ShuffleIcon />
            {L.suggestNext}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onPick(text)} style={{ whiteSpace: "nowrap" }}>
            {L.suggestPick}
          </button>
        </div>
      </div>
    </div>
  );
}
