import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '../components/AppBar';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import Heading from '../components/Heading';
import api from '../lib/api';

function useQuery() {
    const { search} = useLocation();
    return new URLSearchParams(search);
}


export default function SendMoney() {
    const q = useQuery();
    const to = q.get('to') || '';
    const name = q.get('name') || 'Friend';
    const initials = (name?.[0] ?? 'U').toUpperCase();

    const[amount, setAmount] = useState('');
    const[status, setStatus] = useState({ type: '', msg: ''});
    const navigate = useNavigate();

    useEffect(() => {
        setStatus({ type: '', msg: ''});
    }, [amount])


    const submit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: ''});
        const n = Number(amount);
        if(!to || !n || n <= 0) {
            setStatus({ type: 'error', msg: 'Please enter a valid amount'});
            return;
        }
        try {
            await api.post('/account/transfer', {toUsername: to, amount: n}); // Send request to backend
            setStatus({ type: 'success', msg: 'Transfer successful!'});
            setTimeout(() => navigate('/dashboard', { replace: true}), 1500);
        } catch(err) {
            setStatus({ type: 'error', msg: err ? err.message : 'Transfer failed'});
        }
    }

    return (
       <div className="min-h-full bg-gray-50">
      <AppBar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-8 shadow-md">
          <Heading className="mb-6">Send Money</Heading>
          <div className="mb-6 flex items-center gap-3">
            <Avatar initials={initials} />
            <div className="text-xl font-semibold">{name}</div>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <Input
              label="Amount (₹)"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {status.msg && (
              <div className={status.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-600'}>
                {status.msg}
              </div>
            )}
            <Button>Initiate Transfer</Button>
          </form>
        </div>
      </main>
    </div>
  );
}