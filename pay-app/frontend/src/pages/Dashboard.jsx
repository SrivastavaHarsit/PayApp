import { useEffect, useState } from 'react';
import api from '../lib/api';
import AppBar from '../components/AppBar';
import BalanceCard from '../components/BalanceCard';
import UsersList from '../components/UserList';


export default function Dashboard() {
    const[balance, setBalance] = useState(0);
    const[users, setUsers] = useState([]);
    const[error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const[{ data: balData }, { data: usersData }] = await Promise.all([
                    api.get('/account/balance'),
                    api.get('/user/bulk?filter=')
                ]);
                setBalance(balData.balance);
                setUsers(usersData.users || []);
            } catch(err) {
                setError(err ? err.message : 'Failed to load data');
            } 
        };
        loadData();
    }, []);


    return (
    <div className="min-h-full bg-gray-50">
      <AppBar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="grid gap-6">
          <BalanceCard amount={balance ?? '—'} />
          <UsersList users={users} />
        </div>
      </main>
    </div>
  );
}