import Link from 'next/link';

export default function CareerList({ items }) {
  if (!items.length) return <p className="ab-empty">Ekhon kono job opening nei. Pore abar dekhun.</p>;
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <h2 className="ab-h2" style={{ textAlign: 'center' }}>Current Job Openings</h2>
      <div className="ab-jobs">
        {items.map((j) => {
          const closed = Boolean(j.deadline) && j.deadline < today;
          const left = j.deadline && !closed ? Math.ceil((new Date(j.deadline) - new Date(today)) / 864e5) : null;
          const subject = encodeURIComponent(`Application: ${j.title}`);
          return (
            <article className={`ab-job ${closed ? 'is-closed' : ''}`} key={j._id}>
              <div className="ab-jtop">
                <div>
                  <h3>{j.title}</h3>
                  <div className="ab-tags">
                    {j.department && <span className="ab-tag">{j.department}</span>}
                    <span className="ab-tag">{j.type}</span>
                    {j.location && <span className="ab-tag">{j.location}</span>}
                    {j.vacancies > 0 && <span className="ab-tag">{j.vacancies} post</span>}
                  </div>
                </div>
                {closed
                  ? <span className="ab-tag off">Closed</span>
                  : <span className={`ab-tag ${left !== null && left <= 5 ? 'warn' : 'ok'}`}>{left === null ? 'Open' : left === 0 ? 'Ajkei last date' : `${left} din baki`}</span>}
              </div>
              {j.deadline && <p className="ab-dl">Last date: {j.deadline}</p>}
              {(j.description || j.requirements) && (
                <details>
                  <summary>Details dekhun</summary>
                  {j.description && <><h4>Job description</h4><p className="ab-txt">{j.description}</p></>}
                  {j.requirements && <><h4>Requirements</h4><p className="ab-txt">{j.requirements}</p></>}
                </details>
              )}
              {!closed && (
                <div className="ab-apply">
                  {j.applyEmail && <a className="btn btn-primary" href={`mailto:${j.applyEmail}?subject=${subject}`}>Apply by Email</a>}
                  {j.applyPhone && <a className="btn btn-outline" href={`tel:${j.applyPhone}`}>Call {j.applyPhone}</a>}
                  {!j.applyEmail && !j.applyPhone && <Link className="btn btn-primary" href="/contact">Contact to apply</Link>}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}