interface MobileMenuProps {
  visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="bg-black w-56 absolute top-8 left-0 py-5 flex flex-col border-2 border-gray-800">
      <div className="flex flex-col gap-4">
        {[
          "Home",
          "Series",
          "Films",
          "New & Popular",
          "My List",
          "Browse by Languages",
        ].map((label) => (
          <div
            key={label}
            className="px-3 text-center text-white hover:underline"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
