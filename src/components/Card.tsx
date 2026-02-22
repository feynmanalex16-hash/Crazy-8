import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit, Rank, CardSkin } from '../types';
import { getSuitSymbol, getSuitColor } from '../constants';
import { cn } from '../utils';

interface CardProps {
  card: CardType;
  isFaceDown?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  skin?: CardSkin;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceDown = false, 
  onClick, 
  className,
  disabled = false,
  skin = 'CLASSIC'
}) => {
  const symbol = getSuitSymbol(card.suit);
  const colorClass = getSuitColor(card.suit);

  const getSkinStyles = () => {
    switch (skin) {
      case 'MINIMAL':
        return isFaceDown 
          ? "bg-zinc-100 border border-zinc-300 shadow-sm" 
          : "bg-white border border-zinc-100 shadow-none";
      case 'NEON':
        return isFaceDown 
          ? "bg-black border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
          : "bg-black border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]";
      default: // CLASSIC
        return isFaceDown 
          ? "bg-indigo-900 border-4 border-white/20 shadow-xl" 
          : "bg-white border border-gray-300 shadow-md";
    }
  };

  const getTextColor = () => {
    if (skin === 'NEON' && !isFaceDown) {
      return card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS 
        ? "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" 
        : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
    }
    if (skin === 'MINIMAL' && !isFaceDown) {
      return card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS 
        ? "text-red-400" 
        : "text-zinc-600";
    }
    return colorClass;
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!disabled && !isFaceDown ? { y: -20, scale: 1.05 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl cursor-pointer select-none transition-all duration-300",
        getSkinStyles(),
        !disabled && "hover:shadow-2xl",
        disabled && "cursor-not-allowed opacity-80",
        className
      )}
    >
      {isFaceDown ? (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {skin === 'CLASSIC' && (
            <>
              <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="absolute inset-2 border border-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white/30 font-serif italic text-4xl">8</span>
              </div>
            </>
          )}
          {skin === 'MINIMAL' && (
            <div className="w-12 h-12 rounded-full border-2 border-zinc-200 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-300" />
            </div>
          )}
          {skin === 'NEON' && (
            <div className="text-emerald-500/40 font-mono text-5xl animate-pulse">8</div>
          )}
        </div>
      ) : (
        <div className={cn("w-full h-full p-2 flex flex-col justify-between", getTextColor())}>
          <div className="flex flex-col items-start leading-none">
            <span className="text-xl sm:text-2xl font-bold">{card.rank}</span>
            <span className="text-lg sm:text-xl">{symbol}</span>
          </div>
          
          {skin !== 'MINIMAL' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
               <span className="text-7xl sm:text-9xl">{symbol}</span>
            </div>
          )}

          <div className="flex flex-col items-end leading-none rotate-180">
            <span className="text-xl sm:text-2xl font-bold">{card.rank}</span>
            <span className="text-lg sm:text-xl">{symbol}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
