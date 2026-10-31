function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function EmployeeList({
  employees,
  loading,
  error,
  onRetry,
  onSelect,
  page,
  totalPages,
  onPageChange,
}) {
  if (loading && employees.length === 0) {
    return (
      <div className="list">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="row row--skeleton" key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state">
        <p>{error}</p>
        <button className="btn btn--solid" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (employees.length === 0) {
    return <div className="state">No Employees. Please Add one!</div>;
  }

  return (
    <>
      <div className="list-head" aria-hidden="true">
        <span>ID</span>
        <span>Name</span>
        <span className="hide-sm">Email</span>
        <span className="hide-md">Phone</span>
      </div>

      <ul className={`list ${loading ? "list--loading" : ""}`}>
        {employees.map((emp, i) => (
          <li
            key={emp.id}
            className="row"
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => onSelect(emp)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(emp)}
            tabIndex={0}
            role="button"
          >
            <span className="row__id">#{emp.id}</span>
            <span className="row__name">
              <span className="avatar">{initials(emp.name)}</span>
              {emp.name}
            </span>
            <span className="row__email hide-sm">{emp.email}</span>
            <span className="row__phone hide-md">{emp.phone}</span>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="pager">
          <button
            className="btn"
            disabled={page === 0 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            ← Prev
          </button>
          <span className="pager__info">
            Page {page + 1} / {totalPages}
          </span>
          <button
            className="btn"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => onPageChange(page + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </>
  );
}
