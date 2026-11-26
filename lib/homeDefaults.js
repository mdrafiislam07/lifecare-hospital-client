// Home page er default content (admin e kichu na dile ei gulo dekhabe).
// Server (content.js) ar admin editor (SettingsEditor.js) dutoi eta use kore.
import { HOME_DEPTS, SERVICE_GRID, WHY, FACILITIES, TECH } from './data';

// Admin e on/off korar jonno home sections
export const HOME_SECTIONS = [
  ['about', 'About'], ['doctors', 'Doctors'], ['feedback', 'Patient feedback'], ['departments', 'Departments'],
  ['services', 'Services'], ['why', 'Why choose us'], ['facilities', 'Facilities'], ['tech', 'Technology'], ['news', 'News']
];

// Je page gulor upore banner dewa jay (CMS about/services/admission alada, Banners tab theke)
export const BANNER_PAGES = [
  ['doctors', 'Doctors list'], ['packages', 'Checkup packages'], ['news', 'News & Updates'],
  ['gallery', 'Gallery / Media'], ['contact', 'Contact'], ['ambulance', 'Ambulance'], ['appointment', 'Appointment']
];

export const HOME_DEFAULTS = {
  hidden: [],
  about: {
    title: 'One Of The Best Private Hospital Of Bangladesh For Quality Health Care, Surgery & Emergency',
    paragraphs: [
      'Apollo Hospital is a 250-beded tertiary care hospital (a sister concern of United Healthcare Services Ltd.) It is a state-of-the-art medical facility established in Jamalpur with world class healthcare amenities backed by a multidisciplinary team of medical fraternity with the finest state of the art technology available in Bangladesh.',
      'The operations of the hospital are conducting under direct supervision of United Healthcare Services Ltd. where we have full time salaried doctors, consultants on retainership basis and visiting consultants.',
      'The emergency department of Apollo Hospital is designed with a nationally competitive standard of medical experience which was missing in Jamalpur. With its modern equipment and facilities, we are ensuring affordable high quality medical care, i.e. right diagnosis for right treatment.'
    ]
  },
  doctorsTitle: 'Our Experienced And Qualified Doctors',
  feedbackTitle: 'Patient Experience And Feedback',
  feedbackTagline: 'আস্থা রাখুন... সুস্থ থাকুন',
  departmentsTitle: 'Our Departments: A Wide Range Of Medical Solutions',
  departments: HOME_DEPTS.map((d) => ({ name: d.name, icon: d.icon, dept: d.dept || '' })),
  servicesTitle: 'Our Services: Providing Affordable High Quality Medical Care Backed By A Multidisciplinary Team Of Medical Fraternity',
  servicesSub: 'Our patient-centric environment and multi-disciplinary treatment facilities make us unique from others.',
  services: [...SERVICE_GRID],
  serviceCards: [],          // admin: photo wala service card (khali = Services menu theke auto)
  whyTitle: 'WHY CHOOSE US?',
  whySub: 'We provide tertiary level clinical care backed by a multidisciplinary team of medical fraternity with the finest state of the art technology available in Bangladesh.',
  why: WHY.map((w) => ({ icon: w.icon, title: w.title, text: w.text })),
  facilitiesTitle: 'Our Facilities & Amenities',
  facilities: [...FACILITIES],
  techTitle: 'Our State-Of-The-Art Technology',
  techText: 'We have the finest state of the art technologies and modern equipment for screening, diagnosis, and treatment of specific diseases.',
  tech: TECH.map((t) => ({ title: t.title, text: t.text })),
  newsTitle: 'News & Updates'
};

// DB te ja ache (h) + default (khali thakle default dekhabe)
export function mergeHome(h) {
  h = h || {};
  const d = HOME_DEFAULTS, out = {};
  for (const k of Object.keys(d)) {
    const v = h[k];
    if (k === 'about') out.about = { title: v?.title || d.about.title, paragraphs: v?.paragraphs?.length ? v.paragraphs : d.about.paragraphs };
    else if (k === 'hidden') out.hidden = Array.isArray(v) ? v : [];
    else if (Array.isArray(d[k])) out[k] = v?.length ? v : d[k];
    else out[k] = v || d[k];
  }
  return out;
}