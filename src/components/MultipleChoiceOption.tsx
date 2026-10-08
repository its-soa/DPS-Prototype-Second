import { cn } from '../lib/cn'

interface Props {
  name: string
  optionId: string
  letter: string
  label: string
  selected: boolean
  onSelect: () => void
}

/** A native radio inside a label: arrow keys, Space and screen reader "radio button, 2 of 4" all just work. */
export function MultipleChoiceOption({ name, optionId, letter, label, selected, onSelect }: Props) {
  return (
    <label
      className={cn(
        'flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border-2 p-4 text-lg transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-blue-700',
        selected ? 'border-brand-700 bg-brand-50 font-bold' : 'border-slate-300 bg-white hover:bg-slate-50',
      )}
    >
      <input
        type="radio"
        name={name}
        value={optionId}
        checked={selected}
        onChange={onSelect}
        className="h-5 w-5 shrink-0 accent-brand-700"
      />
      <span>
        <span className="font-bold">{letter}.</span> {label}
        {selected && <span className="sr-only"> (selected)</span>}
      </span>
    </label>
  )
}
