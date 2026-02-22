/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useCrazyEights } from './hooks/useCrazyEights';
import { Card } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { GameOver } from './components/GameOver';
import { getSuitSymbol, getSuitColor } from './constants';
import { Rank } from './types';
import { Info, HelpCircle, RotateCcw, Palette, X } from 'lucide-react';
import { useState } from 'react';

export default function App() {
  const { state, playCard, drawCard, selectSuit, cancelSuitSelection, initGame, startGame, setSkin } = useCrazyEights();
  const [showSkinMenu, setShowSkinMenu] = useState(false);

  const topDiscard = state.discardPile[state.discardPile.length - 1];
  const isPlayerTurn = state.turn === 'PLAYER' && state.status === 'PLAYING';

  // 主菜单界面
  if (state.status === 'MENU') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#10b981_0%,_transparent_70%)]" />
        </div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-7xl sm:text-9xl font-serif italic font-bold tracking-tighter mb-4 text-white drop-shadow-2xl">
            CRAZY 8s
          </h1>
          <p className="text-emerald-200/60 font-mono uppercase tracking-[0.5em] mb-12 text-sm sm:text-base">
            疯狂 8 点 · 经典纸牌
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={startGame}
              className="group relative px-12 py-5 bg-white text-emerald-900 rounded-full font-bold text-xl hover:bg-emerald-400 hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(52,211,153,0.4)]"
            >
              开始游戏
              <div className="absolute -inset-1 rounded-full border border-white/20 group-hover:scale-110 transition-transform duration-500" />
            </button>

            <button
              onClick={() => setShowSkinMenu(true)}
              className="px-8 py-5 bg-zinc-900/50 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Palette className="w-5 h-5" />
              更换皮肤
            </button>
          </div>
        </motion.div>

        {/* 皮肤选择弹窗 */}
        <AnimatePresence>
          {showSkinMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-2xl w-full relative"
              >
                <button 
                  onClick={() => setShowSkinMenu(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>

                <h2 className="text-3xl font-serif italic mb-8">选择卡牌皮肤</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {(['CLASSIC', 'MINIMAL', 'NEON'] as const).map((skinType) => (
                    <button
                      key={skinType}
                      onClick={() => {
                        setSkin(skinType);
                        setShowSkinMenu(false);
                      }}
                      className={`flex flex-col items-center gap-4 p-4 rounded-2xl border-2 transition-all ${state.skin === skinType ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
                    >
                      <Card 
                        card={{ suit: 'HEARTS', rank: 'A', id: 'preview' } as any} 
                        skin={skinType}
                        disabled
                        className="scale-75 pointer-events-none"
                      />
                      <span className="font-mono text-xs uppercase tracking-widest">
                        {skinType === 'CLASSIC' ? '经典' : skinType === 'MINIMAL' ? '极简' : '霓虹'}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-12 text-emerald-200/30 text-xs font-mono uppercase tracking-widest">
          Match Suit or Rank · 8 is Wild
        </div>
      </div>
    );
  }

  if (state.status === 'DEALING' || !topDiscard) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-2xl font-serif italic text-white/40"
        >
          正在发牌...
        </motion.div>
      </div>
    );
  }

  const canPlay = (card: any) => {
    if (!isPlayerTurn) return false;
    return card.rank === Rank.EIGHT || card.rank === topDiscard.rank || card.suit === state.currentSuit;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,_#10b981_0%,_transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-serif italic font-bold tracking-tighter cursor-pointer" onClick={initGame}>CRAZY EIGHTS</h1>
          <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-widest">
            <span>标准 52 张牌</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>智能 AI 对手</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-mono text-white/40 uppercase">当前花色</span>
            <div className={`text-2xl font-bold ${state.currentSuit ? getSuitColor(state.currentSuit) : 'text-white'}`}>
              {state.currentSuit ? getSuitSymbol(state.currentSuit) : '?'}
            </div>
          </div>
          <button 
            onClick={initGame}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-xs font-mono uppercase tracking-widest text-white/60"
          >
            <RotateCcw className="w-4 h-4" />
            重开
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 w-full max-w-6xl flex flex-col justify-center gap-8 sm:gap-16">
        
        {/* AI Hand */}
        <section className="relative flex justify-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-zinc-900/80 border border-white/5 backdrop-blur-sm text-[10px] font-mono uppercase tracking-widest text-white/40">
            AI Opponent ({state.aiHand.length})
          </div>
          <div className="flex -space-x-12 sm:-space-x-16">
            {state.aiHand.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card card={card} isFaceDown disabled className="scale-75 sm:scale-90" skin={state.skin} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Center Area (Deck & Discard) */}
        <section className="flex items-center justify-center gap-8 sm:gap-24">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase text-white/30">
              Deck ({state.deck.length})
            </div>
            <div className="relative">
               {/* Stack effect */}
              <div className="absolute top-1 left-1 w-24 h-36 sm:w-32 sm:h-48 bg-indigo-950 rounded-xl border border-white/10" />
              <div className="absolute top-2 left-2 w-24 h-36 sm:w-32 sm:h-48 bg-indigo-950 rounded-xl border border-white/10" />
              <Card 
                card={{} as any} 
                isFaceDown 
                onClick={() => isPlayerTurn && drawCard('PLAYER')}
                disabled={!isPlayerTurn || state.deck.length === 0}
                className={isPlayerTurn && state.deck.length > 0 ? "ring-2 ring-yellow-400 ring-offset-4 ring-offset-black" : ""}
                skin={state.skin}
              />
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase text-white/30">
              Discard
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={topDiscard.id}
                initial={{ x: 100, opacity: 0, rotate: 15 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card card={topDiscard} disabled skin={state.skin} />
              </motion.div>
            </AnimatePresence>
            
            {/* Current Suit Indicator for 8s */}
            {topDiscard.rank === Rank.EIGHT && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-zinc-900"
              >
                <span className={`text-2xl ${getSuitColor(state.currentSuit!)}`}>
                  {getSuitSymbol(state.currentSuit!)}
                </span>
              </motion.div>
            )}
          </div>
        </section>

        {/* Player Hand */}
        <section className="relative flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-1 rounded-full border transition-all duration-300 flex items-center gap-2 ${isPlayerTurn ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]' : 'bg-zinc-900 border-white/10 text-white/40'}`}>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                {isPlayerTurn ? "Your Turn" : "AI Thinking..."}
              </span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">
              Cards: {state.playerHand.length}
            </div>
          </div>

          <div className="flex justify-center -space-x-8 sm:-space-x-12 px-12">
            {state.playerHand.map((card, idx) => (
              <Card 
                key={card.id} 
                card={card} 
                onClick={() => isPlayerTurn && canPlay(card) && playCard(card.id, 'PLAYER')}
                disabled={!isPlayerTurn || !canPlay(card)}
                className={canPlay(card) ? "ring-2 ring-emerald-400 ring-offset-4 ring-offset-black" : "opacity-60 grayscale-[0.5]"}
                skin={state.skin}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer / Status */}
      <footer className="w-full max-w-6xl mt-8 flex justify-between items-end">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white/20 uppercase">Game Mode</span>
            <span className="text-sm font-medium">Classic Crazy 8s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white/20 uppercase">Session Time</span>
            <span className="text-sm font-medium">04:20</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/20">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase">Match suit or rank. 8 is wild.</span>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {state.status === 'SUIT_SELECTION' && (
          <SuitSelector onSelect={selectSuit} onClose={cancelSuitSelection} />
        )}
        {state.status === 'GAME_OVER' && state.winner && (
          <GameOver winner={state.winner} onRestart={initGame} />
        )}
      </AnimatePresence>
    </div>
  );
}
