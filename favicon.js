/*
 * | Websites             | Favicon href values                                            |
 * |----------------------+----------------------------------------------------------------|
 * | https://github.com   | https://github.githubassets.com/favicons/favicon.png           |
 * | https://jquery.com   | //jquery.com/jquery-wp-content/themes/jquery.com/i/favicon.ico |
 * | https://pixabay.com  | /favicon-32x32.png                                             |
 * | https://willbc.cn    | assets/images/favicon.png                                      |
 */

// 1. Get favicons in website
function getFavicons() {
    const links = document.querySelectorAll('link[rel*=icon]')
    const favicons = [...links].map(link => {
        const href = link.href
        try {
            // Check if favicon's href is a valid URL
            new URL(href)
            return href
        } catch (_) {
            const origin = new URL(document.URL).origin

            // assets/images/favicon.png
            return origin + '/' + href
        }
    })
}
console.log(getFavicons());
// 2. Sort Favicons by name and quality.
// 3. Convert Favicons to Base64
// Test
