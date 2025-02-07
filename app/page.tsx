"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const supabase = await createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

			const { data, error } = await supabase.auth.signInWithOtp({
				email: email,
				options: {
					shouldCreateUser: true,
					emailRedirectTo: `http://localhost:3000/auth/callback`,
				},
			});

			console.log(data);

			if (error) {
				throw error;
			}

			toast.success("Check your email for the login link!");
			setEmail("");
		} catch (error) {
			if (error instanceof Error && error.message.includes("connect to Supabase")) {
				console.error("Please connect to Supabase first");
			} else {
				console.error("Failed to send login link. Please try again.");
				toast.error("Failed to send login link. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen">
			{/* Background gradients */}
			<div className="pointer-events-none fixed inset-0">
				<div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
				<div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
				<div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
			</div>

			<div className="relative z-10">
				<Navbar />

				<section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
					<div className="space-y-4">
						<h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
							Innovate Faster with
							<br />
							Amane Soft
						</h1>
						<p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
							Empowering businesses with cutting-edge software solutions. From AI-driven analytics to seamless cloud integrations, we&apos;re shaping
							the future of technology.
						</p>
					</div>

					<div className="w-full max-w-md">
						<form className="flex gap-4" onSubmit={handleSignIn}>
							<Input
								type="email"
								className="w-full"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>

							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Sending link..." : "Get Started"}
							</Button>
						</form>
					</div>
				</section>
			</div>
		</div>
	);
}
