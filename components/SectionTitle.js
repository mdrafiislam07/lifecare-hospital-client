import Icon from './Icons';
export default function SectionTitle({ title, sub, icon = 'steth', as: Tag = 'h2' }) {
  return (
    <div className="section-title">
      <Tag>{title}</Tag>
      {sub && <p>{sub}</p>}
      <div className="divider"><span /><Icon name={icon} size={22} /><span /></div>
    </div>
  );
}
