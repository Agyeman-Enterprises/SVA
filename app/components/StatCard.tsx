import "./StatCard.css";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  variant?: "streak" | "points" | "courses" | "assignments";
  decoration?: string;
}

export default function StatCard({ value, label, icon, variant = "courses", decoration }: StatCardProps) {
  return (
    <div className={`sva-stat-card sva-stat-${variant}`}>
      <div className="sva-stat-icon">{icon}</div>
      <div className="sva-stat-content">
        <span className="sva-stat-value">{value}</span>
        <span className="sva-stat-label">{label}</span>
      </div>
      {decoration && <div className="sva-stat-decoration">{decoration}</div>}
    </div>
  );
}

