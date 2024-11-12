import '../styles/Controls.css';
import ProgressBar from './ProgressBar';
import Artwork from './Artwork';
import useAudioPlayer from '../hooks/useAudioPlayer';

export default function Controls({ file, onPrevious, onNext, onPlayPause, isPlaying }) {
    const { audioRef, progress, duration, setProgress } = useAudioPlayer(file, isPlaying);

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <footer>
            <audio ref={audioRef} hidden />
            <div className='controls-left'>
                <button onClick={onPrevious}>
                    <span className='material-icons'>skip_previous</span>
                </button>
                <button onClick={onPlayPause}>
                    {
                        isPlaying ?
                            <span className='material-icons'>pause</span>
                            :
                            <span className='material-icons'>play_arrow</span>
                    }
                </button>
                <button onClick={onNext}>
                    <span className='material-icons'>skip_next</span>
                </button>

                <span className='time'>{formatTime(progress)} / {formatTime(duration)}</span>
            </div>

            <div className="metadata">
                <Artwork file={file} size="thumbnail" />
                <div className='metadata-text'>
                    <span>{file?.title || 'Unknown Title'}</span>
                    <span className='sub-title'>
                        {file?.artist || 'Unknown Artist'} - {file?.album || 'Unknown Album'}
                    </span>
                </div>
            </div>

            <ProgressBar
                progress={progress}
                duration={duration}
                onProgressChange={handleProgressChange}
            />

            <div className='controls-right'>
                <button>
                    <span className='material-icons-outlined'>volume_up</span>
                </button>
                <button>
                    <span className='material-icons'>repeat</span>
                </button>
                <button>
                    <span className='material-icons'>shuffle</span>
                </button>
            </div>
        </footer>
    );
}