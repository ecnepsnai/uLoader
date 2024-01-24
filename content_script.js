(() => {
    const fileExtensions = [
        '.jpg',
        '.jpeg',
        '.gif',
        '.webm',
        '.png'
    ];

    let links = {};
    Array.from(document.querySelectorAll('img')).forEach(img => {
        fileExtensions.forEach(ext => {
            if (img.src.endsWith(ext)) {
                links[img.src] = true;
            }
        });
    });
    Array.from(document.querySelectorAll('a')).forEach(a => {
        fileExtensions.forEach(ext => {
            if (a.href.endsWith(ext)) {
                links[a.href] = true;
            }
        });
    });

    browser.runtime.sendMessage(Object.keys(links));
})();
