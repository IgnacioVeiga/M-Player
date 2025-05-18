import '../styles/Navbar.css';

export default function Navbar({ onMenuClick }) {
    const userIcon = null;

    return (
        <header className="navbar">
            <div className="nav-left">
                <span className="material-icons-outlined menu-btn" onClick={onMenuClick}>menu</span>
                <h1 className="logo">M-Player</h1>
            </div>

            <input type="text" className="search-input" placeholder="Search music..." />

            <div className="user-profile">
                {
                    userIcon
                        ? <img src='user-icon.png' alt="User" />
                        : <span className="material-icons-outlined">account_circle</span>
                }
            </div>
        </header>
    );
}
