"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

const MultiSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & { 
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
  }
>(({ options, value, onChange, ...props }, ref) => (
  <SelectPrimitive.Root {...props}>
    <SelectPrimitive.Trigger ref={ref} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      <SelectPrimitive.Value placeholder="Select strategies" />
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
        <SelectPrimitive.Viewport className="p-1">
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option}
              value={option}
              className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                const newValue = value.includes(option)
                  ? value.filter((v) => v !== option)
                  : [...value, option];
                onChange(newValue);
              }}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                  {value.includes(option) && <Check className="h-4 w-4" />}
                </SelectPrimitive.ItemIndicator>
              </span>
              {option}
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
));
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
