import { Route, Routes } from "react-router-dom";
import { Layout, Flex } from "antd";
import Chat from "./components/chat";
import Screen from "./components/screen";
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
            <Screen />
            {/* <Chat /> */}
          </Content>
        </Layout>
        <Footer className="footer">Footer</Footer>
      </Layout>
    </Flex>
  );
}

export default App;
