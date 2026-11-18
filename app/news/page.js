import { serverGet } from '@/lib/api';
import { FALLBACK_NEWS } from '@/lib/data';
import { PageHero } from '@/components/Ui';
import NewsCard from '@/components/NewsCard';

export const metadata = { title: 'Media Center' };
export const revalidate = 60;

export default async function Page() {
  const { items } = await serverGet('/news?limit=30', { items: FALLBACK_NEWS });
  return (
    <>
      <PageHero title="Media Center" text="News & Updates" />
      <section className="container section">
        <div className="news-grid">
          {items.map((n) => <NewsCard key={n._id} n={n} />)}
        </div>
      </section>
    </>
  );
}
