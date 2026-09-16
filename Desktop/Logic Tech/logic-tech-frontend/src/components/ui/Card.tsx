import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className,
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const base = classNames(
    'rounded-2xl border transition-all duration-300',
    glass
      ? 'bg-white/5 backdrop-blur-xl border-white/10'
      : 'bg-slate-800/80 border-slate-700/50',
    hover && 'hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer',
    paddingClasses[padding],
    className,
  );

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={base}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={base}>{children}</div>;
}
