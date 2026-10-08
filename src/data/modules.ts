import type { Module } from '../types'

export const modules: Module[] = [
  // ───────────── Course 1: Foundations of Breast Anatomy ─────────────
  {
    id: 'c1-m1',
    courseId: 'c1',
    title: 'Orienting to the breast and chest wall',
    type: 'reading',
    order: 1,
    estimatedMinutes: 8,
    summary: 'The landmarks and boundaries that frame every examination.',
    content: [
      {
        heading: 'Why landmarks come first',
        paragraphs: [
          'Every examination starts with orientation. Before your hands move across tissue, you need fixed reference points that never change from patient to patient. These are called landmarks.',
          'Landmarks let you describe where you are, return to the same spot, and explain a finding to a colleague without ambiguity.',
        ],
      },
      {
        heading: 'The boundaries of the examination area',
        paragraphs: [
          'The upper boundary is the clavicle, or collarbone. You can follow it with a flat hand from the base of the neck out to the shoulder.',
          'The inner boundary is the sternum, or breastbone, which runs down the centre of the chest. The lower boundary is found at the fold beneath the breast, and the outer boundary extends into the underarm, called the axilla.',
        ],
      },
      {
        heading: 'Thinking in quadrants',
        paragraphs: [
          'It helps to divide the area into four quadrants: upper outer, upper inner, lower outer and lower inner, with the nipple area at the centre. The upper outer quadrant extends toward the underarm and contains the most tissue.',
          'You will use these names throughout the course and again in the documentation vocabulary course, so take your time to hold the picture in your mind.',
        ],
      },
    ],
  },
  {
    id: 'c1-m2',
    courseId: 'c1',
    title: 'Lymph nodes and lymphatic mapping',
    type: 'audio',
    order: 2,
    estimatedMinutes: 3,
    summary: 'How lymph fluid travels and why mapping those pathways matters.',
    audioSeconds: 150,
    transcript: [
      {
        heading: 'What lymph nodes do',
        paragraphs: [
          'Welcome back. In this lesson we follow the path of lymph fluid through the breast and chest area.',
          'Lymph nodes are small, bean-shaped filters. They sit in clusters, and the largest group for our purposes is in the underarm, called the axillary lymph nodes. Other clusters sit above the collarbone and beside the breastbone.',
        ],
      },
      {
        heading: 'Lymphatic mapping',
        paragraphs: [
          'Lymphatic mapping is the practice of tracing the pathways that carry fluid from the breast tissue toward those node clusters. Think of it as a set of small streams that all flow toward the underarm.',
          'When you know the direction of flow, you know where to look, and you can describe what you feel in a way that other clinicians can follow.',
        ],
      },
      {
        heading: 'Bringing it into your hands',
        paragraphs: [
          'As you move through the upper outer quadrant, pay attention to how your fingers travel toward the axilla. Imagine the streams guiding your pattern.',
          'In the next reading module we will look at tissue density, and how it changes what your fingers feel. You can return to this audio at any time.',
        ],
      },
    ],
  },
  {
    id: 'c1-m3',
    courseId: 'c1',
    title: 'Tissue density and what it feels like',
    type: 'reading',
    order: 3,
    estimatedMinutes: 10,
    summary: 'Understanding how glandular and fatty tissue differ under your fingers.',
    content: [
      {
        heading: 'What tissue density means',
        paragraphs: [
          'Tissue density describes how much glandular and connective tissue is present compared with fatty tissue. It varies from person to person and changes over a lifetime.',
        ],
      },
      {
        heading: 'How it feels',
        paragraphs: [
          'Denser tissue tends to feel firmer and more granular. Fatty tissue feels softer and more yielding. Neither is good or bad; they are simply different baselines.',
          'Your job is to learn the baseline of the person in front of you, so that anything different from that baseline stands out.',
        ],
      },
      {
        heading: 'Why this matters for your technique',
        paragraphs: [
          'In denser tissue you will often need to rely more on medium and deep pressure. In softer tissue, light pressure may already reveal what you need. You will practise this in the Palpation Principles course.',
        ],
      },
    ],
  },
  {
    id: 'c1-quiz',
    courseId: 'c1',
    title: 'Course quiz',
    type: 'quiz',
    order: 4,
    estimatedMinutes: 15,
    summary: 'Four multiple choice questions and two written answers.',
  },

  // ───────────── Course 2: Palpation Principles ─────────────
  {
    id: 'c2-m1',
    courseId: 'c2',
    title: 'Pressure levels and finger pads',
    type: 'reading',
    order: 1,
    estimatedMinutes: 9,
    summary: 'Light, medium and deep pressure, and which part of the finger to use.',
    content: [
      {
        heading: 'Use the finger pads',
        paragraphs: [
          'The most sensitive part of your hand is the soft pad of each fingertip, not the very tip or the side. Keep your fingers relaxed and slightly flat so the pads make contact.',
        ],
      },
      {
        heading: 'Three levels of pressure',
        paragraphs: [
          'At every position you will apply light pressure first, then medium, then deep. Light pressure reaches tissue just beneath the skin. Medium reaches the middle layers. Deep pressure reaches tissue close to the chest wall.',
          'Moving through all three levels at each position ensures you do not miss anything at a particular depth.',
        ],
      },
      {
        heading: 'Stay steady',
        paragraphs: [
          'Small circular motions with steady, even contact work best. If your hand tires, pause and shake it out; consistency matters more than speed.',
        ],
      },
    ],
  },
  {
    id: 'c2-m2',
    courseId: 'c2',
    title: 'Following a palpation pattern',
    type: 'audio',
    order: 2,
    estimatedMinutes: 3,
    summary: 'A repeatable path that covers the whole area once, in order.',
    audioSeconds: 165,
    transcript: [
      {
        heading: 'Why a pattern',
        paragraphs: [
          'A palpation pattern is a planned path for your fingers. Following the same path every time means you can be sure the whole area has been covered, and nothing has been covered twice by accident.',
        ],
      },
      {
        heading: 'The vertical strip method',
        paragraphs: [
          'Begin at the underarm and move in straight vertical lines, up and down, shifting slightly toward the breastbone with each line. Think of mowing a lawn in neat parallel rows.',
          'Orientation strips give your other hand a fixed reference, so you always know which row you are on.',
        ],
      },
      {
        heading: 'Finishing',
        paragraphs: [
          'When you reach the breastbone you have completed the area. Finish by checking the underarm and above the collarbone. Take a breath, and note anything you want to describe in your documentation.',
        ],
      },
    ],
  },
  {
    id: 'c2-m3',
    courseId: 'c2',
    title: 'Pacing, rhythm and remembering what you feel',
    type: 'reading',
    order: 3,
    estimatedMinutes: 8,
    summary: 'Working at an even pace and keeping track of your findings.',
    content: [
      {
        heading: 'An even rhythm',
        paragraphs: [
          'A steady rhythm helps you notice differences. If you speed up, small changes are easy to miss. If you slow down too much, your attention can drift.',
        ],
      },
      {
        heading: 'Keeping track',
        paragraphs: [
          'Say your findings aloud or dictate a short note at the end of each strip: position, depth and what you felt. This avoids relying on memory at the end of the examination.',
        ],
      },
    ],
  },
  {
    id: 'c2-quiz',
    courseId: 'c2',
    title: 'Course quiz',
    type: 'quiz',
    order: 4,
    estimatedMinutes: 12,
    summary: 'Four multiple choice questions and one written answer.',
  },

  // ───────────── Course 3: Patient Communication Basics ─────────────
  {
    id: 'c3-m1',
    courseId: 'c3',
    title: 'Setting expectations before the examination',
    type: 'audio',
    order: 1,
    estimatedMinutes: 3,
    summary: 'What to say before you begin so nothing comes as a surprise.',
    audioSeconds: 120,
    transcript: [
      {
        heading: 'Start with what will happen',
        paragraphs: [
          'Before you touch the patient, explain in plain language what the examination involves, how long it will take, and what you will be doing with your hands.',
        ],
      },
      {
        heading: 'Invite questions',
        paragraphs: [
          'Ask whether there is anything the patient would like to know or anything that would make them more comfortable. Then wait. Silence is not awkward; it gives people space to speak.',
        ],
      },
    ],
  },
  {
    id: 'c3-m2',
    courseId: 'c3',
    title: 'Consent, comfort and clear language',
    type: 'reading',
    order: 2,
    estimatedMinutes: 8,
    summary: 'Informed consent and short check-in phrases.',
    content: [
      {
        heading: 'Informed consent',
        paragraphs: [
          'Consent means the patient understands what will happen and agrees. It is not a one-off signature; it continues throughout the examination, and the patient can pause or stop at any moment.',
        ],
      },
      {
        heading: 'Check-in phrases',
        paragraphs: [
          'Short questions at natural pauses keep the patient involved. "Is this pressure comfortable?" or "I am moving to the underarm now" are enough. Avoid jargon; use plain language.',
        ],
      },
    ],
  },
  {
    id: 'c3-m3',
    courseId: 'c3',
    title: 'Staying calm in difficult moments',
    type: 'audio',
    order: 3,
    estimatedMinutes: 3,
    summary: 'How to respond when a patient is anxious or upset.',
    audioSeconds: 135,
    transcript: [
      {
        heading: 'Slow down',
        paragraphs: [
          'If a patient becomes anxious or upset, pause. Take your hands away, lower your voice slightly, and acknowledge what you are hearing: "I can hear this is difficult. We can take a moment."',
        ],
      },
      {
        heading: 'Offer choices',
        paragraphs: [
          'Offering a choice, such as continuing, pausing or stopping, returns a sense of control to the patient. Follow their decision, and document it afterwards.',
        ],
      },
    ],
  },
  {
    id: 'c3-quiz',
    courseId: 'c3',
    title: 'Course quiz',
    type: 'quiz',
    order: 4,
    estimatedMinutes: 10,
    summary: 'Four multiple choice questions and one written answer.',
  },

  // ───────────── Course 4: Clinical Documentation Vocabulary (optional) ─────────────
  {
    id: 'c4-m1',
    courseId: 'c4',
    title: 'Describing findings with consistent terms',
    type: 'reading',
    order: 1,
    estimatedMinutes: 8,
    summary: 'Location, size, texture and mobility, in that order.',
    content: [
      {
        heading: 'A fixed order',
        paragraphs: [
          'Describe every finding in the same order: laterality (left or right), quadrant, distance from a landmark, size, texture and mobility. The same order every time makes notes easy to scan.',
        ],
      },
      {
        heading: 'Choose precise words',
        paragraphs: [
          'Prefer precise terms to vague ones. "Firm, about the size of a pea, moves freely" tells the next reader far more than "a lump".',
        ],
      },
    ],
  },
  {
    id: 'c4-m2',
    courseId: 'c4',
    title: 'The documentation protocol, step by step',
    type: 'audio',
    order: 2,
    estimatedMinutes: 3,
    summary: 'A guided walkthrough of a complete note.',
    audioSeconds: 140,
    transcript: [
      {
        heading: 'Walking through a note',
        paragraphs: [
          'A complete note begins with the date and patient identifier, then lists each finding in the agreed order, then ends with anything the patient told you and any follow-up that was agreed.',
        ],
      },
      {
        heading: 'Check before you close',
        paragraphs: [
          'Before closing the note, read it back. Ask yourself whether a colleague who was not in the room could find the same spot using only your words.',
        ],
      },
    ],
  },
  {
    id: 'c4-quiz',
    courseId: 'c4',
    title: 'Course quiz',
    type: 'quiz',
    order: 3,
    estimatedMinutes: 8,
    summary: 'Four multiple choice questions and one written answer.',
  },
]
