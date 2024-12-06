import { Icon } from "@/components/icons";
import UserManagementTable from "@/components/setting-manager/user-management-table/user-management-table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { iconColors } from "../../../../tailwind.config";
import { AddWorkspaceUserModal } from "./add-workspace-user-modal";
import axiosInstance, { endpoints } from "@/lib/axios";
import { useFetcher } from "@/hooks/use-fetcher";
import { workSpaceUserDetailType } from "@/components/setting-manager/types";
import { ShimmerTable } from "@/components/loading-screen/shimmer-table";

const fetchWorkSpaceUserList = async (): Promise<{
  data: workSpaceUserDetailType[];
  status: string;
}> => {
  const res = await axiosInstance.get(endpoints.workspace.workspaceUsers);
  return res.data;
};

function UserManagement() {
  const { data, refetch } = useFetcher(fetchWorkSpaceUserList, []);
  const [openAddWorkspaceUserModal, setOpenAddWorkspaceUserModal] =
    useState<boolean>(false);

  const closeModalActions = () => {
    refetch();
  };

  return (
    <div className="h-full space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold leading-none tracking-tight">
          All Users
        </h2>
        <span className="text-lg font-semibold text-logan-black-foreground">
          {data?.data?.length ?? 0}
        </span>
      </div>
      <p className="text-xs text-logan-black-foreground">
        Manage your Workspace's Team Members and their role permission here.{" "}
      </p>
      <div className="!mt-8">
        {data?.data ? (
          <UserManagementTable data={data?.data} />
        ) : (
          <ShimmerTable cols={5} rows={1} />
        )}
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
        closeModalActions={closeModalActions}
      />
    </div>
  );
}
export default UserManagement;
