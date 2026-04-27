import { useRouter } from "next/router";

interface MobileMenuProps {
  visible?: boolean;
}

const MENU_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Series", path: "/series" },
  { label: "Films", path: "/films" },
  { label: "New & Popular", path: "/new" },
  { label: "My List", path: "/mylist" },
  { label: "Browse by Languages", path: "/browse" },
];

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
  const router = useRouter();

  if (!visible) return null;

  return (
    <div className="bg-black w-56 absolute top-8 left-0 py-5 flex flex-col border-2 border-gray-800 z-50">
      <div className="flex flex-col gap-4">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => router.push(item.path)}
            className={`px-3 text-center cursor-pointer hover:underline transition ${
              router.pathname === item.path
                ? "text-white font-semibold"
                : "text-gray-300"
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
