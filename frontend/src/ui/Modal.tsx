import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./Button";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
  size?: "form" | "confirm";
}

export const Modal = ({ title, children, onClose, labelledBy, size = "form" }: ModalProps) => (
  <div className="modal-backdrop" role="presentation">
    <section className={`modal-panel modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="modal-heading">
        <h2 id={labelledBy}>{title}</h2>
        <IconButton size="sm" variant="ghost" onClick={onClose} aria-label={`Close ${title}`}>
          <X aria-hidden="true" />
        </IconButton>
      </div>
      {children}
    </section>
  </div>
);
