import '../styles/ProgressBar.css';

export default function ProgressBar({ progress, duration, onProgressChange }) {
    const progressPercentage = (progress / duration) * 100 || 0;

    const handleProgressClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        onProgressChange({ target: { value: (newTime / duration) * 100 } });
    };

    return (
        <div className="progress-container" onClick={(e) => onProgressChange(e)}>
            <div className="progress-bar" onClick={(e) => handleProgressClick(e)}
                style={{ width: `${progressPercentage}%` }}></div>
            <div className="progress-circle" style={{ left: `${progressPercentage}%` }}></div>
        </div>
    );
}
