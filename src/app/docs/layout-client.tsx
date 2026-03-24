import { useOnThisPage } from "@/context/OnThisPage";
export const DocscLayoutClient = () => {
  const { items } = useOnThisPage()

  return (
    <div className="sticky top-16 right-0 z-10 space-y-1.5 px-6 py-3 text-sm ">
      <h3 className="font-semibold text-xs">On This Page</h3>
      <ul className="space-y-1 mt-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="hover:underline">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
};
