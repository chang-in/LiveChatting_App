import { createContext } from "react";
import { Layout, Flex } from "antd";
const { Header, Footer, Sider, Content } = Layout;

const ChatRoomContext = createContext("채팅방 정보를 가져오지 못함");

export default function Structure({ sidebarcontent, maincontent }) {
  return (
    <Flex gap="middle" wrap="wrap">
      <Layout className="App">
        <Header className="header"></Header>
        <Layout>
          <Sider
            trigger={null}
            className="sider"
            width="20%"
            breakpoint="lg"
            collapsedWidth="0"
          >
            {sidebarcontent}
          </Sider>
          <Content>{maincontent}</Content>
          <Sider
            trigger={null}
            className="sider"
            width="20%"
            breakpoint="lg"
            collapsedWidth="0"
          >
            {sidebarcontent}
          </Sider>
        </Layout>
        <Footer className="footer"></Footer>
      </Layout>
    </Flex>
  );
}
