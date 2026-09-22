const safetyProfiles = {
  recommended: { safety: 92, night: 89, lighting: "High", police: "Medium", emergency: "High", crowd: "High", monitoring: "High" },
  safest: { safety: 97, night: 94, lighting: "High", police: "High", emergency: "High", crowd: "Medium", monitoring: "High" },
  fastest: { safety: 84, night: 78, lighting: "Medium", police: "Medium", emergency: "High", crowd: "Medium", monitoring: "Medium" },
  cheapest: { safety: 76, night: 68, lighting: "Low", police: "Low", emergency: "Medium", crowd: "High", monitoring: "Low" },
};
export function getSafetyProfile(routeId, safetyMode = false) {
  const profile = safetyProfiles[routeId] || safetyProfiles.recommended;
  const safety = Math.min(100, profile.safety + (safetyMode ? 2 : 0));
  const night = Math.min(100, profile.night + (safetyMode ? 3 : 0));
  return { ...profile, safety, night, risk: safety >= 90 ? "Low Risk" : safety >= 78 ? "Medium Risk" : "High Risk", badge: safety >= 90 ? "Very Safe" : safety >= 78 ? "Moderate" : "High Risk" };
}
export function isNightTravel(time) {
  if (!time) return false;
  const hour = Number(time.split(":")[0]);
  return hour >= 20 || hour < 6;
}
export function getSafetyInsights(safetyMode, nightTravel) {
  const insights = ["Route B passes through better-lit roads.", "Route C has stronger public activity.", "Route A provides faster emergency access."];
  if (safetyMode) insights.unshift("Safety mode is prioritizing lighting, monitoring and emergency access.");
  if (nightTravel) insights.push("Night analysis favors routes with stronger lighting and monitoring availability.");
  return insights;
}
