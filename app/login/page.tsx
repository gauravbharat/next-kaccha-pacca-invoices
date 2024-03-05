import LoginForm from '@/app/ui/login-form';
import KacchaPaccaLogo from '../ui/kp-logo';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="h-26 flex w-full items-end rounded-lg bg-blue-500 p-3">
          <div className=" text-white">
            <KacchaPaccaLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
