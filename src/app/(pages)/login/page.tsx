"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LogInIcon } from "lucide-react";

import { signIn } from "@/lib/auth/auth-client";
import {
  Button,
  Heading,
  Paper,
  Row,
  Spinner,
  Stack,
  Text,
} from "@/components/atoms";
import { LandscapeSVG, MonzoLogoSVG } from "@/assets";

const ThemeButton = dynamic(
  () =>
    import("@/components/molecules/theme-button").then(
      (module) => module.ThemeButton
    ),
  { ssr: false }
);

export default function LoginPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    await signIn.oauth2({
      providerId: "monzo",
      callbackURL: "/",
    });
    setIsLoading(false);
  };

  return (
    <Stack fullWidth className="min-h-screen">
      <Paper className="relative h-3/4 w-3/4 md:w-1/2">
        <Row gap="md" fullWidth fullHeight>
          <ThemeButton className="absolute top-4 right-4" />

          <Stack
            fullHeight
            className="hidden w-1/2 overflow-hidden rounded-xl xl:flex"
          >
            <LandscapeSVG className="h-full w-full object-cover" />
          </Stack>

          <Stack gap="lg" fullWidth grow>
            <MonzoLogoSVG className="h-16 w-16" />

            <Stack gap="xs">
              <Heading align="center" weight="bold">
                Welcome to Monzo
              </Heading>

              <Text size="sm" align="center">
                Connect your Monzo account to get started
              </Text>
            </Stack>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : <LogInIcon />}
              Sign in with Monzo
            </Button>

            <Text size="sm" align="center" color="muted">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </Stack>
        </Row>
      </Paper>
    </Stack>
  );
}
