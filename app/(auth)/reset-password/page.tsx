import ResetPasswordForm from "../_components/reset-form";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const token = query.token as string | undefined;
    if(!token){
        throw new Error('Invalid or missing token');
    }
    return (
        <div className="min-h-screen bg-red-800 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
                <ResetPasswordForm token = {token} />

            </div>
        </div>
    );
}