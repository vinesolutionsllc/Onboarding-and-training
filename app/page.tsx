"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPortal, ClientPortal } from "./client-portal";

type View = "landing" | "client" | "training" | "admin";

type ClientPhase = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  tasks: string[];
  outcome: string;
};

type TrainingModule = {
  id: number;
  title: string;
  label: string;
  summary: string;
  objectives: string[];
  systems: string[];
  workflow: string[];
  responsibilities: string[];
  daily: { label: string; value: string }[];
  kpi: string;
  guardrails?: { do: string[]; dont: string[] };
  scenarios?: { title: string; steps: string[] }[];
};

type SavedProgress = {
  clientTasks: string[];
  trainingComplete: number[];
};

const STORAGE_KEY = "vine-solutions-progress-v1";

const clientPhases: ClientPhase[] = [
  {
    id: "company",
    number: "01",
    title: "Company profile",
    kicker: "Begin with the operating picture",
    description:
      "Give our team the context needed to build support around your DSP, volume, locations, and leadership structure.",
    tasks: [
      "DSP company name",
      "Primary point of contact and contact information",
      "Number of active drivers",
      "Average monthly hires",
      "Delivery station location(s)",
    ],
    outcome: "A clear operating profile for your dedicated support team.",
  },
  {
    id: "access",
    number: "02",
    title: "System access",
    kicker: "Connect the working environment",
    description:
      "Confirm the systems Vine Solutions will use as an extension of your back-office operation. Access should follow your internal security standards.",
    tasks: [
      "SmartRecruiters or Indeed",
      "Google Voice",
      "ADP",
      "Amazon Cortex",
      "Accurate Background",
      "DocuSign",
      "Company email, if applicable",
      "Shared Google Drive or OneDrive, if applicable",
    ],
    outcome: "A secure, role-appropriate workspace ready for daily execution.",
  },
  {
    id: "recruitment",
    number: "03",
    title: "Recruitment inputs",
    kicker: "Align the hiring engine",
    description:
      "Define your current demand and decision cadence so candidate sourcing, screening, and scheduling can move without friction.",
    tasks: [
      "Current hiring needs",
      "Open positions",
      "Hiring requirements",
      "Interview availability",
      "Orientation schedule",
    ],
    outcome: "A documented hiring plan with clear handoffs and availability.",
  },
  {
    id: "payroll",
    number: "04",
    title: "Scheduling & payroll",
    kicker: "Set the operating rhythm",
    description:
      "Document the timing and approval rules that keep schedules, attendance reporting, and payroll exceptions organized.",
    tasks: [
      "Current scheduling process",
      "Payroll schedule",
      "Timecard approval process",
      "Payroll cutoff dates",
      "Attendance reporting procedures",
    ],
    outcome: "A repeatable cadence built around your deadlines and approvals.",
  },
  {
    id: "communication",
    number: "05",
    title: "Communication & launch",
    kicker: "Finish with shared expectations",
    description:
      "Choose the channels and escalation path that keep day-to-day work responsive and urgent decisions visible.",
    tasks: [
      "Preferred platform: email, Slack, Microsoft Teams, or other",
      "Escalation contact for urgent matters",
      "Confirm launch date and first weekly check-in",
    ],
    outcome: "A launch-ready partnership with a clear communication loop.",
  },
];

const trainingModules: TrainingModule[] = [
  {
    id: 1,
    title: "Sourcing & Hiring",
    label: "Build the candidate pipeline",
    summary:
      "Learn the full DSP recruitment workflow, from the hiring request through a documented hiring decision.",
    objectives: [
      "Understand the DSP hiring process",
      "Source qualified applicants",
      "Screen resumes and candidates",
      "Schedule interviews",
      "Update recruitment trackers",
      "Communicate professionally with applicants",
    ],
    systems: [
      "SmartRecruiters",
      "Indeed",
      "Google Voice",
      "Gmail",
      "Google Calendar",
      "Google Sheets",
    ],
    workflow: [
      "Hiring request",
      "Job posting",
      "Source candidates",
      "Resume screening",
      "Phone screening",
      "Interview scheduling",
      "Hiring decision",
    ],
    responsibilities: [
      "Check new applicants and respond to candidate texts",
      "Screen resumes and call qualified applicants",
      "Schedule interviews and update trackers",
      "Send the recruitment report and pipeline update",
    ],
    daily: [
      { label: "Morning", value: "New applicants, messages, interview schedule" },
      { label: "Throughout day", value: "Screen, call, schedule, update" },
      { label: "End of day", value: "Recruitment report and pipeline update" },
    ],
    kpi: "First contact in under 24 hours, 90% interview show rate, and daily responses in under 2 hours.",
    scenarios: [
      {
        title: "Candidate missed interview",
        steps: ["Reschedule once", "Notify the DSP", "Update the tracker"],
      },
      {
        title: "Candidate is not qualified",
        steps: ["Reject politely", "Update the tracker", "Close the candidate record"],
      },
    ],
  },
  {
    id: 2,
    title: "Orientation & ADP Setup",
    label: "Prepare every hire for payroll",
    summary:
      "Coordinate orientation, verify required documents, and create accurate employee records so every approved hire is payroll-ready.",
    objectives: [
      "Understand the complete onboarding process",
      "Create ADP profiles successfully",
      "Verify payroll information before handoff",
    ],
    systems: ["ADP", "DocuSign", "Google Drive", "Email"],
    workflow: [
      "Candidate hired",
      "Schedule orientation",
      "Orientation complete",
      "Collect documents",
      "Verify documents",
      "Create ADP profile",
      "Payroll ready",
    ],
    responsibilities: [
      "Collect the driver's license, SSN, W-4, I-9, direct deposit, and emergency contact",
      "Verify spelling, SSN, address, banking details, and tax forms",
      "Escalate missing or inconsistent information before profile creation",
    ],
    daily: [
      { label: "Collect", value: "Confirm all required employee documents" },
      { label: "Verify", value: "Cross-check identity, tax, and banking details" },
      { label: "Create", value: "Build the ADP profile and confirm readiness" },
    ],
    kpi: "100% payroll accuracy.",
  },
  {
    id: 3,
    title: "Training, ORE & Work Deployment",
    label: "Move drivers from orientation to route",
    summary:
      "Coordinate the readiness journey from classroom training and On-Road Experience (ORE) through certification and active deployment.",
    objectives: ["Coordinate driver readiness from onboarding to the first route"],
    systems: ["Amazon Cortex", "Scheduling tool", "Google Calendar"],
    workflow: [
      "Orientation",
      "Training",
      "ORE",
      "Certification",
      "Driver deployment",
      "Active route",
    ],
    responsibilities: [
      "Schedule classroom training and ORE",
      "Assign trainers and monitor completion",
      "Update the deployment tracker",
      "Notify Operations when a driver is ready",
    ],
    daily: [
      { label: "Attendance", value: "Confirm classroom and ORE attendance" },
      { label: "Readiness", value: "Review certification and schedule changes" },
      { label: "Deployment", value: "Confirm Operations has the final status" },
    ],
    kpi: "100% of drivers ready before their scheduled route.",
  },
  {
    id: 4,
    title: "Time & Attendance Management",
    label: "Protect payroll accuracy",
    summary:
      "Monitor attendance, document discrepancies, and prepare exception reporting without modifying payroll records or approvals.",
    objectives: [
      "Monitor attendance and identify payroll discrepancies without modifying payroll records",
    ],
    systems: ["ADP", "Amazon Cortex", "Google Sheets"],
    workflow: [
      "Review timecards",
      "Compare Cortex",
      "Identify missing punch",
      "Contact driver",
      "Receive explanation",
      "Submit exception report",
      "DSP approval",
    ],
    responsibilities: [
      "Review punches, attendance, and overtime",
      "Document discrepancies and driver explanations",
      "Submit payroll exception reports before the cutoff",
    ],
    daily: [
      { label: "Morning", value: "Review the previous day's punches" },
      { label: "Afternoon", value: "Contact drivers and document explanations" },
      { label: "End of day", value: "Prepare the payroll exception report" },
    ],
    kpi: "Complete the discrepancy report before payroll cutoff with a 99% accuracy target.",
    guardrails: {
      do: [
        "Report discrepancies",
        "Document explanations",
        "Notify the DSP",
      ],
      dont: ["Edit timecards", "Approve payroll", "Change employee hours"],
    },
  },
];

const servicePillars = [
  {
    number: "01",
    title: "Sourcing & hiring",
    text: "Job ads, candidate sourcing, applicant screening, interview scheduling, trackers, and status updates.",
  },
  {
    number: "02",
    title: "Orientation & ADP",
    text: "New-hire orientations, onboarding requirements, ADP setup, payroll documentation, and readiness checks.",
  },
  {
    number: "03",
    title: "Training & deployment",
    text: "Classroom training, ORE coordination, work scheduling, changes, and driver-readiness tracking.",
  },
  {
    number: "04",
    title: "Time & attendance",
    text: "Timecard monitoring, missing-punch follow-up, attendance comparison, and exception reporting.",
  },
];

const emptyProgress: SavedProgress = {
  clientTasks: [],
  trainingComplete: [],
};

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup ${compact ? "brand-compact" : ""}`}>
      <span className="brand-monogram" aria-hidden="true">
        <img src="./vine-solutions-logo.png" alt="" />
      </span>
      <span className="brand-type">
        <strong>VINE</strong>
        <span>SOLUTIONS</span>
      </span>
    </span>
  );
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-block">
      <div className="progress-copy">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
      >
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [activePhase, setActivePhase] = useState(clientPhases[0].id);
  const [activeModule, setActiveModule] = useState(1);
  const [progress, setProgress] = useState<SavedProgress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SavedProgress>;
        setProgress({
          clientTasks: Array.isArray(parsed.clientTasks)
            ? parsed.clientTasks
            : [],
          trainingComplete: Array.isArray(parsed.trainingComplete)
            ? parsed.trainingComplete
            : [],
        });
      }
    } catch {
      setProgress(emptyProgress);
    }
    setReady(true);
  }, []);

  const saveProgress = (next: SavedProgress) => {
    setProgress(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const enter = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedPhase =
    clientPhases.find((phase) => phase.id === activePhase) ?? clientPhases[0];
  const selectedModule =
    trainingModules.find((module) => module.id === activeModule) ??
    trainingModules[0];

  const allClientTaskKeys = useMemo(
    () =>
      clientPhases.flatMap((phase) =>
        phase.tasks.map((_, index) => `${phase.id}:${index}`),
      ),
    [],
  );

  const clientPercent = Math.round(
    (progress.clientTasks.length / allClientTaskKeys.length) * 100,
  );
  const trainingPercent = Math.round(
    (progress.trainingComplete.length / trainingModules.length) * 100,
  );

  const phaseKeys = selectedPhase.tasks.map(
    (_, index) => `${selectedPhase.id}:${index}`,
  );
  const phaseComplete = phaseKeys.every((key) =>
    progress.clientTasks.includes(key),
  );

  const toggleClientTask = (key: string) => {
    const nextTasks = progress.clientTasks.includes(key)
      ? progress.clientTasks.filter((item) => item !== key)
      : [...progress.clientTasks, key];
    saveProgress({ ...progress, clientTasks: nextTasks });
  };

  const togglePhase = () => {
    const remaining = progress.clientTasks.filter(
      (key) => !phaseKeys.includes(key),
    );
    saveProgress({
      ...progress,
      clientTasks: phaseComplete ? remaining : [...remaining, ...phaseKeys],
    });
  };

  const toggleTraining = (moduleId: number) => {
    const nextModules = progress.trainingComplete.includes(moduleId)
      ? progress.trainingComplete.filter((id) => id !== moduleId)
      : [...progress.trainingComplete, moduleId];
    saveProgress({ ...progress, trainingComplete: nextModules });
  };

  return (
    <div className={`site-shell ${ready ? "is-ready" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <button
          className="brand-button"
          type="button"
          onClick={() => enter("landing")}
          aria-label="Return to the Vine Solutions gateway"
        >
          <Brand compact />
        </button>

        <div className="header-context" aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          {view === "landing"
            ? "Choose your guided experience"
            : view === "client"
              ? "Client onboarding route"
              : view === "training"
                ? "Employee learning route"
                : "Administrative review"}
        </div>

        <nav className="header-nav" aria-label="Portal navigation">
          {view !== "landing" && (
            <button type="button" onClick={() => enter("landing")}>
              Gateway
            </button>
          )}
          {view !== "client" && (
            <button type="button" onClick={() => enter("client")}>
              Onboarding
            </button>
          )}
          {view !== "training" && (
            <button type="button" onClick={() => enter("training")}>
              Training
            </button>
          )}
          {view !== "admin" && (
            <button type="button" onClick={() => enter("admin")}>
              Admin
            </button>
          )}
        </nav>
      </header>

      <main id="main-content">
        {view === "landing" && (
          <div className="landing-view">
            <section className="landing-hero" aria-labelledby="landing-title">
              <div className="atlas-ring atlas-ring-one" aria-hidden="true" />
              <div className="atlas-ring atlas-ring-two" aria-hidden="true" />

              <div className="hero-primary">
                <p className="eyebrow">
                  <span>33° 44′ / 84° 23′</span> Operations enablement
                </p>
                <h1 id="landing-title">
                  Operations that <em>grow</em> with you.
                </h1>
                <p className="route-signal">
                  <span aria-hidden="true" /> Select your destination
                </p>
              </div>

              <div className="hero-intro">
                <p>
                  A guided home for every partnership and every team member.
                  Choose the experience designed for you.
                </p>
                <div className="hero-stats" aria-label="Program highlights">
                  <div>
                    <strong>04</strong>
                    <span>Core service pillars</span>
                  </div>
                  <div>
                    <strong>02</strong>
                    <span>Guided experiences</span>
                  </div>
                  <div>
                    <strong>&lt;24h</strong>
                    <span>First-contact target</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="route-map" aria-labelledby="route-title">
              <h2 id="route-title" className="sr-only">
                Choose your experience
              </h2>
              <div className="map-origin" aria-hidden="true">
                <span>YOU</span>
              </div>
              <div className="map-line map-line-left" aria-hidden="true" />
              <div className="map-line map-line-right" aria-hidden="true" />

              <button
                className="route-card route-client"
                type="button"
                onClick={() => enter("client")}
              >
                <span className="route-topline">
                  <span className="route-number">01</span>
                  <span>Partner / organization</span>
                </span>
                <span className="route-card-body">
                  <span className="route-title">Client Onboarding</span>
                  <span className="route-description">
                    Start a seamless partnership
                  </span>
                </span>
                <span className="route-action">
                  Explore onboarding <span aria-hidden="true">↗</span>
                </span>
              </button>

              <button
                className="route-card route-training"
                type="button"
                onClick={() => enter("training")}
              >
                <span className="route-topline">
                  <span className="route-number">02</span>
                  <span>Team / individual</span>
                </span>
                <span className="route-card-body">
                  <span className="route-title">Employee Training</span>
                  <span className="route-description">
                    Build operational confidence
                  </span>
                </span>
                <span className="route-action">
                  Begin training <span aria-hidden="true">↗</span>
                </span>
              </button>
            </section>

            <section className="trust-strip" aria-label="Program benefits">
              <span>Built for Amazon DSP operations</span>
              <span>Four core service pillars</span>
              <span>KPI-led support</span>
              <span>Progress saved on this device</span>
            </section>

            <section className="mission-section">
              <div>
                <p className="eyebrow">Who we are</p>
                <h2>Your back office, strengthened.</h2>
              </div>
              <div className="mission-copy">
                <p>
                  Vine Solutions is a specialized business process outsourcing
                  company providing dedicated back-office support for Amazon
                  Delivery Service Partners.
                </p>
                <p>
                  We simplify administrative operations with reliable,
                  efficient, and scalable support—so DSP owners and managers can
                  focus on leading their teams and growing their business.
                </p>
              </div>
            </section>

            <section className="pillar-grid" aria-label="Service pillars">
              {servicePillars.map((pillar) => (
                <article className="pillar-card" key={pillar.number}>
                  <span>{pillar.number}</span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </section>
          </div>
        )}

        {view === "client" && (
          <ClientPortal phases={clientPhases} pillars={servicePillars} />
        )}

        {view === "admin" && <AdminPortal phases={clientPhases} />}

        {false && view === "client" && (
          <div className="portal-view">
            <section className="portal-hero client-portal-hero">
              <div>
                <p className="eyebrow">Route 01 / Client onboarding</p>
                <h1>Let&apos;s build a smooth start.</h1>
              </div>
              <div className="portal-hero-copy">
                <p>
                  Five focused phases turn your operating context into a clear,
                  launch-ready partnership.
                </p>
                <ProgressBar value={clientPercent} label="Onboarding readiness" />
              </div>
            </section>

            <div className="portal-layout">
              <aside className="portal-sidebar" aria-label="Onboarding phases">
                <div className="sidebar-heading">
                  <span>Readiness map</span>
                  <strong>{clientPercent}%</strong>
                </div>
                <div className="track-list">
                  {clientPhases.map((phase) => {
                    const keys = phase.tasks.map(
                      (_, index) => `${phase.id}:${index}`,
                    );
                    const complete = keys.every((key) =>
                      progress.clientTasks.includes(key),
                    );
                    return (
                      <button
                        key={phase.id}
                        type="button"
                        className={
                          activePhase === phase.id ? "is-active" : ""
                        }
                        onClick={() => setActivePhase(phase.id)}
                        aria-current={
                          activePhase === phase.id ? "step" : undefined
                        }
                      >
                        <span className="track-marker">
                          {complete ? "✓" : phase.number}
                        </span>
                        <span>
                          <strong>{phase.title}</strong>
                          <small>{complete ? "Ready" : "In progress"}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="sidebar-note">
                  <span>Scope boundary</span>
                  Vine Solutions monitors and reports attendance discrepancies;
                  your DSP retains timecard edits and payroll approval.
                </div>
              </aside>

              <section className="content-panel" aria-labelledby="phase-title">
                <div className="content-panel-head">
                  <div>
                    <p className="eyebrow">
                      Phase {selectedPhase.number} / {selectedPhase.kicker}
                    </p>
                    <h2 id="phase-title">{selectedPhase.title}</h2>
                    <p>{selectedPhase.description}</p>
                  </div>
                  <span className={`phase-seal ${phaseComplete ? "is-done" : ""}`}>
                    {phaseComplete ? "Ready" : selectedPhase.number}
                  </span>
                </div>

                <div className="phase-grid">
                  <div className="checklist-card">
                    <div className="section-label">
                      <span>Required information</span>
                      <span>
                        {
                          phaseKeys.filter((key) =>
                            progress.clientTasks.includes(key),
                          ).length
                        }
                        /{phaseKeys.length}
                      </span>
                    </div>
                    <div className="checklist">
                      {selectedPhase.tasks.map((task, index) => {
                        const key = `${selectedPhase.id}:${index}`;
                        return (
                          <label key={key}>
                            <input
                              type="checkbox"
                              checked={progress.clientTasks.includes(key)}
                              onChange={() => toggleClientTask(key)}
                            />
                            <span className="custom-check" aria-hidden="true" />
                            <span>{task}</span>
                          </label>
                        );
                      })}
                    </div>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={togglePhase}
                    >
                      {phaseComplete ? "Reopen this phase" : "Mark phase ready"}
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                  <aside className="outcome-card">
                    <span className="eyebrow">Phase outcome</span>
                    <p>{selectedPhase.outcome}</p>
                    <div className="outcome-route" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <small>
                      This checklist saves progress on this device. Share secure
                      credentials only through your approved access process.
                    </small>
                  </aside>
                </div>
              </section>
            </div>

            <section className="service-scope-section">
              <div className="section-heading-row">
                <div>
                  <p className="eyebrow">What Vine Solutions supports</p>
                  <h2>One partner across the employee lifecycle.</h2>
                </div>
                <p>
                  Standardized processes, responsive communication, and a team
                  that works as an extension of your operation.
                </p>
              </div>
              <div className="pillar-grid">
                {servicePillars.map((pillar) => (
                  <article className="pillar-card" key={pillar.number}>
                    <span>{pillar.number}</span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === "training" && (
          <div className="portal-view training-view">
            <section className="portal-hero training-portal-hero">
              <div>
                <p className="eyebrow">Route 02 / Employee academy</p>
                <h1>Learn the work. Own the standard.</h1>
              </div>
              <div className="portal-hero-copy">
                <p>
                  Four practical modules connect daily actions to quality,
                  readiness, and measurable service.
                </p>
                <ProgressBar value={trainingPercent} label="Academy completion" />
              </div>
            </section>

            <div className="portal-layout training-layout">
              <aside className="portal-sidebar" aria-label="Training modules">
                <div className="sidebar-heading">
                  <span>Learning path</span>
                  <strong>{progress.trainingComplete.length}/4</strong>
                </div>
                <div className="track-list module-track">
                  {trainingModules.map((module) => {
                    const complete = progress.trainingComplete.includes(
                      module.id,
                    );
                    return (
                      <button
                        key={module.id}
                        type="button"
                        className={
                          activeModule === module.id ? "is-active" : ""
                        }
                        onClick={() => setActiveModule(module.id)}
                        aria-current={
                          activeModule === module.id ? "step" : undefined
                        }
                      >
                        <span className="track-marker">
                          {complete ? "✓" : `0${module.id}`}
                        </span>
                        <span>
                          <strong>{module.title}</strong>
                          <small>{complete ? "Complete" : module.label}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="sidebar-note sidebar-kpi">
                  <span>Service mindset</span>
                  Accurate. Responsive. Documented. Every action should make
                  the next handoff easier.
                </div>
              </aside>

              <article className="content-panel module-panel">
                <div className="content-panel-head module-head">
                  <div>
                    <p className="eyebrow">
                      Training module 0{selectedModule.id}
                    </p>
                    <h2>{selectedModule.title}</h2>
                    <p>{selectedModule.summary}</p>
                  </div>
                  <span
                    className={`phase-seal ${
                      progress.trainingComplete.includes(selectedModule.id)
                        ? "is-done"
                        : ""
                    }`}
                  >
                    {progress.trainingComplete.includes(selectedModule.id)
                      ? "Done"
                      : `0${selectedModule.id}`}
                  </span>
                </div>

                <section className="learning-grid">
                  <div className="learning-objectives">
                    <div className="section-label">
                      <span>Learning objectives</span>
                    </div>
                    <ul>
                      {selectedModule.objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="systems-block">
                    <div className="section-label">
                      <span>Systems used</span>
                    </div>
                    <div className="chip-list">
                      {selectedModule.systems.map((system) => (
                        <span key={system}>{system}</span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="workflow-section">
                  <div className="section-label">
                    <span>Operational workflow</span>
                    <span>Follow the handoff</span>
                  </div>
                  <div className="workflow-map">
                    {selectedModule.workflow.map((step, index) => (
                      <div className="workflow-step" key={step}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{step}</strong>
                        {index < selectedModule.workflow.length - 1 && (
                          <i aria-hidden="true">→</i>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="practice-grid">
                  <div className="responsibility-card">
                    <div className="section-label">
                      <span>Core responsibilities</span>
                    </div>
                    <ul>
                      {selectedModule.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rhythm-card">
                    <div className="section-label">
                      <span>Daily rhythm</span>
                    </div>
                    {selectedModule.daily.map((item) => (
                      <div className="rhythm-row" key={item.label}>
                        <strong>{item.label}</strong>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {selectedModule.scenarios && (
                  <section className="scenario-section">
                    <div className="section-label">
                      <span>Common scenarios</span>
                    </div>
                    <div className="scenario-grid">
                      {selectedModule.scenarios.map((scenario) => (
                        <article key={scenario.title}>
                          <h3>{scenario.title}</h3>
                          <ol>
                            {scenario.steps.map((step) => (
                              <li key={step}>{step}</li>
                            ))}
                          </ol>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {selectedModule.guardrails && (
                  <section className="guardrail-grid">
                    <div className="guardrail-do">
                      <span>Always</span>
                      {selectedModule.guardrails.do.map((item) => (
                        <p key={item}>✓ {item}</p>
                      ))}
                    </div>
                    <div className="guardrail-dont">
                      <span>Do not</span>
                      {selectedModule.guardrails.dont.map((item) => (
                        <p key={item}>× {item}</p>
                      ))}
                    </div>
                  </section>
                )}

                <section className="module-finish">
                  <div className="kpi-card">
                    <span>KPI / quality standard</span>
                    <p>{selectedModule.kpi}</p>
                  </div>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => toggleTraining(selectedModule.id)}
                  >
                    {progress.trainingComplete.includes(selectedModule.id)
                      ? "Mark as in progress"
                      : "Complete this module"}
                    <span aria-hidden="true">→</span>
                  </button>
                </section>
              </article>
            </div>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <Brand compact />
        <p>
          Reliable systems. Responsive support. More room to lead your business.
        </p>
        <button type="button" onClick={() => enter("landing")}>
          Return to gateway ↑
        </button>
      </footer>
    </div>
  );
}
