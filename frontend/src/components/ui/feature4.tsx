import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from  "next/image";

export const Feature4 = () => (
  <div className="w-full py-20 px-4 sm:px-6 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 flex-col flex-1">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Running Safer
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Connect your Strava account to Running Safer and get personalized safety insights based on your running and walking activities. 
            </p>
          </div>
          <a href="/api/py/auth/login">
            <Image 
              src="/images/btn_strava_connect.png" 
              alt="Connect with Strava" 
              width={200} 
              height={50} 
              priority
              className="w-48 h-auto"/>
          </a>
        </div>
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
      </div>
    </div>
  </div>
);