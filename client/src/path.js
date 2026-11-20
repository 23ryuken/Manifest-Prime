export const paths = {
    login: "/login",
    signup: "/signup",
    library: "/library"
}

export function libraryPath(folderId) {
    return folderId ? `${paths.folders}/${folderId}` : paths.folders;
}