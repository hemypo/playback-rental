
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  // Add effect to close popover when navigation happens
  React.useEffect(() => {
    const handleNavigation = () => {
      if (props.onPointerDownOutside) {
        const event = new CustomEvent('pointerdownoutside') as any;
        props.onPointerDownOutside(event);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [props.onPointerDownOutside]);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        onEscapeKeyDown={(e) => {
          // Ensure the popover closes when Escape key is pressed
          if (props.onEscapeKeyDown) {
            props.onEscapeKeyDown(e);
          }
        }}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          
          // Only close if clicking outside, not on calendar content, select, buttons, or UI elements that might be part of the calendar
          if (
            target.closest('.react-day-picker') || 
            target.closest('.select') ||
            target.closest('button') ||
            target.closest('[role="dialog"]') ||
            target.closest('[data-radix-popper-content-wrapper]')
          ) {
            e.preventDefault();
          } else if (props.onInteractOutside) {
            props.onInteractOutside(e);
          }
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
