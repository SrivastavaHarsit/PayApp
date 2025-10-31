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
        <div className="">
            <div className="">Users</div>
            <input 
                placeholder="Search users..." 
                className=""
                value={searchTerm}
                onChange={(e) => setSerachTerm(e.target.value)}
            />

            <ul className="">
                {filtered.map(user => {
                    const initials = `${user.firstName[0] ?? 'U'}${user.lastName[0] ?? ''}`;
                    const fullName = `${user.firstName} ${user.lastName}`;
                    return (
                        <li key={user._id} className="">
                            <div className="">
                                <Avatar initials={initials.toUpperCase()} />
                                <div className="">{fullName}</div>
                            </div>
                            <Button 
                                className=""
                                onClick={() => navigate(`/send?to=${encodeURIComponent(u.username)}&name=${encodeURIComponent(fullName)}`)}
                            >
                                Send Money
                            </Button>

                        </li>
                    );
                })}
                {!filtered.length && <div className="">No Users </div>}

            </ul>
        </div>
    )
}