import { getFolderDetails } from "@/api/serverSideServiceActions/dashboardServiceActions";
import { getFolderDetailsUrl } from "@/api/serviceUrl";
import Directory from "@/components/dashboard/Navigation/Directory";
import RecentDocuments from "@/components/dashboard/Navigation/RecentDocuments";
import React from "react";

async function Page({ params: { slug } }) {
  const folderData = await getFolderDetails({ id: slug[slug.length - 1] });

  // const appDispatch = useDispatch();
  // const pathname = usePathname();
  // const router = useRouter();
  // const { folderListView } = useSelector(
  //   (state) => state.folderNavigationReducer
  // );

  // const { data, error, isLoading } = useSWR(
  //   [`${getFolderDataUrl}${slug[slug?.length - 1]}`],
  //   getClientFolderList,
  //   {
  //     shouldRetryOnError: false,
  //     revalidateOnFocus: false,
  //   }
  // );
  // const [listData, setListData] = useState([
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Blphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  //   {
  //     folderName: "Alphinix Inc.",
  //     lastModified: "Last modified on 10-24-2023 at 9:27 am",
  //     folders: [
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //       "Internal Restructuring",
  //     ],
  //   },
  // ]);
  // const [folderList, setFolderList] = useState([]);
  // const [documentList, setDocumentList] = useState([]);
  return (
    <main
      className={
        "flex w-full flex-1 overflow-hidden rounded-tl-lg border-[0.063rem]  border-secondary-blue bg-six pr-3"
      }
    >
      <div className=" my-4 flex flex-col gap-6 overflow-y-auto px-6 ">
        {slug?.length == 1 && <RecentDocuments />}
        {/* <div className="flex flex-col gap-1 w-full">
          {!folderListView && folderList?.length > 0 && (
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-black ">Folders</h2>

              <Sort
                onClickSort={(sortOrder) => {
                  setListData(
                    sortStringTableList(listData, sortOrder, "folderName")
                  );
                }}
                title={"Name"}
              />
            </div>
          )}
          {folderListView && listData?.length > 0 && (
            <LoganTable
              onClickRow={onClickDoc}
              tableColumns={folderListTableColumns(setListData, listData)}
              listData={listData}
            />
          )}
          {!folderListView && folderList?.length > 0 && (
            <div className="grid grid-cols-6 gap-y-5 gap-x-6  mt-5">
              {folderList.map((folder, index) => {
                return (
                  <DocFolder
                    onClickFolder={onClickFolder}
                    nonClient
                    key={index}
                    folder={folder}
                  />
                );
              })}
            </div>
          )}
        </div>
        {!folderListView && documentList?.length > 0 && (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold text-black ">Documents</h2>
              <Sort
                onClickSort={(sortOrder) => {
                  setListData(
                    sortStringTableList(listData, sortOrder, "title")
                  );
                }}
                title={"Name"}
              />
            </div>
            <div className="grid grid-cols-5 gap-y-7 gap-x-6 mt-5">
              {documentList.map((file, index) => {
                return (
                  <DocFile
                    onClickDoc={onClickDoc}
                    doc={file}
                    nonClient
                    key={index}
                  />
                );
              })}
            </div>
          </div>
        )} */}

        <Directory
          foldersList={folderData?.sub_projects}
          documentsList={folderData?.documents}
          slug={slug}
        />
      </div>
    </main>
  );

  // function onClickFolder(folder) {
  //   router.push(`${pathname}/${folder.id}`);
  // }
  // function onClickDoc(doc) {
  //   appDispatch(folderNavigationAction.setBreadCrumbs(slug));
  //   router.push(`/dashboard/doc-edit/${doc.id}`);
  // }
}

export default Page;
