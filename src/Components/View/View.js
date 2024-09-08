import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./View.css";
import { PostContext } from "../../store/PostContext";
import { FirebaseContext, AuthContext } from "../../store/Context";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestoredb } from "../../firebase/config";
import Modal from "../Modal/Modal";

function View() {
  const [userDetails, setUserDetails] = useState();
  const { postDetails } = useContext(PostContext);
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirmDeleteModal,setShowConfirmDeleteModal]=useState(false)
  useEffect(() => {
    if (postDetails && postDetails.userId) {
      const { userId } = postDetails;
      const productsCollection = query(
        collection(firestoredb, "users"),
        where("id", "==", userId)
      );
      getDocs(productsCollection).then((res) => {
        res.forEach((doc) => {
          console.log("User Details:", doc.data());
          setUserDetails(doc.data());
        });
      });
    }
  }, []);
  const handleEdit = () => {
    navigate("/edit");
  };
  const handleDelete = () => {
    const postDocRef = doc(firestoredb, "products", postDetails.id);
    deleteDoc(postDocRef)
      .then(() => {
        console.log("delete success");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error deleting document ", error.message);
      });
  };
  return (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img src={postDetails.imageUrl} alt="" />
      </div>
      <div className="rightSection">
        <span className="goback" onClick={() => navigate("/")}>
          &larr;Go back
        </span>
        <div className="productDetails">
          <p>&#x20B9; {postDetails.price} </p>
          <span>{postDetails.name}</span>
          <p>{postDetails.category}</p>
          <span>{postDetails.createdAt}</span>
        </div>
        {userDetails && (
          <div className="contactDetails">
            <p>Seller details</p>
            <p>{userDetails.username}</p>
            <p>{userDetails.phone}</p>
          </div>
        )}
        <br />
        {user && postDetails.userId === user.uid && (
          <div className="postEditDelete">
            <span className="postEdit" onClick={handleEdit}>
              Edit
            </span>
            <span
              className="postDelete"
              onClick={() => setShowConfirmDeleteModal(true)}
            >
              {" "}
              Delete
            </span>
          </div>
        )}
      </div>
      {showConfirmDeleteModal && (
        <Modal
          show={showConfirmDeleteModal}
          onClose={() => setShowConfirmDeleteModal(false)}
          onConfirm={() => {
            handleDelete();
            setShowConfirmDeleteModal(false);
          }}
          title="Confirm Delete"
          message="Are you sure want to delete this item?"
        />
      )}
    </div>
  );
}
export default View;
