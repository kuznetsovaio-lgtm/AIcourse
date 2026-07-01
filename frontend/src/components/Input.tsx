import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #e5e7eb",
          backgroundColor: "#fff",
          color: "#032147",
          fontSize: 14,
          outline: "none",
          transition: "all 0.15s ease",
          fontFamily: "inherit",
          ...style,
        }}
        {...props}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#209dd7";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(32, 157, 215, 0.1)";
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "none";
          if (props.onBlur) props.onBlur(e);
        }}
      />
    );
  }
);

Input.displayName = "Input";
