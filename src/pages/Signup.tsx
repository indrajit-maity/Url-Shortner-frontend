import { Link,useNavigate } from "react-router-dom";
import z, { email } from "zod";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast"
import { getErrorMessage } from "../api/axios";
import AuthShell from "../components/AuthShell";
import { Loader2 } from "lucide-react";
import FormField from "../components/FormField";
import { signup } from "../api/auth.api";


const schema=z.object({
  username:z.string().min(2,"Enter your name"),
  email:z.string().min(1,"Enter your mail").email("Enter your a valid email"),
  password:z.string().min(6,"use atleast 6 characters"),
  confirmPassword:z.string().min(1,"Confirm your password"),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
})
.refine((v)=>v.password===v.confirmPassword,{
  path:["confirmPassword"],
  message:"Passwords do not match",
});
type FormValues=z.infer<typeof schema>;

export default function Signup(){
  const navigate =useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit=async ({username,email,password,phoneNumber}:FormValues)=>{
    try{
      await signup({username,email,password,phoneNumber});
      toast.success("Account created.Log in to continue.");
      navigate("/login",{replace:true});
    }
    catch(err){
      toast.error(getErrorMessage(err,"Could not create your account"));
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start shortening links in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Name" autoComplete="username" error={errors.username?.message} {...register("username")} />
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <FormField
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-medium text-white transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          Create account
        </button>
      </form>
    </AuthShell>
  );

}