"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useFormContext, useController } from "react-hook-form";
import { MagnifyingGlass, X, SortAscending } from "@phosphor-icons/react";

interface ComboboxFieldProps {
  name: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
}

type SortMode = "legajo" | "az";

function parseLegajo(value: string): number {
  const match = value.match(/^(\d+)\s*-/);
  return match ? parseInt(match[1], 10) : Infinity;
}

function parseApellido(value: string): string {
  const match = value.match(/^[\d\s]+-\s*(.+)/);
  return match ? match[1].toLowerCase() : value.toLowerCase();
}

export function ComboboxField({
  name,
  label,
  options,
  placeholder = "Buscar...",
  required,
}: ComboboxFieldProps) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("legajo");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useMemo(() => `combobox-list-${name.replace(/\./g, "-")}`, [name]);

  // Sort options
  const sortedOptions = useMemo(() => {
    const arr = [...options];
    if (sortMode === "legajo") {
      arr.sort((a, b) => parseLegajo(a) - parseLegajo(b));
    } else {
      arr.sort((a, b) => parseApellido(a).localeCompare(parseApellido(b), "es"));
    }
    return arr;
  }, [options, sortMode]);

  // Filter by query
  const filtered = useMemo(() => {
    if (!query.trim()) return sortedOptions;
    const q = query.toLowerCase().trim();
    return sortedOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [sortedOptions, query]);

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [filtered.length, query]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const select = useCallback(
    (value: string) => {
      field.onChange(value);
      setQuery("");
      setOpen(false);
      setActiveIndex(-1);
    },
    [field],
  );

  const clear = useCallback(() => {
    field.onChange("");
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, [field]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filtered[activeIndex]) {
            select(filtered[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [open, filtered, activeIndex, select],
  );

  const activeDescendant =
    activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">
          {label}
          {required && <span className="text-ardal ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Selected value display / search input */}
        {field.value && !open ? (
          <div
            className={`flex items-center gap-1.5 w-full cursor-pointer ${
              error ? "border-red-400 bg-red-50" : ""
            }`}
            style={{
              padding: "0.35rem 0.6rem",
              border: "1px solid #d4d4d8",
              borderRadius: "0.375rem",
              fontSize: "0.8125rem",
              lineHeight: "1.5",
              background: "#fafafa",
              color: "#18181b",
            }}
            onClick={() => {
              setOpen(true);
              setQuery("");
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            <span className="flex-1 truncate">{field.value}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="shrink-0 p-0.5 text-zinc-400 hover:text-red-500 rounded"
              style={{ transition: "color 0.15s var(--ease-spring)" }}
              tabIndex={-1}
            >
              <X size={12} weight="bold" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <MagnifyingGlass
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-activedescendant={activeDescendant}
              aria-autocomplete="list"
              value={query}
              placeholder={field.value || placeholder}
              className={`!pl-7 ${error ? "border-red-400 bg-red-50" : ""}`}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-50 mt-1 w-full bg-white border border-zinc-200 rounded-md shadow-lg overflow-hidden"
            style={{ transition: "opacity 0.15s var(--ease-spring)" }}
          >
            {/* Sort toggle */}
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-100 bg-zinc-50/80">
              <SortAscending size={12} className="text-zinc-400 shrink-0" />
              <button
                type="button"
                className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  sortMode === "legajo"
                    ? "text-ardal bg-ardal-light/50"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
                style={{ transition: "all 0.15s var(--ease-spring)" }}
                onClick={() => setSortMode("legajo")}
                tabIndex={-1}
              >
                Legajo
              </button>
              <button
                type="button"
                className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  sortMode === "az"
                    ? "text-ardal bg-ardal-light/50"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
                style={{ transition: "all 0.15s var(--ease-spring)" }}
                onClick={() => setSortMode("az")}
                tabIndex={-1}
              >
                A-Z
              </button>
              <span className="ml-auto text-[10px] text-zinc-400 font-mono tabular-nums">
                {filtered.length}
              </span>
            </div>

            {/* Options list */}
            <ul
              id={listId}
              ref={listRef}
              role="listbox"
              className="max-h-48 overflow-y-auto py-0.5"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-[12px] text-zinc-400 italic">
                  Sin resultados
                </li>
              ) : (
                filtered.map((opt, i) => (
                  <li
                    key={opt}
                    id={`${listId}-option-${i}`}
                    role="option"
                    aria-selected={field.value === opt}
                    className={`px-3 py-1.5 text-[13px] cursor-pointer select-none ${
                      i === activeIndex
                        ? "bg-ardal-light/40 text-ardal-dark"
                        : field.value === opt
                          ? "bg-zinc-100 font-medium"
                          : "text-zinc-700 hover:bg-zinc-50"
                    }`}
                    style={{ transition: "background 0.1s var(--ease-spring)" }}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      select(opt);
                    }}
                  >
                    {opt}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error.message ?? "Campo requerido"}
        </p>
      )}
    </div>
  );
}
