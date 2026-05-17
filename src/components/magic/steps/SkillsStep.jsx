import { TagInputStep } from './TagInputStep.jsx';

const SUGGESTIONS = [
  'Figma', 'Prototyping', 'User Research', 'Design Systems', 'HTML / CSS',
  'JavaScript', 'TypeScript', 'React', 'Python', 'SQL',
  'Project Management', 'Agile', 'Public Speaking', 'Leadership',
];

export function SkillsStep(props) {
  return (
    <TagInputStep {...props}
      fieldKey="skills"
      placeholder="Type a skill and press Enter…"
      suggestions={SUGGESTIONS}
    />
  );
}
