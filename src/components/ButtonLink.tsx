import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  external?: boolean;
  download?: boolean;
  className?: string;
  ariaLabel?: string;
};

const styles = {
  solid: "bg-accent-solid text-accent-solid-fg hover:brightness-110 border border-transparent",
  outline: "border border-border-strong text-fg hover:border-accent hover:text-accent bg-bg-elev",
  ghost: "text-fg-muted hover:text-accent border border-transparent",
};

export function ButtonLink({ href, children, variant = "outline", external, download, className = "", ariaLabel }: Props) {
  const cls = `inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors ${styles[variant]} ${className}`;
  if (external || download || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
