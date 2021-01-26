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
        const origin = new URL(document.URL).origin

        if (isURL(href)) return href
        if (href.startsWith('//')) return 'https:' + href
        return origin + '/' + href
    })

    return favicons

    function isURL(url) {
        return /^https?:\/\//.test(url)
    }
}
console.log(getFavicons());
// 2. Sort Favicons by name and quality.
// 3. Convert Favicons to Base64
// Test
