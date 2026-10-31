import { useEffect, useState } from "react";
import { deleteEmployee, updateEmployee } from "../api.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function EmployeeModal({ employee, onClose, onUpdated, onDeleted }) {
  const [tab, setTab] = useState("view"); // "view" | "edit"
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Escape se band karo (confirm dialog khula ho to wo pehle band hoga)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !confirmOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, confirmOpen]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name required hai";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Valid email daalo";
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) err.phone = "Valid phone daalo";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const cancelEdit = () => {
    setForm({ name: employee.name, email: employee.email, phone: employee.phone });
    setErrors({});
    setApiError("");
    setTab("view");
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError("");
    try {
      const updated = await updateEmployee(employee.id, form);
      onUpdated(updated);
      setTab("view");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setApiError("");
    try {
      await deleteEmployee(employee.id);
      onDeleted();
    } catch (err) {
      setApiError(err.message);
      setConfirmOpen(false);
      setDeleting(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__head">
          <div>
            <h2>{employee.name}</h2>
            <span className="muted">Employee #{employee.id}</span>
          </div>
        </div>

        <div className="tabs" role="tablist">
          <button
            role="tab"
            className={`tab ${tab === "view" ? "tab--active" : ""}`}
            onClick={() => setTab("view")}
          >
            Details
          </button>
          <button
            role="tab"
            className={`tab ${tab === "edit" ? "tab--active" : ""}`}
            onClick={() => setTab("edit")}
          >
            Edit
          </button>
        </div>

        {apiError && <div className="alert">{apiError}</div>}

        {tab === "view" ? (
          <div className="modal__body" key="view">
            <dl className="details">
              <div>
                <dt>ID</dt>
                <dd>{employee.id}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{employee.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{employee.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{employee.phone}</dd>
              </div>
            </dl>

            <div className="actions">
              <button className="btn btn--danger" onClick={() => setConfirmOpen(true)}>
                Delete
              </button>
              <button className="btn btn--solid" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <form className="modal__body" key="edit" onSubmit={save} noValidate>
            <label className="field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={change} autoFocus />
              {errors.name && <small>{errors.name}</small>}
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={change} />
              {errors.email && <small>{errors.email}</small>}
            </label>
            <label className="field">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={change} />
              {errors.phone && <small>{errors.phone}</small>}
            </label>

            <div className="actions">
              <button type="button" className="btn" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn--solid" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>

      {confirmOpen && (
        <ConfirmDialog
          title="Delete employee?"
          message={`"${employee.name}" ko permanently delete kar diya jayega. Ye undo nahi hoga.`}
          confirmLabel={deleting ? "Deleting..." : "Yes, delete"}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
