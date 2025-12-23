import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  /** start opened */
  defaultOpen?: boolean;
  /** extra wrapper classNames */
  className?: string;
}

const ProjectSection: React.FC<Props> = ({
  title,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);

  return (
    <div
      className={`border rounded-xl p-4 shadow-sm bg-surface ${className}`}
      aria-labelledby={`project-section-${title.replace(/\s+/g, "-")}`}
    >
      <button
        id={`project-section-${title.replace(/\s+/g, "-")}`}
        className="w-full flex items-center justify-between text-left focus:outline-none"
        aria-expanded={open}
        aria-controls={`project-section-panel-${title.replace(/\s+/g, "-")}`}
        onClick={() => setOpen((v) => !v)}
      >
        <h2 className="text-xl font-semibold mb-0">{title}</h2>
        <ChevronDown
          className={`ml-3 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
          size={20}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`project-section-panel-${title.replace(/\s+/g, "-")}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden mt-4"
          >
            <div className="pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectSection;
