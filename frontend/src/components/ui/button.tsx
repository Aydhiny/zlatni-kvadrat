import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:   'btn-3d-primary text-white',
        outline:   'btn-3d-outline text-foreground hover:text-foreground',
        secondary: 'btn-3d-outline text-foreground hover:text-foreground',
        ghost:     'text-foreground hover:bg-muted-bg transition-colors rounded-lg',
        link:      'text-gold underline-offset-4 hover:underline',
        dark:      'bg-foreground text-white hover:bg-foreground/90 transition-colors',
      },
      size: {
        sm:      'h-8 px-3.5 text-xs',
        default: 'h-10 px-5',
        lg:      'h-11 px-6 text-base',
        xl:      'h-12 px-7 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
