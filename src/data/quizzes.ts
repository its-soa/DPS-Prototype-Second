import type { Quiz } from '../types'

const mc = (
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  correctLabelForFeedback: string,
  hint = 'Choose one option.',
) => ({
  id,
  type: 'multiple-choice' as const,
  prompt,
  hint,
  options: options.map((label, i) => ({ id: String.fromCharCode(97 + i), label })),
  correctAnswer: String.fromCharCode(97 + correctIndex),
  feedbackCorrect: `Correct. ${correctLabelForFeedback} is the right answer.`,
  feedbackIncorrect: 'Incorrect. Try reviewing the previous module.',
})

const open = (id: string, prompt: string) => ({
  id,
  type: 'open-ended' as const,
  prompt,
  hint: 'Type your answer. Use "Hear my answer" to have it read back to you before you continue.',
})

export const quizzes: Quiz[] = [
  {
    id: 'c1-quiz-data',
    courseId: 'c1',
    passMark: 70,
    questions: [
      mc('c1-q1', 'Which practice traces the pathways that carry fluid from breast tissue toward the underarm?',
        ['Density grading', 'Lymphatic mapping', 'Pattern sweeping', 'Surface marking'], 1, 'Lymphatic mapping'),
      mc('c1-q2', 'Where are the axillary lymph nodes found?',
        ['Along the lower ribs', 'Beside the navel', 'In the underarm', 'Behind the shoulder blade'], 2, 'The underarm'),
      mc('c1-q3', 'What does tissue density describe?',
        ['How warm the skin feels', 'How much glandular and connective tissue there is compared with fatty tissue', 'How large the breast is', 'How deep your pressure should be'], 1, 'The balance of glandular and connective tissue to fatty tissue'),
      mc('c1-q4', 'Which landmark marks the upper boundary of the examination area?',
        ['The collarbone', 'The pelvic rim', 'The elbow crease', 'The kneecap'], 0, 'The collarbone'),
      open('c1-q5', 'In your own words, explain the purpose of lymphatic mapping to a new colleague.'),
      open('c1-q6', 'Which landmarks would you use to confirm you have covered the whole examination area, and why?'),
    ],
  },
  {
    id: 'c2-quiz-data',
    courseId: 'c2',
    passMark: 70,
    questions: [
      mc('c2-q1', 'Which part of the finger should you use to feel for changes in tissue?',
        ['The very tip of the nail', 'The side of the finger', 'The soft finger pad', 'The knuckle'], 2, 'The soft finger pad'),
      mc('c2-q2', 'In what order do you apply pressure at each position?',
        ['Deep, then light, then medium', 'Light, then medium, then deep', 'Medium only', 'Deep only'], 1, 'Light, then medium, then deep'),
      mc('c2-q3', 'Why do you follow the same palpation pattern each time?',
        ['It is faster', 'It makes sure the whole area is covered once, in order', 'It is more comfortable for the examiner', 'It avoids needing landmarks'], 1, 'Covering the whole area once, in order'),
      mc('c2-q4', 'What do orientation strips give your hands?',
        ['Extra pressure', 'Fixed reference lines', 'A warmer surface', 'A way to avoid documentation'], 1, 'Fixed reference lines'),
      open('c2-q5', 'Describe how you would keep track of what you feel while following a palpation pattern.'),
    ],
  },
  {
    id: 'c3-quiz-data',
    courseId: 'c3',
    passMark: 70,
    questions: [
      mc('c3-q1', 'What should you do before you begin touching the patient?',
        ['Start immediately to save time', 'Explain what will happen, in plain language', 'Ask them to read a leaflet', 'Wait for them to speak first'], 1, 'Explaining what will happen in plain language'),
      mc('c3-q2', 'When can a patient pause or stop the examination?',
        ['Only before it starts', 'Only at the end', 'At any moment', 'Only with a trainer present'], 2, 'At any moment'),
      mc('c3-q3', 'Which is the best check-in phrase?',
        ['"Is this pressure comfortable?"', '"Everything is fine, relax."', '"Please stop moving."', '"Do you understand the pathology?"'], 0, '"Is this pressure comfortable?"'),
      mc('c3-q4', 'A patient becomes upset. What is the first thing to do?',
        ['Continue quickly', 'Pause and acknowledge what you are hearing', 'End the appointment without a word', 'Change the subject'], 1, 'Pausing and acknowledging'),
      open('c3-q5', 'Write the words you would use to open an examination with a nervous patient.'),
    ],
  },
  {
    id: 'c4-quiz-data',
    courseId: 'c4',
    passMark: 70,
    questions: [
      mc('c4-q1', 'What does laterality describe?',
        ['The size of a finding', 'Whether a finding is on the left or the right', 'How firm a finding is', 'How deep a finding is'], 1, 'Left or right'),
      mc('c4-q2', 'Which description is the most useful in a note?',
        ['"A lump"', '"Something unusual"', '"Firm, pea-sized, moves freely"', '"Seems fine"'], 2, '"Firm, pea-sized, moves freely"'),
      mc('c4-q3', 'Why should you describe findings in a fixed order?',
        ['It makes notes easy to scan and compare', 'It makes notes longer', 'It avoids using landmarks', 'It replaces the need for a protocol'], 0, 'Making notes easy to scan and compare'),
      mc('c4-q4', 'What should you do before closing a note?',
        ['Delete anything uncertain', 'Read it back and check a colleague could use it', 'Add extra detail from memory', 'Send it without review'], 1, 'Reading it back'),
      open('c4-q5', 'Write a short example note for a single finding, using the fixed order from this course.'),
    ],
  },
]
