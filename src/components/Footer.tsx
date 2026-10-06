import { person } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {person.name}. Built with Next.js, TypeScript and Tailwind CSS.
        </p>
        <p className="font-mono">
          Press <kbd className="rounded border border-border px-1">Ctrl</kbd>/<kbd className="rounded border border-border px-1">⌘</kbd>{" "}
          <kbd className="rounded border border-border px-1">K</kbd> to navigate
        </p>
      </div>
    </footer>
  );
}
