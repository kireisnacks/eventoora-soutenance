'use client'

import { useState, KeyboardEvent } from 'react'
import { FieldValues, FieldErrors, UseFormRegister } from 'react-hook-form'

interface AutocompleteInputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  suggestions?: string[];
  onSearch?: (term: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  required,
  register,
  errors,
  suggestions = [],
  onSearch
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    )
   
    if (onSearch) {
      onSearch(value)
    }
    setFilteredSuggestions(filtered)
    setShowSuggestions(true)
    setSelectedIndex(-1)
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    const event = {
      target: { value: suggestion, name: id }
    }
    register(id).onChange(event)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectSuggestion(filteredSuggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <label className="font-medium text-sm">
        {label}
      </label>
      <input
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        type={type}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
        className={`
          w-full
          p-4
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
        `}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white mt-4 border rounded-md shadow-lg top-[74px] max-h-[200px] overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`
                p-3 
                cursor-pointer 
                transition
                ${selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-100'}
              `}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutocompleteInput
