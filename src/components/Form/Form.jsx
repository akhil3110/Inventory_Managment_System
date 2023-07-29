<div key={product._id} className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          <div className="relative w-[50%] my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="p-8 border-0 rounded-lg shadow-lg relative flex flex-col w-ful bg-zinc-300 outline-none focus:outline-none">
                              {/*header*/}
                              <div className="flex items-start justify-between  p-5 border-b border-solid border-slate-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                  Edit Details
                                </h3>
                                <button
                                  onClick={() => setShowEditModal(false)}
                                >
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
                <label className="block mb-2 ">Product Slug:</label>
                <input
                  onChange={handleEditChange}
                  type="text"
                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                  placeholder={product.slug}
                  name="slug"
                  value={editForm?.slug || "" }
                />

                <label className="block mb-2">Quantity:</label>
                <input
                  onChange={handleEditChange}
                  type="number"
                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                  placeholder={product.quantity}
                  name="quantity"
                  value={editForm?.quantity || ""}
                />

                <label className="block mb-2">Price:</label>
                <input
                  onChange={handleEditChange}
                  type="number"
                  className="px-4 py-2 mb-2 w-full border border-gray-400 rounded"
                  placeholder={product.price}
                  name="price"
                  value={editForm?.price || ""}
                />

                               </form>
                              {/*footer*/}
                              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                  className="bg-white hover:bg-gray-300 text-gray-800 border border-gray-400 rounded shadow font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() =>{
                                      setShowEditModal(false)
                                      setEditForm({})
                                    }
                                  }
                                >
                                  Close
                                </button>
                                <button
                                  disabled={deleteLoading}
                                  className="bg-red-600 hover:bg-red-700 text-white  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => editProduct(product._id)}
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>