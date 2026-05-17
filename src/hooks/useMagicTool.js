import { useCallback, useMemo, useState } from 'react';
import { OPTIONAL_STEPS, STEP_META, WIZARDS, PICK_CATEGORY_STEP } from '@components/magic/wizardConfig.js';

/**
 * Wizard step state machine.
 *
 * @param {object} opts
 * @param {string|null} opts.category  current wizard category (e.g. "resume"),
 *                                     or null to start with a category picker
 * @param {number} opts.initial        starting step index (default 0)
 *
 * Returns:
 *   step           — { id, label, emoji, subtitle }
 *   stepId         — convenience accessor
 *   stepIndex      — 0-based index
 *   total          — number of steps
 *   progress       — percentage 0–100
 *   isFirst / isLast / canSkip
 *   stepIds        — array of step ids in this wizard
 *   next() / back() / jumpTo(id) / reset()
 */
export function useMagicTool({ category, initial = 0 } = {}) {
  // If no category is set yet, start with the category-picker step.
  const stepIds = useMemo(() => {
    if (!category) return [PICK_CATEGORY_STEP];
    const w = WIZARDS[category];
    return w ? w.steps : [PICK_CATEGORY_STEP];
  }, [category]);

  const [stepIndex, setStepIndex] = useState(initial);

  const id = stepIds[stepIndex];
  const meta = STEP_META[id] || { label: id, emoji: '✨', subtitle: '' };
  const step = { id, ...meta };
  const total = stepIds.length;

  const next  = useCallback(() => setStepIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const back  = useCallback(() => setStepIndex((i) => Math.max(0, i - 1)), []);
  const reset = useCallback(() => setStepIndex(0), []);

  const jumpTo = useCallback((targetId) => {
    const idx = stepIds.findIndex((s) => s === targetId);
    if (idx >= 0) setStepIndex(idx);
  }, [stepIds]);

  return useMemo(() => ({
    step,
    stepId:   id,
    stepIds,
    stepIndex,
    total,
    progress: Math.round(((stepIndex + 1) / total) * 100),
    isFirst:  stepIndex === 0,
    isLast:   stepIndex === total - 1,
    canSkip:  OPTIONAL_STEPS.has(id),
    next, back, jumpTo, reset,
  }), [step, id, stepIds, stepIndex, total, next, back, jumpTo, reset]);
}
