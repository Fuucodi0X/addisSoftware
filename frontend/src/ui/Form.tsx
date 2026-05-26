import { Children, cloneElement, isValidElement } from "react";
import type { InputHTMLAttributes, ReactNode, ReactElement, SelectHTMLAttributes } from "react";
import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";

export type FieldTone = "neutral" | "danger";
export type FeedbackTone = "danger" | "neutral";

export interface FieldProps {
  children: ReactElement<FieldControlProps> | ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: ReactNode;
  tone?: FieldTone;
  disabled?: boolean;
  wide?: boolean;
}

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size">;
type NativeSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "color" | "size">;

export interface InputProps extends NativeInputProps {
  hasError?: boolean;
}

export interface SelectProps extends NativeSelectProps {
  hasError?: boolean;
}

export interface FormFeedbackProps {
  children: ReactNode;
  tone?: FeedbackTone;
  role?: "alert" | "status";
}

interface FieldControlProps {
  "aria-describedby"?: string;
  disabled?: boolean;
  hasError?: boolean;
  id?: string;
}

const FieldShell = styled.div<{ $disabled?: boolean; $wide?: boolean }>(({ $disabled, $wide }) => ({
  display: "grid",
  gap: 7,
  gridColumn: $wide ? "1 / -1" : "auto",
  opacity: $disabled ? 0.62 : 1
}));

const Label = styled.label<{ $tone: FieldTone }>(({ theme, $tone }) => ({
  color: $tone === "danger" ? theme.colors.intent.danger : theme.colors.text.secondary,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.medium,
  lineHeight: theme.lineHeights.tight
}));

const FieldMessage = styled.p<{ $tone: FieldTone }>(({ theme, $tone }) => ({
  color: $tone === "danger" ? theme.colors.intent.danger : theme.colors.text.secondary,
  fontSize: theme.fontSizes.sm,
  fontWeight: theme.fontWeights.regular,
  lineHeight: theme.lineHeights.body,
  margin: 0
}));

const controlStyles = ({ theme, $hasError }: { theme: Theme; $hasError?: boolean }) => ({
  background: theme.colors.surface.panel,
  border: `1px solid ${$hasError ? theme.colors.intent.danger : theme.colors.border.default}`,
  borderRadius: theme.radii.sm,
  color: theme.colors.text.primary,
  minHeight: 42,
  outline: "none",
  padding: `${theme.space[3]}px ${theme.space[4]}px`,
  transition: "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
  width: "100%",

  "&::placeholder": {
    color: theme.colors.text.muted
  },

  "&:focus-visible": {
    borderColor: $hasError ? theme.colors.intent.danger : theme.colors.focus.ring,
    boxShadow: theme.colors.focus.shadow
  },

  "&:disabled": {
    background: theme.palette.zinc[100],
    color: theme.colors.text.muted,
    cursor: "not-allowed"
  },

  '&[aria-invalid="true"]': {
    borderColor: theme.colors.intent.danger
  }
});

const StyledInput = styled.input<{ $hasError?: boolean }>(controlStyles);

const StyledSelect = styled.select<{ $hasError?: boolean }>(({ theme, $hasError }) => ({
  ...controlStyles({ theme, $hasError }),
  appearance: "none",
  backgroundImage: `linear-gradient(45deg, transparent 50%, ${theme.colors.text.secondary} 50%), linear-gradient(135deg, ${theme.colors.text.secondary} 50%, transparent 50%)`,
  backgroundPosition: "calc(100% - 18px) 18px, calc(100% - 13px) 18px",
  backgroundRepeat: "no-repeat",
  backgroundSize: "5px 5px, 5px 5px",
  paddingRight: theme.space[8]
}));

const Feedback = styled.div<{ $tone: FeedbackTone }>(({ theme, $tone }) => {
  const danger = $tone === "danger";

  return {
    background: danger ? theme.colors.intent.dangerSoft : theme.colors.surface.panelSubtle,
    border: `1px solid ${danger ? theme.palette.rose[100] : theme.colors.border.default}`,
    borderRadius: theme.radii.sm,
    color: danger ? theme.colors.intent.danger : theme.colors.text.secondary,
    display: "grid",
    gap: theme.space[2],
    padding: `${theme.space[4]}px ${theme.space[5]}px`,

    p: {
      fontSize: theme.fontSizes.sm,
      fontWeight: theme.fontWeights.medium,
      lineHeight: theme.lineHeights.body,
      margin: 0
    }
  };
});

export const Field = ({ children, disabled, error, hint, htmlFor, label, tone, wide }: FieldProps) => {
  const fieldTone = tone ?? (error ? "danger" : "neutral");
  const descriptionId = error || hint ? `${htmlFor}-description` : undefined;
  const onlyChild = Children.count(children) === 1 ? Children.only(children) : children;
  const control = isValidElement<FieldControlProps>(onlyChild)
    ? cloneElement(onlyChild, {
        "aria-describedby": onlyChild.props["aria-describedby"] ?? descriptionId,
        disabled: onlyChild.props.disabled ?? disabled,
        hasError: onlyChild.props.hasError ?? Boolean(error),
        id: onlyChild.props.id ?? htmlFor
      })
    : children;

  return (
    <FieldShell $disabled={disabled} $wide={wide}>
      <Label htmlFor={htmlFor} $tone={fieldTone}>
        {label}
      </Label>
      {control}
      {error ? (
        <FieldMessage id={descriptionId} $tone="danger">
          {error}
        </FieldMessage>
      ) : hint ? (
        <FieldMessage id={descriptionId} $tone="neutral">
          {hint}
        </FieldMessage>
      ) : null}
    </FieldShell>
  );
};

export const Input = ({ hasError, "aria-invalid": ariaInvalid, ...props }: InputProps) => (
  <StyledInput $hasError={hasError} aria-invalid={ariaInvalid ?? (hasError ? true : undefined)} {...props} />
);

export const Select = ({ hasError, "aria-invalid": ariaInvalid, children, ...props }: SelectProps) => (
  <StyledSelect $hasError={hasError} aria-invalid={ariaInvalid ?? (hasError ? true : undefined)} {...props}>
    {children}
  </StyledSelect>
);

export const FormFeedback = ({ children, role, tone = "danger" }: FormFeedbackProps) => (
  <Feedback $tone={tone} role={role ?? (tone === "danger" ? "alert" : "status")}>
    {children}
  </Feedback>
);
