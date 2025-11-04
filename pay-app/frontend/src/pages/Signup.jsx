import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Heading from '../components/Heading';
import SubHeading from '../components/SubHeading';
import BottomWarning from '../components/BottomWarning';

export default function Signup() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/user/signup', form);
            localStorage.setItem('payapp_token', data.token);
            navigate('/dashboard', {replace:true});
            // alert('Signup API is not connected yet');
        } catch (err) {
            setError(err ? err.message: 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }



    return (
        <>
            <div className='flex min-h-full items-center justify-center bg-gray-50 px-4 py-10'>
                <form onSubmit={handleSubmit} className='w-full max-w-md rounded-2xl border bg-white p-6 shadow-md'>
                    <Heading>Sign Up</Heading>
                    <SubHeading>Create your account</SubHeading>

                    <div className='mt-6 space-y-4'>
                        <Input label="First Name" value={form.firstName} onChange={(e) =>setForm({...form, firstName: e.target.value})}/>
                        <Input label="Last Name" value={form.lastName} onChange={(e) =>setForm({...form, lastName: e.target.value})}/>
                        <Input label="Email" value={form.username} onChange={(e) =>setForm({...form, username: e.target.value})}/>
                        <Input label="Password" value={form.password} onChange={(e) =>setForm({...form, password: e.target.value})}/>
                        {error && <div className=''>{error}</div>}
                        <Button disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</Button>
                    </div>
                    <BottomWarning text="Already have an account?" linkText="Login" to="/signin" />
                </form>
            </div>
        </>
    )
}