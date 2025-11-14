import React, { useState } from "react";

function UserForm({ onSubmit, users }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const isNew = !users.includes(name);
        onSubmit(name, isNew);
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <h2>Enter your name</h2>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                style={{ padding: 10, fontSize: 18, borderRadius: 5, border: "1px solid #aaa" }}
            />
            <br />
            <button type="submit" style={{ marginTop: 20, padding: 10, fontSize: 16 }}>
                Continue
            </button>
        </form>
    );
}

export default UserForm;
