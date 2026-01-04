import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LandingPage } from "./features/pages/LandingPage";
import { WalletProvider } from "./lib/wallet/WalletProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PlaygroundPage } from "./features/playground/PlaygroundPage";
import { DocsPage } from "./features/pages/DocsPage";
import { WaitlistPage } from "./features/pages/WaitlistPage";
import { TeamPage } from "./features/pages/TeamPage";
import { ExtensionsPage } from "./features/pages/ExtensionsPage";
import { ResourcesPage } from "./features/pages/ResourcesPage";
import { BlogPage } from "./features/pages/BlogPage";
import { BlogPostPage } from "./features/pages/BlogPostPage";
import { NotFoundPage } from "./features/pages/NotFoundPage";

// Loading spinner for lazy-loaded routes
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 text-sm">Loading page...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/extensions" element={<ExtensionsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              {/* 404 - Must be last */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App;
