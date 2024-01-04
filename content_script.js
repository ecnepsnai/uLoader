(() => {
    const fileExtensions = [
        '.jpg',
        '.jpeg',
        '.gif',
        '.webm',
        '.png'
    ];

    let links = [];
    Array.from(document.querySelectorAll('img')).forEach(img => {
        fileExtensions.forEach(ext => {
            if (img.src.endsWith(ext)) {
                links.push(img.src);
            }
        });
    });
    Array.from(document.querySelectorAll('a')).forEach(a => {
        fileExtensions.forEach(ext => {
            if (a.href.endsWith(ext)) {
                links.push(a.href);
            }
        });
    });

    browser.runtime.sendMessage(links);
})();
