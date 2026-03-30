// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Auth System</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Securely manage your account and access your dashboard. 
          Please log in or create a new account to get started.
        </p>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Login Now
          </Link>
          
          <Link 
            href="/register" 
            className="px-6 py-3 bg-white text-blue-600 font-semibold border border-blue-600 rounded-lg shadow-sm hover:bg-blue-50 transition duration-200"
          >
            Register Account
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <FeatureCard title="Secure" desc="Industry standard encryption for your data." />
        <FeatureCard title="Fast" desc="Optimized with Next.js 14/15 performance." />
        <FeatureCard title="Role Based" desc="Admin and User access control included." />
      </div>
    </main>
  );
}

// একটি ছোট কম্পোনেন্ট একই ফাইলে রাখা যায় নিচের ফিচারের জন্য
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}