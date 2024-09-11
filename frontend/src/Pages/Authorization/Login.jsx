import {  useCallback, memo, useContext } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from "../../Components/ButtonComponent";
import InputForm from "../../Components/InputForm";
import styles from './styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/AuthProvider';



// Zod Schema
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const userSchema = z.object({
  email: z
    .string()
    .regex(emailRegex, 'Email is not valid')
    .min(1, 'Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});


export default function Login() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(userSchema),
  });

  // Optimized submit handler with useCallback
  const onSubmit = useCallback(async (data) => {
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + 'auth/login/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message);
      }

      const resJson = await res.json();
      authCtx.saveUser(resJson.data.token);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  }, [authCtx,navigate ]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles['form-group']}>
      <MemoizedFormInput
        error={errors.email}
        field="email"
        label="Email"
        register={register}
      />
      <MemoizedFormInput
        error={errors.password}
        field="password"
        label="Password"
        register={register}
        type="password"
      />
      </div>
      <Button variant="secondary" type="submit">
  {isSubmitting ? 'Logging in...' : 'Log in'}
</Button>
    </form>
  );
}


const MemoizedFormInput = memo(InputForm);
