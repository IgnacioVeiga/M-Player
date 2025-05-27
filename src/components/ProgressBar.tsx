import { ProgressBarProps } from '@/types';
import '@/styles/ProgressBar.css';

export default function ProgressBar({ progress, duration, onProgressChange }: ProgressBarProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onProgressChange(newValue);
    };

    return (
        <div className='progress-bar'>
            <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={progress}
                onChange={handleChange}
                style={{ '--progress': `${(progress / duration) * 100}%` } as React.CSSProperties}
            />
        </div>
    );
}
