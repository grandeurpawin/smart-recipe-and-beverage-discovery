async function loadTemplate(file) {
    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`Unable to load ${file}`);
    }

    return await response.text();
}

export async function loadHeaderFooter() {
    try {
        const headerTemplate = await loadTemplate("./partials/header.html");
        const footerTemplate = await loadTemplate("./partials/footer.html");

        const headerElement = document.querySelector(".site-header");
        const footerElement = document.querySelector("#site-footer");

        if (headerElement) {
            headerElement.innerHTML = headerTemplate;
        }

        if (footerElement) {
            footerElement.innerHTML = footerTemplate;
        }
    } catch (error) {
        console.error("Unable to load header and footer:", error);
    }
}