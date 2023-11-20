import "./Styles/UserDetails.css";

const UserDetails = ({ userImg, username, userid }) => {
  return (
    <div className="userdetails">
      <div className="grid">
        <div className="userImg">
          <img src={userImg} alt="" />
        </div>
        <div>
          <div className="name">{username}</div>
          <div className="id">{userid}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
