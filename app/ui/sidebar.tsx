export default function SideBar() {
    return (
    <aside className="w-64 bg-(--pissa-blue) text-white p-4">
    <h2 className="text-xl font-semibold">Sidebar</h2>
    <ul className="mt-4 space-y-2">
      <li className="hover:bg-gray-700 p-2 rounded">Dashboard</li>
      <li className="hover:bg-gray-700 p-2 rounded">Settings</li>
      <li className="hover:bg-gray-700 p-2 rounded">Profile</li>
    </ul>
  </aside>
  )
}