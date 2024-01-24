const downloadButton = document.querySelector('#download_button');
const mediaLinks = [];

const onRecieveLinks = (links) => {
    links.forEach(link => {
        const id = (Math.random() + 1).toString(36).substring(2);

        const parts = link.split('/');
        const name = parts[parts.length-1];

        mediaLinks.push({
            id: id,
            url: link,
            name: name,
            checked: false,
        });
    });

    buildTable(mediaLinks);
};

const buildTable = (links) => {
    const table = document.querySelector('#table');
    table.replaceChildren([]);

    var allEnabled = true;

    links.forEach(mediaLink => {
        const tr = document.createElement('tr');

        const checkboxTd = document.createElement('td');
        checkboxTd.appendChild(buildCheckbox(mediaLink));

        const nameTd = document.createElement('td');
        nameTd.innerText = mediaLink.name;

        const urlTd = document.createElement('td');
        urlTd.innerText = mediaLink.url;

        tr.appendChild(checkboxTd);
        tr.appendChild(nameTd);
        tr.appendChild(urlTd);

        table.appendChild(tr);

        if (!mediaLink.checked) {
            allEnabled = false;
        }
    });

    const selectAllCheckbox = document.querySelector('#select_all_checkbox');
    selectAllCheckbox.onchange = () => {
        for (var i = 0; i < links.length; i++) {
            document.querySelector('#link_' + links[i].id).checked = selectAllCheckbox.checked;
            links[i].checked = selectAllCheckbox.checked;
        }
        setDownloadButtonState();
    };
    selectAllCheckbox.checked = allEnabled;
};

const buildCheckbox = (link) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'link_' + link.id;
    checkbox.name = 'link_' + link.id;
    checkbox.value = 'enabled';
    checkbox.checked = link.checked;
    checkbox.onchange = () => {
        let index = mediaLinks.findIndex(mediaLink => {
            return mediaLink.id == link.id;
        });
        mediaLinks[index].checked = checkbox.checked;
        setDownloadButtonState();
    };
    return checkbox;
};

downloadButton.onclick = async () => {
    const filesToDownload = mediaLinks.filter(link => {
        return link.checked;
    });

    if (filesToDownload.length === 0) {
        return;
    }

    downloadButton.disabled = true;

    for (var i = 0; i < filesToDownload.length; i++) {
        await browser.downloads.download({
            url: filesToDownload[i].url
        });
    }
};

const setDownloadButtonState = () => {
    const links = mediaLinks.filter(link => {
        return link.checked;
    });

    downloadButton.innerText = 'Download (' + links.length + ')';
    downloadButton.disabled = links.length === 0;
};

const searchInput = document.querySelector('#search');
searchInput.oninput = () => {
    if (searchInput.value === "") {
        buildTable(mediaLinks);
        return;
    }

    const pattern = new RegExp(searchInput.value);

    buildTable(mediaLinks.filter(link => {
        return link.url.search(pattern) != -1;
    }));
};

browser.runtime.onMessage.addListener(onRecieveLinks);
browser.tabs.executeScript({ file: 'content_script.js' });
