"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const LOCATION_DEBOUNCE_MS = 400;

export interface LocationInputProps {
  /** Current location value (controlled). */
  value: string;
  /** Called when value changes (typing or selecting a suggestion). */
  onChange: (value: string) => void;
  /** Input placeholder. */
  placeholder?: string;
  /** Label text shown above the input. */
  label?: string;
  /** Input id for the label's htmlFor. */
  id?: string;
  /** Optional class name for the wrapper div. */
  className?: string;
  /** Optional class name for the input. */
  inputClassName?: string;
}

/**
 * Reusable location input with place autocomplete (Nominatim).
 * Search for cities, states, countries; select from dropdown or keep custom text.
 */
export function LocationInput({
  value,
  onChange,
  placeholder = "Search for a location",
  label = "Location",
  id = "location",
  className,
  inputClassName,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      setLoading(true);
      const params = new URLSearchParams({
        q: query,
        format: "json",
        addressdetails: "1",
        limit: "8",
      });
      fetch(`${NOMINATIM_URL}?${params}`, {
        method: "GET",
        headers: {
          "Accept-Language": "en",
          "User-Agent": "AbioProfile/1.0 (https://github.com/abio; contact@abio.app)",
        },
        signal,
      })
        .then((res) => res.json())
        .then((data: { display_name?: string }[]) => {
          if (signal.aborted) return;
          const names = (data || [])
            .map((item) => item.display_name)
            .filter((name): name is string => typeof name === "string");
          setSuggestions(names);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setSuggestions([]);
        })
        .finally(() => {
          if (!signal.aborted) setLoading(false);
        });
    }, LOCATION_DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      abortRef.current?.abort();
    };
  }, [value]);

  const showDropdown =
    dropdownOpen &&
    focused &&
    (suggestions.length > 0 || loading) &&
    value.trim().length >= 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    setDropdownOpen(true);
  };

  const handleSelect = (selected: string) => {
    onChange(selected);
    setDropdownOpen(false);
  };

  return (
    <div className={className} ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="text-left text-[12px] font-semibold block">
          {label}
        </label>
      )}
      <div className="relative flex items-center border border-black px-3 py-2 bg-transparent gap-1">
        <MapPin className="w-4 h-4 shrink-0 text-gray-700" />
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
            if (value.trim().length >= 2) setDropdownOpen(true);
          }}
          onBlur={() => setFocused(false)}
          className={`flex-1 min-w-0 bg-transparent outline-none text-[16px] md:text-[12px] placeholder:text-[16px] md:placeholder:text-[12px] text-gray-800 ${inputClassName ?? ""}`}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
        />
        {showDropdown && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-y-auto border border-black bg-white shadow-lg"
            style={{ minWidth: "100%" }}
          >
            {loading ? (
              <li className="px-3 py-3 text-[14px] text-gray-500" role="status">
                Searching…
              </li>
            ) : suggestions.length === 0 ? (
              <li className="px-3 py-3 text-[14px] text-gray-500" role="status">
                No places found. You can still use your text as location.
              </li>
            ) : (
              suggestions.map((item) => (
                <li
                  key={item}
                  role="option"
                  tabIndex={-1}
                  className="cursor-pointer px-3 py-2 text-[16px] md:text-[12px] text-gray-800 hover:bg-gray-100 focus:bg-gray-100 outline-none"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  {item}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
