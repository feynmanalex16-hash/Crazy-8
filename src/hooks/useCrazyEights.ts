import { useState, useEffect, useCallback } from 'react';
import { Card, Suit, Rank, GameState, CardSkin } from '../types';
import { createDeck } from '../constants';

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: null,
    turn: 'PLAYER',
    status: 'MENU',
    winner: null,
    pendingCard: null,
    skin: 'CLASSIC',
  });

  const setSkin = (skin: CardSkin) => {
    setState(prev => ({ ...prev, skin }));
  };

  const startGame = useCallback(() => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.slice(0, 8);
    const aiHand = fullDeck.slice(8, 16);
    const remainingDeck = fullDeck.slice(17);
    const firstDiscard = fullDeck[16];

    setState(prev => ({
      ...prev,
      deck: remainingDeck,
      playerHand,
      aiHand,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      turn: 'PLAYER',
      status: 'PLAYING',
      winner: null,
    }));
  }, []);

  const initGame = useCallback(() => {
    setState(prev => ({ ...prev, status: 'MENU' }));
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const drawCard = (target: 'PLAYER' | 'AI') => {
    if (state.deck.length === 0) {
      // If deck is empty, skip turn
      setState(prev => ({ ...prev, turn: prev.turn === 'PLAYER' ? 'AI' : 'PLAYER' }));
      return;
    }

    const newDeck = [...state.deck];
    const drawnCard = newDeck.pop()!;

    setState(prev => ({
      ...prev,
      deck: newDeck,
      [target === 'PLAYER' ? 'playerHand' : 'aiHand']: [
        ...prev[target === 'PLAYER' ? 'playerHand' : 'aiHand'],
        drawnCard
      ],
      turn: target === 'PLAYER' ? 'AI' : 'PLAYER'
    }));
  };

  const playCard = (cardId: string, target: 'PLAYER' | 'AI', selectedSuit?: Suit) => {
    const handKey = target === 'PLAYER' ? 'playerHand' : 'aiHand';
    const card = state[handKey].find(c => c.id === cardId);
    
    if (!card) return;

    const topCard = state.discardPile[state.discardPile.length - 1];
    const isValidMove = 
      card.rank === Rank.EIGHT || 
      card.rank === topCard.rank || 
      card.suit === state.currentSuit;

    if (!isValidMove && target === 'PLAYER') return;

    const newHand = state[handKey].filter(c => c.id !== cardId);
    const newDiscardPile = [...state.discardPile, card];

    if (card.rank === Rank.EIGHT) {
      if (target === 'PLAYER' && !selectedSuit) {
        setState(prev => ({
          ...prev,
          status: 'SUIT_SELECTION',
          pendingCard: card,
          [handKey]: newHand,
          discardPile: newDiscardPile,
        }));
        return;
      }
      
      // AI or Player has selected suit
      const finalSuit = selectedSuit || Suit.HEARTS; // Default for safety
      setState(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentSuit: finalSuit,
        turn: target === 'PLAYER' ? 'AI' : 'PLAYER',
        status: 'PLAYING',
      }));
    } else {
      setState(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        turn: target === 'PLAYER' ? 'AI' : 'PLAYER',
      }));
    }
  };

  const selectSuit = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      currentSuit: suit,
      turn: 'AI',
      status: 'PLAYING',
      pendingCard: null,
    }));
  };

  const cancelSuitSelection = () => {
    if (state.pendingCard) {
      setState(prev => ({
        ...prev,
        status: 'PLAYING',
        playerHand: [...prev.playerHand, prev.pendingCard!],
        discardPile: prev.discardPile.slice(0, -1),
        pendingCard: null,
      }));
    }
  };

  // AI Turn Logic
  useEffect(() => {
    if (state.turn === 'AI' && state.status === 'PLAYING' && !state.winner) {
      const timer = setTimeout(() => {
        const topCard = state.discardPile[state.discardPile.length - 1];
        
        // Find valid cards (non-8s first)
        const validNormalCards = state.aiHand.filter(c => 
          c.rank !== Rank.EIGHT && (c.rank === topCard.rank || c.suit === state.currentSuit)
        );

        if (validNormalCards.length > 0) {
          const cardToPlay = validNormalCards[Math.floor(Math.random() * validNormalCards.length)];
          playCard(cardToPlay.id, 'AI');
        } else {
          // Check for 8s
          const eight = state.aiHand.find(c => c.rank === Rank.EIGHT);
          if (eight) {
            // AI chooses most frequent suit in its hand
            const suitCounts = state.aiHand.reduce((acc, c) => {
              acc[c.suit] = (acc[c.suit] || 0) + 1;
              return acc;
            }, {} as Record<Suit, number>);
            
            const bestSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || Suit.HEARTS;
            playCard(eight.id, 'AI', bestSuit);
          } else {
            // Must draw
            drawCard('AI');
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.aiHand, state.discardPile, state.currentSuit, state.winner]);

  // Check for winner
  useEffect(() => {
    if (state.playerHand.length === 0 && state.status === 'PLAYING') {
      setState(prev => ({ ...prev, status: 'GAME_OVER', winner: 'PLAYER' }));
    } else if (state.aiHand.length === 0 && state.status === 'PLAYING') {
      setState(prev => ({ ...prev, status: 'GAME_OVER', winner: 'AI' }));
    }
  }, [state.playerHand.length, state.aiHand.length, state.status]);

  return {
    state,
    playCard,
    drawCard,
    selectSuit,
    cancelSuitSelection,
    initGame,
    startGame,
    setSkin
  };
};
