"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLang } from "@/lib/i18n";
import { durLeft, isSecret, splitParas } from "@/lib/strings";
import { initAnalytics, track } from "@/lib/track";
import { PenIcon } from "./icons";
import NewStoryDialog from "./NewStoryDialog";
import SecretOverlay from "./SecretOverlay";

const WEEK = 7 * 864e5;
const DRAFT_KEY = "tms-wdraft";

export default function Landing() {
  const { L, lang, toggleLang } = useLang();
  const W = L.welcome;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentAt, setSentAt] = useState(0);
  const [now, setNow] = useState(0);
  const [secret, setSecret] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const pendingCaret = useRef<number | null>(null);

  useEffect(() => {
    initAnalytics();
    try {
      setDraft(localStorage.getItem(DRAFT_KEY) || "");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, draft);
    } catch {}
  }, [draft]);

  // Le compte à rebours « Reste 6j 23h » après validation.
  useEffect(() => {
    if (!sent) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [sent]);

  // Hauteur auto de la zone d'écriture + position du curseur après insertion.
  useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    const y = window.scrollY;
    el.style.height = "auto";
    el.style.height = Math.max(110, el.scrollHeight) + "px";
    if (window.scrollY !== y) window.scrollTo(0, y);
    if (pendingCaret.current != null) {
      el.focus();
      el.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
      const vv = window.visualViewport;
      const limit = (vv ? vv.offsetTop + vv.height : window.innerHeight) - 120;
      const bottom = el.getBoundingClientRect().bottom;
      if (document.activeElement === el && el.selectionEnd >= el.value.length - 1 && bottom > limit)
        window.scrollBy({ top: bottom - limit });
    }
  }, [draft, sent]);

  const insert = useCallback((text: string) => {
    const el = ta.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd, v = el.value;
    pendingCaret.current = s + text.length;
    setDraft(v.slice(0, s) + text + v.slice(e));
  }, []);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const plain = !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (e.key === "Enter" && !e.currentTarget.value.replace(/[\t\n\r]/g, "")) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" && plain && !e.nativeEvent.isComposing) {
      e.preventDefault();
      insert("\n\t");
      return;
    }
    if (e.key === "Tab" && plain) {
      e.preventDefault();
      insert("\t");
    }
  };

  const send = () => {
    if (isSecret(draft)) {
      setSecret(true);
      return;
    }
    if (draft.trim()) {
      track("demo_send", { words: draft.trim().split(/\s+/).length }, lang);
      setSent(true);
      setSentAt(Date.now());
    }
  };

  const n = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const phShow = !draft.replace(/[\t\n\r]/g, "");
  const phIndent = !draft
    ? focused
      ? "0em"
      : "1.6em"
    : ((draft.split("\n")[0].match(/\t/g) || []).length * 1.6) + "em";
  const paras = sent ? splitParas(draft) : [];
  const clock = sent ? `${L.leftPrefix} ${durLeft(L, WEEK - Math.max(0, (now || Date.now()) - sentAt))}` : "";

  const openNew = (position: "hero" | "closing") => {
    track("start_click", { position }, lang);
    setDialogOpen(true);
  };

  const switchLang = () => {
    track("lang_switch", { from: lang, to: lang === "fr" ? "en" : "fr" }, lang);
    toggleLang();
  };

  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">
          Twist My <span style={{ fontStyle: "italic" }}>Story</span>
        </span>
        <button type="button" className="btn btn-ghost lang-btn" onClick={switchLang} title={L.switchLang} aria-label={L.switchLang}>
          {L.langLabel}
        </button>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto" }}>
        <section className="hero">
          <span className="kicker">{W.kicker}</span>
          <h1 className="hero-title">
            Twist My <span style={{ fontStyle: "italic" }}>Story</span>
          </h1>
          <p className="tagline">{L.tagline}</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 14 }}>
            <button type="button" className="cta" onClick={() => openNew("hero")}>
              <PenIcon />
              <span className="cta-label">{W.start}</span>
            </button>
          </div>
        </section>

        <div className="lines">
          <p className="lines-big">
            {W.line1}
            <br />
            {W.line2}
          </p>
          <p className="tagline" style={{ marginTop: -4 }}>
            {W.question}
          </p>
        </div>

        <div className="sep" aria-hidden="false">
          <i style={{ background: "linear-gradient(to right,transparent,rgba(28,30,42,.25))" }} />
          <span className="sep-label">{W.exLabel}</span>
          <i style={{ background: "linear-gradient(to left,transparent,rgba(28,30,42,.25))" }} />
        </div>

        <section className="demo" data-tms-story="" data-tms-demo="">
          <h2 className="demo-title">{W.exTitle}</h2>
          <div className="demo-meta">
            <span>
              <span className="dot" style={{ background: "var(--ink-julie)" }} />
              {W.withJulie}
            </span>
            <span>
              <span className="dot" style={{ background: "var(--ink-you)" }} />
              {W.you}
            </span>
            <span>{W.perWeek}</span>
          </div>

          <article className="article" data-tms-article="">
            <div className="ch-head" data-tms-head="">
              <div>
                <span className="ch-num">{W.chapter}</span>
                <span className="ch-title">{W.chTitle}</span>
                <span className="ch-rule" />
              </div>
            </div>
            {[
              [W.d1, W.p1, "var(--ink-julie)"],
              [W.d2, W.p2, "var(--ink-you)"],
              [W.d3, W.p3, "var(--ink-julie)"],
            ].map(([d, p, c]) => (
              <div className="row" data-tms-row="" key={d}>
                <span className="row-date" data-tms-date="">
                  {d}
                </span>
                <p className="row-text" style={{ color: c }}>
                  {p}
                </p>
              </div>
            ))}
            {paras.map((p, i) => (
              <div className="row" data-tms-row="" key={"u" + i}>
                <span className="row-date" data-tms-date="">
                  {i ? "" : W.today}
                </span>
                <p className="row-text" style={{ color: "var(--ink-you)", textIndent: p.indent }}>
                  {p.text}
                </p>
              </div>
            ))}
          </article>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, paddingBottom: 20 }}>
            {!sent ? (
              <>
                <div className="turn-label">
                  <i />
                  {L.yourTurn}
                </div>
                <div style={{ position: "relative" }}>
                  <span className="rail" data-tms-rail="" aria-hidden="true" />
                  <textarea
                    ref={ta}
                    className="editor"
                    data-tms-editor=""
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKey}
                    onFocus={(e) => {
                      setFocused(true);
                      if (!e.target.value) insert("\t");
                    }}
                    onBlur={(e) => {
                      setFocused(false);
                      if (e.target.value === "\t") setDraft("");
                    }}
                    aria-label={W.placeholder}
                    spellCheck
                  />
                  {phShow && (
                    <div className="editor-ph" data-tms-ph="" style={{ textIndent: phIndent }}>
                      {W.placeholder}
                    </div>
                  )}
                </div>
                <div className="editor-bar" data-tms-editor="">
                  <span style={{ fontSize: 12, color: "#6d7180", marginRight: "auto" }}>
                    {n ? `${n} ${n > 1 ? W.words : W.word}` : ""}
                  </span>
                  <button type="button" className="send-btn" onClick={send} disabled={!draft.trim()}>
                    {W.send}
                  </button>
                </div>
              </>
            ) : (
              <div className="handoff">
                <span className="dot" style={{ background: "var(--ink-julie)" }} />
                <span>{W.handOff}</span>
                <span style={{ marginRight: "auto", fontFeatureSettings: "'tnum' 1", color: "#7c8093" }}>{clock}</span>
                <button type="button" className="link-btn" onClick={() => setSent(false)}>
                  {W.rewrite}
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="closing-rule" />
        <section className="closing" data-tms-close="">
          <p className="lines-big" style={{ margin: "0 0 6px", fontSize: "clamp(26px,5vw,32px)" }}>
            {W.closeQ}
          </p>
          <button type="button" className="cta" onClick={() => openNew("closing")}>
            <PenIcon />
            <span className="cta-label">{W.closeCta}</span>
          </button>
        </section>
      </main>

      <footer className="footer">
        <a href="#">{W.legal}</a>
        <a href="#">{W.terms}</a>
        <a href="#">{W.privacy}</a>
      </footer>

      <NewStoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      {secret && (
        <SecretOverlay
          onClose={() => {
            setSecret(false);
            setSent(true);
            setSentAt(Date.now());
          }}
        />
      )}
    </div>
  );
}
