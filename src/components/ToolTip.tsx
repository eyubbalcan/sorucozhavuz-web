import "./ToolTip.scss";
import React, { useEffect } from "react";

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
    const tooltipElements = document.querySelectorAll("[data-tooltip]");

    tooltipElements.forEach((el) => {
      el.addEventListener("mouseenter", (e: Event) => {
        const tooltip = document.createElement("div");
        tooltip.className = "custom-tooltip";
        tooltip.textContent = el.getAttribute("data-title") || "";
        document.body.appendChild(tooltip);

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top = 0,
          left = 0;

        switch (placement) {
          case "top":
            top = rect.top - tooltipRect.height - 5;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            break;
          case "bottom":
            top = rect.bottom + 5;
            left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            break;
          case "left":
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.left - tooltipRect.width - 5;
            break;
          case "right":
            top = rect.top + rect.height / 2 - tooltipRect.height / 2;
            left = rect.right + 5;
            break;
        }

        tooltip.style.position = "absolute";
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.zIndex = "1050";
        tooltip.style.background = "rgba(0, 0, 0, 0.75)";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px 10px";
        tooltip.style.borderRadius = "4px";

        el.addEventListener(
          "mouseleave",
          () => {
            tooltip.remove();
          },
          { once: true }
        );
      });
    });

    return () => {
      tooltipElements.forEach((el) => {
        el.removeEventListener("mouseenter", () => {});
        el.removeEventListener("mouseleave", () => {});
      });
    };
  }, [placement]);

  return (
    <span data-tooltip data-title={title}>
      {children}
    </span>
  );
};

export default Tooltip;
