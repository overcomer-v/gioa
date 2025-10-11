import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/databaseManager/useProfile";
import { Spinner } from "../../components/Spinners";

export function Users() {
  const { fetchAllUserProfiles, users } = useProfile();

  useEffect(() => {
    fetchAllUserProfiles();
  }, []);

  return (
    <div className=" flex flex-col gap-4 px-4 page-animation">
      <div className="flex justify-between items-center mb-4">
        <h1 className="flex items-center gap-2">
          <i className="fa fa-user text-admin_primary"></i>
          <span className="text-2xl font-medium">Users</span>
        </h1>
      
      </div>
     <div className="overflow-x-auto w-full">
       {users.length != 0 ? (
        <UsersTable users={users} />
      ) : (
        <div className=" m-auto mt-8">
          {" "}
          <Spinner></Spinner>
        </div>
      )}
     </div>
    </div>
  );
}

function UsersTable({ users }) {
  return (
    <table className="[&_th]:text-left [&_td]:text-left min-w-[860px]">
      <thead className="">
        <tr className="[&_th]:py-3 bg-neutral-200 [&_th]:font-medium border-b-2 border-neutral-300">
          <th className="pl-6">SN</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th className="">Joined At</th>
         
        </tr>
      </thead>
      <tbody className="[&_td]:py-4 [&_td]:text-sm">
        {users.map((user, index) => (
          <tr key={user.id} className="border-b-2 border-neutral-300">
            <td className="pl-6">{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{"user"}</td>
            <td className="pr-6">
              {new Date(user.created_at).toLocaleString()}
            </td>
            {/* <button className="bg-primary text-xs px-2 m-4 py-2 rounded-md text-white">
              <i className=" fa fa-pen align-middle mr-1"></i>
              <span className="">edit</span>
            </button>{" "}
            <button className="bg-red-700 text-xs px-2 m-4 py-2 rounded-md text-white">
              <i className=" fa fa-times align-middle mr-1"></i>
              <span className="">remove</span>
            </button> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
