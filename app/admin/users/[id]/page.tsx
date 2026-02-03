export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="text-black">
            User Detail Page: {id}
        </div>
    );
}