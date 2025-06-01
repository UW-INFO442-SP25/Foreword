// this function just takes a profile image url and returns a proxied url that
// follows security policies of browsers, doesn't change anything in the database
export function getProxiedImageUrl(url) {
    if (!url) return null;

    if (url.startsWith('http') && !url.includes('data:image')) {
        return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }
    
    return url;
} 