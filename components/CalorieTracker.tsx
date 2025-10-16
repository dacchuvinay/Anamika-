import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FoodItem } from '../types';
import { analyzeFoodImage } from '../services/geminiService';
import CameraIcon from './icons/CameraIcon';
import CameraComponent from './CameraComponent';
import Confetti from './Confetti';
import BellIcon from './icons/BellIcon';

const FOOD_ITEMS_KEY = 'calorieTrackerFoodItems';
const CALORIE_GOAL_KEY = 'calorieTrackerGoal';
const HYDRATION_GOAL_KEY = 'hydrationTrackerGoal';
const WATER_INTAKE_KEY = 'hydrationTrackerIntake';
const HYDRATION_REMINDERS_ENABLED_KEY = 'hydrationRemindersEnabled';
const HYDRATION_REMINDER_FREQUENCY_KEY = 'hydrationReminderFrequency';


// Custom hook to get the previous value of a prop or state
const usePrevious = <T,>(value: T): T | undefined => {
  // Fix: Provide an initial value to useRef to resolve a TypeScript error.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};


const CalorieTracker: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(FOOD_ITEMS_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Failed to load food items from localStorage", error);
      return [];
    }
  });

  const [calorieGoal, setCalorieGoal] = useState<number>(() => {
    try {
      const savedGoal = localStorage.getItem(CALORIE_GOAL_KEY);
      const goal = savedGoal ? parseInt(savedGoal, 10) : 2000;
      return isNaN(goal) ? 2000 : goal;
    } catch (error) {
      console.error("Failed to load calorie goal from localStorage", error);
      return 2000;
    }
  });

  const [waterIntake, setWaterIntake] = useState<number>(() => {
    try {
        const savedIntake = localStorage.getItem(WATER_INTAKE_KEY);
        const intake = savedIntake ? parseInt(savedIntake, 10) : 0;
        return isNaN(intake) ? 0 : intake;
    } catch (error) {
        console.error("Failed to load water intake from localStorage", error);
        return 0;
    }
  });

  const [hydrationGoal, setHydrationGoal] = useState<number>(() => {
      try {
          const savedGoal = localStorage.getItem(HYDRATION_GOAL_KEY);
          const goal = savedGoal ? parseInt(savedGoal, 10) : 2500;
          return isNaN(goal) ? 2500 : goal;
      } catch (error) {
          console.error("Failed to load hydration goal from localStorage", error);
          return 2500;
      }
  });

  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(HYDRATION_REMINDERS_ENABLED_KEY);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [reminderFrequency, setReminderFrequency] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(HYDRATION_REMINDER_FREQUENCY_KEY);
      const freq = saved ? parseInt(saved, 10) : 60;
      return isNaN(freq) ? 60 : freq;
    } catch {
      return 60;
    }
  });
  
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(FOOD_ITEMS_KEY, JSON.stringify(foodItems));
    } catch (error) {
      console.error("Failed to save food items to localStorage", error);
    }
  }, [foodItems]);

  useEffect(() => {
    try {
      localStorage.setItem(CALORIE_GOAL_KEY, calorieGoal.toString());
    } catch (error) {
      console.error("Failed to save calorie goal to localStorage", error);
    }
  }, [calorieGoal]);

  useEffect(() => {
    try {
        localStorage.setItem(WATER_INTAKE_KEY, waterIntake.toString());
    } catch (error) {
        console.error("Failed to save water intake to localStorage", error);
    }
  }, [waterIntake]);

  useEffect(() => {
      try {
          localStorage.setItem(HYDRATION_GOAL_KEY, hydrationGoal.toString());
      } catch (error) {
          console.error("Failed to save hydration goal to localStorage", error);
      }
  }, [hydrationGoal]);
  
  useEffect(() => {
    localStorage.setItem(HYDRATION_REMINDERS_ENABLED_KEY, JSON.stringify(remindersEnabled));
  }, [remindersEnabled]);

  useEffect(() => {
    localStorage.setItem(HYDRATION_REMINDER_FREQUENCY_KEY, reminderFrequency.toString());
  }, [reminderFrequency]);

  // Effect for handling notifications
  useEffect(() => {
    let intervalId: number | undefined;

    if (remindersEnabled && waterIntake < hydrationGoal && Notification.permission === 'granted') {
      intervalId = window.setInterval(() => {
        // Double-check goal inside interval in case it was met between intervals
        if (waterIntake < hydrationGoal) {
          new Notification('Time to Hydrate!', {
            body: `Don't forget to drink some water to reach your goal of ${hydrationGoal}ml.`,
            icon: '/vite.svg',
            silent: true,
          });
        }
      }, reminderFrequency * 60 * 1000); // Convert minutes to milliseconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [remindersEnabled, reminderFrequency, waterIntake, hydrationGoal]);


  const totalCalories = useMemo(() => {
    return foodItems.reduce((total, item) => total + item.calories, 0);
  }, [foodItems]);

  const prevTotalCalories = usePrevious(totalCalories);

  useEffect(() => {
    if (prevTotalCalories === undefined) return;

    if (prevTotalCalories < calorieGoal && totalCalories >= calorieGoal) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [totalCalories, prevTotalCalories, calorieGoal]);


  const calorieProgressPercentage = useMemo(() => {
    if (calorieGoal <= 0) return 0;
    const progress = (totalCalories / calorieGoal) * 100;
    return progress > 100 ? 100 : progress;
  }, [totalCalories, calorieGoal]);
  
  const hydrationProgressPercentage = useMemo(() => {
    if (hydrationGoal <= 0) return 0;
    const progress = (waterIntake / hydrationGoal) * 100;
    return progress > 100 ? 100 : progress;
  }, [waterIntake, hydrationGoal]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodName.trim() && calories !== '' && Number(calories) > 0) {
      const newItem: FoodItem = {
        id: Date.now(),
        name: foodName.trim(),
        calories: Number(calories),
      };
      setFoodItems([...foodItems, newItem]);
      setFoodName('');
      setCalories('');
    }
  };
  
  const handleRemoveItem = (id: number) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const handleCalorieGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    setCalorieGoal(isNaN(value) ? 0 : value);
  };

  const handleHydrationGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    setHydrationGoal(isNaN(value) ? 0 : value);
  };

  const handleAddWater = (amount: number) => {
      setWaterIntake(prev => Math.max(0, prev + amount));
  }
  
  const handleToggleReminders = () => {
    const willBeEnabled = !remindersEnabled;
    if (willBeEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setRemindersEnabled(true);
        }
      });
    } else {
      setRemindersEnabled(willBeEnabled);
    }
  };

  const handleClearDay = () => {
    setFoodItems([]);
    setWaterIntake(0);
  };

  const handleAnalyzeFood = async (base64Image: string) => {
    try {
        setScanError(null);
        const analyzedItems = await analyzeFoodImage(base64Image);
        if (analyzedItems.length > 0) {
            const newItems: FoodItem[] = analyzedItems.map(item => ({
                ...item,
                id: Date.now() + Math.random(),
            }));
            setFoodItems(prev => [...prev, ...newItems]);
        } else {
            setScanError("Could not identify any food in the image. Please try again.");
        }
    } catch (error) {
        console.error(error);
        setScanError(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
        setIsCameraOpen(false);
    }
};

  return (
    <section className="relative max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      {showConfetti && <Confetti />}
      <h2 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-6 text-center">Daily Nutrition Tracker</h2>
      
      <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Daily Calorie Goal</h3>
            <div className="flex items-center gap-2">
                <input 
                    type="number"
                    value={calorieGoal}
                    onChange={handleCalorieGoalChange}
                    className="w-28 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-right font-semibold px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Daily calorie goal"
                />
                <span className="text-slate-600 dark:text-slate-400">kcal</span>
            </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 overflow-hidden my-2">
            <div 
                className={`h-4 rounded-full transition-all duration-500 ${totalCalories > calorieGoal ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${calorieProgressPercentage}%`}}
                role="progressbar"
                aria-valuenow={totalCalories}
                aria-valuemin={0}
                aria-valuemax={calorieGoal}
            ></div>
        </div>
        <div className="text-center mt-2 font-bold text-lg">
            <span className={`${totalCalories > calorieGoal ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}`}>{totalCalories}</span>
            <span className="text-slate-500 dark:text-slate-400"> / {calorieGoal} kcal consumed</span>
        </div>
      </div>

      <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Daily Hydration Goal</h3>
            <div className="flex items-center gap-2">
                <input 
                    type="number"
                    value={hydrationGoal}
                    onChange={handleHydrationGoalChange}
                    className="w-28 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-right font-semibold px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Daily hydration goal"
                    step="100"
                />
                <span className="text-slate-600 dark:text-slate-400">ml</span>
            </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 overflow-hidden my-2">
            <div 
                className="h-4 rounded-full transition-all duration-500 bg-blue-500"
                style={{ width: `${hydrationProgressPercentage}%`}}
                role="progressbar"
                aria-valuenow={waterIntake}
                aria-valuemin={0}
                aria-valuemax={hydrationGoal}
            ></div>
        </div>
        <div className="text-center mt-2 font-bold text-lg">
            <span className="text-blue-500 dark:text-blue-400">{waterIntake}</span>
            <span className="text-slate-500 dark:text-slate-400"> / {hydrationGoal} ml consumed</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={() => handleAddWater(250)} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">+250 ml</button>
            <button onClick={() => handleAddWater(500)} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">+500 ml</button>
            <button onClick={() => handleAddWater(-250)} className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">-250 ml</button>
        </div>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-600/50 pt-4">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-blue-500 dark:text-blue-400"/>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Hydration Reminders</h4>
              </div>
              <button
                onClick={handleToggleReminders}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  remindersEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
                aria-checked={remindersEnabled}
                role="switch"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
          </div>
          {remindersEnabled && (
            <div className="mt-3">
              <label htmlFor="frequency" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Remind me every:
              </label>
              <select
                id="frequency"
                value={reminderFrequency}
                onChange={(e) => setReminderFrequency(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={120}>2 Hours</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => setIsCameraOpen(true)}
          className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <CameraIcon className="h-5 w-5" />
          Scan Meal with Camera
        </button>
        <button 
          type="submit" 
          form="manual-add-form"
          className="w-full bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-300"
        >
          Add Manually
        </button>
      </div>

      <form id="manual-add-form" onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="Food or Drink"
          className="flex-grow bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          placeholder="Calories"
          className="w-full md:w-32 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </form>
      {scanError && <p className="text-center text-red-500 dark:text-red-400 text-sm mb-4">{scanError}</p>}

      <div className="space-y-3 mb-6 min-h-[6rem]">
        {foodItems.length > 0 ? (
          foodItems.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-3 rounded-lg animate-fade-in">
              <span className="text-slate-800 dark:text-slate-200">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-500 dark:text-emerald-400 font-medium">{item.calories} kcal</span>
                <button 
                  onClick={() => handleRemoveItem(item.id)} 
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 font-bold text-xl"
                  aria-label={`Remove ${item.name}`}
                >
                  &times;
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">Add food manually or use the camera to scan your meal.</p>
        )}
      </div>

       <button 
        onClick={handleClearDay} 
        className="w-full mt-6 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-300 disabled:bg-red-400/50 dark:disabled:bg-red-500/30 disabled:cursor-not-allowed"
        disabled={foodItems.length === 0 && waterIntake === 0}
      >
          Clear Day
        </button>
        {isCameraOpen && (
            <CameraComponent 
                onClose={() => setIsCameraOpen(false)}
                onAnalyze={handleAnalyzeFood}
            />
        )}
    </section>
  );
};

export default CalorieTracker;