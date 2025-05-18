import '../styles/FileList.css';
import Artwork from './Artwork';

export default function FileList({ files, file, onFileSelect }) {
    return (
        <ul className='file-list'>
            {files.map((f, index) => (
                <li
                    key={index}
                    className={`file-item ${file?.path === f.path ? 'active' : ''}`}
                    onClick={() => onFileSelect(f)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Artwork file={f} size="thumbnail" />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{f.title || f.name}</span>
                            <span className="sub-info">{f.artist || 'Unknown Artist'}</span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
