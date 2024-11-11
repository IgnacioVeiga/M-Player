import '../styles/ProgressBar.css'

export default function ProgressBar({ progress, duration, onProgressChange }) {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div className="progress-bar">
            <span>{formatTime(progress)}</span>
            <progress
                value={(progress / duration) * 100 || 0}
                min="0" max="100"
                onChange={onProgressChange}
            />
            <span>{formatTime(duration)}</span>
        </div>
    );
}
