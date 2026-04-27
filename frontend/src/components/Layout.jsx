import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container app-main">{children}</main>
      <footer className="footer">
        <div className="container">TechMarket. All rights reserved.</div>
      </footer>
    </div>
  );
}
