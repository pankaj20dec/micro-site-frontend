"use client";

import { useEffect, useState } from "react";
import { getUserToken } from "@/lib/user-auth";
import { fetchApplication } from "@/lib/application-api";
import {
  RegisterDisclaimerModal,
  getRegisterDisclaimerAccepted,
} from "@/components/common/RegisterDisclaimerModal";
import { useMounted } from "@/hooks/use-mounted";

import AccordionRegistration from "./AccordionRegistration";

export type Application = Record<string, unknown>;

export default function RegisterPage() {
  const mounted = useMounted();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    const token = getUserToken();
    if (token) {
      fetchApplication()
        .then((app) => setApplication(app))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    if (!getRegisterDisclaimerAccepted()) {
      setDisclaimerOpen(true);
    }
  }, []);

  if (!mounted || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3eef6]">
        <p className="text-sm text-zinc-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-4 pt-10 pb-35">
      <AccordionRegistration application={application} />
      <RegisterDisclaimerModal
        open={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
      />
    </main>
  );
}
