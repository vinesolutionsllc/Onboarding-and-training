"use client";

import type { User } from "@supabase/supabase-js";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

type Phase = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  description: string;
  tasks: string[];
  outcome: string;
};

type Pillar = {
  number: string;
  title: string;
  text: string;
};

type Role = "client" | "admin" | null;
type SaveState = "idle" | "saving" | "saved" | "error";

type Submission = {
  id: string;
  user_id: string;
  dsp_company_name: string;
  data: Record<string, string>;
  completion_percent: number;
  submitted_at: string | null;
  updated_at: string;
};

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: "client" | "admin";
};

function usePortalAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    let active = true;

    const syncUser = async (nextUser: User | null) => {
      if (!active) return;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data } = await client
        .from("profiles")
        .select("role")
        .eq("id", nextUser.id)
        .maybeSingle();

      if (!active) return;
      setRole(data?.role === "admin" ? "admin" : "client");
      setLoading(false);
    };

    client.auth.getSession().then(({ data }) => {
      void syncUser(data.session?.user ?? null);
    });

    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        void syncUser(session?.user ?? null);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return { user, role, loading, signOut };
}

function ConfigurationNotice() {
  return (
    <section className="portal-view access-page">
      <div className="access-card config-card">
        <p className="eyebrow">Secure portal setup</p>
        <h1>Authentication is ready to connect.</h1>
        <p>
          Add the Supabase project URL and publishable key during deployment to
          activate client accounts, secure storage, and the admin dashboard.
        </p>
      </div>
    </section>
  );
}

function AuthCard({
  intent,
  onBack,
}: {
  intent: "client" | "admin";
  onBack?: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setError("");
    setMessage("");

    if (mode === "signup" && intent === "client") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            dsp_company_name: companyName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else if (!data.session) {
        setMessage(
          "Account created. Check your email to confirm your address, then return here to sign in.",
        );
        setMode("signin");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) setError(signInError.message);
    }

    setBusy(false);
  };

  return (
    <section className="portal-view access-page">
      <div className="access-intro">
        <p className="eyebrow">
          {intent === "admin" ? "Administrative access" : "Secure client access"}
        </p>
        <h1>
          {intent === "admin"
            ? "Review every onboarding in one place."
            : "Continue your onboarding securely."}
        </h1>
        <p>
          {intent === "admin"
            ? "Sign in with an approved administrator account to review, search, and export client submissions."
            : "Your responses are saved to your account, protected by row-level access rules, and available when you return."}
        </p>
        <div className="access-points">
          <span>Secure account</span>
          <span>Automatic saving</span>
          <span>Private company record</span>
        </div>
      </div>

      <div className="access-card">
        {onBack && (
          <button className="text-button" type="button" onClick={onBack}>
            Back to company overview
          </button>
        )}
        <div className="access-card-heading">
          <span className="route-number" aria-hidden="true">
            {intent === "admin" ? "A" : "C"}
          </span>
          <div>
            <h2>{mode === "signin" ? "Welcome back" : "Create client account"}</h2>
            <p>
              {mode === "signin"
                ? "Enter your approved email and password."
                : "Create a secure account for your DSP."}
            </p>
          </div>
        </div>

        {intent === "client" && (
          <div className="auth-tabs" role="tablist" aria-label="Account options">
            <button
              type="button"
              className={mode === "signin" ? "is-active" : ""}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === "signup" ? "is-active" : ""}
              onClick={() => setMode("signup")}
            >
              Create account
            </button>
          </div>
        )}

        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && intent === "client" && (
            <>
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
              <label>
                <span>DSP company name</span>
                <input
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  autoComplete="organization"
                  required
                />
              </label>
            </>
          )}
          <label>
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              required
            />
            <small>Use at least eight characters.</small>
          </label>
          {error && <p className="form-message form-error">{error}</p>}
          {message && <p className="form-message form-success">{message}</p>}
          <button className="primary-button" type="submit" disabled={busy}>
            {busy
              ? "Please wait"
              : mode === "signin"
                ? "Sign in securely"
                : "Create client account"}
            <span aria-hidden="true">-&gt;</span>
          </button>
        </form>
      </div>
    </section>
  );
}

function CompanyIntroduction({
  pillars,
  onContinue,
}: {
  pillars: Pillar[];
  onContinue: () => void;
}) {
  return (
    <div className="portal-view company-intro-view">
      <section className="company-intro-hero">
        <div>
          <p className="eyebrow">Welcome to Vine Solutions</p>
          <h1>More room to lead. A stronger back office behind you.</h1>
        </div>
        <div className="company-intro-copy">
          <p>
            We are a specialized business process outsourcing partner built for
            Amazon Delivery Service Partners. Our team becomes a dependable
            extension of your operation.
          </p>
          <button className="primary-button" type="button" onClick={onContinue}>
            Continue to secure onboarding
            <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </section>

      <section className="intro-promise-grid">
        <article>
          <span>Our mission</span>
          <h2>Administrative operations, simplified.</h2>
          <p>
            We deliver reliable, efficient, and scalable support so owners and
            managers can focus on their teams, service, and growth.
          </p>
        </article>
        <article className="intro-dark-card">
          <span>Our commitment</span>
          <h2>Accurate. Responsive. Dependable.</h2>
          <p>
            Standardized processes, organized records, and clear communication
            keep every handoff visible and every operating day moving.
          </p>
        </article>
      </section>

      <section className="intro-services">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">What we do</p>
            <h2>Support across the employee lifecycle.</h2>
          </div>
          <p>
            From the first candidate conversation to payroll exception
            reporting, Vine Solutions brings structure to the work behind the
            route.
          </p>
        </div>
        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.number}>
              <span>{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partnership-route">
        <div>
          <span>01</span>
          <h3>Introduce</h3>
          <p>Meet the team, understand the service, and align expectations.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Connect</h3>
          <p>Create your account and provide the information for each phase.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Launch</h3>
          <p>Vine Solutions reviews your record and prepares the operating handoff.</p>
        </div>
      </section>
    </div>
  );
}

function ClientForm({
  phases,
  user,
  onSignOut,
}: {
  phases: Phase[];
  user: User;
  onSignOut: () => void;
}) {
  const [activePhase, setActivePhase] = useState(phases[0].id);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const allFields = useMemo(
    () =>
      phases.flatMap((phase) =>
        phase.tasks.map((label, index) => ({
          key: `${phase.id}:${index}`,
          label,
          phase: phase.title,
        })),
      ),
    [phases],
  );

  const completedCount = allFields.filter(
    (field) => formData[field.key]?.trim(),
  ).length;
  const completionPercent = Math.round(
    (completedCount / allFields.length) * 100,
  );
  const selectedPhase =
    phases.find((phase) => phase.id === activePhase) ?? phases[0];
  const phaseFields = selectedPhase.tasks.map((label, index) => ({
    key: `${selectedPhase.id}:${index}`,
    label,
  }));
  const phaseComplete = phaseFields.every((field) =>
    formData[field.key]?.trim(),
  );
  const companyKey = `${phases[0].id}:0`;
  const companyName = formData[companyKey]?.trim() || "Your DSP";

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const load = async () => {
      const { data } = await client
        .from("onboarding_submissions")
        .select("data, submitted_at")
        .eq("user_id", user.id)
        .maybeSingle();

      const initialCompany =
        typeof user.user_metadata?.dsp_company_name === "string"
          ? user.user_metadata.dsp_company_name
          : "";

      setFormData(
        data?.data && typeof data.data === "object"
          ? (data.data as Record<string, string>)
          : initialCompany
            ? { [companyKey]: initialCompany }
            : {},
      );
      setSubmittedAt(data?.submitted_at ?? null);
      setLoaded(true);
    };

    void load();
  }, [companyKey, user]);

  useEffect(() => {
    if (!loaded || !supabase) return;
    const client = supabase;

    setSaveState("saving");
    const timer = window.setTimeout(async () => {
      const { error } = await client.from("onboarding_submissions").upsert(
        {
          user_id: user.id,
          dsp_company_name: formData[companyKey]?.trim() || "Untitled DSP",
          data: formData,
          completion_percent: completionPercent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      setSaveState(error ? "error" : "saved");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [companyKey, completionPercent, formData, loaded, user.id]);

  const updateField = (key: string, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
    if (submittedAt) setSubmittedAt(null);
  };

  const continuePhase = () => {
    const currentIndex = phases.findIndex((phase) => phase.id === activePhase);
    const nextPhase = phases[currentIndex + 1];
    if (nextPhase) {
      setActivePhase(nextPhase.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitOnboarding = async () => {
    if (!supabase || completionPercent !== 100) return;
    const timestamp = new Date().toISOString();
    const { error } = await supabase
      .from("onboarding_submissions")
      .update({ submitted_at: timestamp, updated_at: timestamp })
      .eq("user_id", user.id);
    if (!error) setSubmittedAt(timestamp);
  };

  return (
    <div className="portal-view client-form-view">
      <section className="portal-hero client-portal-hero">
        <div>
          <p className="eyebrow">Secure client workspace / {companyName}</p>
          <h1>Build your launch-ready profile.</h1>
        </div>
        <div className="portal-hero-copy">
          <div className="account-row">
            <span>{user.email}</span>
            <button className="text-button" type="button" onClick={onSignOut}>
              Sign out
            </button>
          </div>
          <p>
            Enter the requested information. Each item checks itself when a
            response is present, and every change saves automatically.
          </p>
          <div className="progress-block">
            <div className="progress-copy">
              <span>Onboarding readiness</span>
              <strong>{completionPercent}%</strong>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={completionPercent} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
          <p className={`save-indicator save-${saveState}`} aria-live="polite">
            {saveState === "saving"
              ? "Saving changes..."
              : saveState === "saved"
                ? "All changes saved"
                : saveState === "error"
                  ? "Unable to save. Check your connection."
                  : "Ready"}
          </p>
        </div>
      </section>

      <div className="portal-layout">
        <aside className="portal-sidebar" aria-label="Onboarding phases">
          <div className="sidebar-heading">
            <span>Readiness map</span>
            <strong>{completionPercent}%</strong>
          </div>
          <div className="track-list">
            {phases.map((phase) => {
              const complete = phase.tasks.every((_, index) =>
                formData[`${phase.id}:${index}`]?.trim(),
              );
              return (
                <button
                  key={phase.id}
                  type="button"
                  className={activePhase === phase.id ? "is-active" : ""}
                  onClick={() => setActivePhase(phase.id)}
                  aria-current={activePhase === phase.id ? "step" : undefined}
                >
                  <span className="track-marker">{complete ? "✓" : phase.number}</span>
                  <span>
                    <strong>{phase.title}</strong>
                    <small>{complete ? "Complete" : "Information needed"}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="sidebar-note">
            <span>Privacy reminder</span>
            Do not enter passwords, Social Security numbers, banking details,
            or employee documents in this questionnaire.
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
                  {phaseFields.filter((field) => formData[field.key]?.trim()).length}/
                  {phaseFields.length}
                </span>
              </div>
              <div className="onboarding-fields">
                {phaseFields.map((field) => {
                  const complete = Boolean(formData[field.key]?.trim());
                  return (
                    <label className={complete ? "is-complete" : ""} key={field.key}>
                      <span className="auto-check" aria-hidden="true">
                        {complete ? "✓" : ""}
                      </span>
                      <span className="field-copy">
                        <strong>{field.label}</strong>
                        <input
                          type="text"
                          value={formData[field.key] ?? ""}
                          onChange={(event) => updateField(field.key, event.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          autoComplete={field.key === companyKey ? "organization" : "off"}
                        />
                      </span>
                    </label>
                  );
                })}
              </div>

              {selectedPhase.id !== phases[phases.length - 1].id ? (
                <button
                  className="primary-button"
                  type="button"
                  onClick={continuePhase}
                  disabled={!phaseComplete}
                >
                  Save and continue
                  <span aria-hidden="true">-&gt;</span>
                </button>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  onClick={submitOnboarding}
                  disabled={completionPercent !== 100 || Boolean(submittedAt)}
                >
                  {submittedAt ? "Onboarding submitted" : "Submit onboarding"}
                  <span aria-hidden="true">✓</span>
                </button>
              )}
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
                Responses are stored securely in your account and are visible
                only to your user and approved Vine Solutions administrators.
              </small>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ClientPortal({
  phases,
  pillars,
}: {
  phases: Phase[];
  pillars: Pillar[];
}) {
  const [stage, setStage] = useState<"intro" | "access" | "form">("intro");
  const auth = usePortalAuth();

  useEffect(() => {
    if (stage === "access" && auth.user) setStage("form");
  }, [auth.user, stage]);

  if (stage === "intro") {
    return (
      <CompanyIntroduction
        pillars={pillars}
        onContinue={() => setStage(auth.user ? "form" : "access")}
      />
    );
  }

  if (!isSupabaseConfigured) return <ConfigurationNotice />;
  if (auth.loading) return <div className="portal-loading">Opening secure portal...</div>;
  if (!auth.user) {
    return <AuthCard intent="client" onBack={() => setStage("intro")} />;
  }

  return (
    <ClientForm phases={phases} user={auth.user} onSignOut={auth.signOut} />
  );
}

function csvValue(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function safeFilename(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "") || "dsp-client"
  );
}

export function AdminPortal({ phases }: { phases: Phase[] }) {
  const auth = usePortalAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [search, setSearch] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  const fields = useMemo(
    () =>
      phases.flatMap((phase) =>
        phase.tasks.map((label, index) => ({
          key: `${phase.id}:${index}`,
          label,
          phase: phase.title,
        })),
      ),
    [phases],
  );

  const loadData = async () => {
    if (!supabase || auth.role !== "admin") return;
    setLoadingData(true);
    setDataError("");

    const [submissionResult, profileResult] = await Promise.all([
      supabase
        .from("onboarding_submissions")
        .select("id,user_id,dsp_company_name,data,completion_percent,submitted_at,updated_at")
        .order("dsp_company_name"),
      supabase.from("profiles").select("id,email,full_name,role"),
    ]);

    if (submissionResult.error || profileResult.error) {
      setDataError(
        submissionResult.error?.message ||
          profileResult.error?.message ||
          "Unable to load submissions.",
      );
    } else {
      setSubmissions((submissionResult.data ?? []) as Submission[]);
      setProfiles(
        Object.fromEntries(
          ((profileResult.data ?? []) as Profile[]).map((profile) => [
            profile.id,
            profile,
          ]),
        ),
      );
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (auth.role === "admin") void loadData();
  }, [auth.role]);

  const filtered = submissions.filter((submission) => {
    const profile = profiles[submission.user_id];
    const haystack = `${submission.dsp_company_name} ${profile?.email ?? ""} ${profile?.full_name ?? ""}`.toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  });

  const downloadSubmission = (submission: Submission) => {
    const profile = profiles[submission.user_id];
    const headers = [
      "DSP Company Name",
      "Client Name",
      "Client Email",
      "Completion Percent",
      "Submitted At",
      "Last Updated",
      ...fields.map((field) => `${field.phase} - ${field.label}`),
    ];
    const values = [
      submission.dsp_company_name,
      profile?.full_name ?? "",
      profile?.email ?? "",
      submission.completion_percent,
      submission.submitted_at ?? "Not submitted",
      submission.updated_at,
      ...fields.map((field) => submission.data?.[field.key] ?? ""),
    ];
    const csv = `${headers.map(csvValue).join(",")}\r\n${values.map(csvValue).join(",")}\r\n`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFilename(submission.dsp_company_name)}-onboarding.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  if (!isSupabaseConfigured) return <ConfigurationNotice />;
  if (auth.loading) return <div className="portal-loading">Verifying administrator access...</div>;
  if (!auth.user) return <AuthCard intent="admin" />;

  if (auth.role !== "admin") {
    return (
      <section className="portal-view access-page">
        <div className="access-card denied-card">
          <p className="eyebrow">Administrator access required</p>
          <h1>This account is not an administrator.</h1>
          <p>
            Sign out and use an account that has been approved in the Vine
            Solutions administrator profile.
          </p>
          <button className="primary-button" type="button" onClick={auth.signOut}>
            Sign out <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </section>
    );
  }

  const completed = submissions.filter(
    (submission) => submission.completion_percent === 100,
  ).length;

  return (
    <div className="portal-view admin-view">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Vine Solutions / Administration</p>
          <h1>Client onboarding command center.</h1>
        </div>
        <div className="admin-account">
          <span>Signed in as</span>
          <strong>{auth.user.email}</strong>
          <button className="text-button" type="button" onClick={auth.signOut}>
            Sign out
          </button>
        </div>
      </section>

      <section className="admin-metrics" aria-label="Onboarding summary">
        <article>
          <span>Total client records</span>
          <strong>{submissions.length}</strong>
        </article>
        <article>
          <span>Ready for review</span>
          <strong>{completed}</strong>
        </article>
        <article>
          <span>In progress</span>
          <strong>{submissions.length - completed}</strong>
        </article>
      </section>

      <section className="admin-table-section">
        <div className="admin-toolbar">
          <div>
            <p className="eyebrow">Client records</p>
            <h2>Search by DSP company name.</h2>
          </div>
          <div className="admin-actions">
            <label>
              <span className="sr-only">Search client records</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search DSP company or email"
              />
            </label>
            <button className="secondary-button" type="button" onClick={loadData}>
              Refresh
            </button>
          </div>
        </div>

        {dataError && <p className="form-message form-error">{dataError}</p>}
        {loadingData ? (
          <div className="admin-empty">Loading client records...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No matching client records found.</div>
        ) : (
          <div className="submission-list">
            {filtered.map((submission) => {
              const profile = profiles[submission.user_id];
              return (
                <article className="submission-row" key={submission.id}>
                  <div className="company-cell">
                    <span className="status-dot" aria-hidden="true" />
                    <div>
                      <strong>{submission.dsp_company_name}</strong>
                      <small>{profile?.full_name || profile?.email || "Client account"}</small>
                    </div>
                  </div>
                  <div>
                    <span>Completion</span>
                    <strong>{submission.completion_percent}%</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{submission.submitted_at ? "Submitted" : "In progress"}</strong>
                  </div>
                  <div>
                    <span>Updated</span>
                    <strong>{new Date(submission.updated_at).toLocaleDateString()}</strong>
                  </div>
                  <button
                    className="download-button"
                    type="button"
                    onClick={() => downloadSubmission(submission)}
                  >
                    Download CSV
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
