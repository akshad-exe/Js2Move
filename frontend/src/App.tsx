import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./features/pages/LandingPage";
import { PlaygroundPage } from "./features/playground/PlaygroundPage";
import { DocsPage } from "./features/pages/DocsPage";
import { WaitlistPage } from "./features/pages/WaitlistPage";
import { TeamPage } from "./features/pages/TeamPage";
import { ExtensionsPage } from "./features/pages/ExtensionsPage";
import { ResourcesPage } from "./features/pages/ResourcesPage";
import { BlogPage } from "./features/pages/BlogPage";
import { BlogPostPage } from "./features/pages/BlogPostPage";
import { WalletProvider } from "./lib/wallet/WalletProvider";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
