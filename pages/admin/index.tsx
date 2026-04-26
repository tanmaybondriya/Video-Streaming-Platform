import axios from "axios";
import useUsers from "@/hooks/useUsers";

export default function AdminDashboard() {
  const { data: users = [], mutate } = useUsers();

  const changeRole = async (userId: string, role: string) => {
    await axios.patch("/api/admin/users", { userId, role });
    mutate();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="pb-4">Name</th>
            <th className="pb-4">Email</th>
            <th className="pb-4">Role</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border-b border-gray-800">
              <td className="py-4">{user.name}</td>
              <td className="py-4">{user.email}</td>
              <td className="py-4">{user.role}</td>
              <td className="py-4 flex gap-2">
                <button
                  onClick={() => changeRole(user.id, "user")}
                  className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  User
                </button>
                <button
                  onClick={() => changeRole(user.id, "video_provider")}
                  className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Provider
                </button>
                <button
                  onClick={() => changeRole(user.id, "super_admin")}
                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
