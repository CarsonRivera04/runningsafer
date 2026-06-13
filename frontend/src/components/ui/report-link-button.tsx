"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ReportLinkButton({ activityId }: { activityId: number }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      asChild
      variant="outline"
      className="min-w-40"
      aria-disabled={isLoading}
    >
      <Link
        href={`/activity?activityId=${activityId}`}
        onClick={(event) => {
          if (isLoading) {
            event.preventDefault();
            return;
          }

          setIsLoading(true);
        }}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" />
            Loading report...
          </>
        ) : (
          "View Safety Report"
        )}
      </Link>
    </Button>
  );
}
