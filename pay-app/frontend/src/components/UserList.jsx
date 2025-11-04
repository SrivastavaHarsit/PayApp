import Avatar from "./Avatar";
import Button from "./Button";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";


export default function UserList({ users }) {
    const [searchTerm, setSerachTerm] = useState("");
    const navigate = useNavigate();

    const filtered = useMemo(() => {
        if(!searchTerm) return users;
        const lower = searchTerm.toLowerCase();
        return users.filter(user => user.firstName.toLowerCase().includes(lower) || user.lastName.toLowerCase().includes(lower));
    }, [searchTerm, users]);

    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="mb-3 text-sm font-semibold">Users</div>
            <input 
                placeholder="Search users..." 
                className="w-full mb-4 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSerachTerm(e.target.value)}
            />

             <ul className="space-y-3">
        {filtered.map((user) => {
          const initials = `${user.firstName?.[0] ?? "U"}${user.lastName?.[0] ?? ""}`;
          const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

          return (
            <li key={user._id} className="flex items-center justify-between">
              {/* Left: avatar + name — allow truncation */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar initials={initials.toUpperCase()} />
                <div className="min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate max-w-[220px]">
                    {fullName || user.username || "Unknown"}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[220px]">
                    @{user.username}
                  </div>
                </div>
              </div>

              {/* Right: button — fixed width, won't stretch */}
              <div className="ml-4 flex-shrink-0">
                {/* !w-40 overrides the button's w-full using Tailwind's important variant */}
                <Button
                  className="!w-40 px-3 py-2 text-sm"
                  onClick={() =>
                    navigate(
                      `/send?to=${encodeURIComponent(user.username)}&name=${encodeURIComponent(fullName)}`
                    )
                  }
                >
                  Send Money
                </Button>
              </div>
            </li>
          );
        })}
                {!filtered.length && <div className="text-sm text-gray-500">No Users </div>}

            </ul>
        </div>
    )
}