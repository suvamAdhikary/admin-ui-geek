import Table from "@/components/Table";
import {
  IMember,
  deleteHandlerProps,
  editHandlerProps,
} from "@/utils/Interfaces";
import { stringConstants } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";

interface IHome {
  members: IMember[];
  error: string;
}

function Home({ members }: IHome) {
  const [memberList, setMemberList] = useState<IMember[]>([]);
  const [pageNo, setPageNo] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAllCurrentPage, setSelectAllCurrentPage] =
    useState<boolean>(false);
  const [deletedIdList, setDeletedIdList] = useState<string[]>([]);
  const [paginationList, setPaginationList] = useState<number[]>([1]);

  const pageRef = useRef(1);

  // A function to set search key and action
  const handleSearch = (key: string) => {
    setSearchKey(key);
    setAction("SEARCH");
  };

  // A function to select or deselect a member
  const handleSelection = (memberId: string) => {
    let updatedSelectionList = selectedMembers;
    if (selectedMembers?.indexOf(memberId) >= 0) {
      updatedSelectionList = selectedMembers?.filter(
        (member) => member !== memberId
      );
    } else {
      updatedSelectionList = [...updatedSelectionList, memberId];
    }
    if (
      updatedSelectionList?.length > 0 &&
      updatedSelectionList?.length === memberList?.length
    ) {
      setSelectAllCurrentPage(true);
    } else {
      setSelectAllCurrentPage(false);
    }
    setSelectedMembers(updatedSelectionList);
  };

  // A function to select or deselect all members from current page
  const handleAllMembersSelection = () => {
    if (selectAllCurrentPage) {
      setSelectedMembers([]);
    } else {
      const updatedSelectionList = memberList?.map((member) => member?.id);
      setSelectedMembers([...updatedSelectionList]);
    }
    setSelectAllCurrentPage((pre) => !pre);
  };

  // A function to update edited member list
  const handleEdit = ({ fieldName, value, memberId }: editHandlerProps) => {
    const updatedData = memberList.map((member) => {
      if (member?.id !== memberId) {
        return member;
      } else {
        return {
          ...member,
          [fieldName]: value,
        };
      }
    });
    setMemberList(updatedData);
  };

  // A function to update member list after deleting member
  const handleDelete = ({ memberId }: deleteHandlerProps) => {
    const updatedData = memberList.filter((member) => member?.id !== memberId);
    let updatedSelectionList = selectedMembers;
    if (selectedMembers?.indexOf(memberId) >= 0) {
      updatedSelectionList = selectedMembers?.filter(
        (member) => member !== memberId
      );
    }
    setSelectedMembers(updatedSelectionList);
    setDeletedIdList([...deletedIdList, memberId]);
    setMemberList(updatedData);
  };

  // A function to delete all selected members
  const handleDeleteMultiple = () => {
    const updatedData = memberList.filter(
      (member) => selectedMembers?.indexOf(member?.id) < 0
    );
    setDeletedIdList([...deletedIdList, ...selectedMembers]);
    setSelectAllCurrentPage(false);
    setSelectedMembers([]);
    setMemberList(updatedData);
    if (pageNo === pageRef?.current && pageNo !== 1) {
      setPageNo((pre) => pre - 1);
    }
    handlePageNumber(updatedData?.length);
    if (action === stringConstants.SEARCH && memberList?.length <= 0) {
      setSearchKey("");
      setAction("");
    }
    getPaginationList();
  };

  const handlePageNumber = (membersNo: number) => {
    pageRef.current = Math.ceil(membersNo / 10);
  };

  // Change data as per pagination and search
  const setDisplayData = () => {
    const upperLimit = action === stringConstants?.SEARCH ? 10 : pageNo * 10;
    let updatedData = members;
    if (searchKey) {
      updatedData = members.filter((member) => {
        if (
          member?.name?.toLowerCase()?.indexOf(searchKey.toLowerCase()) >= 0 ||
          member?.email?.toLowerCase()?.indexOf(searchKey.toLowerCase()) >= 0 ||
          member?.role?.toLowerCase()?.indexOf(searchKey.toLowerCase()) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    updatedData = updatedData?.filter(
      (member) => deletedIdList?.indexOf(member?.id) < 0
    );
    handlePageNumber(updatedData?.length);
    setMemberList(updatedData.slice(upperLimit - 10, upperLimit));
    if (action === stringConstants.SEARCH) {
      setPageNo(1);
      getPaginationList();
    }
  };

  // change current page number
  const handlePageChange = (pageNumber: number) => {
    setPageNo(pageNumber);
    setAction(stringConstants?.PAGE);
  };

  // get displayable page numbers in rage of 3
  const getPaginationList = () => {
    let pageNum = [];
    if (pageNo !== 1) {
      pageNum[0] = pageNo - 1;
      pageNum[1] = pageNo;
    } else {
      pageNum[0] = pageNo;
    }
    for (let i = pageNo + 1; i <= pageRef.current; i++) {
      if (pageNum?.length < 3) {
        if (i > 0) {
          pageNum.push(i);
        }
      } else {
        break;
      }
    }
    if (pageNum?.length < 3) {
      for (let i = pageNum[0] - 1; i >= 1; i--) {
        if (pageNum?.length < 3) {
          if (i > 0) {
            pageNum = [i, ...pageNum];
          }
        } else {
          break;
        }
      }
    }
    setPaginationList([...pageNum]);
  };

  // set initial data and page number and upper limit of page number
  useEffect(() => {
    handlePageNumber(members?.length);
    setMemberList(members);
    setPageNo(1);

    return () => {
      setAction("");
      setSearchKey("");
      setPageNo(0);
    };
  }, [members]);

  // to call setDisplayData function whenever page no change or searchKey change
  useEffect(() => {
    setDisplayData();
  }, [pageNo, searchKey, deletedIdList]);

  // to change action when required and to clear selection when page changes and set displayable page numbers
  useEffect(() => {
    setSelectedMembers([]);
    setSelectAllCurrentPage(false);
    getPaginationList();
  }, [pageNo]);

  return (
    <main
      className={`flex h-screen min-h-screen w-screen flex-col items-center p-24 gap-8`}
    >
      <h2 className="text-4xl text-blue-500">Admin UI</h2>
      {memberList?.length > 0 || searchKey ? (
        <div className="w-5/6 h-5/6 flex flex-col gap-2">
          <input
            type="search"
            value={searchKey}
            onChange={(e) => handleSearch(e.target.value?.trim())}
            placeholder="Search by name, email or role"
            className="w-full px-3 py-1"
          />
          <Table
            members={memberList}
            selectedMembers={selectedMembers}
            isAllSelected={selectAllCurrentPage}
            editHandler={handleEdit}
            deleteHandler={handleDelete}
            selectionHandler={handleSelection}
            handleAllSelection={handleAllMembersSelection}
          />
          <section className="table__pagination--container relative">
            <button
              onClick={handleDeleteMultiple}
              className="absolute left-4 bg-red-500 text-sm py-1 px-2 rounded-md text-white"
            >
              Delete Selected
            </button>
            <nav className="pagination__buttons">
              <button
                onClick={() => handlePageChange(1)}
                disabled={pageNo === 1}
              >
                &#8810;
              </button>
              <button
                onClick={() => handlePageChange(pageNo - 1)}
                disabled={pageNo === 1}
              >
                &#8249;
              </button>
              {paginationList?.map((page) => (
                <button
                  key={page}
                  disabled={pageNo === page}
                  onClick={() => handlePageChange(page)}
                  className="pageNumber"
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pageNo + 1)}
                disabled={pageNo >= pageRef.current}
              >
                &#8250;
              </button>
              <button
                onClick={() => handlePageChange(pageRef.current)}
                disabled={pageNo >= pageRef.current}
              >
                &#8811;
              </button>
            </nav>
          </section>
        </div>
      ) : (
        <p className="text-blue-500">No Data Available</p>
      )}
    </main>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  try {
    const res = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const members = await res.json();
    return {
      props: {
        members,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        members: [],
        error: "No Data",
      },
    };
  }

  // By returning { props: { posts } }, the Home component
  // will receive `members` as a prop at build time
}

export default Home;
