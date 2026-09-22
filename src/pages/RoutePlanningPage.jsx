import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiAlertTriangle,
  FiBarChart2,
  FiCalendar,
  FiCheck,
  FiClock,
  FiMapPin,
  FiMoon,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { geocodeLocation, rankRoutes } from "../services/routeService";
import { getRouteInsights } from "../services/recommendationService";
import AIRecommendationCard from "../components/AIRecommendationCard";
import LocationSearch from "../components/LocationSearch";
import MapView from "../components/MapView";
import PassengerSelector from "../components/PassengerSelector";
import RouteCard from "../components/RouteCard";
import RouteComparison from "../components/RouteComparison";
import TripSummary from "../components/TripSummary";
import TrustedContacts from "../components/TrustedContacts";
import { SafetyBanner, SafetyBreakdown, SafetyInsights, SafetyModeToggle } from "../components/SafetyPanel";
import { getSafetyProfile, isNightTravel } from "../services/safetyService";
import EmergencyPanel from "../components/EmergencyPanel";
import SafetyTimeline from "../components/SafetyTimeline";
import { getDriverProfile, getOverallSafety } from "../services/driverService";
import { DriverDetailsModal } from "../components/DriverCard";
const suggestionGroups = {
  railway: [
    "Railway Station",
    "New Delhi Railway Station",
    "Anand Vihar Railway Station",
    "Ghaziabad Railway Station",
  ],
  air: ["Delhi Airport", "IGI Airport Terminal 3", "Airport Metro Station"],
  college: ["College", "ABES Engineering College", "Delhi University"],
  hospital: ["Hospital", "Max Hospital", "Fortis Hospital"],
  mall: ["Mall", "Pacific Mall", "Shipra Mall"],
};
function getSuggestions(value) {
  const query = value.trim().toLowerCase();
  if (!query) return [];
  return [
    ...new Set(
      Object.values(suggestionGroups)
        .flat()
        .filter((item) => item.toLowerCase().includes(query)),
    ),
  ].slice(0, 5);
}
function RecommendationDetails({ route, safetyProfile, nightTravel, driver, overallSafety }) {
  return (
    <section className="selected-route-panel">
      <div className="selected-route-heading">
        <div>
          <span className="eyebrow">Selected route</span>
          <h2>{route.name}</h2>
        </div>
        <span className="selected-route-badge" style={{ color: route.color }}>
          #{route.rank} {route.rankLabel}
        </span>
      </div>
      <div className="selected-route-grid">
        <div>
          <FiTrendingUp />
          <span>
            <small>Why it fits you</small>
            <strong>
              {route.type === "Balanced"
                ? "Strong balance of time, cost and reliability"
                : `Optimized for ${route.type.toLowerCase()} travel`}
            </strong>
          </span>
        </div>
        <div>
          <FiCheck />
          <span>
            <small>Advantages</small>
            <strong>
              {route.rationale[0]} · {route.rationale[1]}
            </strong>
          </span>
        </div>
        <div>
          <FiArrowRight />
          <span>
            <small>Trade-offs</small>
            <strong>
              {route.id === "cheapest"
                ? "Higher traffic and a longer ETA"
                : "Fare may vary with live conditions"}
            </strong>
          </span>
        </div>
      </div>
      <SafetyBreakdown profile={safetyProfile} nightTravel={nightTravel} />
      <div className="dual-safety-panel"><span><small>Route Safety</small><strong>{safetyProfile.safety}</strong></span><b>+</b><span><small>Driver Trust</small><strong>{driver.trust}</strong></span><b>=</b><span><small>Overall Safety</small><strong>{overallSafety}</strong></span></div>
      <div className="driver-trust-insight"><strong>Why This Driver Is Trusted</strong><p>✓ High ride completion rate · ✓ Excellent passenger feedback · ✓ Verified identity · ✓ Low complaint history</p></div>
    </section>
  );
}
function Insights() {
  return (
    <section className="insights-panel">
      <div className="insights-title">
        <FiBarChart2 />
        <div>
          <span className="eyebrow">Pattern-aware guidance</span>
          <h2>AI Travel Insights</h2>
        </div>
      </div>
      <div className="insight-list">
        {getRouteInsights().map((insight) => (
          <p key={insight}>{insight}</p>
        ))}
      </div>
    </section>
  );
}
function RecommendationLayer({ form }) {
  const { saveRouteFeedback } = useAuth();
  const [coordinates, setCoordinates] = useState([]);
  const [activeRoute, setActiveRoute] = useState("recommended");
  const [geocoding, setGeocoding] = useState(true);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [deviation, setDeviation] = useState(false);
  const [safetyMode, setSafetyMode] = useState(false);
  const routes = rankRoutes();
  const selectedRoute =
    routes.find((route) => route.id === activeRoute) || routes[0];
  const recommendation = routes[0];
  const nightTravel = isNightTravel(form.time);
  const safetyRoutes = routes.map((route) => ({ ...route, safetyProfile: getSafetyProfile(route.id, safetyMode) }));
  const safetySelectedRoute = safetyRoutes.find((route) => route.id === activeRoute) || safetyRoutes[0];
  const [selectedDriver, setSelectedDriver] = useState(null);
  const enrichedRoutes = safetyRoutes.map((route) => ({ ...route, driver: getDriverProfile(route.id), overallSafety: getOverallSafety(route.safetyProfile.safety, getDriverProfile(route.id).trust) }));
  const enrichedSelectedRoute = enrichedRoutes.find((route) => route.id === activeRoute) || enrichedRoutes[0];
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      geocodeLocation(form.pickup),
      geocodeLocation(form.destination),
    ]).then((points) => {
      if (!cancelled) {
        setCoordinates(points.filter(Boolean));
        setGeocoding(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [form.pickup, form.destination]);
  const selectRoute = (route) => {
    setActiveRoute(route.id);
    saveRouteFeedback(route.id, route.type);
  };
  return (
    <section className="recommendation-layer">
      <div className={`active-trip-status ${deviation ? "emergency-status" : ""}`}><span /> {deviation ? "Emergency Triggered" : "Safe Journey"}<small>Active trip protection</small></div>
      <SafetyModeToggle enabled={safetyMode} onChange={setSafetyMode} />
      <SafetyBanner enabled={safetyMode} />
      {nightTravel && <div className="night-protection-banner"><FiMoon /><strong>Night Travel Protection Active</strong><span>Routes are being reviewed for lighting, activity, access and monitoring.</span></div>}
      <AIRecommendationCard recommendation={recommendation} />
      <div className="route-visualization">
        <div className="route-options-panel">
          <div className="route-panel-heading">
            <div>
              <span className="eyebrow">Ranked options</span>
              <h2>Choose your route</h2>
            </div>
            <span className="route-count">4 ranked</span>
          </div>
          {enrichedRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              active={activeRoute === route.id}
              onSelect={selectRoute}
              onHover={setActiveRoute}
              onDriverClick={setSelectedDriver}
            />
          ))}
        </div>
        <MapView
          coordinates={coordinates}
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
          geocoding={geocoding}
        />
      </div>
      <RecommendationDetails route={selectedRoute} safetyProfile={safetySelectedRoute.safetyProfile} nightTravel={nightTravel} driver={enrichedSelectedRoute.driver} overallSafety={enrichedSelectedRoute.overallSafety} />
      <RouteComparison
        routes={enrichedRoutes}
        activeRoute={activeRoute}
        onSelect={selectRoute}
      />
      <Insights />
      <SafetyInsights safetyMode={safetyMode} nightTravel={nightTravel} />
      <TrustedContacts />
      <SafetyTimeline deviation={deviation} />
      {deviation && <div className="deviation-alert"><strong>⚠ Route Deviation Detected</strong><span>Expected Route: Planned corridor · Current Route: Alternate road · Deviation Distance: 1.4 km</span></div>}
      <button className="simulate-deviation" onClick={() => setDeviation(!deviation)}>{deviation ? "Clear demo deviation" : "Simulate route deviation"}</button>
      <DriverDetailsModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
      {emergencyOpen && <EmergencyPanel onClose={() => setEmergencyOpen(false)} />}
      <button className="floating-sos" onClick={() => setEmergencyOpen(true)}><FiAlertTriangle /> SOS</button>
    </section>
  );
}
export default function RoutePlanningPage() {
  const { saveTrip } = useAuth();
  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    passengers: 1,
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState({
    field: null,
    index: -1,
  });
  const setField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    setError("");
    setStatus("");
    setActiveSuggestions({ field, index: -1 });
  };
  const chooseLocation = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");
    setStatus("");
    setActiveSuggestions({ field: null, index: -1 });
  };
  const locationProps = (field, label, placeholder) => {
    const suggestions = getSuggestions(form[field]);
    const show = activeSuggestions.field === field && suggestions.length > 0;
    const onKeyDown = (event) => {
      if (!suggestions.length) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        setActiveSuggestions({
          field,
          index:
            (activeSuggestions.field === field
              ? activeSuggestions.index + delta
              : delta > 0
                ? 0
                : suggestions.length - 1 + delta) % suggestions.length,
        });
      } else if (
        event.key === "Enter" &&
        activeSuggestions.field === field &&
        activeSuggestions.index >= 0
      ) {
        event.preventDefault();
        chooseLocation(field, suggestions[activeSuggestions.index]);
      } else if (event.key === "Escape")
        setActiveSuggestions({ field: null, index: -1 });
    };
    return {
      label,
      placeholder,
      value: form[field],
      suggestions: show ? suggestions : [],
      activeIndex:
        activeSuggestions.field === field ? activeSuggestions.index : -1,
      onChange: setField(field),
      onChoose: (value) => chooseLocation(field, value),
      onKeyDown,
      onFocus: () => setActiveSuggestions({ field, index: -1 }),
      onBlur: () =>
        setTimeout(() => setActiveSuggestions({ field: null, index: -1 }), 120),
    };
  };
  const submit = (event) => {
    event.preventDefault();
    if (!form.pickup.trim() || !form.destination.trim())
      return setError(
        "Add both a pickup location and destination to find routes.",
      );
    setLoading(true);
    setTimeout(() => {
      saveTrip({ ...form, createdAt: new Date().toISOString() });
      setLoading(false);
      setStatus("Route search completed successfully.");
    }, 650);
  };
  return (
    <div className="page planner-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Route planning</span>
          <h1>Plan your next move</h1>
          <p>Tell us where you are starting and where you want to go.</p>
        </div>
        <div className="planner-badge">
          <FiMapPin /> Route workspace
        </div>
      </div>
      <div className="planner-layout">
        <section className="planner-card card">
          <div className="planner-card-heading">
            <div>
              <span className="eyebrow">Trip details</span>
              <h2>Where are you headed?</h2>
            </div>
            <span className="step-count">
              01 <span>/ 01</span>
            </span>
          </div>
          <form onSubmit={submit}>
            <div className="location-fields">
              <LocationSearch
                {...locationProps(
                  "pickup",
                  "Pickup location",
                  "Enter pickup location",
                )}
              />
              <div className="route-connector">
                <span />
              </div>
              <LocationSearch
                {...locationProps(
                  "destination",
                  "Destination location",
                  "Enter destination",
                )}
              />
            </div>
            <div className="trip-options">
              <label>
                <span>
                  <FiCalendar /> Travel date
                </span>
                <input
                  type="date"
                  value={form.date}
                  onChange={setField("date")}
                />
              </label>
              <label>
                <span>
                  <FiClock /> Travel time
                </span>
                <input
                  type="time"
                  value={form.time}
                  onChange={setField("time")}
                />
              </label>
              <PassengerSelector
                value={form.passengers}
                onChange={(passengers) => setForm({ ...form, passengers })}
              />
            </div>
            {error && <div className="planner-error">{error}</div>}
            <button
              className="find-routes-button primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-dot" /> Finding routes...
                </>
              ) : (
                <>
                  <FiSearch /> Find routes
                </>
              )}
            </button>
          </form>
        </section>
        <TripSummary form={form} />
      </div>
      {status ? (
        <RecommendationLayer form={form} />
      ) : (
        <section className="result-placeholder">
          <div className="empty-route-icon">
            <FiMapPin />
          </div>
          <div>
            <strong>No routes generated yet.</strong>
            <p>
              Enter trip details and click Find Routes to explore available
              route options.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
