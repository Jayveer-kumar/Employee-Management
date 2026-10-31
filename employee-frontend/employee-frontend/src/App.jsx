import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import EmployeeList from "./components/EmployeeList.jsx";
import EmployeeModal from "./components/EmployeeModal.jsx";
import AddEmployeeModal from "./components/AddEmployeeModal.jsx";
import { fetchEmployees  } from "./api.js";

const PAGE_SIZE = 5; 

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [adding , setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEmployees({ page, size: PAGE_SIZE });
      console.log(data);
      setEmployees(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

      // Delete ke baad agar last page khali ho gaya to peeche jao
      if (data.content.length === 0 && page > 0) setPage(page - 1);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdded = () => {
    setAdding(false);
    // naya employee (id asc sort me) last page par hoga, wahin le jao
    const lastPage = Math.ceil((totalElements + 1) / PAGE_SIZE) - 1;
    if (lastPage === page) load();
    else setPage(lastPage);
  };

  const handleUpdated = (updated) => {
    setEmployees((list) =>
      list.map((e) => (e.id === updated.id ? updated : e)),
    );
    setSelected(updated);
  };

  const handleDeleted = () => {
    setSelected(null);
    load();
  };

  return (
    <div className="app">
      <Navbar total={totalElements} />
      <main className="container">
        <div className="page-head">
          <div>
            <h1>Employees</h1>
            <p>Click any employee row to read , update and delete action.</p>
          </div>
          <button className="btn btn--solid" onClick={() => setAdding(true)}>
            Add New Employee
          </button>
        </div>

        <EmployeeList
          employees={employees}
          loading={loading}
          error={error}
          onRetry={load}
          onSelect={setSelected}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
      <Footer />

      {selected && (
        <EmployeeModal
          employee={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}

      {adding && (
        <AddEmployeeModal
          onClose={() => setAdding(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
}
