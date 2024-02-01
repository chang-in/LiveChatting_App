import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout, Flex } from "antd";
import Screen from "./components/screen";
import Test from "./components/test";
const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <Flex gap="middle" wrap="wrap">
      <Layout className="App">
        <Header className="header">Header</Header>
        <Layout>
          <Sider
            className="sidebar"
            width="25%"
            breakpoint="lg"
            collapsedWidth="0"
          >
            Sider
          </Sider>
          <Content className="body">
            {/* <Test /> */}
            {/* <Socketio /> */}
            <Screen />
            {/* <Chats /> */}
          </Content>
        </Layout>
        <Footer className="footer">Footer</Footer>
      </Layout>
    </Flex>
  );
}

export default App;
