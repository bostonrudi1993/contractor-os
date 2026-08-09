import { useState, useEffect, useCallback } from "react";

// Observability Dashboard — owner-only screen.
// Combines two data sources:
// 1. /api/system-status — live pings of Stripe,
//    Supabase, Anthropic, Resend, FMCSA, Clerk
// 2. /api/agent-runs — heartbeat history from
//    the 4 Python Autopilot agents
//
// Layout priority (per Boston's call): errors
// first, status tiles second, run history third.

const STATUS_COLORS = {
  up: "#22c55e",
  success: "#22c55e",
  restricted: "#f59e0b",
  down: "#ef4444",
  failed: "#ef4444",
  skipped: "#888",
  unknown: "#555",
};

function StatusDot({ status }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        marginRight: 8,
      }}
    />
  );
}

export default function Observability({ accent, S, isOwner }) {
  const [systemStatus, setSystemStatus] = useState(null);
  const [agentRuns, setAgentRuns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, runsRes] = await Promise.all([
        fetch("/api/system-status").then((r) => r.json()),
        fetch("/api/agent-runs").then((r) => r.json()),
      ]);
      setSystemStatus(statusRes);
      setAgentRuns(runsRes);
      setLastRefreshed(new Date());
    } catch (e) {
      setError(e.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!isOwner) {
    return (
      <div style={{ flex: 1, padding: 24 }}>
        <div style={{ color: "#999", fontSize: 12 }}>
          This screen is only available to the account owner.
        </div>
      </div>
    );
  }

  // Collect everything that's currently a problem,
  // for the top "errors first" section
  const downServices = (systemStatus?.services || []).filter(
    (s) => s.status === "down"
  );
  const failedRuns = (agentRuns?.recentRuns || []).filter(
    (r) => r.status === "failed"
  );

  const hasErrors = downServices.length > 0 || failedRuns.length > 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#e8e4d8",
            }}
          >
            🩺 Observability
          </div>
          <button
            className="hov"
            onClick={loadData}
            disabled={loading}
            style={{
              ...S.btn,
              background: "#1e1e1e",
              color: accent,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Refreshing..." : "Refresh Now"}
          </button>
        </div>

        {lastRefreshed && (
          <div style={{ fontSize: 10, color: "#666", marginBottom: 16 }}>
            Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </div>
        )}

        {error && (
          <div
            style={{
              ...S.card,
              background: "#1a0808",
              border: "1px solid #ef444455",
              marginBottom: 16,
              color: "#ef4444",
            }}
          >
            Failed to load dashboard: {error}
          </div>
        )}

        {/* ── SECTION 1: ERRORS FIRST ── */}
        {hasErrors && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 10,
                color: "#ef4444",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              ⚠ Needs Attention
            </div>

            {downServices.map((s) => (
              <div
                key={s.service}
                style={{
                  ...S.card,
                  background: "#1a0808",
                  border: "1px solid #ef444455",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>
                  {s.service.toUpperCase()} is down
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                  {s.message || "No further details"}
                </div>
              </div>
            ))}

            {failedRuns.slice(0, 5).map((r) => (
              <div
                key={r.id}
                style={{
                  ...S.card,
                  background: "#1a0808",
                  border: "1px solid #ef444455",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 700 }}>
                  {r.agent_name} failed
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                  {r.error_message || "No error message recorded"}
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {!hasErrors && !loading && (
          <div
            style={{
              ...S.card,
              background: "#081a08",
              border: "1px solid #22c55e55",
              marginBottom: 24,
              color: "#22c55e",
              fontSize: 13,
            }}
          >
            ✓ No active errors — everything's running clean
          </div>
        )}

        {/* ── SECTION 2: STATUS TILES ── */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 10,
              color: "#999",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Integrations
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: 8,
            }}
          >
            {(systemStatus?.services || []).map((s) => (
              <div key={s.service} style={{ ...S.card, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase" }}>
                  <StatusDot status={s.status} />
                  {s.service}
                </div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>
                  {s.responseTimeMs != null ? `${s.responseTimeMs}ms` : ""}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 10,
              color: "#999",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "16px 0 10px",
            }}
          >
            Agents
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 8,
            }}
          >
            {Object.entries(agentRuns?.latestByAgent || {}).map(
              ([name, run]) => (
                <div key={name} style={{ ...S.card, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    <StatusDot status={run.status} />
                    {name}
                  </div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>
                    Last run: {new Date(run.created_at).toLocaleString()}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ── SECTION 3: RUN HISTORY ── */}
        <div>
          <div
            style={{
              fontSize: 10,
              color: "#999",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Recent Runs
          </div>
          {(agentRuns?.recentRuns || []).slice(0, 20).map((r) => (
            <div
              key={r.id}
              style={{
                ...S.card,
                marginBottom: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <StatusDot status={r.status} />
                <span style={{ fontSize: 12, color: "#e8e4d8" }}>
                  {r.agent_name}
                </span>
                <span style={{ fontSize: 10, color: "#666", marginLeft: 10 }}>
                  {new Date(r.created_at).toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#888" }}>
                {r.duration_seconds != null ? `${r.duration_seconds}s` : ""}
              </div>
            </div>
          ))}
          {(!agentRuns?.recentRuns || agentRuns.recentRuns.length === 0) && (
            <div style={{ color: "#999", fontSize: 12 }}>
              No agent runs recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
