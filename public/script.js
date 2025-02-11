document.getElementById('uploadBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadAudio(data.filePath);
                loadTags(file);
            }
        });
    }
});

function loadAudio(filePath) {
    const audio = document.getElementById('audio');
    audio.src = filePath;
    audio.load();
}

function loadTags(file) {
    ID3.loadTags(file.name, () => {
        const tags = ID3.getAllTags(file.name);
        const tagList = document.getElementById('tagList');
        tagList.innerHTML = '';

        for (const [key, value] of Object.entries(tags)) {
            const li = document.createElement('li');
            li.textContent = `${key}: ${value}`;
            tagList.appendChild(li);
        }
    }, {
        tags: ["title", "artist", "album"]
    });
}

document.getElementById('saveTags').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const album = document.getElementById('album').value;

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const tags = {
            title: title,
            artist: artist,
            album: album
        };

        ID3.writeTags(file.name, tags, () => {
            alert('Tags updated successfully!');
            loadTags(file);
        });
    }
});