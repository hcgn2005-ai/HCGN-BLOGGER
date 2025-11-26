import React, { useState, useMemo } from 'react';
import { DateStats } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FilterX } from 'lucide-react';

interface CalendarSidebarProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  stats: DateStats;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ selectedDate, onSelectDate, stats }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const calendarGrid = useMemo(() => {
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDate(day);
      const isSelected = selectedDate === dateKey;
      const hasPosts = stats[dateKey] > 0;
      const isToday = dateKey === new Date().toISOString().split('T')[0];

      days.push(
        <button
          key={day}
          onClick={() => onSelectDate(isSelected ? null : dateKey)}
          className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 relative group
            ${isSelected 
              ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)] scale-110 z-10' 
              : 'hover:bg-white/5 text-gray-400 hover:text-white hover:scale-105'
            }
            ${isToday && !isSelected ? 'border border-purple-500/50 text-purple-400' : ''}
          `}
        >
          {day}
          {hasPosts && !isSelected && (
             <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-fuchsia-400 shadow-[0_0_5px_rgba(232,121,249,0.8)]"></div>
          )}
        </button>
      );
    }
    return days;
  }, [year, month, selectedDate, stats]);

  return (
    <div className="space-y-6">
       {/* Calendar Card */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-purple-600/20 transition-all duration-700"></div>

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-200 tracking-wide">Calendar</h2>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-1 relative z-10">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all active:scale-95">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-lg text-gray-200">{monthNames[month]} <span className="text-purple-500">{year}</span></span>
          <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all active:scale-95">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-4 relative z-10">
           {['S','M','T','W','T','F','S'].map((d, i) => (
             <div key={i} className="text-[10px] uppercase font-bold text-gray-600 h-10 flex items-center justify-center tracking-widest">{d}</div>
           ))}
           {calendarGrid}
        </div>

        {/* Legend / Status */}
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 font-medium relative z-10">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_5px_rgba(232,121,249,0.8)]"></div>
                <span>Entry recorded</span>
            </div>
            {selectedDate && (
                <button 
                  onClick={() => onSelectDate(null)}
                  className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors group/clear"
                >
                    <FilterX className="w-3 h-3 group-hover/clear:rotate-90 transition-transform duration-300" />
                    <span>Clear Filter</span>
                </button>
            )}
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900 opacity-50"></div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Journal Stats</h3>
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors group">
                  <div className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      {(Object.values(stats) as number[]).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Total Entries</div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-colors group">
                  <div className="text-3xl font-bold text-purple-500 mb-1 group-hover:glow-text transition-all">
                      {Object.keys(stats).length}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Days Active</div>
              </div>
          </div>
      </div>
    </div>
  );
};