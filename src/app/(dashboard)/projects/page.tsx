import type {Metadata} from "next";
import ProjectsvewPage from "@/features/projects/components/project-vew-page";

export const metadata: Metadata = {
    title: "المشاريع | TaskFlow",
    description: "إدارة المشاريع، متابعة الحالة، الأولوية، الفريق والعملاء داخل TaskFlow.",
};

export default function ProjectsPage() {
    return <ProjectsvewPage />;
}
