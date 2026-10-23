// Extraction script to inspect computed styles on the preview page
// Run in browser console or via Puppeteer/Playwright
(() => {
  function getStyle(selector) {
    const el = document.querySelector(selector);
    if (!el) return null;
    const s = window.getComputedStyle(el);
    return {
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing,
      color: s.color,
      backgroundColor: s.backgroundColor,
      borderRadius: s.borderRadius,
      paddingTop: s.paddingTop,
      paddingLeft: s.paddingLeft,
      maxWidth: s.maxWidth,
    };
  }

  const results = {
    nav: getStyle("header > div"),
    h1: getStyle("h1"),
    p_hero: getStyle("h1 + p"),
    pill: getStyle(".inline-flex.items-center.gap-2.rounded-full"),
    cta_primary: getStyle("a[href='/login'].rounded-full.bg-\\[rgb\\(242\\,239\\,233\\)\\]"),
    h2: getStyle("h2"),
    pipeline_section: getStyle("#pipeline"),
  };

  console.log(JSON.stringify(results, null, 2));
  return results;
})();
