import '../styles/Playlist.css';
import FileList from './FileList'

export default function Playlist({ files, onFileSelect }) {
    return (
        <div className="playlist">
            <div className="playlist-header">
                <button>UP NEXT</button>
                <button>LYRICS</button>
                <button>RELATED</button>
            </div>
            <FileList files={files} onFileSelect={onFileSelect} />
        </div>
    );
}
