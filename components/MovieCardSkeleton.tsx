export default function MovieCardSkeleton() {
  return (
    <div
      className="flex-shrink-0"
      style={{ width: 'clamp(120px, 15vw, 200px)' }}
    >
      <div className="aspect-[2/3] rounded skeleton" />
    </div>
  );
}
