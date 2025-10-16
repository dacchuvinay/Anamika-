import React, { useState, useEffect, useMemo } from 'react';
import { WEEKLY_SCHEDULE, WORKOUT_PLAN } from '../constants';
import ChevronDownIcon from './icons/ChevronDownIcon';
import RestIcon from './icons/RestIcon';
import VideoModal from './VideoModal';
import PlayIcon from './icons/PlayIcon';

type GenderMode = 'boys' | 'girls';

interface DailyWorkoutsProps {
  genderMode: GenderMode;
}

const DailyWorkouts: React.FC<DailyWorkoutsProps> = ({ genderMode }) => {
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({ url: '', title: ''});

  const exercisesById = useMemo(() => {
    return WORKOUT_PLAN.reduce((acc, exercise) => {
      acc[exercise.id] = exercise;
      return acc;
    }, {} as Record<number, typeof WORKOUT_PLAN[0]>);
  }, []);

  useEffect(() => {
    const today = new Date().getDay(); // Sunday - 0, Monday - 1, etc.
    const currentDayPlan = WEEKLY_SCHEDULE[today];
    if (currentDayPlan) {
      setOpenDay(currentDayPlan.day);
    }
  }, []);

  const handleToggleDay = (day: string) => {
    setOpenDay(prevOpenDay => (prevOpenDay === day ? null : day));
  };

  const openVideoModal = (url: string, title: string) => {
    setSelectedVideo({ url, title });
    setIsModalOpen(true);
  }

  const sortedSchedule = Object.values(WEEKLY_SCHEDULE).sort((a,b) => {
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
  });

  return (
    <section>
      <h2 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-6 text-center">Weekly Workout Schedule</h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {sortedSchedule.map((dayPlan) => {
          const isOpen = openDay === dayPlan.day;
          const isToday = new Date().toLocaleString('en-US', { weekday: 'long' }) === dayPlan.day;
          
          return (
            <div key={dayPlan.day} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <button
                onClick={() => handleToggleDay(dayPlan.day)}
                className={`w-full flex justify-between items-center p-5 text-left ${isToday ? 'bg-emerald-100/50 dark:bg-emerald-900/30' : ''}`}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4">
                    {isToday && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{dayPlan.day} - <span className="text-emerald-600 dark:text-emerald-400">{dayPlan.focus}</span></h3>
                </div>
                <ChevronDownIcon className={`h-6 w-6 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 animate-fade-in-down">
                  {dayPlan.isRestDay ? (
                    <div className="flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 py-4">
                        <RestIcon className="h-12 w-12 mb-3 text-emerald-500"/>
                        <p className="font-semibold">Time for recovery.</p>
                        <p className="text-sm">Rest is crucial for muscle growth and performance. Enjoy your day off!</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {dayPlan.exerciseIds.map(id => {
                        const exercise = exercisesById[id];
                        if (!exercise) return null;
                        const exerciseVideoUrl = genderMode === 'girls' && exercise.videoUrlFemale ? exercise.videoUrlFemale : exercise.videoUrl;
                        return (
                          <li key={id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{exercise.name}</p>
                                <p className="text-sm text-emerald-500 dark:text-emerald-400">Sets: {exercise.sets} &bull; Reps: {exercise.reps}</p>
                            </div>
                            <button
                              onClick={() => openVideoModal(exerciseVideoUrl, exercise.name)}
                              className="mt-2 sm:mt-0 bg-emerald-500 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                              <PlayIcon className="h-4 w-4" />
                              Watch
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
       {isModalOpen && (
        <VideoModal
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
};

export default DailyWorkouts;