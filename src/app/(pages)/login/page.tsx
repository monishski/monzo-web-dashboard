"use client";

import { LogInIcon } from "lucide-react";

import { signIn } from "@/lib/auth/auth-client";
import { Button, Paper, Row, Stack } from "@/components/atoms";
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
    <Stack fullWidth className="min-h-screen">
      <Paper className="relative h-3/4 w-3/4 md:w-1/2">
        <Row gap="md" fullWidth fullHeight>
          <ThemeButton className="absolute top-4 right-4" />

          {/* Create Container/Image components */}
          <Stack
            fullHeight
            className="hidden w-1/2 overflow-hidden rounded-xl xl:flex"
          >
            <Landscape className="h-full w-full object-cover" />
          </Stack>

          <Stack gap="md" fullWidth grow>
            <MonzoLogo className="h-16 w-16" />

            <Stack gap="xs">
              <h1 className="text-font text-center text-3xl font-semibold">
                Welcome to Monzo
              </h1>

              <p className="text-center text-sm">
                Connect your Monzo account to get started
              </p>
            </Stack>

            <Button variant="secondary" fullWidth onClick={handleSignIn}>
              <LogInIcon />
              Sign in with Monzo
            </Button>

            <p className="text-muted text-center text-xs">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </Stack>
        </Row>
      </Paper>
    </Stack>
  );
}
