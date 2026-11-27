import TeamGrid from './TeamGrid';
import StaffDirectory from './StaffDirectory';
import FaqAccordion from './FaqAccordion';
import CareerList from './CareerList';
import BlogGrid from './BlogGrid';
import '@/styles/about.css';

// page.type onujayi sothik section dekhay
export default function AboutSection({ type, items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div className="ab">
      {type === 'team' && <TeamGrid items={list} />}
      {type === 'staff' && <StaffDirectory items={list} />}
      {type === 'faq' && <FaqAccordion items={list} />}
      {type === 'career' && <CareerList items={list} />}
      {type === 'blogs' && <BlogGrid items={list} />}
    </div>
  );
}