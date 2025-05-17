import '../styles/Navbar.css';

export default function Navbar({ onMenuClick }) {
    const userIcon = null;

    return (
        <header>
            <div className='nav-left'>
                <span className='material-icons-outlined menu-btn' onClick={onMenuClick}>menu</span>
                M-Player
            </div>

            <input type="text" placeholder="Search music ... " />

            <div className="user-profile">
                {
                    userIcon
                        ?
                        <img src='user-icon.png' alt="User" />
                        :
                        <span className="material-icons-outlined">account_circle</span>
                }
            </div>
        </header>

        //         <nav className='navbar'>
        //             <button onClick={onMenuClick}>
        //                 <span className='material-icons'>menu</span>
        //             </button>
        //             <h1>Music Player</h1>
        //         </nav>
    );
}
