import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { WalletProvider } from "./lib/wallet/WalletProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

const LandingPage = lazy(() =>
  import("./features/pages/LandingPage").then((module) => ({ default: module.LandingPage })),
);
const PlaygroundPage = lazy(() =>
  import("./features/playground/PlaygroundPage").then((module) => ({ default: module.PlaygroundPage })),
);
const DocsPage = lazy(() =>
  import("./features/pages/DocsPage").then((module) => ({ default: module.DocsPage })),
);
const WaitlistPage = lazy(() =>
  import("./features/pages/WaitlistPage").then((module) => ({ default: module.WaitlistPage })),
);
const TeamPage = lazy(() =>
  import("./features/pages/TeamPage").then((module) => ({ default: module.TeamPage })),
);
const ExtensionsPage = lazy(() =>
  import("./features/pages/ExtensionsPage").then((module) => ({ default: module.ExtensionsPage })),
);
const ResourcesPage = lazy(() =>
  import("./features/pages/ResourcesPage").then((module) => ({ default: module.ResourcesPage })),
);
const BlogPage = lazy(() =>
  import("./features/pages/BlogPage").then((module) => ({ default: module.BlogPage })),
);
const BlogPostPage = lazy(() =>
  import("./features/pages/BlogPostPage").then((module) => ({ default: module.BlogPostPage })),
);
const NotFoundPage = lazy(() =>
  import("./features/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })),
);

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
