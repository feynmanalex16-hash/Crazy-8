import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  winner: 'PLAYER' | 'AI';
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <div className="text-center p-12 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Trophy className={`w-24 h-24 ${winner === 'PLAYER' ? 'text-yellow-400' : 'text-slate-400'}`} />
          </motion.div>
        </div>
        
        <h1 className="text-5xl font-serif italic mb-2">
          {winner === 'PLAYER' ? '你赢了！' : 'AI 获胜'}
        </h1>
        <p className="text-zinc-400 mb-8 text-lg">
          {winner === 'PLAYER' ? '精彩的对局，你是疯狂 8 点的大师！' : '别灰心，下次一定能赢。'}
        </p>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 mx-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-yellow-400 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          再玩一局
        </button>
      </div>
    </motion.div>
  );
};
