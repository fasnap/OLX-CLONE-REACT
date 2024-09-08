import React, { Fragment, useContext, useState } from "react";
import { PostContext } from "../../store/PostContext";
import { AuthContext, FirebaseContext } from "../../store/Context";
import "../Create/Create.css";
import Header from "../Header/Header";
import { firestoredb } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
function Edit() {
  const { postDetails } = useContext(PostContext);
  const { user } = useContext(AuthContext);
  const { storage } = useContext(FirebaseContext);
  const [name, setName] = useState(postDetails.name);
  const [category, setCategory] = useState(postDetails.category);
  const [price, setPrice] = useState(postDetails.price);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(postDetails.imageUrl);
  const navigate=useNavigate()
  const handleEditSubmit = () => {
    const postDocRef = doc(firestoredb, "products", postDetails.id);
    if (image) {
      const imageRef = ref(storage, `/images/${image.name}`);
      uploadBytes(imageRef, image)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((newImageUrl) => {
          console.log("new image url:", newImageUrl);
          return updateDoc(postDocRef, {
            name,
            category,
            price,
            imageUrl: newImageUrl,
          });
        })
        .then(() => {
          console.log("document succesfully updated with new image");
          navigate("/");
        })
        .catch((error) => {
          console.error(
            "error updating document with new image",
            error.message
          );
        });
    } else {
      updateDoc(postDocRef, {
        name,
        category,
        price,
      })
        .then(() => {
          console.log("document successfullt updated without image change");
          navigate("/");
        })
        .catch((error) => {
          console.error("error updating document", error.message);
        });
    }
  };
  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">
          <label htmlFor="fname">Name</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            type="text"
          />
          <br />
          <label htmlFor="fname">Category</label>
          <br />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
            type="text"
            id="fname"
            name="category"
            defaultValue="John"
          />
          <br />
          <label htmlFor="fname">Price</label>
          <br />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input"
            type="number"
            id="fname"
            name="Price"
          />
          <br />
          <br />
          <img
            src={image ? URL.createObjectURL(image) : imageUrl}
            alt="Posts"
            width="200px"
            height="200px"
          />
          <br />
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
          />
          <br />

          <button onClick={handleEditSubmit} className="uploadBtn">
            Update Post
          </button>
        </div>
      </card>
    </Fragment>
  );
}

export default Edit;
