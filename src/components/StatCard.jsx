const StatCard = ({ icon, label, value, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value ?? '—'}</p>
    </div>
  </div>
);

export default StatCard;
