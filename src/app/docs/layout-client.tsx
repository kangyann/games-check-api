"use client";
import { useOnThisPage } from "@/context/OnThisPage";

export const DocscLayoutClient = () => {
  const { items } = useOnThisPage();

  return (
    <div className="sticky top-14 right-0 z-10 px-4 py-4 text-sm">
      <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
        On This Page
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-xs text-muted hover:text-primary transition block py-0.5 border-l-2 border-transparent hover:border-primary pl-3"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
