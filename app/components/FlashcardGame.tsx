"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, RotateCcw, Sun, Moon, Trash2, Lock, Volume2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { flashcardsData } from '../data/flashcardData';
import VocabList from './VocabList';
import CardSideToggle from './CardSideToggle';

interface FlashCard {
    word: string;
    translation: string;
    pinyin: string;
    example: string;
}

const PasswordGate = ({ onCorrectPassword }: { onCorrectPassword: () => void }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('https://korean-flashcards.vercel.app/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();
            
            if (data.success) {
                sessionStorage.setItem('isAuthenticated', 'true');
                onCorrectPassword();
            } else {
                setError(true);
                setTimeout(() => setError(false), 2000);
            }
        } catch {
            setError(true);
            setTimeout(() => setError(false), 2000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
            <Card className="w-full max-w-md mx-4">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <Lock className="w-12 h-12 text-indigo-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-center mb-4">Enter Password</h2>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full ${error ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        {error && (
                            <p className="text-red-500 text-sm text-center">Incorrect password</p>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Checking...' : 'Access Flashcards'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

const SpeakButton = ({ text }: { text: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use environment variable for API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const speak = async () => {
      try {
          setIsPlaying(true);
          const response = await fetch(`${API_URL}/api/tts`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text }),
          });

          if (!response.ok) {
              throw new Error('Failed to generate speech');
          }

          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.onended = () => {
              setIsPlaying(false);
              URL.revokeObjectURL(audioUrl);
          };

          await audio.play();
      } catch (error) {
          console.error('Speech error:', error);
          setIsPlaying(false);
      }
  };

  return (
      <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
              e.stopPropagation();
              if (!isPlaying) speak();
          }}
          disabled={isPlaying}
          className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
          <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-blue-500' : ''}`} />
      </Button>
  );
};

const FlashcardGame = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const shuffleArray = (array: FlashCard[]): FlashCard[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };
      
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState<FlashCard[]>(() => flashcardsData);
    const [theme, setTheme] = useState('light');
    const [isClient, setIsClient] = useState(false);
    const [cardsStudied, setCardsStudied] = useState(new Set<number>());
    const [showEnglishFirst, setShowEnglishFirst] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setCards(shuffleArray(flashcardsData));
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }
        const savedSide = localStorage.getItem('showEnglishFirst');
        if (savedSide) {
            setShowEnglishFirst(JSON.parse(savedSide));
        }
        
        // Check authentication
        const authStatus = sessionStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleToggleSide = (value: boolean) => {
        setShowEnglishFirst(value);
        setIsFlipped(value);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newTheme;
        });
    };

    const shuffleCards = () => {
        setCards(shuffleArray(flashcardsData));
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setCardsStudied(new Set());
    };

    const nextCard = () => {
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
            setCardsStudied(prev => new Set(prev).add(currentCardIndex));
        }
    };

    const previousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const removeCurrentCard = () => {
        if (cards.length <= 1) return;

        setCards(prevCards => {
            const newCards = prevCards.filter((_, index) => index !== currentCardIndex);
            return newCards;
        });

        if (currentCardIndex === cards.length - 1) {
            setCurrentCardIndex(currentCardIndex - 1);
        }
        
        setCardsStudied(prev => {
            const newSet = new Set(Array.from(prev).filter(index => index !== currentCardIndex)
                .map(index => index > currentCardIndex ? index - 1 : index));
            return newSet;
        });

        setIsFlipped(false);
    };

    const progressPercentage = (cardsStudied.size / cards.length) * 100;

    if (!isAuthenticated) {
        return <PasswordGate onCorrectPassword={() => setIsAuthenticated(true)} />;
    }

    if (!isClient) {
        return (
            <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto p-4">
                <Card className="w-full aspect-[3/2] max-h-80">
                    <CardContent className="h-full flex items-center justify-center p-4">
                        <div className="text-2xl font-bold">Loading...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 overflow-auto">
            <div className="flex flex-col items-center max-w-2xl mx-auto p-6 min-h-full">
                <div className="w-full flex justify-between items-center">
                    <CardSideToggle 
                        showEnglishFirst={showEnglishFirst} 
                        onToggle={handleToggleSide}
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className="bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="w-full space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-400">Study Progress</span>
                            <span className="text-gray-600 dark:text-gray-400">{Math.round(progressPercentage)}% Complete</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-indigo-100 dark:bg-gray-700">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full" />
                        </Progress>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Card {currentCardIndex + 1} of {cards.length}
                        </span>
                    </div>
                </div>

                <div className="w-full space-y-4 mt-4">
                    <Card 
                        className="w-full aspect-[3/2] max-h-80 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200 sm:h-64 card-container border-0"
                        onClick={toggleFlip}
                    >
                        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                          <div className="flip-card-front p-6 relative">
                              <div className="h-full flex items-center justify-center">
                                  <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                      {showEnglishFirst ? cards[currentCardIndex]?.translation : cards[currentCardIndex]?.word}
                                  </div>
                              </div>
                              {!showEnglishFirst && <SpeakButton text={cards[currentCardIndex]?.word} />}
                          </div>
                          <div className="flip-card-back p-6 relative">
                              <div className="h-full flex items-center justify-center">
                                  <div className="space-y-4">
                                      <p className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 font-medium">
                                          {cards[currentCardIndex]?.pinyin}
                                      </p>
                                      <p className="text-lg sm:text-xl font-medium text-purple-600 dark:text-purple-400">
                                          {showEnglishFirst ? cards[currentCardIndex]?.word : cards[currentCardIndex]?.translation}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {cards[currentCardIndex]?.example}
                                      </p>
                                  </div>
                              </div>
                              {showEnglishFirst && <SpeakButton text={cards[currentCardIndex]?.word} />}
                          </div>
                        </div>
                    </Card>

                    <div className="flex justify-center w-full gap-4">
                        <Button 
                            variant="outline"
                            onClick={previousCard}
                            disabled={currentCardIndex === 0}
                            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={shuffleCards}
                            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Shuffle</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={nextCard}
                            disabled={currentCardIndex === cards.length - 1}
                            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>

                    {/* Remove Button */}
                    <div className="w-full flex justify-start">
                        <Button
                            variant="outline"
                            onClick={removeCurrentCard}
                            disabled={cards.length <= 1}
                            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Remove Card</span>
                        </Button>
                    </div>
                </div>
                <VocabList cards={cards} />
            </div>
        </div>
    );
};

export default FlashcardGame;