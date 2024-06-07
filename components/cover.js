function updateCoverImage(file) {
    const coverImage = document.getElementById('cover');
    if (file.tags.image) {
        const imageBuffer = file.tags.image.imageBuffer;
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const mimeType = file.tags.image.mime;
        coverImage.src = `data:${mimeType};base64,${base64Image}`;
    } else {
        coverImage.src = 'assets/default-cover.jpg';
    }
}

module.exports = { updateCoverImage };
