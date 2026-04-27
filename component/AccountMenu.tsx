import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import useCurrentUser from "@/hooks/useCurrentUser";
import useCurrentProfile from "@/hooks/useCurrentProfile";

interface AccountMenuProps {
  visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
  const { data: currentUser } = useCurrentUser();
  const { currentProfile } = useCurrentProfile();
  const router = useRouter();

  if (!visible) return null;

  return (
    <div className="bg-black w-56 absolute top-14 right-0 py-5 flex flex-col border-2 border-gray-800">
      {/* Current Profile */}
      <div className="px-3 group/item flex flex-row gap-3 items-center w-full mb-3">
        <img
          className="w-8 rounded-md"
          src={currentProfile?.image || "/images/default-blue.png"}
          alt="Profile"
        />
        <p className="text-white text-sm group-hover/item:underline">
          {currentProfile?.name || currentUser?.name}
        </p>
      </div>

      <hr className="bg-gray-600 border-0 h-px mb-3" />

      {/* Switch Profile */}
      <div
        onClick={() => router.push("/profile")}
        className="px-3 py-2 flex flex-row gap-3 items-center cursor-pointer hover:bg-zinc-800 transition"
      >
        <img
          className="w-8 rounded-md"
          src="/images/default-blue.png"
          alt="Switch"
        />
        <p className="text-white text-sm hover:underline">Switch Profile</p>
      </div>

      {/* Add Profile */}
      <div
        onClick={() => router.push("/profile")}
        className="px-3 py-2 flex flex-row gap-3 items-center cursor-pointer hover:bg-zinc-800 transition"
      >
        <div className="w-8 h-8 rounded-md bg-zinc-700 flex items-center justify-center">
          <span className="text-white text-lg">+</span>
        </div>
        <p className="text-white text-sm hover:underline">Add Profile</p>
      </div>

      <hr className="bg-gray-600 border-0 h-px my-3" />

      {/* Account */}
      <div
        onClick={() => router.push("/account")}
        className="px-3 py-2 text-white text-sm hover:underline cursor-pointer"
      >
        Account
      </div>

      {/* Sign Out */}
      <div
        onClick={() => signOut()}
        className="px-3 py-2 text-white text-sm hover:underline cursor-pointer"
      >
        Sign out of Netflix
      </div>
    </div>
  );
};

export default AccountMenu;
