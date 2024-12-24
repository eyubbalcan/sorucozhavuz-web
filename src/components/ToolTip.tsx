import React, { useEffect } from "react";
import * as bootstrap from "bootstrap";

interface IToolTip {
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right" | "auto";
  title?: string;
}

const Tooltip: React.FC<IToolTip> = ({
  children,
  placement = "top",
  title,
}) => {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <span data-bs-toggle="tooltip" data-bs-placement={placement} title={title}>
      {children}
    </span>
  );
};

export default Tooltip;
