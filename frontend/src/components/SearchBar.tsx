import { useState } from "react";

type SearchBarProps = {
  onSubmit?: (query: string) => void;
  disabled?: boolean;
};

export default function SearchBar({ onSubmit, disabled = false }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function submit() {
    const text = query.trim();
    if (!text || disabled) return;
    onSubmit?.(text);
    setQuery("");
  }

  return (
    <search className="search-bar" role="search">
      <label className="sr-only" htmlFor="prototype-search">
        Search
      </label>
      <input
        id="prototype-search"
        enterKeyHint="send"
        maxLength={4000}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Search"
        type="search"
        value={query}
      />
    </search>
  );
}
