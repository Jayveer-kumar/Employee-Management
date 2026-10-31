export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {new Date().getFullYear()} EmployeeHub</span>
        <span>Built with React &amp; Spring Boot</span>
      </div>
    </footer>
  );
}
