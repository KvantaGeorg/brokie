import { Link } from "react-router-dom";
import BrokieMascot from "@/components/brand/BrokieMascot";

const NotFound = () => (
  <main className="flex min-h-screen items-center justify-center px-4">
    <div className="glass rounded-3xl p-10 text-center max-w-md">
      <BrokieMascot mood="shocked" size={100} className="mx-auto mb-4" title="" />
      <h1 className="mb-2 text-4xl">404</h1>
      <p className="mb-6 text-lg font-semibold text-muted-foreground">This page went broke. It doesn't exist.</p>
      <Link to="/" className="btn-chunky btn-accent">
        Back to home
      </Link>
    </div>
  </main>
);

export default NotFound;
