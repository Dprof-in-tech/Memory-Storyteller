// /app/register/page.js
import RegisterForm from "../components/registerForm";

export default function RegisterPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4">
      <RegisterForm />
    </div>
  );
}