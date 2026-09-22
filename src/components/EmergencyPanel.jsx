import { useState } from "react";
import { FiAlertTriangle, FiBell, FiMapPin, FiPhone, FiShield, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function EmergencyPanel({ onClose }) {
  const { currentUser } = useAuth();
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState("");
  const contacts = currentUser.trustedContacts || [];
  const announce = (message) => setStatus(message);
  return <div className="emergency-backdrop" onClick={onClose}><section className="emergency-panel" role="dialog" aria-modal="true" aria-label="Emergency panel" onClick={(event) => event.stopPropagation()}><button className="emergency-close" onClick={onClose} aria-label="Close emergency panel"><FiX /></button><div className="emergency-panel-heading"><div className="emergency-alert-icon"><FiAlertTriangle /></div><div><span className="eyebrow">Demo mode</span><h2>Emergency support</h2><p>Choose an action. No real calls or alerts are placed.</p></div></div><div className="emergency-status emergency-status-alert"><span /> Emergency workflow ready</div><div className="emergency-actions"><button onClick={() => announce("Emergency contact call simulated.")}><FiPhone /><span>Call Emergency Contact<small>Use your primary contact</small></span></button><button onClick={() => { setSharing(true); announce("Live location sharing simulated."); }}><FiMapPin /><span>{sharing ? "Live Location Sharing Active" : "Share Live Location"}<small>{sharing ? "Sharing with trusted contacts" : "Start a demo share"}</small></span></button><button onClick={() => announce(`${contacts.length || "No"} trusted contact${contacts.length === 1 ? "" : "s"} alerted in demo mode.`)}><FiBell /><span>Alert Trusted Contacts<small>Notify saved contacts</small></span></button><button onClick={() => announce("Emergency services contact simulated.")}><FiShield /><span>Contact Emergency Services<small>Demo response only</small></span></button></div>{sharing && <div className="sharing-card"><FiMapPin /><div><strong>Live Location Sharing Active</strong><p>Sharing with: {contacts.length ? contacts.map((contact) => `${contact.name} (${contact.phone})`).join(", ") : "No trusted contacts yet"}</p></div></div>}{status && <div className="emergency-feedback">{status}</div>}</section></div>;
}
