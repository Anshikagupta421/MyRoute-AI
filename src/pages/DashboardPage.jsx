import { FiArrowRight, FiBarChart2, FiChevronRight, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

export default function DashboardPage() {
  const { currentUser } = useAuth();

  // 🛑 Agar user load nahi hua abhi tak
  if (!currentUser) {
    return <h1>Loading...</h1>;
  }

  // ✅ Safe stats (no crash)
  const stats = [
    {
      icon: FiBarChart2,
      label: "Total trips",
      value: currentUser?.stats?.trips ?? 0,
      note: "Ready when you are",
    },
    {
      icon: FiArrowRight,
      label: "Routes selected",
      value: currentUser?.stats?.routes ?? 0,
      note: "Your journey starts here",
    },
    {
      icon: FiUsers,
      label: "Acceptance rate",
      value: `${currentUser?.stats?.acceptance ?? 0}%`,
      note: "Personalized over time",
    },
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Overview</span>

          {/* ✅ Safe name */}
          <h1>
            Welcome back, {currentUser?.name?.split(" ")[0] || "User"}
          </h1>

          <p>Your personal route workspace, all in one place.</p>
        </div>

        <div className="date-chip">
          September 2026 <FiChevronRight />
        </div>
      </div>

      <section className="profile-banner">
        <div className="profile-banner-copy">
          <span className="eyebrow">Your profile</span>
          <h2>Ready for your next move?</h2>
          <p>
            Keep your profile up to date for a more personal experience as
            MyRoute grows.
          </p>

          <NavLink to="/profile" className="text-link">
            View profile <FiArrowRight />
          </NavLink>
        </div>

        <Avatar user={currentUser} />
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">Your activity</span>
          <h2>At a glance</h2>
        </div>
        <span className="muted">Lifetime overview</span>
      </section>

      <div className="stats-grid">
        {stats.map(({ icon: Icon, label, value, note }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon />
            </div>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>

      <section className="next-section">
        <div>
          <span className="eyebrow">Your journey</span>
          <h2>More meaningful routes are ahead.</h2>
          <p>
            We are building a calmer, smarter way to get where you are going.
            Your dashboard will grow with you.
          </p>
        </div>
      </section>
    </div>
  );
}