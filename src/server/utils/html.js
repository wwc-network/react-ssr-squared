// TODO: switch this to a single object instead of params
function renderHtml(html, preloadedState, assets, helmet, context) {
    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">

                ${helmet.title.toString()}
                ${helmet.meta.toString()}

                ${(assets.vendor_css) ? '<link rel="stylesheet" href="' + assets.vendor_css.css + '" />' : ''}
                ${(assets.head_css) ? '<link rel="stylesheet" href="' + assets.head_css.css + '" />' : ''}

                ${helmet.link.toString()}
            </head>
            <body>
                <div id="root" class="wrapper">${html}</div>

                <script>
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                    window.splitPoints = ${(context && context.splitPoints) ? JSON.stringify(context.splitPoints) : JSON.stringify([])};
                </script>
                
                ${(assets.manifest) ? '<script src="' + assets.manifest.js + '"></script>' : ''}
                ${(assets.vendor_js) ? '<script src="' + assets.vendor_js.js + '"></script>' : ''}
                ${(assets.app) ? '<script src="' + assets.app.js + '"></script>': ''}
            </body>
        </html>
    `;
}

module.exports = {
    renderHtml: renderHtml 
};
