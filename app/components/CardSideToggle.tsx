'use client';

import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CardSideToggleProps {
  showEnglishFirst: boolean;
  onToggle: (value: boolean) => void;
}

const CardSideToggle = ({ showEnglishFirst, onToggle }: CardSideToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="card-side"
        checked={showEnglishFirst}
        onCheckedChange={onToggle}
        className="dark:bg-gray-700"
      />
      <Label htmlFor="card-side" className="text-sm text-gray-600 dark:text-gray-400">
        {showEnglishFirst ? "Show English First" : "Show Korean First"}
      </Label>
    </div>
  );
};

export default CardSideToggle;