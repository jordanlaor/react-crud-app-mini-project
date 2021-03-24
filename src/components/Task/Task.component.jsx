export default function Task({ id, name, created, isCompleted, onCheckBoxChange, children, onInputChange, nameInput, edit, isLoading }) {
  return (
    <div className="task">
      {(edit && <input type="text" onChange={onInputChange} value={nameInput} />) || <h3>{name}</h3>}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{new Date(created).toLocaleDateString("en-GB", { year: "numeric", month: "numeric", day: "numeric" })}</div>
        <div style={{ display: "flex", gap: "20px" }}>
          {children}
          <input type="checkbox" checked={isCompleted} onChange={(e) => onCheckBoxChange(id, e)} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
