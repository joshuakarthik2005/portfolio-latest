"use client";

import { useEffect, useRef, useState } from "react";
import { CONTRACT, OBLIGATIONS, PIPELINE, QUESTIONS, RISKS, SUMMARY, type Severity } from "@/data/contract-demo";
import { PlayIcon, ResetIcon } from "../Icons";

type Tab = "summary" | "risks" | "timeline" | "ask";
const TABS: { id: Tab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "risks", label: "Risks" },
  { id: "timeline", label: "Obligations" },
  { id: "ask", label: "Ask" },
];

const sevStyle: Record<Severity, { badge: string; mark: string; label: string }> = {
  high: { badge: "border-danger/50 text-danger", mark: "bg-danger/10 border-l-danger", label: "High" },
  medium: { badge: "border-warn/50 text-warn", mark: "bg-warn/10 border-l-warn", label: "Medium" },
  low: { badge: "border-border-strong text-fg-muted", mark: "bg-bg-sunken border-l-border-strong", label: "Low" },
};

const STEP_MS = 420;

export default function ContractDemo() {
  const [step, setStep] = useState(-1); // -1 idle, 0..n-1 running, n done
  const [tab, setTab] = useState<Tab>("summary");
  const [focus, setFocus] = useState<string[]>([]);
  const [qa, setQa] = useState<number | null>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const done = step >= PIPELINE.length;
  const running = step >= 0 && !done;

  useEffect(() => {
    if (!running) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setStep((s) => (reduce ? PIPELINE.length : s + 1)), reduce ? 0 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, step]);

  useEffect(() => {
    if (!focus.length) return;
    const el = docRef.current?.querySelector<HTMLElement>(`[data-clause="${focus[0]}"]`);
    if (el && docRef.current) docRef.current.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  }, [focus]);

  const riskByClause = Object.fromEntries(RISKS.map((r) => [r.clause, r]));
  const showRiskMarks = done && tab === "risks";

  const reset = () => {
    setStep(-1);
    setTab("summary");
    setFocus([]);
    setQa(null);
  };

  const cite = (ids: string[]) => setFocus(ids);

  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-bg-elev lg:grid-cols-[1fr_1.1fr]">
      {/* Document */}
      <div className="border-b border-border lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{CONTRACT.title}.pdf</p>
            <p className="truncate text-[11px] text-fg-subtle">{CONTRACT.parties}</p>
          </div>
          <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">sample</span>
        </div>
        <div ref={docRef} className="relative max-h-[460px] overflow-y-auto p-4 text-sm leading-relaxed" tabIndex={0} aria-label="Sample contract text">
          <ol className="space-y-3">
            {CONTRACT.clauses.map((c) => {
              const risk = riskByClause[c.id];
              const focused = focus.includes(c.id);
              const mark = showRiskMarks && risk ? sevStyle[risk.severity].mark : "border-l-transparent";
              return (
                <li
                  key={c.id}
                  data-clause={c.id}
                  className={`rounded-md border-l-2 px-3 py-2 transition-colors ${mark} ${focused ? "ring-2 ring-accent" : ""}`}
                >
                  <p className="font-mono text-[11px] text-fg-subtle">
                    § {c.id} · {c.title}
                  </p>
                  <p className="mt-1 text-fg-muted">{c.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Analysis */}
      <div className="flex min-h-[420px] flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Analysis</p>
          {step === -1 ? (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-accent-solid px-3 text-sm font-medium text-accent-solid-fg hover:brightness-110"
            >
              <PlayIcon /> Analyze contract
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              disabled={running}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-fg-muted hover:text-fg disabled:opacity-50"
            >
              <ResetIcon /> Reset
            </button>
          )}
        </div>

        {!done ? (
          <div className="flex flex-1 flex-col justify-center p-5">
            <ol className="space-y-2.5" aria-label="Processing pipeline">
              {PIPELINE.map((p, i) => {
                const state = step > i ? "done" : step === i ? "active" : "todo";
                return (
                  <li key={p} className="flex items-center gap-3 font-mono text-xs">
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] ${
                        state === "done"
                          ? "border-ok bg-ok text-bg"
                          : state === "active"
                            ? "border-accent text-accent"
                            : "border-border-strong text-fg-subtle"
                      }`}
                      aria-hidden
                    >
                      {state === "done" ? "✓" : i + 1}
                    </span>
                    <span className={state === "todo" ? "text-fg-subtle" : "text-fg"}>
                      {p}
                      {state === "active" && <span className="text-fg-subtle"> …</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-xs text-fg-subtle" aria-live="polite">
              {step === -1 ? "Press Analyze contract to run the (simulated) pipeline." : `Running: ${PIPELINE[step]}`}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div role="tablist" aria-label="Analysis views" className="flex gap-1 overflow-x-auto border-b border-border px-2 pt-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  onClick={() => {
                    setTab(t.id);
                    setFocus([]);
                  }}
                  className={`whitespace-nowrap rounded-t-md px-3 py-2 text-sm ${
                    tab === t.id ? "border-b-2 border-accent text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {t.label}
                  {t.id === "risks" && <span className="ml-1.5 font-mono text-[10px] text-danger">{RISKS.filter((r) => r.severity === "high").length}</span>}
                </button>
              ))}
            </div>

            <div role="tabpanel" className="flex-1 overflow-y-auto p-4 text-sm lg:max-h-[420px]">
              {tab === "summary" && (
                <div>
                  <p className="leading-relaxed text-fg-muted">{SUMMARY.overview}</p>
                  <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
                    {SUMMARY.keyTerms.map((k) => (
                      <div key={k.label} className="flex items-center justify-between gap-3 px-3 py-2">
                        <dt className="text-xs text-fg-subtle">{k.label}</dt>
                        <dd className="flex items-center gap-2 text-right text-fg">
                          {k.value}
                          <CiteButton ids={[k.clause]} onCite={cite} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {tab === "risks" && (
                <ul className="space-y-2.5">
                  {RISKS.map((r) => (
                    <li key={r.title} className="rounded-lg border border-border bg-bg p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${sevStyle[r.severity].badge}`}>
                          {sevStyle[r.severity].label}
                        </span>
                        <span className="font-medium text-fg">{r.title}</span>
                        <CiteButton ids={[r.clause]} onCite={cite} />
                      </div>
                      <p className="mt-1.5 text-fg-muted">{r.why}</p>
                    </li>
                  ))}
                </ul>
              )}

              {tab === "timeline" && (
                <ol className="relative space-y-4 border-l border-border pl-5">
                  {OBLIGATIONS.map((o) => (
                    <li key={o.when} className="relative">
                      <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg-elev" aria-hidden />
                      <p className="font-mono text-xs text-accent">{o.when}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-fg">
                        {o.what} <CiteButton ids={[o.clause]} onCite={cite} />
                      </p>
                    </li>
                  ))}
                </ol>
              )}

              {tab === "ask" && (
                <div>
                  <p className="text-xs text-fg-subtle">Pick a question. Answers cite clauses, or say plainly when the contract is silent.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {QUESTIONS.map((q, i) => (
                      <button
                        key={q.q}
                        type="button"
                        aria-pressed={qa === i}
                        onClick={() => {
                          setQa(i);
                          setFocus(q.cites);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-left text-xs ${
                          qa === i ? "border-accent bg-accent-soft text-fg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg"
                        }`}
                      >
                        {q.q}
                      </button>
                    ))}
                  </div>
                  {qa !== null && (
                    <div className="mt-4 rounded-lg border border-border bg-bg p-3" aria-live="polite">
                      <p className="font-mono text-[11px] text-fg-subtle">answer</p>
                      <p className="mt-1 leading-relaxed text-fg">{QUESTIONS[qa].a}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                        {QUESTIONS[qa].cites.length > 0 ? (
                          <>
                            <span className="text-fg-subtle">Sources:</span>
                            {QUESTIONS[qa].cites.map((c) => (
                              <CiteButton key={c} ids={[c]} onCite={cite} />
                            ))}
                          </>
                        ) : null}
                        {!QUESTIONS[qa].grounded && (
                          <span className="rounded border border-warn/50 px-1.5 py-0.5 font-mono text-warn">not stated in contract</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CiteButton({ ids, onCite }: { ids: string[]; onCite: (ids: string[]) => void }) {
  return (
    <button
      type="button"
      onClick={() => onCite(ids)}
      className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-accent hover:border-accent"
      aria-label={`Show clause ${ids.join(", ")} in the contract`}
    >
      §{ids.join(", §")}
    </button>
  );
}
