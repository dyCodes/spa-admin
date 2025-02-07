// app/(auth)/callback/page.js
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function CallbackPage({ searchParams }: { searchParams: { code: string } }) {
	const { code } = searchParams;
	console.log(code);

	if (!code) {
		redirect("/");
	}

	try {
		// Verify the code with Supabase
		const supabase = await createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.verifyOtp({
			type: "magiclink",
			token_hash: code,
		});

		if (error) {
			throw new Error("Invalid or expired token");
		}

		// Redirect to the dashboard on successful verification
		redirect("/dashboard");
	} catch (error: any) {
		console.error("Authentication error:", error?.message);
		// redirect("/?error=authentication_failed");
	}
}
