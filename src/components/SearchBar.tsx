import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <search className="search-bar" role="search">
      <label className="sr-only" htmlFor="prototype-search">
        Search
      </label>
      <input
        id="prototype-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        type="search"
        value={query}
      />
    </search>
  );
}
