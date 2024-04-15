export default function ClubPage({ params }: { params: { slug: string } }) {
  return <div>Club ID: {params.slug}</div>;
}
