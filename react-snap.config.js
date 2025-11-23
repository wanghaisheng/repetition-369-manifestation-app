module.exports = {
  // Pages to prerender
  include: [
    "/",
    "/about",
    "/faq", 
    "/method369",
    "/blog",
    "/user-stories",
    "/privacy",
    "/terms"
  ],
  
  // Minify HTML
  minifyHtml: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  },
  
  // Puppeteer options
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  
  // Wait for content to load
  waitFor: 2000,
  
  // Viewport
  viewport: {
    width: 1920,
    height: 1080
  },
  
  // Skip third-party requests
  skipThirdPartyRequests: true,
  
  // Cache AJAX requests
  cacheAjaxRequests: true,
  
  // Preconnect to external domains
  preconnectThirdParty: true,
  
  // Fix web components
  inlineCss: true,
  
  // Don't remove inline styles
  removeStyleTags: false,
  
  // Fix for SPA routing
  removeScriptTags: false,
  
  // Exclude patterns
  exclude: [
    "/app",
    "/app/*",
    "/admin",
    "/admin/*",
    "/auth",
    "/auth/*"
  ],
  
  // Sitemap generation
  sitemap: true,
  sitemapPath: "sitemap-prerendered.xml"
};
