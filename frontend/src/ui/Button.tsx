import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button = ({ children, className = "", variant = "secondary", ...props }: ButtonProps) => (
  <button className={`button button-${variant} ${className}`.trim()} type="button" {...props}>
    {children}
  </button>
);
