import { Icon } from "@/components/icons";
import UserManagementTable from "@/components/setting-manager/user-management-table/user-management-table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { iconColors } from "../../../../tailwind.config";
import { AddWorkspaceUserModal } from "./add-workspace-user-modal";

function UserManagement() {
  const [openAddWorkspaceUserModal, setOpenAddWorkspaceUserModal] =
    useState<boolean>(false);
  return (
    <div className="h-full space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          All Users
        </h2>
        <span className="text-lg font-semibold text-logan-black-foreground">
          6
        </span>
      </div>
      <p className="text-xs text-logan-black-foreground">
        Manage your Workspace’s Team Members and their role permission here.{" "}
      </p>
      <div className="!mt-8">
        <UserManagementTable />
      </div>
      <Button
        onClick={() => setOpenAddWorkspaceUserModal(true)}
        variant={"outline"}
        className="!mt-12 flex items-center gap-2 border border-logan-blue hover:bg-white"
      >
        <Icon
          iconName="plus"
          fill={{ from: iconColors.from, to: iconColors.to }}
        />
        <span className="text-logan-blue">Add User</span>
      </Button>
      <AddWorkspaceUserModal
        open={openAddWorkspaceUserModal}
        setOpen={setOpenAddWorkspaceUserModal}
      />
    </div>
  );
}

export default UserManagement;
