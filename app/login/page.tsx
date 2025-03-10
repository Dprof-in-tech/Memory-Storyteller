// /app/login/page.js
import LoginForm from "../components/loginForm";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}