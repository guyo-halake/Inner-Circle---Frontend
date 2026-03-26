"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className={value.length > 0 ? "" : "text-muted-foreground"}>
          {value.length > 0 ? value.join(", ") : "Select strategies"}
        </span>
        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="p-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value.includes(option) && <Check className="h-4 w-4 text-primary" />}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
