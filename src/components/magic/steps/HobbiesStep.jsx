import { TagInputStep } from './TagInputStep.jsx';

const SUGGESTIONS = [
  'Photography', 'Rock Climbing', 'Cooking', 'Reading',
  'Cycling', 'Travel', 'Music', 'Generative Art',
];

export function HobbiesStep(props) {
  return (
    <TagInputStep {...props}
      fieldKey="hobbies"
      placeholder="What do you enjoy outside of work?"
      suggestions={SUGGESTIONS}
    />
  );
}
