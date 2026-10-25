
import { useId, useState } from "react";
import { SMART_PEOPLE } from "../data/scientists";
import "./ScientistDirectory.css";

export default function ScientistDirectory() {
  const nameId = useId();
  const minIqId = useId();

  const [people, setPeople] = useState(SMART_PEOPLE);
  const [query, setQuery] = useState("");
  const [minIq, setMinIq] = useState(0);
  const [sortBy, setSortBy] = useState("iq-desc");

  const visiblePeople = people
    .filter((person) =>
      person.name.toLowerCase().includes(query.trim().toLowerCase())
    )
    .filter((person) => person.iq >= minIq)
    .toSorted((a, b) =>
      sortBy === "iq-desc"
        ? b.iq - a.iq
        : sortBy === "iq-asc"
          ? a.iq - b.iq
          : sortBy === "age-asc"
            ? a.age - b.age
            : b.age - a.age
    );

  function handleDelete(id) {
    setPeople((previous) => previous.filter((person) => person.id !== id));
  }

  function handleReset() {
    setPeople(SMART_PEOPLE);
    setQuery("");
    setMinIq(0);
    setSortBy("iq-desc");
  }

  return (
    <section className="directory" aria-labelledby="directory-title">
      <header className="directory-header">
        <p className="eyebrow">SMART PEOPLE · DIRECTORY</p>
        <h2 id="directory-title">Scientist Directory</h2>
        <p>Explore remarkable minds through search and smart filters.</p>
      </header>

      <form className="filters" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor={nameId}>Search by name</label>
          <input
            id={nameId}
            type="search"
            placeholder="e.g. Einstein"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor={minIqId}>Minimum IQ</label>
          <input
            id={minIqId}
            type="number"
            min="0"
            value={minIq}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              setMinIq(Number.isNaN(value) ? 0 : value);
            }}
          />
        </div>

        <div className="field">
          <label htmlFor={`${nameId}-sort`}>Sort by</label>
          <select
            id={`${nameId}-sort`}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="iq-desc">IQ: highest first</option>
            <option value="iq-asc">IQ: lowest first</option>
            <option value="age-asc">Age: youngest first</option>
            <option value="age-desc">Age: oldest first</option>
          </select>
        </div>

        <button type="button" className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </form>

      <p className="result-count" role="status" aria-live="polite">
        Found {visiblePeople.length} of {people.length} scientists
      </p>

      {visiblePeople.length > 0 ? (
        <ul className="scientist-list">
          {visiblePeople.map((person) => (
            <li className="scientist-card" key={person.id}>
              <div className="person-avatar" aria-hidden="true">
                {person.name.charAt(0)}
              </div>
              <div className="person-info">
                <h3>{person.name}</h3>
                <p>Age {person.age}</p>
              </div>
              <p className="person-iq">
                <strong>{person.iq}</strong>
                <span>IQ</span>
              </p>
              <button
                type="button"
                className="delete-button"
                aria-label={`Delete ${person.name}`}
                onClick={() => handleDelete(person.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No scientists match your filters.</p>
      )}
    </section>
  );
}
