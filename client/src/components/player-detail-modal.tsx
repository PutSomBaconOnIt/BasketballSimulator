import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Player } from "../../../shared/schema";

interface PlayerDetailModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatHeight(heightInches: number): string {
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;
  return `${feet}'${inches}"`;
}

export function PlayerDetailModal({ player, isOpen, onClose }: PlayerDetailModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    { title: "Personal Information", key: "personal" },
    { title: "Player Ratings", key: "ratings" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleClose = () => {
    setCurrentSlide(0); // Reset to first slide when closing
    onClose();
  };

  // Handle escape key - always call useEffect, check condition inside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Early return after hooks
  if (!player || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80" 
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-2 top-2 p-1 h-8 w-8 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center pr-10">
            <h2 className="text-xl font-bold text-white">
              {player.name}
            </h2>
            <p className="text-sm text-gray-400">{slides[currentSlide].title}</p>
          </div>
        </div>

        {/* Left Arrow - Centered on side */}
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 h-10 w-10 text-gray-400 hover:text-white z-10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Right Arrow - Centered on side */}
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 h-10 w-10 text-gray-400 hover:text-white z-10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        <div className="p-6 space-y-6">
          {/* Player Name and Position */}
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              #{player.jerseyNumber} • {player.position}
            </Badge>
          </div>

          {/* Slide Content */}
          {currentSlide === 0 && (
            <div className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Age</h3>
                    <p className="text-lg font-semibold text-white">{player.age} years old</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Height</h3>
                    <p className="text-lg font-semibold text-white">{formatHeight(player.height)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Weight</h3>
                    <p className="text-lg font-semibold text-white">{player.weight} lbs</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Position</h3>
                    <p className="text-lg font-semibold text-white">{player.position}</p>
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Contract Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Annual Salary</h4>
                    <p className="text-lg font-semibold text-green-400">
                      ${(player.salary / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Contract Years</h4>
                    <p className="text-lg font-semibold text-white">{player.contractYears} years</p>
                  </div>
                </div>
              </div>

              {/* Current Season Stats */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3">2024-25 Season Stats</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{player.pointsPerGame}</p>
                    <p className="text-xs text-gray-400">PPG</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{player.reboundsPerGame}</p>
                    <p className="text-xs text-gray-400">RPG</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{player.assistsPerGame}</p>
                    <p className="text-xs text-gray-400">APG</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 2: Player Ratings */}
          {currentSlide === 1 && (
            <div className="space-y-4">
              {/* Overall Rating - Featured */}
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {player.overall}
                  </div>
                  <div className="text-sm text-gray-400">Overall Rating</div>
                </div>
              </div>

              {/* Detailed Ratings Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Offense</span>
                    <span className="text-lg font-bold text-orange-400">{player.offense}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full" 
                      style={{ width: `${player.offense}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Defense</span>
                    <span className="text-lg font-bold text-red-400">{player.defense}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full" 
                      style={{ width: `${player.defense}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Speed</span>
                    <span className="text-lg font-bold text-green-400">{player.speed}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full" 
                      style={{ width: `${player.speed}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Shooting</span>
                    <span className="text-lg font-bold text-purple-400">{player.shooting}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full" 
                      style={{ width: `${player.shooting}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">3-Point</span>
                    <span className="text-lg font-bold text-cyan-400">{player.threePoint}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full" 
                      style={{ width: `${player.threePoint}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Rebounding</span>
                    <span className="text-lg font-bold text-yellow-400">{player.rebounding}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${player.rebounding}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Passing</span>
                    <span className="text-lg font-bold text-indigo-400">{player.passing}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-400 h-2 rounded-full" 
                      style={{ width: `${player.passing}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Potential</span>
                    <span className="text-lg font-bold text-pink-400">{player.potential}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-pink-400 h-2 rounded-full" 
                      style={{ width: `${player.potential}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}