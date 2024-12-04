import React from "react";

function UserManagement() {
  return (
    <div className="h-full">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          All Users
        </h2>
        <span className="text-lg font-semibold text-logan-black-foreground">
          6
        </span>
      </div>
      <p className="mt-2 text-xs text-logan-black-foreground">
        Manage your Workspace’s Team Members and their role permission here.{" "}
      </p>
    </div>
  );
}

export default UserManagement;
