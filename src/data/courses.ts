import type { Course } from '../types'

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Foundations of Breast Anatomy',
    description:
      'Build a clear mental map of the breast and chest wall: where the landmarks are, how lymph nodes connect, and what tissue density feels like.',
    required: true,
    order: 1,
    estimatedDuration: 'About 40 minutes',
    terms: [
      { term: 'Lymph nodes', definition: 'Small, bean-shaped structures that filter lymph fluid. Clusters sit in the underarm, above the collarbone and along the breastbone.' },
      { term: 'Tissue density', definition: 'How much glandular and connective tissue there is compared with fatty tissue. Denser tissue feels firmer and more uniform.' },
      { term: 'Axilla', definition: 'The underarm region, home to the axillary lymph nodes.' },
      { term: 'Landmark', definition: 'A fixed point on the body, such as the collarbone, that helps you orient your hands and describe where you are.' },
    ],
  },
  {
    id: 'c2',
    title: 'Palpation Principles',
    description:
      'Learn how to use pressure, finger pads and a consistent palpation pattern so every examination is thorough and repeatable.',
    required: true,
    order: 2,
    estimatedDuration: 'About 45 minutes',
    terms: [
      { term: 'Palpation pattern', definition: 'The planned path your fingers follow so the whole area is covered once, in order.' },
      { term: 'Finger pads', definition: 'The soft, sensitive surface of the fingertips used to feel for differences in tissue.' },
      { term: 'Pressure levels', definition: 'Light, medium and deep pressure, applied in turn at each position to reach different tissue depths.' },
      { term: 'Orientation strips', definition: 'Tactile guides placed on the skin that give your hands fixed reference lines while you work.' },
    ],
  },
  {
    id: 'c3',
    title: 'Patient Communication Basics',
    description:
      'Practise the calm, clear language that helps patients feel informed and at ease before, during and after an examination.',
    required: true,
    order: 3,
    estimatedDuration: 'About 35 minutes',
    terms: [
      { term: 'Informed consent', definition: 'The patient understands what will happen and agrees to it before you begin.' },
      { term: 'Plain language', definition: 'Short, familiar words instead of technical terms, so nothing needs to be decoded.' },
      { term: 'Check-in phrase', definition: 'A brief question such as "Is this comfortable?" asked at natural pauses.' },
    ],
  },
  {
    id: 'c4',
    title: 'Clinical Documentation Vocabulary',
    description:
      'Optional. Learn the consistent words and structure used to record what you found, so the next person can rely on your notes.',
    required: false,
    order: 4,
    estimatedDuration: 'About 25 minutes',
    terms: [
      { term: 'Documentation protocol', definition: 'The agreed structure and wording for recording an examination, in the same order every time.' },
      { term: 'Finding', definition: 'Something you noticed during the examination, described by location, size, texture and mobility.' },
      { term: 'Laterality', definition: 'Whether a finding is on the left or right side.' },
    ],
  },
]
