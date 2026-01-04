import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils';
import './Card.css';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'gradient' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    glow?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hover = true,
    glow = false,
    className,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
            className={cn(
                'card',
                `card-${variant}`,
                `card-padding-${padding}`,
                hover && 'card-hover',
                glow && 'card-glow',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Card Header
export interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
    <div className={cn('card-header', className)}>{children}</div>
);

// Card Title
export interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => (
    <h3 className={cn('card-title', className)}>{children}</h3>
);

// Card Description
export interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className }) => (
    <p className={cn('card-description', className)}>{children}</p>
);

// Card Content
export interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
    <div className={cn('card-content', className)}>{children}</div>
);

// Card Footer
export interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
    <div className={cn('card-footer', className)}>{children}</div>
);

export default Card;
