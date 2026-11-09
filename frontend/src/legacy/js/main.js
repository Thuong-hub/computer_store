function saleTypeLabel(type) {
    switch (String(type || "").toUpperCase()) {
        case "BLACK_FRIDAY": return "BLACK FRIDAY";
        case "BESTSELLER": return "BESTSELLER";
        case "SALE": return "SALE";
        case "NEW_PRODUCT": return "SẢN PHẨM MỚI";
        default: return "ƯU ĐÃI";
    }
}

let mainSalePrices = new Map();
 
 
 

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedProducts();

    setupSearch();
});


 
 
 

async function loadFeaturedProducts() {

    const container =
        document.getElementById("featuredProducts");

    if (!container) {
        return;
    }


    try {

        const data =
            await window.api.getProducts();

        let products = [];

        if (Array.isArray(data)) {

            products = data;

        } else if (
            data &&
            Array.isArray(data.content)
        ) {

            products = data.content;

        } else if (
            data &&
            Array.isArray(data.products)
        ) {

            products = data.products;
        }


         
        if (products.length === 0) {

            container.innerHTML = `
                <p>
                    Hiện chưa có sản phẩm.
                </p>
            `;

            return;
        }


        



        try {
            const prices = await window.api.request("/api/pricing/products");
            mainSalePrices = new Map(prices.map(p => [Number(p.productId), p]));
        } catch (error) {
            console.warn("Không tải được giá khuyến mãi", error);
        }

        const featuredProducts =
            products.slice(0, 8);


        container.innerHTML =
            featuredProducts
                .map(product =>
                    createProductCard(product)
                )
                .join("");


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Không thể tải sản phẩm.
            </p>
        `;
    }
}


 
 
 

function createProductCard(product) {

    const productId =
        product.productId ??
        product.id;


    const name =
        product.name ??
        "Sản phẩm";


    const price = Number(product.price || 0);
    const sale = mainSalePrices.get(Number(productId));
    const percent = Number(sale?.discountPercent || 0);
    const effective = Number(sale?.effectivePrice ?? price);


    const stock =
        product.stockQuantity ?? 0;


    const imageUrl =
        normalizeImageUrl(
            product.imageUrl
        );


    return `
        <div class="product-card">

            <a
                href="/pages/product-detail.html?id=${productId}"
                class="product-image"
            >

                ${
                    imageUrl
                        ? `
                            <img
                                src="${imageUrl}"
                                alt="${escapeHtml(name)}"
                                onerror="
                                    this.style.display='none';
                                    this.nextElementSibling.style.display='flex';
                                "
                            >

                            <div
                                class="product-image-fallback"
                                style="
                                    display:none;
                                    width:100%;
                                    height:100%;
                                    align-items:center;
                                    justify-content:center;
                                    color:#9ca3af;
                                    font-weight:700;
                                "
                            >
                                NO IMAGE
                            </div>
                        `
                        : `
                            <div
                                style="
                                    width:100%;
                                    height:100%;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    color:#9ca3af;
                                    font-weight:700;
                                "
                            >
                                NO IMAGE
                            </div>
                        `
                }

            </a>


            <div class="product-info">

                <p class="product-category">
                    ${
                        stock > 0
                            ? `Còn ${stock} sản phẩm`
                            : "Hết hàng"
                    }
                </p>


                <a
                    href="/pages/product-detail.html?id=${productId}"
                    class="product-name"
                >
                    ${escapeHtml(name)}
                </a>


                <div class="product-price">
                    ${percent > 0 ? `<span class="sale-current-price">${formatCurrency(effective)}</span>
                    <del class="sale-original-price">${formatCurrency(price)}</del>
                    <span class="sale-product-badge">${saleTypeLabel(sale?.discountType)} -${percent}%</span>`
                    : formatCurrency(price)}
                </div>


                <div class="product-actions">

                    <a
                        href="/pages/product-detail.html?id=${productId}"
                    >
                        Xem chi tiết
                    </a>

                </div>

            </div>

        </div>
    `;
}


 
 
 

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "vi-VN",
        {
            style: "currency",
            currency: "VND"
        }
    ).format(value);
}


 
 
 

function normalizeImageUrl(imageUrl) {

    if (!imageUrl) {
        return null;
    }

    const path =
        String(imageUrl)
            .replaceAll("\\", "/")
            .trim();

    if (
        path.startsWith("http://")
        ||
        path.startsWith("https://")
    ) {
        return path;
    }

    if (
        path.startsWith("/images/products/")
    ) {
        return path;
    }

    if (
        path.startsWith("images/products/")
    ) {
        return `/${path}`;
    }

    if (
        path.startsWith("/static/images/products/")
    ) {
        return path.replace(
            "/static/images/products/",
            "/images/products/"
        );
    }

    if (
        path.startsWith("static/images/products/")
    ) {
        return path.replace(
            "static/images/products/",
            "/images/products/"
        );
    }

    return `/images/products/${path.split("/").pop()}`;
}


 
 
 

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    const searchButton =
        document.getElementById("searchButton");


    if (!searchInput || !searchButton) {
        return;
    }


    function search() {

        const keyword =
            searchInput.value.trim();


        if (!keyword) {
            return;
        }


        window.location.href =
            `/pages/products.html?keyword=${encodeURIComponent(keyword)}`;
    }


    searchButton.addEventListener(
        "click",
        search
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                search();
            }
        }
    );
}


 
 
 

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}