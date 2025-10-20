import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_iTNcmR9T.mjs';
import 'es-module-lexer';
import { f as decodeKey } from './chunks/astro/server_BxBEDDA2.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/hunts3c/dev/astro-blog/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"posts/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/posts","isIndex":false,"type":"page","pattern":"^\\/posts\\/?$","segments":[[{"content":"posts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/posts.astro","pathname":"/posts","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"projects/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/projects","isIndex":false,"type":"page","pattern":"^\\/projects\\/?$","segments":[[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/projects.astro","pathname":"/projects","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"topics/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/topics","isIndex":false,"type":"page","pattern":"^\\/topics\\/?$","segments":[[{"content":"topics","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/topics.astro","pathname":"/topics","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/views/[slug]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/views\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"views","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/api/views/[slug].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/hunts3c/dev/astro-blog/src/components/posts-loop.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/hunts3c/dev/astro-blog/src/pages/posts.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/posts@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/hunts3c/dev/astro-blog/src/pages/post/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/post/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/hunts3c/dev/astro-blog/src/pages/topics.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/topics@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/hunts3c/dev/astro-blog/src/pages/topics/[topic].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/topics/[topic]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/hunts3c/dev/astro-blog/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/hunts3c/dev/astro-blog/src/pages/projects.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/api/views/[slug]@_@ts":"pages/api/views/_slug_.astro.mjs","\u0000@astro-page:src/pages/post/[slug]@_@astro":"pages/post/_slug_.astro.mjs","\u0000@astro-page:src/pages/topics/[topic]@_@astro":"pages/topics/_topic_.astro.mjs","\u0000@astro-page:src/pages/topics@_@astro":"pages/topics.astro.mjs","\u0000@astro-page:src/pages/posts@_@astro":"pages/posts.astro.mjs","\u0000@astro-page:src/pages/projects@_@astro":"pages/projects.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","C:/Users/hunts3c/dev/astro-blog/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/qradar101.md?astroContentCollectionEntry=true":"chunks/qradar101_fH8Dt_M-.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/soclab.md?astroContentCollectionEntry=true":"chunks/soclab_ShQ4l8nQ.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/solarwinds.md?astroContentCollectionEntry=true":"chunks/solarwinds_CogeZNY-.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/soulmate.md?astroContentCollectionEntry=true":"chunks/soulmate_CU2-3DKm.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/qradar101.md?astroPropagatedAssets":"chunks/qradar101_CcR68BSC.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/soclab.md?astroPropagatedAssets":"chunks/soclab_BWDTIytm.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/solarwinds.md?astroPropagatedAssets":"chunks/solarwinds_BIaEyVjl.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/soulmate.md?astroPropagatedAssets":"chunks/soulmate_Bfjqn7z3.mjs","\u0000astro:asset-imports":"chunks/_astro_asset-imports_D9aVaOQr.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BcEe_9wP.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/qradar101.md":"chunks/qradar101_CnttV6jD.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/soclab.md":"chunks/soclab_BQuMF1aN.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/solarwinds.md":"chunks/solarwinds_DbNrDqJJ.mjs","C:/Users/hunts3c/dev/astro-blog/src/content/post/soulmate.md":"chunks/soulmate_Cwa9jHcY.mjs","\u0000@astrojs-manifest":"manifest_Bhbcb8bn.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.Cir9jLFj.js","C:/Users/hunts3c/dev/astro-blog/src/layouts/post.astro?astro&type=script&index=0&lang.ts":"_astro/post.astro_astro_type_script_index_0_lang.DljyG31b.js","/astro/hoisted.js?q=1":"_astro/hoisted.FA79X4PL.js","C:/Users/hunts3c/dev/astro-blog/src/components/dots.astro?astro&type=script&index=0&lang.ts":"_astro/dots.astro_astro_type_script_index_0_lang.B35l38TH.js","C:/Users/hunts3c/dev/astro-blog/src/layouts/main.astro?astro&type=script&index=0&lang.ts":"_astro/main.astro_astro_type_script_index_0_lang.BoI8BgAW.js","C:/Users/hunts3c/dev/astro-blog/src/layouts/main.astro?astro&type=script&index=1&lang.ts":"_astro/main.astro_astro_type_script_index_1_lang.CZDz_Plz.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.BJu0ZGxm.css","/favicon.ico","/robots.txt","/_astro/dots.astro_astro_type_script_index_0_lang.B35l38TH.js","/_astro/hoisted.Cir9jLFj.js","/_astro/hoisted.FA79X4PL.js","/_astro/main.astro_astro_type_script_index_0_lang.BoI8BgAW.js","/_astro/main.astro_astro_type_script_index_1_lang.CZDz_Plz.js","/_astro/main.CoLQ22k_.css","/_astro/post.astro_astro_type_script_index_0_lang.DljyG31b.js","/assets/images/about.jpg","/assets/images/cover.png","/assets/images/favicon.png","/assets/images/photo.png","/assets/icons/technologies/azure.svg","/assets/icons/technologies/bash.svg","/assets/icons/technologies/cyberdefenders.svg","/assets/icons/technologies/default.svg","/assets/icons/technologies/elastic.svg","/assets/icons/technologies/hackthebox.svg","/assets/icons/technologies/java.svg","/assets/icons/technologies/javascript.svg","/assets/icons/technologies/linux.svg","/assets/icons/technologies/nextjs.svg","/assets/icons/technologies/python.svg","/assets/icons/technologies/sentinel.svg","/assets/icons/technologies/sql.svg","/assets/icons/technologies/typescript.svg","/assets/images/posts/code-canvas.jpg","/assets/images/posts/coffee.jpg","/assets/images/posts/flowchart.jpg","/assets/images/posts/perfect-coffee.jpg","/assets/images/posts/pour-over.jpg","/assets/images/posts/vintage-tech-01.jpg","/assets/images/posts/vintage-tech-02.jpg","/assets/images/posts/workspace.jpg","/assets/images/projects/broadcast-channel.png","/assets/images/projects/crispydough.png","/assets/images/projects/dns.surf.png","/assets/images/projects/html.zone.png","/assets/images/projects/long.png","/assets/images/projects/sink.cool.png","/assets/images/projects/stego.png","/assets/images/projects/tempmail.best.png","/assets/images/projects/tracerfire.jpg","/assets/images/topics/default.png","/assets/images/topics/incidentresponse.png","/assets/images/topics/malwareanalysis.png","/assets/images/topics/networkenumeration.png","/assets/images/topics/securityengineering.png","/assets/images/topics/threathunt.png","/assets/images/topics/threatintelligence.png","/assets/images/experiences/fta.ico","/assets/images/experiences/wulian.ico","/assets/images/experiences/yoho.ico","/posts/index.html","/projects/index.html","/topics/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"zypV2NyV4KCW7lzCu4lX/0MEeZSRlJUOgIVUlt6ezD0=","experimentalEnvGetSecretEnabled":false});

export { manifest };
