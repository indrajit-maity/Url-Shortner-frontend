import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, type = "text", id, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const inputId = id ?? rest.name;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword && show ? "text" : type}
            aria-invalid={!!error}
            className={`w-full rounded-md border bg-white px-3.5 py-2.5 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 ${
              error ? "border-danger" : "border-line"
            } ${isPassword ? "pr-11" : ""}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink/50 hover:text-ink"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export default FormField;