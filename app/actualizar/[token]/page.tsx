import UpdateBusinessForm from "@/components/UpdateBusinessForm";

export default function UpdateBusinessPage({
  params
}: {
  params: { token: string };
}) {
  return <UpdateBusinessForm token={params.token} />;
}
