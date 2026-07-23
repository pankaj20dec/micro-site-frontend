import Link from "next/link";

export default function DocusignCallbackPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold text-[#223645]">DocuSign connected</h1>
      <p className="mt-4 text-[#223645]/80">
        Admin consent was granted. You can close this tab and return to your application to
        continue signing.
      </p>
      <Link
        href="/register"
        className="mt-8 inline-block rounded-md bg-[#6B4E9B] px-6 py-3 text-sm font-semibold text-white"
      >
        Back to registration
      </Link>
    </main>
  );
}
