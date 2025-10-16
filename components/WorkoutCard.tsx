import React, { useState } from 'react';
import { Exercise, Difficulty } from '../types';
import VideoModal from './VideoModal';
import PlayIcon from './icons/PlayIcon';
import InfoIcon from './icons/InfoIcon';
import CheckIcon from './icons/CheckIcon';

interface WorkoutCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggleComplete: () => void;
  genderMode: 'boys' | 'girls';
}

const getDifficultyBadgeColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-500 text-white';
    case 'Intermediate': return 'bg-yellow-500 text-white';
    case 'Advanced': return 'bg-red-500 text-white';
  }
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise, isCompleted, onToggleComplete, genderMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const imageUrl = genderMode === 'girls' && exercise.imageUrlFemale ? exercise.imageUrlFemale : exercise.imageUrl;
  const videoUrl = genderMode === 'girls' && exercise.videoUrlFemale ? exercise.videoUrlFemale : exercise.videoUrl;

  return (
    <>
      <div className={`relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20 flex flex-col ${isCompleted ? 'ring-2 ring-emerald-500' : ''}`}>
        <div className={`absolute top-3 left-3 px-2 py-0.5 text-xs font-semibold rounded-full z-10 ${getDifficultyBadgeColor(exercise.difficulty)}`}>
          {exercise.difficulty}
        </div>
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full h-7 w-7 flex items-center justify-center z-10">
            <CheckIcon className="h-5 w-5" />
          </div>
        )}
        <img src={imageUrl} alt={exercise.name} className="w-full h-48 object-cover" />
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white pr-2">{exercise.name}</h3>
            <button 
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
              className="flex-shrink-0 p-1 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={isDetailsVisible ? 'Hide details' : 'Show details'}
            >
              <InfoIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-4 text-emerald-500 dark:text-emerald-400 mb-3">
            <span className="font-medium">Sets: {exercise.sets}</span>
            <span className="font-medium">Reps: {exercise.reps}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">{exercise.description}</p>
          
          {isDetailsVisible && (
            <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-sm transition-all duration-300 animate-fade-in">
              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Muscle Groups:</h4>
              <p className="text-slate-700 dark:text-slate-300 mb-3">{exercise.muscleGroups.join(', ')}</p>

              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Equipment:</h4>
              <p className="text-slate-700 dark:text-slate-300 mb-3">{exercise.equipment}</p>

              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Form Tips:</h4>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
                {exercise.formTips.map((tip, index) => <li key={index}>{tip}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-auto grid grid-cols-2 gap-3">
            <button
              onClick={onToggleComplete}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2 ${
                isCompleted 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {isCompleted && <CheckIcon className="h-5 w-5" />}
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <PlayIcon className="h-5 w-5" />
              Watch Tutorial
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <VideoModal
          videoUrl={videoUrl}
          title={exercise.name}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default WorkoutCard;