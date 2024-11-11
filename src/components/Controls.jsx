import '../styles/Controls.css';
import ProgressBar from './ProgressBar';
import useAudioPlayer from '../hooks/useAudioPlayer';

export default function Controls({ file, onPrevious, onNext, onPlayPause, isPlaying }) {
    const { audioRef, progress, duration, setProgress } = useAudioPlayer(file, isPlaying);

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
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