// Tiny classnames helper: classNames('a', cond && 'b', 'c') -> "a b c"

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}
