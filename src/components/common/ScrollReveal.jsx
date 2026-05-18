// Wrap a child in a scroll-reveal animation. The child starts faded + slightly
// translated; when it scrolls into view (via IntersectionObserver) it eases
// up to its final position. Used to make the template gallery feel like cards
// are popping in as you scroll the dashboard.
//
// Pass `delay` (ms) to stagger reveals — useful in grids so the cards cascade
// rather than landing in unison. Honors `prefers-reduced-motion`: animations
// are skipped for users with motion-sensitivity preferences.

import { useEffect, useRef, useState } from 'react';

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function ScrollReveal({
  children,
  delay = 0,
  duration = 520,
  distance = 24,
  // Re-trigger every time the element enters? Default once (matches Apple-
  // style page reveals where things don't keep replaying as you scroll).
  once = true,
  // CSS easing curve.
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Extra root margin lets us start animating slightly before the element
  // actually crosses the bottom edge — feels less abrupt.
  rootMargin = '0px 0px -8% 0px',
  threshold = 0.08,
  style,
  className,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(PREFERS_REDUCED_MOTION);

  useEffect(() => {
    if (PREFERS_REDUCED_MOTION) { setVisible(true); return; }
    if (!ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
