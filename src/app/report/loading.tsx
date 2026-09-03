import { LoadingState } from '@/components/ui/LoadingState';

export default function ReportLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <aside className="w-64 hidden md:flex shrink-0 border-r border-rose-100" />
        <main className="flex-1 min-w-0">
          <LoadingState label="Generating your visibility report…" />
        </main>
      </div>
    </div>
  );
}
