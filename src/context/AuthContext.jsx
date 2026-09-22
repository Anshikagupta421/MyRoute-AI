import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createId, readStorage, SESSION_KEY, USERS_KEY } from "../services/storageService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, []));
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(SESSION_KEY));
  useEffect(() => localStorage.setItem(USERS_KEY, JSON.stringify(users)), [users]);
  useEffect(() => sessionId ? localStorage.setItem(SESSION_KEY, sessionId) : localStorage.removeItem(SESSION_KEY), [sessionId]);
  const currentUser = users.find((user) => user.id === sessionId) ?? null;
  const register = (data) => {
    if (users.some((user) => user.email.toLowerCase() === data.email.toLowerCase())) return "An account with this email already exists.";
    const user = { ...data, id: createId(), email: data.email.toLowerCase(), stats: { trips: 0, routes: 0, acceptance: 0 }, tripHistory: [] };
    setUsers((items) => [...items, user]); setSessionId(user.id); return null;
  };
  const login = (email, password) => {
    const user = users.find((item) => item.email === email.trim().toLowerCase() && item.password === password);
    if (!user) return "The email or password you entered is incorrect.";
    setSessionId(user.id); return null;
  };
  const updateUser = (changes) => {
    if (users.some((user) => user.id !== sessionId && user.email === changes.email.trim().toLowerCase())) return "That email is already in use.";
    setUsers((items) => items.map((user) => user.id === sessionId ? { ...user, ...changes, email: changes.email.trim().toLowerCase() } : user)); return null;
  };
  const saveTrip = (trip) => setUsers((items) => items.map((user) => user.id === sessionId ? { ...user, latestTrip: trip, tripHistory: [...(user.tripHistory || []), trip] } : user));
  const saveRouteFeedback = (routeId, preferredType) => setUsers((items) => items.map((user) => user.id === sessionId ? { ...user, routePreferences: { selectedRoutes: [...new Set([...(user.routePreferences?.selectedRoutes || []), routeId])], rejectedRoutes: user.routePreferences?.rejectedRoutes || [], preferredRouteType: preferredType || user.routePreferences?.preferredRouteType || "Balanced" } } : user));
  const addTrustedContact = (contact) => setUsers((items) => items.map((user) => user.id === sessionId ? { ...user, trustedContacts: [...(user.trustedContacts || []), contact] } : user));
  const updateTrustedContact = (originalPhone, contact) => setUsers((items) => items.map((user) => user.id === sessionId ? { ...user, trustedContacts: (user.trustedContacts || []).map((item) => item.phone === originalPhone ? contact : item) } : user));
  const removeTrustedContact = (phone) => setUsers((items) => items.map((user) => user.id === sessionId ? { ...user, trustedContacts: (user.trustedContacts || []).filter((contact) => contact.phone !== phone) } : user));
  const value = useMemo(() => ({ currentUser, register, login, logout: () => setSessionId(null), updateUser, saveTrip, saveRouteFeedback, addTrustedContact, updateTrustedContact, removeTrustedContact }), [currentUser, users]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
