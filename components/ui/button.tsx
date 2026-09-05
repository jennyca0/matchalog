import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-transparent px-4 text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/35 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'h-11 bg-primary text-primary-foreground hover:bg-foreground',
        outline: 'h-11 border-border bg-transparent text-foreground hover:border-primary hover:bg-secondary',
        secondary: 'h-11 bg-secondary text-secondary-foreground hover:bg-accent',
        ghost: 'h-11 text-foreground hover:bg-secondary',
        destructive: 'h-11 bg-destructive text-primary-foreground hover:bg-foreground',
        link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: '',
        xs: 'h-7 rounded-[var(--radius-sm)] px-2 text-xs',
        sm: 'h-9 rounded-[var(--radius-sm)] px-3 text-xs',
        lg: 'h-12 px-5',
        icon: 'size-11 px-0',
        'icon-xs': 'size-7 px-0',
        'icon-sm': 'size-9 px-0',
        'icon-lg': 'size-12 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
