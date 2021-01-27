/*
 * | Websites             | Favicon href values                                            |
 * |----------------------+----------------------------------------------------------------|
 * | https://github.com   | https://github.githubassets.com/favicons/favicon.png           |
 * | https://jquery.com   | //jquery.com/jquery-wp-content/themes/jquery.com/i/favicon.ico |
 * | https://pixabay.com  | /favicon-32x32.png                                             |
 * | https://willbc.cn    | assets/images/favicon.png                                      |
 */

// 0. Get HTML from url
async function getHTML(url) {
    const response = await fetch(url)
    const text = await response.text()
    const parser = new DOMParser()
    const html = parser.parseFromString(text, 'text/html');

    return html
}

// 1. Get favicons in website
// You should pass document as parameter,
//  if you want to use it in the browser console.
// For example: getFavicons(document, document.URL)
function getFavicons(html, url) {
    const links = html.querySelectorAll('link[rel*=icon]')
    const favicons = [...links].map(link => {
        // link.href will prefix extension url for browser extensions
        const href = link.getAttribute('href')
        const origin = new URL(url).origin

        if (isURL(href)) return href
        if (href.startsWith('//')) return 'https:' + href
        if (href.startsWith('/')) return origin + href

        return origin + '/' + href
    })

    return favicons

    function isURL(url) {
        return /^https?:\/\//.test(url)
    }
}

// 2. Sort Favicons by name and quality.
function sortFavicons(favicons) {
    return favicons
        .map(assignPriority)
        .sort(byPriority)
        .map(removePriority)

    function assignPriority(favicon) {
        let priority = 0
        if (favicon.includes('favicon')) priority += 1
        if (favicon.includes('32')) priority += 1

        return {url: favicon, priority}
    }

    function byPriority(a, b) {
        return b.priority - a.priority
    }

    function removePriority(favicon) {
        return favicon.url
    }
}

// 3. Convert Favicons to Base64
async function toBase64(favicon) {
    const response = await fetch(favicon)
    const blob = await response.blob()

    return await fileReader(blob)

    async function fileReader(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }
}

export async function getFavicon(url) {
    try {
        const html = await getHTML(url)
        let favicons = getFavicons(html, url)
        favicons = sortFavicons(favicons)
        // You can return the URL if you need.
        const faviconURL = favicons[0]
        const faviconBase64 = await toBase64(faviconURL)

        return faviconBase64
    } catch(_) {
        const fallbackFavicon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#4a5568"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`

        return fallbackFavicon
    }
}

// Test
export function test(urls) {
    urls.map(async url => {
        const favicon = await getFavicon(url)
        console.log(url, favicon)
        // window.open(favicon);
    })
}

const urls = [
        "https://github.com",
        "https://jquery.com",
        "https://pixabay.com",
        "https://willbc.cn",
        "not a url",
        "https://unavaliable.com",
        "https://stackoverflow.com/questions/61212"
]

// Uncomment this to test
//test(urls)
