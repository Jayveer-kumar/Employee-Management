import { useEffect, useState } from "react";
import { addNewEmployee } from "../api.js";

export default function AddEmployeeModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiError("");
    try {
      const created = await addNewEmployee(form);
      onAdded(created);
    } catch (err) {
      setApiError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal__head">
          <h2>Add New Employee</h2>
          <span className="muted">Add New Details of the employee</span>
        </div>

        {apiError && <div className="alert">{apiError}</div>}

        <form className="modal__body" onSubmit={save} noValidate>
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
            <button type="button" className="btn" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn--solid" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}