// Sample resume content used when a doc is created. Replace per-user once
// auth + persistence are wired in.

export const DEFAULT_PERSON = {
  name:     'Alexandra Chen',
  title:    'Senior Product Designer',
  email:    'alex.chen@email.com',
  phone:    '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  website:  'alexchen.design',
  summary:  'Passionate product designer with 6+ years crafting intuitive digital experiences for world-class companies. Specialize in design systems, user research, and high-fidelity prototyping.',
  photoUrl: '',

  experience: [
    { id: 'e1', company: 'Figma',  role: 'Senior Product Designer', period: '2021 – Present',
      bullets: [
        'Led redesign of auto-layout system used by 4M+ designers',
        'Collaborated with engineering on 3 major product launches',
        'Mentored 3 junior designers from mid to senior level',
      ] },
    { id: 'e2', company: 'Airbnb', role: 'Product Designer', period: '2018 – 2021',
      bullets: [
        'Redesigned host onboarding flow, +32% completion rate',
        'Built and maintained the Mineral internal design system',
        'Facilitated 50+ user interviews across 8 countries',
      ] },
    { id: 'e3', company: 'IDEO',   role: 'Design Intern', period: '2017 – 2018',
      bullets: ['Worked on healthcare innovation projects for Fortune 500 clients'] },
  ],
  education: [
    { id: 'edu1', school: 'California College of the Arts', degree: 'BFA Interaction Design',         year: '2018', gpa: '3.9' },
    { id: 'edu2', school: 'Stanford d.school',              degree: 'Design Thinking Certificate',   year: '2020', gpa: ''    },
  ],
  skills:    ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'HTML / CSS', 'Motion Design', 'Swift UI', 'Accessibility'],
  hobbies:   ['Photography', 'Rock Climbing', 'Generative Art', 'Ceramics'],
  languages: [
    { lang: 'English',  level: 'Native' },
    { lang: 'Mandarin', level: 'Fluent' },
    { lang: 'French',   level: 'Conversational' },
  ],
  references: [
    { id: 'r1', name: 'Dr. Sarah Johnson', title: 'Engineering Manager', company: 'Figma',  email: 's.johnson@figma.com',  phone: '+1 (555) 111-2233', relationship: 'Direct manager · 2 years' },
    { id: 'r2', name: 'Marcus Lee',        title: 'VP of Design',         company: 'Airbnb', email: 'marcus.lee@airbnb.com', phone: '+1 (555) 222-3344', relationship: 'Skip-level manager · 3 years' },
  ],
};
