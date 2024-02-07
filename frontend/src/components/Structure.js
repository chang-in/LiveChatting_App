import { createContext } from "react";
import { Layout, Flex } from "antd";
const { Header, Footer, Sider, Content } = Layout;

const ChatRoomContext = createContext("채팅방 정보를 가져오지 못함");

export default function Structure({ sidebarcontent, maincontent }) {
  return (
    <Flex gap="middle" wrap="wrap">
      <Layout className="App">
        <Header className="header">Header</Header>
        <Layout>
          <Sider
            className="sider"
            width="25%"
            breakpoint="lg"
            collapsedWidth="0"
          >
            {sidebarcontent}
          </Sider>
          <Content className="content">{maincontent}</Content>
        </Layout>
        <Footer className="footer">Footer</Footer>
      </Layout>
    </Flex>
  );
}
