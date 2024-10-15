import React from "react";
import UserData from "./UserData";
import Password from "./Password";
import NotificationPreference from "./NotificationPreference";

function UserSettings({ activeTab }) {
  return (
    <div className="h-full w-[45rem] overflow-y-scroll">
      {activeTab === "myAccount" && <UserData />}

      {/* Password Section */}
      {activeTab === "password" && <Password />}

      {/* Communication Preferences Section */}
      {activeTab === "communication" && <NotificationPreference />}
    </div>
  );
}

export default UserSettings;
