import { ProgressBarProps } from '@/types';
import '@/styles/ProgressBar.css';
import { JSX } from 'react/jsx-runtime';

export default function ProgressBar({ progress, duration, onProgressChange }: ProgressBarProps): JSX.Element {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onProgressChange(newValue);
    };

    const percentage = duration ? (progress / duration) * 100 : 0;
    const clampedValue = duration ? Math.min(progress, duration) : 0;

    return (
        <div className='progress-bar'>
            <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={clampedValue}
                onChange={handleChange}
                disabled={!duration}
                style={{ '--progress': `${percentage}%` } as React.CSSProperties}
            />
        </div>
    );
}
