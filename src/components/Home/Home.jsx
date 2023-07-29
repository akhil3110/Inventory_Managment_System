import { useState, useEffect, useRef } from "react";
import "./Home.css";
import Header from "../Header/Header";
import { DownloadTableExcel } from "react-export-table-to-excel";



function Home() {
  const tableRef = useRef(null);
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dropDown, setDropDown] = useState([]);
  const [editForm, setEditForm] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://inventrot-managment-system.onrender.com/api/inventory", {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      let rjson = await response.json();
      setProducts(rjson.products);
    };

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://inventrot-managment-system.onrender.com/api/inventory/addSlug",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(productForm),
        }
      );

      if (response.status == 200) {
        console.log("Product added!");
        setProductForm({});
      } else {
        console.log("Error adding product");
      }
    } catch (error) {
      console.log(error);
    }
    const response = await fetch("https://inventrot-managment-system.onrender.com/api/inventory", {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  const editProduct = async (id) => {
    try {
      
      const response = await fetch(
        `https://inventrot-managment-system.onrender.com/api/inventory/updateSlug/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(editForm),
        }
      );
        setDropDown([])
      if (response.status == 200) {
        console.log("Product Edited!");
      } else {
        console.log("Error Editing product");
      }
    } catch (error) {
      console.log(error);
    }
    const response = await fetch("https://inventrot-managment-system.onrender.com/api/inventory", {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let rjson = await response.json();
    setProducts(rjson.products);
    setShowEditModal(false);
  };

  const handleChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      setLoading(true);
      setDropDown([]);
      const response = await fetch(
        `https://inventrot-managment-system.onrender.com/api/inventory/search?slug=${query}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      let rjson = await response.json();
      setDropDown(rjson.products);
      setLoading(false);
    } else {
      console.log("query length is less than 2");
      setDropDown([]);
      console.log(dropDown);
    }
  };

  const buttonAction = async (action, slug, initialQuantiy) => {
    //immedeately update the product quantity in products array
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantiy) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantiy) - 1;
    }
    setProducts(newProducts);

    //immedeately update the product quantity in dropdows array
    let indexDrop = dropDown.findIndex((item) => item.slug == slug);
    let newDropDown = JSON.parse(JSON.stringify(dropDown));
    if (action == "plus") {
      newDropDown[indexDrop].quantity = parseInt(initialQuantiy) + 1;
    } else {
      newDropDown[indexDrop].quantity = parseInt(initialQuantiy) - 1;
    }
    setDropDown(newDropDown);

    console.log(action, slug, initialQuantiy);
    setLoadingAction(true);

    const response = await fetch("https://inventrot-managment-system.onrender.com/api/inventory/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ action, slug, initialQuantiy }),
    });

    let rjson = await response.json();
    console.log(rjson);
    setLoadingAction(false);
  };

  const deleteItem = async (id) => {
    try {
      if (!deleteLoading) {
        setDeleteLoading(true);
        setShowDeleteModal(true);
        const response = await fetch(
          `https://inventrot-managment-system.onrender.com/api/inventory/deleteSlug/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        let rjson = await response.json();
        console.log(rjson);
        setDeleteLoading(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
    }
    const response = await fetch("https://inventrot-managment-system.onrender.com/api/inventory", {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  

  return (
    <>
      {localStorage.getItem("token") ? (
        <div>
          <Header />
          <div className="container mx-auto p-2  rounded-lg my-8">
            <h1 className="text-3xl font-semibold mt-4">Search a Product</h1>
            <div className="mt-4 flex items-center mb-2">
              <input
                onChange={onDropdownEdit}
                type="text"
                className="flex-grow px-4 py-2 mr-2 border border-gray-400 rounded"
                placeholder="Enter search query"
                name="query"
                value={query || ""}
              />
            </div>
            {loading && (
              <div className="loader">
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__ball"></div>
              </div>
            )}
            <div className="container absolute mx-auto w-[99%]  bg-purple-100 rounded-md ">
              {dropDown.map((item) => {
                return (
                  <div
                    className="container flex  justify-between my-1 p-2  border-gray-400 border-b-2"
                    key={item._id}
                  >
                    <span className="slug">
                      {item.slug} ({item.quantity} pieces availabe at rate of{" "}
                      {item.price})
                    </span>
                    <div className="">
                      <button
                        onClick={() =>
                          buttonAction("minus", item.slug, item.quantity)
                        }
                        disabled={loadingAction}
                        className="subtract p-2 bg-purple-500  hover:bg-purple-700 text-white font-bold mx-2 cursor-pointer text-lg disabled:bg-purple-300 rounded-full"
                      >
                        -
                      </button>
                      <span className="quantity mx-1 text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          buttonAction("plus", item.slug, item.quantity)
                        }
                        disabled={loadingAction}
                        className="add mx-2  p-2 bg-purple-500 hover:bg-purple-700 text-white font-bold cursor-pointer text-lg rounded-full disabled:bg-purple-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          setEditForm({
                              product_id: item._id,
                              slug: item.slug,
                              quantity: item.quantity,
                              price: item.price,
                            })
                          setShowEditModal(true);
                        }}
                        disabled={loadingAction}
                        className="add mx-2  p-2 bg-purple-500 hover:bg-purple-700 text-white font-bold cursor-pointer text-lg rounded-full disabled:bg-purple-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 512 512"
                        >
                          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="container mx-auto p-2 mt-6 rounded-lg">
            <h1 className="text-3xl font-semibold mt-4">Add A Product</h1>
            <div>
              <form className="mt-4">
                <label className="block mb-2 ">Product Slug:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                  placeholder="Enter product name"
                  name="slug"
                  value={productForm?.slug || ""}
                />

                <label className="block mb-2">Quantity:</label>
                <input
                  onChange={handleChange}
                  type="number"
                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                  placeholder="Enter quantity"
                  name="quantity"
                  value={productForm?.quantity || ""}
                />

                <label className="block mb-2">Price:</label>
                <input
                  onChange={handleChange}
                  type="number"
                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                  placeholder="Enter price"
                  name="price"
                  value={productForm?.price || ""}
                />

                <button
                  onClick={addProduct}
                  type="button"
                  className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
                >
                  Add Product
                </button>
              </form>
            </div>
          </div>

          <div className="container  mx-auto p-4 rounded-lg my-8 max-sm:my-0">
            <div className="flex flex-row mt-4 justify-between">
              <div>
                <h1 className="text-3xl font-semibold ">Current Stock</h1>
              </div>
              <div>
                <DownloadTableExcel
                  filename="ProdutsData"
                  sheet="Products"
                  currentTableRef={tableRef.current}
                >
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex flex-row gap-2">
                    <svg
                      className="download-icon"
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="download-arrow"
                        d="M13 9L9 13M9 13L5 9M9 13V1"
                        stroke="#F2F2F2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 17V18C1 18.7956 1.31607 19.5587 1.87868 20.1213C2.44129 20.6839 3.20435 21 4 21H14C14.7956 21 15.5587 20.6839 16.1213 20.1213C16.6839 19.5587 17 18.7956 17 18V17"
                        stroke="#F2F2F2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Download Excel
                  </button>
                </DownloadTableExcel>
              </div>
            </div>

            <table
              ref={tableRef}
              className="table-auto border-collapse border border-gray-400 mt-4  w-full"
            >
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2 max-sm:w-[40%]">
                    Product Name
                  </th>
                  <th className="border border-gray-400 px-4 py-2 max-sm:w-[20%]">
                    Quantity
                  </th>
                  <th className="border border-gray-400 px-4 py-2 max-sm:w-[20%]">
                    Price
                  </th>
                  <th className="border border-gray-400 px-4 py-2 w-12 max-sm:w-[20%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                    <tr key={product._id}>
                      <td className="border border-gray-400 px-4 py-2 ">
                        {product.slug}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 ">
                        {product.quantity}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 ">
                        ₹{product.price}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 ">
                        <button
                          className="mx-1"
                          type="button"
                          onClick={() =>{
                            setEditForm({
                              product_id: product._id,
                              slug: product.slug,
                              quantity: product.quantity,
                              price: product.price,
                            })
                            console.log(editForm)
                            setShowEditModal(true)

                            }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 512 512"
                          >
                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                          </svg>
                        </button>
                        <button
                          className="mx-1"
                          type="button"
                          onClick={() =>{
                          deleteItem(product._id)
                          setShowDeleteModal(true)}}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            viewBox="0 0 448 512"
                          >
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                        </button>
                        {showEditModal && (
                      <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="p-8 border-0 rounded-lg shadow-lg relative flex flex-col w-ful bg-zinc-300 outline-none focus:outline-none">
                              {/*header*/}
                              <div className="flex items-start justify-between  p-5 border-b border-solid border-slate-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                  Edit Details
                                </h3>
                                <button onClick={() => setShowEditModal(false)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="2em"
                                    viewBox="0 0 512 512"
                                  >
                                    <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm175 79c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                                  </svg>
                                </button>
                              </div>
                              {/* body */}
                              <form className="mt-4 ">
                                <label className="block mb-2 ">
                                  Product Slug:
                                </label>
                                <input
                                  onChange={handleEditChange}
                                  type="text"
                                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                                  placeholder={editForm.slug}
                                  name="slug"
                                  value={editForm?.slug || ""}
                                />

                                <label className="block mb-2">Quantity:</label>
                                <input
                                  onChange={handleEditChange}
                                  type="number"
                                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                                  placeholder={editForm.quantity}
                                  name="quantity"
                                  value={editForm?.quantity || ""}
                                />

                                <label className="block mb-2">Price:</label>
                                <input
                                  onChange={handleEditChange}
                                  type="number"
                                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                                  placeholder={editForm.price}
                                  name="price"
                                  value={editForm?.price || ""}
                                />
                              </form>
                              {/*footer*/}
                              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                  className="bg-white hover:bg-gray-300 text-gray-800 border border-gray-400 rounded shadow font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => {
                                    setShowEditModal(false);
                                    setEditForm({});
                                  }}
                                >
                                  Close
                                </button>
                                <button
                                  disabled={deleteLoading}
                                  className="bg-red-600 hover:bg-red-700 text-white  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => editProduct(editForm.product_id)}
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-2 mt-6 rounded-lg">
          <h1 className="text-3xl font-semibold mt-4">Login First</h1>
        </div>
      )}
    </>
  );
}

export default Home;
