"use client"; 
import React, { useState, useEffect  } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Trophy, Sun, Moon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { flashcardsData } from '../data/flashcardData';

const FlashcardGame = () => {
    // Function to shuffle array
    const shuffleArray = <T extends object>(array: T[]): (T & { score: number; attempts: number })[] => {
        const shuffled = [...array].sort(() => Math.random() - 0.5);
        return shuffled.map(card => ({ ...card, score: 0, attempts: 0 }));
      };
      
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cards, setCards] = useState(() => shuffleArray(flashcardsData)); // Initialize with shuffled cards
    const [showScore, setShowScore] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [mastered, setMastered] = useState(0);
    const [theme, setTheme] = useState('dark');
    const [cardsStudied, setCardsStudied] = useState(new Set());

  // Initialize theme from system preference
  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      };
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

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
    setShowScore(false);
    setCardsStudied(new Set());
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowScore(false);
      setCardsStudied(prev => new Set(prev).add(currentCardIndex));
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowScore(false);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowScore(true);
    }
  };

  const rateCard = (rating: number) => {
    const updatedCards = [...cards];
    const card = updatedCards[currentCardIndex];
    card.attempts += 1;
    card.score = ((card.score * (card.attempts - 1)) + rating) / card.attempts;
    setCards(updatedCards);
    
    const newTotalScore = updatedCards.reduce((sum, card) => sum + card.score, 0) / updatedCards.length;
    setTotalScore(newTotalScore);
    
    const newMastered = updatedCards.filter(card => card.score >= 4).length;
    setMastered(newMastered);
    
    setTimeout(() => {
      if (currentCardIndex < cards.length - 1) {
        nextCard();
      }
    }, 500);
  };

  const progressPercentage = (cardsStudied.size / cards.length) * 100;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto p-4 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4"
        onClick={toggleTheme}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      {/* Progress Section */}
      <div className="w-full space-y-3">
        {/* Study Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Study Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Mastery Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Mastery Level</span>
            <span>{Math.round((totalScore / 5) * 100)}%</span>
          </div>
          <Progress value={(totalScore / 5) * 100} className="h-2 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 rounded-full"
              style={{ width: `${(totalScore / 5) * 100}%` }}
            />
          </Progress>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Card {currentCardIndex + 1} of {cards.length}
          </span>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mastered: {mastered}/{cards.length}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        {/* Flashcard */}
        <Card 
          className="w-full aspect-[3/2] max-h-80 cursor-pointer perspective-1000 dark:bg-gray-800 dark:border-gray-700 sm:h-64"
          onClick={toggleFlip}
        >
          <CardContent className="h-full flex items-center justify-center p-4 sm:p-6 text-center">
            {!isFlipped ? (
              <div className="text-2xl sm:text-3xl font-bold dark:text-white">
                {cards[currentCardIndex].word}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400">
                  {cards[currentCardIndex].pinyin}
                </p>
                <p className="text-base sm:text-lg font-medium dark:text-gray-200">
                  {cards[currentCardIndex].translation}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {cards[currentCardIndex].example}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-center w-full gap-2 sm:gap-4">
          <Button 
            variant="outline"
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            className="dark:border-gray-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <Button
            variant="outline"
            onClick={shuffleCards}
            className="dark:border-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Shuffle</span>
          </Button>

          <Button
            variant="outline"
            onClick={nextCard}
            disabled={currentCardIndex === cards.length - 1}
            className="dark:border-gray-700"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 ml-1 sm:ml-2" />
          </Button>
        </div>

        {/* Rating Buttons */}
        {showScore && (
          <div className="space-y-2 w-full">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              How well did you know this word?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={cards[currentCardIndex].score >= rating ? "default" : "outline"}
                  onClick={() => rateCard(rating)}
                  className="w-10 h-10 sm:w-12 sm:h-12 dark:border-gray-700"
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardGame;