import { rankRoutes } from "./routeService";

export function getRecommendation() {
  return rankRoutes()[0];
}

export function getRouteInsights() {
  return ["Traffic expected to increase after 6 PM.", "Route B currently offers better reliability.", "Route C is cheaper but slower.", "Route A provides balanced performance."];
}
