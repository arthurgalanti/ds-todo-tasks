import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: 60px;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-light);
  margin-left: 250px;
  width: calc(100% - 250px);
  min-height: calc(100vh - 60px);
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const Layout = ({ children, onSearch }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <LayoutContainer>
      <Header 
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
        onSearch={onSearch}
      />
      <MainContent>
        <Sidebar 
          mobileOpen={mobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        <ContentArea onClick={() => mobileMenuOpen && toggleMobileMenu()}>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;