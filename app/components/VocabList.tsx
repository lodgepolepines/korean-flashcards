'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, List } from 'lucide-react';

// Or define it directly if you prefer:
interface FlashCard {
  word: string;
  translation: string;
  pinyin: string;
  example: string;
}

interface VocabListProps {
  cards: Array<FlashCard>;
}

const VocabList = ({ cards }: VocabListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4"
        onClick={() => setIsOpen(true)}
      >
        <List className="w-4 h-4 mr-2" />
        Show Vocabulary List
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[80vh]">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Vocabulary List</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(80vh-100px)]">
          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={index} className="border-b pb-2">
                <div className="font-bold">{card.word}</div>
                <div className="text-sm text-gray-600">{card.pinyin}</div>
                <div className="text-sm">{card.translation}</div>
                <div className="text-xs text-gray-600 mt-1">{card.example}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VocabList;