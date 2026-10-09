/** The sign-in card's outline, centred where the real one will land. */
export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center px-lg py-xxl">
      <div
        aria-busy="true"
        aria-label="Loading"
        className="bg-ops-surface h-[360px] w-full max-w-[400px] animate-pulse rounded-[20px]"
      />
    </div>
  );
}
