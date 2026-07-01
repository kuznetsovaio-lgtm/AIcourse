import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "inherit",
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 12px", fontSize: 13 },
    md: { padding: "8px 16px", fontSize: 14 },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: "#753991", color: "#fff" },
    secondary: { backgroundColor: "#753991", color: "#fff" },
    ghost: { backgroundColor: "transparent", color: "#209dd7" },
    danger: { backgroundColor: "#ef4444", color: "#fff" },
  };

  const style = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button
      style={style}
      {...props}
      onMouseEnter={(e) => {
        if (variant === "primary" || variant === "secondary") {
          e.currentTarget.style.backgroundColor = "#5a2d73";
        } else if (variant === "ghost") {
          e.currentTarget.style.backgroundColor = "rgba(32, 157, 215, 0.1)";
        } else if (variant === "danger") {
          e.currentTarget.style.backgroundColor = "#dc2626";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor || "";
      }}
    >
      {children}
    </button>
  );
}
