import classNames from 'classnames'
import React, { ReactNode } from 'react'

import Loader from '../loader/Loader'

export type ButtonColor = 'red' | 'blue' | 'pink' | 'purple' | 'gradient' | 'gray'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'default'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

const VARIANT: Record<ButtonVariant, string> = {
  filled: 'btn-filled',
  outlined: 'btn-outlined',
  empty: 'btn-empty',
}

const COLOR: Record<ButtonColor, string> = {
  blue: 'btn-blue',
  red: 'btn-red',
  pink: 'btn-pink',
  purple: 'btn-purple',
  gradient: 'btn-gradient',
  gray: 'btn-gray',
}

const SIZE: Record<ButtonSize, string> = {
  default: 'btn-default',
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

type Button = React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  loading?: boolean
  href?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      color = 'blue',
      size = 'default',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      disabled,
      href,
      ...rest
    },
    ref,
  ) => {
    return React.createElement(
      href ? 'a' : 'button',
      {
        ...rest,
        ref,
        disabled: disabled || loading,
        className: classNames(
          'btn',
          fullWidth ? 'w-full' : '',
          VARIANT[variant],
          COLOR[color],
          SIZE[size],
          className,
          disabled ? 'btn-disabled' : '',
        ),
        ...(href && { href }),
      },
      loading ? (
        <Loader stroke="currentColor" />
      ) : (
        <>
          {startIcon && startIcon}
          {children}
          {endIcon && endIcon}
        </>
      ),
    )
  },
)

export default Button
