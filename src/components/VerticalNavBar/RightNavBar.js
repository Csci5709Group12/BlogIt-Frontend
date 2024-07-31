// Author - Pratik Sakaria (B00954261)
import React from "react";
import { Button } from 'react-bootstrap';
import "./RightNavBar.css";
import { CurrentUserDataContext } from '../../App';
import { useContext } from 'react';
import { checkUserAdminStatus } from '../../api/CommunityAnalysis'; 

function RightNavBar({ community, navigate }) {
  const { currentUserData } = useContext(CurrentUserDataContext);
  console.log("currentUserData (formatted):", JSON.stringify(currentUserData, null, 2));
  const userId = currentUserData?.id;
  console.log("User ID:", userId);

  // Function to check if user is an admin and navigate or alert
  const handleAnalysisClick = async () => {
    if (!userId) {
      alert("User is not authenticated.");
      return;
    }
    
    const onSuccess = (data) => {
      if (data.isAdmin) {
        navigate(`/community/${community._id}/analysis`);
      } else {
        alert("This feature can only be accessed by community admin.");
      }
    };

    const onFailure = (error) => {
      console.error("Error checking admin status:", error);
      alert("An error occurred while checking admin status.");
    };

    checkUserAdminStatus(community._id, userId, onSuccess, onFailure);
  };

  return (
    <div className="right-nav">
      {community ? (
        <>
          <h4 className="right-nav-title">{community.community_name}</h4>
          <p className="right-nav-description">{community.community_desc}</p>

          <Button
            variant="primary"
            className="mt-3"
            onClick={() => navigate(`/create-blog-post?community_id=${community._id}`)}
          >
            Create Post
          </Button>

          <Button 
            onClick={handleAnalysisClick} 
            className="analysis-button"
          >
            Community Analysis
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default RightNavBar;
