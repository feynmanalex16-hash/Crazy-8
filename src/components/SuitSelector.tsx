import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { getSuitSymbol, getSuitColor } from '../constants';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
  onClose: () => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect, onClose }) => {
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-serif italic text-gray-900 mb-6 text-center">选择新的花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <span className={`text-5xl mb-2 ${getSuitColor(suit)} group-hover:scale-110 transition-transform`}>
                {getSuitSymbol(suit)}
              </span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                {suit}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
