import styled from "@emotion/styled";
import { Plus } from "lucide-react";

interface FloatingAddSongButtonProps {
  onClick: () => void;
}

export const FloatingAddSongButton = ({ onClick }: FloatingAddSongButtonProps) => (
  <FloatingAdd id="sidebar-create-btn" type="button" title="Add Song" onClick={onClick}>
    <Plus size={21} />
  </FloatingAdd>
);

const FloatingAdd = styled.button`
  position: absolute;
  right: 32px;
  bottom: 108px;
  z-index: 10;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 1px solid var(--app-brand-border);
  border-radius: ${({ theme }) => theme.radii.full}px;
  background: var(--app-brand);
  color: var(--app-on-brand);
  box-shadow: var(--app-shadow-floating-action);

  &:hover {
    background: var(--app-brand-hover);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[2]}) {
    right: 16px;
    bottom: 168px;
    width: 48px;
    height: 48px;
  }
`;
