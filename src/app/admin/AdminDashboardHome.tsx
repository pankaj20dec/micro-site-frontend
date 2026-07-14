"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getApiBase } from "@/lib/api";
import { clearAdminToken, getAdmin, getAdminToken, type AdminPayload } from "@/lib/admin-auth";
import { useMounted } from "@/hooks/use-mounted";
import { fetchAdminApplications } from "@/lib/admin-applications-api";
import { fetchContactLeads } from "@/lib/admin-contact-api";
import { fetchAdminUsers } from "@/lib/admin-users-api";

interface DashboardStats {
  pages: number;
  publishedPages: number;
  users: number;
  applications: number;
  contactLeads: number;
  newContactLeads: number;
}

type StatTone = "purple" | "blue" | "amber" | "emerald";

const STAT_ACCENTS: Record<StatTone, string> = {
  purple: "border-l-[#660066]",
  blue: "border-l-blue-500",
  amber: "border-l-amber-500",
  emerald: "border-l-emerald-500",
};

const STAT_ICON_BG: Record<StatTone, string> = {
  purple: "bg-[#660066]/10 text-[#660066]",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

function StatCard({
  label,
  value,
  sub,
  href,
  icon,
  tone = "purple",
  highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  href?: string;
  icon: ReactNode;
  tone?: StatTone;
  highlight?: string;
}) {
  const content = (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200/80 border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md ${STAT_ACCENTS[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            {highlight && (
              <span className="mb-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                {highlight}
              </span>
            )}
          </div>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${STAT_ICON_BG[tone]}`}
        >
          {icon}
        </div>
      </div>
      {href && (
        <p className="mt-4 text-xs font-medium text-slate-400 transition group-hover:text-[#660066]">
          View details →
        </p>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function ActionRow({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-b border-slate-100 px-5 py-4 transition last:border-b-0 hover:bg-slate-50/80"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-[#660066]/10 group-hover:text-[#660066]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
      <span className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#660066]">
        <ArrowIcon />
      </span>
    </Link>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-xl bg-slate-200/70" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-200/70" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-xl bg-slate-200/70" />
        <div className="h-80 rounded-xl bg-slate-200/70" />
      </div>
    </div>
  );
}

function roleLabel(role: string) {
  return role.replace("_", " ");
}

function formatGreetingDate() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function AdminDashboardHome() {
  const router = useRouter();
  const mounted = useMounted();
  const [admin, setAdmin] = useState<AdminPayload | null>(null);
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;

    const token = getAdminToken();
    const currentAdmin = getAdmin();
    setAdmin(currentAdmin);

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const pagesRes = await fetch(`${getApiBase()}/api/admin/pages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pagesData = await pagesRes.json().catch(() => ({}));

        if (pagesRes.status === 401 || pagesRes.status === 403) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }

        if (!pagesRes.ok) {
          throw new Error(
            typeof pagesData.error === "string" ? pagesData.error : "Failed to load"
          );
        }

        const pages = (pagesData.pages ?? []) as { published?: boolean }[];
        const usersData = await fetchAdminUsers();
        const leadsData = await fetchContactLeads({ limit: 200 });
        let applicationsTotal = 0;

        if (currentAdmin?.role === "SUPER_ADMIN") {
          const appsData = await fetchAdminApplications();
          applicationsTotal = appsData.total;
        }

        if (!cancelled) {
          setStats({
            pages: pages.length,
            publishedPages: pages.filter((p) => p.published).length,
            users: usersData.total,
            applications: applicationsTotal,
            contactLeads: leadsData.total,
            newContactLeads: leadsData.submissions.filter((lead) => lead.status === "NEW")
              .length,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted, router]);

  if (loading) return <DashboardSkeleton />;

  const contentActions = [
    {
      title: "Site settings",
      description: "Header, login/register header, and footer",
      href: "/admin/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "SEO",
      description: "Page titles, descriptions, and indexing",
      href: "/admin/seo",
      icon: <SeoIcon />,
    },
    {
      title: "Modal popups",
      description: "Site disclaimer and register popup",
      href: "/admin/modals",
      icon: <ModalIcon />,
    },
    {
      title: "FAQ page",
      description: "Questions, answers, and contact section",
      href: "/admin/faq",
      icon: <FaqIcon />,
    },
    {
      title: "CMS pages",
      description: "Create, edit, and publish content",
      href: "/admin/pages",
      icon: <PagesIcon />,
    },
  ];

  const userActions = [
    {
      title: "Contact leads",
      description: "Form submissions and message details",
      href: "/admin/leads",
      icon: <LeadsIcon />,
    },
    {
      title: "Users",
      description: "Registered accounts and applications",
      href: "/admin/users",
      icon: <UsersIcon />,
    },
    ...(isSuperAdmin
      ? [
          {
            title: "Register admin",
            description: "Create admin or super admin accounts",
            href: "/admin/register",
            icon: <AdminIcon />,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-[#660066] to-[#4a004a] px-6 py-8 text-white sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">{formatGreetingDate()}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Good to see you{admin?.email ? `, ${admin.email.split("@")[0]}` : ""}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">
                Your control centre for the FIPO public site — content, settings, users, and
                inbound leads.
              </p>
            </div>
            {admin && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  {roleLabel(admin.role)}
                </span>
                <Link
                  href="/"
                  target="_blank"
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium transition hover:bg-white/20"
                >
                  View public site ↗
                </Link>
              </div>
            )}
          </div>
        </div>

        {stats && stats.newContactLeads > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 bg-amber-50 px-6 py-3 sm:px-8">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">{stats.newContactLeads} new contact lead</span>
              {stats.newContactLeads === 1 ? "" : "s"} awaiting review.
            </p>
            <Link
              href="/admin/leads"
              className="text-sm font-medium text-amber-800 underline-offset-2 hover:underline"
            >
              Review now →
            </Link>
          </div>
        )}
      </section>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      )}

      {stats && (
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">At a glance</h2>
            <p className="text-sm text-slate-500">Key metrics across your admin portal</p>
          </div>
          <div
            className={`grid gap-4 sm:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            <StatCard
              label="CMS pages"
              value={stats.pages}
              sub={`${stats.publishedPages} published`}
              href="/admin/pages"
              tone="purple"
              icon={<PagesIcon />}
            />
            <StatCard
              label="Registered users"
              value={stats.users}
              sub="Active accounts"
              href="/admin/users"
              tone="blue"
              icon={<UsersIcon />}
            />
            {isSuperAdmin && (
              <StatCard
                label="Applications"
                value={stats.applications}
                sub="Registration submissions"
                href="/admin/users"
                tone="amber"
                icon={<ApplicationsIcon />}
              />
            )}
            <StatCard
              label="Contact leads"
              value={stats.contactLeads}
              sub={
                stats.newContactLeads > 0
                  ? `${stats.newContactLeads} awaiting review`
                  : "All caught up"
              }
              href="/admin/leads"
              tone="emerald"
              highlight={stats.newContactLeads > 0 ? `${stats.newContactLeads} new` : undefined}
              icon={<LeadsIcon />}
            />
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Content & site" description="Manage public-facing content and configuration">
          {contentActions.map((action) => (
            <ActionRow key={action.href} {...action} />
          ))}
        </Panel>

        <Panel title="Users & leads" description="Accounts, registrations, and enquiries">
          {userActions.map((action) => (
            <ActionRow key={action.href} {...action} />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function PagesIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function ApplicationsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SeoIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
  );
}

function ModalIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
    </svg>
  );
}
