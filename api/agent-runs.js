// api/agent-runs.js
// Reads recent agent run history from Supabase
// using the service role key (the browser can't
// do this directly — agent_runs has RLS locked
// down to service-role-only, same as
// settlement_watchdog_state).
//
// Used by the Observability Dashboard screen.

const { createClient } = require("@supabase/supabase-js");

module.exports = async (req, res) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Most recent 100 runs across all agents
    const { data: recentRuns, error } = await supabase
      .from("agent_runs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    // Build a "latest status per agent" summary
    // so the dashboard can show a quick health
    // tile per agent without the browser having
    // to compute it from the raw list.
    const latestByAgent = {};
    for (const run of recentRuns) {
      if (!latestByAgent[run.agent_name]) {
        latestByAgent[run.agent_name] = run;
      }
    }

    res.status(200).json({
      checkedAt: new Date().toISOString(),
      latestByAgent,
      recentRuns,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Unknown error",
    });
  }
};
