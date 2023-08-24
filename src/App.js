import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

export default function App() {
  const [addFriends, setAddFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFriendForm() {
    setShowAddFriend(show => !show)
  }

  function handleAddFriend(friend) {
    setAddFriends(friends => [...friends, friend]);
    setShowAddFriend((current) => !current);
  }

  function selectFriend(friend) {
    setSelectedFriend(friend);
  }

  return <div className="app">
    <div className="sidebar">
      <FriendsList
        friends={addFriends}
        selectFriend={selectFriend}
        selectedFriend={selectedFriend}
      />

      {showAddFriend && <FormAddFriend
        handleAddFriend={handleAddFriend} />}

      <Button
        onClick={handleShowFriendForm}>
        {showAddFriend ? "Close" : "Add Friend"}
      </Button>
    </div>

    {selectedFriend && <FormSplitBill
      selectedFriend={selectedFriend} />}
  </div>
}

function FriendsList({ friends, selectFriend, selectedFriend }) {
  return <ul>
    {
      friends.map(friend =>
        <Friend
          friend={friend}
          key={friend.id}
          selectFriend={selectFriend}
          selectedFriend={selectedFriend}
        />
      )
    }
  </ul>
}

function Friend({ friend, selectFriend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return <li className={isSelected ? "selected" : ""}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>

    {friend.balance < 0 && <p className="red">{`You owe ${friend.name} $${Math.abs(friend.balance)}`}</p>}

    {friend.balance === 0 && <p>{`You and ${friend.name} are even`}</p>}

    {friend.balance > 0 && <p className="green">{`${friend.name} owes you $${Math.abs(friend.balance)}`}</p>}

    <Button onClick={() => selectFriend(friend)}>{isSelected ? "Close" : "Select"}</Button>
  </li>
}


function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");


  function makeNewFriend(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    }

    handleAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return <form className="form-add-friend" onSubmit={makeNewFriend}>

    <label>👯Friend name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)} />

    <label>📷 Image URL</label>
    <input
      type="text"
      value={image}
      onChange={e => setImage(e.target.value)} />

    <Button>Add</Button>
  </form>
}

function FormSplitBill({ selectedFriend }) {
  const [billValue, setBillValue] = useState(" ");
  const [yourExpense, setYourExpense] = useState(" ");
  const friendExpense = billValue ? billValue - yourExpense : "";
  const [whoPaying, setWhoPaying] = useState("user");

  return <form className="form-split-bill">
    <h2>Split a bill with {selectedFriend.name}</h2>

    <label>💰 Bill Value</label>
    <input
      type="number"
      value={billValue}
      onChange={(e) => setBillValue(Number(e.target.value))}></input>

    <label>👨 Your expense</label>
    <input
      type="number"
      value={yourExpense}
      onChange={(e) => setYourExpense(Number(e.target.value) > billValue ? yourExpense : Number(e.target.value))}></input>

    <label>👯 {selectedFriend.name}'s expense</label>
    <input type="number" value={friendExpense} disabled></input>

    <label>🤑 Who is paying the bill ?</label>
    <select
      value={whoPaying}
      onChange={(e) => setWhoPaying(e.target.value)}>
      <option value="user">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>
    <Button>Split Bill</Button>


  </form>
}