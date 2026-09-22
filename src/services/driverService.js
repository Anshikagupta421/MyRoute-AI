export const driverProfiles = {
  recommended: { name: "Aarav Sharma", vehicle: "Sedan", number: "DL 01 AB 4821", trust: 94, badge: "Gold Driver", trips: 1284, rating: "4.8/5", verification: "Fully verified", completion: "98%", complaints: "Very low", adherence: "97%", behaviour: "Excellent" },
  safest: { name: "Meera Kapoor", vehicle: "Hatchback", number: "UP 16 CD 7290", trust: 96, badge: "Verified Driver", trips: 986, rating: "4.9/5", verification: "Fully verified", completion: "99%", complaints: "Very low", adherence: "98%", behaviour: "Excellent" },
  fastest: { name: "Rohan Verma", vehicle: "Sedan", number: "DL 03 EF 1186", trust: 91, badge: "Silver Driver", trips: 742, rating: "4.7/5", verification: "Verified", completion: "96%", complaints: "Low", adherence: "94%", behaviour: "Very good" },
  cheapest: { name: "Kabir Singh", vehicle: "Compact", number: "HR 26 GH 6044", trust: 86, badge: "Verified Driver", trips: 519, rating: "4.5/5", verification: "Verified", completion: "93%", complaints: "Low", adherence: "91%", behaviour: "Good" },
};
export function getDriverProfile(routeId) { return driverProfiles[routeId] || driverProfiles.recommended; }
export function getOverallSafety(routeSafety, driverTrust) { return Math.round((routeSafety + driverTrust) / 2); }
