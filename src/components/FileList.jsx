import '../styles/FileList.css';
import Artwork from './Artwork';

export default function FileList({ files, onFileSelect }) {
    return (
        <ul className="file-list">
            {files.map((file, index) => (
                <li key={index} onClick={() => onFileSelect(file)} className="file-item">
                    <Artwork file={file} size="thumbnail" />
                    <div className="song-info">
                        <p>{file.title}</p>
                        <span>{file.artist} - {file.album}</span>
                    </div>
                    <span>{file.duration ? `${Math.floor(file.duration / 60)}:${Math.floor(file.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration'}</span>
                </li>
            ))}
        </ul>
    );
}