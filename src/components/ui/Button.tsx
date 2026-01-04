import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils';
import './Button.css';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            className={cn(
                'btn',
                `btn-${variant}`,
                `btn-${size}`,
                fullWidth && 'btn-full',
                isLoading && 'btn-loading',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="btn-spinner" />
            ) : (
                <>
                    {leftIcon && <span className="btn-icon btn-icon-left">{leftIcon}</span>}
                    <span className="btn-text">{children}</span>
                    {rightIcon && <span className="btn-icon btn-icon-right">{rightIcon}</span>}
                </>
            )}
        </motion.button>
    );
};

export default Button;
