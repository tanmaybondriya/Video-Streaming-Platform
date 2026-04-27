import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BsBell, BsChevronDown, BsSearch } from "react-icons/bs";
import NavbarItem from "./NavbarItem";
import MobileMenu from "./MobileMenu";
import AccountMenu from "./AccountMenu";
import useCurrentUser from "@/hooks/useCurrentUser";
import useCurrentProfile from "@/hooks/useCurrentProfile";

const TOP_OFFSET = 66;

const Navbar = () => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { currentProfile } = useCurrentProfile();

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  return (
    <nav className="w-full fixed z-40">
      <div
        className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${
          showBackground ? "bg-zinc-900 bg-opacity-90" : ""
        }`}
      >
        {/* Logo */}
        <img
          src="/images/Logo.png"
          alt="Logo"
          className="h-4 lg:h-15 cursor-pointer"
          onClick={() => router.push("/")}
        />

        {/* Desktop Menu */}
        <div className="flex-row ml-8 gap-7 hidden lg:flex">
          <NavbarItem label="Home" onClick={() => router.push("/")} />
          <NavbarItem label="Series" onClick={() => router.push("/series")} />
          <NavbarItem label="Films" onClick={() => router.push("/films")} />
          <NavbarItem
            label="New & Popular"
            onClick={() => router.push("/new")}
          />
          <NavbarItem label="My List" onClick={() => router.push("/mylist")} />
          <NavbarItem
            label="Browse by Languages"
            onClick={() => router.push("/browse")}
          />
          {currentUser?.role === "super_admin" && (
            <NavbarItem label="Admin" onClick={() => router.push("/admin")} />
          )}
          {(currentUser?.role === "video_provider" ||
            currentUser?.role === "super_admin") && (
            <NavbarItem
              label="Provider"
              onClick={() => {
                console.log("clicked!");
                router.push("/provider");
              }}
            />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative"
        >
          <p className="text-white text-sm">Browse</p>
          <BsChevronDown
            className={`text-white transition ${showMobileMenu ? "rotate-180" : "rotate-0"}`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>

        {/* Right Side Icons */}
        <div className="flex flex-row ml-auto gap-7 items-center">
          <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
            <BsSearch />
          </div>
          <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
            <BsBell />
          </div>
          <div
            onClick={toggleAccountMenu}
            className="flex flex-row items-center gap-2 cursor-pointer relative"
          >
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
              <img
                src={currentProfile?.image || "/images/default-blue.png"}
                alt="Profile"
              />
            </div>
            <BsChevronDown
              className={`text-white transition ${showAccountMenu ? "rotate-180" : "rotate-0"}`}
            />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
