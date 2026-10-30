const StatusBadge = ({ status }) => {
  const map = {
    'Pending':     { cls: 'badge-pending',  dot: '🟡', label: 'Pending' },
    'In Progress': { cls: 'badge-progress', dot: '🔵', label: 'In Progress' },
    'Resolved':    { cls: 'badge-resolved', dot: '🟢', label: 'Resolved' },
  };
  const info = map[status] || { cls: '', dot: '⚪', label: status };
  return (
    <span className={`badge ${info.cls}`}>
      {info.dot} {info.label}
    </span>
  );
};

export default StatusBadge;
