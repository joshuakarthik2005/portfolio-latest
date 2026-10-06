import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center font-mono">
      <p className="text-sm text-fg-subtle">exit code 404</p>
      <h1 className="mt-2 text-2xl font-semibold text-fg">No such file or directory</h1>
      <Link href="/" className="mt-6 inline-block text-accent underline">
        cd ~
      </Link>
    </div>
  );
}
