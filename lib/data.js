export const SITE = {
  name: 'Life Care Hospital',
  emergency: '+880 1806-176503',
  emergencyTel: '01806176500',
  contacts: ['01806-176500', '01806-176503'],
  email: 'lifecarehospitaljamalpur@gmail.com',
  address: 'New College Road, Kachari Para, Jamalpur-2000.',
  facebook: 'https://www.facebook.com/lifecarehospitaljamalpur/',
};

export const SPECIALTIES = [
  'Obstetrics & Gynaecology', 'Internal Medicine', 'General Surgery', 'Endocrinology', 'Gastroenterology',
  'Neuro Medicine', 'Orthopedic', 'ENT', 'Dental Unit', 'Dermatology', 'Respiratory Medicine',
  'Cardiology', 'Nephrology', 'Paediatrics', 'Urology', 'Oncology'
];

const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------- Info pages (About / Services / Admission) ----------
// NOTE: এই কন্টেন্টগুলো প্লেসহোল্ডার; হাসপাতালের আসল তথ্য দিয়ে এডিট করবেন।
const mk = (items) => items.map(([title, desc, points]) => ({ slug: slugify(title), title, desc, points }));

export const INFO = {
  about: {
    label: 'About',
    pages: mk([
      ['Vision & Values', 'আমাদের লক্ষ্য জামালপুর ও ময়মনসিংহের মানুষকে সহজলভ্য, উন্নত ও বিশ্বমানের স্বাস্থ্যসেবা দেওয়া।', ['Patient-centered care', 'Integrity & transparency', 'Continuous learning', 'Respect for every patient']],
      ['Patient Safety Initiatives', 'রোগীর নিরাপত্তা আমাদের প্রথম অগ্রাধিকার। প্রত্যেক বিভাগে স্ট্যান্ডার্ড সেফটি প্রোটোকল অনুসরণ করা হয়।', ['Patient identification protocol', 'Safe surgery checklist', 'Medication safety', 'Fall & infection prevention']],
      ['Hand Hygiene', 'হাসপাতালজনিত সংক্রমণ (Hospital-acquired infection) কমাতে হ্যান্ড হাইজিন গাইডলাইন কঠোরভাবে মেনে চলা হয়।', ['প্রতিটি ওয়ার্ডে অ্যালকোহল-ভিত্তিক স্যানিটাইজার', 'Staff training & audit', 'WHO 5 moments of hand hygiene', 'দর্শনার্থীদের জন্য স্যানিটাইজার পয়েন্ট']],
      ['Quality Improvement Plan', 'নিয়মিত অডিট, ফিডব্যাক ও ডেটা-ভিত্তিক উন্নয়নের মাধ্যমে সেবার মান বাড়ানোর পরিকল্পনা।', ['Patient feedback review', 'Clinical audit', 'Staff capacity building', 'Quarterly quality report']]
    ])
  },
  services: {
    label: 'Services',
    pages: mk([
      ['Emergency', 'ট্রমা, কার্ডিয়াক ও অন্যান্য জরুরি অবস্থার জন্য প্রস্তুত ইমার্জেন্সি ডিপার্টমেন্ট।', ['Trauma & accident care', 'Cardiac emergency', 'Resuscitation facilities', 'Emergency hotline: +880 1608-100008']],
      ['Ambulance Service', 'জরুরি অবস্থায় রোগীকে দ্রুত হাসপাতালে এনে দেওয়ার জন্য অ্যাম্বুলেন্স সেবা।', ['Basic & ICU ambulance', 'Online ambulance request', 'Call: +880 1608-100008']],
      ['Nursing', 'A trained nursing team takes care of the patient 24 hours a day.', ['Ward nursing', 'ICU / NICU nursing', 'Patient education']],
      ['LAB', 'আধুনিক প্যাথলজি ও ডায়াগনস্টিক ল্যাব; সঠিক রিপোর্ট দ্রুত প্রদান করা হয়।', ['Haematology & biochemistry', 'Microbiology', 'FNAC & biopsy', 'Home sample collection']],
      ['IPD', 'ভর্তি হওয়া রোগীদের জন্য আরামদায়ক কেবিন ও ওয়ার্ড।', ['General ward & cabin', 'ICU, NICU, CCU, HDU', 'Attendant accommodation']],
      ['OPD', '২০টি ওপিডি (OPD) রুমে ভিজিটিং ডাক্তার ও কনসালটেন্টদের পরামর্শ।', ['Specialist consultation', 'Online appointment', 'Follow-up visit']],
      ['Vaccination', 'শিশু ও বয়স্কদের জন্য প্রতিষেধক টিকা।', ['Child immunization', 'Adult vaccines', 'Vaccination card']],
      ['Pharmacy', 'হাসপাতাল ফার্মেসিতে প্রয়োজনীয় ওষুধ পাওয়া যায়।', ['Genuine medicines', 'Prescription fulfilment', 'Inpatient medicine supply']],
      ['Food & beverage', 'রোগীর জন্য পুষ্টিগুণসম্পন্ন ও পরিষ্কার খাবার (ডায়েটারি সার্ভিস)।', ['Dietitian-planned menu', 'Hygienic kitchen', 'Special diet for patients']],
      ['Housekeeping & Laundry', 'হাসপাতালের পরিবেশ পরিষ্কার ও সংক্রমণমুক্ত রাখার জন্য হাউসকিপিং সেবা।', ['Daily cleaning', 'Clinical laundry', 'Waste management']],
      ['Accommodation For Attendants', 'রোগীর অ্যাটেনডেন্টদের জন্য থাকার ব্যবস্থা।', ['Comfortable waiting area', 'Prayer room', 'Cafeteria access']],
      ['Birth Certificate', 'হাসপাতালে জন্ম নেওয়া শিশুদের জন্ম নিবন্ধন (Birth Certificate) সহায়তা।', ['প্রয়োজনীয় কাগজপত্রের তালিকা', 'অ্যাডমিশন ডেস্কে যোগাযোগ করুন', 'হটলাইন: 10622']],
      ['Death Certificate', 'হাসপাতালে মৃত্যুর ক্ষেত্রে মৃত্যু সনদ (Death Certificate) প্রদান প্রক্রিয়া।', ['প্রয়োজনীয় কাগজপত্রের তালিকা', 'অ্যাডমিশন ডেস্কে যোগাযোগ করুন', 'হটলাইন: 10622']]
    ])
  },
  admission: {
    label: 'Admission',
    pages: mk([
      ['Bed & Room Categories', 'বিভিন্ন বাজেট ও প্রয়োজন অনুযায়ী জেনারেল বেড, কেবিন ও ভিআইপি কেবিন।', ['General ward bed', 'Shared cabin', 'Single cabin', 'ICU / NICU / HDU']],
      ['Admission Desk', 'ভর্তির জন্য অ্যাডমিশন ডেস্কে যোগাযোগ করুন।', ['ডাক্তারের ভর্তির পরামর্শপত্র (Admission advice)', 'জাতীয় পরিচয়পত্র (NID) / পরিচয়পত্র', 'ভর্তি ফরম পূরণ']],
      ['Admission time', 'ভর্তি ও ছুটির (Discharge) সময় সম্পর্কে জানতে হটলাইনে কল করুন।', ['জরুরি ভর্তি: সব সময় (২৪ ঘণ্টা)', 'হটলাইন: 10622']],
      ['Privacy', 'রোগীর ব্যক্তিগত ও চিকিৎসা তথ্য সম্পূর্ণ গোপন রাখা হয়।', ['Confidential medical records', 'Patient consent', 'Visitor policy']],
      ['Accreditation', 'হাসপাতালের লাইসেন্স, অ্যাক্রেডিটেশন ও মান সনদ সম্পর্কিত তথ্য।', ['DGHS registration', 'Quality standards', 'Part of United Healthcare Services Ltd.']],
      ['Billing & Payment', 'স্বচ্ছ বিলিং ব্যবস্থা; ক্যাশ, কার্ড ও মোবাইল ব্যাংকিংয়ে পেমেন্ট সুবিধা।', ['Itemised bill', 'Cash / Card / MFS', 'Corporate & insurance support']]
    ])
  }
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/vision-and-values', children: INFO.about.pages.map((p) => ({ label: p.title, href: `/about/${p.slug}` })) },
  { label: 'Services', href: '/services/emergency', children: INFO.services.pages.map((p) => ({ label: p.title, href: `/services/${p.slug}` })) },
  { label: 'Doctors List', href: '/doctors', children: SPECIALTIES.map((s) => ({ label: s, href: `/doctors?department=${encodeURIComponent(s)}` })) },
  { label: 'Admission', href: '/admission/bed-and-room-categories', children: INFO.admission.pages.map((p) => ({ label: p.title, href: `/admission/${p.slug}` })) },
  { label: 'Media Center', href: '/news', children: [{ label: 'News & Updates', href: '/news' }, { label: 'Photo Gallery', href: '/gallery' }, { label: 'Videos', href: '/gallery?tab=videos' }] }
];

export const QUICK = [
  { label: 'Doctor Appointment', href: '/appointment', icon: 'calendar' },
  { label: 'Find Your Doctor', href: '/doctors', icon: 'steth' },
  { label: 'Checkup Packages', href: '/packages', icon: 'clipboard' },
  { label: 'Book An Ambulance', href: '/ambulance', icon: 'ambulance' }
];

export const HOME_DEPTS = [
  { name: 'Internal Medicine', icon: 'steth' }, { name: 'Oncology', icon: 'ribbon' }, { name: 'Neuro Medicine', icon: 'brain' },
  { name: 'Respiratory Medicine', icon: 'lungs' }, { name: 'Gynaecology', icon: 'baby', dept: 'Obstetrics & Gynaecology' }, { name: 'Orthopedic', icon: 'bone' }
];

export const SERVICE_GRID = [
  'Trauma & Emergency Service', 'Heart Centre', 'Mother & Child Care', 'ICU & NICU', 'CCU & HDU', 'Orthopedics & Rahabilitation Centre',
  'Dialysis Centre', 'OPD & IPD', 'Physiotherapy Centre', 'Corporate Checkup', 'Nephrology Centre', 'Chemotherapy Centre',
  'Ambulance Service', 'Pharmacy', 'Prayer Room', 'Central Sterile Supply Department', 'Dietary Service', 'Home Sample Collection Service'
];

export const WHY = [
  { icon: 'steth', title: 'Best Medical Practitioners', text: 'Our core strength is to appoint the best doctors in Bangladesh. You will find certified medical professionals and qualified personnel like medical consultants, nurses and medical technologists and technicians.' },
  { icon: 'ambulance', title: 'Ambulance Service', text: 'We are always ready to provide emergency support. We have an ambulance service to carry our patients in the fastest way from different places of the town during any emergency.' },
  { icon: 'thumb', title: 'Affordability', text: 'We are concerned to provide the best service at an affordable price. Our flexible, budget-friendly options will help you cover the comprehensive treatment plan including health checkup packages.' }
];

export const FACILITIES = [
  'One of the largest & best private hospitals of Bangladesh', 'Life Care Hospital (MARH) is a 250-bed tertiary care hospital', '1,34,000 square feet',
  'Large & spacious in-patient rooms', '20 OPD rooms with modern facilities', '5 state-of-the-art modular operation theatres', 'World-class Emergency, Accident & trauma and cardiac centre'
];
export const STATS = [['250', 'Beds'], ['20', 'OPD rooms'], ['5', 'Operation theatres'], ['134,000', 'Square feet']];

export const TECH = [
  { title: 'Digital X-Ray', text: 'Fast, low-dose digital radiography.' },
  { title: 'Ultrasonography & Echo', text: 'Colour Doppler, echocardiography and guided FNAC.' },
  { title: 'MRI', text: 'High-resolution MRI with a calming bay.' },
  { title: 'CT Scan', text: 'Quick multi-slice CT imaging.' },
  { title: 'ETT & Cardiac Data', text: 'Advanced ETT and real-time ECG monitoring.' },
  { title: 'Lab & Bronchoscopy', text: 'Pathology, biopsy, PAP smear and modern bronchoscopy.' }
];

// ---------- Fallbacks (ব্যাকএন্ড অফ থাকলেও সাইটে দেখাবে) ----------
export const FALLBACK_DOCTORS = [
  { _id: 'f1', name: 'Dr. Monoj Probhakar', department: 'Internal Medicine', designation: 'Consultant', degrees: 'MBBS (DMC), MRCP (UK)', days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'], startTime: '10:00', endTime: '18:00', fee: 800 },
  { _id: 'f2', name: 'Dr. Zubaidul Haque', department: 'ENT', designation: 'Assistant Professor & Senior Consultant', degrees: 'MBBS, BCS (Health), MS (ENT)', days: ['Thu', 'Sat'], startTime: '16:00', endTime: '20:00', fee: 1000 },
  { _id: 'f3', name: 'Prof. Dr. Mostafa Tarikuzzaman', department: 'Internal Medicine', designation: 'Senior Consultant', degrees: 'MBBS, MD (Medicine)', days: ['Mon', 'Tue', 'Wed', 'Thu'], startTime: '09:00', endTime: '20:00', fee: 1200 }
];
export const FALLBACK_NEWS = [
  { _id: 'n1', title: 'জামালপুরেই এখন ফুসফুসের বিশ্বমানের আধুনিক চিকিৎসা!', excerpt: 'ফুসফুস ও বক্ষব্যাধি চিকিৎসায় এক নতুন দিগন্ত উন্মোচিত হয়েছে লাইফ কেয়ার হসপিটালে।' },
  { _id: 'n2', title: '১ বছরের শিশুর জীবন বাঁচাতে সফল এন্ডোস্কপি', excerpt: 'মাত্র ১ বছরের শিশুর জীবন বাঁচাতে সফল এন্ডোস্কপি: লাইফ কেয়ার হসপিটালের এক অনন্য দৃষ্টান্ত।' },
  { _id: 'n3', title: 'লাইফ কেয়ার হসপিটালে চালু হচ্ছে আধুনিক ডেন্টাল ইউনিট', excerpt: 'দাঁতের যত্নে নতুন দিগন্তের সূচনা করতে যাচ্ছে লাইফ কেয়ার হসপিটাল।' }
];
export const FALLBACK_FEEDBACK = [
  { _id: 'q1', name: 'Mrs. Shuborna', message: 'আপনাদের সার্ভিসে আমরা খুব খুশি। হাসপাতাল সম্পর্কে মানুষের ধারণা এখনো পরিষ্কার নয়।', rating: 5 },
  { _id: 'q2', name: 'Samrin Khan', message: 'আপনাদের সকল সার্ভিস অনেক ভালো ছিলো। এটার ধারাবাহিকতা ধরে রাখতে পারলে এই হাসপাতাল আরো উন্নত হবে।', rating: 5 },
  { _id: 'q3', name: 'Ms. Shaila', message: 'আপনাদের নার্সদের ব্যবহারে আমরা মুগ্ধ। তাদের ব্যবহার ও কাজকর্ম অত্যন্ত ভালো।', rating: 5 }
];
export const FALLBACK_PACKAGES = [
  { _id: 'p1', name: 'Basic Health Checkup', price: 2500, tests: ['CBC', 'Blood Sugar (F)', 'Creatinine', 'Urine R/E', 'ECG', 'BP & BMI'] },
  { _id: 'p2', name: 'Executive Checkup', price: 6500, tests: ['CBC', 'Lipid Profile', 'HbA1c', 'LFT', 'RFT', 'ECG', 'Chest X-Ray', 'USG Whole Abdomen'] }
];