import { FiBarChart2, FiCheck, FiCompass, FiTrendingUp } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getRecommendation, getRouteInsights } from "../services/recommendationService";
import { rankRoutes } from "../services/routeService";

export default function AIInsightsPage() {
  const { currentUser } = useAuth();
  const recommendation = getRecommendation();
  const routes = rankRoutes();
  const preference = currentUser.routePreferences?.preferredRouteType || "Balanced";
  const insights = getRouteInsights();
  return <div className="page insights-page"><div className="page-heading"><div><span className="eyebrow">Decision support</span><h1>AI insights</h1><p>Clear signals from your route options and travel choices.</p></div><div className="insights-page-badge"><FiBarChart2 /> Personal view</div></div><section className="insights-hero"><div className="insights-hero-icon"><FiCompass /></div><div><span className="eyebrow">Current recommendation</span><h2>{recommendation.name}</h2><p>A balanced option at {recommendation.time}, {recommendation.distance}, and {recommendation.fare}.</p></div><strong>{recommendation.confidence}%<small>confidence</small></strong></section><div className="insights-page-grid"><section className="insights-content-card card"><div className="insights-card-heading"><div><span className="eyebrow">What we see</span><h2>Travel insights</h2></div><FiTrendingUp /></div><div className="insight-page-list">{insights.map((insight) => <div key={insight}><FiCheck /><span>{insight}</span></div>)}</div></section><section className="insights-content-card card"><div className="insights-card-heading"><div><span className="eyebrow">Your direction</span><h2>Preferred route type</h2></div><FiCompass /></div><div className="preference-value">{preference}</div><p className="insights-muted">This preference is saved from your route selections and can guide future recommendations.</p></section></div><section className="insights-rankings card"><div className="insights-card-heading"><div><span className="eyebrow">Across your options</span><h2>Route signals</h2></div></div><div className="insight-ranking-list">{routes.map((route) => <div key={route.id}><span className="ranking-color" style={{ background: route.color }} /><strong>#{route.rank} {route.name}</strong><span>{route.confidence}% confidence</span><b>{route.badge}</b></div>)}</div></section></div>;
}
