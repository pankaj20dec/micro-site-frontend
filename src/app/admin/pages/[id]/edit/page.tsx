import { EditPageForm } from "./EditPageForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditPage({ params }: Props) {
  const { id } = await params;
  return <EditPageForm id={id} />;
}
