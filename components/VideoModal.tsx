import React, { useEffect } from 'react';

interface VideoModalProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, title, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl aspect-video relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <h2 id="video-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-2xl"
            aria-label="Close video player"
          >
            &times;
          </button>
        </div>
        <div className="w-full h-full">
            <iframe
                className="w-full h-full"
                src={`${videoUrl}?autoplay=1&rel=0`}
                title={`${title} video tutorial`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;