
import { useEffect, useState } from "react";
import { PUBG_VN_SQUADS } from "../data/pubg-vn-telemetry-spec";
import "./PubgMatchTelemetry.css";

export default function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState("ces");
  const [retryTick, setRetryTick] = useState(0);
  const [view, setView] = useState({
    status: "IDLE",
    data: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setView({ status: "LOADING", data: null, error: null });

    async function loadTelemetry() {
      try {
        // Simulate network request and 35% packet loss on Erangel/Miramar.
        await new Promise((resolve, reject) => {
          const timer = setTimeout(resolve, 1200);

          controller.signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new DOMException("Request aborted", "AbortError"));
            },
            { once: true }
          );
        });

        if (controller.signal.aborted) return;

        const squad = PUBG_VN_SQUADS.find(
          (item) => item.id === squadId
        );

        if (!squad) {
          throw new Error("Squad telemetry was not found.");
        }

        const hasPacketLoss =
          ["Erangel", "Miramar"].includes(squad.map) &&
          Math.random() < 0.35;

        if (hasPacketLoss) {
          throw new Error(
            `Packet timeout: satellite link to ${squad.map} was lost.`
          );
        }

        setView({ status: "SUCCESS", data: squad, error: null });
      } catch (err) {
        if (err.name === "AbortError") return;

        setView({
          status: "ERROR",
          data: null,
          error: err.message || "Unknown telemetry error.",
        });
      }
    }

    loadTelemetry();

    return () => controller.abort();
  }, [squadId, retryTick]);

  return (
    <main className="telemetry-app">
      <header className="telemetry-header">
        <p className="eyebrow">KRAFTON × PUBG VIETNAM SERIES</p>
        <h1>Live Match Telemetry</h1>
        <p>Squad monitoring radar · Simulated telemetry feed</p>
      </header>

      <section className="squad-selector" aria-label="Select PUBG squad">
        {PUBG_VN_SQUADS.map((squad) => (
          <button
            key={squad.id}
            type="button"
            className={squadId === squad.id ? "squad-button active" : "squad-button"}
            aria-pressed={squadId === squad.id}
            onClick={() => setSquadId(squad.id)}
          >
            {squad.id.toUpperCase()}
            <span>{squad.name}</span>
          </button>
        ))}
      </section>

      {view.status === "IDLE" && (
        <section className="telemetry-panel">
          <p>Select a squad to begin telemetry.</p>
        </section>
      )}

      {view.status === "LOADING" && (
        <section className="telemetry-panel" aria-busy="true">
          <p className="status-label">SYNCING SATELLITE TELEMETRY…</p>
          <div className="skeleton-card">
            <div className="skeleton-line wide" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </section>
      )}

      {view.status === "ERROR" && (
        <section className="telemetry-panel error-panel" role="alert">
          <p className="status-label">BLUE-ZONE LINK LOST</p>
          <p>{view.error}</p>
          <button
            type="button"
            className="retry-button"
            onClick={() => setRetryTick((tick) => tick + 1)}
          >
            Reconnect Satellite (Retry)
          </button>
        </section>
      )}

      {view.status === "SUCCESS" && view.data && (
        <article className="telemetry-panel squad-details" aria-live="polite">
          <div className="details-heading">
            <div>
              <p className="status-label">TELEMETRY ONLINE</p>
              <h2>{view.data.name}</h2>
            </div>
            <span className="online-indicator">LIVE SIMULATION</span>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Map</span>
              <strong>{view.data.map}</strong>
            </div>
            <div className="stat-card">
              <span>Phase</span>
              <strong>{view.data.phase}</strong>
            </div>
            <div className="stat-card">
              <span>Players Alive</span>
              <strong>{view.data.alive}</strong>
            </div>
            <div className="stat-card">
              <span>Total Kills</span>
              <strong>{view.data.kills}</strong>
            </div>
            <div className="stat-card">
              <span>WWCD Probability</span>
              <strong>{view.data.wwcdProb}</strong>
            </div>
            <div className="stat-card">
              <span>Squad Status</span>
              <strong>{view.data.status}</strong>
            </div>
          </div>
        </article>
      )}
    </main>
  );
}
