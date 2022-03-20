import React from "react";
import { Container } from "semantic-ui-react";
import HeaderComponent from "./Header";
import "semantic-ui-css/semantic.min.css";
// content inside the layout will be used across the whole app
const LayoutComponent = (props) => {
  return (
    <Container>
      <HeaderComponent />
      {props.children}
    </Container>
  );
};
export default LayoutComponent;
