import '../styles/FileList.css';

export default function FileList({ files, file, onFileSelect }) {
    return (
        <ul className='file-list'>
            {files.map((f, index) => (
                <li
                    key={index}
                    className={`file-item ${file?.path === f.path ? 'active' : ''}`}
                    onClick={() => onFileSelect(f)}
                >
                    {f.title || f.name}
                    <span className="sub-info">{f.artist || 'Unknown Artist'}</span>
                </li>
            ))}
        </ul>
    );
}
