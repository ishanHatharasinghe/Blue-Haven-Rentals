import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  name,
  value,
  onChange,
  placeholder = "Enter your password",
  className = "",
  error = false,
  showIcon = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative group">
      {showIcon && (
        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
      )}
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full ${showIcon ? 'pl-14' : 'pl-6'} pr-14 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
          error
            ? "border-red-500"
            : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
        } ${className}`}
        placeholder={placeholder}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3ABBD0] transition-colors duration-200 z-10"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
      <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default PasswordInput;
