"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { useLang } from "@/lib/i18n";
import { PERIODS } from "@/lib/strings";
import { track, trackError } from "@/lib/track";
import { BulbIcon, CheckIcon, ChevronLeft, CloseIcon, CopyIcon, LockIcon, PenIcon, UnlockIcon } from "./icons";
import SuggestDialog from "./SuggestDialog";
import TwoQuills from "./TwoQuills";

/**
 * Market test flow:
 *   main   → title + turn length
 *   with   → co-author's first name
 *   intro  → story opening (with opening ideas)
 *   locked → "Your story is ready", fake €1.99 paywall
 *   sorry  → not open yet, email collection
 *   done   → confirmation
 *   keep   → on close: copy your story opening
 */
type Step = "main" | "with" | "intro" | "locked" | "sorry" | "done" | "keep";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const enterIn = "tmsInR .34s cubic-bezier(.2,.7,.3,1) both";
const backIn = "tmsInL .34s cubic-bezier(.2,.7,.3,1) both";

export default function NewStoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { L, lang } = useLang();
  const F = L.fd;

  const [step, setStep] = useState<Step>("main");
  const [backAnim, setBackAnim] = useState(false);
  const [title, setTitle] = useState("");
  const [later, setLater] = useState(false);
  const [period, setPeriod] = useState(7);
  const [partner, setPartner] = useState("");
  const [opening, setOpening] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<null | "empty" | "bad">(null);
  const [copied, setCopied] = useState(false);
  const [minH, setMinH] = useState(0);
  const [suggest, setSuggest] = useState<number | null>(null);
  const [suggestIdx, setSuggestIdx] = useState<number | null>(null);

  const dlg = useRef<HTMLDivElement>(null);
  const keepRef = useRef<HTMLDivElement>(null);
  const draftId = useRef("");
  if (!draftId.current && typeof window !== "undefined") draftId.current = "s" + Date.now().toString(36);

  const t = (event: string, data?: Record<string, unknown>) => track(event, data, lang);

  // Fresh form on every open (the co-author's name and the story opening are kept).
  useEffect(() => {
    if (!open) return;
    setStep("main");
    setBackAnim(false);
    setTitle("");
    setLater(false);
    setPeriod(7);
    setErr(null);
    setMinH(0);
  }, [open]);

  const close = () => {
    if ((step === "sorry" || step === "done") && opening.trim()) {
      t("keep_shown");
      setCopied(false);
      setStep("keep");
      return;
    }
    t("dialog_close", { step, has_opening: !!opening.trim() });
    setErr(null);
    onClose();
  };

  useEffect(() => {
    if (!open || suggest !== null) return;
    const k = (e: globalThis.KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  if (!open) return null;

  const share = step !== "main";
  const ctaOff = !(later || title.trim());
  const dlgStyle: CSSProperties = {
    minHeight: share && minH && step !== "keep" && step !== "done" ? minH : undefined,
  };

  const submitMain = () => {
    if (ctaOff) return;
    setMinH(dlg.current ? dlg.current.offsetHeight : 0);
    setBackAnim(false);
    setStep("with");
    t("story_created", { pair: "invite", title: title || "", period });
  };

  const goWith = () => {
    const p = partner.trim();
    if (!p) return;
    t("with", { partner: p });
    setStep("intro");
  };

  const goIntro = () => {
    t("intro", { partner: partner.trim(), opening: opening.trim() });
    setStep("locked");
  };

  const back = () => {
    if (step === "locked") setStep("intro");
    else if (step === "intro") setStep("with");
    else {
      setErr(null);
      setMinH(0);
      setBackAnim(true);
      setStep("main");
    }
  };

  const submitEmail = () => {
    const em = email.trim();
    if (!em) {
      t("email_error", { reason: "empty" });
      return setErr("empty");
    }
    if (!EMAIL_RE.test(em)) {
      t("email_error", { reason: "bad" });
      return setErr("bad");
    }
    t("email", { email: em, partner: partner.trim(), title: title || "" });
    setErr(null);
    setStep("done");
  };

  const openingKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab" || e.shiftKey) return;
    e.preventDefault();
    const el = e.currentTarget, a = el.selectionStart, b = el.selectionEnd;
    setOpening(el.value.slice(0, a) + "\t" + el.value.slice(b));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = a + 1;
    });
  };

  const copyOpening = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(opening);
      ok = true;
    } catch {}
    if (!ok && keepRef.current) {
      const rg = document.createRange();
      rg.selectNodeContents(keepRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(rg);
      try {
        ok = document.execCommand("copy");
      } catch {}
    }
    if (!ok) trackError(new Error("keep_copy failed"), { step: "keep" });
    setCopied(true);
    t("keep_copy", { ok });
  };

  const openIdeas = () => {
    t("ideas_open");
    const n = L.openings.length || 1;
    const i = suggestIdx ?? Math.floor(Math.random() * n);
    setSuggestIdx(i);
    setSuggest(i);
  };

  const head =
    step === "keep"
      ? F.headKeep
      : step === "with"
        ? F.headWith
        : step === "intro"
          ? F.headIntro
          : step === "done"
            ? F.headDone
            : step === "sorry"
              ? F.headSorry
              : F.headLocked;

  return (
    <>
      <div className="dialog-backdrop" data-tms-newbd="" onClick={close}>
        <div
          ref={dlg}
          className="dialog newdlg"
          data-tms-newdlg=""
          role="dialog"
          aria-modal="true"
          aria-label={step === "main" ? L.welcome.firstStory : head}
          onClick={(e) => e.stopPropagation()}
          style={dlgStyle}
        >
          {!share && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: backAnim ? backIn : "none" }}>
              <div data-tms-newhead="" className="f-fell" style={{ fontSize: 30, lineHeight: 1.1 }}>
                {L.welcome.firstStory}
              </div>
              <p
                className="f-garamond"
                style={{ margin: "-4px 0 -2px", fontSize: 17, lineHeight: 1.4, fontStyle: "italic", color: "#5c5750", textWrap: "pretty" }}
              >
                {L.nhFirstLine}
              </p>

              <div className="soft-box">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label className="lbl" htmlFor="tms-title">
                    {L.nhTitle}
                  </label>
                  <input
                    id="tms-title"
                    type="text"
                    className="field-input"
                    value={title}
                    placeholder={L.nhTitlePh}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setLater(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && submitMain()}
                  />
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={later}
                      onChange={(e) => {
                        setLater(e.target.checked);
                        if (e.target.checked) setTitle("");
                      }}
                    />
                    <span className="check-box" aria-hidden="true">
                      {later && <CheckIcon />}
                    </span>
                    <span>{L.nhTitleLater}</span>
                  </label>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span className="lbl">{L.nhTurn}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} role="group" aria-label={L.nhTurn}>
                    {PERIODS.map((d) => (
                      <button key={d} type="button" className="chip" aria-pressed={period === d} onClick={() => setPeriod(d)}>
                        {L.periods[d]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky-foot">
                <button type="button" className="pill-cta" onClick={submitMain} disabled={ctaOff} style={{ minHeight: 48 }}>
                  <PenIcon />
                  <span className="pill-cta-label">{L.nhCtaLink}</span>
                </button>
              </div>
            </div>
          )}

          {share && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, animation: enterIn }}>
              {(step === "with" || step === "intro" || step === "locked") && (
                <button type="button" className="btn btn-ghost back-btn" onClick={back} style={{ margin: "-6px 0 -10px -8px" }}>
                  <ChevronLeft />
                  {L.welcome.back}
                </button>
              )}

              {step === "keep" && (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => {
                    t("dialog_close", { step: "keep", copied });
                    setErr(null);
                    onClose();
                  }}
                  aria-label={F.close}
                  style={{ position: "absolute", top: 4, right: 4 }}
                >
                  <CloseIcon />
                </button>
              )}

              <div className="dlg-head" style={{ paddingLeft: step === "keep" ? 10 : 0, paddingRight: step === "keep" ? 32 : 0 }}>
                {head}
              </div>

              {step === "with" && (
                <>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 14, color: "var(--color-neutral-300)" }}>{F.introName}</span>
                      <input
                        type="text"
                        autoComplete="off"
                        className="field-input lg"
                        value={partner}
                        placeholder={F.introNamePh}
                        onChange={(e) => setPartner(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && goWith()}
                        autoFocus
                      />
                    </label>
                  </div>
                  <button type="button" className="pill-cta" onClick={goWith} disabled={!partner.trim()}>
                    <span className="pill-cta-label">{F.introGo}</span>
                  </button>
                </>
              )}

              {step === "intro" && (
                <>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                    <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <textarea
                        className="field-input lg"
                        value={opening}
                        onChange={(e) => setOpening(e.target.value)}
                        onKeyDown={openingKey}
                        placeholder={F.introStartPh}
                        aria-label={F.headIntro}
                        lang={lang}
                        style={{ flex: 1, minHeight: 150, resize: "none", lineHeight: 1.58, tabSize: 4, textAlign: "justify", hyphens: "auto" }}
                      />
                    </label>
                    <button type="button" className="ideas-btn" onClick={openIdeas}>
                      <BulbIcon />
                      {L.suggestLink}
                    </button>
                  </div>
                  <button type="button" className="pill-cta" onClick={goIntro}>
                    <span className="pill-cta-label">{F.create}</span>
                  </button>
                </>
              )}

              {step === "locked" && (
                <>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: 14,
                    }}
                  >
                    <TwoQuills />
                    <p style={{ margin: 0, maxWidth: "34ch", fontSize: 15, lineHeight: 1.45, color: "var(--color-neutral-300)", textWrap: "pretty" }}>
                      {F.lead}
                    </p>
                    <div className="locked-link">
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 15,
                          lineHeight: 1.35,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          userSelect: "none",
                          textAlign: "left",
                        }}
                      >
                        twistmystory.app/j/
                        <span aria-hidden="true" style={{ display: "inline-block", filter: "blur(3.5px)", color: "var(--color-neutral-300)" }}>
                          {draftId.current}
                        </span>
                      </span>
                      <span className="locked-pill">
                        <LockIcon />
                        {F.locked}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, lineHeight: 1.4, color: "var(--color-neutral-400)", marginTop: -6 }}>{F.priceNote}</span>
                  </div>
                  <button
                    type="button"
                    className="pill-cta"
                    onClick={() => {
                      t("pay_click", { partner: partner.trim() });
                      setStep("sorry");
                    }}
                  >
                    <UnlockIcon />
                    <span className="pill-cta-label">{F.pay}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1, marginLeft: -5, fontFeatureSettings: "'tnum' 1" }}>{F.price}</span>
                  </button>
                </>
              )}

              {step === "sorry" && (
                <>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                    <p className="muted">{F.sorryBody}</p>
                    <p className="muted" style={{ color: "var(--color-text)" }}>
                      {F.offer}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                      <input
                        className="input"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErr(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && submitEmail()}
                        placeholder={F.emailPh}
                        aria-label={F.emailPh}
                        aria-invalid={!!err}
                        style={{ width: "100%", boxSizing: "border-box", fontSize: 16, minHeight: 44 }}
                      />
                      {err && (
                        <span role="alert" style={{ fontSize: 13, color: "oklch(0.55 0.15 25)" }}>
                          {err === "bad" ? F.errBad : F.errEmpty}
                        </span>
                      )}
                    </div>
                  </div>
                  <button type="button" className="pill-cta" onClick={submitEmail}>
                    <span className="pill-cta-label">{F.submit}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      t("email_declined", { partner: partner.trim() });
                      close();
                    }}
                    style={{ alignSelf: "center", fontSize: 14, marginTop: -8 }}
                  >
                    {F.noThanks}
                  </button>
                </>
              )}

              {step === "done" && (
                <>
                  <p className="muted">
                    {F.donePre}
                    <span style={{ color: "var(--color-accent-200)" }}>{email.trim()}</span>
                    {F.donePost}
                  </p>
                  <button type="button" className="btn btn-ghost" onClick={close} style={{ alignSelf: "flex-end", fontSize: 14, margin: "-4px 0 -2px" }}>
                    {F.close}
                  </button>
                </>
              )}

              {step === "keep" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 10 }}>
                  <p className="muted">{F.keepBody}</p>
                  <div style={{ position: "relative" }}>
                    <div ref={keepRef} className="keep-box" lang={lang}>
                      {opening}
                    </div>
                    <button type="button" className="copy-btn" onClick={copyOpening}>
                      <CopyIcon />
                      {copied ? F.copied : F.copy}
                    </button>
                  </div>
                </div>
              )}

              {step !== "done" && step !== "keep" && <div aria-hidden="true" style={{ height: 4 }} />}
            </div>
          )}
        </div>
      </div>

      {suggest !== null && (
        <SuggestDialog
          index={suggest}
          onIndex={(i) => {
            setSuggest(i);
            setSuggestIdx(i);
          }}
          onClose={() => setSuggest(null)}
          onPick={(text) => {
            t("idea_use", { idea: text });
            setOpening(text);
            setSuggest(null);
          }}
        />
      )}
    </>
  );
}
