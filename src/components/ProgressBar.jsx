import '../styles/ProgressBar.css'

export default function ProgressBar({ progress, duration, onProgressChange }) {
    return (
        <div className="progress-bar">
            <progress
                value={(progress / duration) * 100 || 0}
                min="0" max="100"
                onChange={onProgressChange}
            />
        </div>
    );
}
