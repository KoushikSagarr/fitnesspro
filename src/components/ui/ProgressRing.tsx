import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import './ProgressRing.css';

interface ProgressRingProps {
    progress: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    showPercentage?: boolean;
    label?: string;
    icon?: React.ReactNode;
    animated?: boolean;
    children?: ReactNode;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 120,
    strokeWidth = 8,
    color = 'var(--accent-primary)',
    backgroundColor = 'var(--divider)',
    showPercentage = true,
    label,
    icon,
    animated = true,
    children,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const clampedProgress = Math.min(100, Math.max(0, progress));
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
        <div className="progress-ring-container" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="progress-ring-svg"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    className="progress-ring-background"
                />

                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="progress-ring-progress"
                    style={{
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                    }}
                />

                {/* Glow effect */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth + 4}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="progress-ring-glow"
                    style={{
                        transformOrigin: 'center',
                        transform: 'rotate(-90deg)',
                        opacity: 0.3,
                        filter: 'blur(4px)',
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="progress-ring-content">
                {children ? (
                    children
                ) : (
                    <>
                        {icon && <div className="progress-ring-icon">{icon}</div>}
                        {showPercentage && (
                            <motion.span
                                className="progress-ring-percentage"
                                initial={animated ? { opacity: 0 } : { opacity: 1 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {Math.round(clampedProgress)}%
                            </motion.span>
                        )}
                        {label && <span className="progress-ring-label">{label}</span>}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProgressRing;
