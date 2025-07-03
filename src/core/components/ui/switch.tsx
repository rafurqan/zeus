"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils"; // pastikan ini helper classNames-mu

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    label?: string;
};

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, label, ...props }, ref) => {
    return (
        <div className="flex items-center space-x-2">
            <SwitchPrimitives.Root
                ref={ref}
                className={cn(
                    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-300",
                    className
                )}
                {...props}
            >
                <SwitchPrimitives.Thumb
                    className={cn(
                        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform",
                        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                    )}
                />
            </SwitchPrimitives.Root>
            {label && (
                <span className="text-sm text-gray-700 select-none">{label}</span>
            )}
        </div>
    );
});

Switch.displayName = "Switch";

export { Switch };
