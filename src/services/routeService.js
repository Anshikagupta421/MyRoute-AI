export const fallbackLocations = {
  ghaziabad: [28.6692, 77.4538], noida: [28.5355, 77.391], "delhi airport": [28.5562, 77.1], airport: [28.5562, 77.1], railway: [28.643, 77.219], "railway station": [28.643, 77.219], "abes engineering college": [28.6307, 77.3724], college: [28.6307, 77.3724], delhi: [28.6139, 77.209],
};
export const routeOptions = [
  { id: "fastest", name: "Fastest Route", color: "#2f8fc4", time: "25 mins", distance: "18 km", fare: "₹280", toll: "₹80", traffic: "Medium", safety: 84, comfort: 82, confidence: 86, badge: "Fastest", type: "Fastest", rationale: ["Shortest travel time", "Reliable arrival window", "Direct road connection"] },
  { id: "recommended", name: "AI Recommended Route", color: "#42a66b", time: "29 mins", distance: "19 km", fare: "₹250", toll: "₹40", traffic: "Low", safety: 92, comfort: 91, confidence: 89, badge: "AI Recommended", type: "Balanced", rationale: ["Lower traffic", "Better road conditions", "Balanced travel time", "Lower risk level", "Higher route reliability"] },
  { id: "cheapest", name: "Cheapest Route", color: "#e29a3b", time: "36 mins", distance: "22 km", fare: "₹180", toll: "₹0", traffic: "High", safety: 76, comfort: 71, confidence: 78, badge: "Cheapest", type: "Cheapest", rationale: ["Lowest estimated fare", "No toll cost", "Longer travel time trade-off"] },
  { id: "safest", name: "Safest Route", color: "#8e68c4", time: "32 mins", distance: "20 km", fare: "₹265", toll: "₹30", traffic: "Low", safety: 96, comfort: 88, confidence: 91, badge: "Safest", type: "Safest", rationale: ["Highest safety score", "Lower traffic", "More comfortable road profile"] },
];
const recommendationRank = { recommended: 1, safest: 2, cheapest: 3, fastest: 4 };
const rankLabel = { recommended: "Recommended", safest: "Alternative", cheapest: "Budget Friendly", fastest: "Fastest Option" };
const trafficScore = { Low: 100, Medium: 70, High: 40 };
export const rankRoutes = () => [...routeOptions].map((route) => ({ ...route, rank: recommendationRank[route.id], rankLabel: rankLabel[route.id], overallScore: Math.round(route.safety * .28 + route.comfort * .18 + trafficScore[route.traffic] * .22 + (100 - Number.parseInt(route.time)) * .2 + (100 - Number.parseInt(route.fare)) * .12) })).sort((a, b) => a.rank - b.rank);
export async function geocodeLocation(value) {
  const key = value.trim().toLowerCase();
  const fallback = Object.entries(fallbackLocations).find(([name]) => key.includes(name) || name.includes(key))?.[1];
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(value)}`, { headers: { Accept: "application/json" } });
    const results = await response.json();
    return results[0] ? [Number(results[0].lat), Number(results[0].lon)] : fallback;
  } catch { return fallback; }
}
