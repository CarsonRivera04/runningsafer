"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ActivityPaginationProps {
    page: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export function ActivityPagination({
    page,
    hasPreviousPage,
    hasNextPage,
}: ActivityPaginationProps) {
    const router = useRouter();
    const [loadingDirection, setLoadingDirection] = useState<"previous" | "next" | null>(null);
    const previousPage = Math.max(page - 1, 1);
    const nextPage = page + 1;
    const isLoading = loadingDirection !== null;

    function loadPage(targetPage: number, direction: "previous" | "next") {
        setLoadingDirection(direction);
        router.push(`/?page=${targetPage}`);
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                disabled={!hasPreviousPage || isLoading}
                aria-label="Show previous 6 activities"
                onClick={() => loadPage(previousPage, "previous")}
            >
                {loadingDirection === "previous" ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    <ChevronLeft />
                )}
                Previous
            </Button>
            <span className="min-w-16 text-center text-sm text-muted-foreground">
                Page {page}
            </span>
            <Button
                variant="outline"
                disabled={!hasNextPage || isLoading}
                aria-label="Show next 6 activities"
                onClick={() => loadPage(nextPage, "next")}
            >
                Next
                {loadingDirection === "next" ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    <ChevronRight />
                )}
            </Button>
        </div>
    );
}
