import Button from "../../Components/ButtonComponent";
import InputForm from "../../Components/InputForm";
import { useForm } from 'react-hook-form';
import styles from './styles/Signup.module.css'
import { useEffect, useState, useCallback, memo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_BACKEND_URL;

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const userSchema = z.object({
    name: z.string().min(1, 'Please enter a name'),
    email: z
      .string()
      .regex(emailRegex, 'Email is not valid')
      .nonempty('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });
export default function Signup() {

  const navigate = useNavigate();
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (isSafeToReset) {
      reset(defaultValues);
    }
  }, [isSafeToReset, reset]);

  const onSubmit = useCallback(async (data) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}auth/register`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("Response Status:", res.status);
      if (!res.ok) {
        const errJson = await res.json();
        console.log("Error Response:", errJson);
        const { errors } = errJson;

        for (const property in errors) {
          setError(property, { type: 'custom', message: errors[property] });
        }

        throw new Error(errJson.message);
      }

      toast.success('Successfully registered!');
      setIsSafeToReset(true);
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  }, [setError]);

  return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles['form-group']}>
        <MemoizedFormInput
        error={errors.name}
        field="name"
        label="Name"
        register={register}
      />
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
      <MemoizedFormInput
        error={errors.confirmPassword}
        field="confirmPassword"
        label="Confirm Password"
        register={register}
        type="password"
      />
      </div>
          <Button variant="secondary">
            {isSubmitting ? 'Signing up..' : 'Sign up'}
          </Button>
      </form>
  );
}

const MemoizedFormInput = memo(InputForm);
