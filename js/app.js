const wrapperEl = document.querySelector(".products__control");
const loadingEl = document.querySelector(".loading");
const btnSeemore = document.querySelector(".products__btn");
// const collectionEl = document.querySelector(".collection");
// const categoryLoadingEl = document.querySelector(".category__loading");
const searchInputEl = document.querySelector(".nav__form__input");
const searchDropEl = document.querySelector(".search__drop");

const BASE_URL = "https://dummyjson.com";

const perPageCount = 5;
let offset = 0;
let productEndpoint = "/products";
let data = [];
// PRODUCT FETCH
async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  response
    .json()
    .then((res) => {
      createCard(res);
      data = [...data, ...res.products];
      if (res.total <= perPageCount + offset * perPageCount) {
        btnSeemore.style.display = "none";
      } else {
        btnSeemore.style.display = "block";
      }
    })
    .catch((err) => console.log(err))
    .finally(() => {
      loadingEl.style.display = "none";
      btnSeemore.removeAttribute("disabled");
      btnSeemore.textContent = "See more";
    });
}

// CARD CREATOR
function createCard(data) {
  // while(wrapperEl.firstChild){
  //     wrapperEl.firstChild.remove()
  // }
  let fragment = document.createDocumentFragment();
  data.products.forEach((product) => {
    const divEl = document.createElement("div");
    divEl.className = "products__card";
    divEl.dataset.id = product.id;
    divEl.innerHTML = `
           <div class="products__img">
                <img data-id=${product.id} src=${product.thumbnail} alt="${product.title}"/>
                <img
                  class="products__like"
                  src="./assent/products-like.svg"
                  alt=""
                />
                <img
                  class="products__glaza"
                  src="./assent/products-glaza.svg"
                  alt=""
                />
              </div>
              <div class="products__sercall__info">
                <p>${product.title}</p>
                <div class="products__price">
                  <span class="products__price1">${product.price}</span>
                  <div class="products__price__star">
                    <img src="./assent/products-star.svg" alt="" />
                    <img src="./assent/products-star.svg" alt="" />
                    <img src="./assent/products-star.svg" alt="" />
                    <img src="./assent/products-star.svg" alt="" />
                    <img src="./assent/products-star.svg" alt="" />
                  </div>
                  <span class="products__price2">(325)</span>
                </div>
              </div>
        `;
    wrapperEl.appendChild(divEl);
  });
  wrapperEl.appendChild(fragment);
}

// SAYT YUKLANGANDA ISHLAYDI
window.addEventListener("load", () => {
  collectionEl.style.display = "none";
  createLoading(perPageCount);
  fetchData(`${productEndpoint}?limit=${perPageCount}`);
  fetchCategory("/products/category-list");
});

// LOADING CREATOR
function createLoading(n) {
  loadingEl.style.display = "grid";
  loadingEl.innerHTML = null;
  Array(n)
    .fill()
    .forEach(() => {
      const div = document.createElement("div");
      div.className = "loading__item";
      div.innerHTML = `
            <div class="loading__image to-left"></div>
            <div class="loading__title to-left"></div>
            <div class="loading__title to-left"></div>
        `;
      loadingEl.appendChild(div);
    });
}

// SEE MORE
btnSeemore.addEventListener("click", () => {
  btnSeemore.setAttribute("disabled", true);
  btnSeemore.textContent = "Loading...";
  createLoading(perPageCount);
  offset++;

  // window.scrollTo(0, document.documentElement.scrollHeight);

  fetchData(
    `${productEndpoint}?limit=${perPageCount}&skip=${offset * perPageCount}`
  );
});

// CATEGORY FETCH
async function fetchCategory(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  response
    .json()
    .then((res) => {
      createCategory(res);
    })
    .catch()
    .finally(() => {
      categoryLoadingEl.style.display = "none";
      collectionEl.style.display = "flex";
    });
}

// CATEGORY CREATOR
function createCategory(data) {
  ["all", ...data].forEach((category) => {
    const listEl = document.createElement("li");
    listEl.className = category === "all" ? "item active" : "item";
    listEl.dataset.category =
      category === "all" ? "/products" : `/products/category/${category}`;
    listEl.textContent = category;
    collectionEl.appendChild(listEl);
    listEl.addEventListener("click", (e) => {
      let endpoint = e.target.dataset.category;

      productEndpoint = endpoint;
      offset = 0;
      wrapperEl.innerHTML = null;
      createLoading(perPageCount);
      fetchData(`${endpoint}?limit=${perPageCount}`);
      document.querySelectorAll(".collection .item").forEach((i) => {
        i.classList.remove("active");
      });
      e.target.classList.add("active");
    });
  });
}

// EVENT DELEGATION
wrapperEl.addEventListener("click", (e) => {
  let element = e.target;
  let id = element.closest(".card").dataset.id;
  if (e.target.tagName === "IMG") {
    open(`/pages/product.html?id=${id}`, "_self");
  } else if (element.name === "like-btn") {
    const wish = data.find((item) => item.id === +id);
    console.log(wish);
  }
});

// SEARCH
searchInputEl.addEventListener("keyup", async (e) => {
  const value = e.target.value.trim();
  if (value) {
    searchDropEl.style.display = "block";
    const response = await fetch(
      `${BASE_URL}/products/search?q=${value}&limit=5`
    );
    response
      .json()
      .then((res) => {
        searchDropEl.innerHTML = null;
        res.products.forEach((item) => {
          const divEl = document.createElement("div");
          divEl.className = "search__item";
          divEl.dataset.id = item.id;
          divEl.innerHTML = `
                    <img src=${item.thumbnail} alt="">
                    <div>
                         <p>${item.title}</p>
                    </div>
                    `;
          searchDropEl.appendChild(divEl);
        });
      })
      .catch((err) => console.log(err));
  } else {
    searchDropEl.style.display = "none";
  }
});

// DETAIL PAGE BY SEARCH
searchDropEl.addEventListener("click", (e) => {
  if (e.target.closest(".search__item")?.className === "search__item") {
    const id = e.target.closest(".search__item").dataset.id;
    open(`/pages/product.html?id=${id}`, "_self");
    searchInputEl.value = "";
  }
});
