"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLang } from "@/lib/i18n";
import { durLeft, splitParas } from "@/lib/strings";
import { initAnalytics, track } from "@/lib/track";
import { PenIcon } from "./icons";
import NewStoryDialog from "./NewStoryDialog";

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
  // How much of the sample story is shown: 1–3 paragraphs, 4 = the visitor's turn to write.
  const [shown, setShown] = useState(1);
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

  // The "6d 23h left" countdown shown after sending.
  useEffect(() => {
    if (!sent) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [sent]);

  // Auto-height for the writing area + caret position after an insertion.
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
  }, [draft, sent, shown]);

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

  const openNew = () => {
    track("start_click", { revealed: shown }, lang);
    setDialogOpen(true);
  };

  const reveal = () => {
    const step = shown === 1 ? "julie" : shown === 2 ? "thomas" : "you";
    track("example_reveal_click", { step }, lang);
    setShown(shown + 1);
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

      <main style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
        <section className="intro">
          <h1 className="intro-title">{W.howTitle}</h1>
          <p className="intro-text">
            {W.concept} <em>{W.conceptQ}</em>
          </p>
        </section>

        <div className="sep">
          <i style={{ background: "linear-gradient(to right,transparent,rgba(28,30,42,.25))" }} />
          <span className="sep-label">{W.exLabel}</span>
          <i style={{ background: "linear-gradient(to left,transparent,rgba(28,30,42,.25))" }} />
        </div>

        <section className="demo" data-tms-story="" data-tms-demo="">
          <div className="demo-meta">
            <span>
              <span className="dot" style={{ background: "var(--ink-you)" }} />
              {W.authorA}
            </span>
            <span>
              <span className="dot" style={{ background: "var(--ink-julie)" }} />
              {W.authorB}
            </span>
          </div>

          <article className="article" data-tms-article="">
            {[
              [W.d1, W.p1, "var(--ink-you)"],
              [W.d2, W.p2, "var(--ink-julie)"],
              [W.d3, W.p3, "var(--ink-you)"],
            ]
              .slice(0, Math.min(shown, 3))
              .map(([d, p, c]) => (
                <div className="row row-in" data-tms-row="" key={d}>
                  <span className="row-date" data-tms-date="">
                    {d}
                  </span>
                  <p className="row-text" style={{ color: c }}>
                    {p}
                  </p>
                </div>
              ))}
            {paras.map((p, i) => (
              <div className="row row-in" data-tms-row="" key={"u" + i}>
                <span className="row-date" data-tms-date="">
                  {i ? "" : W.today}
                </span>
                <p className="row-text" style={{ color: "var(--ink-julie)", textIndent: p.indent }}>
                  {p.text}
                </p>
              </div>
            ))}
          </article>

          {shown < 4 ? (
            <button
              type="button"
              className="reveal-btn"
              onClick={reveal}
            >
              <span className="reveal-label">{shown === 1 ? W.revealB : shown === 2 ? W.revealA : W.revealYou}</span>
              <span className="reveal-arrow" aria-hidden="true">
                ↓
              </span>
            </button>
          ) : (
          <div className="row-in" style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14, paddingBottom: 20 }}>
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
                <div className="editor-bar">
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
          )}
        </section>

      </main>

      <div className="sticky-start">
        <button type="button" className="cta" onClick={openNew}>
          <PenIcon />
          <span className="cta-label">{W.start}</span>
        </button>
      </div>

      <footer className="footer">
        <a href="#">{W.legal}</a>
        <a href="#">{W.terms}</a>
        <a href="#">{W.privacy}</a>
      </footer>

      <NewStoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
