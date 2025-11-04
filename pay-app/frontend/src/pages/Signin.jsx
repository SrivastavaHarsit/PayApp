
import Button from '../components/Button';
import Input from '../components/Input';
import Heading from '../components/Heading';
import SubHeading from '../components/SubHeading';
import BottomWarning from '../components/BottomWarning';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';


export default function Sigin() {

    const[form, setForm] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    // const from = new URLSearchParams(location.search).get('from') || '/dashboard';
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        console.log("Submitting form", form);
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/user/signin', form);
            console.log("Token received: " + data.token);
            localStorage.setItem('payapp_token', data.token);
            navigate(from, { replace: true });
        } catch(err) {
            setError(err ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className=''>
                    <form onSubmit={handleSubmit} className=''>
                        <Heading>Sign In</Heading>
                        <SubHeading>Enter Your Credentials to access your account</SubHeading>
    
                        <div className=''>
                            <Input label="Email" value={form.username} onChange={(e) =>setForm({...form, username: e.target.value})}/>
                            <Input label="Password" value={form.password} onChange={(e) =>setForm({...form, password: e.target.value})}/>
                            {error && <div className=''>{error}</div>}
                            <Button disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
                        </div>
                        <BottomWarning text="Don’t have an account?" linkText="Sign Up" to="/signup" />
                    </form>
                </div>
        </>
    )
}