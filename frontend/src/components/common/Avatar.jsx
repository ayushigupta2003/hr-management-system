import clsx from 'clsx';

const GRADIENTS = [
  'from-brand-400 to-brand-600',
  'from-emerald-400 to-emerald-600',
  'from-violet-400 to-violet-600',
  'from-amber-400 to-amber-600',
  'from-sky-400 to-sky-600',
  'from-rose-400 to-rose-600',
];

/** Deterministic gradient based on name string */
function pickGradient(name = '') {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[code % GRADIENTS.length];
}

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-7 w-7 text-xs',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-12 w-12 text-base',
};

/**
 * Avatar circle showing initials with a deterministic gradient.
 *
 * @param {string} name   Full name — used to derive initials and gradient
 * @param {string} size   'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} className
 */
export function Avatar({ name = '', size = 'md', className }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <span
      className={clsx(
        'inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm',
        pickGradient(name),
        SIZES[size] ?? SIZES.md,
        className,
      )}
      aria-label={name}
    >
      {initials || '?'}
    </span>
  );
}
