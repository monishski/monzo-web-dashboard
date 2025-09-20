"use client";

import { LogInIcon } from "lucide-react";

import { signIn } from "@/lib/auth/auth-client";
import { Button, Divider, Paper } from "@/components/atoms";
import { ThemeButton } from "@/components/molecules";
import { Landscape, MonzoLogo } from "@/assets";

export default function LoginPage(): React.JSX.Element {
  const handleSignIn = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    await signIn.oauth2({
      providerId: "monzo",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Paper className="relative flex h-3/4 w-3/4 gap-4 md:w-1/2">
        <ThemeButton className="absolute top-4 right-4" />

        <div className="hidden w-full xl:flex xl:gap-4">
          <div className="h-full overflow-hidden rounded-xl">
            <Landscape className="h-full w-full object-cover" />
          </div>

          <Divider orientation="vertical" className="my-4" />
        </div>

        <div className="flex h-full w-full flex-col items-center">
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-2">
            <MonzoLogo className="h-16 w-16" />

            <div className="flex flex-col gap-1">
              <h1 className="text-font text-center text-3xl font-semibold">
                Welcome to Monzo
              </h1>

              <p className="text-center text-sm">
                Connect your Monzo account to get started
              </p>
            </div>

            <Divider className="my-4" />

            <Button
              className="w-full"
              variant="secondary"
              onClick={handleSignIn}
            >
              <LogInIcon />
              Sign in with Monzo
            </Button>

            <p className="text-muted text-center text-xs">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </Paper>
    </div>
  );
}
