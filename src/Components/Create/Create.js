import React, { Fragment, useContext, useState } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { FirebaseContext, AuthContext } from "../../store/Context";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestoredb } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const Create = () => {
  const { storage } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const date = new Date();
  const navigate = useNavigate();
  const handleSubmit = () => {
    console.log("File type:", image?.type);
    console.log("File size:", image?.size);

    if (image) {
      const imageRef = ref(storage, `/images/${image.name}`);
      uploadBytes(imageRef, image)
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((url) => {
          console.log("image url", url);
          return addDoc(collection(firestoredb, "products"), {
            name: name,
            category: category,
            price: price,
            imageUrl: url,
            userId: user.uid,
            createdAt: date.toDateString(),
          });
        })
        .then(() => {
          console.log("Document successfully uploaded!");
          navigate("/");
        })
        .catch((error) => {
          console.error("Error uploading file", error.code, error.message);
        });
    } else {
      console.log("No image selected");
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
            id="fname"
            name="Name"
            defaultValue="John"
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
            src={image ? URL.createObjectURL(image) : ""}
            alt="Posts"
            width="200px"
            height="200px"
          ></img>
          <br />
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
          />
          <br />

          <button onClick={handleSubmit} className="uploadBtn">
            upload and Submit
          </button>
        </div>
      </card>
    </Fragment>
  );
};

export default Create;
