import styled from "@emotion/styled";
import type { HTMLAttributes, ReactNode } from "react";

interface CountPillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export const CountPill = ({ children, ...props }: CountPillProps) => (
  <StyledCountPill {...props}>{children}</StyledCountPill>
);

const StyledCountPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-inverse);
  color: var(--app-inverse-text);
  padding: 5px 9px;
  font-size: 0.64rem;
  font-weight: 900;
  white-space: nowrap;
`;
