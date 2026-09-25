const posterFiles = import.meta.glob(
    "../assets/posters/*",
    {
        eager: true,
        query: "?url",
        import: "default"
    }
);

const posterImages = {};

Object.entries(posterFiles).forEach(
    ([path, image]) => {
        const fileName =
            path.split("/").pop();

        posterImages[fileName] = image;
    }
);

export const getPoster = (
    imageName
) => {
    return posterImages[imageName] || "";
};