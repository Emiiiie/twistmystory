"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export default function SecretOverlay({ onClose }: { onClose: () => void }) {
  const { L } = useLang();

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div className="secret" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "min(720px,110vw)",
          height: "min(420px,70vh)",
          borderRadius: "50%",
          background: "radial-gradient(closest-side,color-mix(in srgb,var(--color-accent) 30%,transparent),transparent)",
          filter: "blur(20px)",
          opacity: 0,
          transform: "translate(-50%,-50%)",
          animation: "tms-type 1s 3.6s ease forwards, tms-breathe 4.5s 4.6s ease-in-out infinite",
        }}
      />
      <figure
        style={{
          position: "relative",
          zIndex: 1,
          margin: 0,
          maxWidth: 620,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          textAlign: "center",
        }}
      >
        <p className="f-garamond" style={{ margin: 0, fontSize: 18, letterSpacing: ".04em", color: "var(--color-neutral-300)" }}>
          <span style={{ animation: "tms-rise .8s .4s ease both", display: "inline-block" }}>{L.secret.bravo}</span>
        </p>
        <blockquote
          className="f-garamond"
          style={{
            margin: 0,
            fontSize: "clamp(26px,4.4vw,40px)",
            lineHeight: 1.3,
            fontStyle: "italic",
            color: "var(--color-text)",
            textWrap: "balance",
            animation: "tms-secret 1.6s 1.6s ease both",
          }}
        >
          {L.secret.quote}
        </blockquote>
        <div style={{ marginTop: 18, fontSize: 13, color: "var(--color-neutral-500)", animation: "tms-rise .8s 3.4s ease both" }}>
          {L.secret.tap}
        </div>
      </figure>
    </div>
  );
}
