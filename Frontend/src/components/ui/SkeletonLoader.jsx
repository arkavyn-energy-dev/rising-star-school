// Skeleton loaders for better loading UX
export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6 animate-pulse">
          <div className="h-48 bg-white/10 rounded-xl mb-4" />
          <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
          <div className="h-4 bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass rounded-xl p-4 animate-pulse flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="h-5 bg-white/10 rounded w-1/2 mb-2" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-white/10 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 animate-pulse">
            <div className="h-12 bg-white/10 rounded w-3/4 mb-4" />
            <div className="h-8 bg-white/10 rounded w-full" />
            <div className="h-6 bg-white/10 rounded w-5/6" />
            <div className="flex gap-4 mt-8">
              <div className="h-12 w-32 bg-white/10 rounded-lg" />
              <div className="h-12 w-32 bg-white/10 rounded-lg" />
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="h-80 bg-white/10 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass rounded-xl p-6 text-center animate-pulse">
          <div className="h-10 bg-white/10 rounded w-20 mx-auto mb-2" />
          <div className="h-4 bg-white/10 rounded w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}
