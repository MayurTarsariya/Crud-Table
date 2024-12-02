const product = [];
const randomColor = () => {
    return `#${Math.random().toString(16).slice(2, 8).padEnd(6, 0)}`;
};
let dataTable = document.querySelector(".data_table");
let create_form = document.querySelector(".create_form");
let update_form = document.querySelector(".update_form");
let addbtn = document.querySelector(".add_div");
let search_div = document.querySelector(".search_div");
let currentEditIndex = null;

document.querySelector(".add_div").addEventListener("click", () => {
    create_form.style.display = "block";
    addbtn.style.display = "none";
    search_div.style.display = "none";
});

document.querySelector(".create").addEventListener("click", (e) => {
    e.preventDefault();
    let productName = document.querySelector(".name").value.toLowerCase();
    let productPrice = document.querySelector(".price").value;
    let productQuantity = document.querySelector(".quantity").value;
    if (productName === "" || productPrice === "" || productQuantity === "") {
        alert("Please, fill out all the fields");
    } else if (product.some((p) => p.productName === productName)) {
        alert(`${productName} already exists.`);
        document.querySelector(".name").value = "";
        document.querySelector(".price").value = "";
        document.querySelector(".quantity").value = "";
    } else {
        let newObj = {
            productName: productName,
            Price: productPrice,
            Quantity: productQuantity,
        };
        create_form.style.display = "none";
        addbtn.style.display = "block";
        search_div.style.display = "block";
        product.push(newObj);
        localData();
        document.querySelector(".name").value = "";
        document.querySelector(".price").value = "";
        document.querySelector(".quantity").value = "";
    }
});
document.querySelector(".update").addEventListener("click", (e) => {
    e.preventDefault();
    if (currentEditIndex !== null) {
        let productName = document.querySelector(".uname").value.toLowerCase();
        let productPrice = document.querySelector(".uprice").value;
        let productQuantity = document.querySelector(".uquantity").value;
        let currentProduct = product[currentEditIndex];
        let isDuplicate = product.find((p, index) => {
            if (index !== currentEditIndex) {
                if (p.productName === productName) {
                    return true;
                }
            }
            return false;
        });
        if (isDuplicate) {
            alert(`${productName} is already exist.`);
        } else if (
            productName === currentProduct.productName &&
            productPrice === currentProduct.Price &&
            productQuantity === currentProduct.Quantity
        ) {
            alert(`Please update item`);
        } else {
            product[currentEditIndex].productName = productName;
            product[currentEditIndex].Price = productPrice;
            product[currentEditIndex].Quantity = productQuantity;
            alert("Item updated successfully");
            update_form.style.display = "none";
            addbtn.style.display = "block";
            search_div.style.display = "block";
            localData();
        }
    }
});

const localData = () => {
    localStorage.setItem("data", JSON.stringify(product));
    sessionStorage.setItem("data", JSON.stringify(product));
    document.cookie = `data=${JSON.stringify(product)}`;
    JSON.parse(localStorage.getItem("data"));
    let elements = "";
    product.map((data, index) => {
        const bgColor = randomColor();
        elements += `<tr style="background-color : ${bgColor}">
                        <td>${data.productName}</td>
                        <td>${data.Price}</td>
                        <td>${data.Quantity}</td>
                        <td>
                        <i class="fa-solid fa-pen-to-square" data-index="${index}"></i>
                        <i class="fa-solid fa-trash" data-index="${index}"></i>
                        </td>
                        </tr>`;
    });
    dataTable.innerHTML = elements;
    document.querySelectorAll(".fa-pen-to-square").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            update_form.style.display = "block";
            addbtn.style.display = "none";
            search_div.style.display = "none";
            currentEditIndex = Number(e.target.dataset.index);
            let obj = product[currentEditIndex];
            document.querySelector(".uname").value = obj.productName;
            document.querySelector(".uprice").value = obj.Price;
            document.querySelector(".uquantity").value = obj.Quantity;
        });
    });
    document.querySelectorAll(".fa-trash").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            product.splice(index, 1); // Remove the item from the product array
            localData(); // Update local storage and UI
        });
    });
};

document.querySelector(".searchBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let search = document.querySelector(".search").value.toLowerCase();
    if (search === "") {
        alert("Enter a item For Search");
    } else {
        let found = false;
        product.forEach((p, index) => {
            let row = dataTable.rows[index];
            if (p.productName === search) {
                alert(
                    `Matched row number is : ${index + 1} \nItem name is : ${p.productName
                    }\nItem price is : ${p.Price} \nItem Quantity is : ${p.Quantity
                    } \nYour searched itms row's background color is white, row no : ${index + 1
                    }`
                );
                row.style.backgroundColor = "white";
                found = true;
                document.querySelector(".search").value = "";
            }
        });
        if (!found) {
            alert(`${search} is not found`);
            document.querySelector(".search").value = "";
        }
    }
});

// Function to load data from storage and update product array
const loadDataFromStorage = () => {
    const storedData =
        localStorage.getItem("data") || sessionStorage.getItem("data");
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        product.length = 0; // Clear the current product array
        Array.prototype.push.apply(product, parsedData); // Append the stored data to product array
        localData(); // Update the table with the current product data
    }
};
// console.log(product);
// Call the function to load data when the page loads
document.addEventListener("DOMContentLoaded", loadDataFromStorage);
