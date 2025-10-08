async function getPropertyData(slug: string) {
  const res = await fetch(`http://localhost:3000/api/properties/${slug}`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getPropertyData(params.slug);

  if (!property) {
    return <div>Property not found.</div>;
  }

  return (
    <div>
      <h1>{property.name}</h1>
      <p>{property.description}</p>
      <p>Price: ${property.price_per_night}/night</p>
      <img src={property.image_url} alt="" />
    </div>
  );
}
