export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Nova TravelVerse — travel communities for everyone.</p>
        <p>Discord-inspired · Built for travelers</p>
      </div>
    </footer>
  );
}
