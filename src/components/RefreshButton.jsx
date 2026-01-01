import { RefreshCw } from "lucide-react";

const RefreshButton = ({
  onRefresh,
  loading = false,
  disabled = false,
  size = "default",
  className = "",
  title = "Refresh data",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={onRefresh}
      disabled={disabled || loading}
      title={title}
      className={`
        ${sizeClasses[size]}
        ${className}
        flex items-center justify-center
        bg-white hover:bg-gray-50
        border border-gray-200 hover:border-gray-300
        rounded-xl shadow-sm hover:shadow-md
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-[#3ABBD0] focus:ring-offset-2
      `}
      aria-label={title}
    >
      <RefreshCw
        className={`
          ${iconSizes[size]}
          text-[#3ABBD0]
          transition-transform duration-200
          ${loading ? "animate-spin" : "hover:rotate-180"}
        `}
      />
    </button>
  );
};

export default RefreshButton;
