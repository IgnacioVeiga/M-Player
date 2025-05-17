import '../styles/Sidebar.css';

export default function Sidebar({ isOpen, toggleSidebar, onFilesSelected }) {
    const handleSelectFiles = async () => {
        const selectedFiles = await window.Electron.selectAudioFiles();
        if (selectedFiles) {
            onFilesSelected(selectedFiles); // Pass the files with metadata
        }
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><span className='material-icons-outlined'>home</span> Principal</li>
                    <li><span className='material-icons-outlined'>explore</span> Explore</li>
                    <li><span className='material-icons-outlined'>library_music</span> Library</li>
                    <li onClick={handleSelectFiles}><span className='material-icons-outlined'>add</span> Add</li>
                </ul>
            </div>
            <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
        </>
    );
}

// export default function Sidebar({ onFilesSelected, isOpen, toggleSidebar }) {
//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files).map(file => ({
//             path: URL.createObjectURL(file),
//             name: file.name,
//             title: file.name.split('.').slice(0, -1).join('.'),
//         }));
//         onFilesSelected(selectedFiles);
//         toggleSidebar();
//     };

//     return (
//         <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//             <label className="file-input-label">
//                 Select Songs
//                 <input type="file" accept="audio/*" multiple onChange={handleFileChange} hidden />
//             </label>
//         </div>
//     );
// }