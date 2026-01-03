import { Navbar } from "@/components/shared/Navbar";
import { Hero } from "./Hero";
import { FeatureGrid } from "./FeatureGrid";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Hero />
            <FeatureGrid />
            
        </div>
    );
}
