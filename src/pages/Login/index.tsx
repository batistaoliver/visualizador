import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./index.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(e:any) {
    e.preventDefault();
  }

  return (
    <div className="Login" align = 'center'>
      <Form onSubmit={handleSubmit} >
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control style={{ width: '30rem' }}
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group  controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control style={{ width: '30rem' }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block style={{ width: '30rem' }} type="submit" disabled={!validateForm()}>
          Login
        </Button>
      </Form>
    </div>
  );
}