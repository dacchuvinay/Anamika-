import React, { useState, useMemo, useEffect } from 'react';
import { WORKOUT_PLAN } from '../constants';
import { Difficulty } from '../types';
import WorkoutCard from './WorkoutCard';
import SearchIcon from './icons/SearchIcon';

const LOCAL_STORAGE_KEY = 'completedExercises';
type GenderMode = 'boys' | 'girls';

interface WorkoutsProps {
  genderMode: GenderMode;
}

const difficultyLevels: ('All' | Difficulty)[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Workouts: React.FC<WorkoutsProps> = ({ genderMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All');
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsedIds: number[] = JSON.parse(saved);
        return new Set(parsedIds);
      }
    } catch (error) {
      console.error("Failed to load completed exercises from localStorage", error);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(completedExercises)));
    } catch (error) {
      console.error("Failed to save completed exercises to localStorage", error);
    }
  }, [completedExercises]);

  const handleToggleComplete = (exerciseId: number) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const filteredWorkouts = useMemo(() => {
    let workouts = WORKOUT_PLAN;

    if (difficultyFilter !== 'All') {
      workouts = workouts.filter(exercise => exercise.difficulty === difficultyFilter);
    }

    if (!searchTerm.trim()) {
      return workouts;
    }
    
    return workouts.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, difficultyFilter]);

  return (
    <section>
      <h2 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-6 text-center">Full Body Workout Plan</h2>
      
      <div className="mb-8 max-w-lg mx-auto">
        <div className="flex justify-center gap-2 mb-4">
          {difficultyLevels.map(level => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                difficultyFilter === level
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exercises by name..."
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-colors duration-300"
          />
        </div>
      </div>

      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((exercise) => (
            <WorkoutCard 
              key={exercise.id} 
              exercise={exercise} 
              isCompleted={completedExercises.has(exercise.id)}
              onToggleComplete={() => handleToggleComplete(exercise.id)}
              genderMode={genderMode}
            />
          ))}
        </div>
      ) : (
         <p className="text-center text-slate-500 dark:text-slate-400 mt-10">
          No exercises found matching your search criteria.
        </p>
      )}
    </section>
  );
};

export default Workouts;