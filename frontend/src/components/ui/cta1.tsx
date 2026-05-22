import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const CTA1 = ({ firstname }: { firstname: string }) => (
    <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
            <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
                <div>
                    <Badge>Get started</Badge>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                        Welcome, {firstname}!
                    </h3>
                    <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
                        You currently do not have any runs or walks recorded on Strava.
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <a href="https://www.strava.com/" target="_blank" rel="noopener noreferrer">
                        <Button className="gap-4 bg-[#FC5200] text-white hover:bg-[#e04900]">
                            Record an activity on Strava <MoveRight className="w-4 h-4" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    </div>
);