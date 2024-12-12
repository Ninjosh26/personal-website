import "./styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          Kate's Website
        </a>
      </div>
      <div className="navbar-right">
        <ul className="nav-links">
          <li>
            <a href="/activities">Activity Choices</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
