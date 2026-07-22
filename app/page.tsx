"use client";

import { useState } from "react";
import { AdminPortal, ClientPortal } from "./client-portal";

type View = "landing" | "client" | "admin";

type ClientPhase = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  tasks: string[];
  outcome: string;
};

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
    outcome:
      "A secure, role-appropriate workspace ready for daily execution.",
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
    outcome:
      "A launch-ready partnership with a clear communication loop.",
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
    title: "Readiness & deployment",
    text: "ORE coordination, work scheduling, operational changes, and driver-readiness tracking.",
  },
  {
    number: "04",
    title: "Time & attendance",
    text: "Timecard monitoring, missing-punch follow-up, attendance comparison, and exception reporting.",
  },
];

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

export default function Home() {
  const [view, setView] = useState<View>("landing");

  const enter = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell is-ready">
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
            ? "Secure client onboarding"
            : view === "client"
              ? "Client onboarding route"
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
                  <span aria-hidden="true" /> Begin your partnership
                </p>
              </div>

              <div className="hero-intro">
                <p>
                  A professional, secure onboarding experience designed to make
                  every handoff clear from introduction through launch.
                </p>
                <div className="hero-stats" aria-label="Program highlights">
                  <div>
                    <strong>04</strong>
                    <span>Core service pillars</span>
                  </div>
                  <div>
                    <strong>05</strong>
                    <span>Onboarding phases</span>
                  </div>
                  <div>
                    <strong>&lt;24h</strong>
                    <span>First-contact target</span>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="route-map route-map-client-only"
              aria-labelledby="route-title"
            >
              <h2 id="route-title" className="sr-only">
                Begin client onboarding
              </h2>
              <div className="map-origin" aria-hidden="true">
                <span>YOU</span>
              </div>
              <div className="map-line map-line-left" aria-hidden="true" />

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
            </section>

            <section className="trust-strip" aria-label="Program benefits">
              <span>Built for Amazon DSP operations</span>
              <span>Five guided onboarding phases</span>
              <span>KPI-led support</span>
              <span>Secure account-based progress</span>
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
