import { createContext, useState } from "react";
export const mynameContext =createContext(null)
export const PostContext = createContext(null);
function Post({ children }) {
  const [postDetails, setPostDetails] = useState();
  return (
    <PostContext.Provider value={{ postDetails, setPostDetails }}>
      {children}
    </PostContext.Provider>
  );
}

export default Post;
