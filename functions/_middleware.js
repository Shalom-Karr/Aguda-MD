// Site-wide middleware: 301 redirect www.baltcrn.org -> baltcrn.org so
// search engines see one canonical hostname instead of two duplicates.

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace(/^www\./, '');
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
