import type { ReactNode } from "react";
import { Button } from "./Button";

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
        <Button className="icon-button" variant="ghost" onClick={onClose} aria-label={`Close ${title}`}>
          x
        </Button>
      </div>
      {children}
    </section>
  </div>
);
