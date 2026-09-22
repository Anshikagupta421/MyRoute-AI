import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import RoutePlanningPage from "./pages/RoutePlanningPage";
import SafetyCenterPage from "./pages/SafetyCenterPage";
import RouteHistoryPage from "./pages/RouteHistoryPage";
import AIInsightsPage from "./pages/AIInsightsPage";

export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<LoginPage />} /><Route path="/signup" element={<SignupPage />} /><Route element={<Sidebar />}><Route path="/dashboard" element={<DashboardPage />} /><Route path="/plan-route" element={<RoutePlanningPage />} /><Route path="/route-history" element={<RouteHistoryPage />} /><Route path="/safety-center" element={<SafetyCenterPage />} /><Route path="/ai-insights" element={<AIInsightsPage />} /><Route path="/profile" element={<ProfilePage />} /></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></BrowserRouter></AuthProvider>;
}
