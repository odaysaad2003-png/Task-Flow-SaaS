# TaskFlow SaaS — Project Status

> آخر تحديث: Sprint 3
> الحالة العامة: 🟢 نشط

---

## نظرة سريعة

| المؤشر | القيمة |
|---|---|
| Sprint الحالي | 3 من 10 |
| الاكتمال الكلي | 30% |
| الملفات المنشأة | ~55 ملف |
| الـ API Endpoints | 12 endpoint |
| الـ Features المكتملة | Auth · Dashboard |
| الـ Features قيد البناء | — |
| الـ Features القادمة | Projects · Tasks · Comments · Clients · Team · Activity · Notifications · Settings |

---

## سجل السبرنتات

### ✅ Sprint 0 — Architecture Foundation
**الحالة:** مكتمل

الملفات المنشأة:
- `src/types/shared.type.ts` — ApiResponse, ApiError, PaginatedResponse
- `src/lib/api-client.ts` — wrapper موحّد فوق fetch
- `src/lib/query-client.ts` + `QueryProvider`
- `src/lib/query-keys.ts` — factory للـ Cache Keys
- `src/config/roles.ts` — RBAC system
- `src/config/navigation.ts` — nav items
- هيكل مجلدات features كامل (auth, dashboard, projects, tasks, comments, clients, team, activity, notifications)

المفاهيم المكتسبة:
- Feature-Based Architecture
- ApiResponse Envelope pattern
- Query Keys Factory pattern
- TypeScript strict mode

---

### ✅ Sprint 1 — Types, Schemas, Mock Data & API Layer
**الحالة:** مكتمل

الملفات المنشأة:
- `src/features/*/types/*.type.ts` — 7 كيانات (User, Project, Task, Client, Comment, ActivityLog, Notification)
- `src/features/*/schemas/*.schema.ts` — Zod schemas لكل كيان
- `src/lib/mock-db.ts` — قاعدة بيانات وهمية بعلاقات حقيقية
- `src/lib/mock-db.helpers.ts` — generateId, simulateDelay, logActivity
- `src/app/api/projects/route.ts` + `[id]/route.ts`
- `src/app/api/tasks/route.ts` + `[id]/route.ts`
- `src/app/api/comments/route.ts`
- `src/app/api/clients/route.ts`
- `src/app/api/users/route.ts`
- `src/app/api/activity/route.ts`
- `src/features/*/services/*.api.ts` — Service Layer لكل feature

الـ API Endpoints المتاحة:
```
GET    /api/projects          ✅ (filters: status, clientId, priority, search, page, limit)
POST   /api/projects          ✅
GET    /api/projects/[id]     ✅
PATCH  /api/projects/[id]     ✅
DELETE /api/projects/[id]     ✅
GET    /api/tasks             ✅ (filters: projectId, status, priority, assigneeId)
POST   /api/tasks             ✅
GET    /api/tasks/[id]        ✅
PATCH  /api/tasks/[id]        ✅
DELETE /api/tasks/[id]        ✅
GET    /api/comments          ✅ (filter: taskId)
POST   /api/comments          ✅
GET    /api/clients           ✅
POST   /api/clients           ✅
GET    /api/users             ✅
GET    /api/activity          ✅ (filters: entityType, entityId, limit)
```

المفاهيم المكتسبة:
- Schema-First Design (Zod)
- REST API simulation داخل Next.js
- Populate pattern (Project → Client + Owner)
- Service Layer كطبقة وسيطة
- Response Envelope موحّد

---

### ✅ Sprint 2 — Design System, App Shell & Auth
**الحالة:** مكتمل

الملفات المنشأة:
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/features/auth/services/auth.api.ts`
- `src/features/auth/context/auth-context.tsx`
- `src/features/auth/hooks/use-auth.ts`
- `src/features/auth/hooks/use-login.ts`
- `src/features/auth/hooks/use-permissions.ts`
- `src/components/providers/app-providers.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/sidebar-context.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/shared/EmptyState.tsx`
- `src/components/shared/ErrorState.tsx`
- `src/components/shared/PageSkeleton.tsx`
- `middleware.ts`

الـ API Endpoints المضافة:
```
POST /api/auth/login   ✅
POST /api/auth/logout  ✅
GET  /api/auth/me      ✅
```

المفاهيم المكتسبة:
- Cookie-based Auth simulation
- Context API للـ Auth فقط
- RBAC (Role-Based Access Control)
- Protected Routes (Middleware + Layout)
- useMutation للـ Auth operations

---

### 🔄 Sprint 3 — Dashboard Feature (الحالي)
**الحالة:** قيد التنفيذ

الملفات المنشأة في هذا السبرنت:
- `src/app/api/dashboard/stats/route.ts`
- `src/features/dashboard/types/dashboard.type.ts`
- `src/features/dashboard/services/dashboard.api.ts`
- `src/features/dashboard/hooks/use-dashboard-stats.ts`
- `src/features/dashboard/hooks/use-recent-projects.ts`
- `src/features/dashboard/hooks/use-recent-tasks.ts`
- `src/features/dashboard/hooks/use-activity-feed.ts`
- `src/features/dashboard/components/StatsCard.tsx`
- `src/features/dashboard/components/StatsGrid.tsx`
- `src/features/dashboard/components/RecentProjects.tsx`
- `src/features/dashboard/components/RecentTasks.tsx`
- `src/features/dashboard/components/ActivityFeed.tsx`
- `src/features/dashboard/components/TaskStatusChart.tsx`
- `src/features/dashboard/components/WelcomeBanner.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`

المفاهيم المكتسبة:
- useQuery + staleTime تحكم
- useQueries للطلبات المتوازية
- Skeleton loading لكل مكون منفصل
- Role-Based UI في الداشبورد
- Aggregation endpoint design

---

### ⏳ Sprint 4 — Projects Feature
**الحالة:** لم يبدأ بعد

المخطط:
- Project List + Cards
- Filters (status, client, priority) عبر URL params
- Search
- Pagination
- Create/Edit/Delete (Dialog + React Hook Form + Zod)
- Project Status Badge

---

### ⏳ Sprint 5 — Project Details Page
| Sprint الحالي | 4 → 5 |
| الاكتمال الكلي | 40% → 50% |
| الملفات المنشأة | ~55 → ~80 ملف |

### ✅ Sprint 4 — Projects Feature
الملفات المضافة:
- src/app/api/clients/[id]/route.ts
- src/features/projects/constants/project.constants.ts
- src/features/projects/hooks/use-projects.ts
- src/features/projects/hooks/use-project.ts
- src/features/projects/hooks/use-create-project.ts
- src/features/projects/hooks/use-update-project.ts
- src/features/projects/hooks/use-delete-project.ts
- src/features/projects/components/ProjectStatusBadge.tsx
- src/features/projects/components/ProjectPriorityBadge.tsx
- src/features/projects/components/ProjectCard.tsx
- src/features/projects/components/ProjectFilters.tsx
- src/features/projects/components/ProjectFormDialog.tsx
- src/features/projects/components/DeleteProjectDialog.tsx
- src/components/shared/Pagination.tsx
- src/app/(dashboard)/projects/page.tsx
المخطط:
- Tabs: Overview / Tasks / Comments / Activity
- Lazy loading لكل Tab

---

### ⏳ Sprint 6 — Tasks Feature
**الحالة:** لم يبدأ بعد

المخطط:
- Task List + Filters
- Optimistic Update لتغيير الحالة
- Create/Edit/Delete

---

### ⏳ Sprint 7 — Comments Feature
**الحالة:** لم يبدأ بعد

---

### ⏳ Sprint 8 — Clients & Team Features
**الحالة:** لم يبدأ بعد

---

### ⏳ Sprint 9 — Activity Log & Notifications
**الحالة:** لم يبدأ بعد

---

### ⏳ Sprint 10 — Settings & Polish Pass
**الحالة:** لم يبدأ بعد

---

## قواعد الكود الملزمة (تُراجَع في كل Sprint)

- [ ] ممنوع `fetch` مباشر داخل أي Component
- [ ] ممنوع business logic داخل JSX
- [ ] ممنوع تكرار Types في أكثر من مكان
- [ ] ممنوع Context لإدارة Server State
- [ ] كل بيانات API → React Query فقط
- [ ] كل فلتر/بحث → URL State
- [ ] كل فورم → Zod + zodResolver
- [ ] كل صفحة بيانات → Loading + Error + Empty + Success

---

## Backend Migration Map (تُحدَّث مع كل Sprint)

| Frontend (الآن) | Backend Express (لاحقاً) |
|---|---|
| `app/api/*/route.ts` | Express Router |
| `mock-db.ts` | Prisma + PostgreSQL |
| `*.api.ts` Service | Controller + Service Layer |
| Zod Schema | Request Validation Middleware |
| Cookie `taskflow_uid` | JWT HttpOnly Cookie |
| `can(role, permission)` | Authorization Middleware |
| `simulateDelay()` | Real network latency |
| `logActivity()` | Audit Log DB trigger |
