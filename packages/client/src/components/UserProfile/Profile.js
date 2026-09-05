import React, { useState } from "react";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import "./Profile.css";
import SideNavBar from "../SideNavBar/SideNavBar";
import {api} from "../../api/AxiosConfig";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [navBarisToggle, setNavBarisToggle] = useState(false);
  const user = useSelector((state) => state.user);
  const userId = user.user.userId;

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    needs: "",
    wants: "",
    savings: "",
    notificationSubscribed: true
  });

  const [savedProfile, setSavedProfile] = useState(profile);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const fetchUserDetails=async ()=>{
    try{
        const response = await api.get(
            `/user-profile`,{
              withCredentials:true //This tells Axios to send and receive cookies. 
            }
          );
          console.log(response.data);
          const data=response.data
          setProfile({
            name: data.name ?? "",
            address: data.address ?? "",
            needs: data.needs ?? "",
            wants: data.wants ?? "",
            savings: data.savings ?? "",
            notificationSubscribed: data.notificationSubscribed ?? false
          });
    }catch(error){
        console.log(error)
    }
  }

  const handleEdit = () => {
    setSavedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(savedProfile); // Restores values; no changes are saved.
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    // const percentageTotal =
    //   Number(profile.needs) +
    //   Number(profile.wants) +
    //   Number(profile.savings);

    // if (percentageTotal !== 100) {
    //   alert("Needs, Wants and Savings must add up to 100%.");
    //   return;
    // }

    try{
        // profile["id"]=userId;
        await api.put(
            `/user-profile`,profile,{
              withCredentials:true //This tells Axios to send and receive cookies. 
            }
          );
    }catch(error){
        console.log(error)
    }
    setSavedProfile(profile);
    setIsEditing(false);
    alert("Profile saved successfully.");
    fetchUserDetails();
  };

  const toggleNotification = () => {
    setProfile((current) => ({
      ...current,
      notificationSubscribed: !current.notificationSubscribed
    }));

    // TODO: Connect subscribe / unsubscribe notification API here.
  };

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
};

useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <main className="profile-page">
                <div className="navBar">
                <SideNavBar isToggle={setNavBarTogggle} />
            </div>

            {navBarisToggle && <div className="Model"></div>}
      <section className="profile-card">
        <div className="profile-banner">
          <div className="profile-avatar">
            {profile.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="profile-title">
            <span className="eyebrow">ACCOUNT SETTINGS</span>
            <h1>{profile.name}</h1>
            <p>Manage your account and budget preferences.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <h3>Personal Information</h3>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">User Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group address-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <h3 className="budget-heading">Budget Preferences</h3>

          <div className="form-grid budget-grid">
            <div className="form-group">
              <label htmlFor="needs">Needs (%)</label>
              <input
                id="needs"
                name="needs"
                type="number"
                min="0"
                max="100000"
                value={profile.needs}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="wants">Wants (%)</label>
              <input
                id="wants"
                name="wants"
                type="number"
                min="0"
                max="100000"
                value={profile.wants}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="savings">Savings (%)</label>
              <input
                id="savings"
                name="savings"
                type="number"
                min="0"
                max="100000"
                value={profile.savings}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="notification-card">
            <div>
              <h4>🔔 Notifications</h4>
              <p>
                {profile.notificationSubscribed
                  ? "You are subscribed to financial reminders."
                  : "Subscribe to receive financial reminders."}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleNotification}
              disabled={!isEditing}
              className={
                profile.notificationSubscribed
                  ? "unsubscribe-btn"
                  : "subscribe-btn"
              }
            >
              {profile.notificationSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button type="button" className="edit-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};

export default Profile;